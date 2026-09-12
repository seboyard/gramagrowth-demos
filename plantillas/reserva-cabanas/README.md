# Reserva directa para cabañas y hospedajes

Página de **solicitud** de reserva. El huésped elige fechas, pasajeros y cabaña;
la página calcula el valor con las reglas del negocio y arma un mensaje completo
por WhatsApp o correo. El anfitrión confirma a mano, como ya lo hace.

## Por qué está diseñada así

La decisión central es que **no confirma reservas**. Eso elimina de un golpe las
tres cosas que harían inviable venderla y mantenerla trabajando solo:

| Riesgo evitado | Por qué no ocurre |
|---|---|
| Doble reserva en enero | No hay calendario que sincronizar con Booking o Airbnb |
| Pasarela de pago | El abono va por transferencia, como ya se hace |
| Caída en fin de semana | Es HTML estático: sin backend, sin base de datos |
| Soporte diario | No hay operación que mantener |

El argumento de venta no es reemplazar a Booking —eso les trae demanda real—
sino **cobrar sin comisión las consultas que ya les llegan solas** por Instagram,
WhatsApp o recomendación. Booking cobra entre 15% y 17% por reserva.

## Qué se edita por cliente

**Sólo `config.js`.** `index.html`, `styles.css` y `app.js` no se tocan.

| Bloque | Contenido |
|---|---|
| `demo` | Aviso de muestra. **Poner `activo: false` al entregar el sitio real.** |
| `negocio` | Nombre, dirección, WhatsApp (sin +), teléfono, correo, mapa |
| `marca` | Tres colores: tinta, acento y papel |
| `propiedad` | Descripción, número de unidades, amenidades, certificaciones |
| `tipos` | Tipos de cabaña: capacidad, `capacidadTarifa` (personas que cubre la tarifa) y, opcionalmente, su propia lista `temporadas` |
| `temporadas` | Tabla global. Sólo se usa para las unidades que no traen la suya. Déjala vacía si cada unidad tiene tarifas distintas |
| `noDisponibles` | Rangos ya tomados, editados a mano: `{ desde, hasta, nota }`. No es sincronización con Booking |
| `reservaDirecta` | Razones para reservar directo, mostradas al huésped |
| `promociones` | Paquetes por número de noches, con rango de vigencia |
| `reglas` | Check in/out, % de abono, recargo por una noche, notas |
| `faq` | Preguntas frecuentes |
| `atractivos` | Qué visitar cerca |

## Regla de honestidad

Cada monto de `config.js` debe venir del cliente o de su sitio público. Si un
dato no existe, se deja fuera: la página muestra "a confirmar" en lugar de
inventarlo. Un precio inventado en una muestra quema el prospecto y la reputación.

La configuración incluida usa datos publicados en `cabanasriobaker.cl` leídos el
2026-09-10, bajo el rótulo "Verano 2025". **Deben confirmarse antes de publicar.**

## Tarifas por unidad

Cuando cada cabaña tiene precios distintos, se le pone su propia lista `temporadas`
dentro de `tipos`. La tarjeta de tarifas y el "desde" de cada tarjeta cambian solos
al elegir unidad. Si una unidad no trae tarifas, la página lo dice y la consulta
sale igual, con el valor a confirmar.

## Campos opcionales

- `negocio.whatsapp` vacío: se ocultan los botones de WhatsApp y el correo pasa a
  ser el canal principal. Útil para quien sólo publica teléfono fijo.
- `negocio.telefono` / `negocio.email` vacíos: se ocultan del pie.
- `negocio.mapaEmbed`: URL de mapa embebido. Si no está, se arma desde la dirección.
- `reglas.abonoPorcentaje` en 0: no se muestra la línea de abono en vez de imprimir
  "$0", que parece un error.

## Cómo se calcula

1. Cuenta las noches entre llegada y salida.
2. Asigna a cada noche la tarifa de su temporada. Noches sin temporada publicada
   se marcan como "a confirmar" y no se suman.
3. Si la estadía es de una sola noche, aplica `recargoUnaNoche`.
4. Si alguna promoción coincide en número de noches, la llegada cae en vigencia
   y el precio resulta menor, la aplica.
5. Calcula el abono según `abonoPorcentaje`.
6. Si los pasajeros superan `capacidadTarifa`, lo advierte y lo incluye en la
   consulta en vez de suponer un recargo.

## Ciclo de reventa

Primera venta: 4-5 días hábiles. Las siguientes, horas.

1. Duplicar la carpeta a `clientes/<negocio>/` (copiar `index.html`, `styles.css` y
   `app.js` sin tocarlos; escribir sólo `config.js`). La galería en `/clientes/` la
   detecta sola.
2. Pedir al cliente: tarifas por temporada, reglas, fotos y WhatsApp de reservas.
3. Rellenar `config.js`. Confirmar cada monto por escrito.
4. `demo.activo: false`.
5. Publicar en su dominio o en un subdominio propio.
6. Probar en celular: fechas, promoción, mensaje de WhatsApp.

**Precio:** el de toda página vertical, en la tabla única de
[`docs/OFFERS.md`](../../docs/OFFERS.md) ("Catálogo de páginas verticales").
Sin mensualidad obligatoria; el hosting con cambios de tarifa por temporada es el
extra "Actualización de tarifas por temporada", cotizado aparte.

## Probar en local

```bash
npm.cmd run serve
```

Luego abrir `http://127.0.0.1:4173/plantillas/reserva-cabanas/`.

## Límites declarados

No incluye: disponibilidad en tiempo real, sincronización con Booking o Airbnb,
pagos en línea, cuentas de usuario, ni confirmación automática de reservas.
Cualquiera de esas cosas cambia el precio, el plazo y el modelo de soporte.
