/* Configuración de cliente. Sólo se edita este archivo.
   Datos: huincaterra.cl (portada y "Alojamientos y servicios"), leído el 2026-09-12.
   Regla de honestidad: cada dato sale del sitio público del negocio. Lo que no
   está publicado queda vacío y la página muestra "a confirmar".
   Faltó en el sitio: capacidad, dormitorios y baño de cada unidad (las capacidades
   de la muestra son referenciales), temporada o vigencia de los valores por noche,
   horarios de check in/out, porcentaje de abono, IVA, enlace a WhatsApp. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'huincaterra.cl',
    leidoEl: '2026-09-12'
  },

  negocio: {
    nombre: 'Huincaterra',
    bajada: 'Cabañas de estilo montañés y refugios estilo glamping en un bosque nativo con árboles milenarios, camino Huincacara Sur, Villarrica.',
    comuna: 'Villarrica, Región de La Araucanía',
    direccion: 'Huincacara Sur Km 12,5, Villarrica',
    whatsapp: '',
    telefono: '+56 9 9530 7981',
    email: 'contacto@huincaterra.cl',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Huincacara+Sur+Km+12.5+Villarrica'
  },

  marca: {
    tinta: '#1f2a1e',
    acento: '#4f7a3a',
    papel: '#f5f3ec'
  },

  propiedad: {
    titular: 'Cabañas y refugios en un bosque nativo, con restaurante y piscina temperada',
    descripcion: 'Naturaleza pura: cabañas de estilo montañés y alojamientos estilo glamping en un bosque con árboles milenarios y diversidad de flora y fauna. Restaurante de cocina local con influencia alemana, piscina temperada de diciembre a marzo, tinajas y sauna, senderos de montaña, zona de juegos para niños y espacio para eventos de hasta 80 personas.',
    unidades: null,
    amenidades: [
      'Restaurante',
      'Piscina temperada (diciembre a marzo, $4.500 p/p)',
      'Tinajas y sauna (desde $20.000)',
      'Senderos de montaña ($3.000 p/p)',
      'Zona de juegos: canopy, muro de escalada, trampolín y tobogán',
      'Espacio para eventos hasta 80 personas'
    ],
    certificaciones: ['Sello S de Turismo Sustentable']
  },

  // Capacidades referenciales: el sitio no publica personas por unidad.
  // Los valores por noche son los publicados en el sitio, sin temporada indicada.
  tipos: [
    {
      id: 'refugio-rio',
      nombre: 'Refugio sobre el Río',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: 'Refugio a orillas del río · capacidad referencial, la confirma el anfitrión',
      temporadas: [
        { id: 'refugio-rio-noche', nombre: 'Valor por noche publicado (sin temporada indicada)', desde: '2026-09-13', hasta: '2027-12-31', tarifa: 40000 }
      ]
    },
    {
      id: 'cabana-bavaria',
      nombre: 'Cabaña Bavaria',
      capacidad: 4,
      capacidadTarifa: 4,
      detalle: 'Cabaña de estilo montañés · capacidad referencial, la confirma el anfitrión',
      temporadas: [
        { id: 'bavaria-noche', nombre: 'Valor por noche publicado (sin temporada indicada)', desde: '2026-09-13', hasta: '2027-12-31', tarifa: 80000 }
      ]
    },
    {
      id: 'cabana-huincaterra',
      nombre: 'Cabaña Huincaterra',
      capacidad: 4,
      capacidadTarifa: 4,
      detalle: 'Cabaña de estilo montañés · capacidad referencial, la confirma el anfitrión',
      temporadas: [
        { id: 'huincaterra-noche', nombre: 'Valor por noche publicado (sin temporada indicada)', desde: '2026-09-13', hasta: '2027-12-31', tarifa: 80000 }
      ]
    },
    {
      id: 'cabana-cerro-campanario',
      nombre: 'Cabaña Cerro Campanario',
      capacidad: 6,
      capacidadTarifa: 6,
      detalle: 'Cabaña de estilo montañés · capacidad referencial, la confirma el anfitrión',
      temporadas: [
        { id: 'campanario-noche', nombre: 'Valor por noche publicado (sin temporada indicada)', desde: '2026-09-13', hasta: '2027-12-31', tarifa: 120000 }
      ]
    },
    {
      id: 'cabana-terraviva',
      nombre: 'Cabaña Terraviva',
      capacidad: 4,
      capacidadTarifa: 4,
      detalle: 'El sitio dice "consulte valores" · capacidad referencial'
    },
    {
      id: 'refugio-montana',
      nombre: 'Refugio de Montaña',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: 'El sitio dice "consulte valores" · capacidad referencial'
    },
    {
      id: 'refugio-alta-montana',
      nombre: 'Refugio de Alta Montaña',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: 'El sitio dice "consulte valores" · capacidad referencial'
    }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el anfitrión, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por restaurante, tinajas o senderos antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: null,
    checkOut: null,
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'Los valores por noche son los publicados en el sitio; éste no indica temporada ni vigencia, así que el anfitrión los confirma al responder.',
      'Cabaña Terraviva y los refugios de montaña y alta montaña figuran como "consulte valores": sin tarifa publicada, la confirma el anfitrión.',
      'El sitio no publica capacidad por unidad: las capacidades de la muestra son referenciales y las confirma el anfitrión.',
      'El sitio no publica horarios de check in y check out, porcentaje de abono ni si los valores incluyen IVA: se confirman al responder.'
    ]
  },

  faq: [
    { pregunta: '¿Qué tipo de alojamiento tienen?', respuesta: 'Cabañas de estilo montañés (Bavaria, Huincaterra, Cerro Campanario y Terraviva) y refugios estilo glamping sobre el río, de montaña y de alta montaña.' },
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'El sitio publica $40.000 por noche en los refugios sobre el río, $80.000 en las cabañas Bavaria y Huincaterra y $120.000 en la cabaña Cerro Campanario. El resto es a consultar. Envía tus fechas y te confirmamos el valor.' },
    { pregunta: '¿Tienen restaurante?', respuesta: 'Sí, restaurante de cocina local con influencia alemana; la carta publicada es la de primavera 2025.' },
    { pregunta: '¿La piscina está incluida?', respuesta: 'La piscina temperada funciona de diciembre a marzo y el sitio publica un valor de $4.500 por persona. Tinajas y sauna desde $20.000.' },
    { pregunta: '¿Dónde están?', respuesta: 'En Huincacara Sur Km 12,5, comuna de Villarrica, Región de La Araucanía.' }
  ],

  atractivos: [
    'Bosque nativo con árboles milenarios',
    'Senderos de montaña',
    'Piscina temperada',
    'Tinajas y sauna',
    'Villarrica'
  ],

  galeria: [
    'https://www.huincaterra.cl/wp-content/uploads/2017/05/refugiorio1.jpg',
    'https://www.huincaterra.cl/wp-content/uploads/2021/01/gal_campanario1-1.jpg',
    'https://www.huincaterra.cl/wp-content/uploads/2021/01/gal_bavaria1.jpg',
    'https://www.huincaterra.cl/wp-content/uploads/2023/01/pscina1.jpg'
  ]
};
