/* Configuración de cliente. Sólo se edita este archivo.
   Datos: petrohue.com (portada y lodge.html), leído el 2026-09-12.
   Regla de honestidad: cada dato sale de una fuente pública del negocio. Lo que
   no está publicado queda vacío y la página muestra "a confirmar".
   Faltó en el sitio: tarifas por habitación (sólo se ven dentro del motor
   externo GoFeels), WhatsApp, check in/out, % de abono y políticas de reserva. */

window.RESERVA_CONFIG = {
  "demo": {
    "activo": true,
    "aviso": "Muestra preparada por Gramagrowth con información pública del negocio. No es el sitio oficial.",
    "fuente": "petrohue.com",
    "leidoEl": "2026-09-12"
  },
  "unidadLabel": "Habitación",
  "negocio": {
    "nombre": "Petrohué Lodge",
    "bajada": "20 habitaciones y cabañas lacustres frente al Lago Todos los Santos, en el Parque Nacional Vicente Pérez Rosales. Más de 115 años de hospitalidad familiar.",
    "comuna": "Puerto Varas, Región de Los Lagos",
    "direccion": "Ruta 225 Km 58, Petrohué, Parque Nacional Vicente Pérez Rosales",
    "whatsapp": "",
    "telefono": "+56 9 8464 4870",
    "email": "reservas@petrohue.com",
    "mapa": "https://www.google.com/maps/search/?api=1&query=Petrohu%C3%A9+Lodge+Ruta+225+Km+58+Petrohu%C3%A9"
  },
  "marca": {
    "tinta": "#1c2a2e",
    "acento": "#d9642b",
    "papel": "#f4f1ea"
  },
  "propiedad": {
    "titular": "Elige dónde despertar mañana: vista al bosque nativo o el lago al frente",
    "descripcion": "A pasos del Lago Todos los Santos, con el Volcán Osorno, Puntiagudo, Calbuco y Tronador de fondo. Habitaciones con vista al lago o al bosque de coihues, y cuatro cabañas independientes con terraza propia y acceso directo a la playa. Restaurante Amancay con cocina local, tinajas a leña, jacuzzi exterior, piscina y sauna.",
    "unidades": 24,
    "amenidades": [
      "Restaurante Amancay",
      "Tinajas de madera nativa a leña",
      "Jacuzzi exterior",
      "Piscina exterior",
      "Sauna finlandés",
      "Acceso a la playa del lago",
      "Kayak, rafting, trekking y pesca con mosca"
    ],
    "certificaciones": []
  },
  "tipos": [
    {
      "id": "superior-king",
      "nombre": "Superior King · vista lago",
      "capacidad": 2,
      "capacidadTarifa": 2,
      "detalle": "Cama King · vista al Lago Todos los Santos y Volcán Osorno · 7 habitaciones"
    },
    {
      "id": "superior-twin",
      "nombre": "Superior Twin · vista lago",
      "capacidad": 2,
      "capacidadTarifa": 2,
      "detalle": "2 camas individuales · vista al lago"
    },
    {
      "id": "suite-superior",
      "nombre": "Suite Superior · vista lago",
      "capacidad": 2,
      "capacidadTarifa": 2,
      "detalle": "Cama King · la habitación más amplia del Lodge · vista al lago"
    },
    {
      "id": "matrimonial-standard",
      "nombre": "Matrimonial Standard · vista bosque",
      "capacidad": 2,
      "capacidadTarifa": 2,
      "detalle": "1 cama matrimonial · vista al bosque nativo de coihues"
    },
    {
      "id": "twin-standard",
      "nombre": "Twin Standard · vista bosque",
      "capacidad": 2,
      "capacidadTarifa": 2,
      "detalle": "2 camas individuales · vista bosque · 6 habitaciones"
    },
    {
      "id": "familiar-triple",
      "nombre": "Familiar Triple · vista bosque",
      "capacidad": 3,
      "capacidadTarifa": 3,
      "detalle": "3 camas individuales · vista bosque"
    },
    {
      "id": "cabana-tineo",
      "nombre": "Cabaña Tineo · frente al lago",
      "capacidad": 4,
      "capacidadTarifa": 4,
      "detalle": "Terraza privada sobre el lago · acceso a la playa · hasta 4 personas"
    },
    {
      "id": "cabana-canelo",
      "nombre": "Cabaña Canelo · frente al lago",
      "capacidad": 7,
      "capacidadTarifa": 7,
      "detalle": "Acceso privado directo a la playa · hasta 7 personas"
    },
    {
      "id": "cabana-arrayan",
      "nombre": "Cabaña Arrayán · frente al lago",
      "capacidad": 7,
      "capacidadTarifa": 7,
      "detalle": "La más espaciosa · hasta 7 personas"
    },
    {
      "id": "cabana-ulmo",
      "nombre": "Cabaña Ulmo · lago y bosque",
      "capacidad": 8,
      "capacidadTarifa": 8,
      "detalle": "Entre ulmos · hasta 8 personas"
    }
  ],
  "temporadas": [],
  "noDisponibles": [],
  "reservaDirecta": [
    "Hablas directamente con el Lodge, sin intermediarios.",
    "Sin comisión de plataformas sobre el valor de tu estadía.",
    "Puedes consultar por programas, actividades o necesidades especiales antes de pagar."
  ],
  "promociones": [],
  "reglas": {
    "checkIn": null,
    "checkOut": null,
    "abonoPorcentaje": 0,
    "recargoUnaNoche": 0,
    "ivaIncluido": null,
    "notas": [
      "El sitio no publica tarifas: las confirma el anfitrión.",
      "El sitio no publica horarios de check in y check out ni políticas de abono.",
      "Aviso de la muestra: faltan tarifas, reglas y WhatsApp antes de publicar esta página."
    ]
  },
  "faq": [
    {
      "pregunta": "¿Dónde está el Lodge?",
      "respuesta": "En Ruta 225 Km 58, Petrohué, dentro del Parque Nacional Vicente Pérez Rosales, a orillas del Lago Todos los Santos."
    },
    {
      "pregunta": "¿Tienen restaurante?",
      "respuesta": "Sí. El Restaurante Amancay sirve desayuno de 07:30 a 10:30, almuerzo de 12:30 a 15:00 y cena de 19:30 a 22:00, y está abierto también para visitantes externos."
    },
    {
      "pregunta": "¿Qué actividades se pueden hacer?",
      "respuesta": "Kayak y navegación en el lago, pesca con mosca, rafting en el río Petrohué, trekking al Paso Desolación y Rincón Los Alerces, escalada y vuelos en helicóptero."
    },
    {
      "pregunta": "¿Cuánto vale la noche?",
      "respuesta": "Las tarifas no están publicadas en el sitio. Envía tu consulta con fechas y pasajeros y te confirmamos el valor."
    }
  ],
  "atractivos": [
    "Lago Todos los Santos",
    "Saltos del Petrohué",
    "Volcán Osorno",
    "Paso Desolación",
    "Rincón Los Alerces",
    "Paso Vuriloche"
  ],
  "galeria": [
    "https://petrohue.com/assets/hab-matrimonial-sup.jpg",
    "https://petrohue.com/assets/hab-suite-superior.jpg",
    "https://petrohue.com/assets/cab-tineo.jpg",
    "https://petrohue.com/assets/restaurante.jpg"
  ]
};
