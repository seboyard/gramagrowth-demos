// Ordena la cola por probabilidad de venta y escribe docs/PRIORIDAD.md.
// Uso: node scripts/priorizar.mjs
//
// El puntaje no mide lo roto que está un sitio (eso es audit.score) sino qué
// tan probable es cerrar: hay demo lista, el hallazgo es comprobable en
// segundos, hay canal directo, existe una plantilla del rubro, y el ticket del
// negocio justifica el precio. Es una heurística explícita, no un oráculo.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const cola = JSON.parse(readFileSync(resolve(root, 'datos/prospectos.json'), 'utf8'));
const hoy = new Date().toISOString().slice(0, 10);

const CANAL = { whatsapp: 3, email: 3, phone: 2, form: 1, instagram: 1, address: 0, none: 0 };

function puntuar(p) {
  const razones = [];
  let puntos = 0;
  const demo = (p.notes || '').match(/clientes\/([a-z0-9-]+)/i)?.[1] || null;
  if (demo) {
    puntos += 3; razones.push('demo lista');
    // Una demo que calcula con tarifas reales del negocio convence más que una
    // con "a confirmar" en todas partes.
    try {
      const cfg = readFileSync(resolve(root, 'clientes', demo, 'config.js'), 'utf8');
      if (/(tarifa|precio|valorM2)\s*:\s*\{?\s*(desde\s*:\s*)?\d{4,}/.test(cfg)) { puntos += 1; razones.push('demo con tarifas reales'); }
    } catch { /* sin config legible: no suma */ }
  }

  const texto = `${(p.findings || []).join(' ')} ${(p.audit?.signals || []).map((s) => s.id).join(' ')}`;
  if (/NXDOMAIN|dominio.*(caído|no existe|ya no)|pagina-estacionada|410/i.test(texto)) { puntos += 4; razones.push('sitio caído'); }
  else if (/plantilla|lorem|relleno|9876 5432|tel:\+56632228160|404|en blanco|inglés|VALORES 2024|Verano 2025|rotulad|Hostinger|no pide (fecha|salida)/i.test(texto)) { puntos += 3; razones.push('defecto comprobable en segundos'); }
  else if ((p.audit?.signals || []).some((s) => s.severity === 'alta')) { puntos += 2; razones.push('señal alta del auditor'); }

  const canal = p.contact?.type || 'none';
  puntos += CANAL[canal] ?? 0;
  razones.push(canal === 'none' ? 'SIN canal' : `canal ${canal}`);

  if (/alojamiento|banqueter|eventos|deporte|construcci|instalaci/i.test(p.segment || '')) { puntos += 1; razones.push('vertical existente'); }
  if (/construcci|instalaci/i.test(p.segment || '')) { puntos += 1; razones.push('ticket alto'); }
  if (p.offer === 'express') { puntos += 1; razones.push('entrada barata'); }

  if (p.status === 'sent' || p.status === 'contacted') { puntos -= 2; razones.push('ya contactado'); }
  if (p.status === 'discarded') puntos = -99;
  return { puntos, razones, demo };
}

const filas = cola.map((p) => ({ p, ...puntuar(p) })).filter((r) => r.puntos > -50).sort((a, b) => b.puntos - a.puntos);

const lineas = [
  `# Prioridad de la cola — ${hoy}`,
  '',
  `Generado por \`scripts/priorizar.mjs\` sobre ${cola.length} prospectos. Orden = probabilidad de`,
  'cierre rápido: demo lista, hallazgo comprobable en segundos, canal directo,',
  'plantilla del rubro y ticket. Regenerar después de cada lote.',
  '',
  '**Antes de enviar cualquiera:** reconfirmar el hallazgo ese mismo día (DNS para',
  'dominios caídos; abrir el sitio para pies, teléfonos y enlaces rotos).',
  '',
  '| # | Pts | Negocio | Segmento | Hallazgo que abre | Canal | Oferta | Demo | Propuesta |',
  '|---|---:|---|---|---|---|---|---|---|'
];
filas.forEach((r, i) => {
  const hallazgo = (r.p.findings?.[0] || r.p.opportunity || '').replace(/\|/g, '/').slice(0, 110);
  const canal = r.p.contact?.value ? `${r.p.contact.type}: ${r.p.contact.value}` : 'sin canal';
  const demo = r.demo ? `\`clientes/${r.demo}/\`` : '—';
  const propuesta = `\`/presentacion/?id=${r.p.id}\``;
  lineas.push(`| ${i + 1} | ${r.puntos} | **${r.p.business}** | ${r.p.segment} | ${hallazgo} | ${canal} | ${r.p.offer} | ${demo} | ${propuesta} |`);
});

lineas.push('', '## Cómo leer la tabla', '',
  '- **Pts ≥ 10**: enviar esta semana. Tienen demo, hallazgo fuerte y canal directo.',
  '- **Pts 7–9**: enviar después de los primeros; la mayoría necesita construir la demo si responde.',
  '- **Pts < 7**: falta canal o el hallazgo es débil. Buscar el canal antes de escribir.',
  '', '## Razones por prospecto', '');
filas.forEach((r) => lineas.push(`- ${r.p.business}: ${r.razones.join(' · ')}`));

writeFileSync(resolve(root, 'docs/PRIORIDAD.md'), `${lineas.join('\n')}\n`, 'utf8');
console.log(`docs/PRIORIDAD.md escrito con ${filas.length} prospectos. Top 5:`);
filas.slice(0, 5).forEach((r, i) => console.log(`${i + 1}. [${r.puntos}] ${r.p.business} — ${r.razones.join(' · ')}`));
