# Cotizador de instalación y visita técnica

Página de **solicitud de visita técnica** para instaladores: ventanas,
termopaneles, puertas, aislación, fachadas, revestimientos. La persona carga sus
vanos —ancho, alto, cantidad, tipo de apertura—, la página suma los metros
cuadrados y arma un mensaje completo por WhatsApp o correo. El instalador va a
medir y presupuesta, como ya lo hace.

Por qué este rubro y no otro: [`docs/MERCADO_VALDIVIA.md`](../../docs/MERCADO_VALDIVIA.md).

## Por qué está diseñada así

Es el primer vertical cuyo resultado principal **no es un precio**. Es un
**alcance medido**. Eso es deliberado:

| Riesgo evitado | Por qué no ocurre |
|---|---|
| Prometer un precio que el instalador no dio | La página sólo muestra un rango si el cliente entregó valores por m²; si no, dice que se confirma en la visita |
| Que una medida con huincha se tome por medida de obra | La página y el mensaje dicen "referencial" y "para medir en la visita" en todos los caminos |
| Agenda que sincronizar | No agenda: pide la visita, el equipo la coordina |
| Pasarela de pago | No hay nada que pagar en esta etapa del rubro |

El argumento de venta no es reemplazar a Habitissimo o Cronoshare —esos portales
venden leads al instalador— sino **recibir sin intermediario las consultas que ya
le llegan solas**, y recibirlas con las medidas puestas, para decidir si la
visita vale el traslado antes de subirse a la camioneta.

## Qué se edita por cliente

**Sólo `config.js`.** `index.html`, `styles.css` y `app.js` no se tocan.

| Bloque | Contenido |
|---|---|
| `demo` | Aviso de muestra. **Poner `activo: false` al entregar el sitio real.** |
| `negocio` | Nombre, dirección, WhatsApp (sin +), teléfono, correo, mapa |
| `marca` | Tres colores: tinta, acento y papel |
| `operacion` | Titular, descripción, chips de "incluye", tipos de proyecto |
| `cobertura.comunas` | Lista de comunas atendidas, o `null` para pedir la comuna como texto libre |
| `trabajos` | Un trabajo por servicio publicado, con `medida: 'vano'` o `'superficie'` y sus `materiales` |
| `trabajos[].materiales[].valorM2` | `{ desde, hasta }` por m², o `null` |
| `trabajos[].materiales[].referencia` | `{ fuente, rotulo }`: de dónde salió el valor y de qué año |
| `aperturas` | Tipos de apertura que ofrece el selector de cada vano |
| `adicionales` | Extras con `unidad: 'm2' \| 'vano' \| 'trabajo'`. Vacío → la sección no aparece |
| `minimoM2PorVano` | Mínimo facturable por pieza, o `null` |
| `visita` | `gratuita` y `respuestaHoras`, sólo si el cliente lo publica o lo entrega |
| `reglas`, `contactoDirecto`, `faq` | Textos |

## Regla de honestidad

Cada `valorM2` debe venir del cliente por escrito o de su sitio público. Si no
existe, se deja en `null`: la página muestra el alcance medido y dice que el
valor se confirma en la visita. **Un rango inventado en este rubro es peor que
en los otros**: alguien puede exigirlo como precio.

La configuración incluida usa datos publicados en `tecalumvaldivia.cl`, leídos el
2026-09-10. Ese sitio **no publica ningún valor**, por eso todos los `valorM2`
están en `null`. Los siete trabajos son las opciones de su propio selector de
servicio.

## Dos modos de medida

- **`medida: 'vano'`** — la persona carga ventana por ventana. Es el modo que
  resuelve el problema del rubro: la consulta llega con la lista de vanos.
  Un vano sin ancho o alto no suma; se marca "sin medida" y va igual en la
  solicitud, para medirlo en la visita.
- **`medida: 'superficie'`** — un solo número de m². Para aislación, fachadas,
  revestimientos o tabiquería, donde nadie cuenta piezas.

## Cómo se calcula

1. Por cada vano: `ancho/100 × alto/100 × cantidad`. Si hay `minimoM2PorVano` y
   la pieza mide menos, factura el mínimo y lo dice.
2. Suma los m² reales (los que se muestran) y los facturables (los que se
   multiplican por el valor).
3. Si el material tiene `valorM2`, calcula `desde` y `hasta` sobre los m²
   facturables. Si no, no calcula nada en pesos.
4. Suma adicionales según su unidad.
5. Separa lo que ya incluye IVA de lo que no, y suma IVA sólo a lo segundo.
6. Si el valor tiene un `rotulo` de un año anterior, avisa "por confirmar" y
   lo dice también en el mensaje.
7. Si hay lista de comunas y la elegida no está, avisa sin bloquear.

## Ciclo de reventa

Primera venta: 4–5 días hábiles. Las siguientes, horas.

1. Duplicar a `clientes/<negocio>/` (copiar `index.html`, `styles.css` y `app.js`
   sin tocarlos; escribir sólo `config.js`). La galería en `/clientes/` la
   detecta sola.
2. Pedir al cliente: lista de trabajos, materiales que ofrece, **valores por m²
   por escrito** (o aceptar que no los publica), comunas que atiende, WhatsApp
   de cotizaciones.
3. Rellenar `config.js`. Confirmar cada rango por escrito.
4. `demo.activo: false`.
5. Publicar en su dominio o en un subdominio propio.
6. Probar en celular: agregar tres vanos, quitar uno, mensaje de WhatsApp.

**Precio:** el de toda página vertical, en la tabla única de
[`docs/OFFERS.md`](../../docs/OFFERS.md) ("Catálogo de páginas verticales").
Extras naturales en este rubro: **Ficha de Google ordenada** (el instalador vive
del mapa) y **Respuestas rápidas de WhatsApp** (la consulta ya llega medida; el
cuello de botella pasa a ser contestar). Si el cliente publica valores por m² y
cambian con el dólar o el proveedor, **actualización de tarifas por temporada**.

## Probar en local

```bash
npm.cmd run serve
```

Luego abrir `http://127.0.0.1:4173/plantillas/cotizar-instalacion/`.

## Límites declarados

No incluye: agenda de visitas, medición remota, precio cerrado, pagos, cuentas de
usuario, ni integración con software de cotización del instalador. Cualquiera de
esas cosas cambia el precio, el plazo y el modelo de soporte.
