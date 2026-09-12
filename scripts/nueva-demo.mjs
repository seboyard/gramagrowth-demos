// Crea la carpeta de demo de un cliente a partir de una plantilla vertical.
// Copia index.html, styles.css y app.js sin tocarlos, y deja config.js listo
// para editar. Es el paso 1 del "ciclo de reventa" de cada README.
//
// Uso:
//   node scripts/nueva-demo.mjs <plantilla> <cliente>
//   node scripts/nueva-demo.mjs cotizar-instalacion valdilum
//
// Después: editar clientes/<cliente>/config.js con datos públicos del negocio
// (y sólo esos), y abrir http://127.0.0.1:4173/clientes/<cliente>/.

import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const [plantilla, cliente] = process.argv.slice(2);
const root = resolve(process.cwd());
const plantillas = readdirSync(resolve(root, 'plantillas')).filter((d) => d !== 'landing-prospecto');

if (!plantilla || !cliente) {
  console.error(`Uso: node scripts/nueva-demo.mjs <plantilla> <cliente>\nPlantillas: ${plantillas.join(', ')}`);
  process.exit(1);
}
if (!plantillas.includes(plantilla)) {
  console.error(`Plantilla desconocida: ${plantilla}. Disponibles: ${plantillas.join(', ')}`);
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(cliente)) {
  console.error('El nombre del cliente debe ser un slug: minúsculas, números y guiones.');
  process.exit(1);
}

const origen = resolve(root, 'plantillas', plantilla);
const destino = resolve(root, 'clientes', cliente);
if (existsSync(destino)) {
  console.error(`Ya existe clientes/${cliente}/. No se sobrescribe nada.`);
  process.exit(1);
}

mkdirSync(destino, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'config.js']) {
  copyFileSync(resolve(origen, file), resolve(destino, file));
}
console.log(`clientes/${cliente}/ creado desde plantillas/${plantilla}/.`);
console.log(`Ahora edita clientes/${cliente}/config.js con datos públicos del negocio y abre`);
console.log(`http://127.0.0.1:4173/clientes/${cliente}/`);
