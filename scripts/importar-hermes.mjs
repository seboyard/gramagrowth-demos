// Importa el prospectos.json que genera el agente de Hermes (repo
// seboyard/production-data) como un lote de candidatos, para que pase por el
// mismo camino que todo lo demás: prospectar-lote.mjs → redacción → promover.mjs.
//
// Uso: node scripts/importar-hermes.mjs <ruta-al-prospectos.json> [nombre-lote]
//
// Qué se toma: nombre, sitio, segmento, fuente. Qué se descarta: los textos de
// "oferta" (prometen SEO, Ads y precios que no son nuestros), los enlaces a
// agregadores (SERNATUR, Booking, redes: no son el sitio del negocio), las
// cadenas hoteleras y todo lo que ya esté en la cola o en otro lote.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [origen, nombreLote] = process.argv.slice(2);
if (!origen) { console.error('Uso: node scripts/importar-hermes.mjs <prospectos.json> [lote]'); process.exit(1); }
const root = resolve(process.cwd());
const hoy = new Date().toISOString().slice(0, 10);
const lote = nombreLote || `hermes-import-${hoy}`;

const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return null; } };
const slugify = (v) => v.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const AGREGADOR = /booking\.com|airbnb|tripadvisor|sernatur\.cl|yelu\.cl|yellowpages|paginasamarillas|facebook\.com|instagram\.com|google\.|chileatiende|asech\.cl|enko\.org|\.gob\.cl|subdere\.cl|chilecompra\.cl|corfo|sercotec|indap|economia\.gob/i;
const CADENA = /sheraton|marriott|hilton|accor|novotel|ibis|radisson|dreams|enjoy|andbeyond|holiday inn|hyatt|wyndham|best western/i;

// Segmento de Hermes → segmento y plantilla nuestros.
function clasificar(segment = '') {
  const s = segment.toLowerCase();
  if (/alojamiento|hotel|hostal|caba|camping|apart|lodge|hospedaje|bed and breakfast/.test(s)) return { segment: 'Turismo y alojamiento', plantilla: 'reserva-cabanas' };
  if (/gimnasio|fitness|deporte/.test(s)) return { segment: 'Bienestar y deporte', plantilla: 'planes-gimnasio' };
  if (/evento|banquet|salón/.test(s)) return { segment: 'Eventos y banquetería', plantilla: 'cotizar-evento' };
  if (/ventana|vidri|alumin|construc|aisla/.test(s)) return { segment: 'Construcción e instalación', plantilla: 'cotizar-instalacion' };
  if (/restaurant|cocin|bar|caf|pizza|cervec/.test(s)) return { segment: 'Gastronomía', plantilla: null };
  if (/tour|agencia|aventura|cabalgata|kayak|buceo|turismo/.test(s)) return { segment: 'Turismo y experiencias', plantilla: null };
  if (/dentista|cl[ií]nica|salud|m[eé]dic/.test(s)) return { segment: 'Salud (excluido por política)', plantilla: null, excluir: true };
  return { segment: segment || 'Sin clasificar', plantilla: null };
}

const conocidos = new Set();
JSON.parse(readFileSync(resolve(root, 'datos/prospectos.json'), 'utf8')).forEach((p) => { const h = host(p.website); if (h) conocidos.add(h); });
const candidatosDir = resolve(root, 'datos', 'candidatos');
mkdirSync(candidatosDir, { recursive: true });
readdirSync(candidatosDir).filter((f) => f.endsWith('.json')).forEach((f) => {
  JSON.parse(readFileSync(resolve(candidatosDir, f), 'utf8')).forEach((c) => { const h = host(c.website); if (h) conocidos.add(h); });
});

const entrada = JSON.parse(readFileSync(resolve(origen), 'utf8'));
const motivos = { agregador: 0, cadena: 0, conocido: 0, excluido: 0, duplicadoInterno: 0, sinSitio: 0 };
const salida = [];
const vistos = new Set();

for (const p of entrada) {
  const h = host(p.website);
  if (!h) { motivos.sinSitio += 1; continue; }
  if (AGREGADOR.test(p.website)) { motivos.agregador += 1; continue; }
  if (CADENA.test(`${p.business} ${h}`)) { motivos.cadena += 1; continue; }
  if (conocidos.has(h)) { motivos.conocido += 1; continue; }
  if (vistos.has(h)) { motivos.duplicadoInterno += 1; continue; }
  const clase = clasificar(p.segment);
  if (clase.excluir) { motivos.excluido += 1; continue; }
  vistos.add(h);

  // La fuente de Hermes trae la comuna dentro del nombre de la fuente
  // ("sernatur (Puerto Varas)", "sernatur.cl (...) Pucón").
  const comuna = (p.source_name || '').match(/\(([^)]+)\)\s*$/)?.[1] || (p.source_name || '').split(')').pop().trim() || null;
  let fichaSernatur = null;
  try { const c = typeof p.contact === 'string' ? JSON.parse(p.contact) : p.contact; if (/sernatur\.cl/.test(c?.label || c?.value || '')) fichaSernatur = c.label || c.value; } catch { /* sin ficha */ }

  salida.push({
    id: slugify(`${p.business}-${comuna || h}`), business: p.business.replace(/\s+/g, ' ').trim(),
    segment: clase.segment, plantilla: clase.plantilla,
    website: /^https?:\/\//.test(p.website) ? p.website : `http://${p.website}`, enlaceExterno: null, sinWeb: false,
    telefono: null, email: null, direccion: null, comuna: comuna && !/sernatur|yelu|amarillas/i.test(comuna) ? comuna : null, pais: 'cl',
    osm: null, fichaSernatur,
    descubiertoEl: p.found_at || hoy, fuente: `hermes:${p.source_name || 'desconocida'}`,
    // Lo que Hermes escribió como oferta no se conserva: no cumple OFFERS.md.
    audit: null, estado: 'descubierto'
  });
}

const destino = resolve(candidatosDir, `${lote}.json`);
if (existsSync(destino)) { console.error(`Ya existe ${destino}. Elige otro nombre de lote.`); process.exit(1); }
writeFileSync(destino, `${JSON.stringify(salida, null, 2)}\n`, 'utf8');
console.log(`${entrada.length} registros de Hermes → ${salida.length} candidatos nuevos.`);
console.log('Descartados:', motivos);
console.log(`Lote: datos/candidatos/${lote}.json`);
console.log(`Siguiente paso: node scripts/prospectar-lote.mjs ${lote}`);
