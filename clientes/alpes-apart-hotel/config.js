/* Configuración de cliente. Sólo se edita este archivo.
   Datos: alpesaparthotel.cl, leído el 2026-09-14. Publica tipos de unidad,
   equipamiento, dirección, teléfonos, WhatsApp, correo e Instagram. No publica
   tarifas (derivan a una página de reserva) ni check in/out. Capacidades
   según el nombre de cada tipo (single, doble, triple, cuádruple). */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'alpesaparthotel.cl',
    leidoEl: '2026-09-14'
  },
  unidadLabel: 'Habitación',

  negocio: {
    nombre: 'Alpes Apart Hotel',
    bajada: 'Apart hotel familiar en el centro de Pucón: habitaciones con baño privado y departamentos con cocina equipada, en un entorno tranquilo con áreas verdes.',
    comuna: 'Pucón, Región de La Araucanía',
    direccion: 'Av. Bernardo O\'Higgins 545, Pucón',
    whatsapp: '56997748098',
    telefono: '+56 45 244 3812',
    email: 'soc.matus@gmail.com',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Bernardo+O%27Higgins+545+Pucon'
  },

  marca: { tinta: '#222c36', acento: '#3b6ea5', papel: '#f4f6f8' },

  propiedad: {
    titular: 'Habitaciones y departamentos equipados, a pasos del centro',
    descripcion: 'Baño privado en todas las unidades, kitchenette equipada, living-comedor, iluminación natural y aislación acústica. Áreas verdes y ambiente familiar.',
    unidades: null,
    amenidades: ['Baño privado', 'Kitchenette equipada', 'Living-comedor', 'Aislación acústica', 'Áreas verdes', 'Ambiente familiar'],
    certificaciones: []
  },

  tipos: [
    { id: 'single', nombre: 'Habitación single', capacidad: 1, capacidadTarifa: 1, detalle: 'Baño privado · kitchenette' },
    { id: 'doble', nombre: 'Habitación doble', capacidad: 2, capacidadTarifa: 2, detalle: 'Baño privado · kitchenette' },
    { id: 'triple', nombre: 'Habitación triple', capacidad: 3, capacidadTarifa: 3, detalle: 'Baño privado · kitchenette' },
    { id: 'cuadruple', nombre: 'Departamento cuádruple', capacidad: 4, capacidadTarifa: 4, detalle: 'Departamento totalmente equipado · living-comedor · cocina' }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el apart hotel, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por estacionamiento, cocina o llegada tarde antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: null, checkOut: null, abonoPorcentaje: 0, recargoUnaNoche: 0, ivaIncluido: null,
    notas: [
      'El sitio no publica tarifas: las confirma el apart hotel al responder.',
      'Las capacidades son las de cada tipo de unidad; el apart hotel confirma disponibilidad.',
      'Aviso de la muestra: faltan tarifas y horarios de check in y check out antes de publicar esta página.'
    ]
  },

  faq: [
    { pregunta: '¿Las unidades tienen cocina?', respuesta: 'Sí. Todas tienen kitchenette equipada; los departamentos cuádruples, cocina y living-comedor completos.' },
    { pregunta: '¿Dónde están?', respuesta: 'En Av. Bernardo O\'Higgins 545, en el centro de Pucón.' },
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'Las tarifas no están publicadas en esta página. Envía tu consulta con fechas y pasajeros y el apart hotel te confirma el valor.' }
  ],

  atractivos: ['Volcán Villarrica', 'Lago Villarrica y playa Grande', 'Termas de la zona', 'Parque Nacional Huerquehue', 'Centro de Pucón'],

  galeria: [
    'https://alpesaparthotel.cl/wp-content/uploads/2021/01/hotel.jpg',
    'https://alpesaparthotel.cl/wp-content/uploads/2021/01/IMG_2194.jpg',
    'https://alpesaparthotel.cl/wp-content/uploads/2021/01/IMG_2227.jpg'
  ]
};
