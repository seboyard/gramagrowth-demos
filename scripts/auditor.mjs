// Motor de auditoría: convierte una URL pública en señales observables y verificables.
// Sin dependencias. Cada señal debe ser algo que el dueño del negocio pueda confirmar
// mirando su propio sitio. Nada se infiere ni se inventa.

const TEMPLATE_MARKERS = [
  'lorem ipsum', 'i am slide content', 'click edit button', 'contacto@company.com',
  '@company.com', 'example.com', 'yourname', 'your name here', 'insert your',
  'john doe', 'jane doe', 'text goes here', 'add your text', 'sample text'
];

const ENGLISH_UI = [
  'contact us', 'read more', 'learn more', 'send message', 'book now',
  'our services', 'about us', 'get in touch', 'view more', 'coming soon', 'submit'
];

// Con límite de palabra: sin él, "plan" hacía match dentro de "Plana" y confundía
// la fecha de una noticia con un precio desactualizado.
const PRICE_CONTEXT = /\b(valor|valores|precio|precios|tarifa|tarifas|temporada|verano|invierno|matricula|matrícula|mensualidad|plan|planes|promoción|arancel)\b/;

const PLATFORMS = [
  [/wp-content|wp-includes/i, 'WordPress'], [/elementor/i, 'Elementor'],
  [/wix\.com|wixstatic/i, 'Wix'], [/squarespace/i, 'Squarespace'],
  [/shopify/i, 'Shopify'], [/webflow/i, 'Webflow'], [/jimdo/i, 'Jimdo']
];

// Redes y perfiles externos. Sirven para dos cosas: detectar que el negocio
// existe fuera de su web, y darle a Sebastián un canal cuando no hay correo.
// Actividad de redes: detecta si hay evidencia de uso reciente en lo que
// el sitio declara (no inventa datos de plataformas externas).
function detectSocialActivity(html) {
  const low = html.toLowerCase();
  const hasFeed = /instagram\.com\/p\/|facebook\.com\/.*\/posts\/|tiktok\.com\/@/i.test(html);
  const hasUpdate = /última actualizaci|último post|último reel|nuevos? \d+|feed\b/i.test(low);
  if (hasFeed || hasUpdate) return 'activo';
  return 'desconocido';
}

const SOCIAL_PATTERNS = [
  ['instagram', /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9._]{2,40})/i],
  ['facebook', /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([A-Za-z0-9.\-]{2,60})/i],
  ['tripadvisor', /(?:https?:\/\/)?(?:www\.)?tripadvisor\.[a-z.]{2,6}\/([A-Za-z0-9._\-]{2,80})/i],
  ['booking', /(?:https?:\/\/)?(?:www\.)?booking\.com\/hotel\/([A-Za-z0-9._\-/]{2,80})/i],
  ['airbnb', /(?:https?:\/\/)?(?:www\.)?airbnb\.[a-z.]{2,6}\/rooms\/(\d+)/i],
  ['tiktok', /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([A-Za-z0-9._]{2,40})/i],
  ['youtube', /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:c\/|@|channel\/)([A-Za-z0-9._\-]{2,60})/i]
];

// Teléfonos chilenos: móvil +56 9 XXXX XXXX y fijo con código de área.
function extractPhones(html, text) {
  const found = new Set();
  for (const match of html.matchAll(/tel:\+?([\d\s().-]{7,20})/gi)) {
    found.add(`+${match[1].replace(/\D/g, '')}`);
  }
  for (const match of text.matchAll(/\+?56[\s.-]?9[\s.-]?\d{4}[\s.-]?\d{4}/g)) {
    found.add(`+${match[0].replace(/\D/g, '')}`);
  }
  for (const match of text.matchAll(/\(?\b(?:63|64|65)\)?[\s.-]?2?\d{6,7}\b/g)) {
    const digits = match[0].replace(/\D/g, '');
    if (digits.length >= 8) found.add(`+56${digits}`);
  }
  return [...found]
    .map((phone) => phone.replace(/^\+56?56/, '+56'))
    .filter((phone) => phone.replace(/\D/g, '').length >= 10)
    .slice(0, 4);
}

const stripTags = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();

const snippet = (text, index, length, pad = 70) =>
  '…' + text.slice(Math.max(0, index - pad), index + length + pad).trim() + '…';

function detectSignals(html, finalUrl) {
  const text = stripTags(html);
  const low = text.toLowerCase();
  const year = new Date().getFullYear();
  const signals = [];
  const add = (id, severity, label, detail, evidence) =>
    signals.push({ id, severity, label, detail, evidence: evidence || null });

  // --- Años obsoletos, separando precios de copyright ---
  const seenYears = new Set();
  for (const match of text.matchAll(/\b(20[0-3]\d)\b/g)) {
    const found = Number(match[1]);
    if (found >= year || found < 2005) continue;
    const before = low.slice(Math.max(0, match.index - 70), match.index);
    const isPrice = PRICE_CONTEXT.test(before);
    const isCopyright = /©|copyright/.test(before);
    // Sólo marcar el año como visto cuando realmente emite una señal: si no, la
    // primera aparición irrelevante (la fecha de una noticia) tapaba la que importa.
    if (!isPrice && !isCopyright) continue;
    const key = `${found}:${isPrice ? 'precio' : 'copyright'}`;
    if (seenYears.has(key)) continue;
    seenYears.add(key);
    const gap = year - found;
    if (isPrice) {
      add('precio-desactualizado', 'alta',
        `Precios o temporada publicados como ${found}`,
        `Una persona que entra hoy no sabe si el valor sigue vigente (${gap} ${gap === 1 ? 'año' : 'años'} de desfase).`,
        snippet(text, match.index, 4));
    } else {
      add('copyright-antiguo', 'media',
        `El pie de página dice ${found}`,
        'Sugiere que el sitio no se actualiza, aunque el negocio siga activo.',
        snippet(text, match.index, 4));
    }
  }

  // --- Contenido de plantilla visible al público ---
  for (const marker of TEMPLATE_MARKERS) {
    const at = low.indexOf(marker);
    if (at === -1) continue;
    add('plantilla-sin-terminar', 'alta',
      `Texto de plantilla visible: "${marker}"`,
      'Contenido de ejemplo que quedó publicado. Resta confianza justo antes de contactar.',
      snippet(text, at, marker.length));
    break;
  }

  // --- Idioma mezclado en sitio en español ---
  const isSpanish = /lang=["']es/i.test(html) || /\b(nosotros|servicios|contacto|precios)\b/i.test(low);
  const englishHits = ENGLISH_UI.filter((phrase) => low.includes(phrase));
  if (isSpanish && englishHits.length) {
    const at = low.indexOf(englishHits[0]);
    add('idioma-mezclado', 'media',
      `Interfaz en inglés dentro de una página en español: ${englishHits.slice(0, 3).map((hit) => `"${hit}"`).join(', ')}`,
      'Da la impresión de una plantilla sin terminar justo en el momento de escribir.',
      snippet(text, at, englishHits[0].length));
  }

  // --- Correos en conflicto ---
  const emails = [...new Set([...html.matchAll(/[\w.+-]+@[\w-]+\.[\w.]{2,}/g)]
    .map((match) => match[0].toLowerCase())
    .filter((email) => !/\.(png|jpe?g|gif|svg|webp|css|js)$/.test(email) && !email.includes('@2x')))];
  const domains = new Set(emails.map((email) => email.split('@')[1]));
  if (domains.size > 1) {
    add('correos-en-conflicto', 'alta',
      `Publica ${emails.length} correos de ${domains.size} dominios distintos`,
      'Las consultas se reparten entre bandejas, o una de ellas ya no se revisa.',
      emails.join(' · '));
  }

  // --- Canal de contacto ---
  if (!/wa\.me|api\.whatsapp|whatsapp:\/\//i.test(html)) {
    add('sin-whatsapp', 'media', 'No hay enlace a WhatsApp',
      'Es el canal que más usa la gente para consultar un servicio local desde el celular.');
  }
  // Un correo publicado como texto plano cuenta como canal, aunque no sea un mailto.
  if (!/<form[\s\S]*?>/i.test(html) && !/mailto:/i.test(html) && !emails.length) {
    add('sin-formulario', 'alta', 'No hay formulario ni correo de contacto visible',
      'La única forma de contactar exige llamar o buscar por otro canal.');
  }

  // --- Técnicos ---
  if (!/name=["']viewport["']/i.test(html)) {
    add('sin-viewport', 'alta', 'La página no declara viewport móvil',
      'Se ve reducida y difícil de leer en celular, que es donde llega la mayoría.');
  }
  if (finalUrl.startsWith('http://')) {
    add('sin-https', 'alta', 'El sitio no usa HTTPS',
      'El navegador puede mostrar una advertencia de "no seguro" antes de que lean nada.');
  }
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
  if (!title || title.length < 12 || /^(home|inicio|sitio web|untitled|my site)$/i.test(title)) {
    add('titulo-debil', 'media', title ? `Título genérico: "${title}"` : 'La página no tiene título',
      'Es lo que aparece en Google y en la pestaña del navegador.');
  }
  if (!/name=["']description["']/i.test(html)) {
    add('sin-descripcion', 'baja', 'No hay meta descripción',
      'Google inventa el resumen que ve la gente al buscar el negocio.');
  }

  // --- Presencia en redes ---
  const socials = {};
  for (const [network, pattern] of SOCIAL_PATTERNS) {
    const match = html.match(pattern);
    if (match) socials[network] = match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
  }
  const socialActivity = detectSocialActivity(html);
  const ownSocials = ['instagram', 'facebook', 'tiktok', 'youtube'].filter((network) => socials[network]);
  if (ownSocials.length && socialActivity === 'desconocido') {
    add('redes-sin-actividad', 'baja',
      'Tiene redes públicas enlazadas (Instagram/Facebook/TikTok) sin evidencia de actividad reciente en su sitio',
      'Oportunidad de ofrecer gestión de redes: si hay perfil pero no se actualiza, un servicio de contenido y frecuencia valdría.');
  }
  if (!ownSocials.length) {
    add('sin-redes', 'baja', 'El sitio no enlaza ninguna red social',
      'Quien quiere ver fotos recientes o confirmar que el negocio sigue activo no tiene dónde mirar.');
  }
  if (socials.booking && !socials.instagram && !socials.facebook) {
    add('solo-plataforma', 'media', 'Aparece enlazado a Booking pero sin redes propias',
      'Toda la relación con el huésped pasa por una plataforma que cobra comisión.');
  }

  const phones = extractPhones(html, text);
  if (!phones.length && !emails.length) {
    add('sin-telefono-ni-correo', 'alta', 'No publica teléfono ni correo',
      'Sólo se puede contactar por formulario o red social.');
  }

  const platform = PLATFORMS.find(([pattern]) => pattern.test(html))?.[1] ?? null;
  return {
    signals,
    meta: {
      title, platform, emails, phones, socials,
      socialActivity: detectSocialActivity(html),
      bytes: html.length,
      hasWhatsapp: /wa\.me|api\.whatsapp/i.test(html)
    }
  };
}

const WEIGHT = { alta: 3, media: 2, baja: 1 };

export async function auditUrl(rawUrl, { timeout = 25000 } = {}) {
  const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  try {
    // UA de navegador real: varios sitios con WAF devuelven 403 a un agente
    // identificado como bot, y se perdían hallazgos que un visitante sí ve.
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
        'Accept-Language': 'es-CL,es;q=0.9'
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(timeout)
    });
    const html = await response.text();
    const { signals, meta } = detectSignals(html, response.url);
    if (response.status >= 400) {
      signals.unshift({
        id: 'sitio-con-error', severity: 'alta',
        label: `El sitio responde con error HTTP ${response.status}`,
        detail: 'Quien busque el negocio hoy no encuentra información.', evidence: null
      });
    }
    return {
      url, finalUrl: response.url, status: response.status, ok: true, error: null,
      auditedAt: new Date().toISOString().slice(0, 10),
      score: signals.reduce((sum, signal) => sum + WEIGHT[signal.severity], 0),
      signals, meta
    };
  } catch (error) {
    // fetch envuelve el fallo de DNS: el motivo real viaja en error.cause.
    const cause = error.cause?.code || error.cause?.message || '';
    const dead = /ENOTFOUND|EAI_AGAIN|getaddrinfo|Could not resolve/i.test(`${error.message} ${cause}`);
    return {
      url, finalUrl: url, status: 0, ok: false,
      error: dead ? 'El dominio no existe (NXDOMAIN)' : error.message,
      auditedAt: new Date().toISOString().slice(0, 10),
      score: dead ? 12 : 0,
      signals: dead ? [{
        id: 'dominio-caido', severity: 'alta', label: 'El dominio ya no existe',
        detail: 'El sitio no carga para nadie. Si el negocio sigue operando es urgente, y hay que contactarlo por otro canal.',
        evidence: null
      }] : [],
      meta: { title: '', platform: null, emails: [], phones: [], socials: {}, bytes: 0, hasWhatsapp: false }
    };
  }
}
