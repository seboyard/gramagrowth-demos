/* Configuración de cliente. Sólo se edita este archivo.
   Datos: hostalvaldivia.cl (sitio vigente), leído el 2026-09-12. Su ficha en
   OpenStreetMap todavía apunta a hostaldelmuelle.cl, dominio que ya no existe
   (NXDOMAIN, verificado 2026-09-12): ese es el hallazgo del primer correo.
   Regla de honestidad: el sitio no publica tipos de habitación ni tarifas. Se
   deja UNA unidad genérica con lo que el sitio sí dice (baño privado, desayuno)
   y las tarifas vacías. Nada inventado. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del negocio. No es el sitio oficial.',
    fuente: 'hostalvaldivia.cl',
    leidoEl: '2026-09-12'
  },
  unidadLabel: 'Habitación',

  negocio: {
    nombre: 'Hostal del Muelle',
    bajada: 'Hostal en pleno centro de Valdivia, a pasos del terminal de buses y a 250 metros de la plaza. Desayuno continental y wifi gratis.',
    comuna: 'Valdivia, Región de Los Ríos',
    direccion: 'Yungay 736, Valdivia',
    whatsapp: '56999387010',
    telefono: '+56 9 9938 7010',
    email: 'hostaldelmuelle@gmail.com',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Yungay+736+Valdivia'
  },

  marca: {
    tinta: '#22303c',
    acento: '#0e7c86',
    papel: '#f5f6f4'
  },

  propiedad: {
    titular: 'Calidez, comodidad y desayuno continental, en el centro',
    descripcion: 'Habitaciones con baño privado, calefacción y TV por cable, con servicio de aseo diario. Desayuno continental incluido, wifi de alta velocidad, recepción hasta las 22:00, consejos turísticos y servicio de lavandería. Estacionamiento a una cuadra y media, en calle Pérez Rosales.',
    unidades: null,
    amenidades: ['Desayuno continental', 'Wifi gratis', 'Baño privado', 'Calefacción', 'TV por cable', 'Aseo diario', 'Lavandería', 'Recepción hasta las 22:00'],
    certificaciones: []
  },

  // El sitio no publica tipos de habitación. Una sola unidad referencial.
  tipos: [
    { id: 'habitacion', nombre: 'Habitación con baño privado', capacidad: 3, capacidadTarifa: 2, detalle: 'Baño privado · calefacción · TV cable · desayuno incluido. El hostal confirma si es single, doble o triple.' }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el hostal, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes avisar tu hora de llegada: la recepción atiende hasta las 22:00.'
  ],

  promociones: [],

  reglas: {
    checkIn: null,
    checkOut: null,
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'El sitio no publica tarifas ni tipos de habitación: los confirma el hostal al responder.',
      'La recepción atiende hasta las 22:00; avisa si llegas más tarde.',
      'Aviso de la muestra: faltan tarifas, tipos de habitación y horarios antes de publicar esta página.'
    ]
  },

  faq: [
    { pregunta: '¿Incluye desayuno?', respuesta: 'Sí, desayuno continental todos los días.' },
    { pregunta: '¿Dónde dejo el auto?', respuesta: 'Hay estacionamiento a una cuadra y media, en calle Pérez Rosales.' },
    { pregunta: '¿Hasta qué hora puedo llegar?', respuesta: 'La recepción atiende hasta las 22:00. Si llegas más tarde, avísalo en la consulta.' },
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'Las tarifas no están publicadas en el sitio. Envía tu consulta con fechas y pasajeros y el hostal te confirma el valor.' }
  ],

  atractivos: [
    'Torreón El Canelo (a 50 metros)', 'Muelle Schuster y Museo Submarino (a 100 metros)', 'Mercado Fluvial', 'Costanera', 'Fuerte Niebla', 'Reserva Huilo Huilo'
  ],

  galeria: []
};
