/* Configuración de cliente. Sólo se edita este archivo.
   Datos: hotellicanray.cl (portada, Habitaciones y Políticas internas), leído el 2026-09-12.
   Regla de honestidad: cada dato sale del sitio público del negocio. Lo que no
   está publicado queda vacío y la página muestra "a confirmar".
   Faltó en el sitio: tarifas de todas las habitaciones, IVA, enlace a WhatsApp,
   número de habitaciones. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'hotellicanray.cl',
    leidoEl: '2026-09-12'
  },

  unidadLabel: 'Habitación',

  negocio: {
    nombre: 'Hotel Licán Ray',
    bajada: 'En el corazón de Licán Ray, un hotel para disfrutar de una experiencia de descanso y naturaleza.',
    comuna: 'Licán Ray, comuna de Villarrica, Región de La Araucanía',
    direccion: 'Gral. Urrutia 585, Licán Ray, Villarrica',
    whatsapp: '',
    telefono: '+56 9 9051 6769',
    email: 'reservas@hotellicanray.cl',
    mapa: 'https://www.google.com/maps/search/?api=1&query=General+Urrutia+585+Licanray+Villarrica'
  },

  marca: {
    tinta: '#1b2733',
    acento: '#2a6f97',
    papel: '#f6f5f1'
  },

  propiedad: {
    titular: 'Habitaciones con baño privado y desayuno buffet en Licán Ray',
    descripcion: 'Habitaciones single, dobles, triple y cuádruple con cerradura electrónica, baño privado, TV y aseo diario. Desayuno buffet incluido, wifi en áreas comunes, estacionamiento privado sujeto a disponibilidad y servicio de bar según habitación.',
    unidades: null,
    amenidades: [
      'Desayuno buffet',
      'Baño privado',
      'Cerradura electrónica',
      'TV',
      'Aseo diario',
      'Wifi en áreas comunes',
      'Estacionamiento privado (sujeto a disponibilidad)'
    ],
    certificaciones: []
  },

  tipos: [
    {
      id: 'single',
      nombre: 'Habitación Single',
      capacidad: 1,
      capacidadTarifa: 1,
      detalle: '1 cama de 1,5 plazas · baño privado · TV · cerradura electrónica · desayuno buffet'
    },
    {
      id: 'doble-junior',
      nombre: 'Habitación Doble Junior',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: '1 cama de 2 plazas · baño privado · TV · cerradura electrónica · desayuno buffet'
    },
    {
      id: 'standard',
      nombre: 'Habitación Standard',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: '1 cama king · aire acondicionado · baño privado · TV · desayuno buffet'
    },
    {
      id: 'superior',
      nombre: 'Habitación Superior',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: '1 cama super king · aire acondicionado · minibar · escritorio y sillones · baño privado · desayuno buffet'
    },
    {
      id: 'triple',
      nombre: 'Habitación Triple',
      capacidad: 3,
      capacidadTarifa: 3,
      detalle: '1 cama king + 1 cama de 1,5 plazas · aire acondicionado · baño privado · desayuno buffet'
    },
    {
      id: 'cuadruple',
      nombre: 'Habitación Cuádruple',
      capacidad: 4,
      capacidadTarifa: 4,
      detalle: '1 cama king + 2 camas de 1,5 plazas · aire acondicionado · baño privado · desayuno buffet'
    }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el hotel, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por estacionamiento o necesidades especiales antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: '15:30',
    checkOut: '12:00',
    abonoPorcentaje: 50,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'El sitio no publica tarifas: las confirma el anfitrión.',
      'Se solicita un anticipo equivalente al 50% del total de la estancia.',
      'Las reservas pueden anularse o modificarse sin costo hasta 15 días antes de la fecha de llegada.',
      'Las devoluciones se realizan únicamente al titular de la reserva, por el mismo método de pago.',
      'No se permite el ingreso de animales, salvo mascotas de asistencia certificadas.',
      'El sitio no indica si los valores incluyen IVA: se confirma al responder.'
    ]
  },

  faq: [
    { pregunta: '¿A qué hora puedo llegar?', respuesta: 'El check in es a partir de las 15:30 y el check out antes de las 12:00.' },
    { pregunta: '¿Cómo se confirma la reserva?', respuesta: 'Con un anticipo del 50% del total de la estancia. Se puede anular o modificar sin costo hasta 15 días antes de la llegada.' },
    { pregunta: '¿Incluye desayuno?', respuesta: 'Sí, todas las habitaciones incluyen desayuno buffet.' },
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'Las tarifas no están publicadas en el sitio. Envía tu consulta con fechas y pasajeros y te confirmamos el valor.' },
    { pregunta: '¿Aceptan mascotas?', respuesta: 'No, salvo mascotas de asistencia certificadas.' }
  ],

  atractivos: [
    'Playas de Licán Ray',
    'Lago Calafquén',
    'Termas de la zona',
    'Parques nacionales de La Araucanía',
    'Villarrica'
  ],

  galeria: [
    'https://hotellicanray.cl/wp-content/uploads/2024/11/1.jpg',
    'https://hotellicanray.cl/wp-content/uploads/2024/11/3.jpg',
    'https://hotellicanray.cl/wp-content/uploads/2024/11/4.jpg',
    'https://hotellicanray.cl/wp-content/uploads/2024/11/6.jpg'
  ]
};
