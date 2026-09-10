/* ─────────────────────────────────────────────────────────────────────────
   ÚNICO ARCHIVO QUE SE EDITA POR CLIENTE.
   Todo lo demás (index.html, styles.css, app.js) se reutiliza sin tocar.

   Regla de honestidad: cada monto y cada dato de aquí debe salir de material
   entregado por el cliente o de su sitio público. Si un dato no existe, se
   deja en null y la página muestra "a confirmar" en vez de inventarlo.

   Datos de esta configuración: sitio público cabanasriobaker.cl, leído el
   2026-09-10. Las tarifas están publicadas allí bajo el rótulo "Verano 2025"
   y deben confirmarse con el cliente antes de publicar.
   ───────────────────────────────────────────────────────────────────────── */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'cabanasriobaker.cl',
    leidoEl: '2026-09-10'
  },

  negocio: {
    nombre: 'Cabañas Río Baker',
    bajada: 'Cabañas equipadas para 4 y 5 personas, a cuadras de la plaza de Valdivia.',
    comuna: 'Valdivia, Región de Los Ríos',
    direccion: 'General Baquedano N° 440, Valdivia',
    whatsapp: '56996426266',
    telefono: '+56 63 2434150',
    email: 'contactoriobaker@gmail.com',
    mapa: 'https://www.google.com/maps/search/?api=1&query=General+Baquedano+440+Valdivia'
  },

  marca: {
    tinta: '#1d3231',
    acento: '#0f7b6c',
    papel: '#f6f4ef'
  },

  propiedad: {
    titular: 'Doce cabañas equipadas en el centro de Valdivia',
    descripcion: 'Alternativa de hospedaje para quienes visitan la ciudad de las luces. Doce cabañas completamente equipadas, con estacionamiento techado, a cuadras de la plaza.',
    unidades: 12,
    amenidades: ['2 dormitorios', '1 baño', 'Living', 'Cocina americana', 'Wifi', 'TV cable', 'Estacionamiento techado'],
    certificaciones: ['Certificación Sello Verde SEC']
  },

  // Tipos de unidad. capacidadTarifa = personas cubiertas por la tarifa base.
  tipos: [
    {
      id: 'cabana-4',
      nombre: 'Cabaña para 4 personas',
      capacidad: 4,
      capacidadTarifa: 4,
      detalle: '2 dormitorios · 1 baño · living · cocina americana'
    },
    {
      id: 'cabana-5',
      nombre: 'Cabaña para 5 personas',
      capacidad: 5,
      capacidadTarifa: 4,
      detalle: '2 dormitorios · 1 baño · living · cocina americana'
    }
  ],

  // Sólo rangos con tarifa publicada. Fuera de estos rangos la página dice
  // "a confirmar" en lugar de suponer un valor.
  temporadas: [
    { id: 'enero-q1', nombre: 'Enero · primera quincena', desde: '2027-01-01', hasta: '2027-01-15', tarifa: 75000 },
    { id: 'enero-q2', nombre: 'Enero · segunda quincena', desde: '2027-01-16', hasta: '2027-01-31', tarifa: 85000 },
    { id: 'febrero', nombre: 'Febrero', desde: '2027-02-01', hasta: '2027-02-28', tarifa: 90000 }
  ],

  // Fechas ya tomadas. El anfitrión las edita a mano cuando se le llena algo.
  // No es sincronización con Booking: es una lista simple que evita la peor
  // vergüenza, que alguien pida una fecha copada hace meses.
  noDisponibles: [
    // { desde: '2027-01-16', hasta: '2027-01-22', nota: 'Sin cabañas disponibles' }
  ],

  // Por qué conviene reservar directo. Es el propósito del producto y hasta
  // ahora la página no se lo decía al huésped.
  reservaDirecta: [
    'Hablas directamente con el anfitrión, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por horarios, mascotas o necesidades especiales antes de pagar.'
  ],

  promociones: [
    {
      id: 'tres-noches-enero',
      nombre: 'Promoción 3 noches',
      noches: 3,
      precio: 149000,
      desde: '2027-01-01',
      hasta: '2027-01-20',
      nota: 'Vigente para llegadas hasta el 20 de enero.'
    }
  ],

  reglas: {
    checkIn: '15:00',
    checkOut: '12:00',
    abonoPorcentaje: 50,
    recargoUnaNoche: 10000,
    ivaIncluido: true,
    notas: [
      'La reserva se confirma una vez cancelado el 50% del total.',
      'Todos los valores incluyen IVA.',
      'Las salidas posteriores a las 12:00 se cobran como día adicional.',
      'Estadías de una sola noche tienen un recargo de $10.000.'
    ]
  },

  faq: [
    { pregunta: '¿Cómo se confirma la reserva?', respuesta: 'La reserva queda confirmada una vez cancelado el 50% del total. El saldo se paga al llegar.' },
    { pregunta: '¿A qué hora puedo llegar?', respuesta: 'El check in es a partir de las 15:00 y el check out antes de las 12:00. Las salidas más tarde se cobran como día adicional.' },
    { pregunta: '¿Qué incluye la cabaña?', respuesta: 'Dos dormitorios, baño, living, cocina americana equipada, wifi, TV cable y estacionamiento techado.' },
    { pregunta: '¿Están cerca del centro?', respuesta: 'Sí, estamos en General Baquedano 440, a cuadras de la plaza de Valdivia.' },
    { pregunta: '¿Puedo quedarme una sola noche?', respuesta: 'Sí. Las estadías de una noche tienen un recargo de $10.000 sobre la tarifa.' }
  ],

  atractivos: [
    'Noche Valdiviana', 'Fuerte Niebla', 'Mercado Fluvial', 'Jardín Botánico UACh',
    'Museo Kunstmann', 'Balneario de Niebla', 'Parque Saval'
  ]
};
