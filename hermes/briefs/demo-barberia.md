# Brief: construir demo + mensaje para una barbería, peluquería o salón (para agentes)

Repo: `C:\Users\sebci\Documents\Gramagrowth`. Trabajas sólo en dos lugares:
`clientes/<slug>/config.js` (que creas con `node scripts/nueva-demo.mjs reservar-hora <slug>`)
y la entrada del negocio en su lote `datos/candidatos/<lote>.json`. Nada más.
Los lotes de este rubro se llaman `<comuna>-barberias-<fecha>` y su
`plantilla` es `reservar-hora`.

## Qué cambia en este rubro

Casi ningún negocio tiene sitio: en el lote de Valdivia del 2026-09-13 salieron
28 y sólo 1 con dominio (y caído). El canal es **Instagram y WhatsApp**. Lo que
se vende es que el cliente pueda **pedir hora desde el celular** sin escribir
"¿tienes hora hoy?" y esperar.

## Paso 1 — leer lo que el negocio publica

Fuentes, en este orden: el sitio (si `website` existe y responde), el perfil
enlazado en `enlaceExterno` (Instagram o Facebook), y la ficha de OSM
(`telefono`, `direccion`). Anota, **sólo si está publicado**:

- nombre exacto, bajada, comuna, dirección;
- WhatsApp (número con código país sin `+`), teléfono, Instagram, Facebook;
- servicios con nombre tal como los escriben (corte, barba, corte + barba,
  color, alisado, manicure…), y el **precio si está publicado** (en la bio, en
  un destacado de "precios" o en una publicación con fecha; anota la fecha);
- duración por servicio sólo si la publican; si no, se deja el valor por
  defecto de la plantilla y se anota;
- horario por día (bio de Instagram, `opening_hours` de OSM, foto de la puerta);
- profesionales, sólo si el negocio los nombra públicamente como equipo;
- URLs de 2–4 fotos propias del negocio (no de bancos de imágenes).

Lo que **no puedes** leer ni afirmar: cuánto publican, cuántos seguidores
tienen, si responden rápido. Eso no se sabe y no se escribe.

## Paso 2 — escribir `config.js`

Modelo a copiar: `plantillas/reservar-hora/config.js` y su `README.md` (la
está construyendo otro agente; si la carpeta no existe todavía, para y
repórtalo, no la crees). Sigue el patrón de las demás plantillas:
`window.HORA_CONFIG` con bloques `demo`, `negocio`, `servicios`, `horario`,
`profesionales`.

Reglas:
- `demo.activo: true`, `demo.fuente: '<instagram.com/handle o dominio>'`,
  `demo.leidoEl: '<fecha>'`.
- `servicios`: lista de `{ nombre, duracionMinutos, precio }`. Cada precio sale
  de lo publicado; **sin precio publicado → `precio: null`** (la página muestra
  "consultar") y una nota en el comentario de cabecera. No inventes duraciones
  para vender "agenda exacta": usa el valor por defecto de la plantilla y anótalo.
- `horario`: por día, con lo publicado. Día no publicado → cerrado o vacío,
  nunca un horario supuesto.
- `profesionales`: opcional. Sólo nombres que el negocio publica como equipo;
  si no, se omite y la hora se pide "con quien esté disponible".
- Sin WhatsApp publicado → `whatsapp: ''` y el botón cae al teléfono o a
  Instagram, lo que exista.
- Comentario de cabecera con fuente, fecha y qué faltó.
- Termina con `node -e "new Function('window', require('fs').readFileSync('clientes/<slug>/config.js','utf8'))({})"` para comprobar que parsea.

## Paso 3 — redactar en el lote

En `datos/candidatos/<lote>.json`, en el objeto del negocio, agrega:

- `findings`: 1–3 frases. Hallazgos válidos en este rubro, cada uno respaldado
  por `sinWeb: true`, por una señal de `audit.signals` (mira `signal.label` y
  `signal.evidence`) o por algo que puedes citar literalmente de lo publicado:
  - **sin forma de pedir hora desde el celular**: no hay sitio, ni enlace de
    agenda, ni botón de WhatsApp publicado; sólo un DM o un teléfono;
  - **precios no publicados**: la bio y los destacados no dicen cuánto cuesta
    el corte (cítalo así: "en el perfil no aparece el valor del corte");
  - **sitio caído** (`dominio-caido`, `pagina-estacionada`, `sitio-con-error`):
    el dominio que figura en el mapa no responde;
  - **sólo Instagram** (`enlaceExterno` a instagram.com y `sinWeb: true`): quien
    busca en Google llega al mapa y no puede ver servicios ni pedir hora.
  **Prohibido** decir que la cuenta está "inactiva", "abandonada", que "no
  publican hace…", o hablar de seguidores o alcance.
- `subject`: una línea concreta sobre el hallazgo principal ("Pedir hora en
  [negocio] desde el celular", "El dominio de [negocio] no responde").
- `offer` y precio, según `docs/OFFERS.md`:
  - `'landing'` (página vertical `reservar-hora`, $320.000 lista; el precio hoy
    sólo se dice en la reunión) cuando no hay sitio o está caído;
  - `'express'` (arreglo exprés, $120.000 / 2 días) sólo si hay sitio vivo con
    un defecto puntual demostrable.
- `email`, según el canal:
  - **Con correo publicado** (OSM o sitio): 120–220 palabras con la estructura de
    `hermes/briefs/demo-alojamiento.md`: "Hola:\n\nSoy Sebastián, de Gramagrowth
    (Valdivia). [hallazgo con el detalle exacto y por qué le cuesta consultas].
    [Qué preparé: 'Preparé una muestra con sus servicios donde el cliente elige
    servicio, día y hora y les manda la solicitud por WhatsApp']. [Precio y
    plazo]. [Pregunta de cierre].\n\n--\nSebastián · Gramagrowth · Valdivia\n
    [TU TELÉFONO] · instagram.com/gramagrowth\nSi prefieres no recibir más
    correos míos, responde \"no\" y no vuelvo a escribir."
  - **Sin correo ni web** (la mayoría): el campo `email` es el **texto para
    mandar por WhatsApp o Instagram**: 60–120 palabras, sin firma de correo,
    sin asunto dentro del texto. Saludo → quién soy y de dónde → el hallazgo en
    una frase → qué preparé y el enlace a la demo → precio de OFFERS.md →
    pregunta de cierre → línea de salida: "Si prefieres que no te escriba más,
    responde \"no\" y no vuelvo a escribir." Ojo: `promover.mjs` exige un
    mínimo de 200 caracteres; 60 palabras lo cumplen.
  Sin promesas de clientes, reservas ni Google. Sin adjetivos de venta.
- `contact`: `{ type: 'whatsapp'|'instagram'|'phone'|'email', value, label }`
  con el canal más directo publicado. `whatsapp` sólo si el número aparece como
  WhatsApp; un teléfono fijo de OSM es `phone`. Sin ninguno → `type: 'none'`,
  `email` y `subject` vacíos, y en `notes` "buscar canal en Google Maps".
- `opportunity`: una frase.
- `notes`: `"Demo: clientes/<slug>/ · <qué faltó>"`.

## Paso 4 — validar

`node scripts/promover.mjs <lote> --dry-run`. Si rechaza tu negocio, corrige lo
que dice el motivo y repite hasta que pase. **No corras sin `--dry-run`**: la
promoción a la cola la hace el coordinador.

## Reporte final (máximo 10 líneas)

Por cada negocio: slug, si publica precios (sí/no), hallazgo principal, canal
(`whatsapp`/`instagram`/`phone`/`email`/`none`), y "pasa dry-run: sí/no".
