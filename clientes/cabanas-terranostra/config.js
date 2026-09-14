/* Configuración de cliente. Sólo se edita este archivo.
   Datos: turismoterranostra.cl, leído el 2026-09-14. Publica cuatro tipos de
   cabaña (6, 4 y 2 personas, y alpina), equipamiento, piscina, tinas termales,
   camping, canchas, teléfonos, WhatsApp, correo y Facebook. No publica
   tarifas ni check in/out. La cabaña alpina no declara capacidad: se deja en 2
   como referencia y se dice. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'turismoterranostra.cl',
    leidoEl: '2026-09-14'
  },

  negocio: {
    nombre: 'Complejo Turístico Terranostra',
    bajada: 'Seis hectáreas entre el río Allipén y el lago Colico, en Cunco: cabañas equipadas con calefacción a leña, piscina, tinas termales, camping y canchas. Desde 2001.',
    comuna: 'Cunco, Región de La Araucanía',
    direccion: 'Cunco, cerca del río Allipén y el lago Colico',
    whatsapp: '56986739315',
    telefono: '+56 9 8673 9315',
    email: 'info@turismoterranostra.cl',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Complejo+Turistico+Terranostra+Cunco'
  },

  marca: { tinta: '#26301f', acento: '#5b7a2e', papel: '#f5f6f0' },

  propiedad: {
    titular: 'Cabañas para 2, 4 y 6 personas, con piscina y tinas termales',
    descripcion: 'Cada cabaña con refrigerador, cocina, TV satelital, ropa de cama, calefacción a leña, estacionamiento privado y quincho. En el complejo: piscina, tinas de relajación a 37 °C para 5 personas, salón de eventos, camping con baños privados, canchas de vóleibol y baby fútbol y zonas de picnic.',
    unidades: null,
    amenidades: ['Calefacción a leña', 'Cocina equipada', 'TV satelital', 'Quincho', 'Piscina', 'Tinas termales', 'Camping con baño privado', 'Canchas deportivas'],
    certificaciones: []
  },

  tipos: [
    { id: 'cabana-6', nombre: 'Cabaña para 6 personas', capacidad: 6, capacidadTarifa: 6, detalle: 'Refrigerador · cocina · TV satelital · calefacción a leña · quincho' },
    { id: 'cabana-4', nombre: 'Cabaña para 4 personas', capacidad: 4, capacidadTarifa: 4, detalle: 'Refrigerador · cocina · TV satelital · calefacción a leña · quincho' },
    { id: 'cabana-2', nombre: 'Cabaña para 2 personas', capacidad: 2, capacidadTarifa: 2, detalle: 'Refrigerador · cocina · TV satelital · calefacción a leña · quincho' },
    { id: 'alpina', nombre: 'Cabaña estilo alpino', capacidad: 2, capacidadTarifa: 2, detalle: 'El sitio no publica su capacidad: referencial, el complejo confirma.' }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el complejo, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por tinas, eventos o convenios institucionales antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: null, checkOut: null, abonoPorcentaje: 0, recargoUnaNoche: 0, ivaIncluido: null,
    notas: [
      'El sitio no publica tarifas: las confirma el complejo al responder.',
      'El sitio menciona un 15% de descuento por convenios institucionales: consúltalo al enviar la solicitud.',
      'Aviso de la muestra: faltan tarifas, horarios y capacidad de la cabaña alpina antes de publicar esta página.'
    ]
  },

  faq: [
    { pregunta: '¿Las cabañas tienen calefacción?', respuesta: 'Sí, calefacción a leña, además de refrigerador, cocina, TV satelital y ropa de cama.' },
    { pregunta: '¿Hay piscina y tinas?', respuesta: 'Sí. Piscina y tinas de relajación a 37 °C con capacidad para 5 personas.' },
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'Las tarifas no están publicadas en esta página. Envía tu consulta con fechas y pasajeros y el complejo te confirma el valor.' }
  ],

  atractivos: ['Río Allipén', 'Lago Colico', 'Parque Nacional Conguillío', 'Melipeuco y el volcán Llaima', 'Temuco (a una hora)'],

  galeria: []
};
