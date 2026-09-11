/* Presentación de oferta, generada por prospecto desde datos/prospectos.json.
   Se abre como enlace y se imprime a PDF con Ctrl+P (o el botón).

   Por qué se genera y no se escribe a mano: los hallazgos tienen que venir de
   la auditoría verificada, no de la memoria. Si un hallazgo dejó de ser cierto,
   la presentación lo hereda del mismo lugar que el correo y la cola. */

const deck = document.querySelector('#deck');
const template = document.querySelector('#deck-template');
const picker = document.querySelector('#prospect-picker');
const bookingsInput = document.querySelector('#bookings');
const rateInput = document.querySelector('#rate');

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const money = (value) => clp.format(Math.round(value));
const formatDate = (value) => (value ? value.split('-').reverse().join('-') : '');

const OFERTAS = {
  landing: {
    nombre: 'Página de reserva directa',
    precio: 320000,
    plazo: '5 días hábiles',
    lead: 'Una página donde el huésped elige fechas y pasajeros, ve el valor y le envía la consulta completa por WhatsApp. Usted confirma a mano, igual que hoy.',
    features: [
      ['Cotizador con sus reglas', 'Tarifas por temporada, promociones, recargos y mínimos. La cuenta la hace la página, no usted.'],
      ['Consulta completa', 'Le llega fecha, noches, pasajeros y cabaña. Se acaban los cuatro mensajes para averiguar lo mismo.'],
      ['Sin comisión', 'La reserva llega directo a su WhatsApp. No hay intermediario que cobre.'],
      ['Hecha para el celular', 'Que es desde donde cotiza casi todo el mundo.']
    ],
    incluye: [
      'Página con sus cabañas, tarifas, reglas y preguntas frecuentes',
      'Cotizador según sus temporadas y promociones',
      'Botón de WhatsApp con la consulta ya escrita',
      'Mapa y datos de contacto',
      'Publicación y una ronda de ajustes',
      'Guía corta para actualizar tarifas'
    ],
    noIncluye: [
      'Disponibilidad en tiempo real o sincronización con Booking y Airbnb',
      'Pagos en línea',
      'Confirmación automática de reservas',
      'Dominio y fotografía profesional',
      'Administración de redes sociales'
    ]
  },
  presence: {
    nombre: 'Presencia lista para consultas',
    precio: 480000,
    plazo: '7 días hábiles',
    lead: 'Una presencia coherente entre su página, Instagram y WhatsApp, para que sea más fácil entender el negocio y contactarlo.',
    features: [
      ['Página clara', 'Servicios, ubicación, horarios y preguntas frecuentes.'],
      ['Un solo camino', 'Que Instagram, la web y WhatsApp digan lo mismo.'],
      ['Piezas visuales base', 'Seis piezas reutilizables para publicar.'],
      ['Contacto directo', 'Botón de WhatsApp y formulario.']
    ],
    incluye: ['Todo lo de la página de consultas', 'Bio y llamados a la acción', 'Estructura de destacados', 'Seis piezas visuales base'],
    noIncluye: ['Administración mensual de redes', 'Producción audiovisual presencial', 'Campañas pagadas', 'Promesas de crecimiento']
  }
};

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

// Escenarios de comisión: tres volúmenes alrededor del que indique Sebastián,
// para que el dueño se reconozca en alguna fila sin que nadie invente su cifra.
function mathRows(bookings, rate) {
  const base = Math.max(5, Math.round(bookings));
  return [Math.round(base * 0.6), base, Math.round(base * 1.5)].map((count) => {
    const billed = count * rate * 2; // dos noches promedio por reserva
    return { count, billed, low: billed * 0.15, high: billed * 0.17 };
  });
}

function render(prospect) {
  const offer = OFERTAS[prospect.offer] || OFERTAS.landing;
  const fragment = template.content.cloneNode(true);
  const bookings = Number(bookingsInput.value) || 40;
  const rate = Number(rateInput.value) || 90000;

  setText(fragment, 'fecha', new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }));
  setText(fragment, 'business', prospect.business);
  ['businessSmall', 'businessSmall2', 'businessSmall3', 'businessSmall4', 'businessSmall5']
    .forEach((field) => setText(fragment, field, prospect.business));
  setText(fragment, 'segment', prospect.segment);
  setText(fragment, 'verifiedAt', formatDate(prospect.verifiedAt));
  setText(fragment, 'website', (prospect.website || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''));
  setText(fragment, 'opportunity', prospect.opportunity || offer.lead);
  setText(fragment, 'demoLead', offer.lead);
  setText(fragment, 'timeline', offer.plazo);
  setText(fragment, 'price', money(offer.precio));
  setText(fragment, 'contacto', prospect.contact?.type === 'email'
    ? 'Responda este correo y coordinamos.'
    : 'Escríbame por WhatsApp o responda por donde le llegó esto.');

  // Hallazgos: los verificados de la auditoría, no los de memoria.
  const findings = prospect.findings?.length
    ? prospect.findings
    : (prospect.audit?.signals || []).filter((signal) => signal.severity === 'alta').map((signal) => signal.label);
  fillList(fragment, 'findings', findings.slice(0, 5), (finding) => {
    const item = document.createElement('li');
    item.textContent = finding;
    return item;
  });
  setText(fragment, 'sourceNote', prospect.audit?.auditedAt
    ? `Revisado el ${formatDate(prospect.audit.auditedAt)} sobre ${(prospect.website || '').replace(/^https?:\/\/(www\.)?/, '')}. Los sitios cambian: si algo ya lo corrigieron, dígamelo y lo saco.`
    : 'Revisado sobre su sitio público.');

  // Aritmética de comisión
  fillList(fragment, 'math', mathRows(bookings, rate), (row) => {
    const tr = document.createElement('tr');
    [`${row.count} reservas`, `${row.count}`, money(row.billed), money(row.low), money(row.high)]
      .slice(1)
      .forEach((cell, index) => {
        const td = document.createElement('td');
        td.textContent = cell;
        if (index >= 2) td.className = 'commission';
        tr.append(td);
      });
    const label = document.createElement('td');
    label.textContent = row.count === Math.round(bookings) ? 'Su estimación' : 'Escenario';
    tr.prepend(label);
    return tr;
  });
  setText(fragment, 'mathNote',
    `Calculado con ${bookings} reservas de 2 noches promedio a ${money(rate)} por noche. Cambie los números si no calzan con su realidad: la cuenta es suya, no nuestra.`);

  // Qué le dejamos funcionando
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

  // Enlace a la muestra, si existe
  // El enlace de la muestra tiene que servir en el computador del prospecto.
  // Si sigue apuntando a localhost, el PDF llevaría un enlace muerto: se avisa
  // y no se imprime la caja.
  const demoPath = (prospect.notes || '').match(/clientes\/([a-z0-9-]+)/i)?.[1];
  const demoBox = fragment.querySelector('[data-block="demo"]');
  const base = (document.querySelector('#public-base').value || '').trim().replace(/\/$/, '');
  const warning = document.querySelector('#local-warning');
  if (demoPath && base) {
    const link = fragment.querySelector('[data-link="demo"]');
    link.href = `${base}/clientes/${demoPath}/`;
    link.textContent = `Ver la muestra de ${prospect.business}`;
    warning.hidden = true;
  } else {
    demoBox.remove();
    if (demoPath) {
      warning.hidden = false;
      warning.textContent = 'Esta muestra sólo existe en tu computador. Pega arriba la URL pública donde publicaste las demos para que el enlace aparezca en el PDF; si no, la presentación sale sin él.';
    } else {
      warning.hidden = true;
    }
  }

  // La página de comisión sólo aplica a alojamiento.
  if (!/turismo|alojamiento|hospedaje|caba|hotel/i.test(prospect.segment || '')) {
    fragment.querySelector('[data-block="comision"]')?.remove();
  }

  deck.replaceChildren(fragment);
  document.title = `Propuesta · ${prospect.business}`;
}

async function boot() {
  let prospects = [];
  try {
    prospects = await api('/prospectos');
  } catch (error) {
    deck.replaceChildren(Object.assign(document.createElement('p'), {
      className: 'load-error',
      textContent: `No se pudo cargar la cola: ${error.message}. ¿Está corriendo "npm run serve"?`
    }));
    return;
  }

  prospects
    .filter((prospect) => prospect.status !== 'discarded')
    .forEach((prospect) => picker.append(new Option(prospect.business, prospect.id)));

  const requested = new URLSearchParams(location.search).get('id');
  const selected = prospects.find((prospect) => prospect.id === requested) || prospects[0];
  if (!selected) return;
  picker.value = selected.id;

  const rerender = () => {
    const prospect = prospects.find((candidate) => candidate.id === picker.value);
    if (prospect) {
      render(prospect);
      const url = new URL(location.href);
      url.searchParams.set('id', prospect.id);
      history.replaceState({}, '', url);
    }
  };
  picker.addEventListener('change', rerender);
  bookingsInput.addEventListener('change', rerender);
  rateInput.addEventListener('change', rerender);
  const publicBase = document.querySelector('#public-base');
  // ?base= permite fijar la URL pública desde el enlace, para imprimir en
  // lote sin depender de lo guardado en el navegador.
  const params = new URLSearchParams(location.search);
  publicBase.value = params.get('base') || localStorage.getItem('gramagrowth.public-base') || '';
  publicBase.addEventListener('change', () => {
    localStorage.setItem('gramagrowth.public-base', publicBase.value.trim());
    rerender();
  });
  render(selected);
  document.querySelector('#print-btn').addEventListener('click', () => window.print());
}

boot();
