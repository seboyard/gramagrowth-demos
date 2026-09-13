# Revisión del lote de prospectos del agente Hermes (2026-09-12)

Fuente revisada: repositorio `seboyard/production-data`, archivo `prospectos.json`
(64 registros, commit "VPS Bot: synced Gramagrowth + FondosChile", 2026-09-12
15:48 UTC). Copia local de trabajo en el scratchpad de esta sesión; no se
incorporó nada al repo.

## Resultado

| Grupo | Registros | Qué son | Útiles |
|---|---:|---|---:|
| `gramagrowth-original` + `gramagrowth-prospectar` | 24 | Copia de nuestra propia cola (18) más 6 duplicados de los mismos | 0 |
| `ASECH` + `ASECH Miembros` | 19 | Ítems del menú de asech.cl: "Quiénes Somos", "Alianzas", "Contáctanos", "Logo Carrusel", "Todo sobre las elecciones →" | 0 |
| `ChileAtiende Gobierno` + `scraped-batch` | 17 | Sitios de gobierno: ChileAtiende, CORFO, SERCOTEC, INDAP, ChileCompra, SUBDERE, digital.gob.cl | 0 |
| `YellowPages Chile` | 4 | Enlaces de la interfaz de yellowpages.cl, incluido `main2.min.css` | 0 |
| **Total** | **64** | | **0** |

Todos los registros están en `status: procesado`. El campo `contact` es en todos
los casos `{"type":"web","value":<misma URL>,"label":"Sitio detectado"}` y
`opportunity` es una plantilla fija ("Negocio local … con presencia web;
oportunidad de landing/automatización/indexación"). `production_stats.json`
contiene los nombres de los campos como valores.

## Diagnóstico

El agente confundió **enlaces encontrados en una página** con **negocios**. No
hubo paso de verificación: ni comprobación de que la URL fuera un negocio, ni
auditoría del sitio, ni canal de contacto real. Es exactamente el fallo que la
compuerta `scripts/promover.mjs` está diseñada para rechazar: ninguno de los 64
tiene hallazgos respaldados, y 40 no son negocios.

Lo que sí es rescatable: la **intención de fuente**. Directorios como
yellowpages.cl y gremios como ASECH sí listan negocios; hay que entrar a las
fichas de los negocios, no a los menús del directorio.

## Segundo lote (2026-09-13): 234 registros, 40 aprovechables

El agente cambió de fuente y esta vez sí trajo negocios: el **registro de
prestadores de SERNATUR** (Los Lagos, Araucanía, Valparaíso), más yelu.cl y
Páginas Amarillas. Revisado con `scripts/importar-hermes.mjs`:

| Grupo | Registros | Qué se hizo |
|---|---:|---|
| Enlaces a agregadores (ficha SERNATUR, Booking, redes) como si fueran el sitio | 161 | Descartados: no son el sitio del negocio. Muchos son alojamientos **sin web propia**, útiles en el futuro si se extrae el teléfono de la ficha |
| Ya en nuestra cola o lotes | 24 | Descartados |
| Cadenas (Sheraton, Dreams, Enjoy, andBeyond) | 4 | Descartadas |
| Duplicados internos, gobierno, salud | 9 | Descartados |
| **Negocios reales con sitio propio** | **40** → lote `hermes-sernatur-2026-09-13` | Auditados con nuestro motor. 3 con dominio muerto, 2 con error 500/404, 15 alojamientos con sitio vivo y contacto |

**Lo que no se conserva de ese lote:** el campo `offer`/`opportunity`. Son textos
de venta generados sin verificación: prometen SEO, Google Ads, "reservas
fatales", "motor de reservas con disponibilidad en tiempo real" y precios
inventados (CLP 240.000–490.000) que no son los de `OFFERS.md`. En dos casos la
"oferta" es para una cadena global. Nada de eso pasa la compuerta ni la regla de
no prometer resultados, así que el importador los descarta y la redacción se
hace de nuevo a partir de la auditoría.

**Aciertos del agente que sí valen:** detectó el error 500 de karimapu.com y los
dominios muertos de House of Colors, Emalafquen y Catripulli antes que nosotros;
y guardó los perfiles de Instagram/Facebook de diez negocios, que sirven de
canal cuando el sitio está caído.

**Resultado:** 3 prospectos nuevos con correo ya en la cola desde este lote
(Karimapu por Instagram, Truyaca, y los que redactan los agentes de Villarrica),
y 30+ candidatos auditados esperando redacción.

## Decisión sobre el primer lote

No se incorpora nada de él. La prospección sigue por el pipeline del repo
(`descubrir.mjs` → `prospectar-lote.mjs` → redacción → `promover.mjs`), que hoy
mismo se corrió sobre la Región de Los Ríos; ver `docs/ENVIAR_HOY.md` y los lotes
en `datos/candidatos/`.

Para el agente de Hermes, la corrección está en la skill
`hermes/skills/gramagrowth-prospector/SKILL.md`: descubre con `descubrir.mjs`
(nombres y sitios de negocios reales desde OSM), no raspando enlaces; y nada
entra a la cola sin pasar por `promover.mjs`.
