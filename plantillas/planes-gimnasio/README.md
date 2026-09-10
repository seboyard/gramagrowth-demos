# Planes y clase de prueba para gimnasios y estudios

Página pública para gimnasios, box de CrossFit y estudios de yoga o pilates.
Compara los planes calculando el **precio por mes** y el **ahorro real frente a
pagar mensual**, y envía una solicitud de clase de prueba con nombre, plan de
interés y horario preferido.

## Por qué está diseñada así

Los SaaS de gestión para gimnasios en Chile (GymPlus, FitnessBrain, GymHub,
Turnito) son herramientas internas: socios, cobros, asistencia. **Ninguno le hace
la página pública al gimnasio.** Ahí está el hueco.

Y hay una cuenta que casi ningún gimnasio muestra, aunque su negocio depende de
ella: **cuánto sale por mes el plan largo y cuánto se ahorra frente al mensual.**
Convertir mensuales en anuales es el objetivo comercial del rubro, y la página lo
hace explícito en vez de dejarlo a que el visitante lo calcule.

| Riesgo evitado | Por qué no ocurre |
|---|---|
| Pasarela de pago | No vende: envía una solicitud, el gimnasio cobra como ya lo hace |
| Cuentas de socios | No hay login ni datos personales almacenados |
| Caída en hora punta | Es HTML estático: sin backend, sin base de datos |
| Choque con su software | No toca la gestión interna; sólo la cara pública |

## Qué se edita por cliente

**Sólo `config.js`.** `index.html`, `styles.css` y `app.js` no se tocan.

| Bloque | Contenido |
|---|---|
| `demo` | Aviso de muestra. **Poner `activo: false` al entregar el sitio real.** |
| `negocio` | Nombre, dirección, WhatsApp (sin +), teléfono, correo, Instagram, mapa |
| `marca` | Tres colores: tinta, acento y papel |
| `centro` | Titular, descripción e instalaciones |
| `planes` | `{ id, nombre, precio, meses, matricula, incluye, destacado, nota }` |
| `servicios` | Servicios con valor publicado aparte de la membresía |
| `clases` | Nombres de las clases dirigidas |
| `horarios` | `{ dia, desde, hasta }` |
| `prueba` | Título y texto del bloque de clase de prueba |
| `reglas` | Notas al pie de la tarjeta de servicios |
| `faq` | Preguntas frecuentes |

## Cómo se calcula

1. Precio por mes = `precio / meses`.
2. El ahorro se compara contra el **plan mensual publicado**. Sin un plan de
   `meses: 1` con precio, no hay ahorro que mostrar y no se inventa ninguno.
3. Ahorro = `(mensual × meses) − precio`, con su porcentaje.
4. La matrícula se muestra aparte, nunca sumada al precio por mes.

## Regla de honestidad

Un plan sin precio publicado va con `precio: null` y la página muestra
**"Consultar"**. Si ningún plan tiene precio, aparece un aviso único explicando
que hay que preguntar, en vez de repetir "consultar" en cada tarjeta.

La configuración incluida usa datos de `sportlifevaldivia.cl` leídos el
2026-09-10. Ese sitio **no publica el valor de ningún plan de membresía** —su
página "Planes" es sólo un formulario de contacto— así que los dos planes van en
`null` a propósito: la muestra evidencia el hueco en vez de taparlo.

Sí publica el valor de tres servicios (Personal Trainer $40.900, Nutrición
$24.900, Sport Kids $14.900) y esos van cargados como están.

## Ciclo de reventa

Primera venta: 3-4 días hábiles. Las siguientes, horas.

1. Duplicar la carpeta a `clientes/<negocio>/` (copiar `index.html`,
   `styles.css` y `app.js` sin tocarlos; escribir sólo `config.js`). La galería
   en `/clientes/` la detecta sola.
2. Pedir al cliente: planes con precio y duración, matrícula, horarios y clases.
3. Rellenar `config.js`. Confirmar cada monto por escrito.
4. `demo.activo: false`.
5. Publicar y probar en celular: elegir plan, ver el ahorro, enviar la solicitud.

**Precio sugerido:** $250.000–350.000 CLP de instalación. Extra frecuente en este
rubro: gestión de redes, $180.000/mes (ver `docs/OFFERS.md`).

## Un límite al vender

Una membresía es recurrente, así que el dueño puede calcular cuánto vale un socio
al año. Esa aritmética es suya y es cierta. **Decirla como "vas a conseguir un
socio más al mes" es prometer resultados**, y las reglas de `docs/OFFERS.md` lo
prohíben. La frase se queda del lado de la cuenta, nunca de la promesa.

## Probar en local

```bash
npm.cmd run serve
```

Luego abrir `http://127.0.0.1:4173/plantillas/planes-gimnasio/`.

## Límites declarados

No incluye: venta ni cobro de membresías, control de acceso, reserva de cupos en
clases, cuentas de socio ni integración con el software de gestión del gimnasio.
Cualquiera de esas cosas cambia el precio, el plazo y el modelo de soporte.
