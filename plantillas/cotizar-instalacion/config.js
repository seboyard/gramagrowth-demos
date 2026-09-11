/* ─────────────────────────────────────────────────────────────────────────
   ÚNICO ARCHIVO QUE SE EDITA POR CLIENTE.
   index.html, styles.css y app.js se reutilizan sin tocar.

   Regla de honestidad: cada valor por m² de aquí debe salir de material que
   entregue el cliente o de su sitio público. Si no existe, se deja en null y
   la página dice "se confirma en la visita" en vez de inventar un rango. En
   este rubro inventar un precio no sólo quema al prospecto: lo expone a que
   alguien le exija un valor que él nunca dio.

   Este vertical es distinto a los otros tres. Su resultado principal no es un
   total en pesos, es un ALCANCE MEDIDO: cuántos vanos, de qué medidas, cuántos
   m². Ese dato es el que hoy no le llega al instalador, y es el que le permite
   decidir si vale la pena mandar a alguien a medir.

   Datos de esta configuración: sitio público tecalumvaldivia.cl, leído el
   2026-09-10. El sitio no publica ningún valor ni rango de precio, así que
   todos los `valorM2` van en null: es el estado real del negocio, no un vacío
   de la plantilla. Los siete trabajos son las opciones del selector de
   servicio de su propio formulario.
   ───────────────────────────────────────────────────────────────────────── */

window.INSTALACION_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'tecalumvaldivia.cl',
    leidoEl: '2026-09-10'
  },

  negocio: {
    nombre: 'TecAlum',
    bajada: 'Fabricación e instalación de ventanas, termopaneles y estructuras de aluminio y PVC en Valdivia. Desde 1992.',
    comuna: 'Valdivia, Región de Los Ríos',
    direccion: 'Phillipi 1152, Valdivia',
    whatsapp: '56991781632',
    telefono: '+56 63 2 228160',
    email: 'ventas@tecalumvaldivia.cl',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Phillipi+1152+Valdivia'
  },

  marca: {
    tinta: '#16243a',
    acento: '#00346f',
    papel: '#f4f6f9'
  },

  impuestos: {
    // Los valores del rubro se cotizan sin IVA. Cuando el cliente entregue los
    // suyos, la página lo suma aparte en vez de esconderlo en el total.
    iva: 19
  },

  operacion: {
    titular: 'Siete trabajos, todos cotizados por metro cuadrado',
    descripcion: 'Hoy el formulario pide "describe tu proyecto" y llega una consulta sin medidas. Esta página toma las medidas de cada vano, suma los metros cuadrados y manda la solicitud lista para presupuestar.',
    incluye: ['Fabricación propia', 'Instalación', 'Residencial', 'Comercial', 'Industrial'],
    tiposProyecto: ['Residencial', 'Comercial', 'Industrial', 'Institucional']
  },

  /* Comunas atendidas. En null la página pide la comuna como texto libre y no
     inventa un límite de cobertura. Con una lista, muestra un selector y avisa
     —sin bloquear— cuando la comuna elegida no está en ella.
     tecalumvaldivia.cl publica la ciudad, no el radio de cobertura. */
  cobertura: {
    comunas: null
  },

  /* Un trabajo = un servicio que el cliente publica.

     medida: 'vano'       → la persona carga ventana por ventana (ancho × alto ×
                            cantidad). Es el modo que resuelve el problema real.
     medida: 'superficie' → la persona ingresa los m² de una sola vez. Para
                            aislación, fachadas, revestimiento o tabiquería.

     materiales[].valorM2: { desde, hasta } sólo cuando el cliente lo entrega
     por escrito. En null la página muestra el alcance medido y dice que el
     valor se cierra en la visita.

     materiales[].referencia: de dónde salió ese valor y con qué año está
     rotulado: { fuente, rotulo }. Si el rótulo es de un año anterior, la página
     lo avisa sola. */
  trabajos: [
    {
      id: 'termopaneles',
      nombre: 'Termopaneles',
      resumen: 'Doble vidriado hermético, en perfil de PVC o aluminio, fabricado a medida.',
      medida: 'vano',
      materiales: [
        { id: 'pvc', nombre: 'Perfil de PVC', detalle: 'Mejor corte de puente térmico. Es el estándar para vivienda en clima lluvioso.', valorM2: null, ivaIncluido: null, referencia: null },
        { id: 'aluminio', nombre: 'Perfil de aluminio', detalle: 'Perfil más delgado y mayor luz de vidrio. Habitual en fachada comercial.', valorM2: null, ivaIncluido: null, referencia: null }
      ]
    },
    {
      id: 'ventanas-aluminio',
      nombre: 'Ventanas de aluminio',
      resumen: 'Ventanas de aluminio a medida, en línea corredera, proyectante o fija.',
      medida: 'vano',
      materiales: [
        { id: 'estandar', nombre: 'Aluminio', detalle: null, valorM2: null, ivaIncluido: null, referencia: null }
      ]
    },
    {
      id: 'puertas',
      nombre: 'Puertas de aluminio y PVC',
      resumen: 'Puertas de acceso y de servicio en aluminio o PVC.',
      medida: 'vano',
      materiales: [
        { id: 'aluminio', nombre: 'Aluminio', detalle: null, valorM2: null, ivaIncluido: null, referencia: null },
        { id: 'pvc', nombre: 'PVC', detalle: null, valorM2: null, ivaIncluido: null, referencia: null }
      ]
    },
    {
      id: 'shower-door',
      nombre: 'Shower door',
      resumen: 'Mamparas de baño en vidrio templado, a medida del box.',
      medida: 'vano',
      materiales: [
        { id: 'templado', nombre: 'Vidrio templado', detalle: null, valorM2: null, ivaIncluido: null, referencia: null }
      ]
    },
    {
      id: 'divisiones-oficina',
      nombre: 'Divisiones de oficina',
      resumen: 'Tabiquería vidriada para separar espacios de trabajo.',
      medida: 'superficie',
      materiales: [
        { id: 'estandar', nombre: 'Perfilería y cristal', detalle: null, valorM2: null, ivaIncluido: null, referencia: null }
      ]
    },
    {
      id: 'fachadas',
      nombre: 'Fachadas y muros cortina',
      resumen: 'Fachada vidriada continua para obra comercial e institucional.',
      medida: 'superficie',
      materiales: [
        { id: 'estandar', nombre: 'Muro cortina', detalle: null, valorM2: null, ivaIncluido: null, referencia: null }
      ]
    },
    {
      id: 'tabiques-espejos',
      nombre: 'Tabiques y espejos',
      resumen: 'Espejos y paños de cristal a medida.',
      medida: 'superficie',
      materiales: [
        { id: 'estandar', nombre: 'Cristal a medida', detalle: null, valorM2: null, ivaIncluido: null, referencia: null }
      ]
    }
  ],

  /* Tipos de apertura ofrecidos al cargar un vano. Es vocabulario del rubro,
     no un dato de precio: sirve para que la solicitud llegue completa. */
  aperturas: ['Corredera', 'Proyectante', 'Abatible', 'Fija', 'Oscilobatiente', 'Puerta'],

  /* Trabajos extra que se suman a la estimación.
     unidad: 'm2' multiplica por la superficie, 'vano' por el número de piezas,
     'trabajo' es un monto único. Vacío mientras el cliente no entregue sus
     valores: la sección no aparece en vez de mostrar precios inventados. */
  adicionales: [],

  /* Mínimo facturable por pieza. Muchos fabricantes cobran un mínimo aunque la
     ventana mida menos. En null no se aplica ningún mínimo. */
  minimoM2PorVano: null,

  visita: {
    // Ambos datos están publicados en el sitio del cliente.
    gratuita: true,
    respuestaHoras: 24
  },

  reglas: {
    notas: [
      'Las medidas que cargas aquí son referenciales: sirven para presupuestar, no reemplazan la medición en terreno.',
      'El valor final se confirma después de la visita técnica.',
      'La visita de cotización es gratuita y sin compromiso.',
      'El sitio del negocio compromete respuesta dentro de 24 horas.'
    ]
  },

  // Por qué conviene cotizar directo y no a través de un portal de presupuestos.
  contactoDirecto: [
    'Hablas directamente con quien fabrica e instala, sin intermediarios.',
    'Sin comisión de portales de presupuestos sobre el valor de tu obra.',
    'Puedes revisar perfil, color y tipo de apertura antes de comprometer nada.'
  ],

  faq: [
    { pregunta: '¿Esto es un presupuesto formal?', respuesta: 'No. Es una solicitud con tus medidas ya tomadas, para que el equipo pueda presupuestar sin tener que preguntártelas una por una. El presupuesto formal sale después de la visita técnica.' },
    { pregunta: '¿Cómo mido un vano?', respuesta: 'Mide el ancho y el alto del hueco de la ventana por dentro, en centímetros, en el punto más angosto. Si te da distinto en dos puntos, anota el menor y coméntalo: esa diferencia la resuelve la visita.' },
    { pregunta: '¿Cuánto cuesta la visita?', respuesta: 'La cotización es gratuita y sin compromiso, según lo que publica el negocio en su sitio.' },
    { pregunta: '¿En cuánto responden?', respuesta: 'El sitio compromete respuesta dentro de 24 horas con una propuesta personalizada.' },
    { pregunta: '¿Por qué no aparece un precio?', respuesta: 'Porque el valor depende del perfil, del tipo de apertura, del estado del vano y de la instalación. La página te entrega el alcance medido; el número lo pone el equipo cuando ve la obra.' }
  ]
};
