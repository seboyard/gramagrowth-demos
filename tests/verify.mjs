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
  'plantillas/landing-prospecto/index.html', 'plantillas/reserva-cabanas/index.html'];

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

// --- Plantilla de reserva ---
// Es una muestra construida con datos ajenos: debe declararse como tal y no
// puede confirmar reservas ni pedir pagos, que es lo que la hace vendible.
const reservaConfig = readFileSync(resolve(root, 'plantillas/reserva-cabanas/config.js'), 'utf8');
const reservaApp = readFileSync(resolve(root, 'plantillas/reserva-cabanas/app.js'), 'utf8');
if (!reservaConfig.includes('demo:')) throw new Error('La plantilla de reserva no declara el bloque demo.');
if (!reservaConfig.includes('fuente:') || !reservaConfig.includes('leidoEl:')) {
  throw new Error('La plantilla de reserva no declara de dónde salieron los datos ni cuándo se leyeron.');
}
// Términos precisos: "card" a secas hacía match con nombres de clase como unit-card.
for (const banned of ['webpay', 'transbank', 'stripe', 'mercadopago', 'cardnumber', 'card_number', 'cvv', 'flow.cl', 'khipu']) {
  if (reservaApp.toLowerCase().includes(banned)) {
    throw new Error(`La plantilla de reserva no debe procesar pagos: encontrado "${banned}"`);
  }
}
if (!reservaApp.includes('api.whatsapp.com')) throw new Error('La plantilla de reserva no arma la solicitud por WhatsApp.');

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
