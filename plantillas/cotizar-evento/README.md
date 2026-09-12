# Cotizador de eventos y banquetería

Página pública para banqueterías, centros de eventos y servicios de catering.
El visitante elige servicio, fecha y número de invitados; la página calcula el
valor con las reglas del negocio —mínimo de invitados, IVA, adicionales, abono—
y envía la consulta ya completa por WhatsApp o correo.

> Este README documenta la plantilla tal como está implementada. Fue escrito
> revisando `config.js` y `app.js`, no por quien los programó: si encuentras una
> diferencia entre lo descrito aquí y el comportamiento real, gana el código.

## Por qué está diseñada así

Igual que el resto de las plantillas del repo: **cotiza, no cobra ni confirma.**
Sin pasarela de pago, sin calendario sincronizado y sin backend. El dueño
confirma disponibilidad a mano, como ya lo hace.

## El problema que resuelve, en concreto

En este rubro la cotización vive repartida en PDF descargables, uno por
servicio, cada uno con su mínimo de personas, su porcentaje de abono y su plazo.
Nadie los compara: el cliente escribe "quiero cotizar un matrimonio" y empiezan
seis mensajes de ida y vuelta.

La configuración incluida es un caso real. En `bdbanqueteria.com`, leído el
2026-09-10, los ocho PDF publicados dicen:

| Servicio | Año rotulado en el PDF | Mínimo | Valor por persona | Abono | Plazo |
|---|---|---:|---|---:|---|
| Matrimonio completo | 2025 | 40 | no publicado | 60% | 10 días hábiles |
| Matrimonio tres tiempos | 2025 | 40 | no publicado | 60% | 10 días hábiles |
| Matrimonio buffet de postres | 2025 | 40 | no publicado | 60% | 10 días hábiles |
| Cóctel gourmet | sin año legible | 30 | no publicado | 50% | no declarado |
| Cóctel sencillo | 2024 | 40 | $7.500 + IVA | 50% | no declarado |
| Coffee break | 2024 | 50 | $5.500 / $6.000 / $7.000 + IVA | 60% | 7 días hábiles |
| Almuerzo | 2023 | 40 | no publicado | 60% | 7 días hábiles |
| Cóctel, almuerzo y once | 2024 | 40 | no publicado | 60% | 10 días hábiles |

Tres porcentajes de abono distintos, dos plazos distintos, tres mínimos
distintos y valores rotulados hasta con tres años de desfase. La página no
inventa una versión única: muestra la regla que corresponde al servicio elegido
y avisa cuándo la tarifa viene de un documento antiguo.

## Qué se edita por cliente

**Sólo `config.js`.** `index.html`, `styles.css` y `app.js` no se tocan.
El global que declara es `window.EVENTO_CONFIG`.

| Bloque | Contenido |
|---|---|
| `demo` | Aviso de muestra. **Poner `activo: false` al entregar el sitio real.** |
| `negocio` | Nombre, bajada, comuna, cobertura y canales de contacto |
| `marca` | Colores de la página |
| `impuestos` | Manejo de IVA sobre los valores publicados |
| `operacion` | Condiciones operativas del servicio |
| `servicios` | Cada servicio con `minimoInvitados`, `opciones`, `abono` y `documento` de origen |
| `adicionales` | Extras cotizables aparte |
| `fechasTomadas` | Fechas ya comprometidas, marcadas a mano |
| `reglas` | Notas de contratación mostradas al visitante |
| `contactoDirecto` | Canal directo cuando la cotización no aplica |
| `faq` | Preguntas frecuentes |

Cada opción de servicio lleva `valorPorInvitado` e `ivaIncluido`. Un valor no
publicado va en `null` y la página lo muestra como a confirmar, en vez de
inventar un monto.

## Regla de honestidad

La configuración incluida usa datos públicos de `bdbanqueteria.com` y de sus PDF
de cotización, leídos el 2026-09-10. Varios servicios tienen `valorPorInvitado`
en `null` porque el valor no está publicado: eso es deliberado.

Antes de publicar cualquier página real hay que confirmar por escrito con el
cliente los valores, los mínimos de invitados y los porcentajes de abono.

Dos mecanismos hacen esto automático:

- **`valorPorInvitado: null`** — el servicio se puede cotizar igual. La página
  dice que el valor lo confirma el equipo, y el mensaje lo deja escrito.
- **`documento.rotulo`** — el año impreso en el documento del que salió el
  valor. Si es anterior al año en curso, la página avisa "por confirmar" sola,
  y esa nota viaja también en el mensaje que recibe el negocio. Cuando el
  cliente entrega sus valores vigentes se actualiza el rótulo y el aviso
  desaparece. `npm test` falla si un servicio publica un valor sin declarar de
  qué documento salió.

## Cómo se calcula

1. Comprueba que la fecha no esté en `fechasTomadas`.
2. Comprueba que los invitados alcancen el mínimo del servicio. Si no, lo dice
   y no cotiza: contratar bajo el mínimo no es una decisión de la página.
3. Multiplica el valor por persona de la opción elegida por el número de
   invitados. Sin valor publicado, marca el tramo como "a confirmar".
4. Suma los adicionales seleccionados, por invitado o por evento.
5. Suma el IVA sobre los montos declarados sin impuesto.
6. Calcula el abono con el porcentaje del servicio elegido.
7. Si al evento le quedan menos días hábiles que el plazo de abono del
   servicio, lo avisa. **No bloquea**: el equipo puede aceptar una excepción.
   El cálculo descuenta sábados y domingos, no feriados, y por eso el aviso
   dice "aproximadamente".

## Ciclo de reventa

1. Duplicar la carpeta a `clientes/<negocio>/` (copiar `index.html`,
   `styles.css` y `app.js` sin tocarlos; escribir sólo `config.js`). La galería
   en `/clientes/` la detecta sola.
2. Pedir al cliente: servicios con valor por invitado, mínimos, adicionales,
   reglas de abono y fechas ya comprometidas.
3. Rellenar `config.js` y confirmar cada monto por escrito.
4. `demo.activo: false`.
5. Probar en celular: elegir servicio, fecha e invitados, y revisar el mensaje.

**Precio:** el de toda página vertical, en la tabla única de
[`docs/OFFERS.md`](../../docs/OFFERS.md) ("Catálogo de páginas verticales").
Extra frecuente en este rubro: actualización de tarifas por temporada.

## Probar en local

```bash
npm.cmd run serve
```

Luego abrir `http://127.0.0.1:4173/plantillas/cotizar-evento/`.

## Límites declarados

No incluye: pagos en línea, confirmación automática de fechas, sincronización con
calendarios externos, ni gestión de proveedores. Cualquiera de esas cosas cambia
el precio, el plazo y el modelo de soporte.
