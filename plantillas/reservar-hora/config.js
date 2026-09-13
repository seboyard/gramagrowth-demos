/* ─────────────────────────────────────────────────────────────────────────
   ÚNICO ARCHIVO QUE SE EDITA POR CLIENTE.
   index.html, styles.css y app.js se reutilizan sin tocar.

   Regla de honestidad: cada servicio, duración y precio de aquí sale del
   sitio público del cliente o de material que él entregue. Un servicio sin
   precio publicado se deja en `precio: null` y la página muestra "consultar"
   en vez de inventar un valor. Un precio inventado en una muestra quema al
   prospecto.

   Datos de esta configuración: barberiaovejanegra.cl y su agenda pública en
   ovejanegra24.site.agendapro.com (catálogo de servicios con duración y
   precio, horario por día y nombres de los barberos), leídos el 2026-09-13.

   Nota de lectura: el sitio publica el horario "Lunes – Viernes 10:00 – 20:00,
   Sábado 10:30 – 16:30", igual que la agenda. Los datos estructurados ocultos
   de la misma página dicen 19:00 y 15:30. Se toma lo visible; el cliente
   confirma cuál es el vigente.
   ───────────────────────────────────────────────────────────────────────── */

window.HORA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio y de su agenda en línea. No es el sitio oficial.',
    fuente: 'barberiaovejanegra.cl',
    leidoEl: '2026-09-13'
  },

  negocio: {
    nombre: 'Barbería Oveja Negra',
    bajada: 'Barbería clásica en el centro de Valdivia: cortes, diseño de barba y afeitado con navaja.',
    comuna: 'Valdivia, Región de Los Ríos',
    direccion: 'Caupolicán 201, Local 1, Valdivia',
    whatsapp: '56957480045',
    telefono: '+56 9 5748 0045',
    email: '',
    instagram: 'https://www.instagram.com/barberiaovejanegravaldivia',
    mapa: 'https://maps.google.com/?q=Caupolican+201+Valdivia',
    mapaEmbed: null
  },

  // Tomados de la paleta del propio sitio: fondo negro, texto hueso.
  marca: { tinta: '#0a0a0a', acento: '#b8863b', papel: '#f0ede8' },

  operacion: {
    titular: 'Corte, barba y afeitado con navaja',
    descripcion: 'Elige el servicio, el día y el bloque que te acomoda. La solicitud sale escrita por WhatsApp y la barbería la confirma.',
    incluye: ['Toallas calientes', 'Lavado y peinado incluidos en el corte', 'Productos de styling', 'Tienda de pomadas y after shave']
  },

  /* Horario por día de la semana. `null` en un día significa cerrado. Los
     bloques se generan cada `bloqueMinutos` desde la apertura y sólo se
     ofrecen los que terminan antes del cierre según la duración del servicio. */
  horario: {
    bloqueMinutos: 30,
    semana: {
      lunes: { apertura: '10:00', cierre: '20:00' },
      martes: { apertura: '10:00', cierre: '20:00' },
      miercoles: { apertura: '10:00', cierre: '20:00' },
      jueves: { apertura: '10:00', cierre: '20:00' },
      viernes: { apertura: '10:00', cierre: '20:00' },
      sabado: { apertura: '10:30', cierre: '16:30' },
      domingo: null
    }
  },

  /* Un servicio = una fila del catálogo publicado en la agenda en línea.
     precio: sólo cuando está publicado; en null la página dice "consultar" y
     el mensaje sale con "valor a confirmar".
     referencia: de dónde salió el precio, para poder revisarlo al renovar. */
  servicios: [
    {
      id: 'corte',
      nombre: 'Corte de cabello',
      duracionMinutos: 30,
      precio: 14000,
      detalle: 'Incluye lavado y peinado con productos de styling.',
      referencia: { fuente: 'ovejanegra24.site.agendapro.com', rotulo: 'catálogo de la agenda, 2026-09-13' }
    },
    {
      id: 'corte-nino',
      nombre: 'Corte de cabello niño (hasta 10 años)',
      duracionMinutos: 30,
      precio: 12000,
      detalle: 'Valor promocional publicado en el sitio para niños hasta 10 años.',
      referencia: { fuente: 'barberiaovejanegra.cl', rotulo: 'banner de promoción, 2026-09-13' }
    },
    {
      id: 'perfilado',
      nombre: 'Perfilado de barba con toallas',
      duracionMinutos: 30,
      precio: 12000,
      detalle: 'Perfilado con ritual de toallas calientes.',
      referencia: { fuente: 'ovejanegra24.site.agendapro.com', rotulo: 'catálogo de la agenda, 2026-09-13' }
    },
    {
      id: 'afeitado',
      nombre: 'Afeitado al ras con toallas calientes',
      duracionMinutos: 60,
      precio: 18000,
      detalle: 'Afeitado de barba al ras con toallas calientes.',
      referencia: { fuente: 'ovejanegra24.site.agendapro.com', rotulo: 'catálogo de la agenda, 2026-09-13' }
    },
    {
      id: 'corte-perfilado',
      nombre: 'Corte de cabello y perfilado de barba',
      duracionMinutos: 60,
      precio: 22000,
      detalle: 'Promoción publicada: corte más perfilado de barba.',
      referencia: { fuente: 'ovejanegra24.site.agendapro.com', rotulo: 'catálogo de la agenda, 2026-09-13' }
    },
    {
      id: 'corte-afeitado',
      nombre: 'Corte de cabello y afeitado al ras',
      duracionMinutos: 60,
      precio: 26000,
      detalle: 'Promoción publicada: corte más afeitado al ras.',
      referencia: { fuente: 'ovejanegra24.site.agendapro.com', rotulo: 'catálogo de la agenda, 2026-09-13' }
    },
    {
      id: 'corte-ras-perfilado',
      nombre: 'Corte de cabello al ras y perfilado con toallas',
      duracionMinutos: 60,
      precio: 27000,
      detalle: 'Promoción publicada: corte al ras más perfilado con toallas calientes.',
      referencia: { fuente: 'ovejanegra24.site.agendapro.com', rotulo: 'catálogo de la agenda, 2026-09-13' }
    },
    {
      id: 'afeitado-corte-ras',
      nombre: 'Afeitado al ras y corte de cabello al ras',
      duracionMinutos: 90,
      precio: 31000,
      detalle: 'Promoción publicada: afeitado al ras más corte al ras.',
      referencia: { fuente: 'ovejanegra24.site.agendapro.com', rotulo: 'catálogo de la agenda, 2026-09-13' }
    }
  ],

  /* Profesionales que aparecen en la agenda pública. Lista vacía → la página
     no pregunta por profesional. `servicios: []` significa que atiende todos;
     la agenda publica los nombres pero no qué servicio hace cada uno, así que
     se deja abierto hasta que el cliente lo confirme. */
  profesionales: [
    { id: 'eduardo', nombre: 'Eduardo Arancibia', servicios: [] },
    { id: 'helmut', nombre: 'Helmut Brandt', servicios: [] }
  ],

  reglas: {
    // Horas mínimas entre el momento de pedir y el bloque solicitado. El sitio
    // no declara una regla: se deja en 2 para no ofrecer el bloque que ya
    // empezó. El cliente la ajusta.
    anticipacionMinimaHoras: 2,
    notas: [
      'La hora queda confirmada cuando la barbería responde por WhatsApp.',
      'Los valores son los publicados en la agenda en línea de la barbería; se confirman al responder.',
      'Las promociones de corte más barba se agendan como un solo bloque.',
      'Domingo cerrado.'
    ]
  },

  // Por qué conviene pedir la hora directo.
  contactoDirecto: [
    'Hablas directo con la barbería, sin crear cuenta en ninguna plataforma.',
    'La solicitud sale con servicio, día y hora ya escritos: no hay ida y vuelta.',
    'Si el bloque no está libre, te proponen el más cercano en el mismo chat.'
  ],

  faq: [
    { pregunta: '¿La hora queda reservada al enviar el mensaje?', respuesta: 'No. Envías una solicitud con servicio, día y hora, y la barbería la confirma por WhatsApp. Si ese bloque ya está tomado te proponen otro.' },
    { pregunta: '¿Cuánto dura cada servicio?', respuesta: 'El corte y el perfilado de barba duran 30 minutos; el afeitado al ras y las promociones de corte más barba, una hora; y el afeitado más corte al ras, una hora y media.' },
    { pregunta: '¿Puedo elegir barbero?', respuesta: 'Sí. Al pedir la hora puedes indicar con quién prefieres atenderte, o dejarlo sin preferencia.' },
    { pregunta: '¿Qué días atienden?', respuesta: 'Lunes a viernes de 10:00 a 20:00 y sábado de 10:30 a 16:30. Domingo cerrado.' },
    { pregunta: '¿Tienen membresías?', respuesta: 'Sí, el sitio publica membresías Golden (3 meses) y Platinum (6 meses) con cortes y perfilados mensuales. Se consultan por WhatsApp.' }
  ]
};
