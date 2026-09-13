/* Configuración de cliente. Sólo se edita este archivo.
   Datos: hostaldonjuan.cl (portada y Tarifas), leído el 2026-09-12.
   Regla de honestidad: cada dato sale del sitio público del negocio. Lo que no
   está publicado queda vacío y la página muestra "a confirmar".
   Faltó en el sitio: montos por cabaña (la página de tarifas define temporadas
   baja 2026 y alta 2027 pero no pudimos leer valores), dormitorios y baño por
   cabaña, fotos propias de las cabañas. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'hostaldonjuan.cl',
    leidoEl: '2026-09-12'
  },

  negocio: {
    nombre: 'Cabañas Don Juan',
    bajada: 'Cabañas completamente equipadas para 3 a 6 personas, atendidas por sus dueños desde 1990, en Villarrica.',
    comuna: 'Villarrica, Región de La Araucanía',
    direccion: 'General Körner 770, Villarrica',
    whatsapp: '56983547968',
    telefono: '+56 9 8354 7968',
    email: 'contacto@hostaldonjuan.cl',
    mapa: 'https://www.google.com/maps/search/?api=1&query=General+Korner+770+Villarrica'
  },

  marca: {
    tinta: '#2b2118',
    acento: '#a8552b',
    papel: '#f7f3ec'
  },

  propiedad: {
    titular: 'Disfruta Villarrica en un lugar único',
    descripcion: 'Negocio familiar atendido por sus dueños desde 1990. Cabañas completamente equipadas para 3, 4, 5 o 6 personas, con calefacción central, wifi, estacionamiento privado, quincho techado y atención las 24 horas. Desayuno continental opcional a $8.000 por persona.',
    unidades: null,
    amenidades: [
      'Cabañas completamente equipadas',
      'Calefacción central',
      'Wifi',
      'Estacionamiento privado (hasta 10 vehículos)',
      'Quincho techado',
      'TV satelital 42"',
      'Jardín',
      'Custodia de equipaje',
      'Atención 24 horas'
    ],
    certificaciones: ['Certificado de Excelencia TripAdvisor', 'Kayak Travel Awards']
  },

  tipos: [
    { id: 'cabana-3', nombre: 'Cabaña para 3 personas', capacidad: 3, capacidadTarifa: 3, detalle: 'Completamente equipada · calefacción central · wifi' },
    { id: 'cabana-4', nombre: 'Cabaña para 4 personas', capacidad: 4, capacidadTarifa: 4, detalle: 'Completamente equipada · calefacción central · wifi' },
    { id: 'cabana-5', nombre: 'Cabaña para 5 personas', capacidad: 5, capacidadTarifa: 5, detalle: 'Completamente equipada · calefacción central · wifi' },
    { id: 'cabana-6', nombre: 'Cabaña para 6 personas', capacidad: 6, capacidadTarifa: 6, detalle: 'Completamente equipada · calefacción central · wifi' }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con los dueños, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por desayuno, estacionamiento o llegada tarde antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: '14:00',
    checkOut: '11:00',
    abonoPorcentaje: 50,
    recargoUnaNoche: 0,
    ivaIncluido: true,
    notas: [
      'El sitio no publica tarifas: las confirma el anfitrión. Su página de tarifas define temporada baja del 1 de marzo al 31 de diciembre de 2026 (excepto Semana Santa, feriados y vacaciones de invierno) y temporada alta del 1 de enero al 28 de febrero de 2027.',
      'Valores con IVA incluido.',
      'La reserva se confirma con un abono del 50%.',
      'Check in de 14:00 a 22:00 hrs; check out hasta las 11:00 hrs.',
      'Cancelación gratuita hasta 48 horas antes de la llegada; después se cobra la primera noche.',
      'Desayuno continental no incluido: $8.000 por persona, opcional.',
      'No se aceptan mascotas.'
    ]
  },

  faq: [
    { pregunta: '¿A qué hora puedo llegar?', respuesta: 'El check in es de 14:00 a 22:00 hrs y el check out hasta las 11:00 hrs.' },
    { pregunta: '¿Cómo se confirma la reserva?', respuesta: 'Con un abono del 50%. Se puede cancelar gratis hasta 48 horas antes de la llegada; después se cobra la primera noche.' },
    { pregunta: '¿Incluye desayuno?', respuesta: 'No está incluido. El desayuno continental es opcional y cuesta $8.000 por persona.' },
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'Los valores no están publicados en el sitio. Envía tu consulta con fechas y pasajeros y te confirmamos el valor de temporada, con IVA incluido.' },
    { pregunta: '¿Hay estacionamiento?', respuesta: 'Sí, estacionamiento privado para hasta 10 vehículos.' }
  ],

  atractivos: [
    'Lago Villarrica',
    'Volcán Villarrica',
    'Costanera de Villarrica',
    'Pucón',
    'Licán Ray'
  ],

  galeria: [
    'https://hostaldonjuan.cl/wp-content/uploads/2025/01/Slide01_Villarrica-1.jpg',
    'https://hostaldonjuan.cl/wp-content/uploads/2025/01/don-juan-10.png',
    'https://hostaldonjuan.cl/wp-content/uploads/2025/01/Volcan-Villarrica.jpeg'
  ]
};
