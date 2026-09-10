// Re-audita todos los prospectos de datos/prospectos.json con el motor actual.
// Uso: node scripts/reauditar.mjs
//
// Sólo reemplaza el bloque `audit` y `verifiedAt`. Los hallazgos escritos a mano,
// los correos y el estado no se tocan. Informa qué señales aparecieron y cuáles
// dejaron de existir, porque un hallazgo vencido en un correo quema al prospecto.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { auditUrl } from './auditor.mjs';

const dataFile = resolve(process.cwd(), 'datos', 'prospectos.json');
const prospects = JSON.parse(readFileSync(dataFile, 'utf8'));

console.log(`Re-auditando ${prospects.length} prospectos…\n`);

for (const prospect of prospects) {
  if (!prospect.website) {
    console.log(`— ${prospect.business}: sin sitio declarado, se omite`);
    continue;
  }
  const before = new Set((prospect.audit?.signals || []).map((signal) => signal.id));
  const fresh = await auditUrl(prospect.website);
  const after = new Set(fresh.signals.map((signal) => signal.id));

  const gone = [...before].filter((id) => !after.has(id));
  const added = [...after].filter((id) => !before.has(id));

  prospect.verifiedAt = fresh.auditedAt;
  prospect.audit = {
    score: fresh.score, ok: fresh.ok, error: fresh.error, status: fresh.status,
    auditedAt: fresh.auditedAt, signals: fresh.signals, meta: fresh.meta
  };

  const canales = [
    fresh.meta.phones?.length ? `${fresh.meta.phones.length} tel` : null,
    fresh.meta.emails?.length ? `${fresh.meta.emails.length} correo` : null,
    Object.keys(fresh.meta.socials || {}).length ? Object.keys(fresh.meta.socials).join('/') : null
  ].filter(Boolean).join(' · ') || 'sin canales';

  console.log(`${prospect.business}`);
  console.log(`   puntaje ${fresh.score}${fresh.ok ? '' : ` (${fresh.error})`} · ${canales}`);
  if (gone.length) console.log(`   YA NO APLICA: ${gone.join(', ')}`);
  if (added.length) console.log(`   nuevo: ${added.join(', ')}`);
}

writeFileSync(dataFile, `${JSON.stringify(prospects, null, 2)}\n`, 'utf8');
console.log(`\nGuardado en ${dataFile}`);
