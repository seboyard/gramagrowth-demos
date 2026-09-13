// Funciones compartidas para meter candidatos a datos/candidatos/ desde
// cualquier origen —el bot de Hermes en production-data, un agente que llama a
// la API del panel, o un archivo a mano— con las mismas reglas:
//   - el sitio de un negocio es su dominio propio, no su ficha en un agregador;
//   - nada entra dos veces (cola + lotes);
//   - las cadenas hoteleras y el gobierno no son prospectos;
//   - los textos de oferta ajenos no se conservan: la redacción es nuestra.
// Lo usan scripts/importar-hermes.mjs y scripts/serve.mjs.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const hostDe = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return null; } };
export const slugify = (v) => String(v).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

export const AGREGADOR = /booking\.com|airbnb|tripadvisor|sernatur\.cl|yelu\.cl|yellowpages|paginasamarillas|facebook\.com|instagram\.com|google\.|chileatiende|asech\.cl|enko\.org|\.gob\.cl|subdere\.cl|chilecompra\.cl|corfo|sercotec|indap|economia\.gob|wa\.me|whatsapp\.com|linktr\.ee|tiktok\.com/i;
export const CADENA = /sheraton|marriott|hilton|accor|novotel|ibis|radisson|dreams|enjoy|andbeyond|holiday inn|hyatt|wyndham|best western|smart fit|smartfit/i;

// Segmento libre → segmento y plantilla nuestros.
export function clasificar(segment = '') {
  const s = String(segment).toLowerCase();
  if (/alojamiento|hotel|hostal|caba|camping|apart|lodge|hospedaje|bed and breakfast|turismo y alojamiento/.test(s)) return { segment: 'Turismo y alojamiento', plantilla: 'reserva-cabanas' };
  if (/barber|peluquer|salón de belleza|salon de belleza|estética|estetica|manicure/.test(s)) return { segment: 'Barberías y peluquerías', plantilla: 'reservar-hora' };
  if (/gimnasio|fitness|deporte|crossfit|yoga|pilates/.test(s)) return { segment: 'Bienestar y deporte', plantilla: 'planes-gimnasio' };
  if (/evento|banquet|salón|salon de eventos/.test(s)) return { segment: 'Eventos y banquetería', plantilla: 'cotizar-evento' };
  if (/ventana|vidri|alumin|construc|aisla|termopanel|instalaci/.test(s)) return { segment: 'Construcción e instalación', plantilla: 'cotizar-instalacion' };
  if (/restaurant|cocin|\bbar\b|caf|pizza|cervec|gastronom/.test(s)) return { segment: 'Gastronomía', plantilla: null };
  if (/tour|agencia|aventura|cabalgata|kayak|buceo|experiencia/.test(s)) return { segment: 'Turismo y experiencias', plantilla: null };
  if (/dentista|cl[ií]nica|salud|m[eé]dic|odont/.test(s)) return { segment: 'Salud (excluido por política)', plantilla: null, excluir: true };
  return { segment: segment || 'Sin clasificar', plantilla: null };
}

// Todo lo que ya conocemos, por host y por id: cola + todos los lotes.
export function conocidos(root) {
  const set = new Set();
  const cola = resolve(root, 'datos/prospectos.json');
  if (existsSync(cola)) JSON.parse(readFileSync(cola, 'utf8')).forEach((p) => { const h = hostDe(p.website); if (h) set.add(h); set.add(p.id); });
  const dir = resolve(root, 'datos', 'candidatos');
  if (existsSync(dir)) readdirSync(dir).filter((f) => f.endsWith('.json')).forEach((f) => {
    try { JSON.parse(readFileSync(resolve(dir, f), 'utf8')).forEach((c) => { const h = hostDe(c.website); if (h) set.add(h); set.add(c.id); }); } catch { /* lote ilegible */ }
  });
  return set;
}

// Normaliza un registro de cualquier origen a nuestro candidato. Devuelve
// { candidato } o { descartado: motivo }.
export function normalizar(registro, fuente) {
  const business = String(registro.business || registro.nombre || '').replace(/\s+/g, ' ').trim();
  if (!business) return { descartado: 'sinNombre' };
  const clase = clasificar(registro.segment || registro.rubro || '');
  if (clase.excluir) return { descartado: 'excluido' };

  let website = registro.website || registro.sitio || null;
  let enlaceExterno = registro.enlaceExterno || null;
  let referencia = null;
  // Una red social del negocio es un canal; una ficha en un directorio o un
  // sitio de gobierno no lo es: se guarda como referencia y nada más.
  if (website && AGREGADOR.test(website)) {
    if (/instagram\.com\/|facebook\.com\//i.test(website)) enlaceExterno = enlaceExterno || website;
    else referencia = website;
    website = null;
  }
  if (website && !/^https?:\/\//i.test(website)) website = `http://${website}`;
  const h = hostDe(website);
  if (website && !h) return { descartado: 'urlInvalida' };
  if (CADENA.test(`${business} ${h || ''}`)) return { descartado: 'cadena' };

  // Redes que vengan en texto libre ("ig:instagram.com/x; fb:facebook.com/y").
  const redes = String(registro.contact || registro.redes || '');
  const ig = redes.match(/instagram\.com\/[\w.]+/); const fb = redes.match(/facebook\.com\/[\w.]+/);
  if (!enlaceExterno && (ig || fb)) enlaceExterno = `https://${(ig || fb)[0]}`;

  const comuna = registro.comuna
    || (registro.source_name || '').match(/\(([^)]+)\)\s*$/)?.[1]
    || null;

  return {
    candidato: {
      id: slugify(`${business}-${comuna || h || fuente}`), business,
      segment: clase.segment, plantilla: clase.plantilla,
      website, enlaceExterno, sinWeb: !website,
      telefono: registro.telefono || registro.phone || null,
      email: registro.email || null,
      direccion: registro.direccion || null,
      comuna: comuna && !/sernatur|yelu|amarillas/i.test(comuna) ? comuna : null,
      pais: registro.pais || 'cl', osm: null, referencia,
      descubiertoEl: registro.found_at || new Date().toISOString().slice(0, 10),
      fuente, audit: null, estado: 'descubierto'
    }
  };
}

// Agrega registros a un lote (creándolo o extendiéndolo). Devuelve el resumen.
export function agregarCandidatos(root, lote, registros, fuente) {
  const dir = resolve(root, 'datos', 'candidatos');
  mkdirSync(dir, { recursive: true });
  const archivo = resolve(dir, `${lote}.json`);
  const existentes = existsSync(archivo) ? JSON.parse(readFileSync(archivo, 'utf8')) : [];
  const vistos = conocidos(root);
  const motivos = {};
  const agregados = [];
  for (const registro of registros) {
    const { candidato, descartado } = normalizar(registro, fuente);
    if (descartado) { motivos[descartado] = (motivos[descartado] || 0) + 1; continue; }
    const h = hostDe(candidato.website);
    if (vistos.has(candidato.id) || (h && vistos.has(h))) { motivos.conocido = (motivos.conocido || 0) + 1; continue; }
    // Sin sitio propio y sin ningún canal (teléfono, correo, red social) no hay
    // a quién escribir: no es un candidato, aunque venga de un registro.
    if (!candidato.website && !candidato.telefono && !candidato.email && !candidato.enlaceExterno) { motivos.sinCanalNiSitio = (motivos.sinCanalNiSitio || 0) + 1; continue; }
    vistos.add(candidato.id); if (h) vistos.add(h);
    existentes.push(candidato);
    agregados.push(candidato);
  }
  // Un lote vacío no se crea: sólo ensucia la lista del panel.
  if (agregados.length || existsSync(archivo)) writeFileSync(archivo, `${JSON.stringify(existentes, null, 2)}\n`, 'utf8');
  return { lote, archivo, agregados, descartados: motivos, totalLote: existentes.length };
}

// Resumen de todos los lotes, para el panel.
export function resumenLotes(root) {
  const dir = resolve(root, 'datos', 'candidatos');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => {
    let items = [];
    try { items = JSON.parse(readFileSync(resolve(dir, f), 'utf8')); } catch { return null; }
    const lote = f.replace(/\.json$/, '');
    const pendientes = items.filter((c) => c.estado !== 'promovido' && c.estado !== 'duplicado');
    return {
      lote, total: items.length,
      conSitio: items.filter((c) => c.website).length,
      auditados: items.filter((c) => c.audit).length,
      redactados: pendientes.filter((c) => c.findings && c.subject && c.email).length,
      promovidos: items.filter((c) => c.estado === 'promovido').length,
      fuentes: [...new Set(items.map((c) => c.fuente).filter(Boolean))],
      top: pendientes.sort((a, b) => (b.puntaje || 0) - (a.puntaje || 0)).slice(0, 8).map((c) => ({
        id: c.id, business: c.business, website: c.website, sinWeb: !!c.sinWeb, puntaje: c.puntaje ?? null,
        razones: c.razones || [], comuna: c.comuna, redactado: !!(c.findings && c.subject && c.email),
        canal: c.contact?.type || (c.email ? 'email' : c.telefono ? 'phone' : c.enlaceExterno ? 'instagram' : 'none')
      }))
    };
  }).filter(Boolean).sort((a, b) => b.lote.localeCompare(a.lote));
}
