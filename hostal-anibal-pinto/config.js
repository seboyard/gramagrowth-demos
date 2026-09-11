/* Configuración de cliente. Sólo se edita este archivo.
   Datos: Facebook y TripAdvisor (no tiene sitio propio), leído el 2026-09-11.
   Regla de honestidad: cada dato sale de una fuente pública del negocio. Lo que
   no está publicado queda vacío y la página muestra "a confirmar". */

window.RESERVA_CONFIG = {
  "demo": {
    "activo": true,
    "aviso": "Muestra preparada por Gramagrowth con información pública del negocio. No es el sitio oficial.",
    "fuente": "Facebook y TripAdvisor (no tiene sitio propio)",
    "leidoEl": "2026-09-11"
  },
  "unidadLabel": "Habitación",
  "negocio": {
    "nombre": "Hostal Aníbal Pinto",
    "bajada": "Hospedaje en Valdivia, a una cuadra del río y cerca del centro.",
    "comuna": "Valdivia, Región de Los Ríos",
    "direccion": "Aníbal Pinto 1652, Valdivia",
    "whatsapp": "",
    "telefono": "",
    "email": "",
    "mapa": "https://www.google.com/maps/search/?api=1&query=An%C3%ADbal+Pinto+1652+Valdivia"
  },
  "marca": {
    "tinta": "#23262d",
    "acento": "#c0662a",
    "papel": "#f6f5f2"
  },
  "propiedad": {
    "titular": "Su primera página propia",
    "descripcion": "Hoy este hostal sólo existe en Facebook y en las reseñas de terceros. Esta muestra es lo que podría tener: su información, sus fotos, su forma de reservar, contada por ustedes.",
    "unidades": null,
    "amenidades": [],
    "certificaciones": []
  },
  "tipos": [
    {
      "id": "habitacion",
      "nombre": "Habitación",
      "capacidad": 2,
      "capacidadTarifa": 2,
      "detalle": "Detalle por confirmar con el hostal"
    }
  ],
  "temporadas": [],
  "noDisponibles": [],
  "reservaDirecta": [
    "Hablas directamente con el hostal, sin intermediarios.",
    "Sin comisión de plataformas sobre el valor de tu estadía.",
    "Puedes consultar por horarios de llegada o necesidades especiales antes de pagar."
  ],
  "promociones": [],
  "reglas": {
    "checkIn": null,
    "checkOut": null,
    "abonoPorcentaje": 0,
    "recargoUnaNoche": 0,
    "ivaIncluido": null,
    "notas": [
      "El hostal no tiene sitio web ni publica tarifas, teléfono ni correo en ninguna fuente pública que hayamos encontrado.",
      "Esta muestra es una estructura: todos los datos se completan con lo que entregue el hostal."
    ]
  },
  "faq": [
    {
      "pregunta": "¿Dónde están?",
      "respuesta": "En Aníbal Pinto 1652, Valdivia."
    },
    {
      "pregunta": "¿Cómo reservo?",
      "respuesta": "Envía tu consulta con fechas y pasajeros. El hostal confirma disponibilidad y valor al responder."
    }
  ],
  "atractivos": [
    "Costanera y río Calle-Calle",
    "Mercado Fluvial",
    "Plaza de la República",
    "Museo Kunstmann",
    "Fuerte Niebla",
    "Parque Saval"
  ]
};
