# Prospección automatizada — Valdivia → Los Ríos → Chile → España

Cómo alimentar la cola de prospectos con agentes sin perder la regla que hace
vendible a Gramagrowth: **cada correo habla de algo comprobable, y lo envía una
persona**. Fecha del diseño: 2026-09-12.

---

## 1. Qué hay en este PC (inventario, 2026-09-12)

| Pieza | Dónde | Estado | Sirve para |
|---|---|---|---|
| **Hermes Agent v0.20.0** (Nous) | `hermes` en PATH; `HERMES_HOME=C:\Users\sebci\AppData\Local\hermes` | Operativo, gateway `default` corriendo (Buzz) | Agente con cron, skills, perfiles, memoria (Hindsight), kanban multi-perfil |
| Perfil `default` | `HERMES_HOME\SOUL.md` | Personalidad **"La Seb"** (proyecto el-despacho, NSFW) | **No usar para prospección.** Hay que crear un perfil `grama` |
| Perfiles `claude`, `codex`, `term0`–`term15` | `HERMES_HOME\profiles\` | Parados | Orquestación multi-terminal (war-room) |
| Modelo por defecto | `openrouter/free` | Gratis, calidad variable | Suficiente para redactar con reglas estrictas y validador detrás; no para razonar solo |
| Alias `local-free` | Ollama `llama3.2` en `localhost:11434` | Binario `ollama` no está en PATH; servicio no comprobado | Redacción offline si se levanta |
| Alias `freecc` | proxy local `127.0.0.1:8082` → Nemotron 120B (NVIDIA NIM) | Credencial `NVIDIA_API_KEY` presente | Modelo grande gratis; candidato para el perfil `grama` |
| Cron de Hermes | `HERMES_HOME\cron\jobs.json` | 3 jobs, todos deshabilitados; `grama-social-audit` **falló** el 2026-09-11 (heredoc inline no corre en Windows) | Programar lotes semanales — **siempre con `--script` a archivo real o con prompt + skill, nunca heredoc** |
| Skill existente `sebci-proyectos/gramagrowth-prospeccion` | `HERMES_HOME\skills\sebci-proyectos\` | Reglas de sesiones anteriores: confirmar antes de editar, no inventar datos de redes, verificación con hash | Se mantiene como "clase de conducta"; la nueva `gramagrowth-prospector` es el procedimiento |
| Skills útiles ya instaladas | `research/market-research-grounding`, `research/grounded-citations`, `productivity/maps`, `productivity/database`, `web-automation/web-session-bridge` | — | Reforzar la fase de descubrimiento y la verificación de fichas de Google |
| Telegram | `TELEGRAM_BOT_TOKEN` + usuarios permitidos | Configurado | Entrega del reporte semanal (`--deliver telegram`) |
| **Claude Code** | `claude` | Este agente | Construcción del sistema, revisión, tests |
| **Codex** | `codex` | Refs `codex/turn-diffs` en el repo | Trabajo en paralelo sobre el repo |
| **OpenClaw** | `openclaw` (npm) | Instalado | Automatización de navegador; útil para la fase 2 (fichas de Google, Instagram a ojo) |
| Otros | `hermes-chat`, `hermes-combined` (cockpit), `hermes-war-room`, `hermes-webui`, `hermes-desk`, `buzz-agents`, `agent-changelog` | Proyectos propios | Interfaz y orquestación; no intervienen en el pipeline |

Dos consecuencias de diseño salen del inventario:

1. **El LLM es la parte débil y cara; los scripts, la fuerte y gratis.** Por eso
   descubrir, auditar, puntuar y validar son código determinista, y el agente
   sólo redacta. Un modelo gratuito con reglas estrictas y un validador detrás
   rinde más que uno caro sin compuerta.
2. **El perfil `default` tiene otra personalidad.** La prospección corre en un
   perfil propio (`grama`) con su `SOUL.md` sobrio y sólo las skills necesarias.

---

## 2. Arquitectura

```
 ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────┐    ┌──────────────┐
 │ descubrir.mjs│───▶│prospectar-lote.mjs│───▶│ Hermes (perfil   │───▶│ promover.mjs │───▶│ /prospectar/ │
 │ OSM Overpass │    │ auditor.mjs +     │    │ grama, skill     │    │ valida →     │    │ Sebastián    │
 │ zona × rubro │    │ puntaje comercial │    │ prospector)      │    │ rechaza o    │    │ reconfirma y │
 │ dedupe       │    │ ranking           │    │ redacta 10/lote  │    │ promueve     │    │ envía a mano │
 └──────────────┘    └──────────────────┘    └──────────────────┘    └──────────────┘    └──────────────┘
      gratis               gratis              modelo gratuito           gratis            humano
```

**Dónde vive cada cosa**

| Archivo | Rol |
|---|---|
| `scripts/descubrir.mjs` | Consulta Overpass por zona (`--zona`, `--nivel`) y rubro; escribe `datos/candidatos/<zona>-<rubro>-<fecha>.json`. Deduplica contra la cola y otros lotes. Un negocio **sin web** entra igual: es la oportunidad más directa |
| `scripts/prospectar-lote.mjs` | Audita cada sitio con `auditor.mjs`, calcula `puntaje` comercial y `razones`, ordena el lote |
| `hermes/skills/gramagrowth-prospector/SKILL.md` | Procedimiento del agente: qué leer, qué escribir, qué está prohibido |
| `scripts/promover.mjs` | **La compuerta.** Rechaza hallazgos sin señal, frases sobre redes, promesas de resultados, correos citados que no existen, correos sin línea de salida. Sólo lo que pasa entra a `datos/prospectos.json` con `status: review` |
| `/prospectar/` | La cola de siempre: Sebastián reconfirma el hallazgo el día del contacto, copia el correo y lo envía desde su cliente |

**Por qué OpenStreetMap y no Google Places.** Es gratis, sin API key, cubre
Chile y España con la misma consulta, y trae nombre, sitio, teléfono y dirección
publicados por el propio negocio o por la comunidad. Su límite: cobertura
irregular (en Valdivia trajo 161 alojamientos, 9 instaladores). Por eso las
fases siguientes suman otras fuentes (ver §4).

**Puntaje comercial** (`prospectar-lote.mjs`): dominio caído +8, sin sitio +6,
señales del auditor hasta +10, rubro con vertical +3, canal de contacto +2. Sin
canal de contacto se anota "SIN canal" y el agente no redacta correo.

---

## 3. Resultado de la primera corrida (Valdivia, 2026-09-12)

| Lote | Elementos OSM | Candidatos nuevos | Con sitio | Sin sitio | Hallazgo destacado |
|---|---:|---:|---:|---:|---|
| `valdivia-alojamiento-2026-09-12` | 161 | 151 | 12 | 139 | **4 dominios caídos** (Hotel Terrapuerto, Cabañas Puerto Pelícano, Hostal del Muelle, Encanto del Río), confirmados por DNS |
| `valdivia-instalacion-2026-09-12` | 9 | 9 | 0 | 9 | Ninguno tiene sitio en OSM; los 8 auditados en `MERCADO_VALDIVIA.md` vinieron de búsqueda web, no del mapa |

Lectura: en alojamiento el mapa está lleno y la cola tenía 21; **hay 151
negocios de Valdivia que nunca se habían mirado**, 139 de ellos sin página. En
instalación el mapa es pobre y hace falta la fuente 2 (directorios).

---

## 4. Fases

### Fase 1 — Valdivia completo (semanas 1–2)

- Correr los seis rubros sobre `--zona Valdivia`: `alojamiento`, `instalacion`,
  `gimnasios`, `eventos`, `talleres`, `gastronomia`.
- El agente redacta los 10 mejores de cada lote por semana → 60 prospectos
  nuevos con correo listo, validados.
- Sebastián envía a mano, 5–10 al día, como dice `REVENUE_SPRINT.md`.
- Métrica que importa: **tasa de rechazo del validador**. Si rechaza más de 3 de
  10, la skill tiene un hueco y se corrige la skill, no el validador.

### Fase 2 — Región de Los Ríos (semanas 3–5)

- Las 11 comunas restantes, una por corrida (`--nivel 8`), para no saturar
  Overpass y para que cada lote tenga una comuna en el asunto del correo.
- Fuente 2: directorios públicos por rubro para cubrir lo que OSM no tiene
  (**Registro Nacional de Prestadores de Servicios Turísticos de SERNATUR** —
  dataset abierto con nombre, comuna y sitio de cada alojamiento formal del
  país; `amarillas.emol.com` y `habitissimo.cl/empresas` para instaladores). Se
  agregan a `descubrir.mjs` como `--fuente sernatur|amarillas` en cuanto se
  verifique el formato de descarga.
- La visita presencial deja de ser posible: el canal es correo, WhatsApp o
  llamada. Los correos cambian "de Valdivia" por "de la Región de Los Ríos".

### Fase 3 — Chile (mes 2 en adelante)

- Región por región (`--nivel 4`), priorizando las que comparten estacionalidad
  con Valdivia: Los Lagos, Araucanía, Aysén (verano), luego el resto.
- SERNATUR pasa a ser la fuente principal en alojamiento: es la lista oficial.
- Cron semanal por región con `--deliver telegram`, y el kanban de Hermes como
  tablero de lotes si hace falta más de un perfil trabajando.
- Lo que no escala: la demo personalizada por prospecto. Se reserva para los
  que responden; el resto recibe correo + enlace a la demo genérica del rubro.

### Fase 4 — España (mes 3 en adelante, con dos condiciones)

**Por qué España:** mismo idioma, mismo tipo de negocio (casas rurales, gimnasios
de barrio, instaladores de ventanas y aislamiento —con el Plan de Recuperación
financiando rehabilitación energética—), y un ticket que triplica el chileno.

**Precios de referencia (hipótesis a validar con las primeras 10 conversaciones):**

| Producto | Chile (lista) | España (lista) | España (hoy) |
|---|---:|---:|---:|
| Arreglo exprés | $120.000 | €150 | €120 |
| Página vertical / landing | $320.000 | €690 | €490 |
| Ficha de Google ordenada | $90.000 | €150 | €120 |
| Respuestas rápidas WhatsApp | $60.000 | €90 | €70 |
| Actualización de tarifas | $25.000/mes | €35/mes | €25/mes |

**Condición 1 — canal legal.** En España la Ley 34/2002 (LSSI, art. 21) prohíbe
el correo comercial no solicitado sin consentimiento previo o relación previa,
y la AEPD lo ha aplicado también a direcciones de empresa. Un correo frío como
los de Chile es sancionable. Por eso `promover.mjs` acepta prospectos de España
sólo con `contact.type` `form`, `phone` o `instagram`, y la skill no redacta
correo frío para `--pais es`: redacta el mensaje para el formulario de contacto
del propio negocio o el guion de llamada. **Confirmar con un abogado antes de la
primera campaña**; este documento no es asesoría legal.

**Condición 2 — entrega.** Sesión de fotos y visita técnica no existen en
España. La oferta española es la que no requiere presencia: arreglo exprés,
página vertical, ficha de Google, respuestas rápidas, actualización de tarifas.
Fotos y video quedan fuera del catálogo español.

**Fuentes para España:** OSM funciona igual (`--zona Cantabria --nivel 4 --pais es`);
para alojamiento rural, los registros autonómicos de turismo son datos abiertos
en la mayoría de comunidades.

---

## 5. Puesta en marcha (comandos para Sebastián)

**Atajo:** todo lo de esta sección lo hace `hermes\instalar.ps1`, que copia el
`SOUL.md` y la skill desde el repo (fuente de verdad, versionada) al perfil
`grama`, y con `-ConCron` registra el job semanal con el prompt de
`hermes\cron\prospeccion-semanal.md`.

```powershell
powershell -ExecutionPolicy Bypass -File hermes\instalar.ps1            # perfil + skill
powershell -ExecutionPolicy Bypass -File hermes\instalar.ps1 -ConCron   # además, el cron
```

Lo que sigue es el detalle de lo que hace, por si se prefiere a mano. Son
cambios de configuración persistente de Hermes; se ejecutan una vez.

### 5.1 Perfil propio, sin la personalidad del perfil `default`

```powershell
hermes profile create grama
```

Luego crear `C:\Users\sebci\AppData\Local\hermes\profiles\grama\SOUL.md`:

```markdown
# SOUL.md — Prospector Gramagrowth
Redactas correos de prospección para Gramagrowth (Valdivia). Sobrio, concreto,
en español de Chile. Sólo afirmas lo que la auditoría demuestra. No prometes
resultados. No envías nada. Cuando dudas, dejas el campo vacío.
```

Modelo recomendado para el perfil: el alias `freecc` (Nemotron 120B vía proxy
local, gratis) o `openrouter/free`. Se fija con `hermes -p grama model`.

### 5.2 Instalar la skill

```powershell
Copy-Item -Recurse C:\Users\sebci\Documents\Gramagrowth\hermes\skills\gramagrowth-prospector C:\Users\sebci\AppData\Local\hermes\profiles\grama\skills\gramagrowth-prospector
```

(Si el perfil comparte skills con el home, la ruta es
`C:\Users\sebci\AppData\Local\hermes\skills\gramagrowth-prospector`.)

### 5.3 Probar un lote a mano antes de programar nada

```powershell
cd C:\Users\sebci\Documents\Gramagrowth
node scripts/descubrir.mjs --zona Valdivia --rubro gimnasios
node scripts/prospectar-lote.mjs valdivia-gimnasios-2026-09-12
hermes -p grama chat -Q --skills gramagrowth-prospector -q "Redacta el lote valdivia-gimnasios-2026-09-12: los 10 mejores. Termina con promover.mjs y reporta."
node scripts/promover.mjs valdivia-gimnasios-2026-09-12 --dry-run
```

### 5.4 Cron semanal (cuando el paso 5.3 pase limpio dos veces)

```powershell
hermes -p grama cron create "0 7 * * 1" --name grama-prospeccion-semanal --skill gramagrowth-prospector --workdir C:\Users\sebci\Documents\Gramagrowth --deliver telegram "Lee tu notepad para saber qué zona y rubro tocan esta semana (empieza por Valdivia/alojamiento y avanza por la tabla de la skill). Descubre, audita, redacta los 10 mejores, promueve con promover.mjs y reporta el resultado. Actualiza el notepad con la siguiente zona/rubro."
```

El **notepad** del job (`hermes cron notepad`) guarda la posición en la lista de
zonas: es el cursor que hace que cada semana toque una zona distinta sin
tocar el código.

**Lo que el cron nunca hace:** enviar. La entrega por Telegram es un reporte
("promoví 8, rechacé 2, los mejores son…"); los correos siguen saliendo de la
cola, a mano.

---

## 6. Reglas de honestidad, en código

`scripts/promover.mjs` rechaza un candidato si:

- tiene 0 o más de 3 hallazgos, o le falta asunto, correo o canal;
- menciona una señal (`copyright-antiguo`, `sin-whatsapp`, `plantilla`, `dominio
  caído`, `sin formulario`, `correos en conflicto`, `sin teléfono ni correo`) que
  **no está** en `audit.signals`;
- habla de redes ("no publican hace", "abandonado", "inactivo", "seguidores",
  "alcance");
- promete resultados ("más ventas", "garantizado", "primer lugar en Google",
  "posicionamiento");
- cita un correo que no aparece en el sitio ni en OSM;
- no ofrece salida (`responde "no" y no vuelvo a escribir`).

Los rechazados **se quedan en el lote con el motivo**, para corregir la skill si
el patrón se repite. Lo que pasa entra con `status: review`, nunca `ready`.

Caso documentado que motivó dos de estas reglas: el auditor marcó
`correos-en-conflicto` en TecAlum contando el `placeholder` de un formulario
(`tu@empresa.cl`). La skill exige mirar `signal.evidence` antes de usar esa
señal, y el auditor ignora `placeholder=` al extraer correos desde el
2026-09-12.

---

## 7. Lo que falta y en qué orden

1. ~~`auditor.mjs`: ignorar `placeholder` al extraer correos~~ — hecho el
   2026-09-12, junto con el filtro de TLD (descartaba `grad@20..48`, un artefacto
   de CSS). Sigue siendo señal de verificación manual: hay sitios con correos de
   relleno fuera de un `placeholder`.
2. `descubrir.mjs --fuente sernatur`: descarga y normalización del registro
   SERNATUR (verificar URL del dataset y formato antes de codificar).
3. Enlace desde `/prospectar/` a `datos/candidatos/` para ver lotes pendientes.
4. Fase España: redactor de mensaje para formulario y guion de llamada en la
   skill, y revisión legal del canal.
