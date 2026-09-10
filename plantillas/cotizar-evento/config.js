/* ─────────────────────────────────────────────────────────────────────────
   ÚNICO ARCHIVO QUE SE EDITA POR CLIENTE.
   Todo lo demás (index.html, styles.css, app.js) se reutiliza sin tocar.

   Regla de honestidad: cada monto, mínimo y regla de aquí debe salir de
   material entregado por el cliente o de su material público. Si un dato no
   existe, se deja en null y la página muestra "a confirmar" en vez de
   inventarlo. Un precio inventado en una muestra quema al prospecto.

   Datos de esta configuración: sitio público bdbanqueteria.com y los ocho
   PDF de cotización que ese sitio publica para descarga, leídos el 2026-09-10.
   Los valores por persona vienen de documentos rotulados 2024, y varias
   reglas de abono difieren entre un PDF y otro. Todo eso se refleja tal cual:
   la página lo muestra como "por confirmar" en lugar de emparejarlo.
   ───────────────────────────────────────────────────────────────────────── */

window.EVENTO_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio y de sus PDF de cotización. No es el sitio oficial.',
    fuente: 'bdbanqueteria.com',
    leidoEl: '2026-09-10'
  },

  negocio: {
    nombre: 'BD Banquetería',
    bajada: 'Banquetería para matrimonios, eventos corporativos y celebraciones en Valdivia. Desde 2016.',
    comuna: 'Valdivia, Región de Los Ríos',
    cobertura: 'Valdivia y alrededores',
    responsable: 'Bárbara Díaz Martínez',
    whatsapp: '56974538789',
    telefono: '+56 9 7453 8789',
    email: 'contacto@bdbanqueteria.com',
    // El sitio público no publica dirección de local, sólo la ciudad. Sin
    // dirección la página muestra la cobertura en vez de un mapa vacío.
    direccion: null,
    mapa: null
  },

  marca: {
    tinta: '#2a2118',
    acento: '#a8763e',
    papel: '#f7f3ed'
  },

  impuestos: {
    // Los valores publicados están expresados sin IVA. La página lo suma y lo
    // muestra separado, porque es la diferencia que hoy sorprende al cliente.
    iva: 19
  },

  operacion: {
    titular: 'Ocho servicios, cada uno con su mínimo de personas',
    descripcion: 'Hoy cada servicio se cotiza descargando un PDF distinto. Esta página los reúne: eliges el servicio, la fecha y cuántos son, y la consulta sale con todo escrito.',
    incluye: ['Organización', 'Decoración y montaje', 'Preparación de comidas', 'Garzones'],
    tiposEvento: ['Matrimonio', 'Evento corporativo', 'Coffee break', 'Celebración', 'Otro']
  },

  /* Un servicio = un PDF de cotización publicado.

     opciones[].valorPorInvitado: sólo cuando el documento lo publica. En null
     la página dice que el valor lo confirma el equipo y la solicitud sale igual.

     documento.rotulo: el año impreso en el propio PDF. Si es anterior al año en
     curso, la página avisa que la tarifa está por confirmar. Cuando el cliente
     entrega sus valores vigentes se actualiza el rótulo y el aviso desaparece
     solo. */
  servicios: [
    {
      id: 'matrimonio-completo',
      nombre: 'Matrimonio completo',
      resumen: 'Aperitivos, cóctel de 9 bocados por persona, entrada, plato principal y postre, con servicio de mesa.',
      minimoInvitados: 40,
      opciones: [
        { id: 'unica', nombre: 'Menú completo', detalle: 'Aperitivos, cóctel, entrada a elección, plato principal a elección (proteína de 220 a 250 g) y postre.', valorPorInvitado: null, ivaIncluido: null }
      ],
      abono: { porcentaje: 60, plazoHabiles: 10 },
      documento: { archivo: 'Cotización de matrimonio completo', rotulo: '2025' }
    },
    {
      id: 'matrimonio-tres-tiempos',
      nombre: 'Matrimonio de tres tiempos',
      resumen: 'Menú de tres tiempos con servicio de mesa.',
      minimoInvitados: 40,
      opciones: [
        { id: 'unica', nombre: 'Menú de tres tiempos', detalle: null, valorPorInvitado: null, ivaIncluido: null }
      ],
      abono: { porcentaje: 60, plazoHabiles: 10 },
      documento: { archivo: 'Cotización de matrimonio · tres tiempos', rotulo: '2025' }
    },
    {
      id: 'matrimonio-buffet-postres',
      nombre: 'Matrimonio con buffet de postres',
      resumen: 'Servicio de matrimonio con buffet de postres.',
      minimoInvitados: 40,
      opciones: [
        { id: 'unica', nombre: 'Menú con buffet de postres', detalle: null, valorPorInvitado: null, ivaIncluido: null }
      ],
      abono: { porcentaje: 60, plazoHabiles: 10 },
      documento: { archivo: 'Cotización de matrimonio · buffet de postres', rotulo: '2025' }
    },
    {
      id: 'coctel-gourmet',
      nombre: 'Cóctel gourmet',
      resumen: 'Cóctel de bocados fríos y calientes, tablas de picoteo y dulces, con jugos naturales y agua mineral.',
      minimoInvitados: 30,
      opciones: [
        { id: 'unica', nombre: 'Cóctel gourmet', detalle: 'Crudités, fajitas mexicanas, ceviche de salmón, empanaditas, chupe de jaiba, crostinis, tapaditos, tablas de picoteo, pie de limón y kuchen de miga.', valorPorInvitado: null, ivaIncluido: null }
      ],
      abono: { porcentaje: 50, plazoHabiles: null },
      // El PDF imprime "COTIZACIÓN | 202": el año quedó cortado en el propio
      // documento. Se deja en null en vez de suponer cuál era.
      documento: { archivo: 'Cotización de cóctel gourmet', rotulo: null }
    },
    {
      id: 'coctel-sencillo',
      nombre: 'Cóctel sencillo',
      resumen: 'Cóctel de bocados con servicio de bebidas.',
      minimoInvitados: 40,
      opciones: [
        { id: 'unica', nombre: 'Cóctel sencillo', detalle: null, valorPorInvitado: 7500, ivaIncluido: false }
      ],
      abono: { porcentaje: 50, plazoHabiles: null },
      documento: { archivo: 'Cotización de cóctel sencillo', rotulo: '2024' }
    },
    {
      id: 'coffee-break',
      nombre: 'Coffee break',
      resumen: 'Tres opciones de coffee break con café de grano, sándwiches y dulces.',
      minimoInvitados: 50,
      opciones: [
        { id: 'opcion-1', nombre: 'Opción 1', detalle: 'Sándwiches surtidos: pollo con cebollín, pasta de huevo, jamón y queso.', valorPorInvitado: 5500, ivaIncluido: false },
        { id: 'opcion-2', nombre: 'Opción 2', detalle: 'Café de grano, chips de chocolate, delicias, alfajor y trufa.', valorPorInvitado: 6000, ivaIncluido: false },
        { id: 'opcion-3', nombre: 'Opción 3', detalle: 'Café de grano, camarones al pil pil y queso camembert con nueces y miel.', valorPorInvitado: 7000, ivaIncluido: false }
      ],
      abono: { porcentaje: 60, plazoHabiles: 7 },
      documento: { archivo: 'Cotización de coffee break', rotulo: '2024' }
    },
    {
      id: 'almuerzo',
      nombre: 'Almuerzo',
      resumen: 'Servicio de almuerzo con atención de mesa.',
      minimoInvitados: 40,
      opciones: [
        { id: 'unica', nombre: 'Menú de almuerzo', detalle: null, valorPorInvitado: null, ivaIncluido: null }
      ],
      abono: { porcentaje: 60, plazoHabiles: 7 },
      documento: { archivo: 'Cotización de almuerzo', rotulo: '2023' }
    },
    {
      id: 'coctel-almuerzo-once',
      nombre: 'Cóctel, almuerzo y once',
      resumen: 'Servicio de jornada completa: cóctel, almuerzo y once.',
      minimoInvitados: 40,
      opciones: [
        { id: 'unica', nombre: 'Servicio completo', detalle: null, valorPorInvitado: null, ivaIncluido: null }
      ],
      abono: { porcentaje: 60, plazoHabiles: 10 },
      documento: { archivo: 'Cotización de cóctel, almuerzo y once', rotulo: '2024' }
    }
  ],

  /* Servicios extra que se suman a la cotización.
     unidad: 'invitado' multiplica por el número de personas; 'evento' es un
     monto único. Vacío mientras el cliente no entregue sus valores: la página
     esconde la sección en vez de mostrar precios inventados. */
  adicionales: [],

  /* Fechas ya comprometidas, editadas a mano por el cliente. No es una agenda
     sincronizada: es la lista que evita la peor vergüenza, que alguien cotice
     un sábado que está tomado hace meses.
     Acepta un día suelto { fecha } o un rango { desde, hasta }. */
  fechasTomadas: [],

  reglas: {
    notas: [
      'La reserva de fecha y servicio se confirma con el pago del abono o con orden de compra.',
      'El saldo restante se paga una vez realizado el servicio.',
      'Los valores publicados están expresados sin IVA.',
      'El porcentaje de abono y el plazo cambian según el servicio contratado.'
    ]
  },

  // Por qué conviene cotizar directo y no a través de un portal de novios.
  contactoDirecto: [
    'Hablas directamente con quien organiza el evento, sin intermediarios.',
    'Sin comisión de portales sobre el valor de tu evento.',
    'Puedes ajustar el menú, los horarios y los requerimientos especiales antes de pagar.'
  ],

  faq: [
    { pregunta: '¿Cómo se reserva la fecha?', respuesta: 'La fecha y el servicio quedan reservados con el pago del abono correspondiente, o con una orden de compra. El saldo se paga una vez realizado el servicio.' },
    { pregunta: '¿Cuánto es el abono?', respuesta: 'Depende del servicio: el cóctel se reserva con el 50% del valor total y el resto de los servicios con el 60%. La página te muestra el monto exacto al cotizar.' },
    { pregunta: '¿Con cuánta anticipación hay que confirmar?', respuesta: 'Los servicios de matrimonio piden el abono diez días hábiles antes del evento, y el almuerzo y el coffee break, siete días hábiles antes.' },
    { pregunta: '¿Los valores incluyen IVA?', respuesta: 'No. Los valores por persona están expresados sin IVA, y la página lo suma aparte para que veas el total real.' },
    { pregunta: '¿Hay un mínimo de personas?', respuesta: 'Sí, y cambia por servicio: el cóctel gourmet parte en 30 personas, el coffee break en 50 y el resto en 40.' }
  ]
};
