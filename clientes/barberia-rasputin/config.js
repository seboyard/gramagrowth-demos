/* Configuración de cliente. Sólo se edita este archivo.
   Datos: agenda pública agendapro.com/mp/cl/pl/barberia-rasputin-valdivia,
   leída el 2026-09-14. Publica tres servicios con precio y duración, el
   horario y la dirección; no publica teléfono ni Instagram (el perfil
   @rasputin.barberia y el Facebook aparecen en directorios de terceros).
   Regla de honestidad: sólo los tres servicios con precio publicado llevan
   valor; el resto del catálogo queda en null → "consultar". Los directorios
   muestran dos teléfonos distintos: no se usa ninguno hasta confirmarlo. */

window.HORA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública de la agenda en línea de la barbería. No es el sitio oficial.',
    fuente: 'agendapro.com (Barbería Rasputín)',
    leidoEl: '2026-09-14'
  },

  negocio: {
    nombre: 'Barbería Rasputín',
    bajada: 'Barbería y spa masculino en el centro de Valdivia: corte, barba, afeitado clásico y tratamientos faciales.',
    comuna: 'Valdivia, Región de Los Ríos',
    direccion: 'Arauco 950, Local 2, Valdivia',
    // Sin WhatsApp ni teléfono publicados por la barbería: el botón principal
    // queda oculto hasta que lo confirme. Instagram es el canal conocido.
    whatsapp: '',
    telefono: '',
    email: '',
    instagram: 'https://www.instagram.com/rasputin.barberia',
    mapa: 'https://maps.google.com/?q=Arauco+950+Valdivia',
    mapaEmbed: null
  },

  marca: { tinta: '#1a1614', acento: '#9c2f2f', papel: '#f3efe9' },

  operacion: {
    titular: 'Corte, barba y afeitado clásico, con hora pedida desde el celular',
    descripcion: 'Hoy la hora se pide entrando a una plataforma de agenda. Aquí eliges servicio, día y bloque, y la solicitud sale escrita; la barbería confirma.',
    incluye: ['Afeitado clásico', 'Diseño de barba', 'Tratamientos faciales', 'Barbería para niños']
  },

  /* Horario tal como lo publica la agenda. Los directorios de terceros
     muestran también un turno de tarde (15:00–20:00) de lunes a viernes; se
     toma lo que publica la propia agenda y el cliente confirma. */
  horario: {
    bloqueMinutos: 30,
    semana: {
      lunes: { apertura: '11:00', cierre: '14:00' },
      martes: { apertura: '11:00', cierre: '14:00' },
      miercoles: { apertura: '11:00', cierre: '14:00' },
      jueves: { apertura: '11:00', cierre: '14:00' },
      viernes: { apertura: '11:00', cierre: '14:00' },
      sabado: { apertura: '11:00', cierre: '17:00' },
      domingo: null
    }
  },

  servicios: [
    { id: 'corte', nombre: 'Corte de cabello', duracionMinutos: 60, precio: 14000, detalle: null, referencia: { fuente: 'agendapro.com', rotulo: 'catálogo de la agenda, 2026-09-14' } },
    { id: 'perfilado', nombre: 'Perfilado de barba', duracionMinutos: 60, precio: 12000, detalle: null, referencia: { fuente: 'agendapro.com', rotulo: 'catálogo de la agenda, 2026-09-14' } },
    { id: 'corte-adulto-mayor', nombre: 'Corte de cabello adulto mayor', duracionMinutos: 60, precio: 12000, detalle: null, referencia: { fuente: 'agendapro.com', rotulo: 'catálogo de la agenda, 2026-09-14' } },
    { id: 'afeitado', nombre: 'Afeitado clásico', duracionMinutos: 60, precio: null, detalle: 'Publicado sin valor ni duración: se confirma al responder.', referencia: null },
    { id: 'diseno-barba', nombre: 'Diseño de barba', duracionMinutos: 60, precio: null, detalle: 'Publicado sin valor ni duración: se confirma al responder.', referencia: null },
    { id: 'facial', nombre: 'Tratamiento facial', duracionMinutos: 60, precio: null, detalle: 'Publicado sin valor ni duración: se confirma al responder.', referencia: null },
    { id: 'corte-nino', nombre: 'Corte de cabello niño', duracionMinutos: 60, precio: null, detalle: 'Publicado sin valor ni duración: se confirma al responder.', referencia: null }
  ],

  // La agenda no publica nombres de barberos.
  profesionales: [],

  reglas: {
    anticipacionMinimaHoras: 2,
    notas: [
      'La hora queda confirmada cuando la barbería responde.',
      'Los valores con precio son los publicados en su agenda en línea; los demás se confirman al responder.',
      'Aviso de la muestra: faltan WhatsApp, duración real de los servicios sin valor y el turno de tarde antes de publicar esta página.'
    ]
  },

  contactoDirecto: [
    'Hablas directo con la barbería, sin crear cuenta en ninguna plataforma.',
    'La solicitud sale con servicio, día y hora ya escritos: no hay ida y vuelta.',
    'Si el bloque no está libre, te proponen el más cercano en el mismo chat.'
  ],

  faq: [
    { pregunta: '¿La hora queda reservada al enviar el mensaje?', respuesta: 'No. Envías una solicitud con servicio, día y hora, y la barbería la confirma. Si ese bloque ya está tomado te proponen otro.' },
    { pregunta: '¿Cuánto vale el corte?', respuesta: 'Corte de cabello $14.000, perfilado de barba $12.000 y corte adulto mayor $12.000, según su agenda en línea. Los demás servicios se cotizan al responder.' },
    { pregunta: '¿Qué días atienden?', respuesta: 'Según la agenda, lunes a viernes de 11:00 a 14:00 y sábado de 11:00 a 17:00. Domingo cerrado.' }
  ]
};
