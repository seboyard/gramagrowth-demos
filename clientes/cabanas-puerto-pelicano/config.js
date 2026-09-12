/* Configuración de cliente. Sólo se edita este archivo.
   Datos: el sitio propio (puertopelicano.cl) YA NO EXISTE (NXDOMAIN, verificado
   2026-09-12). Lo que hay aquí sale de la ficha en OpenStreetMap (teléfono) y de
   la descripción pública del negocio en Tripadvisor y Frommer's, leídas el
   2026-09-12. Regla de honestidad: sin tarifas (no hay ninguna publicada por el
   negocio) y capacidades tal como las describen esas fichas. */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del negocio (OpenStreetMap y Tripadvisor). No es el sitio oficial. El dominio original ya no existe.',
    fuente: 'tripadvisor.com y openstreetmap.org',
    leidoEl: '2026-09-12'
  },

  negocio: {
    nombre: 'Cabañas Puerto Pelícano',
    bajada: 'Diez cabañas a orillas del río Valdivia, a 15 minutos del centro y 20 de Niebla. Piscina, quincho y estacionamiento.',
    comuna: 'Valdivia, Región de Los Ríos',
    direccion: 'Ribera del río Valdivia, camino a Niebla, Valdivia',
    whatsapp: '',
    telefono: '+56 63 204481',
    email: '',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Caba%C3%B1as+Puerto+Pel%C3%ADcano+Valdivia'
  },

  marca: {
    tinta: '#1f2f2a',
    acento: '#2c7a5b',
    papel: '#f4f6f2'
  },

  propiedad: {
    titular: 'Diez cabañas independientes frente al río',
    descripcion: 'Cabañas para 4 y 5 personas con dos dormitorios, living-comedor con cocina equipada (refrigerador, cocina, microondas y vajilla) y terraza con parrilla. Piscina al aire libre, sala de juegos, lavandería, wifi y estacionamiento por cabaña. Ideal para pesca, esquí acuático y navegación.',
    unidades: 10,
    amenidades: ['2 dormitorios', 'Cocina equipada', 'Terraza con parrilla', 'Piscina', 'Sala de juegos', 'Lavandería', 'Wifi', 'Estacionamiento'],
    certificaciones: []
  },

  tipos: [
    { id: 'cabana-4', nombre: 'Cabaña para 4 personas', capacidad: 4, capacidadTarifa: 4, detalle: 'Dormitorio matrimonial · dormitorio con dos camas · living-comedor · cocina · terraza con parrilla' },
    { id: 'cabana-5', nombre: 'Cabaña para 5 personas', capacidad: 5, capacidadTarifa: 4, detalle: 'Dormitorio matrimonial · dormitorio con camarote y cama · living-comedor · cocina · terraza con parrilla' }
  ],

  temporadas: [],
  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con el anfitrión, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por mascotas, botes o llegada tarde antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: null,
    checkOut: null,
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'El negocio no publica tarifas: las confirma el anfitrión al responder.',
      'Las capacidades son las descritas en sus fichas públicas; el anfitrión confirma la distribución de camas.',
      'Aviso de la muestra: faltan tarifas, horarios, correo y WhatsApp antes de publicar esta página.'
    ]
  },

  faq: [
    { pregunta: '¿Qué incluye la cabaña?', respuesta: 'Dos dormitorios, living-comedor con cocina equipada (refrigerador, cocina, microondas y vajilla), baño y terraza con parrilla.' },
    { pregunta: '¿Tienen piscina?', respuesta: 'Sí, piscina al aire libre, además de sala de juegos y lavandería.' },
    { pregunta: '¿Qué tan lejos están del centro?', respuesta: 'A unos 15 minutos en auto del centro de Valdivia y 20 de Niebla, a orillas del río Valdivia.' },
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'Las tarifas no están publicadas en esta página. Envía tu consulta con fechas y pasajeros y el anfitrión te confirma el valor.' }
  ],

  atractivos: ['Río Valdivia y navegación', 'Niebla y su fuerte', 'Parque Oncol', 'Jardín Botánico UACh', 'Mercado Fluvial', 'Corral'],

  galeria: []
};
