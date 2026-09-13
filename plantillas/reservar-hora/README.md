# Reserva de hora para barberías, peluquerías y salones

Página pública para barberías, peluquerías, salones de belleza y manicure.
La persona elige servicio, profesional (si el negocio lo ofrece), día y bloque
horario; ve la duración y el valor publicado; y la solicitud sale escrita por
WhatsApp para que el negocio la confirme.

> Este README documenta la plantilla tal como está implementada. Si encuentras
> una diferencia entre lo descrito aquí y el comportamiento real, gana el código.

## Por qué está diseñada así

Igual que el resto de las plantillas del repo: **arma la solicitud, no reserva
ni cobra.** No hay agenda sincronizada, no hay pasarela de pago y no hay
backend. El negocio mira su cuaderno o su agenda y responde por WhatsApp, como
ya lo hace. Lo que cambia es que el mensaje llega completo.

## El problema que resuelve, en concreto

Hoy la consulta típica es "¿tienen hora para mañana?" y detrás vienen cinco
mensajes: qué servicio, a qué hora, con quién, cuánto sale, si atienden niños.
Los negocios que ya tienen agenda en línea la tienen dentro de un iframe de una
plataforma de terceros, con cuenta obligatoria para el cliente y sin el precio
a la vista hasta el último paso.

La configuración incluida es un caso real. En `barberiaovejanegra.cl` y su
agenda pública en `ovejanegra24.site.agendapro.com`, leídos el 2026-09-13:

| Servicio | Duración | Valor publicado |
|---|---:|---:|
| Corte de cabello | 30 min | $14.000 |
| Corte de cabello niño (hasta 10 años) | 30 min | $12.000 |
| Perfilado de barba con toallas | 30 min | $12.000 |
| Afeitado al ras con toallas calientes | 60 min | $18.000 |
| Corte y perfilado de barba | 60 min | $22.000 |
| Corte y afeitado al ras | 60 min | $26.000 |
| Corte al ras y perfilado con toallas | 60 min | $27.000 |
| Afeitado al ras y corte al ras | 90 min | $31.000 |

Horario publicado: lunes a viernes 10:00–20:00, sábado 10:30–16:30, domingo
cerrado. Dos barberos con nombre en la agenda. El sitio también publica
membresías; la página las menciona en las preguntas frecuentes y no las cotiza.

## Qué se edita por cliente

**Sólo `config.js`.** `index.html`, `styles.css` y `app.js` no se tocan.
El global que declara es `window.HORA_CONFIG`.

| Bloque | Contenido |
|---|---|
| `demo` | Aviso de muestra con `activo`, `aviso`, `fuente` y `leidoEl`. **Poner `activo: false` al entregar el sitio real.** |
| `negocio` | Nombre, bajada, comuna, dirección y canales de contacto |
| `marca` | Colores de la página (`tinta`, `acento`, `papel`) |
| `operacion` | Titular, descripción y lista `incluye` de la sección de servicios |
| `horario` | `bloqueMinutos` y `semana` con `{ apertura, cierre }` por día, o `null` si cierra |
| `servicios` | `id`, `nombre`, `duracionMinutos`, `precio` (o `null`), `detalle`, `referencia` |
| `profesionales` | `id`, `nombre`, `servicios` (ids; vacío = todos). Lista vacía → no se pregunta |
| `reglas` | `anticipacionMinimaHoras` y `notas` mostradas al visitante |
| `contactoDirecto` | Por qué pedir la hora directo y no por una plataforma |
| `faq` | Preguntas frecuentes |

## Regla de honestidad

Cada precio sale del sitio público del cliente o de material que él entregue.
Un servicio sin precio publicado va en `precio: null`: la página muestra
"consultar", el resumen dice "a confirmar" y el mensaje sale con "Valor
publicado: a confirmar". La solicitud se puede enviar igual.

Cada servicio con precio lleva `referencia: { fuente, rotulo }` con de dónde
salió el valor. En modo demo la página lo muestra bajo el precio; en el sitio
real no aparece.

Antes de publicar cualquier página real hay que confirmar por escrito con el
cliente los valores, las duraciones, el horario y qué profesional hace qué.

## Cómo arma los bloques

1. Toma el día de la semana de la fecha elegida y busca su horario en
   `horario.semana`. Si es `null`, avisa que el local está cerrado.
2. Genera bloques cada `horario.bloqueMinutos` desde la apertura, y ofrece
   sólo los que **terminan antes del cierre** según la `duracionMinutos` del
   servicio. Un afeitado de 60 minutos no se ofrece a las 19:30 si cierran a
   las 20:00.
3. Descarta los bloques que ya pasaron o caen dentro de
   `reglas.anticipacionMinimaHoras` contado desde ahora.
4. Al cargar, la fecha parte en el primer día con al menos un bloque, buscando
   hasta dos semanas hacia adelante.
5. No consulta ninguna agenda: el bloque ofrecido puede estar tomado, y por eso
   el mensaje termina con "¿Tienen ese horario disponible?".

El mensaje que sale por WhatsApp:

```
Hola <negocio>, quiero reservar una hora:

Servicio: Corte de cabello (30 min)
Profesional: Eduardo Arancibia
Día: martes, 15 de septiembre de 2026
Hora: 11:30
Valor publicado: $14.000

¿Tienen ese horario disponible?
```

La línea de profesional sólo aparece si el config trae `profesionales`; sin
preferencia dice "sin preferencia".

## Ciclo de reventa

1. Duplicar la carpeta a `clientes/<negocio>/` (copiar `index.html`,
   `styles.css` y `app.js` sin tocarlos; escribir sólo `config.js`). La galería
   en `/clientes/` la detecta sola.
2. Pedir al cliente: lista de servicios con duración y precio, horario por día,
   nombres de los profesionales y qué hace cada uno, y con cuánta anticipación
   acepta solicitudes.
3. Rellenar `config.js` y confirmar cada precio y duración por escrito.
4. `demo.activo: false`.
5. Probar en celular: elegir servicio, día y bloque, y revisar el mensaje.

**Precio:** el de toda página vertical, en la tabla única de
[`docs/OFFERS.md`](../../docs/OFFERS.md) ("Catálogo de páginas verticales").
Extra frecuente en este rubro: ficha de Google y redes sociales, porque la
mayoría de estos negocios vive en Instagram.

## Probar en local

```bash
npm.cmd run serve
```

Luego abrir `http://127.0.0.1:4173/plantillas/reservar-hora/`.

## Límites declarados

No incluye: agenda en tiempo real, bloqueo de horas ya tomadas, pagos en línea,
recordatorios automáticos ni sincronización con plataformas de reserva.
Cualquiera de esas cosas cambia el precio, el plazo y el modelo de soporte.
