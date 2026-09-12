/* Configuración de cliente. Sólo se edita este archivo.
   Datos: regenbogengg.com (portada, Bungalows, Tarifas, Ubicación, Reservación y
   Consulta), leído el 2026-09-12.
   Tarifas publicadas en /precios por bungalow y número de personas, con
   "Temporadas Alta 15.Dic - 15.Mar" y "Temporada Baja 16.Mar - 14.Dic", sin año.
   El sitio advierte: "Las tarifas pueden variar en fines de semana largos y
   feriados". La tarifa base de cada bungalow es la del mínimo de personas; el
   valor para más pasajeros va en el detalle y en las notas.
   Qué faltó: WhatsApp (sólo teléfono, correo y formularios), promociones,
   fotos con nombre descriptivo (la galería usa fotos del editor del sitio).
   El sitio publica dos horarios de check in distintos: 16:00–22:00 en Tarifas
   y 16:00–21:00 en Reservación; aquí se usa la hora de inicio, 16:00.
   Regla de honestidad: cada dato sale del sitio público. Lo que no está
   publicado queda vacío y la página muestra "a confirmar". */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del sitio. No es el sitio oficial.',
    fuente: 'regenbogengg.com',
    leidoEl: '2026-09-12'
  },

  negocio: {
    nombre: 'Regenbogen Bungalows',
    bajada: 'Cinco bungalows administrados por la familia, en un parque de una hectárea y media a 2,6 km del centro de Panguipulli, camino a Chauquén.',
    comuna: 'Panguipulli, Región de Los Ríos',
    direccion: 'Camino Chauquén km 2,6, Panguipulli',
    whatsapp: '',
    telefono: '+56 9 8761 1785',
    email: 'info@regenbogengg.com',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Regenbogen+Bungalows+Camino+Chauquen+Panguipulli'
  },

  marca: {
    tinta: '#23303a',
    acento: '#c2562b',
    papel: '#f7f4ee'
  },

  propiedad: {
    titular: 'Cinco bungalows con piso radiante y vista al lago, los volcanes y los cerros',
    descripcion: 'Un verdadero hogar por corto tiempo. Bungalows independientes para 2 a 4 personas (40 m²) y 4 a 6 personas (73 m²), cada uno con terraza hacia el este, parrilla bajo techo y estacionamiento privado techado. Calefacción central de piso radiante, cocina totalmente equipada, ropa de cama y toallas. Parque de una hectárea y media con estacionamiento para bote o lancha.',
    unidades: 5,
    amenidades: [
      'Calefacción central de piso radiante',
      'Cocina totalmente equipada con horno, refrigerador y microondas',
      'Terraza con mesa y sillas',
      'Parrilla bajo techo en la terraza',
      'Estacionamiento privado y techado junto al bungalow',
      'TV vía satélite',
      'Toallas, ropa de cama y secador de pelo',
      'Wifi gratuito en la recepción',
      'Estacionamiento para bote o lancha',
      'Consigna de equipaje e información turística',
      'Excursiones y cursos de pesca con mosca'
    ],
    certificaciones: []
  },

  // Tarifas por bungalow tal como las publica /precios. La tarifa base cubre el
  // mínimo de personas (capacidadTarifa); el sitio publica también el valor para
  // más pasajeros, que va en el detalle. Sin año en el rótulo: se aplican al
  // calendario que viene.
  tipos: [
    {
      id: 'bungalow-2-4',
      nombre: 'Bungalow de 2 a 4 personas',
      capacidad: 4,
      capacidadTarifa: 2,
      detalle: '40 m² · dormitorio con cama king · sofá cama de 1,25 m en el living · baño · 3 o 4 personas: $95.000 alta / $90.000 baja',
      temporadas: [
        { id: 'baja-2026', nombre: 'Temporada baja · 16 mar – 14 dic', desde: '2026-09-12', hasta: '2026-12-14', tarifa: 80000 },
        { id: 'alta-2027', nombre: 'Temporada alta · 15 dic – 15 mar', desde: '2026-12-15', hasta: '2027-03-15', tarifa: 85000 },
        { id: 'baja-2027', nombre: 'Temporada baja · 16 mar – 14 dic', desde: '2027-03-16', hasta: '2027-12-14', tarifa: 80000 }
      ]
    },
    {
      id: 'bungalow-4-6',
      nombre: 'Bungalow de 4 a 6 personas',
      capacidad: 6,
      capacidadTarifa: 4,
      detalle: '73 m² · 2 dormitorios amplios con cama king · sofá cama de 1,25 m · 1 baño y medio · 5 o 6 personas: $145.000 alta / $140.000 baja',
      temporadas: [
        { id: 'baja-2026', nombre: 'Temporada baja · 16 mar – 14 dic', desde: '2026-09-12', hasta: '2026-12-14', tarifa: 130000 },
        { id: 'alta-2027', nombre: 'Temporada alta · 15 dic – 15 mar', desde: '2026-12-15', hasta: '2027-03-15', tarifa: 135000 },
        { id: 'baja-2027', nombre: 'Temporada baja · 16 mar – 14 dic', desde: '2027-03-16', hasta: '2027-12-14', tarifa: 130000 }
      ]
    }
  ],

  // Cada bungalow trae sus tarifas; la tabla global queda vacía.
  temporadas: [],

  noDisponibles: [],

  reservaDirecta: [
    'Hablas directamente con la familia que administra los bungalows, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por el traslado desde el terminal, el bote o la pesca con mosca antes de pagar.'
  ],

  promociones: [],

  reglas: {
    checkIn: '16:00',
    checkOut: '11:00',
    abonoPorcentaje: 50,
    recargoUnaNoche: 0,
    ivaIncluido: true,
    notas: [
      'Recibida la confirmación de la reserva se paga el 50% del total de la estadía, por transferencia o depósito, para que la reserva se mantenga vigente.',
      'El saldo se paga al hacer el check in, en efectivo o transferencia.',
      'Check in de 16:00 a 22:00; check out de 08:00 a 11:00.',
      'Las tarifas incluyen IVA.',
      'Las tarifas base cubren 2 personas (bungalow de 2 a 4) y 4 personas (bungalow de 4 a 6); con más pasajeros aplica el valor publicado para 3–4 o 5–6 personas.',
      'Las tarifas pueden variar en fines de semana largos y feriados.',
      'Cancelación gratuita con más de 30 días de anticipación; entre 30 y 20 días se retiene el 30% del total; con menos de 20 días, el 100%.'
    ]
  },

  faq: [
    { pregunta: '¿Cómo se confirma la reserva?', respuesta: 'Con el pago del 50% del total por transferencia o depósito, una vez que la familia confirma la disponibilidad. El saldo se paga al llegar.' },
    { pregunta: '¿A qué hora puedo llegar?', respuesta: 'El check in es entre las 16:00 y las 22:00, y el check out entre las 08:00 y las 11:00.' },
    { pregunta: '¿Cuánto vale con más personas?', respuesta: 'El bungalow de 2 a 4 vale $80.000 (baja) u $85.000 (alta) para 2 personas y $90.000 / $95.000 para 3 o 4. El de 4 a 6 vale $130.000 / $135.000 para 4 personas y $140.000 / $145.000 para 5 o 6.' },
    { pregunta: '¿Tienen calefacción?', respuesta: 'Sí, todos los bungalows tienen calefacción central de piso radiante.' },
    { pregunta: '¿Puedo llevar mi bote o lancha?', respuesta: 'Sí, hay estacionamiento para bote o lancha dentro del recinto, además del estacionamiento techado de cada bungalow.' },
    { pregunta: '¿Cómo llego?', respuesta: 'Desde el centro de Panguipulli, 1 km en dirección Los Lagos y en la bifurcación doblar a la izquierda hacia Chauquén; los bungalows están a la derecha, a 2,6 km. También pueden recogerte en el terminal de buses.' }
  ],

  atractivos: [
    'Playa Chauquén (a 2 km)',
    'Centro de Panguipulli (a 3 km)',
    'Lago Panguipulli y vista a los volcanes',
    'Ruta Termal (a 55 km)',
    'Reserva Huilo Huilo (a 50 km)',
    'Pesca con mosca'
  ],

  galeria: [
    'https://le-cdn.website-editor.net/s/7063b2064a4248efbe2abadb72e65f68/dms3rep/multi/opt/20230329_161251-1920w.jpg',
    'https://le-cdn.website-editor.net/s/7063b2064a4248efbe2abadb72e65f68/dms3rep/multi/opt/20230421_180712-1920w.jpg',
    'https://le-cdn.website-editor.net/s/7063b2064a4248efbe2abadb72e65f68/dms3rep/multi/opt/20230204_132957-1920w.jpg',
    'https://le-cdn.website-editor.net/s/7063b2064a4248efbe2abadb72e65f68/dms3rep/multi/opt/20221115_193957-1920w.jpg'
  ]
};
