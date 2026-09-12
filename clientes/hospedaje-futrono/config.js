/* Configuración de cliente. Sólo se edita este archivo.
   Datos: hospedajefutrono.cl, leído el 2026-09-12 (portada, sección
   Habitaciones, pie de contacto y página Términos y Condiciones; el sitio es
   una aplicación que pinta el contenido con JavaScript, así que los datos se
   leyeron del paquete /assets/index-*.js que sirve la portada).
   Qué faltó: tarifas (no publicadas), porcentaje del abono (piden abono por
   transferencia, sin indicar el monto), Instagram/Facebook no tienen campo
   aquí. Regla de honestidad: cada dato sale del sitio; lo no publicado queda
   vacío y la página muestra "a confirmar". */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del negocio. No es el sitio oficial.',
    fuente: 'hospedajefutrono.cl',
    leidoEl: '2026-09-12'
  },
  unidadLabel: 'Habitación',
  negocio: {
    nombre: 'Hospedaje Futrono',
    bajada: 'Aquí nacen las buenas historias. Alojamiento cómodo en Futrono, Región de Los Ríos: habitaciones con baño privado, servicios para empresas y experiencias turísticas.',
    comuna: 'Futrono, Región de Los Ríos',
    direccion: 'Juan Luis Sanfuentes 1080, Futrono',
    whatsapp: '56981630548',
    telefono: '+56 9 8163 0548',
    email: 'contactohospedajefutrono@gmail.com',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Juan+Luis+Sanfuentes+1080+Futrono'
  },
  marca: {
    tinta: '#1f2a24',
    acento: '#3f7d5c',
    papel: '#f6f4ee'
  },
  propiedad: {
    titular: 'Seis habitaciones en Futrono, a pasos del Lago Ranco',
    descripcion: 'Habitaciones matrimoniales, dobles, familiares e individuales, con baño privado o compartido. Comedor compartido, terraza, estacionamiento, agua caliente y calefacción de hogar. Reciben equipos de trabajo en terreno con facturación y horarios adaptados. Horario de atención: lunes a domingo, 08:00 a 22:00.',
    unidades: 6,
    amenidades: [
      'Habitaciones cálidas',
      'Comedor compartido',
      'Terraza y naturaleza',
      'Estacionamiento',
      'Seguridad 24/7',
      'Agua caliente',
      'Calefacción de hogar',
      'Lavado y secado (servicio adicional)',
      'Custodia gratuita de equipaje'
    ],
    certificaciones: []
  },
  tipos: [
    {
      id: 'nilahue',
      nombre: 'Habitación Nilahue',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: 'Matrimonial · baño privado'
    },
    {
      id: 'caunahue',
      nombre: 'Habitación Caunahue',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: 'Doble · baño privado'
    },
    {
      id: 'isla-huapi',
      nombre: 'Habitación Isla Huapi',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: 'Doble · baño privado'
    },
    {
      id: 'llifen',
      nombre: 'Habitación Llifén',
      capacidad: 4,
      capacidadTarifa: 4,
      detalle: 'Familiar hasta 4 personas · baño privado'
    },
    {
      id: 'calcurrupe',
      nombre: 'Habitación Calcurrupe',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: 'Doble · baño compartido'
    },
    {
      id: 'lago-maihue',
      nombre: 'Habitación Lago Maihue',
      capacidad: 1,
      capacidadTarifa: 1,
      detalle: 'Individual · baño compartido'
    }
  ],
  temporadas: [],
  noDisponibles: [],
  reservaDirecta: [
    'Hablas directamente con el hospedaje, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por llegada anticipada, custodia de equipaje o facturación para tu empresa antes de pagar.'
  ],
  promociones: [],
  reglas: {
    checkIn: '13:00',
    checkOut: '12:00',
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'El sitio no publica tarifas: las confirma el anfitrión.',
      'La reserva se confirma con el comprobante de transferencia del abono solicitado; el sitio no indica el porcentaje del abono.',
      'Check in a partir de las 13:00; check out hasta las 12:00. Si llegas antes puedes dejar el equipaje en custodia y usar las áreas comunes.',
      'Devolución del abono: en enero y febrero, si se cancela con al menos 48 horas de anticipación; el resto del año, antes de las 08:00 del día de llegada.',
      'Servicios de alimentación y repostería (estilo alemán) se piden con anticipación y pueden tener costo adicional.'
    ]
  },
  faq: [
    {
      pregunta: '¿Cuánto vale la noche?',
      respuesta: 'Las tarifas no están publicadas en el sitio. Envía tu consulta con fechas, habitación y pasajeros y te confirmamos el valor.'
    },
    {
      pregunta: '¿Puedo llegar antes del check-in para descansar?',
      respuesta: 'Sí. Puedes ingresar, usar los espacios comunes y dejar tu equipaje en custodia mientras preparan tu habitación.'
    },
    {
      pregunta: '¿Aceptan trabajadores o equipos en terreno?',
      respuesta: 'Sí. Ofrecen facturación, horarios adaptados y un ambiente de silencio y reposo para recuperar energías.'
    },
    {
      pregunta: '¿Se permiten mascotas?',
      respuesta: 'Aceptan únicamente gatos de pelaje corto, bajo condiciones que aseguren la convivencia con otros huéspedes. Piden traer una manta personal para el descanso del gato.'
    },
    {
      pregunta: '¿Qué rincones naturales recomiendan en Futrono?',
      respuesta: 'Las playas del Lago Ranco (Huequecura, Coique y San Pedro, entre 15 y 20 km), senderos de trekking, Isla Huapi y termas cercanas. Te orientan a la llegada.'
    }
  ],
  atractivos: [
    'Playa Huequecura (aprox. 20 km)',
    'Playa Coique (aprox. 15 km)',
    'Playa San Pedro (aprox. 20 km)',
    'Cerro Toribio',
    'Isla Huapi',
    'Termas cercanas',
    'Pesca deportiva en la cuenca del Lago Ranco'
  ],
  galeria: [
    'https://horizons-cdn.hostinger.com/3fbde40b-adbe-4913-bc11-7aff32c2a3bb/39e2f9382d9dc4abca3efaecb993fd59.webp',
    'https://horizons-cdn.hostinger.com/3fbde40b-adbe-4913-bc11-7aff32c2a3bb/dcbd961afbf7f8a0eb31151bab4485f7.jpg',
    'https://horizons-cdn.hostinger.com/3fbde40b-adbe-4913-bc11-7aff32c2a3bb/1a0967f1a0f401811942605170c64e93.jpg',
    'https://horizons-cdn.hostinger.com/3fbde40b-adbe-4913-bc11-7aff32c2a3bb/8e3dfd279aafa2a1d96b4158338d63c4.webp'
  ]
};
