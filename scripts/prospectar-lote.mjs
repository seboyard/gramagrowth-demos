// Audita un lote de candidatos (datos/candidatos/<lote>.json) con el motor de
// scripts/auditor.mjs, los puntúa y los ordena para que el agente redactor
// —o Sebastián— trabaje primero los que más lo merecen.
//
// Uso:
//   node scripts/prospectar-lote.mjs <lote>            # audita los que faltan
//   node scripts/prospectar-lote.mjs <lote> --todo     # re-audita todos
//   node scripts/prospectar-lote.mjs <lote> --top 10   # muestra los 10 mejores
//
// Sólo escribe el bloque `audit`, `puntaje` y `estado`. No redacta hallazgos ni
// correos: eso es trabajo del agente, y el agente sólo puede hablar de señales
// que existan en `audit.signals`.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { auditUrl } from './auditor.mjs';

const [lote, ...flags] = process.argv.slice(2);
if (!lote) { console.error('Uso: node scripts/prospectar-lote.mjs <lote> [--todo] [--top N]'); process.exit(1); }
const todo = flags.includes('--todo');
const top = Number(flags[flags.indexOf('--top') + 1]) || 15;

const file = resolve(process.cwd(), 'datos', 'candidatos', `${lote}.json`);
const candidatos = JSON.parse(readFileSync(file, 'utf8'));
const hoy = new Date().toISOString().slice(0, 10);

// Puntaje comercial. Es distinto al `score` del auditor: aquí pesa lo que hace
// vendible al prospecto, no sólo lo roto que está su sitio.
function puntuar(c) {
  let puntos = 0;
  const razones = [];
  if (c.sinWeb) { puntos += 6; razones.push('sin sitio propio'); }
  if (c.audit?.ok === false && c.audit.signals?.some((s) => s.id === 'dominio-caido')) { puntos += 8; razones.push('dominio caído'); }
  if (c.audit?.ok) {
    puntos += Math.min(c.audit.score || 0, 10);
    const ids = new Set(c.audit.signals.map((s) => s.id));
    if (ids.has('plantilla-sin-terminar')) razones.push('plantilla visible');
    if (ids.has('copyright-antiguo')) razones.push('pie antiguo');
    if (ids.has('sin-whatsapp')) razones.push('sin WhatsApp');
    if (ids.has('correos-en-conflicto')) razones.push('correos en conflicto (verificar placeholders)');
  }
  if (c.plantilla) { puntos += 3; razones.push(`vertical ${c.plantilla}`); }
  if (c.telefono || c.email || c.audit?.meta?.emails?.length || c.audit?.meta?.phones?.length) { puntos += 2; razones.push('canal de contacto'); }
  else razones.push('SIN canal de contacto');
  return { puntos, razones };
}

let auditados = 0;
for (const c of candidatos) {
  if (c.website && (todo || !c.audit)) {
    process.stdout.write(`Auditando ${c.business} → ${c.website} … `);
    try {
      c.audit = await auditUrl(c.website);
      c.audit.auditedAt = hoy;
      console.log(c.audit.ok ? `${c.audit.signals.length} señales` : `sin respuesta (${c.audit.error || c.audit.status})`);
    } catch (error) {
      c.audit = { ok: false, error: error.message, status: null, signals: [], score: 0, auditedAt: hoy, meta: {} };
      console.log(`error: ${error.message}`);
    }
    auditados += 1;
  }
  const { puntos, razones } = puntuar(c);
  c.puntaje = puntos;
  c.razones = razones;
  if (c.estado === 'descubierto') c.estado = c.website ? 'auditado' : 'sin-web';
}

candidatos.sort((a, b) => b.puntaje - a.puntaje);
writeFileSync(file, `${JSON.stringify(candidatos, null, 2)}\n`, 'utf8');

console.log(`\n${auditados} sitios auditados. Ranking del lote (${candidatos.length} candidatos):\n`);
candidatos.slice(0, top).forEach((c, i) => {
  console.log(`${String(i + 1).padStart(2)}. [${String(c.puntaje).padStart(2)}] ${c.business} · ${c.website || 'sin web'}`);
  console.log(`      ${c.razones.join(' · ')}`);
});
console.log(`\nSiguiente paso: el agente redacta hallazgos y correos para los mejores y luego\n  node scripts/promover.mjs ${lote}`);
