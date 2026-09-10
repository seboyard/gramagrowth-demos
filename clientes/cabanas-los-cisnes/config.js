/* Configuración de cliente. Sólo se edita este archivo.
   Datos y tarifas: cabanasloscisnes.cl/tarifas, leídos el 2026-09-10.
   El sitio rotula la tabla "INTERVALO DE FECHAS 2026"; las fechas se proyectaron
   a la próxima temporada. Confirmar con el cliente antes de publicar.
   Falta por confirmar: porcentaje de abono y hora de check out (no publicados). */

window.RESERVA_CONFIG = {
  "demo": {
    "activo": true,
    "aviso": "Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.",
    "fuente": "cabanasloscisnes.cl",
    "leidoEl": "2026-09-10"
  },
  "negocio": {
    "nombre": "Lodge & Cabañas Los Cisnes",
    "bajada": "Casas y cabañas equipadas en primer plano al río Cutipay, a 8 km de Valdivia.",
    "comuna": "Valdivia, Región de Los Ríos",
    "direccion": "Km. 8 Ruta a Niebla-Cutipay, Valdivia",
    "whatsapp": "56996431514",
    "telefono": "+56 9 96431514",
    "email": "fweisserr@gmail.com",
    "mapa": "https://www.google.com/maps/search/?api=1&query=Caba%C3%B1as+Los+Cisnes+Cutipay+Valdivia"
  },
  "marca": {
    "tinta": "#1b2c38",
    "acento": "#2b7a78",
    "papel": "#f5f2ec"
  },
  "propiedad": {
    "titular": "Cinco tipos de casas y cabañas frente al estuario del río Cutipay",
    "descripcion": "A 8 kilómetros de Valdivia, 10 minutos del centro, 3 minutos de la cervecería Kunstmann y a 7 km del balneario de Niebla, en 15.000 m2 de verdes espacios. Todas las cabañas están en primer plano al río Cutipay y la Selva Valdiviana.",
    "unidades": 5,
    "amenidades": [
      "Piscina-spa con vista panorámica al estuario",
      "Tinas calientes (Hot Tub)",
      "Quincho para asados",
      "Mesa de pool",
      "Botes",
      "Kayak",
      "Góndolas",
      "Lanchas",
      "Plaza de juegos infantiles",
      "Casas equipadas completamente"
    ],
    "certificaciones": []
  },
  "tipos": [
    {
      "id": "cabana-suite-standard",
      "nombre": "Cabaña Suite Standard",
      "capacidad": 5,
      "capacidadTarifa": 5,
      "detalle": "55 m2 · primer plano al estuario del río Cutipay · 2 a 5 personas",
      "temporadas": [
        {
          "id": "baja-2026",
          "nombre": "Marzo a noviembre 2026",
          "desde": "2026-03-01",
          "hasta": "2026-11-30",
          "tarifa": 120000
        },
        {
          "id": "alta-dic-ene",
          "nombre": "Diciembre 2026 y enero 2027",
          "desde": "2026-12-01",
          "hasta": "2027-01-31",
          "tarifa": 150000
        },
        {
          "id": "febrero",
          "nombre": "Febrero 2027",
          "desde": "2027-02-01",
          "hasta": "2027-02-28",
          "tarifa": 160000
        },
        {
          "id": "baja-2027",
          "nombre": "Marzo a noviembre 2027",
          "desde": "2027-03-01",
          "hasta": "2027-11-30",
          "tarifa": 120000
        }
      ]
    },
    {
      "id": "cabana-suite-premium",
      "nombre": "Cabaña Suite Premium",
      "capacidad": 4,
      "capacidadTarifa": 4,
      "detalle": "Hasta 4 personas (2 niños) · vista al río",
      "temporadas": [
        {
          "id": "baja-2026",
          "nombre": "Marzo a noviembre 2026",
          "desde": "2026-03-01",
          "hasta": "2026-11-30",
          "tarifa": 140000
        },
        {
          "id": "alta-dic-ene",
          "nombre": "Diciembre 2026 y enero 2027",
          "desde": "2026-12-01",
          "hasta": "2027-01-31",
          "tarifa": 160000
        },
        {
          "id": "febrero",
          "nombre": "Febrero 2027",
          "desde": "2027-02-01",
          "hasta": "2027-02-28",
          "tarifa": 170000
        },
        {
          "id": "baja-2027",
          "nombre": "Marzo a noviembre 2027",
          "desde": "2027-03-01",
          "hasta": "2027-11-30",
          "tarifa": 140000
        }
      ]
    },
    {
      "id": "casa-junior-suite",
      "nombre": "Casa Junior Suite",
      "capacidad": 6,
      "capacidadTarifa": 6,
      "detalle": "Hasta 6 personas · casa equipada con terraza y barbacoa",
      "temporadas": [
        {
          "id": "baja-2026",
          "nombre": "Marzo a noviembre 2026",
          "desde": "2026-03-01",
          "hasta": "2026-11-30",
          "tarifa": 160000
        },
        {
          "id": "alta-dic-ene",
          "nombre": "Diciembre 2026 y enero 2027",
          "desde": "2026-12-01",
          "hasta": "2027-01-31",
          "tarifa": 200000
        },
        {
          "id": "febrero",
          "nombre": "Febrero 2027",
          "desde": "2027-02-01",
          "hasta": "2027-02-28",
          "tarifa": 220000
        },
        {
          "id": "baja-2027",
          "nombre": "Marzo a noviembre 2027",
          "desde": "2027-03-01",
          "hasta": "2027-11-30",
          "tarifa": 160000
        }
      ]
    },
    {
      "id": "casa-suite-superior",
      "nombre": "Casa Suite Superior",
      "capacidad": 7,
      "capacidadTarifa": 7,
      "detalle": "Hasta 7 personas · casa equipada frente al estuario",
      "temporadas": [
        {
          "id": "baja-2026",
          "nombre": "Marzo a noviembre 2026",
          "desde": "2026-03-01",
          "hasta": "2026-11-30",
          "tarifa": 190000
        },
        {
          "id": "alta-dic-ene",
          "nombre": "Diciembre 2026 y enero 2027",
          "desde": "2026-12-01",
          "hasta": "2027-01-31",
          "tarifa": 230000
        },
        {
          "id": "febrero",
          "nombre": "Febrero 2027",
          "desde": "2027-02-01",
          "hasta": "2027-02-28",
          "tarifa": 250000
        },
        {
          "id": "baja-2027",
          "nombre": "Marzo a noviembre 2027",
          "desde": "2027-03-01",
          "hasta": "2027-11-30",
          "tarifa": 190000
        }
      ]
    },
    {
      "id": "casa-gran-suite-familiar",
      "nombre": "Casa Gran Suite Superior Familiar",
      "capacidad": 8,
      "capacidadTarifa": 8,
      "detalle": "Hasta 8 personas · la casa más amplia del lodge",
      "temporadas": [
        {
          "id": "baja-2026",
          "nombre": "Marzo a noviembre 2026",
          "desde": "2026-03-01",
          "hasta": "2026-11-30",
          "tarifa": 220000
        },
        {
          "id": "alta-dic-ene",
          "nombre": "Diciembre 2026 y enero 2027",
          "desde": "2026-12-01",
          "hasta": "2027-01-31",
          "tarifa": 250000
        },
        {
          "id": "febrero",
          "nombre": "Febrero 2027",
          "desde": "2027-02-01",
          "hasta": "2027-02-28",
          "tarifa": 270000
        },
        {
          "id": "baja-2027",
          "nombre": "Marzo a noviembre 2027",
          "desde": "2027-03-01",
          "hasta": "2027-11-30",
          "tarifa": 220000
        }
      ]
    }
  ],
  "promociones": [],
  "reglas": {
    "checkIn": "15:30 a 22:00",
    "checkOut": null,
    "abonoPorcentaje": 0,
    "recargoUnaNoche": 0,
    "ivaIncluido": null,
    "notas": [
      "Check in desde 15:30 a 22:00 hrs.",
      "La tarifa diaria considera casa o cabaña equipada, barbacoa en la terraza, uso de piscina para adultos y niños, plaza de juegos infantiles, botes y kayak.",
      "Por estadía superior a 2 días, un día de tinaja sin costo. El valor del día de tinaja de uso exclusivo es de $30.000.",
      "El sitio no publica hora de check out ni porcentaje de abono: los confirma el anfitrión al responder.",
      "Aviso de la muestra: como el porcentaje de abono no está publicado, esta página lo deja en 0% y debe reemplazarse por el valor real antes de usarla de verdad."
    ]
  },
  "faq": [
    {
      "pregunta": "¿Qué incluye la tarifa diaria?",
      "respuesta": "Casas y cabañas equipadas completamente, barbacoa para asados en sus terrazas, uso de piscina para adultos y niños, plaza de juegos infantiles, botes y kayak."
    },
    {
      "pregunta": "¿La tinaja tiene costo?",
      "respuesta": "Por estadía superior a 2 días hay un día de tinaja sin costo. El valor del día de tinaja de uso exclusivo es de $30.000."
    },
    {
      "pregunta": "¿A qué hora puedo llegar?",
      "respuesta": "El check in es desde las 15:30 a las 22:00 horas. La hora de check out no está publicada en el sitio."
    },
    {
      "pregunta": "¿Dónde están y qué hay cerca?",
      "respuesta": "En el km 8 de la ruta a Niebla-Cutipay: a 10 minutos del centro de Valdivia, 3 minutos de la cervecería Kunstmann y a 7 km del balneario de Niebla."
    }
  ],
  "atractivos": [
    "Río Cutipay",
    "Cervecería Kunstmann",
    "Balneario de Niebla",
    "Fuerte de Niebla",
    "Selva Valdiviana",
    "Mercado Fluvial de Valdivia",
    "Parque Saval"
  ],
  "galeria": [
    "https://cabanasloscisnes.cl/wp-content/uploads/2018/10/19.jpg?id=15",
    "https://cabanasloscisnes.cl/wp-content/uploads/2020/01/Aerea-Caban%CC%83as.jpg?id=879",
    "https://cabanasloscisnes.cl/wp-content/uploads/2018/11/41.jpg",
    "https://cabanasloscisnes.cl/wp-content/uploads/2020/01/1-1.jpg",
    "https://cabanasloscisnes.cl/wp-content/uploads/2020/09/IMG_20200920_125407_1-scaled.jpg"
  ]
};
