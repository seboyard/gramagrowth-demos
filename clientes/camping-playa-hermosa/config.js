/* Configuración de cliente. Sólo se edita este archivo.
   Datos: campingplayahermosa.cl (portada, /tarifas/, /equipamiento/), leído el
   2026-09-12. Las tarifas están publicadas bajo el rótulo "Temporada 2025 – 2026"
   y el pie dice "© 2025": se usan igual, con vigencia del próximo verano (2027)
   y nota "por confirmar".
   Faltó: número de sitios, % de abono, política de mascotas, redes (el sitio
   enlaza Facebook genérico, sin perfil). El sitio sí publica WhatsApp, teléfono
   y correo.
   Regla de honestidad: lo que no está publicado queda vacío. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del negocio. No es el sitio oficial.',
    fuente: 'campingplayahermosa.cl',
    leidoEl: '2026-09-12'
  },

  negocio: {
    nombre: 'Camping Playa Hermosa',
    bajada: '200 metros de playa de finas arenas a orillas del Lago Llanquihue, en un bosque de coihues y arrayanes.',
    comuna: 'Puerto Varas, Región de Los Lagos',
    direccion: 'Ruta 225, km 7, Puerto Varas',
    whatsapp: '56986823354',
    telefono: '+569 8682 3354',
    email: 'campingenpuertovaras@gmail.com',
    mapa: 'https://www.google.com/maps/search/?api=1&query=-41.3089175,-72.8869949'
  },

  marca: {
    tinta: '#1f2f2a',
    acento: '#2f7d5b',
    papel: '#f6f4ee'
  },

  propiedad: {
    titular: 'Sitios para carpas y casas rodantes frente al Lago Llanquihue',
    descripcion: 'En el Camping Playa Hermosa encontrará 200 metros de playa de finas arenas, a orillas del Lago Llanquihue, en un bosque de árboles nativos donde destacan el coihue y el arrayán. Sitios con fogón, mesón y extensión eléctrica, agua potable, duchas con agua caliente, minimarket, lavadero de vajilla, cancha de deportes y zona de pesca.',
    unidades: null,
    amenidades: ['Fogón, mesón y extensión eléctrica en cada sitio', 'Agua potable', 'Servicios higiénicos', 'Luz eléctrica', 'Duchas con agua caliente', 'Minimarket', 'Lavadero de vajilla', 'Cancha de deportes', 'Zona de pesca'],
    certificaciones: []
  },

  tipos: [
    {
      id: 'sitio',
      nombre: 'Sitio para carpa o casa rodante',
      capacidad: 8,
      capacidadTarifa: 5,
      detalle: '1 sitio por noche · hasta 5 personas · fogón, mesón y extensión eléctrica · persona adicional $5.000'
    }
  ],

  // Publicadas en /tarifas/ como "Temporada 2025 – 2026". Se dejan con
  // vigencia del próximo verano a la espera de confirmación del anfitrión.
  temporadas: [
    { id: 'verano', nombre: 'Temporada (publicada como 2025 – 2026, por confirmar)', desde: '2026-12-15', hasta: '2027-03-15', tarifa: 55000 }
  ],

  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el camping, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por casa rodante, grupo grande o llegada tarde antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: '13:00',
    checkOut: '12:00',
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'El valor comprende 1 sitio por 1 noche con capacidad para 5 personas. Persona adicional: $5.000 (superior a 5 personas por sitio).',
      'Check in 13:00 horas · check out 12:00 horas.',
      'Tarifas publicadas en el sitio como "Temporada 2025 – 2026": por confirmar con el anfitrión para la próxima temporada.',
      'El camping cuenta con un reglamento interno (PDF en el sitio).',
      'Aviso de la muestra: faltan número de sitios, condiciones de abono y política de mascotas antes de publicar esta página.'
    ]
  },

  faq: [
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'El sitio para carpa o casa rodante vale $55.000 por noche con capacidad para 5 personas; cada persona adicional paga $5.000. Valores publicados como Temporada 2025 – 2026, por confirmar.' },
    { pregunta: '¿A qué hora puedo llegar?', respuesta: 'Check in a las 13:00 horas y check out a las 12:00 horas.' },
    { pregunta: '¿Hay agua caliente?', respuesta: 'Sí, duchas con agua caliente, además de servicios higiénicos, agua potable y luz eléctrica.' },
    { pregunta: '¿Se puede ir sólo por el día?', respuesta: 'Sí. El paseo por el día vale $40.000 de lunes a jueves y $50.000 de viernes a domingo y festivos, con un mesón y un auto hasta 5 personas. Salida a las 21:00.' },
    { pregunta: '¿Tienen espacios para grupos?', respuesta: 'Quincho para 80 personas ($350.000, incluye 15 autos) y pérgola para 40 personas ($100.000, incluye 5 autos), de 9:00 a 21:00.' }
  ],

  atractivos: [
    'Lago Llanquihue', 'Ensenada', 'Saltos del Río Petrohué', 'Volcán Osorno', 'Ralún'
  ],

  galeria: [
    'https://campingplayahermosa.cl/wp-content/uploads/2025/12/g1.jpg',
    'https://campingplayahermosa.cl/wp-content/uploads/2025/12/g14.jpg',
    'https://campingplayahermosa.cl/wp-content/uploads/2025/12/g15.jpg',
    'https://campingplayahermosa.cl/wp-content/uploads/2025/12/g24.jpg'
  ]
};
