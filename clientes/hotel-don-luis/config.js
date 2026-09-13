/* Configuración de cliente. Sólo se edita este archivo.
   Datos: hoteldonluis.cl (portada, Habitaciones, Políticas, Contacto), leído el 2026-09-12.
   Faltó en el sitio: tarifas (las manda al motor externo TravelClick), horario de
   check in/out, % de abono y capacidad exacta por habitación (sólo "single o doble").
   Regla de honestidad: cada dato sale de una fuente pública del negocio. Lo que
   no está publicado queda vacío y la página muestra "a confirmar". */

window.RESERVA_CONFIG = {
  demo: {
    activo: true,
    aviso: 'Muestra preparada por Gramagrowth con información pública del negocio. No es el sitio oficial.',
    fuente: 'hoteldonluis.cl',
    leidoEl: '2026-09-12'
  },
  unidadLabel: 'Habitación',
  negocio: {
    nombre: 'Hotel Don Luis',
    bajada: 'Hotel de 65 habitaciones en el centro de Puerto Montt, para viajeros de negocios, parejas y familias.',
    comuna: 'Puerto Montt, Región de Los Lagos',
    direccion: 'Quillota 146, Puerto Montt',
    whatsapp: '56995212248',
    telefono: '+56 65 2200 300',
    email: 'reservas@hdl.cl',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Quillota+146+Puerto+Montt'
  },
  marca: {
    tinta: '#22303c',
    acento: '#8a1c2b',
    papel: '#f6f3ee'
  },
  propiedad: {
    titular: 'Un hotel cálido y acogedor en el centro de Puerto Montt',
    descripcion: 'Hotel en Puerto Montt de estilo cálido y acogedor, con dependencias pensadas para el viajero de negocios y también para parejas y familias. Ubicación privilegiada en el centro, a pasos de centros comerciales, la costanera, la Iglesia Catedral y la Plaza de Armas. Wifi gratuito en todo el hotel, sauna, sala de ejercicios y el Bar-Restaurante Doña Elena en el segundo piso.',
    unidades: 65,
    amenidades: [
      'Wifi gratuito en todo el hotel',
      'Sauna',
      'Sala de ejercicios',
      'Bar-Restaurante Doña Elena',
      'Estacionamiento interior (5 cupos) y recinto a 2 cuadras',
      'Salón de reuniones equipado',
      'Espacios para eventos'
    ],
    certificaciones: []
  },
  tipos: [
    {
      id: 'ejecutiva',
      nombre: 'Habitación Ejecutiva · single o doble',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: '15 m² · cama matrimonial o 2 camas twin · escritorio · baño privado · secador de pelo · frigobar'
    },
    {
      id: 'superior',
      nombre: 'Habitación Superior · single o doble',
      capacidad: 2,
      capacidadTarifa: 2,
      detalle: '23 m² · cama matrimonial o 2 camas twin · vista al mar según disponibilidad · escritorio · baño privado · secador de pelo · frigobar'
    }
  ],
  temporadas: [],
  noDisponibles: [],
  reservaDirecta: [
    'Hablas directamente con el hotel, sin intermediarios.',
    'Sin comisión de plataformas sobre el valor de tu estadía.',
    'Puedes consultar por cuna adicional, estacionamiento o llegada tardía antes de pagar.'
  ],
  promociones: [],
  reglas: {
    checkIn: null,
    checkOut: null,
    abonoPorcentaje: 0,
    recargoUnaNoche: 0,
    ivaIncluido: null,
    notas: [
      'El sitio no publica tarifas: las confirma el anfitrión.',
      'El sitio no publica horario de check in ni check out: los confirma el hotel al responder.',
      'Cancelación sin costo: en temporada alta (1 oct–30 nov y 1 ene–31 mar) hasta 5 días antes de la llegada; en temporada baja (1 abr–30 sep y diciembre) hasta 24 horas antes.',
      'Un niño menor de 10 años se aloja sin costo adicional compartiendo cama con los padres, con desayuno buffet incluido. Cuna adicional con costo.',
      'Reservas de 7 o más habitaciones se consideran grupo y se cotizan aparte.',
      'Aviso de la muestra: faltan tarifas, horarios y abono antes de publicar esta página.'
    ]
  },
  faq: [
    { pregunta: '¿Cuánto vale la noche?', respuesta: 'Las tarifas no están publicadas en el sitio. Envía tu consulta con fechas y pasajeros y el hotel confirma el valor.' },
    { pregunta: '¿Hasta cuándo puedo cancelar?', respuesta: 'En temporada alta (octubre, noviembre y de enero a marzo), hasta 5 días antes de la llegada. En temporada baja, hasta 24 horas antes. Fuera de plazo, el no show se cobra como una noche más IVA.' },
    { pregunta: '¿Viajo con niños?', respuesta: 'Un niño menor de 10 años se aloja sin costo adicional compartiendo cama con los padres, con desayuno buffet incluido. Hay cuna adicional con costo.' },
    { pregunta: '¿Tienen estacionamiento?', respuesta: 'Sí: 5 estacionamientos interiores y un recinto a 2 cuadras de uso exclusivo para huéspedes.' },
    { pregunta: '¿Dónde están?', respuesta: 'En Quillota 146, en el centro de Puerto Montt, a pasos de la costanera y la Plaza de Armas. El aeropuerto El Tepual queda a 17,5 km.' }
  ],
  atractivos: [
    'Costanera de Puerto Montt',
    'Plaza de Armas',
    'Iglesia Catedral',
    'Centros comerciales del centro',
    'Aeropuerto El Tepual a 17,5 km'
  ],
  galeria: [
    'https://www.hoteldonluis.cl/wp-content/uploads/2019/10/Slider-1-nuevo-e1579280334600.jpg',
    'https://www.hoteldonluis.cl/wp-content/uploads/2021/10/PM3.jpg',
    'https://www.hoteldonluis.cl/wp-content/uploads/2019/10/recepcion-sq.jpg',
    'https://www.hoteldonluis.cl/wp-content/uploads/2019/08/quienes-somos.jpg'
  ]
};
