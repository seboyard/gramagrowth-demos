/* Presentación de oferta, generada por prospecto desde datos/prospectos.json.
   Se abre como enlace y se imprime a PDF con Ctrl+P (o el botón).

   Se genera en vez de escribirse a mano para que los hallazgos vengan de la
   auditoría verificada. Si uno deja de ser cierto, la presentación lo hereda
   del mismo lugar que el correo y la cola.

   El precio que se imprime es el que se escribe en la barra ("precio hoy"),
   con el de lista tachado al lado: así el papel dice lo mismo que la boca. */

const deck = document.querySelector('#deck');
const template = document.querySelector('#deck-template');
const picker = document.querySelector('#prospect-picker');
const inputs = {
  priceToday: document.querySelector('#price-today'),
  validUntil: document.querySelector('#valid-until'),
  bookings: document.querySelector('#bookings'),
  rate: document.querySelector('#rate'),
  publicBase: document.querySelector('#public-base')
};

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const money = (value) => clp.format(Math.round(value));
const formatDate = (value) => (value ? value.split('-').reverse().join('-') : '');
const longDate = (value) => new Date(`${value}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });

const OFERTAS = {
  landing: {
    nombre: 'Página de reserva directa',
    precio: 320000,
    plazo: '5 días hábiles',
    lead: 'Una página donde el pasajero elige fechas y cuántos son, ve el valor y le envía la consulta completa por WhatsApp. Usted confirma a mano, igual que hoy. Sin comisión, hecha para el celular.',
    coverLead: 'Que el pasajero que ya lo encontró pueda cotizar y pedir reserva desde el celular, sin intermediarios y sin tener que preguntar.',
    features: [
      ['Cotiza con sus reglas', 'Tarifas, temporadas y recargos. La cuenta la hace la página.'],
      ['Sin comisión', 'La consulta llega directo a su WhatsApp. Nadie cobra en el medio.'],
      ['Hecha para el celular', 'Que es desde donde cotiza casi todo el mundo.'],
      ['Usted sigue mandando', 'No confirma sola ni cobra: sólo ordena la consulta.']
    ],
    incluye: [
      'Página con sus habitaciones, tarifas, reglas y preguntas frecuentes',
      'Cotizador según sus temporadas y promociones',
      'Botón de WhatsApp con la consulta ya escrita',
      'Fotos, mapa y datos de contacto',
      'Publicación, una ronda de ajustes y guía para actualizar tarifas'
    ],
    noIncluye: [
      'Disponibilidad en tiempo real ni sincronización con Booking o Airbnb',
      'Pagos en línea ni confirmación automática',
      'Dominio, fotografía profesional ni redes sociales'
    ]
  },
  presence: {
    nombre: 'Presencia lista para consultas',
    precio: 480000,
    plazo: '7 días hábiles',
    lead: 'Una presencia coherente entre su página, Instagram y WhatsApp, para que sea más fácil entender el negocio y contactarlo.',
    coverLead: 'Que Instagram, la página y WhatsApp digan lo mismo y lleven a un solo lugar: la consulta.',
    features: [
      ['Página clara', 'Servicios, ubicación, horarios y preguntas frecuentes.'],
      ['Un solo camino', 'Instagram, web y WhatsApp coherentes.'],
      ['Piezas visuales base', 'Seis piezas reutilizables.'],
      ['Contacto directo', 'WhatsApp y formulario.']
    ],
    incluye: ['Todo lo de la página de consultas', 'Bio y llamados a la acción', 'Estructura de destacados', 'Seis piezas visuales base'],
    noIncluye: ['Administración mensual de redes', 'Producción audiovisual presencial', 'Campañas pagadas']
  }
};

const isLodging = (prospect) => /turismo|alojamiento|hospedaje|caba|hotel|hostal/i.test(prospect.segment || '');
const isHostal = (prospect) => /hostal|hostel|hospedaje/i.test(prospect.business || '');

const api = (path) => fetch(`/api${path}`).then((response) => {
  if (!response.ok) throw new Error(`Error ${response.status}`);
  return response.json();
});
const setText = (root, field, value) => {
  root.querySelectorAll(`[data-field="${field}"]`).forEach((node) => { node.textContent = value; });
};
function fillList(root, name, items, render) {
  const host = root.querySelector(`[data-list="${name}"]`);
  if (host) host.replaceChildren(...items.map(render));
}

// Tres escenarios de volumen alrededor del que indique Sebastián. Los valores
// por defecto cambian según el tipo de alojamiento: un hostal no cobra lo que
// cobra una cabaña, y un número irreal se nota.
function mathRows(bookings, rate) {
  const base = Math.max(5, Math.round(bookings));
  return [Math.round(base * 0.6), base, Math.round(base * 1.5)].map((count) => {
    const billed = count * rate * 2;
    return { count, billed, low: billed * 0.15, high: billed * 0.17, isBase: count === base };
  });
}

// Mensaje "después": el mismo que arma la demo, con datos plausibles del rubro.
function afterMessage(prospect) {
  const unit = isHostal(prospect) ? 'Habitación doble' : 'Cabaña para 4 personas';
  const label = isHostal(prospect) ? 'Habitación' : 'Cabaña';
  return [
    `Hola ${prospect.business}, quiero consultar disponibilidad:`,
    '',
    'Llegada: viernes, 16 de enero de 2027',
    'Salida: domingo, 18 de enero de 2027',
    'Noches: 2',
    'Pasajeros: 2',
    `${label}: ${unit}`,
    '',
    'Valor estimado según sus tarifas: [calculado con sus precios]',
    '',
    '¿Tienen disponibilidad para esas fechas?'
  ].join('\n');
}

function render(prospect, config) {
  const params = new URLSearchParams(location.search);
  const offer = OFERTAS[prospect.offer] || OFERTAS.landing;
  const fragment = template.content.cloneNode(true);
  const priceToday = Number(inputs.priceToday.value) || offer.precio;
  const hasDiscount = priceToday < offer.precio;
  const validUntil = inputs.validUntil.value;
  const bookings = Number(inputs.bookings.value) || (isHostal(prospect) ? 60 : 40);
  const rate = Number(inputs.rate.value) || (isHostal(prospect) ? 40000 : 90000);

  setText(fragment, 'fecha', new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }));
  setText(fragment, 'business', prospect.business);
  ['businessSmall', 'businessSmall2', 'businessSmall3', 'businessSmall4'].forEach((field) => setText(fragment, field, prospect.business));
  setText(fragment, 'segment', prospect.segment);
  setText(fragment, 'verifiedAt', formatDate(prospect.verifiedAt));
  setText(fragment, 'website', (prospect.website || 'Sin sitio propio').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''));
  setText(fragment, 'coverLead', offer.coverLead);
  setText(fragment, 'demoLead', offer.lead);
  setText(fragment, 'timeline', offer.plazo);

  // Precio: hoy en grande, lista tachada si hay descuento.
  ['priceToday', 'priceToday2'].forEach((field) => setText(fragment, field, money(priceToday)));
  ['priceList', 'priceList2'].forEach((field) => setText(fragment, field, hasDiscount ? `Lista: ${money(offer.precio)}` : ''));
  setText(fragment, 'validUntil', validUntil ? longDate(validUntil) : 'A convenir');

  // Hallazgos verificados
  const findings = prospect.findings?.length
    ? prospect.findings
    : (prospect.audit?.signals || []).filter((signal) => signal.severity === 'alta').map((signal) => signal.label);
  fillList(fragment, 'findings', findings.slice(0, 5), (finding) => Object.assign(document.createElement('li'), { textContent: finding }));
  setText(fragment, 'sourceNote', prospect.audit?.auditedAt
    ? `Revisado el ${formatDate(prospect.audit.auditedAt)}. Los sitios cambian: si algo ya lo corrigieron, dígamelo y lo saco.`
    : 'Revisado sobre fuentes públicas.');

  // Antes / después
  setText(fragment, 'msgBefore', isHostal(prospect) ? 'hola tienen habitacion?' : 'Hola, tienen disponibilidad?');
  setText(fragment, 'msgAfter', afterMessage(prospect));

  // Comisión (sólo alojamiento)
  if (isLodging(prospect)) {
    fillList(fragment, 'math', mathRows(bookings, rate), (row) => {
      const tr = document.createElement('tr');
      if (row.isBase) tr.className = 'base';
      [row.isBase ? 'Su estimación' : 'Escenario', String(row.count), money(row.billed), money(row.low), money(row.high)]
        .forEach((cell, index) => {
          const td = document.createElement('td');
          td.textContent = cell;
          if (index >= 3) td.className = 'commission';
          tr.append(td);
        });
      return tr;
    });
    setText(fragment, 'mathNote',
      `Calculado con ${bookings} reservas al año, de 2 noches, a ${money(rate)} la noche. Son supuestos para dimensionar: la cifra real la pone usted.`);
  } else {
    fragment.querySelector('[data-block="comision"]')?.remove();
  }

  fillList(fragment, 'features', offer.features, ([title, body]) => {
    const card = document.createElement('div');
    card.className = 'feature';
    card.append(
      Object.assign(document.createElement('strong'), { textContent: title }),
      Object.assign(document.createElement('p'), { textContent: body })
    );
    return card;
  });
  fillList(fragment, 'incluye', offer.incluye, (item) => Object.assign(document.createElement('li'), { textContent: item }));
  fillList(fragment, 'noIncluye', offer.noIncluye, (item) => Object.assign(document.createElement('li'), { textContent: item }));

  // Captura de la demo en el celular de la portada
  const demoPath = (prospect.notes || '').match(/clientes\/([a-z0-9-]+)/i)?.[1];
  const phone = fragment.querySelector('[data-block="phone"]');
  if (demoPath) {
    const image = fragment.querySelector('[data-img="capture"]');
    image.src = `capturas/${demoPath}.png`;
    image.addEventListener('error', () => phone.remove());
  } else {
    phone.remove();
  }

  // Enlace público a la demo. Sin URL pública, la caja no se imprime.
  const base = (inputs.publicBase.value || '').trim().replace(/\/$/, '');
  const demoBox = fragment.querySelector('[data-block="demo"]');
  const warning = document.querySelector('#local-warning');
  // En GitHub Pages las demos están en la raíz (rama gh-pages), no bajo
  // /clientes/ como en el repositorio. Este error llegó a los PDF de ayer.
  if (demoPath && base) {
    const link = fragment.querySelector('[data-link="demo"]');
    link.href = `${base}/${demoPath}/`;
    link.textContent = `${base.replace(/^https?:\/\//, '')}/${demoPath}/`;
    warning.hidden = true;
  } else {
    demoBox.remove();
    warning.hidden = !demoPath;
    if (demoPath) warning.textContent = 'Esta muestra sólo existe en tu computador. Pega arriba la URL pública para que el enlace aparezca en el PDF.';
  }

  // Extras con el precio de hoy, y paquete por varios locales si viene en el enlace.
  const extraFotos = Number(params.get('fotos')) || 200000;
  const extraRescate = Number(params.get('rescate')) || 120000;
  setText(fragment, 'upsellFotos', `Opcional — fotos y video del lugar, ${money(extraFotos)}.`);
  setText(fragment, 'upsellRescate', `Opcional — rescate de temporada, ${money(extraRescate)}.`);

  const bundlePages = Number(params.get('paquete'));
  const bundleFull = Number(params.get('paqueteFull'));
  const bundleBox = fragment.querySelector('[data-block="bundle"]');
  if (bundlePages) {
    bundleBox.hidden = false;
    setText(fragment, 'bundlePages', money(bundlePages));
    setText(fragment, 'bundlePagesList', `en vez de ${money(priceToday * 3)}`);
    if (bundleFull) {
      setText(fragment, 'bundleFull', money(bundleFull));
      setText(fragment, 'bundleFullList', `en vez de ${money((priceToday + extraFotos) * 3)}`);
    } else {
      bundleBox.querySelector('.bundle-row > div:last-child')?.remove();
    }
  }

  // Firma con contacto real
  const contacto = config.contacto || {};
  const partes = [contacto.whatsapp && `WhatsApp ${contacto.whatsapp}`, contacto.telefono && !contacto.whatsapp && `Tel. ${contacto.telefono}`, contacto.email].filter(Boolean);
  setText(fragment, 'firmaNombre', `${contacto.nombre || 'Sebastián'} · Gramagrowth`);
  setText(fragment, 'firmaContacto', partes.length ? partes.join(' · ') : 'instagram.com/gramagrowth');

  deck.replaceChildren(fragment);
  document.title = `Propuesta · ${prospect.business}`;
}

async function boot() {
  let prospects = [];
  let config = {};
  try {
    config = await api('/config').catch(() => ({}));
    prospects = await api('/prospectos');
  } catch (error) {
    deck.replaceChildren(Object.assign(document.createElement('p'), {
      className: 'load-error', textContent: `No se pudo cargar la cola: ${error.message}. ¿Está corriendo "npm run serve"?`
    }));
    return;
  }

  prospects.filter((prospect) => prospect.status !== 'discarded')
    .forEach((prospect) => picker.append(new Option(prospect.business, prospect.id)));

  const params = new URLSearchParams(location.search);
  const selected = prospects.find((prospect) => prospect.id === params.get('id')) || prospects[0];
  if (!selected) return;
  picker.value = selected.id;

  // Parámetros del enlace → barra. Permiten imprimir en lote sin tocar nada.
  inputs.publicBase.value = params.get('base') || config.publicBase || localStorage.getItem('gramagrowth.public-base') || '';
  if (params.get('precio')) inputs.priceToday.value = params.get('precio');
  if (params.get('vence')) inputs.validUntil.value = params.get('vence');
  if (params.get('reservas')) inputs.bookings.value = params.get('reservas');
  if (params.get('noche')) inputs.rate.value = params.get('noche');

  const rerender = () => {
    const prospect = prospects.find((candidate) => candidate.id === picker.value);
    if (!prospect) return;
    render(prospect, config);
    const url = new URL(location.href);
    url.searchParams.set('id', prospect.id);
    history.replaceState({}, '', url);
  };
  picker.addEventListener('change', rerender);
  Object.values(inputs).forEach((input) => input.addEventListener('change', rerender));
  inputs.publicBase.addEventListener('change', () => localStorage.setItem('gramagrowth.public-base', inputs.publicBase.value.trim()));
  document.querySelector('#print-btn').addEventListener('click', () => window.print());
  render(selected, config);
}

boot();
