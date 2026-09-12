/* Configuración de cliente. Sólo se edita este archivo.
   Datos: cabanasdemadera.cl (sitio de una sola página), leído el 2026-09-12.
   Regla de honestidad: el sitio no publica tarifas, capacidades, número de
   cabañas, horarios de check in/out ni abono. Publica "Cabañas de 1 y 2
   dormitorios", la lista de equipamiento, dirección, teléfono, correo y redes.
   Se modelan DOS tipos (1 y 2 dormitorios) con tarifas vacías. La capacidad
   (2 y 4) es REFERENCIAL: app.js necesita un número para el selector de
   pasajeros; el sitio no la publica y la nota lo dice. El anfitrión la confirma.
   Qué faltó: tarifas, capacidad, reglas, WhatsApp. El botón "Reserva en línea
   aquí" del sitio apunta a reserva.gofeels.com y responde 404 (verificado el
   2026-09-12): ese es el hallazgo principal del correo. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del negocio. No es el sitio oficial.',
    fuente: 'cabanasdemadera.cl',
    leidoEl: '2026-09-12'
  },

  negocio: {
    nombre: 'Cabañas de Madera',
    bajada: 'Cabañas de maderas nativas completamente amobladas, estilo apart hotel, en La Unión. Arriendos diarios y mensuales.',
    comuna: 'La Unión, Región de Los Ríos',
    direccion: 'Ruta 210 (ex T-70), Km. 3, Parcelación La Flor, La Unión',
    whatsapp: '',
    telefono: '+56 9 9848 2339',
    email: 'info@cabanasdemadera.cl',
    mapa: 'https://www.google.com/maps/search/?api=1&query=-40.3102818,-73.0238584'
  },

  marca: {
    tinta: '#2b2118',
    acento: '#8a5a2b',
    papel: '#f7f3ec'
  },

  propiedad: {
    titular: 'Cabañas de maderas nativas con jardín propio, a 3 km de la Ruta 5',
    descripcion: 'Cabañas de maderas nativas con terminaciones rústicas y aislación actual para el calor y el frío, completamente equipadas en su interior. Cada una tiene amplios jardines que dan privacidad y tranquilidad. Pensadas para empresas e instituciones que buscan descanso tras la jornada y para turistas que visitan la región en toda época del año.',
    unidades: null,
    amenidades: [
      'Cocina amoblada',
      'Sistema apart hotel',
      'Televisión satelital',
      'Living comedor',
      'Combustión lenta',
      'Internet WiFi',
      'Piso vitrificado',
      'Lavandería',
      'Servicio de aseo',
      'Jardín y áreas verdes',
      'MotorHome Park en Ruta 210'
    ],
    certificaciones: []
  },

  tipos: [
    {
      id: 'cabana-1d',
      nombre: 'Cabaña de 1 dormitorio',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: '1 dormitorio · capacidad a confirmar · living comedor · cocina amoblada · combustión lenta · WiFi'
    },
    {
      id: 'cabana-2d',
      nombre: 'Cabaña de 2 dormitorios',
      capacidad: 4,
      capacidadTarifa: 4,
      detalle: '2 dormitorios · capacidad a confirmar · living comedor · cocina amoblada · combustión lenta · WiFi'
    }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con los anfitriones, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por arriendo mensual, estadías de trabajo o el MotorHome Park antes de pagar.'
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
      'El sitio no publica capacidad por cabaña: las capacidades de la muestra son referenciales y las confirma el anfitrión.',
      'El sitio no publica horarios de check in y check out ni abono: se confirman al responder.',
      'Aviso de la muestra: faltan tarifas, capacidades, reglas y WhatsApp antes de publicar esta página.'
    ]
  },

  faq: [
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'Las tarifas no están publicadas en el sitio. Envía tu consulta con fechas y pasajeros y te confirmamos el valor.' },
    { pregunta: '¿Arriendan por mes?', respuesta: 'Sí. El sitio indica arriendos mensuales y diarios, con sistema apart hotel.' },
    { pregunta: '¿Dónde están?', respuesta: 'En Ruta 210 (ex T-70), Km. 3, Parcelación La Flor, La Unión, a 3 km de la Ruta 5 Sur (km 890 aprox.).' },
    { pregunta: '¿Reciben motorhomes?', respuesta: 'Sí. Cuentan con MotorHome Park sobre la Ruta 210, como punto de descanso seguro.' }
  ],

  atractivos: [],

  galeria: [
    'https://cabanasdemadera.cl/wp-content/uploads/2023/05/Galeria1.jpg',
    'https://cabanasdemadera.cl/wp-content/uploads/2023/05/Galeria2.jpg',
    'https://cabanasdemadera.cl/wp-content/uploads/2024/06/Galeria-7.jpg',
    'https://cabanasdemadera.cl/wp-content/uploads/2024/06/Galeria-8.jpg'
  ]
};
