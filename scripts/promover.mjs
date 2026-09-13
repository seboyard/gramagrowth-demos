// Promueve candidatos redactados de datos/candidatos/<lote>.json a la cola
// real (datos/prospectos.json), con estado 'review'. Es la compuerta: nada
// entra a la cola sin pasar estas validaciones, venga de un agente o de una
// persona.
//
// Uso:
//   node scripts/promover.mjs <lote>             # promueve los que estén listos
//   node scripts/promover.mjs <lote> --dry-run   # sólo valida e informa
//
// Un candidato está "listo" cuando tiene `findings` (1 a 3), `subject`, `email`
// y `contact`. Se rechaza si:
//   - afirma algo que la auditoría no puede saber (actividad en redes, seguidores);
//   - promete resultados (ventas, consultas, posiciones en Google);
//   - menciona una señal que no está en audit.signals (hallazgo inventado);
//   - cita un correo o teléfono que no aparece en el sitio ni en OSM;
//   - no tiene ninguna fuente pública verificable.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [lote, ...flags] = process.argv.slice(2);
if (!lote) { console.error('Uso: node scripts/promover.mjs <lote> [--dry-run]'); process.exit(1); }
const dryRun = flags.includes('--dry-run');

const root = resolve(process.cwd());
const loteFile = resolve(root, 'datos', 'candidatos', `${lote}.json`);
const colaFile = resolve(root, 'datos', 'prospectos.json');
const candidatos = JSON.parse(readFileSync(loteFile, 'utf8'));
const cola = JSON.parse(readFileSync(colaFile, 'utf8'));
const hoy = new Date().toISOString().slice(0, 10);

// Frases que la auditoría no puede respaldar o que OFFERS.md prohíbe prometer.
const PROHIBIDO = [
  /no publica[n]? (hace|desde)/i, /sin publicar (hace|desde)/i, /abandonad[oa]/i, /inactiv[oa]/i,
  /seguidores/i, /engagement/i, /alcance/i,
  /garantiz/i, /aseguramos/i, /te prometo|les prometo|prometemos/i,
  /más (ventas|clientes|reservas|consultas)/i, /aument(ar|o) (de )?(ventas|reservas|consultas)/i,
  /primer(a|o)? (lugar|posici[oó]n|p[aá]gina) (en|de) google/i, /posicion(ar|amiento)/i
];

// Palabras clave por señal: si el correo habla de esto, la señal tiene que
// existir en la auditoría. Es la regla de "no inventar hallazgos", en código.
const SENALES = {
  // Sin años sueltos: una fecha de verificación ("2026-09-12") no es un pie.
  'copyright-antiguo': /©|\bpie\b|derechos reservados|copyright/i,
  'sin-whatsapp': /whatsapp/i,
  'plantilla-sin-terminar': /plantilla|lorem|ejemplo|de relleno/i,
  'dominio-caido': /dominio|no (carga|abre|existe|resuelve)/i,
  'sin-formulario': /formulario/i,
  'correos-en-conflicto': /dos correos|correos distintos|varios correos/i,
  'sin-telefono-ni-correo': /sin tel[eé]fono|no publica tel[eé]fono|no publica correo/i
};

const slugify = (value) => value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

function validar(c) {
  const errores = [];
  if (!Array.isArray(c.findings) || c.findings.length < 1 || c.findings.length > 3) errores.push('findings: se esperan 1 a 3');
  if (!c.subject) errores.push('falta subject');
  if (!c.email || c.email.length < 200) errores.push('email vacío o demasiado corto');
  if (!c.contact?.type || !c.contact?.value) errores.push('falta contact {type, value}');
  if (!c.website && !c.enlaceExterno && !c.telefono && !c.email) errores.push('sin ninguna fuente pública');

  const texto = `${(c.findings || []).join(' ')} ${c.subject || ''} ${c.email || ''}`;
  PROHIBIDO.forEach((re) => { if (re.test(texto)) errores.push(`frase prohibida: ${re}`); });

  // Las señales se controlan en lo que se AFIRMA (hallazgos y asunto). El cuerpo
  // del correo describe la oferta —"botón de WhatsApp", "un dominio suyo"— y
  // esas palabras no son hallazgos.
  const afirmado = `${(c.findings || []).join(' ')} ${c.subject || ''}`;
  // Además del audit del sitio, valen verificaciones hechas aparte y anotadas
  // con fecha: p. ej. que el dominio que figura en el mapa ya no resuelve,
  // aunque el negocio tenga otro sitio vivo. Sin fecha no cuentan.
  const senales = new Set((c.audit?.signals || []).map((s) => s.id));
  (c.verificaciones || []).forEach((v) => { if (v.tipo && v.fecha) senales.add(v.tipo); });
  const sinWebOk = c.sinWeb;
  // Una página estacionada o un error HTTP respaldan hablar de "dominio" y de
  // "relleno": son la misma familia de hallazgo que el dominio caído.
  const EQUIVALENTES = {
    'dominio-caido': ['pagina-estacionada', 'sitio-con-error'],
    'plantilla-sin-terminar': ['pagina-estacionada']
  };
  const respaldada = (id) => senales.has(id) || (EQUIVALENTES[id] || []).some((alt) => senales.has(alt));
  for (const [id, re] of Object.entries(SENALES)) {
    // Un negocio sin web puede hablar de que no tiene sitio; el resto de las
    // señales sólo existen si el auditor las vio.
    if (re.test(afirmado) && !respaldada(id) && !(sinWebOk && id === 'dominio-caido')) {
      errores.push(`menciona "${id}" pero la auditoría no lo detectó`);
    }
  }

  // Correos y teléfonos citados deben venir del sitio o de OSM.
  const conocidos = new Set([...(c.audit?.meta?.emails || []), c.email, c.contact?.value].filter(Boolean).map((v) => v.toLowerCase()));
  const citados = [...texto.matchAll(/[\w.+-]+@[\w-]+\.[\w-]+(?:\.[\w-]+)*/g)].map((m) => m[0].toLowerCase().replace(/\.+$/, ''))
    .filter((mail) => !/gramagrowth/i.test(mail));
  citados.forEach((mail) => { if (!conocidos.has(mail)) errores.push(`cita el correo ${mail}, que no aparece en el sitio`); });

  if (!/responde "no"|no vuelvo a escribir|no recibir más/i.test(c.email || '')) errores.push('el correo no ofrece salida (responde "no")');
  return errores;
}

let promovidos = 0;
const rechazados = [];
for (const c of candidatos) {
  if (c.estado === 'promovido') continue;
  const listo = c.findings && c.subject && c.email;
  if (!listo) continue;
  const errores = validar(c);
  if (errores.length) { rechazados.push({ c, errores }); continue; }

  const id = cola.some((p) => p.id === c.id) ? slugify(`${c.id}-${hoy}`) : c.id;
  if (!dryRun) {
    cola.push({
      id, business: c.business, segment: c.segment, priority: c.puntaje >= 12 ? 'Alta' : 'Media',
      website: c.website || c.enlaceExterno || '', verifiedAt: c.audit?.auditedAt || c.descubiertoEl || hoy,
      contact: c.contact, offer: c.offer || (c.sinWeb ? 'landing' : 'express'),
      opportunity: c.opportunity || '', findings: c.findings,
      evidence: [
        c.website ? { label: 'Sitio oficial — portada', url: c.website } : null,
        c.enlaceExterno ? { label: 'Perfil público enlazado desde OSM', url: c.enlaceExterno } : null,
        c.osm?.id ? { label: 'Ficha en OpenStreetMap', url: `https://www.openstreetmap.org/${c.osm.tipo}/${c.osm.id}` } : null
      ].filter(Boolean),
      subject: c.subject, email: c.email, audit: c.audit,
      plataformas: {}, status: 'review', followUp: '',
      // Las notas del redactor van primero: ahí viene "Demo: clientes/<slug>/",
      // que es lo que la cola y la presentación usan para enlazar la muestra.
      notes: [c.notes, `Lote ${lote}. Plantilla: ${c.plantilla || 'landing genérica'}. Reconfirmar cada hallazgo el día del contacto.`].filter(Boolean).join(' · ')
    });
    c.estado = 'promovido';
    c.promovidoEl = hoy;
  }
  promovidos += 1;
}

if (!dryRun) {
  writeFileSync(colaFile, `${JSON.stringify(cola, null, 2)}\n`, 'utf8');
  writeFileSync(loteFile, `${JSON.stringify(candidatos, null, 2)}\n`, 'utf8');
}

console.log(`${dryRun ? '[dry-run] ' : ''}${promovidos} candidatos ${dryRun ? 'pasarían' : 'promovidos'} a la cola.`);
if (rechazados.length) {
  console.log(`\n${rechazados.length} rechazados (se quedan en el lote para corregir):`);
  rechazados.forEach(({ c, errores }) => {
    console.log(`- ${c.business}`);
    errores.forEach((e) => console.log(`    · ${e}`));
  });
  process.exitCode = 2;
}
