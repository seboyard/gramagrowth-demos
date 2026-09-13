/* Configuración de cliente. Sólo se edita este archivo.
   Datos: casaazul.net (portada /es/, /en/rates/, /en/reservation/), leído el
   2026-09-12.
   Regla de honestidad: cada dato sale de una fuente pública del negocio. Lo que
   no está publicado queda vacío y la página muestra "a confirmar".
   Tarifas publicadas en /en/rates/ por rangos de fechas sin año (01 Ene – 29 Feb,
   01–15 Mar, 16 Mar – 31 Oct, 01 Nov – 31 Dic), en pesos chilenos: se usan con
   las fechas de la próxima temporada, por confirmar. Faltó en el sitio: correo,
   WhatsApp, check in/out, % de abono, capacidad exacta del dormitorio compartido
   (dice "máx 4 camas"). */

window.RESERVA_CONFIG = {
  "demo": {
    "activo": true,
    "aviso": "Muestra preparada por Gramagrowth con información pública del negocio. No es el sitio oficial.",
    "fuente": "casaazul.net",
    "leidoEl": "2026-09-12"
  },
  "unidadLabel": "Habitación",
  "negocio": {
    "nombre": "Casa Azul Hostel",
    "bajada": "Hostal de madera nativa a 5 minutos del centro de Puerto Varas. No es un hotel: es un hogar donde puedes relajarte, con jardín, terraza y calefacción central.",
    "comuna": "Puerto Varas, Región de Los Lagos",
    "direccion": "Manzanal 66, esquina Rosario, Puerto Varas",
    "whatsapp": "",
    "telefono": "+56 65 2232904",
    "email": "",
    "mapa": "https://www.google.com/maps/search/?api=1&query=Manzanal+66+Puerto+Varas"
  },
  "marca": {
    "tinta": "#1f2a3d",
    "acento": "#2f6fb3",
    "papel": "#f5f3ee"
  },
  "propiedad": {
    "titular": "Habitaciones privadas y compartidas, con calefacción central y uso de cocina",
    "descripcion": "Casa de madera nativa llena de detalles, con jardín, terraza grande, hamacas, árboles bonsái y peces japoneses. Dormitorios matrimoniales, con camas separadas, individuales y compartidos, con baños privados y compartidos. Casilleros en las habitaciones, uso de cocina y living comedor totalmente equipado. Familia chileno-alemana.",
    "unidades": null,
    "amenidades": [
      "Calefacción central en todos los espacios",
      "Internet y Wi-Fi gratis",
      "Uso de cocina y living comedor",
      "Casilleros en las habitaciones",
      "Servicio de lavandería",
      "Transfer a aeropuerto",
      "Estacionamiento interior (espacio limitado)",
      "Almacenaje de equipaje gratis",
      "Noches de películas e intercambio de libros"
    ],
    "certificaciones": []
  },
  "tipos": [
    {
      "id": "doble-privado",
      "nombre": "Habitación doble · baño privado",
      "capacidad": 2,
      "capacidadTarifa": 2,
      "detalle": "Cama matrimonial · baño privado · calefacción central",
      "temporadas": [
        { "id": "media-nov-dic", "nombre": "1 nov – 31 dic (publicada sin año, por confirmar)", "desde": "2026-11-01", "hasta": "2026-12-31", "tarifa": 54000 },
        { "id": "alta", "nombre": "1 ene – 28 feb (publicada sin año, por confirmar)", "desde": "2027-01-01", "hasta": "2027-02-28", "tarifa": 62000 },
        { "id": "media-mar", "nombre": "1 – 15 mar (publicada sin año, por confirmar)", "desde": "2027-03-01", "hasta": "2027-03-15", "tarifa": 54000 },
        { "id": "baja", "nombre": "16 mar – 31 oct (publicada sin año, por confirmar)", "desde": "2027-03-16", "hasta": "2027-10-31", "tarifa": 50000 }
      ]
    },
    {
      "id": "doble-compartido",
      "nombre": "Habitación doble · baño compartido",
      "capacidad": 2,
      "capacidadTarifa": 2,
      "detalle": "Cama matrimonial · baño compartido · calefacción central",
      "temporadas": [
        { "id": "media-nov-dic", "nombre": "1 nov – 31 dic (publicada sin año, por confirmar)", "desde": "2026-11-01", "hasta": "2026-12-31", "tarifa": 42000 },
        { "id": "alta", "nombre": "1 ene – 28 feb (publicada sin año, por confirmar)", "desde": "2027-01-01", "hasta": "2027-02-28", "tarifa": 50000 },
        { "id": "media-mar", "nombre": "1 – 15 mar (publicada sin año, por confirmar)", "desde": "2027-03-01", "hasta": "2027-03-15", "tarifa": 42000 },
        { "id": "baja", "nombre": "16 mar – 31 oct (publicada sin año, por confirmar)", "desde": "2027-03-16", "hasta": "2027-10-31", "tarifa": 40000 }
      ]
    },
    {
      "id": "twin-compartido",
      "nombre": "Habitación 2 camas · baño compartido",
      "capacidad": 2,
      "capacidadTarifa": 2,
      "detalle": "2 camas separadas · baño compartido · calefacción central",
      "temporadas": [
        { "id": "media-nov-dic", "nombre": "1 nov – 31 dic (publicada sin año, por confirmar)", "desde": "2026-11-01", "hasta": "2026-12-31", "tarifa": 42000 },
        { "id": "alta", "nombre": "1 ene – 28 feb (publicada sin año, por confirmar)", "desde": "2027-01-01", "hasta": "2027-02-28", "tarifa": 50000 },
        { "id": "media-mar", "nombre": "1 – 15 mar (publicada sin año, por confirmar)", "desde": "2027-03-01", "hasta": "2027-03-15", "tarifa": 42000 },
        { "id": "baja", "nombre": "16 mar – 31 oct (publicada sin año, por confirmar)", "desde": "2027-03-16", "hasta": "2027-10-31", "tarifa": 40000 }
      ]
    },
    {
      "id": "triple-compartido",
      "nombre": "Habitación 3 camas · baño compartido",
      "capacidad": 3,
      "capacidadTarifa": 3,
      "detalle": "3 camas · baño compartido · calefacción central",
      "temporadas": [
        { "id": "media-nov-dic", "nombre": "1 nov – 31 dic (publicada sin año, por confirmar)", "desde": "2026-11-01", "hasta": "2026-12-31", "tarifa": 63000 },
        { "id": "alta", "nombre": "1 ene – 28 feb (publicada sin año, por confirmar)", "desde": "2027-01-01", "hasta": "2027-02-28", "tarifa": 75000 },
        { "id": "media-mar", "nombre": "1 – 15 mar (publicada sin año, por confirmar)", "desde": "2027-03-01", "hasta": "2027-03-15", "tarifa": 63000 },
        { "id": "baja", "nombre": "16 mar – 31 oct (publicada sin año, por confirmar)", "desde": "2027-03-16", "hasta": "2027-10-31", "tarifa": 60000 }
      ]
    },
    {
      "id": "single-compartido",
      "nombre": "Habitación single · baño compartido",
      "capacidad": 1,
      "capacidadTarifa": 1,
      "detalle": "1 cama · baño compartido · calefacción central",
      "temporadas": [
        { "id": "media-nov-dic", "nombre": "1 nov – 31 dic (publicada sin año, por confirmar)", "desde": "2026-11-01", "hasta": "2026-12-31", "tarifa": 33000 },
        { "id": "alta", "nombre": "1 ene – 28 feb (publicada sin año, por confirmar)", "desde": "2027-01-01", "hasta": "2027-02-28", "tarifa": 38000 },
        { "id": "media-mar", "nombre": "1 – 15 mar (publicada sin año, por confirmar)", "desde": "2027-03-01", "hasta": "2027-03-15", "tarifa": 33000 },
        { "id": "baja", "nombre": "16 mar – 31 oct (publicada sin año, por confirmar)", "desde": "2027-03-16", "hasta": "2027-10-31", "tarifa": 30000 }
      ]
    },
    {
      "id": "dormitorio",
      "nombre": "Cama en dormitorio compartido (máx. 4 camas)",
      "capacidad": 1,
      "capacidadTarifa": 1,
      "detalle": "Tarifa por persona · baño compartido · casilleros · calefacción central",
      "temporadas": [
        { "id": "media-nov-dic", "nombre": "1 nov – 31 dic, por persona (publicada sin año, por confirmar)", "desde": "2026-11-01", "hasta": "2026-12-31", "tarifa": 21000 },
        { "id": "alta", "nombre": "1 ene – 28 feb, por persona (publicada sin año, por confirmar)", "desde": "2027-01-01", "hasta": "2027-02-28", "tarifa": 25000 },
        { "id": "media-mar", "nombre": "1 – 15 mar, por persona (publicada sin año, por confirmar)", "desde": "2027-03-01", "hasta": "2027-03-15", "tarifa": 21000 },
        { "id": "baja", "nombre": "16 mar – 31 oct, por persona (publicada sin año, por confirmar)", "desde": "2027-03-16", "hasta": "2027-10-31", "tarifa": 20000 }
      ]
    }
  ],
  "temporadas": [],
  "noDisponibles": [],
  "reservaDirecta": [
    "Hablas directamente con el hostal, sin intermediarios.",
    "Sin comisión de plataformas sobre el valor de tu estadía.",
    "Puedes consultar por horarios de llegada, excursiones o transfer antes de pagar."
  ],
  "promociones": [],
  "reglas": {
    "checkIn": null,
    "checkOut": null,
    "abonoPorcentaje": 0,
    "recargoUnaNoche": 0,
    "ivaIncluido": null,
    "notas": [
      "Tarifas publicadas en casaazul.net por rangos de fechas sin año y en pesos chilenos; por confirmar para las fechas nuevas.",
      "El sitio indica que los ciudadanos chilenos pagan 19% de IVA y que los precios pueden variar hasta un 15%.",
      "El sitio pide confirmar la reserva 2 días antes de la llegada.",
      "El sitio no publica horarios de check in y check out ni políticas de abono: los confirma el hostal.",
      "Aviso de la muestra: faltan tarifas vigentes, reglas, correo y WhatsApp antes de publicar esta página."
    ]
  },
  "faq": [
    {
      "pregunta": "¿Dónde están?",
      "respuesta": "En Manzanal 66, esquina Rosario, a 5 minutos del centro de Puerto Varas, a orillas del Lago Llanquihue."
    },
    {
      "pregunta": "¿Puedo cocinar?",
      "respuesta": "Sí. Los huéspedes tienen uso de la cocina y del living comedor, totalmente equipados."
    },
    {
      "pregunta": "¿Arriendan por mes?",
      "respuesta": "Sí. En los meses de invierno, de abril a octubre, arriendan habitaciones por un precio mensual, con calefacción central y uso de cocina y living. El valor lo confirma el hostal."
    },
    {
      "pregunta": "¿Organizan excursiones?",
      "respuesta": "Sí. Casa Azul ofrece pesca en el Lago Llanquihue y Volcán Osorno, y ayuda a coordinar kayak, rafting, Saltos del Petrohué, cabalgatas, bicicletas y el Cruce de Lagos."
    }
  ],
  "atractivos": [
    "Lago Llanquihue",
    "Volcán Osorno",
    "Saltos del Petrohué",
    "Cruce Andino de Lagos",
    "Frutillar",
    "Puerto Montt y Angelmó"
  ],
  "galeria": [
    "http://www.casaazul.net/assets/Fotos-Home/CasaAzulHostel-PuertoVaras.jpg",
    "http://www.casaazul.net/assets/Fotos-Home/Living-PuertoVarasHostel.jpg",
    "http://www.casaazul.net/assets/Fotos-Home/Fishpond-HostelPuertoVaras.jpg",
    "http://www.casaazul.net/assets/Fotos-Home/VolcanOsorno-PuertoVaras.jpg"
  ]
};
