/* Configuración de cliente. Sólo se edita este archivo.
   Datos: el hotel tiene dos dominios y ninguno muestra el sitio: encantodelriohotel.cl
   no existe (NXDOMAIN) y hotelencantodelrio.cl devuelve una página de relleno
   del hosting (410), verificado 2026-09-12. Lo que hay aquí sale de lo que el hotel publica en
   OpenStreetMap (teléfono, correo, dirección) y de su ficha en booking.com
   (tipos de habitación, servicios), leídos el 2026-09-12.
   Regla de honestidad: nada de tarifas, porque el hotel no publica ninguna
   fuera de Booking y las de Booking cambian por fecha. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del negocio (OpenStreetMap y Booking). No es el sitio oficial. Los dominios del hotel ya no muestran su sitio.',
    fuente: 'booking.com y openstreetmap.org',
    leidoEl: '2026-09-12'
  },
  unidadLabel: 'Habitación',

  negocio: {
    nombre: 'Hotel Encanto del Río',
    bajada: 'Hotel con vista al río en la costanera de Valdivia, a 200 metros de la Plaza de la República. Desayuno buffet y estacionamiento incluidos.',
    comuna: 'Valdivia, Región de Los Ríos',
    direccion: 'Av. Arturo Prat 415, Costanera, Valdivia',
    // El celular publicado en OSM podría ser WhatsApp, pero no está declarado
    // como tal: se deja el correo como canal principal hasta confirmarlo.
    whatsapp: '',
    telefono: '+56 63 2 225 740',
    email: 'encantodelriovaldivia@gmail.com',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Arturo+Prat+415+Valdivia'
  },

  marca: {
    tinta: '#1b2a3a',
    acento: '#2f6f9f',
    papel: '#f4f6f8'
  },

  propiedad: {
    titular: 'Habitaciones con vista al río, en plena costanera',
    descripcion: 'Habitaciones amplias y luminosas con calefacción, TV por cable y baño privado. Desayuno buffet diario, estacionamiento gratuito, living común y terraza. El edificio tiene seis pisos y no cuenta con ascensor.',
    unidades: null,
    amenidades: ['Vista al río', 'Desayuno buffet', 'Wifi gratis', 'Estacionamiento gratuito', 'Calefacción', 'TV por cable', 'Baño privado', 'Terraza', 'Sin ascensor'],
    certificaciones: []
  },

  // Tipos publicados en la ficha de Booking. Capacidades referenciales.
  tipos: [
    { id: 'doble-rio', nombre: 'Habitación doble con vista al río', capacidad: 2, capacidadTarifa: 2, detalle: 'Cama matrimonial · vista frontal al río · baño privado' },
    { id: 'doble-lateral', nombre: 'Habitación doble con vista lateral al río', capacidad: 2, capacidadTarifa: 2, detalle: 'Cama matrimonial · vista lateral · baño privado' },
    { id: 'twin-lateral', nombre: 'Habitación twin con vista lateral al río', capacidad: 2, capacidadTarifa: 2, detalle: 'Dos camas · vista lateral · baño privado' },
    { id: 'triple', nombre: 'Habitación triple', capacidad: 3, capacidadTarifa: 3, detalle: 'Tres camas · baño privado' }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el hotel, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por vista, piso o llegada tarde antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: null,
    checkOut: null,
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'El hotel no publica tarifas fuera de Booking: las confirma al responder.',
      'Los tipos de habitación son referenciales; el hotel confirma capacidad y disponibilidad.',
      'El edificio tiene seis pisos y no cuenta con ascensor.',
      'Aviso de la muestra: faltan tarifas, horarios de check in y check out y WhatsApp antes de publicar esta página.'
    ]
  },

  faq: [
    { pregunta: '¿Incluye desayuno?', respuesta: 'Sí. Se sirve desayuno buffet todos los días.' },
    { pregunta: '¿Tienen estacionamiento?', respuesta: 'Sí, estacionamiento gratuito para huéspedes.' },
    { pregunta: '¿Hay ascensor?', respuesta: 'No. El edificio tiene seis pisos y las habitaciones se alcanzan por escalera. Si eso es un problema, indícalo en la consulta para asignarte un piso bajo.' },
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'Las tarifas no están publicadas en esta página. Envía tu consulta con fechas y pasajeros y el hotel te confirma el valor.' }
  ],

  atractivos: [
    'Costanera y río Calle-Calle', 'Plaza de la República', 'Mercado Fluvial', 'Museo Kunstmann', 'Fuerte Niebla', 'Parque Saval'
  ],

  galeria: []
};
