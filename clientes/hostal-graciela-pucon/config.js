/* Configuración de cliente. Sólo se edita este archivo.
   Datos: hostalgracielapucon.cl y su página /tarifas/, leídos el 2026-09-14.
   Las tarifas de temporada alta están rotuladas "Temporada de Verano
   2025 - 2026": se usan con las fechas del próximo verano (2027) y una nota
   de "por confirmar"; la temporada baja no tiene fechas publicadas y se deja
   como tarifa base el resto del año. El sitio no publica check in/out ni si
   incluye desayuno. Pie "© 2021". */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'hostalgracielapucon.cl',
    leidoEl: '2026-09-14'
  },
  unidadLabel: 'Habitación',

  negocio: {
    nombre: 'Hostal Graciela',
    bajada: 'Hostal familiar en Pucón, a pasos del centro, con vista al volcán desde la terraza. Habitaciones con baño privado y cocina equipada para huéspedes.',
    comuna: 'Pucón, Región de La Araucanía',
    direccion: 'Brasil con Pasaje Rolando Matus 521, Pucón',
    whatsapp: '56998683742',
    telefono: '+56 9 9868 3742',
    email: 'hostalgraciela@gmail.com',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Pasaje+Rolando+Matus+521+Pucon'
  },

  marca: { tinta: '#22302a', acento: '#2e7d4f', papel: '#f5f6f2' },

  propiedad: {
    titular: 'Cuatro tipos de habitación, todas con baño privado',
    descripcion: 'TV cable, wifi gratis, agua caliente 24 horas, calefacción central, aseo diario, secador de pelo, cocina equipada de uso común, comedores y terraza con vista al volcán. Estacionamiento público cercano.',
    unidades: null,
    amenidades: ['Baño privado', 'Wifi gratis', 'TV cable', 'Calefacción central', 'Agua caliente 24 h', 'Cocina equipada', 'Terraza con vista al volcán', 'Aseo diario'],
    certificaciones: []
  },

  // Tarifas por habitación según /tarifas/. Alta = "Verano 2025 - 2026" en el
  // sitio; se proyecta a enero-febrero 2027 por confirmar. Baja = resto.
  tipos: [
    { id: 'single', nombre: 'Habitación single', capacidad: 1, capacidadTarifa: 1, detalle: 'Una cama · baño privado',
      temporadas: [
        { id: 'baja-single', nombre: 'Temporada baja', desde: '2026-09-14', hasta: '2026-12-31', tarifa: 50000 },
        { id: 'alta-single', nombre: 'Temporada alta (rotulada Verano 2025-2026, por confirmar)', desde: '2027-01-01', hasta: '2027-02-28', tarifa: 55000 },
        { id: 'baja-single-2', nombre: 'Temporada baja', desde: '2027-03-01', hasta: '2027-12-31', tarifa: 50000 }
      ] },
    { id: 'doble', nombre: 'Habitación matrimonial', capacidad: 2, capacidadTarifa: 2, detalle: 'Cama de dos plazas · baño privado',
      temporadas: [
        { id: 'baja-doble', nombre: 'Temporada baja', desde: '2026-09-14', hasta: '2026-12-31', tarifa: 60000 },
        { id: 'alta-doble', nombre: 'Temporada alta (rotulada Verano 2025-2026, por confirmar)', desde: '2027-01-01', hasta: '2027-02-28', tarifa: 85000 },
        { id: 'baja-doble-2', nombre: 'Temporada baja', desde: '2027-03-01', hasta: '2027-12-31', tarifa: 60000 }
      ] },
    { id: 'familiar-3', nombre: 'Habitación familiar para 3', capacidad: 3, capacidadTarifa: 3, detalle: 'Cama de dos plazas y una de una plaza · baño privado',
      temporadas: [
        { id: 'baja-f3', nombre: 'Temporada baja', desde: '2026-09-14', hasta: '2026-12-31', tarifa: 80000 },
        { id: 'alta-f3', nombre: 'Temporada alta (rotulada Verano 2025-2026, por confirmar)', desde: '2027-01-01', hasta: '2027-02-28', tarifa: 105000 },
        { id: 'baja-f3-2', nombre: 'Temporada baja', desde: '2027-03-01', hasta: '2027-12-31', tarifa: 80000 }
      ] },
    { id: 'familiar-4', nombre: 'Habitación familiar para 4', capacidad: 4, capacidadTarifa: 4, detalle: 'Cama de dos plazas y dos de una plaza · baño privado',
      temporadas: [
        { id: 'baja-f4', nombre: 'Temporada baja', desde: '2026-09-14', hasta: '2026-12-31', tarifa: 90000 },
        { id: 'alta-f4', nombre: 'Temporada alta (rotulada Verano 2025-2026, por confirmar)', desde: '2027-01-01', hasta: '2027-02-28', tarifa: 130000 },
        { id: 'baja-f4-2', nombre: 'Temporada baja', desde: '2027-03-01', hasta: '2027-12-31', tarifa: 90000 }
      ] }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el hostal, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes preguntar por la cocina, el estacionamiento o la llegada tarde antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: null,
    checkOut: null,
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'Las tarifas de temporada alta están publicadas como "Verano 2025 - 2026": el hostal confirma si siguen vigentes para 2027.',
      'Cancelación gratuita hasta 3 días antes (temporada baja) o 5 días antes (verano y feriados); fuera de plazo se cobra el total de la estadía.',
      'Extranjeros que pagan en dólares con documento de inmigración pueden quedar exentos del 19% de IVA.',
      'Niños hasta 4 años no pagan compartiendo cama con los padres.',
      'Aviso de la muestra: faltan horarios de check in y check out y si incluye desayuno.'
    ]
  },

  faq: [
    { pregunta: '¿Incluye desayuno?', respuesta: 'El sitio no lo indica. Consúltalo al enviar tu solicitud.' },
    { pregunta: '¿Puedo cocinar?', respuesta: 'Sí. Hay una cocina equipada de uso común y comedores para los huéspedes.' },
    { pregunta: '¿Cómo funciona la cancelación?', respuesta: 'Gratuita hasta 3 días antes en temporada baja y 5 días antes en verano y feriados. Fuera de esos plazos se cobra el total de la estadía.' },
    { pregunta: '¿Hay estacionamiento?', respuesta: 'Estacionamiento público cercano, según indica el sitio.' }
  ],

  atractivos: ['Volcán Villarrica', 'Lago Villarrica y playa Grande', 'Termas de la zona', 'Parque Nacional Huerquehue', 'Ojos del Caburgua', 'Centro de Pucón'],

  galeria: [
    'https://hostalgracielapucon.cl/wp-content/uploads/2026/06/Habitacion-matrimonial-con-bano-privado1-768x1024.jpeg',
    'https://hostalgracielapucon.cl/wp-content/uploads/2026/06/Familiar-para-tres-personas-con-bano-privado1-768x1024.jpeg',
    'https://hostalgracielapucon.cl/wp-content/uploads/2026/06/Habitacion-familiar-para-cuatro-personas-con-bano-privado2-768x1024.jpeg'
  ]
};
