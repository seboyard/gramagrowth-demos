# Gramagrowth - kit de reactivación

Este repositorio contiene sólo los activos necesarios para vender y entregar el próximo trabajo pagado:

- `index.html`: landing comercial de Gramagrowth.
- `kit/`: generador local de diagnóstico, mensaje y propuesta imprimible.
- `prospectar/`: cola local con auditorías verificables, estados y borradores de contacto.
- `plantillas/landing-prospecto/`: base para crear una demo o entrega de cliente.
- `docs/OFFERS.md`: alcance, precio y límites de las tres ofertas.
- `docs/REVENUE_SPRINT.md`: operación del sprint de cinco días.

No es un CRM ni un SaaS. El kit y la cola guardan borradores y estados únicamente en el navegador local. Ninguna herramienta envía mensajes.

## Uso rápido

Requiere Node.js 18 o superior, sin instalar dependencias.

```powershell
npm.cmd run serve
```

Abre `http://127.0.0.1:4173`.

- Cola de prospección: `http://127.0.0.1:4173/prospectar/`
- Generador de propuesta: `http://127.0.0.1:4173/kit/`

Para validar los archivos:

```powershell
npm.cmd test
```

## Próximo uso comercial

1. Abrir `/prospectar/`, reconfirmar la fuente pública y marcar un prospecto como listo.
2. Personalizar y copiar el correo; el sistema nunca lo envía automáticamente.
3. Usar “Llevar al kit de propuesta” para precargar la evidencia en `/kit/`.
4. Si hay una oportunidad clara, duplicar `plantillas/landing-prospecto/` y adaptar la muestra.
5. Contactar personalmente; no enviar mensajes masivos.
6. Si existe interés, imprimir la propuesta desde el kit y pedir 50% para comenzar.

## Publicación

La landing es estática y puede publicarse en cualquier hosting. Antes de reemplazar la web antigua, verificar acceso al dominio/Webflow y revisar el canal de contacto configurado en `index.html`.
