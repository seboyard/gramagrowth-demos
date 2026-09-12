# Brief: construir demo + correo para un alojamiento (para agentes)

Repo: `C:\Users\sebci\Documents\Gramagrowth`. Trabajas sólo en dos lugares:
`clientes/<slug>/config.js` (que creas con `node scripts/nueva-demo.mjs reserva-cabanas <slug>`)
y la entrada del negocio en su lote `datos/candidatos/<lote>.json`. Nada más.

## Paso 1 — leer el sitio del negocio

Lee la portada y las páginas de habitaciones/cabañas, tarifas y contacto del
sitio indicado. Anota, **sólo si está publicado**:

- nombre exacto, bajada/descripcion, comuna, dirección;
- WhatsApp (número con código país sin `+`), teléfono, correo, Instagram, Facebook;
- unidades: nombre, capacidad, detalle (dormitorios, baño, cocina…);
- tarifas: por unidad o globales, con la temporada o rótulo que el sitio indique
  (ej. "Verano 2025", "temporada alta"). Anota el **año del rótulo**;
- reglas: check in/out, % de abono, recargo una noche, IVA incluido;
- promociones vigentes con fechas;
- amenidades, certificaciones, atractivos cercanos;
- URLs de 2–4 fotos del propio sitio (no de Booking ni de bancos de imágenes).

## Paso 2 — escribir `config.js`

Modelo a copiar: `clientes/hostal-peru/config.js` (hostal, sin tarifas) y
`plantillas/reserva-cabanas/config.js` (cabañas, con tarifas y temporadas).
Lee `plantillas/reserva-cabanas/README.md` para el significado de cada campo.

Reglas:
- `demo.activo: true`, `demo.fuente: '<dominio>'`, `demo.leidoEl: '2026-09-12'`.
- Cada monto sale del sitio. Sin tarifa publicada → `temporadas: []` y una nota
  en `reglas.notas`: "El sitio no publica tarifas: las confirma el anfitrión".
- Tarifas con rótulo de año anterior se usan igual pero con `desde/hasta` del
  próximo verano (2027) y una nota "publicadas como <rótulo>, por confirmar".
- Sin WhatsApp publicado → `whatsapp: ''` (el correo pasa a ser el canal).
- `unidadLabel: 'Habitación'` para hoteles/hostales; omitir para cabañas.
- Comentario de cabecera con fuente, fecha y qué faltó.
- Termina con `node -e "new Function('window', require('fs').readFileSync('clientes/<slug>/config.js','utf8'))({})"` para comprobar que parsea.

## Paso 3 — redactar en el lote

En `datos/candidatos/<lote>.json`, en el objeto del negocio, agrega:

- `findings`: 1–3 frases, cada una respaldada por una señal de `audit.signals`
  (mira `signal.label` y `signal.evidence`) o por algo que leíste en el sitio y
  puedes citar literalmente (tarifa con año vencido, formulario en inglés).
  **Prohibido** hablar de redes sociales o de "no publican hace…".
- `subject`: una línea concreta sobre el hallazgo principal.
- `email`: 120–220 palabras con esta estructura exacta:
  "Hola:\n\nSoy Sebastián, de Gramagrowth (Valdivia). [hallazgo con el detalle
  exacto y por qué le cuesta consultas, 2–3 frases]. [Qué preparé: 'Preparé una
  muestra con sus <n> <unidades>… donde el pasajero elige fechas y cuántos son y
  les manda la consulta completa por WhatsApp, sin comisión'] [Precio: 'La puedo
  dejar publicada en 5 días hábiles por $320.000' — o, si el hallazgo es un
  defecto puntual, 'lo dejo corregido en 2 días por $120.000']. [Pregunta de
  cierre].\n\n--\nSebastián · Gramagrowth · Valdivia\n[TU TELÉFONO] ·
  instagram.com/gramagrowth\nSi prefieres no recibir más correos míos, responde
  \"no\" y no vuelvo a escribir."
  Sin promesas de ventas, reservas ni Google. Sin adjetivos de venta.
- `contact`: `{ type: 'whatsapp'|'email'|'phone'|'form', value, label }` con el
  canal más directo que el sitio publica.
- `offer`: `'landing'` (página de reserva) o `'express'` (defecto puntual).
- `opportunity`: una frase.
- `notes`: `"Demo: clientes/<slug>/ · <qué faltó del sitio>"`.

## Paso 4 — validar

`node scripts/promover.mjs <lote> --dry-run`. Si rechaza tu negocio, corrige lo
que dice el motivo y repite hasta que pase. **No corras sin `--dry-run`**: la
promoción a la cola la hace el coordinador.

## Reporte final (máximo 10 líneas)

Por cada negocio: slug, si el sitio publica tarifas (sí/no), hallazgo principal,
canal de contacto, y "pasa dry-run: sí/no". Nada más.
