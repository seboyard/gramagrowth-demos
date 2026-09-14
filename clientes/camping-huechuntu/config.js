/* Configuración de cliente. Sólo se edita este archivo.
   Datos: huechuntu.cl, leído el 2026-09-14. Publica 16 sitios de camping con
   baño privado, cabañas hasta 10 personas y departamentos hasta 8, la
   ubicación y un teléfono; el único valor publicado es "Gira de estudios y
   Tercera edad $12.000 por persona". No hay tarifas por noche: se dejan en
   blanco. Pie "2022". Capacidades tal como las describe el sitio. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'huechuntu.cl',
    leidoEl: '2026-09-14'
  },

  negocio: {
    nombre: 'Camping y Cabañas Huechuntu',
    bajada: 'Camping con baño privado por sitio, cabañas y departamentos equipados, a 7 km de Pucón camino al volcán Villarrica.',
    comuna: 'Pucón, Región de La Araucanía',
    direccion: 'Camino al volcán km 7, Pucón',
    // El sitio publica un celular sin declararlo como WhatsApp: se deja como
    // teléfono y el formulario del sitio sigue siendo el canal escrito.
    whatsapp: '',
    telefono: '+56 9 8273 2465',
    email: '',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Huechuntu+Pucon'
  },

  marca: { tinta: '#1f2a22', acento: '#4a7c3f', papel: '#f4f6f1' },

  propiedad: {
    titular: 'Camping, cabañas y departamentos en un mismo lugar',
    descripcion: 'Dieciséis sitios de camping rodeados de bosque, cada uno con baño privado. Cabañas totalmente equipadas para hasta 10 personas y departamentos para hasta 8. Cerca del Parque Nacional Villarrica, el casino y los restaurantes de Pucón.',
    unidades: 16,
    amenidades: ['Baño privado por sitio', 'Cabañas equipadas', 'Departamentos equipados', 'Entorno de bosque', 'A 7 km de Pucón'],
    certificaciones: []
  },

  tipos: [
    { id: 'sitio', nombre: 'Sitio de camping con baño privado', capacidad: 6, capacidadTarifa: 4, detalle: 'Uno de los 16 sitios, con baño privado. Capacidad referencial: el camping confirma cuántas carpas o personas admite por sitio.' },
    { id: 'cabana', nombre: 'Cabaña equipada', capacidad: 10, capacidadTarifa: 6, detalle: 'Totalmente equipada, hasta 10 personas según el sitio.' },
    { id: 'departamento', nombre: 'Departamento equipado', capacidad: 8, capacidadTarifa: 4, detalle: 'Totalmente equipado, hasta 8 personas según el sitio.' }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el camping, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por grupos, giras o mascotas antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: null,
    checkOut: null,
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'El sitio no publica tarifas por noche: las confirma el camping al responder.',
      'Único valor publicado: giras de estudio y tercera edad, $12.000 por persona.',
      'Las capacidades por sitio son referenciales; el camping confirma.',
      'Aviso de la muestra: faltan tarifas, horarios, correo y WhatsApp antes de publicar esta página.'
    ]
  },

  faq: [
    { pregunta: '¿Los sitios tienen baño propio?', respuesta: 'Sí. Cada uno de los 16 sitios de camping tiene baño privado.' },
    { pregunta: '¿Reciben grupos?', respuesta: 'Sí. El sitio publica un valor especial para giras de estudio y tercera edad: $12.000 por persona.' },
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'Las tarifas por noche no están publicadas. Envía tu consulta con fechas y cuántos son y el camping te confirma el valor.' }
  ],

  atractivos: ['Volcán Villarrica', 'Parque Nacional Villarrica', 'Centro de Pucón y casino', 'Lago Villarrica', 'Termas de la zona'],

  galeria: [
    'https://huechuntu.cl/wp-content/uploads/2022/11/Pucon-Cabanas-Huechuntu.jpg',
    'https://huechuntu.cl/wp-content/uploads/2022/11/Pucon-camping-huechuntu-1.jpg',
    'https://huechuntu.cl/wp-content/uploads/2022/12/Pucon-departamento-huechuntu.jpg'
  ]
};
