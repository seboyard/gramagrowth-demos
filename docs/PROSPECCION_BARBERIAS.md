# Prospección — barberías, peluquerías y salones (Los Ríos, 2026-09-13)

Corrida de `scripts/descubrir.mjs --rubro barberias` (filtros OSM
`shop=hairdresser|beauty|massage` y `craft=hairdresser`) sobre Valdivia y ocho
comunas de la región, más `prospectar-lote.mjs` en cada lote. Plantilla del
rubro: `reservar-hora` (en construcción). Brief para redactar:
`hermes/briefs/demo-barberia.md`.

## Candidatos por comuna

| Lote | Elementos OSM | Candidatos | Con sitio | Sin sitio | Con teléfono/correo en OSM |
|---|---:|---:|---:|---:|---:|
| `valdivia-barberias-2026-09-13` | 31 | 28 | 1 | 27 | 3 |
| `la-union-barberias-2026-09-13` | 10 | 10 | 0 | 10 | 1 |
| `los-lagos-barberias-2026-09-13` | 6 | 6 | 0 | 6 | 0 |
| `futrono-barberias-2026-09-13` | 3 | 3 | 0 | 3 | 0 |
| `panguipulli-barberias-2026-09-13` | 1 | 1 | 0 | 1 | 0 |
| `rio-bueno`, `paillaco`, `mariquina`, `lanco` | 0 | 0 | 0 | 0 | 0 |
| **Total** | **51** | **48** | **1** | **47** | **4** |

Los cuatro ceros se reconfirmaron con una segunda consulta a Overpass (200 sin
`remark`): OSM no tiene peluquerías con nombre en esas comunas. En Valdivia, 3
elementos se descartaron por nombre duplicado.

Lo que OSM aporta en este rubro: nombre y calle en casi todos, teléfono en 4,
correo en 1, y **ningún `contact:instagram`** en los 48 (se revisaron los tags
crudos del lote de Valdivia; sólo The Gentlemans trae un enlace a Facebook, que
`descubrir.mjs` ya deja en `enlaceExterno`). Conclusión: el canal (Instagram o
WhatsApp) hay que buscarlo a mano en Google Maps o Instagram antes de redactar;
el mapa sólo dice dónde está el negocio.

## Los 10 mejores por puntaje

Los tres primeros y Charme puntúan por tener canal; del resto (todos con 9 puntos:
sin sitio + vertical, sin canal) se listan los que tienen nombre propio y calle
publicada. PreUnic (cadena de retail, `shop=beauty`) se excluye.

| # | Negocio | Comuna | Puntaje | Canal hoy | Hallazgo que abre |
|---|---|---|---:|---|---|
| 1 | Bambu Medical Spa | Valdivia | 13 | correo `bambumedicalspa@gmail.com` y tel. +56 63 251 5016 (OSM) | `dominio-caido`: `bambumedicalspa.cl` no existe (NXDOMAIN). Oferta: landing `reservar-hora` |
| 2 | Renattos Unisex | Valdivia | 11 | tel. +56 63 2 259463 (OSM) → llamada | `sinWeb`: sin forma de pedir hora desde el celular |
| 3 | Camila (estética) | Valdivia | 11 | tel. +56 9 9673 9711 (OSM) → probable WhatsApp, confirmar | `sinWeb`: sin forma de pedir hora desde el celular |
| 4 | Peluquería Charme | La Unión | 11 | tel. +56 64 2 322842 (OSM) → llamada | `sinWeb`: sin forma de pedir hora desde el celular |
| 5 | The Gentlemans | Valdivia | 9 | Facebook (`enlaceExterno`) → mensaje | `sinWeb`, sólo red social: quien busca llega al mapa y no puede pedir hora |
| 6 | Cut Studio | Valdivia | 9 | ninguno en OSM (Anfión Muñoz 360) → buscar Instagram | `sinWeb` |
| 7 | Barberia Brunetti | Valdivia | 9 | ninguno en OSM → buscar Instagram | `sinWeb` |
| 8 | Peluquería y Estética Seth | Valdivia | 9 | ninguno en OSM (Av. Italia 1721) → buscar Instagram | `sinWeb` |
| 9 | Peluquería Génesis | Valdivia | 9 | ninguno en OSM (Vial Solar 892) → buscar Instagram | `sinWeb` |
| 10 | Salon de Belleza Darling | Los Lagos | 9 | ninguno en OSM (Balmaceda Norte 68) → buscar Instagram | `sinWeb` |

En todos los `sinWeb` el hallazgo permitido es el mismo: no hay página donde
ver servicios y pedir hora; precios no publicados sólo se puede afirmar después
de leer el perfil (ver brief). Ninguna otra señal del auditor existe en el rubro
porque sólo hubo un sitio que auditar.

## Qué sigue

1. Esperar `plantillas/reservar-hora/` (otro agente) y armar la demo genérica del
   rubro con datos de un negocio que publique precios.
2. Para los 10 de arriba: buscar el perfil de Instagram o el WhatsApp en Google
   Maps, anotarlo en `contact` y redactar según `hermes/briefs/demo-barberia.md`.
   Para los 44 sin canal en OSM no se redacta nada hasta tener canal.
3. Bambu Medical Spa es el único con dominio propio y está caído: contacto por el
   correo de OSM, oferta landing. Reconfirmar el DNS el día del envío.
4. `node scripts/promover.mjs <lote> --dry-run` antes de promover; hoy no se
   promovió nada.
