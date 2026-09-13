import { execFile } from 'node:child_process';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { auditUrl } from './auditor.mjs';
import { agregarCandidatos, resumenLotes } from './lib-candidatos.mjs';
import { sincronizarHermes } from './sincronizar-hermes.mjs';

const root = resolve(process.cwd());
const port = Number(process.env.GRAMAGROWTH_PORT || 4173);
const dataFile = resolve(root, 'datos', 'prospectos.json');

// ── Acceso al panel ────────────────────────────────────────────────────────
// Opcional: si existe datos/panel-auth.json (lo crea scripts/panel-clave.mjs),
// las herramientas y la API piden clave. Sin ese archivo, el servidor sigue
// abierto sólo en localhost, como siempre. Las sesiones viven en memoria: al
// reiniciar el servidor hay que entrar de nuevo, que para una herramienta local
// es lo razonable.
const authFile = resolve(root, 'datos', 'panel-auth.json');
const sesiones = new Set();
function leerAuth() {
  if (!existsSync(authFile)) return null;
  try { return JSON.parse(readFileSync(authFile, 'utf8')); } catch { return null; }
}
function claveCorrecta(clave) {
  const auth = leerAuth();
  if (!auth) return false;
  const esperado = Buffer.from(auth.hash, 'hex');
  const recibido = scryptSync(String(clave || ''), auth.salt, esperado.length);
  return esperado.length === recibido.length && timingSafeEqual(esperado, recibido);
}
const cookieDe = (request) => Object.fromEntries((request.headers.cookie || '').split(';').map((c) => c.trim().split('=')).filter((p) => p[0]));
function sesionValida(request) {
  if (!leerAuth()) return true;                      // sin clave configurada
  const token = cookieDe(request).gg_session;
  return Boolean(token && sesiones.has(token));
}
// Los agentes no tienen navegador: usan un token de cabecera para agregar
// candidatos. Sólo vale para ese endpoint.
function tokenAgenteValido(request) {
  const auth = leerAuth();
  if (!auth) return true;
  const recibido = request.headers['x-agent-token'];
  return Boolean(recibido && auth.agentToken && recibido === auth.agentToken);
}
// Rutas de herramientas que piden sesión cuando hay clave. Las demos de
// clientes/ y las plantillas siguen abiertas: son lo que se muestra al prospecto.
const RUTAS_PROTEGIDAS = /^\/(prospectar|kit|presentacion)(\/|$)/;

function ejecutarScript(args) {
  return new Promise((accept) => {
    execFile(process.execPath, args, { cwd: root, maxBuffer: 20 * 1024 * 1024 }, (error, stdout, stderr) => {
      accept({ ok: !error, code: error?.code ?? 0, stdout: String(stdout), stderr: String(stderr) });
    });
  });
}

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

function readProspects() {
  if (!existsSync(dataFile)) return [];
  try {
    return JSON.parse(readFileSync(dataFile, 'utf8'));
  } catch (error) {
    console.error(`No se pudo leer ${dataFile}: ${error.message}`);
    return [];
  }
}

function writeProspects(prospects) {
  mkdirSync(dirname(dataFile), { recursive: true });
  writeFileSync(dataFile, `${JSON.stringify(prospects, null, 2)}\n`, 'utf8');
}

const sendJson = (response, status, payload) => {
  const body = JSON.stringify(payload);
  response.writeHead(status, { 'Content-Type': mimeTypes['.json'], 'Cache-Control': 'no-store' });
  response.end(body);
};

function readBody(request) {
  return new Promise((accept, reject) => {
    let raw = '';
    request.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) reject(new Error('Cuerpo demasiado grande'));
    });
    request.on('end', () => {
      try { accept(raw ? JSON.parse(raw) : {}); }
      catch { reject(new Error('JSON inválido')); }
    });
    request.on('error', reject);
  });
}

const slugify = (value) => value.toLowerCase().normalize('NFD')
  .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '').slice(0, 60);

async function handleApi(request, response, pathname) {
  const [, , section, id] = pathname.split('/');

  // ── Sesión ──────────────────────────────────────────────────────────────
  if (section === 'sesion' && request.method === 'GET') {
    return sendJson(response, 200, { requiereClave: Boolean(leerAuth()), autenticado: sesionValida(request) });
  }
  if (section === 'login' && request.method === 'POST') {
    const { clave } = await readBody(request);
    if (!leerAuth()) return sendJson(response, 200, { ok: true, requiereClave: false });
    if (!claveCorrecta(clave)) return sendJson(response, 401, { error: 'Clave incorrecta' });
    const token = randomBytes(24).toString('hex');
    sesiones.add(token);
    response.setHeader('Set-Cookie', `gg_session=${token}; Path=/; HttpOnly; SameSite=Strict`);
    return sendJson(response, 200, { ok: true });
  }
  if (section === 'logout' && request.method === 'POST') {
    sesiones.delete(cookieDe(request).gg_session);
    response.setHeader('Set-Cookie', 'gg_session=; Path=/; Max-Age=0');
    return sendJson(response, 200, { ok: true });
  }

  // ── Candidatos que dejan los agentes ────────────────────────────────────
  // POST acepta un lote de registros de cualquier agente (Hermes, Codex, un
  // script). Pasan por las mismas reglas que todo (lib-candidatos.mjs) y
  // quedan en datos/candidatos/agentes-<fecha>.json como "descubiertos": la
  // redacción y la compuerta siguen después. Nunca entran directo a la cola.
  if (section === 'candidatos' && request.method === 'POST') {
    if (!sesionValida(request) && !tokenAgenteValido(request)) return sendJson(response, 401, { error: 'Falta sesión o X-Agent-Token' });
    const body = await readBody(request);
    const registros = Array.isArray(body) ? body : Array.isArray(body.candidatos) ? body.candidatos : null;
    if (!registros) return sendJson(response, 400, { error: 'Envía { agente, candidatos: [...] } o una lista' });
    const agente = slugify(body.agente || request.headers['x-agent-name'] || 'agente');
    const lote = `agentes-${agente}-${new Date().toISOString().slice(0, 10)}`;
    const resumen = agregarCandidatos(root, lote, registros, `agente:${agente}`);
    return sendJson(response, 201, { lote, agregados: resumen.agregados.length, descartados: resumen.descartados, totalLote: resumen.totalLote });
  }
  // La galería de demos (/clientes/) y la URL pública son información que se
  // muestra al prospecto: siguen abiertas. Todo lo demás pide sesión.
  if (!['clientes', 'config'].includes(section) && !sesionValida(request)) {
    return sendJson(response, 401, { error: 'Sesión requerida' });
  }

  if (section === 'candidatos' && request.method === 'GET') {
    return sendJson(response, 200, resumenLotes(root));
  }
  // Trae lo que el bot de Hermes dejó en production-data y lo audita.
  if (section === 'sincronizar-hermes' && request.method === 'POST') {
    return sendJson(response, 200, await sincronizarHermes(root));
  }
  // Audita y puntúa un lote (lo que faltaba), con el script de siempre.
  if (section === 'auditar-lote' && request.method === 'POST') {
    const { lote } = await readBody(request);
    if (!/^[a-z0-9-]+$/.test(lote || '')) return sendJson(response, 400, { error: 'Lote inválido' });
    const r = await ejecutarScript([resolve(root, 'scripts', 'prospectar-lote.mjs'), lote, '--top', '5']);
    return sendJson(response, r.ok ? 200 : 500, { ok: r.ok, salida: (r.stdout + r.stderr).slice(-3000) });
  }
  // Promueve a la cola lo redactado de un lote, pasando por la compuerta.
  if (section === 'promover' && request.method === 'POST') {
    const { lote, dryRun } = await readBody(request);
    if (!/^[a-z0-9-]+$/.test(lote || '')) return sendJson(response, 400, { error: 'Lote inválido' });
    const args = [resolve(root, 'scripts', 'promover.mjs'), lote];
    if (dryRun) args.push('--dry-run');
    const r = await ejecutarScript(args);
    // promover sale con 2 cuando rechaza alguno: no es un error del servidor.
    return sendJson(response, 200, { ok: r.code !== 1, rechazos: r.code === 2, salida: (r.stdout + r.stderr).slice(-4000) });
  }

  if (section === 'auditar' && request.method === 'POST') {
    const { url } = await readBody(request);
    if (!url) return sendJson(response, 400, { error: 'Falta la URL' });
    return sendJson(response, 200, await auditUrl(url));
  }

  // Listado de demos: lee las carpetas de clientes/ y saca el nombre del negocio
  // de cada config, para que la galería se mantenga sola.
  if (section === 'clientes' && request.method === 'GET') {
    const base = resolve(root, 'clientes');
    if (!existsSync(base)) return sendJson(response, 200, []);
    const demos = readdirSync(base, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => {
        const configPath = resolve(base, entry.name, 'config.js');
        let business = entry.name;
        let source = null;
        let units = 0;
        let unitsLabel = 'unidad';
        let unitsPlural = 'unidades';
        let priced = false;
        if (existsSync(configPath)) {
          try {
            const scope = {};
            new Function('window', readFileSync(configPath, 'utf8'))(scope);
            // Cada vertical declara su propio global. La galería no necesita
            // saber cuál es: toma el que exista y lee los campos comunes.
            const config = scope.RESERVA_CONFIG || scope.EVENTO_CONFIG || scope.GIMNASIO_CONFIG || scope.INSTALACION_CONFIG || {};
            business = config.negocio?.nombre || entry.name;
            source = config.demo?.fuente || null;
            // Unidades cotizables: cabañas en la vertical de hospedaje,
            // servicios en la de eventos, trabajos en la de instalación.
            const items = config.tipos || config.planes || config.servicios || config.trabajos || [];
            units = items.length;
            unitsLabel = config.planes ? 'plan' : config.tipos ? 'unidad' : config.trabajos ? 'trabajo' : 'servicio';
            // El plural va explícito: en español no basta con agregar una "s"
            // ("unidad" → "unidades", "plan" → "planes").
            unitsPlural = config.planes ? 'planes' : config.tipos ? 'unidades' : config.trabajos ? 'trabajos' : 'servicios';
            priced = items.some((item) => item.temporadas?.length
              || item.precio
              || (item.opciones || []).some((option) => option.valorPorInvitado !== null && option.valorPorInvitado !== undefined)
              || (item.materiales || []).some((material) => material.valorM2))
              || (config.temporadas || []).length > 0;
          } catch { /* config ilegible: se muestra igual con el nombre de carpeta */ }
        }
        return { id: entry.name, business, source, units, unitsLabel, unitsPlural, priced };
      })
      .sort((left, right) => left.business.localeCompare(right.business, 'es'));
    return sendJson(response, 200, demos);
  }

  // Configuración compartida (URL pública de las demos), para que la cola y
  // la presentación lean el mismo valor en vez de guardarlo cada una.
  if (section === 'config' && request.method === 'GET') {
    const configPath = resolve(root, 'datos', 'config.json');
    if (!existsSync(configPath)) return sendJson(response, 200, {});
    try { return sendJson(response, 200, JSON.parse(readFileSync(configPath, 'utf8'))); }
    catch { return sendJson(response, 200, {}); }
  }

  if (section === 'prospectos') {
    const prospects = readProspects();

    if (request.method === 'GET') return sendJson(response, 200, prospects);

    if (request.method === 'POST') {
      const incoming = await readBody(request);
      if (!incoming.business) return sendJson(response, 400, { error: 'Falta el nombre del negocio' });
      const newId = incoming.id || slugify(incoming.business);
      if (prospects.some((prospect) => prospect.id === newId)) {
        return sendJson(response, 409, { error: 'Ya existe un prospecto con ese nombre' });
      }
      const created = {
        id: newId, business: incoming.business, segment: incoming.segment || 'Sin clasificar',
        priority: incoming.priority || 'Media', website: incoming.website || '',
        verifiedAt: new Date().toISOString().slice(0, 10),
        contact: incoming.contact || { type: 'none', value: '', label: 'Sin canal confirmado' },
        offer: incoming.offer || 'landing', opportunity: incoming.opportunity || '',
        findings: incoming.findings || [], evidence: incoming.evidence || [],
        subject: incoming.subject || '', email: incoming.email || '',
        audit: incoming.audit || null,
        // Marcado a mano: si el negocio aparece en Booking o Airbnb no es
        // observable desde su propio sitio, hay que ir a mirar y anotarlo.
        plataformas: incoming.plataformas || {},
        status: 'review', followUp: '', notes: ''
      };
      prospects.push(created);
      writeProspects(prospects);
      return sendJson(response, 201, created);
    }

    if (request.method === 'PATCH' && id) {
      const index = prospects.findIndex((prospect) => prospect.id === id);
      if (index === -1) return sendJson(response, 404, { error: 'Prospecto no encontrado' });
      const patch = await readBody(request);
      // Sólo campos que la interfaz puede editar; el resto viene de la auditoría.
      const editable = ['status', 'followUp', 'notes', 'subject', 'email', 'contact',
        'priority', 'segment', 'offer', 'opportunity', 'findings', 'audit', 'verifiedAt',
        'plataformas'];
      for (const key of editable) {
        if (key in patch) prospects[index][key] = patch[key];
      }
      writeProspects(prospects);
      return sendJson(response, 200, prospects[index]);
    }

    if (request.method === 'DELETE' && id) {
      const remaining = prospects.filter((prospect) => prospect.id !== id);
      if (remaining.length === prospects.length) return sendJson(response, 404, { error: 'No encontrado' });
      writeProspects(remaining);
      return sendJson(response, 200, { deleted: id });
    }
  }

  return sendJson(response, 404, { error: 'Endpoint desconocido' });
}

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);

  if (pathname.startsWith('/api/')) {
    try {
      await handleApi(request, response, pathname);
    } catch (error) {
      sendJson(response, 500, { error: error.message });
    }
    return;
  }

  const relativePath = normalize(pathname).replace(/^([/\\])+/, '');
  let filePath = resolve(join(root, relativePath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  // Con clave configurada, las herramientas internas piden entrar. La página
  // de login es estática y vive en /prospectar/login.html.
  if (RUTAS_PROTEGIDAS.test(pathname) && !/\/login\.html$|\.css$|\.png$|\.svg$/.test(pathname) && !sesionValida(request)) {
    response.writeHead(302, { Location: `/prospectar/login.html?volver=${encodeURIComponent(pathname)}` }).end();
    return;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }

  if (!existsSync(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  createReadStream(filePath).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`Gramagrowth disponible en http://127.0.0.1:${port}`);
  console.log(`Cola de prospección: http://127.0.0.1:${port}/prospectar/`);
  console.log(`Datos: ${dataFile}`);
});
