---
name: gramagrowth-prospector
description: Redacta hallazgos, asunto y correo para candidatos ya auditados de Gramagrowth (datos/candidatos/<lote>.json) y los promueve a la cola con scripts/promover.mjs. Sólo habla de señales que existan en audit.signals; nunca inventa datos, no promete resultados, no envía nada. Usar cuando se pida "redactar el lote", "prospectar <zona> <rubro>" o en el cron de prospección.
version: 1.0.0
author: gramagrowth
license: MIT
---

# Gramagrowth · prospector

Trabajas dentro de `C:\Users\sebci\Documents\Gramagrowth`. Tu trabajo es el
tramo humano del pipeline de prospección: **leer evidencia y escribir un correo
honesto**. Descubrir y auditar lo hacen scripts; enviar lo hace Sebastián.

```
descubrir.mjs ──▶ prospectar-lote.mjs ──▶ TÚ (redactas) ──▶ promover.mjs ──▶ /prospectar/
   OSM, gratis        auditor.mjs                              valida y rechaza      Sebastián envía
```

## Flujo por lote

1. Si te dan zona y rubro y no existe el lote, créalo:
   `node scripts/descubrir.mjs --zona "<zona>" --rubro <rubro> [--nivel N] [--pais es]`
   y luego `node scripts/prospectar-lote.mjs <lote>`.
2. Abre `datos/candidatos/<lote>.json`. Está ordenado por `puntaje`. Trabaja los
   primeros **10** que no tengan `findings` (o los que te indiquen).
3. Para cada uno, lee `audit.signals`, `audit.meta` (correos, teléfonos, redes,
   plataforma), `sinWeb`, `telefono`, `email`, `direccion`, `plantilla`.
4. Escribe en el mismo objeto del JSON los campos:
   - `findings`: 1 a 3 frases, cada una respaldada por UNA señal de `audit.signals`
     o por `sinWeb: true`. Cita el detalle literal cuando exista (`signal.evidence`).
   - `subject`: una línea concreta sobre el hallazgo principal, sin mayúsculas
     de grito, sin "oportunidad", sin "propuesta".
   - `email`: 120–220 palabras, en el formato de `docs/ENVIAR_HOY.md`:
     saludo → "Soy Sebastián, de Gramagrowth (Valdivia)" → el hallazgo con el
     detalle exacto y por qué le cuesta consultas → qué se puede dejar
     funcionando, plazo y precio de `docs/OFFERS.md` → una pregunta de cierre →
     firma con la línea de salida `Si prefieres no recibir más correos míos,
     responde "no" y no vuelvo a escribir.`
   - `contact`: `{ type: 'email'|'whatsapp'|'form'|'phone'|'address'|'instagram', value, label }`,
     tomado de `audit.meta.emails`, `audit.meta.phones`, `telefono`, `email` o
     `enlaceExterno`. Si no hay ninguno, `type: 'none'` y NO redactes correo:
     deja `subject` y `email` vacíos y anota en `notas` que hay que buscar canal.
   - `offer`: `express` si hay un defecto puntual corregible en el sitio;
     `landing` si no tiene sitio o el sitio está caído; `presence` sólo si además
     enlaza redes.
   - `opportunity`: una frase con lo que se vendería.
5. Corre `node scripts/promover.mjs <lote> --dry-run`. Si rechaza alguno, corrige
   exactamente lo que dice el motivo y repite. Cuando pase limpio, corre sin
   `--dry-run`.
6. Reporta: cuántos promovidos, cuántos sin canal, los 3 mejores con su asunto.
   Nada más. No abras el correo, no lo envíes, no toques `status`.

## Reglas que el validador hace cumplir (y tú debes respetar antes)

- **Sólo señales auditadas.** Si `audit.signals` no tiene `copyright-antiguo`, no
  puedes decir que el pie está viejo. Si no tiene `sin-whatsapp`, no puedes decir
  que falta WhatsApp. `sinWeb: true` es la única afirmación permitida sin señal.
- **Nada de redes.** No sabes si publican o no; el auditor no lo mide. Prohibido
  "no publican hace meses", "abandonado", "inactivo", "seguidores", "alcance".
- **Nada de promesas.** Prohibido "más ventas", "más reservas", "garantizado",
  "primer lugar en Google", "posicionamiento".
- **Correos y teléfonos citados** sólo los que aparecen en el sitio o en OSM.
- **`correos-en-conflicto` se verifica a mano**: el auditor cuenta también los
  `placeholder` de formularios (caso TecAlum, `tu@empresa.cl`). Antes de usar esa
  señal, mira `signal.evidence`; si uno de los correos parece de ejemplo, no la
  uses.
- **Dominio caído**: el hallazgo más fuerte y el más urgente. El contacto sale
  de OSM (`telefono`) o de `enlaceExterno`, nunca del sitio que ya no existe.
- **Precios**: sólo los de `docs/OFFERS.md`. Arreglo exprés $120.000 / 2 días;
  landing o página vertical $320.000 lista ($200.000 precio hoy sólo en reunión,
  no en el correo).
- **Sin sitio** (`sinWeb`): el correo va sobre eso —"no encontré una página de
  [negocio]; la gente que los busca llega a [OSM/Booking/Facebook] y no puede
  cotizar"— y ofrece la página vertical de su rubro (`plantilla`).

## Si el lote viene de otro agente (production-data)

`node scripts/importar-hermes.mjs <prospectos.json> <lote>` convierte el archivo
del bot de producción en un lote nuestro: conserva nombre, sitio, comuna, fuente
y redes; **descarta** sus textos de oferta (prometen SEO, Ads y precios que no
son los de OFFERS.md), los enlaces a agregadores y las cadenas. Después sigue el
flujo normal: `prospectar-lote.mjs` y redacción. El sitio de un negocio es su
dominio propio, nunca su ficha en SERNATUR, Booking o una red social.

## Zonas y niveles OSM útiles

| Etapa | `--zona` | `--nivel` |
|---|---|---|
| Valdivia | `Valdivia` | 8 |
| Región de Los Ríos, comuna por comuna | `Los Lagos`, `Panguipulli`, `Futrono`, `Lago Ranco`, `La Unión`, `Río Bueno`, `Paillaco`, `Corral`, `Mariquina`, `Máfil`, `Lanco` | 8 |
| Región completa | `Región de Los Ríos` | 4 |
| Chile, región por región | `Región de Los Lagos`, `Región de La Araucanía`, … | 4 |
| España | `Cantabria`, `Asturias`, `Galicia`, … (`--pais es`) | 4 |

Para España, además: los correos van en español de España (usted, "presupuesto"
en vez de "cotización", "alojamiento rural" en vez de "cabaña"), precios en euros
según la tabla de España en `docs/PROSPECCION_AUTOMATIZADA.md`, y **no se
promueven a la cola de envío por correo hasta que Sebastián confirme el canal
legal** (ver ese documento: LSSI). Se promueven con `contact.type: 'form'` o
`'phone'`.

## Qué NO haces

- No envías correos ni mensajes. No abres WhatsApp. No cambias `status`.
- No editas `app.js`, `config.js` ni nada fuera de `datos/candidatos/`.
- No creas prospectos a mano en `datos/prospectos.json`: siempre por `promover.mjs`.
- No inventas un dato para completar un campo. Un campo vacío es correcto; un
  dato inventado quema al prospecto y a Gramagrowth.
