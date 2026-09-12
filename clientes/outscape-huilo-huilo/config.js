/* Configuración de cliente. Sólo se edita este archivo.
   Datos: outscape.cl/fuy (portada del destino Fuy) y outscape.cl/reservar,
   leídos el 2026-09-12, más el listado del motor de reservas enlazado desde
   "Reservar" (fuyhuilo-huilo.guestybookings.com), que muestra 9 refugios de dos
   tipos: para 2 personas (1 dormitorio, 1 baño) y para 5 (2 dormitorios, 1 baño).
   Qué faltó: el sitio no publica tarifas en pesos ni por temporada. El motor de
   reservas está en inglés y muestra valores "desde" en dólares que cambian según
   la fecha (From $84.96 / $106.20 / $127.44 per night), así que aquí no se usan.
   Tampoco publica check in/out, % de abono ni WhatsApp (sólo teléfono y correo).
   Regla de honestidad: cada dato sale del sitio público. Lo que no está
   publicado queda vacío y la página muestra "a confirmar". */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'outscape.cl/fuy',
    leidoEl: '2026-09-12'
  },

  negocio: {
    nombre: 'Outscape Fuy · Huilo Huilo',
    bajada: 'Refugios boutique en medio del bosque patagónico, frente a las aguas calmas del lago Pirihueico, en Puerto Fuy.',
    comuna: 'Puerto Fuy, comuna de Panguipulli, Región de Los Ríos',
    direccion: 'Parcela Z2, Puerto Fuy, Panguipulli',
    whatsapp: '',
    telefono: '+56 9 3935 9846',
    email: 'info@outscape.cl',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Outscape+Fuy+Puerto+Fuy+Panguipulli'
  },

  marca: {
    tinta: '#233021',
    acento: '#465f42',
    papel: '#f7f4f3'
  },

  propiedad: {
    titular: 'Nueve refugios en el bosque, a pocos metros del lago Pirihueico',
    descripcion: 'En medio de un entorno de exuberante bosque patagónico y frente a las prístinas y calmadas aguas del lago Pirihueico, Outscape Fuy es el punto de partida para explorar la Patagonia Norte y el refugio para relajarse después de un día de aventura. A pie, en bicicleta, a caballo o en kayak, en invierno o en verano.',
    unidades: 9,
    amenidades: [
      'Refugios independientes dentro del bosque nativo',
      'A pocos metros del lago Pirihueico',
      'Kayaks en el lago',
      'Tinaja caliente privada en algunos refugios',
      'Aceptan mascotas',
      'Actividades y experiencias locales que se reservan durante la estadía'
    ],
    certificaciones: []
  },

  // Dos tipos de refugio, según el listado del motor de reservas del sitio.
  // Sin tarifas en pesos publicadas: cada tipo queda sin temporadas y la página
  // dice "a confirmar".
  tipos: [
    {
      id: 'refugio-2',
      nombre: 'Refugio para 2 personas',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: '1 dormitorio · 1 baño · bosque nativo, algunos frente al lago o con tinaja privada'
    },
    {
      id: 'refugio-5',
      nombre: 'Refugio para 5 personas',
      capacidad: 5,
      capacidadTarifa: 5,
      detalle: '2 dormitorios · 1 baño · bosque nativo, algunos frente al lago, al río o con tinaja privada'
    }
  ],

  temporadas: [],

  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el equipo de Outscape, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes preguntar por la tinaja, los kayaks, las mascotas o las experiencias antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: null,
    checkOut: null,
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'El sitio no publica tarifas en pesos: las confirma el anfitrión. El motor de reservas del sitio muestra valores en dólares que cambian según la fecha.',
      'El sitio no publica horarios de check in y check out ni condiciones de abono: los confirma el anfitrión al responder.',
      'Aviso de la muestra: faltan tarifas por temporada, reglas y WhatsApp de reservas antes de publicar esta página.'
    ]
  },

  faq: [
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'Las tarifas en pesos no están publicadas en el sitio. Envía tu consulta con fechas y pasajeros y el equipo te confirma el valor.' },
    { pregunta: '¿Dónde están los refugios?', respuesta: 'En Parcela Z2, Puerto Fuy, comuna de Panguipulli, dentro del bosque y a pocos metros del lago Pirihueico.' },
    { pregunta: '¿Aceptan mascotas?', respuesta: 'Sí, los refugios se publican como pet friendly. Confírmalo en la consulta con el número y tamaño de tus mascotas.' },
    { pregunta: '¿Qué se puede hacer?', respuesta: 'Caminatas, bicicleta, cabalgatas y kayak en el lago Pirihueico, además de experiencias con la cultura local que se agendan durante la estadía.' }
  ],

  atractivos: [
    'Lago Pirihueico',
    'Reserva Biológica Huilo Huilo',
    'Puerto Fuy y Neltume',
    'Kayak, trekking y cabalgatas'
  ],

  galeria: [
    'https://static.wixstatic.com/media/8b2ba1_474a7dcaaed54ee3b4bd835c9e965646~mv2.jpg',
    'https://static.wixstatic.com/media/8b2ba1_c77007a5c3264cb1bef36d9057d10ee5~mv2.jpg',
    'https://static.wixstatic.com/media/8b2ba1_3d459e8bc4a44cb18cec9c778f708891~mv2.jpg',
    'https://static.wixstatic.com/media/8b2ba1_aff6e2461c404442b4b133beda2d7b91~mv2.jpg'
  ]
};
