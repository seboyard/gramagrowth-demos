/* Configuración de cliente. Sólo se edita este archivo.
   Datos: wingkul.cl (portada, /cabanas/ y /contacto/), leído el 2026-09-12.
   Tarifas publicadas en /cabanas/ como "$67.500 por día + IVA" (Notro, Pellín,
   Raulí) y "$75.000 por día + IVA" (Tineo), sin rótulo de temporada ni año.
   /contacto/ dice que en fines de semana largos, vacaciones de invierno y
   temporada alta de verano el valor sube un 26%, sin fechas: por eso aquí va
   sólo la tarifa base, con nota, y el anfitrión confirma las fechas altas.
   Qué faltó: horarios de check in/out, fechas de temporada alta, si la tarifa
   cubre a todos los pasajeros. WhatsApp: número del botón flotante del sitio
   (56981743922), el mismo teléfono rotulado "(Cabañas)".
   Regla de honestidad: cada monto sale del sitio; lo no publicado queda vacío. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'wingkul.cl',
    leidoEl: '2026-09-12'
  },
  negocio: {
    nombre: 'Cabañas Wingkul',
    bajada: 'Un regalo de la naturaleza. Cabañas equipadas en Llifén, a 300 metros del Lago Ranco, comuna de Futrono.',
    comuna: 'Futrono, Región de Los Ríos',
    direccion: 'Llifén, Futrono, Los Ríos',
    whatsapp: '56981743922',
    telefono: '+56 9 8174 3922',
    email: 'soniathim@gmail.com',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Caba%C3%B1as+Wingkul+Llif%C3%A9n+Futrono'
  },
  marca: {
    tinta: '#22301f',
    acento: '#6b8e23',
    papel: '#f7f5ee'
  },
  propiedad: {
    titular: 'Cuatro cabañas equipadas en Llifén, a 300 metros del Lago Ranco',
    descripcion: 'Empresa familiar en un pequeño paraíso rodeado de montañas, lagos y ríos. Cabañas totalmente equipadas, quincho y estacionamiento privado; sauna y tinajas como servicios adicionales. Además, tienda de pesca y salidas de trolling en el lago.',
    unidades: 4,
    amenidades: [
      'Internet WiFi',
      'Living',
      'Cocina americana',
      'TV satelital',
      'Calefacción a combustión lenta',
      'Calefón',
      'Quincho',
      'Estacionamiento privado',
      'Sauna y tinajas (adicional)'
    ],
    certificaciones: ['Registro SERNATUR (sello en el sitio)']
  },
  tipos: [
    {
      id: 'notro',
      nombre: 'Cabaña Notro',
      capacidad: 5,
      capacidadTarifa: 5,
      detalle: '2 dormitorios · 1 baño · living · cocina americana · área verde exclusiva con mesón rústico',
      temporadas: [
        { id: 'base-notro', nombre: 'Tarifa publicada por día (+ IVA)', desde: '2026-09-12', hasta: '2027-12-31', tarifa: 67500 }
      ]
    },
    {
      id: 'pellin',
      nombre: 'Cabaña Pellín',
      capacidad: 5,
      capacidadTarifa: 5,
      detalle: '2 dormitorios · 1 baño · living · cocina americana · área verde exclusiva con mesón rústico',
      temporadas: [
        { id: 'base-pellin', nombre: 'Tarifa publicada por día (+ IVA)', desde: '2026-09-12', hasta: '2027-12-31', tarifa: 67500 }
      ]
    },
    {
      id: 'rauli',
      nombre: 'Cabaña Raulí',
      capacidad: 5,
      capacidadTarifa: 5,
      detalle: '2 dormitorios · 1 baño · living · cocina americana · área verde exclusiva con mesón rústico',
      temporadas: [
        { id: 'base-rauli', nombre: 'Tarifa publicada por día (+ IVA)', desde: '2026-09-12', hasta: '2027-12-31', tarifa: 67500 }
      ]
    },
    {
      id: 'tineo',
      nombre: 'Cabaña Tineo',
      capacidad: 7,
      capacidadTarifa: 7,
      detalle: '3 dormitorios · 1 baño · living · cocina americana · terraza amplia con quincho exclusivo',
      temporadas: [
        { id: 'base-tineo', nombre: 'Tarifa publicada por día (+ IVA)', desde: '2026-09-12', hasta: '2027-12-31', tarifa: 75000 }
      ]
    }
  ],
  temporadas: [],
  noDisponibles: [],
  reservaDirecta: [
    'Hablas directamente con la familia que administra las cabañas, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por sauna, tinajas o salidas de pesca antes de pagar.'
  ],
  promociones: [],
  reglas: {
    checkIn: null,
    checkOut: null,
    abonoPorcentaje: 50,
    recargoUnaNoche: 0,
    ivaIncluido: false,
    notas: [
      'Los valores publicados son por día y no incluyen IVA.',
      'En fines de semana largos, vacaciones de invierno y temporada alta de verano el valor sube un 26%; el sitio no indica las fechas, las confirma el anfitrión.',
      'Al pedir una fecha, la administración la reserva por 8 horas a la espera del pago del 50% del valor total (transferencia o depósito). La reserva se confirma con ese pago.',
      'Con aviso de 10 días de antelación se devuelve el 100% de lo abonado; con menos días y durante la estadía queda supeditado a la administración.',
      'El sitio no publica horarios de check in y check out: los confirma el anfitrión.'
    ]
  },
  faq: [
    { pregunta: '¿Cómo se confirma la reserva?', respuesta: 'Solicitas tu fecha y la administración la reserva por 8 horas mientras se paga el 50% del valor total por transferencia o depósito. Con ese pago queda confirmada.' },
    { pregunta: '¿Los precios incluyen IVA?', respuesta: 'No. Las tarifas publicadas son por día más IVA. En fines de semana largos, vacaciones de invierno y temporada alta de verano suben un 26%.' },
    { pregunta: '¿Qué incluye cada cabaña?', respuesta: 'Dormitorios, baño, living, cocina americana, TV satelital, combustión lenta y calefón. Notro, Pellín y Raulí tienen un área verde exclusiva con mesón rústico; Tineo, una terraza amplia con quincho exclusivo.' },
    { pregunta: '¿Tienen sauna y tinajas?', respuesta: 'Sí, como servicios adicionales. Consúltalos en tu mensaje.' },
    { pregunta: '¿Puedo cancelar?', respuesta: 'Con aviso de 10 días de antelación se devuelve el 100% de lo abonado. Con menos días, o durante la estadía, queda supeditado a la administración.' },
    { pregunta: '¿Organizan salidas de pesca?', respuesta: 'Sí. Cuentan con tienda de insumos de pesca y ofrecen servicios de trolling y pesca deportiva en el lago.' }
  ],
  atractivos: [
    'Lago Ranco (a 300 metros)',
    'Llifén',
    'Pesca deportiva y trolling en el lago'
  ],
  galeria: [
    'https://wingkul.cl/wp-content/uploads/2021/12/fachada-cabana-tineo-scaled.jpg',
    'https://wingkul.cl/wp-content/uploads/2021/12/quincho-de-cabana-pellin-scaled.jpg',
    'https://wingkul.cl/wp-content/uploads/2021/12/terraza-cabana-tineo.jpg',
    'https://wingkul.cl/wp-content/uploads/2021/12/tinaja.jpg'
  ]
};
