import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { auditUrl } from '../scripts/auditor.mjs';

const root = resolve(process.cwd());
const required = [
  'index.html',
  'styles.css',
  'kit/index.html',
  'kit/app.js',
  'prospectar/index.html',
  'prospectar/app.js',
  'prospectar/styles.css',
  'scripts/serve.mjs',
  'scripts/auditor.mjs',
  'datos/prospectos.json',
  'docs/OFFERS.md',
  'docs/REVENUE_SPRINT.md',
  'plantillas/landing-prospecto/index.html',
  'plantillas/landing-prospecto/config.js',
  'plantillas/reserva-cabanas/index.html',
  'plantillas/reserva-cabanas/config.js',
  'plantillas/reserva-cabanas/app.js',
  'plantillas/reserva-cabanas/README.md',
  'plantillas/cotizar-evento/index.html',
  'plantillas/cotizar-evento/config.js',
  'plantillas/cotizar-evento/app.js',
  'plantillas/cotizar-evento/README.md',
  'plantillas/planes-gimnasio/index.html',
  'plantillas/planes-gimnasio/config.js',
  'plantillas/planes-gimnasio/app.js',
  'plantillas/planes-gimnasio/README.md',
  'plantillas/cotizar-instalacion/index.html',
  'plantillas/cotizar-instalacion/config.js',
  'plantillas/cotizar-instalacion/app.js',
  'plantillas/cotizar-instalacion/README.md',
  'plantillas/reservar-hora/index.html',
  'plantillas/reservar-hora/config.js',
  'plantillas/reservar-hora/app.js',
  'plantillas/reservar-hora/README.md',
  'scripts/descubrir.mjs',
  'scripts/prospectar-lote.mjs',
  'scripts/promover.mjs',
  'hermes/skills/gramagrowth-prospector/SKILL.md',
  'hermes/profiles/grama/SOUL.md',
  'hermes/cron/prospeccion-semanal.md',
  'hermes/instalar.ps1',
  'scripts/nueva-demo.mjs',
  'scripts/priorizar.mjs',
  'scripts/importar-hermes.mjs',
  'scripts/lib-candidatos.mjs',
  'scripts/sincronizar-hermes.mjs',
  'scripts/panel-clave.mjs',
  'prospectar/login.html',
  'hermes/scripts/sincronizar_gramagrowth.py',
  'scripts/capturar-demos.ps1',
  'scripts/publicar-demos.ps1',
  'hermes/briefs/demo-alojamiento.md',
  'docs/REVISION_PROSPECTOS_HERMES.md',
  'docs/PRIORIDAD.md',
  'clientes/valdilum/config.js',
  'clientes/tecalum-valdivia/config.js',
  'clientes/hotel-encanto-del-rio/config.js',
  'clientes/hostal-del-muelle/config.js',
  'docs/PROSPECCION_AUTOMATIZADA.md',
  'presentacion/index.html',
  'presentacion/app.js',
  'presentacion/styles.css',
  'docs/RESCATE_TEMPORADA.md',
  'assets/logo-gramagrowth.png'
];

for (const file of required) {
  const path = resolve(root, file);
  if (!existsSync(path) || !statSync(path).isFile()) throw new Error(`Falta ${file}`);
}

const site = readFileSync(resolve(root, 'index.html'), 'utf8');
const kit = readFileSync(resolve(root, 'kit/index.html'), 'utf8');
const kitApp = readFileSync(resolve(root, 'kit/app.js'), 'utf8');
const prospectApp = readFileSync(resolve(root, 'prospectar/app.js'), 'utf8');
const server = readFileSync(resolve(root, 'scripts/serve.mjs'), 'utf8');
const offers = readFileSync(resolve(root, 'docs/OFFERS.md'), 'utf8');
const htmlFiles = ['index.html', 'kit/index.html', 'prospectar/index.html',
  'plantillas/landing-prospecto/index.html', 'plantillas/reserva-cabanas/index.html',
  'plantillas/cotizar-evento/index.html', 'plantillas/planes-gimnasio/index.html',
  'plantillas/cotizar-instalacion/index.html', 'plantillas/reservar-hora/index.html'];

// --- Claims comerciales ---
const forbiddenPublicClaims = [
  'crecimiento exponencial garantizado',
  '+1.000.000 seguidores',
  '+100 clientes actuales',
  '400 - 800 seguidores'
];
for (const claim of forbiddenPublicClaims) {
  if (site.toLowerCase().includes(claim.toLowerCase())) {
    throw new Error(`La landing reutiliza un claim antiguo no verificado: ${claim}`);
  }
}
for (const expected of ['Landing de consultas', '$320.000 CLP', '@gramagrowth']) {
  if (!site.includes(expected)) throw new Error(`La landing no contiene: ${expected}`);
}
if (!offers.includes('**No incluye:**')) throw new Error('Las ofertas no declaran límites.');

// --- Kit y OFFERS.md dicen lo mismo ---
// Cada producto y extra que el kit puede cotizar tiene que existir en OFFERS.md
// con el mismo precio. Es lo que evita que la propuesta impresa prometa algo que
// el documento de alcance no define, o al revés.
const clpText = (value) => `$${Number(value).toLocaleString('es-CL')}`;
const kitItems = [...kitApp.matchAll(/name: '([^']+)',\s*price: (\d+)/g)]
  .map((match) => ({ name: match[1], price: Number(match[2]) }));
if (kitItems.length < 8) throw new Error('El kit declara menos productos y extras de los esperados.');
for (const item of kitItems) {
  if (!offers.includes(item.name)) throw new Error(`El kit cotiza "${item.name}" pero OFFERS.md no lo define.`);
  if (!offers.includes(clpText(item.price))) {
    throw new Error(`El kit cotiza "${item.name}" a ${clpText(item.price)} y ese precio no aparece en OFFERS.md.`);
  }
}
const kitSelect = [...kit.matchAll(/<option value="([a-z]+)">/g)].map((match) => match[1]);
for (const key of ['express', 'presence', 'flow']) {
  if (!kitSelect.includes(key) && !kit.includes(`<option value="${key}" selected>`)) {
    throw new Error(`El selector del kit no ofrece el producto "${key}".`);
  }
}

// Los README de las plantillas remiten a la tabla de OFFERS.md: un precio fijado
// en un README es la forma en que los precios divergieron la primera vez.
for (const template of ['reserva-cabanas', 'cotizar-evento', 'planes-gimnasio', 'cotizar-instalacion', 'reservar-hora']) {
  const readme = readFileSync(resolve(root, `plantillas/${template}/README.md`), 'utf8');
  if (/Precio sugerido/.test(readme)) {
    throw new Error(`plantillas/${template}/README.md fija un precio propio; debe remitir a docs/OFFERS.md.`);
  }
  if (!readme.includes('Catálogo de páginas verticales')) {
    throw new Error(`plantillas/${template}/README.md no remite al catálogo de OFFERS.md.`);
  }
}

// --- Kit de propuesta ---
for (const expected of ['evidenceConfirmed', 'print-proposal', 'Problema observable 1']) {
  if (!kit.includes(expected)) throw new Error(`El kit no contiene: ${expected}`);
}
for (const expected of ['navigator.clipboard', 'localStorage', 'window.print']) {
  if (!kitApp.includes(expected)) throw new Error(`El kit no implementa: ${expected}`);
}

// --- Control de envío ---
// La cola ahora usa fetch para hablar con su propia API local. Lo que sigue prohibido
// es enviar correo por su cuenta o llamar a servicios externos desde el navegador.
const externalFetches = [...prospectApp.matchAll(/fetch\(\s*[`'"]([^`'"]*)/g)]
  .map((match) => match[1])
  .filter((target) => !target.startsWith('/api') && !target.startsWith('`/api'));
if (externalFetches.length) {
  throw new Error(`La cola sólo puede llamar a su API local. Destinos externos: ${externalFetches.join(', ')}`);
}
for (const banned of ['nodemailer', 'sendgrid', 'smtp', 'mailgun', 'trackingPixel', 'gtag(', 'analytics']) {
  if (prospectApp.toLowerCase().includes(banned.toLowerCase())) {
    throw new Error(`La cola no debe enviar correo ni rastrear: encontrado "${banned}"`);
  }
}
if (!prospectApp.includes('mailto:')) throw new Error('La cola debe abrir borradores con mailto, no enviarlos.');
if (!server.includes("listen(port, '127.0.0.1'")) throw new Error('El servidor debe escuchar sólo en localhost.');
// Acceso: la clave se guarda como hash (scrypt) y se compara en tiempo
// constante; los candidatos que llegan por API nunca entran directo a la cola.
if (!server.includes('scryptSync') || !server.includes('timingSafeEqual')) throw new Error('El login del panel debe usar hash scrypt y comparación en tiempo constante.');
if (/panel-auth\.json/.test(readFileSync(resolve(root, '.gitignore'), 'utf8')) === false) throw new Error('datos/panel-auth.json debe estar en .gitignore.');
if (!server.includes('agregarCandidatos(')) throw new Error('POST /api/candidatos debe pasar por lib-candidatos.mjs.');
const libCandidatos = readFileSync(resolve(root, 'scripts/lib-candidatos.mjs'), 'utf8');
if (/status: 'review'|prospectos\.json.*writeFileSync/.test(libCandidatos)) throw new Error('lib-candidatos.mjs no puede escribir en la cola: eso es de promover.mjs.');
if (!server.includes('filePath.startsWith(root)')) throw new Error('El servidor perdió la protección de path traversal.');

// --- Datos de prospectos ---
const prospects = JSON.parse(readFileSync(resolve(root, 'datos/prospectos.json'), 'utf8'));
if (!Array.isArray(prospects) || !prospects.length) throw new Error('datos/prospectos.json está vacío.');
for (const prospect of prospects) {
  for (const field of ['id', 'business', 'website', 'status', 'findings', 'evidence']) {
    if (!(field in prospect)) throw new Error(`El prospecto ${prospect.id || '?'} no tiene ${field}`);
  }
  if (!prospect.evidence.length && !prospect.website) {
    throw new Error(`El prospecto ${prospect.id} no declara ninguna fuente pública.`);
  }
}

// --- Motor de auditoría ---
// Un dominio inexistente debe reconocerse como tal y no como un error genérico:
// es la señal que distingue "no pude revisar" de "el sitio del negocio se cayó".
const dead = await auditUrl('https://dominio-que-no-existe-gramagrowth-test.cl');
if (dead.ok || !dead.signals.some((signal) => signal.id === 'dominio-caido')) {
  throw new Error('El auditor no detecta un dominio inexistente.');
}

// --- Plantilla de cotización de eventos ---
// Mismas garantías que la de reserva: es una muestra con datos ajenos, no
// cobra y no compromete una fecha. Además, cada valor publicado tiene que
// declarar de qué documento salió, que es lo que evita citar una tarifa
// vencida como si fuera la vigente.
const eventoConfigSource = readFileSync(resolve(root, 'plantillas/cotizar-evento/config.js'), 'utf8');
const eventoApp = readFileSync(resolve(root, 'plantillas/cotizar-evento/app.js'), 'utf8');
if (!eventoConfigSource.includes('demo:')) throw new Error('La plantilla de eventos no declara el bloque demo.');
if (!eventoConfigSource.includes('fuente:') || !eventoConfigSource.includes('leidoEl:')) {
  throw new Error('La plantilla de eventos no declara de dónde salieron los datos ni cuándo se leyeron.');
}
for (const banned of ['webpay', 'transbank', 'stripe', 'mercadopago', 'cardnumber', 'card_number', 'cvv', 'flow.cl', 'khipu']) {
  if (eventoApp.toLowerCase().includes(banned)) {
    throw new Error(`La plantilla de eventos no debe procesar pagos: encontrado "${banned}"`);
  }
}
if (!eventoApp.includes('api.whatsapp.com')) throw new Error('La plantilla de eventos no arma la solicitud por WhatsApp.');

const eventoScope = {};
new Function('window', eventoConfigSource)(eventoScope);
const eventoConfig = eventoScope.EVENTO_CONFIG;
if (!eventoConfig?.servicios?.length) throw new Error('La plantilla de eventos no declara servicios.');
for (const service of eventoConfig.servicios) {
  if (!Number.isFinite(service.minimoInvitados)) {
    throw new Error(`El servicio ${service.id} no declara mínimo de invitados.`);
  }
  if (!service.opciones?.length) throw new Error(`El servicio ${service.id} no declara opciones.`);
  for (const option of service.opciones) {
    const value = option.valorPorInvitado;
    if (value !== null && !Number.isFinite(value)) {
      throw new Error(`El servicio ${service.id} declara un valor por invitado que no es un número ni null.`);
    }
    // Un precio sin procedencia es un precio inventado esperando a ocurrir.
    if (value !== null && !('documento' in service)) {
      throw new Error(`El servicio ${service.id} publica un valor sin declarar de qué documento salió.`);
    }
  }
}

// --- Plantillas de producto: mismas garantías para todas ---
// Cada vertical debe declararse como muestra, decir de dónde salieron sus datos
// y no procesar pagos. Es lo que las hace vendibles sin generar responsabilidad.
const PAY_TERMS = ['webpay', 'transbank', 'stripe', 'mercadopago', 'cardnumber',
  'card_number', 'cvv', 'flow.cl', 'khipu'];
for (const template of ['reserva-cabanas', 'cotizar-evento', 'planes-gimnasio', 'cotizar-instalacion', 'reservar-hora']) {
  const templateConfig = readFileSync(resolve(root, `plantillas/${template}/config.js`), 'utf8');
  const templateApp = readFileSync(resolve(root, `plantillas/${template}/app.js`), 'utf8');
  if (!templateConfig.includes('demo:')) throw new Error(`${template} no declara el bloque demo.`);
  if (!templateConfig.includes('fuente:') || !templateConfig.includes('leidoEl:')) {
    throw new Error(`${template} no declara de dónde salieron los datos ni cuándo se leyeron.`);
  }
  for (const banned of PAY_TERMS) {
    if (templateApp.toLowerCase().includes(banned)) {
      throw new Error(`${template} no debe procesar pagos: encontrado "${banned}"`);
    }
  }
  if (!templateApp.includes('api.whatsapp.com')) {
    throw new Error(`${template} no arma la solicitud por WhatsApp.`);
  }
}

// --- Plantilla de cotización de instalación ---
// Su resultado principal es un alcance medido, no un precio. Lo que se controla
// es que ningún rango en pesos aparezca sin declarar de dónde salió, y que cada
// trabajo diga cómo se mide, porque de eso depende qué formulario se muestra.
const instalacionScope = {};
new Function('window', readFileSync(resolve(root, 'plantillas/cotizar-instalacion/config.js'), 'utf8'))(instalacionScope);
const instalacionConfig = instalacionScope.INSTALACION_CONFIG;
if (!instalacionConfig?.trabajos?.length) throw new Error('La plantilla de instalación no declara trabajos.');
for (const trabajo of instalacionConfig.trabajos) {
  if (!['vano', 'superficie'].includes(trabajo.medida)) {
    throw new Error(`El trabajo ${trabajo.id} debe declarar medida 'vano' o 'superficie'.`);
  }
  if (!trabajo.materiales?.length) throw new Error(`El trabajo ${trabajo.id} no declara materiales.`);
  for (const material of trabajo.materiales) {
    const rango = material.valorM2;
    if (rango === null || rango === undefined) continue;
    if (!Number.isFinite(rango.desde) || !Number.isFinite(rango.hasta) || rango.desde > rango.hasta) {
      throw new Error(`El material ${trabajo.id}/${material.id} declara un rango por m² inválido.`);
    }
    // Un rango sin procedencia es un precio inventado esperando a ocurrir.
    if (!material.referencia?.fuente) {
      throw new Error(`El material ${trabajo.id}/${material.id} publica un rango sin declarar de dónde salió.`);
    }
  }
}
const instalacionApp = readFileSync(resolve(root, 'plantillas/cotizar-instalacion/app.js'), 'utf8');
if (!instalacionApp.includes('referencial')) {
  throw new Error('La plantilla de instalación debe declarar que las medidas son referenciales.');
}

// --- Pipeline de prospección automatizada ---
// El agente redacta, pero la compuerta (promover.mjs) decide. Se comprueba que
// las reglas de OFFERS.md estén en código: nada de redes, nada de promesas,
// ningún hallazgo sin señal auditada, y siempre una salida en el correo.
const promover = readFileSync(resolve(root, 'scripts/promover.mjs'), 'utf8');
for (const rule of ['no publica', 'garantiz', 'seguidores', 'posicion', 'audit?.signals', "status: 'review'", 'responde "no"']) {
  if (!promover.includes(rule)) throw new Error(`promover.mjs perdió la regla "${rule}".`);
}
if (promover.includes("status: 'ready'")) throw new Error('promover.mjs no puede marcar prospectos como listos: eso lo decide una persona.');
const descubrir = readFileSync(resolve(root, 'scripts/descubrir.mjs'), 'utf8');
if (!/overpass-api\.de/.test(descubrir)) throw new Error('descubrir.mjs debe usar Overpass (fuente pública, sin API key).');
if (/googleapis\.com\/maps|places\.googleapis/.test(descubrir)) throw new Error('descubrir.mjs no debe depender de Google Places.');
const skill = readFileSync(resolve(root, 'hermes/skills/gramagrowth-prospector/SKILL.md'), 'utf8');
for (const rule of ['No envías', 'promover.mjs', 'audit.signals', 'Nada de redes', 'Nada de promesas']) {
  if (!skill.includes(rule)) throw new Error(`La skill del prospector perdió la regla "${rule}".`);
}
for (const script of ['scripts/descubrir.mjs', 'scripts/prospectar-lote.mjs', 'scripts/promover.mjs']) {
  const source = readFileSync(resolve(root, script), 'utf8');
  for (const banned of ['nodemailer', 'smtp', 'sendgrid', 'api.whatsapp.com/send', 'wa.me']) {
    if (source.toLowerCase().includes(banned)) throw new Error(`${script} no debe enviar mensajes: encontrado "${banned}"`);
  }
}

// --- Presentación de oferta ---
// Se imprime a PDF y va a un prospecto: no puede prometer resultados ni llevar
// enlaces a localhost, que en el computador del cliente no existen.
const deckApp = readFileSync(resolve(root, 'presentacion/app.js'), 'utf8');
const deckHtml = readFileSync(resolve(root, 'presentacion/index.html'), 'utf8');
// Se buscan URL reales, no la palabra: los comentarios del propio archivo
// explican por qué localhost no sirve, y eso no es un enlace.
const deckCode = deckApp.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|\s)\/\/.*$/gm, ' ');
if (/https?:\/\/(127\.0\.0\.1|localhost)/i.test(deckCode)) {
  throw new Error('La presentación no debe fijar enlaces a localhost.');
}
if (!deckHtml.includes('Lo que no prometemos')) {
  throw new Error('La presentación debe declarar qué no se promete.');
}
if (!deckApp.includes('public-base')) {
  throw new Error('La presentación debe permitir configurar la URL pública de las demos.');
}

// --- Referencias de archivos en HTML ---
for (const htmlFile of htmlFiles) {
  const html = readFileSync(resolve(root, htmlFile), 'utf8');
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (/^(?:https?:|#|mailto:|tel:)/.test(reference)) continue;
    const cleanReference = reference.split('#')[0].split('?')[0];
    if (!cleanReference) continue;
    const target = resolve(root, dirname(htmlFile), cleanReference);
    if (!existsSync(target)) throw new Error(`${htmlFile} referencia un archivo inexistente: ${reference}`);
  }
}

console.log(`Validación aprobada: ${required.length} archivos, ${prospects.length} prospectos y controles de envío intactos.`);
