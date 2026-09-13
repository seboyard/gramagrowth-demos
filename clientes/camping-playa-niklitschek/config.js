/* Configuración de cliente. Sólo se edita este archivo.
   Datos: playanik.cl, leído el 2026-09-12. El sitio es una aplicación que sólo
   carga con JavaScript: la portada sin JS trae únicamente el título. Los datos de
   unidades y tarifas salen de su propio sistema de reservas público
   (playanik.cl/api/espacios y /api/espacios/tipos), que publica una "Tarifa por
   noche" base por tipo de espacio, sin rótulo de temporada.
   Faltó: teléfono, WhatsApp, dirección escrita (la de OSM es Ruta 225 CH Km 8),
   % de abono. El correo contacto@playanik.cl sí aparece (mailto en el sitio).
   Regla de honestidad: lo que no está publicado queda vacío. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del negocio. No es el sitio oficial.',
    fuente: 'playanik.cl',
    leidoEl: '2026-09-12'
  },

  negocio: {
    nombre: 'Camping Playa Niklitschek',
    bajada: 'Camping familiar a orillas del Lago Llanquihue, con vistas a los volcanes Osorno y Calbuco.',
    comuna: 'Puerto Varas, Región de Los Lagos',
    direccion: 'Ruta 225 CH Km 8, Puerto Varas',
    whatsapp: '',
    telefono: '',
    email: 'contacto@playanik.cl',
    mapa: 'https://www.google.com/maps/search/?api=1&query=-41.3086844,-72.8820159'
  },

  marca: {
    tinta: '#15302b',
    acento: '#22c55e',
    papel: '#f5f7f2'
  },

  propiedad: {
    titular: 'Sitios de camping, sitios con baño privado y dos cabañas frente al lago',
    descripcion: 'Bienvenido a nuestro camping familiar en las orillas del Lago Llanquihue. Sitios de camping con mesón de picnic y fogón, agua potable y electricidad en el sector, duchas y baños compartidos; sitios con baño privado con agua caliente; y cabañas equipadas para 6 personas con wifi. Un vehículo incluido por sitio. Máximo 8 personas por sitio.',
    unidades: null,
    amenidades: ['Acceso a playa', 'Fogón / parrilla', 'Agua potable', 'Electricidad', 'Duchas y baños compartidos', 'Estacionamiento (un vehículo por sitio)', 'Wifi en cabañas'],
    certificaciones: []
  },

  // Cada tipo trae su "Tarifa por noche" base publicada en el sistema de
  // reservas del sitio (leída el 2026-09-12, sin temporada indicada). Se deja
  // vigente para el verano 2027 a la espera de confirmación del anfitrión.
  tipos: [
    {
      id: 'sitio-camping',
      nombre: 'Sitio de camping (sectores A, B y C)',
      capacidad: 8,
      capacidadTarifa: 8,
      detalle: 'Mesón de picnic · fogón (sectores A y B; el C no tiene) · agua y luz en el sector · duchas y baños compartidos · 1 auto incluido',
      temporadas: [
        { id: 'base', nombre: 'Tarifa por noche publicada (por confirmar)', desde: '2026-12-15', hasta: '2027-03-15', tarifa: 60000 }
      ]
    },
    {
      id: 'sitio-bano-privado',
      nombre: 'Sitio de camping con baño privado',
      capacidad: 8,
      capacidadTarifa: 8,
      detalle: 'Baño privado con agua caliente · lavadero · mesón con fogón · agua y electricidad en el sitio · 1 auto incluido',
      temporadas: [
        { id: 'base', nombre: 'Tarifa por noche publicada (por confirmar)', desde: '2026-12-15', hasta: '2027-03-15', tarifa: 70000 }
      ]
    },
    {
      id: 'cabana',
      nombre: 'Cabaña (Mónica o Rita)',
      capacidad: 8,
      capacidadTarifa: 6,
      detalle: '3 dormitorios · 2 baños · 1 cama matrimonial, 1 litera, 3 camas single · wifi · toallas y sábanas incluidas · ampliable a 8 personas ($10.000 por la 7ª y 8ª)',
      temporadas: [
        { id: 'base', nombre: 'Tarifa por noche publicada (por confirmar)', desde: '2026-12-15', hasta: '2027-03-15', tarifa: 200000 }
      ]
    }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el camping, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por sector, fogón o llegada tarde antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: '13:00',
    checkOut: '11:30',
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'Campistas: ingreso desde las 13:00 y salida hasta las 11:30 del día de retiro. Cabañas: check in desde las 15:00 y check out hasta las 11:00.',
      'El no desalojo del sitio en el horario estipulado será motivo de cobro de una noche extra.',
      'Máximo 8 personas por sitio. Un vehículo incluido por sitio; el vehículo adicional paga el estacionamiento del día.',
      'Las tarifas son la "Tarifa por noche" base publicada en el sistema de reservas del sitio el 2026-09-12, sin temporada indicada: las confirma el anfitrión.',
      'Aviso de la muestra: faltan teléfono, WhatsApp y condiciones de abono antes de publicar esta página.'
    ]
  },

  faq: [
    { pregunta: '¿Cuántas personas caben por sitio?', respuesta: 'Máximo 8 personas por sitio. Las cabañas están equipadas para 6, con opción de ampliar a 8 pagando $10.000 adicionales por la séptima y octava persona.' },
    { pregunta: '¿A qué hora puedo llegar?', respuesta: 'Campistas: ingreso desde las 13:00 y salida hasta las 11:30. Cabañas: desde las 15:00 y salida hasta las 11:00.' },
    { pregunta: '¿Puedo llevar más de un auto?', respuesta: 'Cada sitio incluye un vehículo. El vehículo adicional paga el estacionamiento del día.' },
    { pregunta: '¿Los sitios tienen fogón?', respuesta: 'Los sitios de los sectores A y B tienen mesón de picnic y fogón exclusivo. Los del sector C tienen mesón pero no cuentan con parrilla ni fogón.' },
    { pregunta: '¿Qué incluye la cabaña?', respuesta: '3 dormitorios, 2 baños, wifi, y toallas, sábanas, shampoo, bálsamo y jabón líquido.' }
  ],

  atractivos: [
    'Lago Llanquihue', 'Volcán Osorno', 'Volcán Calbuco', 'Ensenada', 'Puerto Varas'
  ],

  galeria: [
    'https://www.playanik.cl/static/uploads/espacios/STCA01_20251207_211558_IMG_4343.JPG',
    'https://www.playanik.cl/static/uploads/espacios/SCBP01_20251125_132529_IMG_2660.JPG',
    'https://www.playanik.cl/static/uploads/espacios/CABMO_20251124_190809_IMG_0405.JPG',
    'https://www.playanik.cl/static/uploads/espacios/STCB01_20260217_164626_IMG_4501.jpg'
  ]
};
