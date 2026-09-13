// Trae los prospectos que el bot de Hermes deja en el repo seboyard/production-data,
// los convierte en candidatos nuestros y los audita. Lo usa el botón
// "Sincronizar agentes" del panel y sirve como job de cron sin agente.
//
// Uso:  node scripts/sincronizar-hermes.mjs            # importa y audita lo nuevo
//       node scripts/sincronizar-hermes.mjs --sin-audit
//
// Lee el archivo privado con `gh api` (la sesión de gh ya está autenticada en
// este PC); no guarda tokens en ningún lado. Devuelve un resumen en JSON por
// stdout cuando se llama con --json, para que el servidor lo reenvíe al panel.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { agregarCandidatos } from './lib-candidatos.mjs';
import { auditUrl } from './auditor.mjs';

const REPO = 'seboyard/production-data';
const ARCHIVO = 'prospectos.json';

export async function sincronizarHermes(root, { auditar = true, lote } = {}) {
  const hoy = new Date().toISOString().slice(0, 10);
  const nombreLote = lote || `agentes-hermes-${hoy}`;

  // Descarga vía gh (repo privado). Si gh no está o no hay sesión, se informa.
  let registros;
  try {
    const raw = execFileSync('gh', ['api', '-H', 'Accept: application/vnd.github.raw', `repos/${REPO}/contents/${ARCHIVO}`],
      { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
    registros = JSON.parse(raw);
  } catch (error) {
    return { ok: false, error: `No se pudo leer ${REPO}/${ARCHIVO} con gh: ${String(error.stderr || error.message).trim().slice(0, 200)}` };
  }
  if (!Array.isArray(registros)) return { ok: false, error: 'El archivo de Hermes no es una lista.' };

  const resumen = agregarCandidatos(root, nombreLote, registros, `hermes:${REPO}`);
  let auditados = 0;
  if (auditar && resumen.agregados.length) {
    const archivo = resumen.archivo;
    const items = JSON.parse(readFileSync(archivo, 'utf8'));
    for (const c of items) {
      if (!c.website || c.audit) continue;
      try { c.audit = await auditUrl(c.website); c.audit.auditedAt = hoy; }
      catch (error) { c.audit = { ok: false, error: error.message, status: null, signals: [], score: 0, auditedAt: hoy, meta: {} }; }
      c.estado = 'auditado';
      auditados += 1;
    }
    // Puntaje comercial, igual que prospectar-lote.mjs (copiado a propósito:
    // ese script es CLI y no exporta).
    for (const c of items) {
      let puntos = 0; const razones = [];
      if (c.sinWeb) { puntos += 6; razones.push('sin sitio propio'); }
      if (c.audit?.ok === false && c.audit.signals?.some((s) => s.id === 'dominio-caido')) { puntos += 8; razones.push('dominio caído'); }
      if (c.audit?.ok) { puntos += Math.min(c.audit.score || 0, 10); }
      if (c.plantilla) { puntos += 3; razones.push(`vertical ${c.plantilla}`); }
      if (c.telefono || c.email || c.audit?.meta?.emails?.length || c.audit?.meta?.phones?.length) { puntos += 2; razones.push('canal de contacto'); } else razones.push('SIN canal de contacto');
      c.puntaje = puntos; c.razones = razones;
      if (c.estado === 'descubierto' && !c.website) c.estado = 'sin-web';
    }
    items.sort((a, b) => (b.puntaje || 0) - (a.puntaje || 0));
    writeFileSync(archivo, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
  }
  return {
    ok: true, lote: nombreLote, leidos: registros.length, agregados: resumen.agregados.length,
    descartados: resumen.descartados, auditados, totalLote: resumen.totalLote,
    nuevos: resumen.agregados.map((c) => ({ id: c.id, business: c.business, website: c.website, comuna: c.comuna, segment: c.segment }))
  };
}

// CLI
if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))) {
  const root = resolve(process.cwd());
  const json = process.argv.includes('--json');
  const resultado = await sincronizarHermes(root, { auditar: !process.argv.includes('--sin-audit') });
  if (json) { console.log(JSON.stringify(resultado)); }
  else if (!resultado.ok) { console.error(resultado.error); process.exit(1); }
  else {
    console.log(`${resultado.leidos} registros de Hermes → ${resultado.agregados} candidatos nuevos en ${resultado.lote} (${resultado.auditados} auditados).`);
    console.log('Descartados:', resultado.descartados);
    resultado.nuevos.slice(0, 15).forEach((c) => console.log(`  - ${c.business} · ${c.comuna || ''} · ${c.website || 'sin sitio'}`));
  }
}
