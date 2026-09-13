/* Configuración de cliente. Sólo se edita este archivo.
   Datos: turout.com (indexes.html, hosteria_outsideres.htm,
   reservierungen_und_preisees.htm), leído el 2026-09-12.
   Regla de honestidad: cada dato sale de una fuente pública del negocio. Lo que
   no está publicado queda vacío y la página muestra "a confirmar".
   Tarifas publicadas con rótulos "temporada alta 6 sep 2025 – 15 abr 2026" y
   "temporada baja 16 abr 2026 – 10 sep 2026" (IVA incluido): se usan igual con
   fechas de la próxima temporada, por confirmar. Faltó en el sitio: WhatsApp,
   check in/out, % de abono, capacidad exacta por habitación (sólo "ocho camas"). */

window.RESERVA_CONFIG = {
  "demo": {
    "activo": true,
    "aviso": "Muestra preparada por Gramagrowth con información pública del negocio. No es el sitio oficial.",
    "fuente": "turout.com",
    "leidoEl": "2026-09-12"
  },
  "unidadLabel": "Habitación",
  "negocio": {
    "nombre": "Hostería Outsider",
    "bajada": "Hotel pequeño en pleno centro de Puerto Varas, con baño privado, calefacción central e Internet en cada habitación. Abierto todo el año.",
    "comuna": "Puerto Varas, Región de Los Lagos",
    "direccion": "San Bernardo 318, Puerto Varas",
    "whatsapp": "",
    "telefono": "+56 65 2231056",
    "email": "outsider@turout.com",
    "mapa": "https://www.google.com/maps/search/?api=1&query=San+Bernardo+318+Puerto+Varas"
  },
  "marca": {
    "tinta": "#1f3a3a",
    "acento": "#c8562c",
    "papel": "#f6f3ec"
  },
  "propiedad": {
    "titular": "Habitaciones con baño privado en el centro de Puerto Varas",
    "descripcion": "Un hotel con ocho camas en habitaciones con calefacción central y baño privado, un restaurant y una agencia de viajes bajo el mismo techo. Abierto todo el año. Hablamos español, inglés y alemán. Sin presencia en plataformas de reserva: la comisión ahorrada queda para el pasajero.",
    "unidades": 3,
    "amenidades": [
      "Baño privado en suite",
      "Calefacción central",
      "Agua caliente 24 horas",
      "Internet-PC en la habitación",
      "WiFi en toda la casa",
      "Minibar (refrigerador)",
      "Caja fuerte",
      "Secador de pelo",
      "Restaurant en el mismo edificio"
    ],
    "certificaciones": []
  },
  "tipos": [
    {
      "id": "single",
      "nombre": "Habitación single",
      "capacidad": 1,
      "capacidadTarifa": 1,
      "detalle": "Baño privado · calefacción central · Internet-PC y WiFi · minibar",
      "temporadas": [
        { "id": "alta", "nombre": "Temporada alta (publicada como 6 sep 2025 – 15 abr 2026, por confirmar)", "desde": "2026-09-11", "hasta": "2027-04-15", "tarifa": 45000 },
        { "id": "baja", "nombre": "Temporada baja (publicada como 16 abr – 10 sep 2026, por confirmar)", "desde": "2027-04-16", "hasta": "2027-09-10", "tarifa": 35000 }
      ]
    },
    {
      "id": "doble",
      "nombre": "Habitación doble",
      "capacidad": 2,
      "capacidadTarifa": 2,
      "detalle": "Baño privado · calefacción central · Internet-PC y WiFi · minibar",
      "temporadas": [
        { "id": "alta", "nombre": "Temporada alta (publicada como 6 sep 2025 – 15 abr 2026, por confirmar)", "desde": "2026-09-11", "hasta": "2027-04-15", "tarifa": 50000 },
        { "id": "baja", "nombre": "Temporada baja (publicada como 16 abr – 10 sep 2026, por confirmar)", "desde": "2027-04-16", "hasta": "2027-09-10", "tarifa": 45000 }
      ]
    },
    {
      "id": "triple",
      "nombre": "Habitación triple",
      "capacidad": 3,
      "capacidadTarifa": 3,
      "detalle": "Baño privado · calefacción central · Internet-PC y WiFi · minibar",
      "temporadas": [
        { "id": "alta", "nombre": "Temporada alta (publicada como 6 sep 2025 – 15 abr 2026, por confirmar)", "desde": "2026-09-11", "hasta": "2027-04-15", "tarifa": 60000 },
        { "id": "baja", "nombre": "Temporada baja (publicada como 16 abr – 10 sep 2026, por confirmar)", "desde": "2027-04-16", "hasta": "2027-09-10", "tarifa": 55000 }
      ]
    }
  ],
  "temporadas": [],
  "noDisponibles": [],
  "reservaDirecta": [
    "Hablas directamente con la hostería, sin intermediarios.",
    "La hostería no está en plataformas de reserva: la comisión ahorrada queda para el pasajero.",
    "Puedes consultar por horarios de llegada o necesidades especiales antes de pagar."
  ],
  "promociones": [],
  "reglas": {
    "checkIn": null,
    "checkOut": null,
    "abonoPorcentaje": 0,
    "recargoUnaNoche": 0,
    "ivaIncluido": true,
    "notas": [
      "Tarifas publicadas en turout.com como temporada alta (6 sep 2025 – 15 abr 2026) y baja (16 abr – 10 sep 2026), IVA incluido; por confirmar para las fechas nuevas.",
      "Desayuno no incluido: sólo té y/o café. Desayuno completo Ch$ 3.000 por persona.",
      "El sitio no publica horarios de check in y check out ni políticas de abono: los confirma la hostería.",
      "Aviso de la muestra: faltan tarifas vigentes, reglas y WhatsApp antes de publicar esta página."
    ]
  },
  "faq": [
    {
      "pregunta": "¿Incluye desayuno?",
      "respuesta": "La tarifa incluye sólo té y/o café. El desayuno completo (café de grano, té, leche, pan, mantequilla, mermelada, jamón, queso, yoghurt y jugos) vale Ch$ 3.000 por persona."
    },
    {
      "pregunta": "¿Dónde están?",
      "respuesta": "En San Bernardo 318, en pleno centro de Puerto Varas."
    },
    {
      "pregunta": "¿Las habitaciones tienen baño privado?",
      "respuesta": "Sí. Todas cuentan con baño privado en suite, calefacción central, agua caliente 24 horas, Internet-PC, WiFi, minibar, caja fuerte y secador de pelo."
    },
    {
      "pregunta": "¿Están abiertos en invierno?",
      "respuesta": "Sí. La hostería está abierta todo el año."
    }
  ],
  "atractivos": [
    "Lago Llanquihue",
    "Volcán Osorno",
    "Saltos del Petrohué",
    "Frutillar",
    "Parque Nacional Vicente Pérez Rosales"
  ],
  "galeria": [
    "http://www.turout.com/Hosteria650/Hosteria_Outsider_Matrimonium_300.jpg",
    "http://www.turout.com/Hosteria650/Hosteria_Outsider_Room_300.jpg",
    "http://www.turout.com/Hosteria650/Hosteria_Outsider_Bathroom300.jpg",
    "http://www.turout.com/Hosteria650/Hosteria_Outsider_Entrada_300.jpg"
  ]
};
