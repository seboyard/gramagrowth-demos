/* ─────────────────────────────────────────────────────────────────────────
   MUESTRA — Hostal Internacional (Valdivia).
   Preparada por Gramagrowth con información publicada en hostalinternacional.cl,
   leída el 2026-09-10. No es el sitio oficial.

   Regla de honestidad: los valores salen textualmente de la página pública
   "Reservas y tarifas" (/reservas.html). El sitio publica dos niveles de tarifa
   —$45.000 para single/doble y $55.000 para triple/cuádruple— y esta página
   admite una sola tabla; aquí se carga el nivel de $45.000 y el otro queda
   citado en las preguntas frecuentes.

   El correo del hostal no se puede leer: el sitio lo entrega con un
   antispam que exige JavaScript, así que queda en blanco en vez de suponerlo.
   ───────────────────────────────────────────────────────────────────────── */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'hostalinternacional.cl',
    leidoEl: '2026-09-10'
  },

  negocio: {
    nombre: 'Hostal Internacional',
    bajada: '14 habitaciones y 4 departamentos en pleno centro de Valdivia.',
    comuna: 'Valdivia, Región de Los Ríos',
    direccion: 'García Reyes 660, Valdivia',
    whatsapp: '56953175777',
    telefono: '+56 63 2212015',
    email: '',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Garc%C3%ADa+Reyes+660+Valdivia'
  },

  marca: {
    tinta: '#22303f',
    acento: '#c4622d',
    papel: '#f7f3ee'
  },

  propiedad: {
    titular: '14 habitaciones y 4 departamentos a pasos del centro',
    descripcion: 'Casi 30 años de trayectoria en Valdivia. Habitaciones individuales, dobles y triples con baño privado, y cuatro departamentos de dos pisos completamente equipados. Formamos parte del comercio formalizado.',
    unidades: 18,
    amenidades: [
      'Baño privado', 'Armario/clóset', 'Aire acondicionado', 'Toallas y ropa de cama',
      'Estacionamiento con cámaras de seguridad', 'Zona wi-fi', 'Comedor compartido full equipado'
    ],
    certificaciones: ['Empresa formalizada']
  },

  // Sólo las unidades cuya tarifa publicada es $45.000. Las triples y
  // cuádruples ($55.000) quedan citadas en el FAQ.
  tipos: [
    {
      id: 'habitacion-single-doble',
      nombre: 'Habitación Single / Doble',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: 'Baño privado · armario · aire acondicionado · toallas y ropa de cama'
    },
    {
      id: 'departamento-single-doble',
      nombre: 'Departamento Single / Doble',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: 'Dos pisos · cocina, comedor, calefacción a gas y baño en planta baja'
    }
  ],

  // El sitio publica una sola tarifa por tipo de unidad, sin distinguir
  // temporadas ni fechas de vigencia. Se carga como tarifa vigente para el
  // año siguiente a la lectura y debe confirmarse antes de publicar.
  temporadas: [
    { id: 'tarifa-publicada', nombre: 'Tarifa publicada por noche', desde: '2026-09-10', hasta: '2027-09-30', tarifa: 45000 }
  ],

  promociones: [],

  reglas: {
    checkIn: null,
    checkOut: null,
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: true,
    notas: [
      'Todos los precios incluyen IVA.',
      'No se permite fumar dentro de las habitaciones; sí en el estacionamiento exterior.',
      'Se aceptan mascotas de razas pequeñas para residir.',
      'El estacionamiento cuenta con cámaras de seguridad.',
      'El sitio no publica horarios de check in y check out ni porcentaje de abono.',
      'Aviso de la muestra: como el porcentaje de abono no está publicado, esta página lo deja en 0% y debe reemplazarse por el valor real antes de usarla de verdad.'
    ]
  },

  faq: [
    {
      pregunta: '¿Cuánto valen las habitaciones y departamentos triples o cuádruples?',
      respuesta: 'El sitio publica $55.000 para la habitación triple/cuádruple y $55.000 para el departamento triple/cuádruple. Las single/dobles, tanto de hostal como de departamento, están publicadas en $45.000. Todos los precios incluyen IVA.'
    },
    {
      pregunta: '¿Tienen servicios adicionales?',
      respuesta: 'Sí: desayuno $5.500, once $5.500 y lavandería $10.000. Para empresas, desayuno u once $5.500 y almuerzo o cena $6.000.'
    },
    {
      pregunta: '¿Cómo son los departamentos?',
      respuesta: 'Son cuatro, de dos pisos, con cocina, comedor, calefacción a gas y baño en la planta baja, y dos habitaciones en el segundo piso. Capacidad máxima de cuatro personas.'
    },
    {
      pregunta: '¿Aceptan mascotas?',
      respuesta: 'Sí, mascotas de razas pequeñas para residir.'
    },
    {
      pregunta: '¿Dónde están?',
      respuesta: 'En García Reyes 660, en pleno centro de Valdivia, con acceso a pie a los servicios de la ciudad.'
    }
  ],

  atractivos: [
    'Mercado Fluvial', 'Costanera de Valdivia', 'Feria Fluvial', 'Isla Teja',
    'Jardín Botánico UACh', 'Fuerte de Niebla', 'Cervecería Kunstmann'
  ]
};
