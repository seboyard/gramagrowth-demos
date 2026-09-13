// Descubre negocios candidatos desde OpenStreetMap (Overpass) por zona y rubro,
// y los deja en datos/candidatos/<lote>.json para que prospectar-lote.mjs los
// audite. No usa API keys ni servicios pagados.
//
// Uso:
//   node scripts/descubrir.mjs --zona Valdivia --rubro alojamiento
//   node scripts/descubrir.mjs --zona "Región de Los Ríos" --rubro instalacion --nivel 4
//   node scripts/descubrir.mjs --zona Chile --rubro gimnasios --nivel 2
//   node scripts/descubrir.mjs --zona Cantabria --rubro alojamiento --nivel 4 --pais es
//
// --nivel es el admin_level de OSM de la zona: 8 comuna/municipio (defecto),
// 6 provincia, 4 región/comunidad autónoma, 2 país. Cuanto más grande la zona,
// más lenta la consulta: para país conviene ir región por región.
//
// Un negocio SIN sitio web también es candidato: se marca `sinWeb: true` y va al
// lote igual, porque "no tiene página" es la oportunidad más directa que hay.
// Lo que nunca hace este script es inventar un dato: sólo copia las etiquetas
// que OSM publica (nombre, web, teléfono, dirección).

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const args = Object.fromEntries(process.argv.slice(2).map((arg, index, all) => {
  if (!arg.startsWith('--')) return [];
  return [arg.slice(2), all[index + 1] && !all[index + 1].startsWith('--') ? all[index + 1] : 'true'];
}).filter((pair) => pair.length));

const zona = args.zona;
const rubro = args.rubro;
const nivel = args.nivel || '8';
const pais = args.pais || 'cl';
if (!zona || !rubro) {
  console.error('Uso: node scripts/descubrir.mjs --zona <nombre OSM> --rubro <rubro> [--nivel 8|6|4|2] [--pais cl|es]');
  process.exit(1);
}

// Cada rubro se traduce a etiquetas OSM y a la plantilla vertical que le
// corresponde. `sinWebVale` dice si un negocio sin sitio es candidato útil.
const RUBROS = {
  alojamiento: {
    segment: 'Turismo y alojamiento', plantilla: 'reserva-cabanas', sinWebVale: true,
    filtros: ['nwr["tourism"~"hotel|hostel|guest_house|chalet|apartment|motel|camp_site|alpine_hut"]']
  },
  gimnasios: {
    segment: 'Bienestar y deporte', plantilla: 'planes-gimnasio', sinWebVale: true,
    filtros: ['nwr["leisure"~"fitness_centre|sports_centre|dance"]', 'nwr["sport"~"yoga|pilates|crossfit|boxing|climbing"]']
  },
  eventos: {
    segment: 'Eventos y banquetería', plantilla: 'cotizar-evento', sinWebVale: true,
    filtros: ['nwr["amenity"="events_venue"]', 'nwr["craft"="caterer"]', 'nwr["shop"="catering"]']
  },
  instalacion: {
    segment: 'Construcción e instalación', plantilla: 'cotizar-instalacion', sinWebVale: true,
    filtros: ['nwr["shop"~"glaziery|doors|windows|trade"]', 'nwr["craft"~"glaziery|carpenter|roofer|insulation|window_construction|builder|tiler|plumber|hvac"]']
  },
  talleres: {
    segment: 'Servicios automotrices', plantilla: null, sinWebVale: true,
    filtros: ['nwr["shop"~"car_repair|tyres"]']
  },
  gastronomia: {
    segment: 'Gastronomía', plantilla: null, sinWebVale: false,
    filtros: ['nwr["amenity"~"restaurant|cafe"]', 'nwr["craft"="brewery"]']
  },
  barberias: {
    segment: 'Barberías y peluquerías', plantilla: 'reservar-hora', sinWebVale: true,
    filtros: ['nwr["shop"~"hairdresser|beauty|massage"]', 'nwr["craft"="hairdresser"]']
  }
};

const preset = RUBROS[rubro];
if (!preset) {
  console.error(`Rubro desconocido: ${rubro}. Disponibles: ${Object.keys(RUBROS).join(', ')}`);
  process.exit(1);
}

const slugify = (value) => value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

// Enlaces a redes o a portales no son "sitio propio": se guardan aparte para que
// el auditor no los trate como web del negocio, y el candidato queda como sinWeb.
const NO_ES_SITIO = /facebook\.com|instagram\.com|airbnb\.|booking\.com|wa\.me|whatsapp\.com|negocio\.site|business\.site|linktr\.ee|tiktok\.com/i;

function normalizarWeb(raw) {
  if (!raw) return { website: null, enlaceExterno: null };
  const url = raw.trim().split(/[;\s]/)[0];
  const conEsquema = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  if (NO_ES_SITIO.test(conEsquema)) return { website: null, enlaceExterno: conEsquema };
  try { return { website: new URL(conEsquema).origin + new URL(conEsquema).pathname.replace(/\/$/, '') + '/', enlaceExterno: null }; }
  catch { return { website: null, enlaceExterno: null }; }
}

// Hay comunas con homónimos en otros países (Castro existe en Chile, Italia y
// Brasil). La zona se busca dentro del país, no en todo el planeta.
const PAISES = { cl: 'Chile', es: 'España' };
const paisNombre = PAISES[pais] || PAISES.cl;
const query = `[out:json][timeout:120];
area["name"="${paisNombre}"]["boundary"="administrative"]["admin_level"="2"]->.pais;
area["name"="${zona.replace(/"/g, '')}"]["boundary"="administrative"]["admin_level"="${nivel}"](area.pais)->.a;
(
${preset.filtros.map((filtro) => `  ${filtro}["name"](area.a);`).join('\n')}
);
out tags center;`;

console.log(`Consultando OSM: zona "${zona}" (admin_level ${nivel}), rubro ${rubro}…`);

// Overpass es un servicio público compartido: devuelve 429 (demasiadas
// consultas) o 504 (saturado) con frecuencia. Se alternan dos servidores y se
// reintenta con espera creciente, en vez de fallar a la primera.
const SERVIDORES = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const dormir = (ms) => new Promise((ok) => setTimeout(ok, ms));
async function consultarOverpass() {
  let ultimo = null;
  for (let intento = 0; intento < 6; intento += 1) {
    const servidor = SERVIDORES[intento % SERVIDORES.length];
    try {
      const response = await fetch(servidor, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // Overpass pide identificarse. Es un uso legítimo y de bajo volumen.
          'User-Agent': 'gramagrowth-prospeccion/0.1 (+https://github.com/sakjdkdsw2/gramagrowth-demos)'
        },
        body: `data=${encodeURIComponent(query)}`
      });
      const body = await response.text();
      if (response.ok) return JSON.parse(body).elements || [];
      ultimo = `${servidor} respondió ${response.status}`;
    } catch (error) {
      ultimo = `${servidor}: ${error.message}`;
    }
    const espera = 15000 * (intento + 1);
    console.log(`  ${ultimo}. Reintento en ${espera / 1000}s…`);
    await dormir(espera);
  }
  console.error(`Overpass no respondió tras varios intentos (${ultimo}). Prueba más tarde.`);
  process.exit(1);
}
const elementos = await consultarOverpass();

// Dedupe contra lo que ya está en la cola y en otros lotes: un negocio ya
// contactado no puede volver a entrar como "nuevo".
const conocidos = new Set();
const prospectos = existsSync(resolve(root, 'datos/prospectos.json'))
  ? JSON.parse(readFileSync(resolve(root, 'datos/prospectos.json'), 'utf8')) : [];
prospectos.forEach((p) => { conocidos.add(p.id); if (p.website) conocidos.add(new URL(p.website).hostname.replace(/^www\./, '')); });
const candidatosDir = resolve(root, 'datos', 'candidatos');
mkdirSync(candidatosDir, { recursive: true });
// Si hoy ya se corrió esta misma zona y rubro, el lote se rehace: no se
// deduplica contra sí mismo (eso dejaba un lote vacío en la segunda corrida).
const loteHoy = `${slugify(zona)}-${rubro}-${new Date().toISOString().slice(0, 10)}.json`;
readdirSync(candidatosDir).filter((f) => f.endsWith('.json') && f !== loteHoy).forEach((f) => {
  JSON.parse(readFileSync(resolve(candidatosDir, f), 'utf8')).forEach((c) => {
    conocidos.add(c.id); if (c.website) conocidos.add(new URL(c.website).hostname.replace(/^www\./, ''));
  });
});

{
  const vistos = new Set();
  const candidatos = [];
  let omitidosConocidos = 0;
  let omitidosSinWeb = 0;

  for (const el of elementos) {
    const t = el.tags || {};
    const nombre = t.name?.trim();
    if (!nombre) continue;
    const { website, enlaceExterno } = normalizarWeb(t.website || t['contact:website'] || t.url);
    const hostname = website ? new URL(website).hostname.replace(/^www\./, '') : null;
    const id = slugify(`${nombre}-${t['addr:city'] || zona}`);
    if (vistos.has(id) || (hostname && vistos.has(hostname))) continue;
    if (conocidos.has(id) || (hostname && conocidos.has(hostname))) { omitidosConocidos += 1; continue; }
    if (!website && !preset.sinWebVale) { omitidosSinWeb += 1; continue; }
    vistos.add(id); if (hostname) vistos.add(hostname);

    const direccion = [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' ') || null;
    candidatos.push({
      id, business: nombre, segment: preset.segment, plantilla: preset.plantilla,
      website, enlaceExterno, sinWeb: !website,
      telefono: t.phone || t['contact:phone'] || t['contact:mobile'] || null,
      email: t.email || t['contact:email'] || null,
      direccion, comuna: t['addr:city'] || zona, pais,
      osm: { tipo: el.type, id: el.id, categoria: t.tourism || t.shop || t.craft || t.leisure || t.amenity || t.sport || null,
        lat: el.lat ?? el.center?.lat ?? null, lon: el.lon ?? el.center?.lon ?? null },
      descubiertoEl: new Date().toISOString().slice(0, 10),
      fuente: 'openstreetmap',
      // Lo llena prospectar-lote.mjs. Hasta entonces el candidato no tiene
      // hallazgos, y sin hallazgos no hay correo.
      audit: null, estado: 'descubierto'
    });
  }

  const lote = `${slugify(zona)}-${rubro}-${new Date().toISOString().slice(0, 10)}`;
  const salida = resolve(candidatosDir, `${lote}.json`);
  writeFileSync(salida, `${JSON.stringify(candidatos, null, 2)}\n`, 'utf8');

  const conWeb = candidatos.filter((c) => c.website).length;
  console.log(`\n${elementos.length} elementos en OSM → ${candidatos.length} candidatos nuevos (${conWeb} con sitio propio, ${candidatos.length - conWeb} sin sitio).`);
  if (omitidosConocidos) console.log(`${omitidosConocidos} ya estaban en la cola o en otro lote.`);
  if (omitidosSinWeb) console.log(`${omitidosSinWeb} sin sitio omitidos (este rubro no los toma).`);
  console.log(`Lote: datos/candidatos/${lote}.json`);
  console.log(`Siguiente paso: node scripts/prospectar-lote.mjs ${lote}`);
}
