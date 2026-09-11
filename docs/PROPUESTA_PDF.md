# La propuesta en PDF — análisis y decisiones

Qué estaba mal en la primera versión, qué se cambió y por qué. Sirve para no
volver a cometer lo mismo cuando se agregue un vertical nuevo.

## Cómo se genera

`/presentacion/?id=<prospecto>` arma cinco páginas desde `datos/prospectos.json`
y se imprime a PDF con Ctrl+P o en lote con Edge headless:

```bash
msedge --headless=new --no-pdf-header-footer --print-to-pdf=salida.pdf \
  "http://127.0.0.1:4173/presentacion/?id=hostal-peru&precio=250000&vence=2026-09-18"
```

Parámetros del enlace: `precio` (el que se cobra hoy), `vence` (vigencia),
`reservas` y `noche` (para la cuenta de comisión), `base` (URL pública de las
demos; si falta, la toma de `datos/config.json`).

## Diez problemas de la primera versión, y qué se hizo

| # | Problema | Daño | Solución |
|---|---|---|---|
| 1 | El PDF decía $320.000 y la pauta del asociado $250.000 | Alto: dos números en la misma mesa | Campo "precio hoy" en la barra; se imprime en grande con la lista tachada al lado |
| 2 | Logo blanco-sobre-azul pegado en página blanca: un rectángulo azul | Alto: primera impresión amateur | Logo a color, transparente, derivado del original en tres tamaños |
| 3 | La demo sólo estaba enlazada; en papel no se puede tocar | Alto: el activo más fuerte no aparecía | Captura de la demo a 390 px dentro de un celular en la portada |
| 4 | Faltaba el antes/después del WhatsApp | Alto: es lo que más vende en la demo | Página 3 lo muestra lado a lado, adaptado al rubro |
| 5 | Sin vigencia de la oferta | Medio: "lo pienso" no tiene fecha | Campo "válido hasta" en la barra y en la tabla de términos |
| 6 | La firma decía "responda este correo"; sin teléfono | Medio: en reunión presencial no hay correo | Contacto desde `datos/config.json` |
| 7 | La cuenta de comisión asumía $90.000 la noche para todos | Medio: un hostal cobra $35.000 | Valores por defecto según rubro: hostal 60 reservas a $40.000; cabaña 40 a $90.000 |
| 8 | Portada sólo texto | Medio | Celular con la captura + precio en la portada |
| 9 | Seis páginas con aire al pie | Bajo | Cinco páginas; "qué entregamos" y "antes/después" van juntas |
| 10 | El enlace a la demo apuntaba a `/clientes/<id>/`, que en GitHub Pages es 404 | **Alto y silencioso**: llegó a los PDF de ayer | Corregido a `/<id>/`, que es donde vive en la rama publicada |

## Lo que se mantuvo a propósito

- **Hallazgos verificables** en la página 2, sin adjetivos. Es lo que distingue
  la propuesta de un folleto.
- **"Lo que no prometemos"** en el cierre. El test falla si desaparece.
- **Incluye / no incluye** explícitos. Cada línea de "no incluye" evita una
  discusión después.

## Reglas que no se pueden romper

1. El precio que se imprime sale de la barra, no de un archivo. Si el asociado
   dice $250.000, el papel dice $250.000.
2. Sin URL pública, la caja de la demo no se imprime. Un PDF con un enlace a
   `localhost` es peor que uno sin enlace.
3. La captura se toma con `?captura=1`, que oculta el aviso de muestra y el
   editor de tarifas. Lo que se ve es la página, no el andamiaje.
4. La cuenta de comisión declara sus supuestos en la nota al pie: *"la cifra
   real la pone usted"*. Nunca se presenta como dato del negocio.

## Logo

`assets/` tiene ahora:

| Archivo | Uso |
|---|---|
| `logo-color.png` (1559×370) y `-600`, `-300` | Fondos claros: PDF, landing pública |
| `logo-blanco.png` (1559×370) y `-600` | Fondos oscuros: cola, galería, kit |
| `isotipo-color.png` (258×258), `-128`, `-64` | Firma, favicon, usos chicos |
| `logo-gramagrowth.png` | Original con fondo azul; se conserva como fuente |

Todos con fondo transparente y recortados al contenido. La versión a color se
derivó de la original por regiones —círculo a rosa `#ef1457`, cohete a blanco,
texto al azul medido del propio archivo— conservando el antialias.

## Captura de las demos

`presentacion/capturas/<id>.png`, a 390 px de ancho y 2× de densidad. Se
regeneran con Edge headless sobre `?captura=1`. En modo captura el layout se
fija a 390 px porque Edge headless no baja de ~500 px de ventana y, sin eso, el
contenido se recortaba por la derecha.

Hay que regenerarlas cuando cambie la plantilla o el config de un cliente.
