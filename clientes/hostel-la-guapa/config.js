/* Configuración de cliente. Sólo se edita este archivo.
   Datos: laguapahostel.cl (portada, única página), leído el 2026-09-12.
   El sitio está casi todo en inglés y sus botones "Book now!" llevan a
   Booking.com. No publica tarifas, correo, WhatsApp ni horarios de check in/out.
   Teléfono del sitio: +56 65 2232673. Dirección del sitio: Pasaje Ricke 224
   (OSM dice 212; se usa la del sitio). El celular de OSM (+56 9 8256 9767) no
   aparece en el sitio, así que no se usa como WhatsApp.
   Regla de honestidad: lo que no está publicado queda vacío. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del negocio. No es el sitio oficial.',
    fuente: 'laguapahostel.cl',
    leidoEl: '2026-09-12'
  },
  unidadLabel: 'Habitación',

  negocio: {
    nombre: 'La Guapa Hostel',
    bajada: 'Hostel para viajeros en Puerto Varas, a 100 m del centro y 200 m del Lago Llanquihue.',
    comuna: 'Puerto Varas, Región de Los Lagos',
    direccion: 'Pasaje Ricke 224, Puerto Varas',
    whatsapp: '',
    telefono: '+56 65 2232673',
    email: '',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Pasaje+Ricke+224+Puerto+Varas'
  },

  marca: {
    tinta: '#2b2330',
    acento: '#c2437a',
    papel: '#f8f4f1'
  },

  propiedad: {
    titular: 'Habitaciones privadas, dormitorio compartido, tiny house y glamping',
    descripcion: 'La Guapa Hostel recibe a un público viajero e internacional, en un ambiente seguro y cómodo para conocer a otros viajeros. Wifi gratis, cocina común totalmente equipada, estacionamiento seguro gratuito y lockers.',
    unidades: null,
    amenidades: ['Wifi gratis', 'Cocina común equipada', 'Estacionamiento seguro gratuito', 'Lockers'],
    certificaciones: []
  },

  tipos: [
    { id: 'twin', nombre: 'Habitación twin', capacidad: 2, capacidadTarifa: 2, detalle: '2 camas de una plaza · 7 m² · baño compartido' },
    { id: 'doble', nombre: 'Habitación doble', capacidad: 2, capacidadTarifa: 2, detalle: 'Cama matrimonial · baño compartido' },
    { id: 'triple', nombre: 'Habitación triple', capacidad: 3, capacidadTarifa: 3, detalle: 'Baño compartido · para familias con niños o grupos de amigos' },
    { id: 'tiny-house', nombre: 'Tiny house', capacidad: 3, capacidadTarifa: 3, detalle: 'Cama matrimonial y sofá cama en el living · baño a 100 m' },
    { id: 'dorm', nombre: 'Cama en dormitorio compartido (5 camas)', capacidad: 1, capacidadTarifa: 1, detalle: 'Dormitorio mixto · enchufe y luz de lectura por cama · locker' },
    { id: 'glamping', nombre: 'Carpa propia en el patio (glamping)', capacidad: 2, capacidadTarifa: 2, detalle: 'Traes tu carpa · acceso a cocina común y wifi' }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el hostel, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por horarios de llegada o necesidades especiales antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: null,
    checkOut: null,
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'El sitio no publica tarifas: las confirma el anfitrión.',
      'El sitio no publica horarios de check in y check out: los confirma el hostel al responder.',
      'Aviso de la muestra: faltan tarifas, reglas, correo y WhatsApp antes de publicar esta página.'
    ]
  },

  faq: [
    { pregunta: '¿Dónde están?', respuesta: 'En Pasaje Ricke 224, Puerto Varas, a 100 metros del centro y 200 metros del Lago Llanquihue.' },
    { pregunta: '¿Las habitaciones tienen baño privado?', respuesta: 'Las habitaciones twin, doble y triple tienen baño compartido. La tiny house tiene el baño a 100 metros.' },
    { pregunta: '¿Puedo cocinar?', respuesta: 'Sí, hay una cocina común totalmente equipada para los huéspedes.' },
    { pregunta: '¿Hay estacionamiento?', respuesta: 'Sí, estacionamiento seguro gratuito.' },
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'Las tarifas no están publicadas en el sitio. Envía tu consulta con fechas y pasajeros y te confirmamos el valor.' }
  ],

  atractivos: [
    'Lago Llanquihue', 'Centro de Puerto Varas', 'Volcán Osorno', 'Saltos del Petrohué', 'Frutillar'
  ],

  galeria: [
    'https://laguapahostel.cl/wp-content/uploads/2024/01/2.jpg',
    'https://laguapahostel.cl/wp-content/uploads/2024/01/3.jpg',
    'https://laguapahostel.cl/wp-content/uploads/2024/01/Untitled-design.jpg'
  ]
};
