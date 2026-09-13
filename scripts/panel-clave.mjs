// Fija la clave de acceso al panel (/prospectar/, /kit/, /presentacion/ y la
// API) y genera el token que usan los agentes para agregar candidatos.
//
//   node scripts/panel-clave.mjs "mi clave larga"      # crea o cambia la clave
//   node scripts/panel-clave.mjs --quitar               # vuelve al panel sin clave
//
// Guarda sólo un hash (scrypt) en datos/panel-auth.json, que está en .gitignore.
// El token de agentes se imprime una vez; si se pierde, se genera otro
// corriendo el comando de nuevo.

import { randomBytes, scryptSync } from 'node:crypto';
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const archivo = resolve(process.cwd(), 'datos', 'panel-auth.json');
const [clave] = process.argv.slice(2);

if (clave === '--quitar') {
  if (existsSync(archivo)) unlinkSync(archivo);
  console.log('Clave quitada: el panel vuelve a abrir sin login (sólo localhost).');
  process.exit(0);
}
if (!clave || clave.length < 8) {
  console.error('Uso: node scripts/panel-clave.mjs "<clave de 8+ caracteres>"  |  --quitar');
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const hash = scryptSync(clave, salt, 64).toString('hex');
const agentToken = randomBytes(24).toString('hex');
writeFileSync(archivo, `${JSON.stringify({ salt, hash, agentToken, creadoEl: new Date().toISOString() }, null, 2)}\n`, 'utf8');
console.log('Clave guardada en datos/panel-auth.json (hash, no la clave).');
console.log('Token para agentes (cabecera X-Agent-Token en POST /api/candidatos):');
console.log(agentToken);
console.log('Reinicia el servidor (npm run serve) para que aplique.');
