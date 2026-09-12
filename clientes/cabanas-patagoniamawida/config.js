/* Configuración de cliente. Sólo se edita este archivo.
   Datos: patagoniamawida.cl (portada, Cabañas, Tarifas, Ubicación y Términos y
   condiciones), leído el 2026-09-12.
   Tarifas publicadas en /tarifas: "Tarifas marzo a diciembre · Valores vigentes
   hasta el 31 de diciembre de 2026" y "Tarifas temporada alta · Vacaciones de
   Invierno, Fiestas Patrias y desde el 1 de enero y 28 de febrero". El sitio no
   publica las fechas exactas de Vacaciones de Invierno ni de Fiestas Patrias,
   así que esos tramos quedan "a confirmar".
   Qué faltó: número total de cabañas, dirección con numeración (sólo "Fundo
   Carranco lote 1"), promociones. La reserva del sitio va a Cloudbeds
   (hotels.cloudbeds.com/reservation/4lvj28). El WhatsApp sale del widget
   "Conversemos!" del sitio (56961552392), no de un enlace directo.
   Regla de honestidad: cada dato sale del sitio público. Lo que no está
   publicado queda vacío y la página muestra "a confirmar". */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'patagoniamawida.cl',
    leidoEl: '2026-09-12'
  },

  negocio: {
    nombre: 'Cabañas Patagoniamawida',
    bajada: 'Descanso en el corazón de la Selva Patagónica: cabañas con tinaja propia a orillas del río Fuy, en medio de la Reserva Huilo Huilo.',
    comuna: 'Neltume, comuna de Panguipulli, Región de Los Ríos',
    direccion: 'Fundo Carranco lote 1, Neltume, Panguipulli',
    whatsapp: '56961552392',
    telefono: '+56 9 6155 2392',
    email: 'reservas@patagoniamawida.cl',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Patagoniamawida+Neltume+Panguipulli'
  },

  marca: {
    tinta: '#1f2a1e',
    acento: '#7a4a1d',
    papel: '#f5f2ea'
  },

  propiedad: {
    titular: 'Cabañas a orillas del río Fuy, con tinaja caliente propia',
    descripcion: 'Parcela boscosa en medio de la Reserva Huilo Huilo, a medio camino entre Neltume y Puerto Fuy. Cabañas aisladas unas de otras, cada una con su propia tinaja de más de 3.000 litros calentada a leña. A 500 metros de los hoteles de la Reserva y frente al Bosque de los Ciervos, el Museo de los Volcanes, el bike park y la telecabina.',
    unidades: null,
    amenidades: [
      'Tinaja caliente propia (uso opcional, $39.000 por vez)',
      'Cocina completa: cocina, refrigerador, microondas, loza y servicios',
      'Ropa de cama y toallas',
      'Secador de pelo',
      'Servicio de mucamas',
      'Estufa a leña de combustión lenta',
      'Parrilla para asados',
      'Estacionamiento',
      'Bajadas al río Fuy',
      'Se aceptan mascotas (no pueden quedar solas en la cabaña)'
    ],
    certificaciones: []
  },

  // Tarifas por unidad, tal como las publica /tarifas.
  // "marzo a diciembre": vigentes hasta el 31 de diciembre de 2026. Fiestas Patrias
  // es temporada alta pero el sitio no dice qué días, así que el tramo 17–21 de
  // septiembre queda sin tarifa ("a confirmar").
  // "temporada alta": 1 de enero al 28 de febrero; se usa para el verano 2027.
  tipos: [
    {
      id: 'cabana-8',
      nombre: 'Cabaña para 8 personas',
      capacidad: 8,
      capacidadTarifa: 8,
      detalle: '3 dormitorios · matrimonial con baño privado · 2 camas de 1½ plaza · 2 camas nido de 1½ plaza (4 camas)',
      temporadas: [
        { id: 'baja-2026a', nombre: 'Marzo a diciembre', desde: '2026-09-12', hasta: '2026-09-16', tarifa: 170000 },
        { id: 'baja-2026b', nombre: 'Marzo a diciembre', desde: '2026-09-22', hasta: '2026-12-31', tarifa: 170000 },
        { id: 'alta-2027', nombre: 'Temporada alta · enero y febrero', desde: '2027-01-01', hasta: '2027-02-28', tarifa: 180000 }
      ]
    },
    {
      id: 'cabana-5',
      nombre: 'Cabaña para 5 personas',
      capacidad: 5,
      capacidadTarifa: 5,
      detalle: '2 dormitorios · matrimonial · 2 camas de 1½ plaza más cama nido (3 camas)',
      temporadas: [
        { id: 'baja-2026a', nombre: 'Marzo a diciembre', desde: '2026-09-12', hasta: '2026-09-16', tarifa: 90000 },
        { id: 'baja-2026b', nombre: 'Marzo a diciembre', desde: '2026-09-22', hasta: '2026-12-31', tarifa: 90000 },
        { id: 'alta-2027', nombre: 'Temporada alta · enero y febrero', desde: '2027-01-01', hasta: '2027-02-28', tarifa: 95000 }
      ]
    },
    {
      id: 'cabana-4',
      nombre: 'Cabaña para 4 personas',
      capacidad: 4,
      capacidadTarifa: 4,
      detalle: '2 dormitorios · matrimonial · 2 camas de 1½ plaza',
      temporadas: [
        { id: 'baja-2026a', nombre: 'Marzo a diciembre', desde: '2026-09-12', hasta: '2026-09-16', tarifa: 80000 },
        { id: 'baja-2026b', nombre: 'Marzo a diciembre', desde: '2026-09-22', hasta: '2026-12-31', tarifa: 80000 },
        { id: 'alta-2027', nombre: 'Temporada alta · enero y febrero', desde: '2027-01-01', hasta: '2027-02-28', tarifa: 85000 }
      ]
    },
    {
      id: 'cabana-2',
      nombre: 'Cabaña para 2 personas',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: '1 dormitorio · cama matrimonial · baño en suite',
      temporadas: [
        { id: 'baja-2026a', nombre: 'Marzo a diciembre', desde: '2026-09-12', hasta: '2026-09-16', tarifa: 50000 },
        { id: 'baja-2026b', nombre: 'Marzo a diciembre', desde: '2026-09-22', hasta: '2026-12-31', tarifa: 50000 },
        { id: 'alta-2027', nombre: 'Temporada alta · enero y febrero', desde: '2027-01-01', hasta: '2027-02-28', tarifa: 65000 }
      ]
    }
  ],

  // Cada cabaña trae sus tarifas; la tabla global queda vacía.
  temporadas: [],

  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con la administración, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes pedir la tinaja, consultar por mascotas o por la leña antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: '15:00',
    checkOut: '11:00',
    abonoPorcentaje: 30,
    recargoUnaNoche: 0,
    ivaIncluido: true,
    notas: [
      'Para reservar se transfiere el 30% de la tarifa total; el saldo se paga al hacer el check in.',
      'En estadías de una sola noche se prepaga el 100% del total (incluida la tinaja, si aplica).',
      'Los precios publicados en la web incluyen IVA.',
      'En enero, febrero y Fiestas Patrias el mínimo de estadía es de 2 noches.',
      'Vacaciones de Invierno y Fiestas Patrias tienen tarifa de temporada alta; el sitio no publica esas fechas exactas, así que ese tramo lo confirma la administración.',
      'Las tarifas "marzo a diciembre" están publicadas como vigentes hasta el 31 de diciembre de 2026; las de enero y febrero 2027 se muestran según la tabla de temporada alta del sitio, por confirmar.',
      'Reembolso del 100% del abono por cancelaciones hasta 72 horas antes del check in; el mismo plazo aplica para cambios de fecha.',
      'La tinaja no está incluida en la tarifa: vale $39.000 por vez de uso y se pide con 24 horas de anticipación.',
      'Salidas hasta las 14:00 tienen un cargo del 50% de la tarifa; después de las 14:00, del 100%. Late check out sujeto a disponibilidad.',
      'No incluye desayuno. No hay TV ni wifi; las señales de Entel y Movistar permiten usar internet.'
    ]
  },

  faq: [
    { pregunta: '¿Cómo se confirma la reserva?', respuesta: 'Transfiriendo el 30% de la tarifa total. El saldo se paga al llegar. Si es una sola noche, se prepaga el total.' },
    { pregunta: '¿A qué hora puedo llegar?', respuesta: 'El check in es desde las 15:00 y el check out hasta las 11:00. Las salidas más tarde tienen cargo y dependen de disponibilidad.' },
    { pregunta: '¿La tinaja está incluida?', respuesta: 'No. Cada cabaña tiene su propia tinaja, de uso exclusivo, que vale $39.000 por vez y se pide unas 24 horas antes.' },
    { pregunta: '¿Aceptan mascotas?', respuesta: 'Sí, con la condición estricta de que no se queden solas en la cabaña.' },
    { pregunta: '¿Hay wifi o TV?', respuesta: 'No. Las señales de Entel y Movistar son aptas para usar internet desde el celular.' },
    { pregunta: '¿Incluye desayuno?', respuesta: 'No. Las cabañas tienen cocina completa con refrigerador, microondas, loza y servicios.' },
    { pregunta: '¿Puedo cancelar?', respuesta: 'Hasta 72 horas antes del check in se reembolsa el 100% del abono o se cambia la fecha. Dentro de ese plazo sólo hay cambio de fecha, sujeto a disponibilidad.' }
  ],

  atractivos: [
    'Reserva Biológica Huilo Huilo',
    'Bosque de los Ciervos',
    'Museo de los Volcanes',
    'Telecabina y bike park',
    'Salto del Suspiro y Salto de La Leona',
    'Senderos de pescadores por la orilla del río Fuy',
    'Neltume, Puerto Fuy y Choshuenco'
  ],

  galeria: [
    'https://patagoniamawida.cl/wp-content/uploads/2021/06/terracab1.jpg',
    'https://patagoniamawida.cl/wp-content/uploads/2020/08/cbedsdormcab7.jpg',
    'https://patagoniamawida.cl/wp-content/uploads/2021/07/cbedstinaja2.jpg',
    'https://patagoniamawida.cl/wp-content/uploads/2020/08/bajadariocab1.jpg'
  ]
};
