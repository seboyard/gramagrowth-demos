/* Configuración de cliente. Sólo se edita este archivo.
   Datos: bahiacoique.cl (portada, /camping/, /cabanas/, /contacto/), leído el
   2026-09-12. El negocio en el lote es el CAMPING del complejo Bahía Coique.
   Regla de honestidad: la página /camping/ publica sólo "50 sitios de camping ·
   1 baño privado por sitio · 1 parrilla por sitio · 10 sitios habilitados". No
   publica valor por sitio, persona ni noche, ni capacidad por sitio, ni check
   in/out, ni abono. Se modela UN tipo "Sitio de camping" con tarifas vacías; la
   capacidad (4) es REFERENCIAL porque app.js necesita un número para el
   selector de pasajeros, y la nota lo dice. El wa.me del sitio es del
   restaurant (reservar mesa / delivery), no del camping: whatsapp queda vacío
   y el correo camping@bahiacoique.cl es el canal, tal como lo publica el sitio.
   Qué faltó: tarifas, capacidad por sitio, reglas, WhatsApp del camping. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del negocio. No es el sitio oficial.',
    fuente: 'bahiacoique.cl',
    leidoEl: '2026-09-12'
  },
  unidadLabel: 'Sitio',

  negocio: {
    nombre: 'Camping Bahía Coique',
    bajada: 'Camping a orillas del Lago Ranco, dentro del complejo vacacional Bahía Coique, a 10 minutos (9,6 km) de Futrono.',
    comuna: 'Futrono, Región de Los Ríos',
    direccion: 'Playa Coique s/n, Futrono - Lago Ranco',
    whatsapp: '',
    telefono: '+56 9 4688 0705',
    email: 'camping@bahiacoique.cl',
    mapa: 'https://maps.app.goo.gl/nDpqkYD82xUfD3dW9'
  },

  marca: {
    tinta: '#1b2f3a',
    acento: '#2f7f6f',
    papel: '#f4f6f3'
  },

  propiedad: {
    titular: 'Sitios de camping con baño privado y parrilla, a orillas del Lago Ranco',
    descripcion: 'Camping dentro del complejo vacacional Bahía Coique: 50 sitios de camping, cada uno con baño privado y parrilla; 10 sitios habilitados. El complejo cuenta con playa en el Lago Ranco, club de golf, recepción 24/7, restaurant y, en temporada alta, piscinas, minimarket y guardería.',
    unidades: 10,
    amenidades: [
      '1 baño privado por sitio',
      '1 parrilla por sitio',
      'Playa en el Lago Ranco',
      'Club de golf',
      'Recepción 24/7',
      'Restaurant',
      'Piscinas (temporada alta)',
      'Minimarket (temporada alta)',
      'Quinchos',
      'Pádel, tenis, futbolito y basquetball',
      'Kayak, rafting, cabalgatas y trekking'
    ],
    certificaciones: []
  },

  tipos: [
    {
      id: 'sitio-camping',
      nombre: 'Sitio de camping',
      capacidad: 4,
      capacidadTarifa: 4,
      detalle: 'Baño privado · parrilla · capacidad por sitio a confirmar'
    }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el camping, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por carpa, motorhome o actividades del complejo antes de pagar.'
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
      'El sitio no publica capacidad por sitio: la capacidad de la muestra es referencial y la confirma el camping.',
      'El sitio no publica horarios de check in y check out ni abono: se confirman al responder.',
      'Aviso de la muestra: faltan tarifas, capacidad, reglas y WhatsApp del camping antes de publicar esta página.'
    ]
  },

  faq: [
    { pregunta: '¿Cuánto vale el sitio por noche?', respuesta: 'Las tarifas no están publicadas en el sitio. Envía tu consulta con fechas y cuántos son y te confirmamos el valor.' },
    { pregunta: '¿Qué incluye cada sitio?', respuesta: 'Según el sitio, cada sitio de camping tiene baño privado y parrilla. Hay 50 sitios, 10 de ellos habilitados.' },
    { pregunta: '¿Dónde están?', respuesta: 'En Playa Coique s/n, a orillas del Lago Ranco, a 10 minutos (9,6 km) de Futrono.' },
    { pregunta: '¿Puedo usar las instalaciones del complejo?', respuesta: 'El complejo cuenta con playa, club de golf, restaurant, quinchos y actividades como pádel, tenis, kayak, rafting, cabalgatas y trekking. Consulta al camping qué incluye tu estadía.' }
  ],

  atractivos: [
    'Playa Coique en el Lago Ranco',
    'Futrono (a 9,6 km)',
    'Club de golf Bahía Coique',
    'Rafting, kayak y cabalgatas del complejo'
  ],

  galeria: [
    'https://bahiacoique.cl/wp-content/uploads/2023/12/camping.jpg',
    'https://bahiacoique.cl/wp-content/uploads/2023/12/camping2.jpg',
    'https://bahiacoique.cl/wp-content/uploads/2023/12/camping3.jpg',
    'https://bahiacoique.cl/wp-content/uploads/2023/12/camping5.jpg'
  ]
};
