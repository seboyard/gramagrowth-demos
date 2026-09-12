/* Configuración de cliente. Sólo se edita este archivo.
   Datos: valdilum.cl, leído el 2026-09-12.
   Regla de honestidad: cada dato sale de una fuente pública del negocio. Lo que
   no está publicado queda en null y la página dice "se confirma en la visita".

   Ojo con el teléfono: el sitio publica "+56 9 9876 5432", que es un número de
   relleno de plantilla. NO se usa aquí. Se usan los fijos, que sí son reales.
   Ese hallazgo es justamente el motivo del primer correo. */

window.INSTALACION_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'valdilum.cl',
    leidoEl: '2026-09-12'
  },

  negocio: {
    nombre: 'Valdilum',
    bajada: 'Ventanas de PVC y aluminio, termopaneles y muros cortina, fabricados a medida en Valdivia.',
    comuna: 'Valdivia, Región de Los Ríos',
    direccion: '12 de Febrero 2080, Sector Estación, Valdivia',
    // Sin WhatsApp publicado: el correo pasa a ser el canal principal.
    whatsapp: '',
    telefono: '+56 63 2 226618',
    email: 'info@valdilum.cl',
    mapa: 'https://www.google.com/maps/search/?api=1&query=12+de+Febrero+2080+Valdivia'
  },

  marca: {
    tinta: '#1c2430',
    acento: '#1f6f8b',
    papel: '#f5f7f8'
  },

  impuestos: { iva: 19 },

  operacion: {
    titular: 'Cuatro trabajos, todos cotizados por metro cuadrado',
    descripcion: 'Hoy el formulario ofrece "Visita Técnica" y "Cotización" como motivo, pero no pide medidas. Esta página toma las medidas de cada vano, suma los metros cuadrados y manda la solicitud lista para presupuestar.',
    incluye: ['Fabricación a medida', 'Perfiles Deceuninck', 'Cristales Dialum', 'Instalación'],
    tiposProyecto: ['Residencial', 'Comercial', 'Industrial']
  },

  // El sitio publica la ciudad, no el radio de cobertura.
  cobertura: { comunas: null },

  trabajos: [
    {
      id: 'ventanas-pvc',
      nombre: 'Ventanas de PVC',
      resumen: 'Ventanas de PVC de alta calidad, diseñadas a medida, con perfiles Deceuninck.',
      medida: 'vano',
      materiales: [
        { id: 'pvc', nombre: 'Perfil de PVC Deceuninck', detalle: 'Aislación térmica y acústica. Estándar para vivienda en clima lluvioso.', valorM2: null, ivaIncluido: null, referencia: null }
      ]
    },
    {
      id: 'ventanas-aluminio',
      nombre: 'Ventanas de aluminio',
      resumen: 'Ventanas de aluminio a medida para vivienda y obra comercial.',
      medida: 'vano',
      materiales: [
        { id: 'aluminio', nombre: 'Perfil de aluminio', detalle: null, valorM2: null, ivaIncluido: null, referencia: null }
      ]
    },
    {
      id: 'termopanel',
      nombre: 'Termopanel',
      resumen: 'Doble vidriado hermético para reemplazar vidrio simple o para ventana nueva.',
      medida: 'vano',
      materiales: [
        { id: 'dvh', nombre: 'Termopanel con cristal Dialum', detalle: null, valorM2: null, ivaIncluido: null, referencia: null }
      ]
    },
    {
      id: 'muro-cortina',
      nombre: 'Muro cortina',
      resumen: 'Fachada vidriada continua para obra comercial e institucional.',
      medida: 'superficie',
      materiales: [
        { id: 'estandar', nombre: 'Muro cortina', detalle: null, valorM2: null, ivaIncluido: null, referencia: null }
      ]
    }
  ],

  aperturas: ['Corredera', 'Proyectante', 'Abatible', 'Fija', 'Oscilobatiente', 'Puerta'],
  adicionales: [],
  minimoM2PorVano: null,

  visita: {
    // El formulario ofrece "Visita Técnica" como motivo, pero el sitio no dice
    // si es gratuita ni en cuánto responden. No se afirma.
    gratuita: null,
    respuestaHoras: null
  },

  reglas: {
    notas: [
      'Las medidas que cargas aquí son referenciales: sirven para presupuestar, no reemplazan la medición en terreno.',
      'El valor final se confirma después de la visita técnica.',
      'Aviso de la muestra: faltan valores por m², condiciones de la visita y WhatsApp antes de publicar esta página.'
    ]
  },

  contactoDirecto: [
    'Hablas directamente con quien fabrica e instala, sin intermediarios.',
    'Sin comisión de portales de presupuestos sobre el valor de tu obra.',
    'Puedes revisar perfil, color y tipo de apertura antes de comprometer nada.'
  ],

  faq: [
    { pregunta: '¿Esto es un presupuesto formal?', respuesta: 'No. Es una solicitud con tus medidas ya tomadas, para que el equipo pueda presupuestar sin tener que preguntártelas una por una. El presupuesto formal sale después de la visita técnica.' },
    { pregunta: '¿Cómo mido un vano?', respuesta: 'Mide el ancho y el alto del hueco de la ventana por dentro, en centímetros, en el punto más angosto. Si te da distinto en dos puntos, anota el menor y coméntalo: esa diferencia la resuelve la visita.' },
    { pregunta: '¿Qué perfiles usan?', respuesta: 'Perfiles de PVC Deceuninck y cristales Dialum, según publica el sitio del negocio.' },
    { pregunta: '¿Por qué no aparece un precio?', respuesta: 'Porque el valor depende del perfil, del tipo de apertura, del estado del vano y de la instalación. La página te entrega el alcance medido; el número lo pone el equipo cuando ve la obra.' }
  ]
};
