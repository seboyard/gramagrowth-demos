/* ─────────────────────────────────────────────────────────────────────────
   MUESTRA — Cabañas Selva Valdiviana (Valdivia).
   Preparada por Gramagrowth con información publicada en cabanasvaldivia.cl,
   leída el 2026-09-10. No es el sitio oficial.

   Regla de honestidad: los valores salen de la página pública /precios/, que
   publica $40.000 diarios para la cabaña de 2 o 3 personas y $50.000 para la
   de 4. Esta página admite una sola tabla de tarifas: se carga la de $40.000
   y la otra queda citada textualmente en las preguntas frecuentes.

   El sitio no publica dirección exacta ni correo; ambos quedan sin inventar.
   ───────────────────────────────────────────────────────────────────────── */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'cabanasvaldivia.cl',
    leidoEl: '2026-09-10'
  },

  negocio: {
    nombre: 'Cabañas Selva Valdiviana',
    bajada: 'Arriendo diario de cabañas equipadas en Valdivia, a 10 minutos del centro en auto.',
    comuna: 'Valdivia, Región de Los Ríos',
    direccion: 'Valdivia — el sitio no publica la calle exacta',
    whatsapp: '56992477311',
    telefono: '+56 9 9247 7311',
    email: '',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Valdivia+Regi%C3%B3n+de+Los+R%C3%ADos'
  },

  marca: {
    tinta: '#1f3327',
    acento: '#3f7d4f',
    papel: '#f4f3ec'
  },

  propiedad: {
    titular: 'Cabañas equipadas en ambiente familiar, con locomoción en la puerta',
    descripcion: 'Cabañas equipadas con todo lo necesario para una estadía tranquila en un lugar con ambiente familiar. A pasos de supermercado, farmacia, frutería, panadería y restaurante. La locomoción pasa por fuera; en auto el centro está a 10 minutos. Alojamiento durante todo el año.',
    unidades: 2,
    amenidades: [
      '2 dormitorios en el segundo piso', '1 cama matrimonial', '2 camas individuales',
      'Comedor', 'Cocina', 'Baño', 'Agua caliente', 'Calefacción a leña', 'TV',
      'Internet', 'Estacionamiento'
    ],
    certificaciones: []
  },

  // Sólo la unidad cuya tarifa se carga abajo. La cabaña de 4 personas
  // ($50.000 diarios) queda citada en el FAQ.
  tipos: [
    {
      id: 'cabana-2-3',
      nombre: 'Cabaña para 2 o 3 personas',
      capacidad: 3,
      capacidadTarifa: 3,
      detalle: '2 dormitorios · comedor · cocina · baño · calefacción a leña · arriendo mínimo 2 días'
    }
  ],

  // El sitio publica un valor diario único, sin temporadas ni fechas de
  // vigencia. Se carga como tarifa vigente desde la lectura y debe
  // confirmarse con el anfitrión antes de publicar.
  temporadas: [
    { id: 'valor-diario', nombre: 'Valor diario publicado', desde: '2026-09-10', hasta: '2027-09-30', tarifa: 40000 }
  ],

  promociones: [],

  reglas: {
    checkIn: '14:00',
    checkOut: '12:00',
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'Hora de llegada desde las 14:00 hrs y de salida hasta las 12:00 hrs.',
      'Arriendo mínimo 2 días.',
      'Está prohibido el ingreso de más personas que las reservadas.',
      'No se permiten mascotas.',
      'Están prohibidas las fiestas.',
      'No se permite fumar dentro de la cabaña.',
      'Se debe respetar el descanso de los demás huéspedes durante la madrugada.',
      'Aviso de la muestra: el sitio no publica porcentaje de abono, así que esta página lo deja en 0% y debe reemplazarse por el valor real antes de usarla de verdad.'
    ]
  },

  faq: [
    {
      pregunta: '¿Cuánto vale la cabaña para 4 personas?',
      respuesta: 'El sitio publica un valor diario de $50.000 para la cabaña de máximo 4 personas, también con arriendo mínimo de 2 días.'
    },
    {
      pregunta: '¿Cuál es la estadía mínima?',
      respuesta: 'Dos días. Así está publicado para ambas cabañas.'
    },
    {
      pregunta: '¿Qué incluye la cabaña?',
      respuesta: 'Dos dormitorios en el segundo piso con una cama matrimonial y dos individuales, comedor, cocina, baño, agua caliente, calefacción a leña, TV, internet y estacionamiento.'
    },
    {
      pregunta: '¿Aceptan mascotas?',
      respuesta: 'No. El reglamento para huéspedes publicado en el sitio no permite mascotas.'
    },
    {
      pregunta: '¿Cómo consulto disponibilidad?',
      respuesta: 'El sitio publica un calendario de fechas disponibles y reservadas. Esta página arma la consulta con tus fechas y pasajeros para confirmarla con el anfitrión.'
    }
  ],

  atractivos: [
    'Mercado Fluvial', 'Isla Teja', 'Parque Saval', 'Cervecería Kunstmann',
    'Fuerte de Niebla', 'Playa Los Molinos', 'Jardín Botánico UACh'
  ]
};
