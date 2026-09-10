import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { auditUrl } from './auditor.mjs';

const root = resolve(process.cwd());
const port = Number(process.env.GRAMAGROWTH_PORT || 4173);
const dataFile = resolve(root, 'datos', 'prospectos.json');

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
            const config = scope.RESERVA_CONFIG || scope.EVENTO_CONFIG || scope.GIMNASIO_CONFIG || {};
            business = config.negocio?.nombre || entry.name;
            source = config.demo?.fuente || null;
            // Unidades cotizables: cabañas en la vertical de hospedaje,
            // servicios en la de eventos.
            const items = config.tipos || config.planes || config.servicios || [];
            units = items.length;
            unitsLabel = config.planes ? 'plan' : config.tipos ? 'unidad' : 'servicio';
            // El plural va explícito: en español no basta con agregar una "s"
            // ("unidad" → "unidades", "plan" → "planes").
            unitsPlural = config.planes ? 'planes' : config.tipos ? 'unidades' : 'servicios';
            priced = items.some((item) => item.temporadas?.length
              || item.precio
              || (item.opciones || []).some((option) => option.valorPorInvitado !== null && option.valorPorInvitado !== undefined))
              || (config.temporadas || []).length > 0;
          } catch { /* config ilegible: se muestra igual con el nombre de carpeta */ }
        }
        return { id: entry.name, business, source, units, unitsLabel, unitsPlural, priced };
      })
      .sort((left, right) => left.business.localeCompare(right.business, 'es'));
    return sendJson(response, 200, demos);
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
