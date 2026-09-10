/* ─────────────────────────────────────────────────────────────────────────
   ÚNICO ARCHIVO QUE SE EDITA POR CLIENTE.
   index.html, styles.css y app.js se reutilizan sin tocar.

   Regla de honestidad: cada precio y dato sale del sitio público del cliente
   o de material que él entregue. Un plan sin precio publicado se deja en
   `precio: null` y la página muestra "consultar" en vez de inventar un valor.

   Datos de esta configuración: sportlifevaldivia.cl, leído el 2026-09-10.
   ───────────────────────────────────────────────────────────────────────── */

window.GIMNASIO_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'sportlifevaldivia.cl',
    leidoEl: '2026-09-10'
  },

  negocio: {
    nombre: 'Sportlife Valdivia',
    bajada: 'Gimnasio con clases dirigidas, personal trainer y nutrición en el centro de Valdivia.',
    comuna: 'Valdivia, Región de Los Ríos',
    direccion: 'Av. Francia 2651, Local 16, Valdivia',
    whatsapp: '56993466021',
    telefono: '+56 63 227 9966',
    email: '',
    instagram: 'https://www.instagram.com/sportlife_valdivia',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Av+Francia+2651+Valdivia'
  },

  marca: { tinta: '#141b2b', acento: '#e0483c', papel: '#f5f5f7' },

  centro: {
    titular: 'Entrena con clases dirigidas y acompañamiento profesional',
    descripcion: 'Sala de máquinas, clases dirigidas durante todo el día y servicios de entrenamiento personalizado y nutrición en Av. Francia, Valdivia.',
    instalaciones: ['Sala de fitness', 'Clases dirigidas', 'Personal trainer', 'Nutrición', 'Sport Kids', 'Tour virtual disponible']
  },

  // Planes de membresía. Sportlife NO publica el valor de ninguno: su página
  // "Planes" sólo tiene un formulario de contacto. Se dejan en null a propósito
  // para que la muestra evidencie el hueco en vez de taparlo con un precio falso.
  planes: [
    {
      id: 'mensual', nombre: 'Plan mensual', precio: null, meses: 1, matricula: null,
      incluye: ['Acceso a sala de fitness', 'Clases dirigidas'],
      nota: 'Valor no publicado en el sitio.'
    },
    {
      id: 'anual', nombre: 'Plan anual', precio: null, meses: 12, matricula: null, destacado: true,
      incluye: ['Acceso a sala de fitness', 'Clases dirigidas', 'Mayor descuento según el sitio'],
      nota: 'El sitio anuncia que el plan anual tiene el mayor descuento, pero no publica el valor.'
    }
  ],

  // Servicios con precio efectivamente publicado.
  servicios: [
    { nombre: 'Personal Trainer', precio: 40900, incluye: ['Evaluación física', 'Rutina personal', 'Objetivos claros'] },
    { nombre: 'Nutrición', precio: 24900, incluye: ['Dieta personal', 'Objetivo médico', 'Evaluación física'] },
    { nombre: 'Sport Kids', precio: 14900, incluye: ['Guardería', 'Sala de juegos', 'Snacks'] }
  ],

  clases: [
    'Body Pump', 'Body Combat', 'Body Balance', 'Procycling', 'Sprint', 'GAP',
    'CXWorx', 'Grit Series', 'TRX', 'Pilates de suelo', 'Zumba', 'Entrenamiento funcional'
  ],

  horarios: [
    { dia: 'Lunes a viernes', desde: '07:00', hasta: '22:00' },
    { dia: 'Sábado', desde: '08:00', hasta: '19:00' },
    { dia: 'Domingo', desde: '09:00', hasta: '14:00' }
  ],

  prueba: {
    activo: true,
    titulo: 'Agenda una clase de prueba',
    texto: 'Cuéntanos qué plan te interesa y cuándo puedes venir. Te confirmamos cupo por WhatsApp.'
  },

  reglas: {
    notas: [
      'El sitio no publica el valor de los planes de membresía: los confirma el gimnasio al responder.',
      'Los valores de Personal Trainer, Nutrición y Sport Kids son los publicados en el sitio.',
      'Aviso de la muestra: faltan los precios de los planes y la matrícula antes de publicar esta página.'
    ]
  },

  faq: [
    { pregunta: '¿Cuánto cuesta el plan del gimnasio?', respuesta: 'El valor no está publicado en el sitio. Envía tu consulta indicando el plan que te interesa y te confirmamos el precio vigente.' },
    { pregunta: '¿Puedo probar antes de inscribirme?', respuesta: 'Escríbenos indicando el día y horario que te acomoda y coordinamos una clase de prueba.' },
    { pregunta: '¿Qué clases hay?', respuesta: 'Body Pump, Body Combat, Body Balance, Procycling, Sprint, GAP, CXWorx, Grit Series, TRX, Pilates de suelo, Zumba y entrenamiento funcional.' },
    { pregunta: '¿Tienen algo para niños?', respuesta: 'Sí, Sport Kids incluye guardería, sala de juegos y snacks, con un valor de $14.900 publicado en el sitio.' }
  ]
};
