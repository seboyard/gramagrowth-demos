const form = document.querySelector('#audit-form');
const emptyOutput = document.querySelector('#empty-output');
const generatedOutput = document.querySelector('#generated-output');
const diagnosisOutput = document.querySelector('#diagnosis-output');
const messageOutput = document.querySelector('#message-output');
const proposalOutput = document.querySelector('#proposal-output');
const proposalTemplate = document.querySelector('#proposal-template');
const storageKey = 'gramagrowth.sales-kit.v1';

const offers = {
  landing: {
    name: 'Landing de consultas',
    price: 320000,
    timeline: '5 días hábiles',
    outcome: 'Una página clara para que las personas entiendan la oferta y consulten por WhatsApp con menos fricción.',
    deliverables: [
      'Copy y estructura de una landing responsive.',
      'Servicios, preguntas frecuentes, ubicación y horarios.',
      'Botón de WhatsApp y formulario de contacto.',
      'Publicación, medición básica e instrucciones de uso.'
    ]
  },
  presence: {
    name: 'Presencia lista para consultas',
    price: 480000,
    timeline: '7 días hábiles',
    outcome: 'Una presencia coherente entre Instagram, landing y WhatsApp para que sea más fácil entender y contactar al negocio.',
    deliverables: [
      'Landing responsive con copy comercial.',
      'Bio, llamados a la acción y estructura de destacados.',
      'Seis piezas visuales base reutilizables.',
      'WhatsApp, formulario y medición básica.'
    ]
  },
  flow: {
    name: 'Reserva o seguimiento simple',
    price: 650000,
    timeline: '8 días hábiles',
    outcome: 'Un flujo acotado para recibir solicitudes, notificarlas y registrarlas sin copiar datos manualmente.',
    deliverables: [
      'Formulario adaptado al proceso acordado.',
      'Notificación por correo o preparación de mensaje a WhatsApp.',
      'Registro en Google Sheets o fuente equivalente.',
      'Manejo de errores, prueba controlada y guía de operación.'
    ]
  }
};

// Extras opcionales. Se cotizan y se muestran aparte del producto principal:
// la regla de OFFERS.md es un alcance = un canal principal de conversión, así que
// un extra nunca se disuelve dentro del precio base.
const extras = {
  redes: {
    name: 'Gestión de redes sociales',
    price: 180000,
    unit: 'mensual',
    trigger: 'El prospecto tiene perfiles enlazados pero sin publicaciones recientes.',
    scope: '12 publicaciones al mes con calendario, redacción y piezas base, a partir de fotos y datos que entrega el negocio. Publica el negocio.',
    limits: 'No incluye producción audiovisual presencial, pauta pagada, respuesta de mensajes ni promesas de crecimiento.'
  },
  fotos: {
    name: 'Sesión de fotos del lugar',
    price: 150000,
    unit: 'una vez',
    trigger: 'El sitio usa fotos de banco o imágenes de baja calidad.',
    scope: 'Una sesión presencial en Valdivia y 20 fotos editadas, listas para la página y las redes.',
    limits: 'No incluye modelos, dron, video ni desplazamiento fuera de Valdivia.'
  },
  tarifas: {
    name: 'Actualización de tarifas por temporada',
    price: 25000,
    unit: 'mensual',
    trigger: 'El sitio publica precios de una temporada vencida.',
    scope: 'Hosting de la página y actualización de tarifas, promociones y fechas cada vez que cambian, dentro de un día hábil.',
    limits: 'No incluye rediseño, contenido nuevo ni funcionalidades adicionales.'
  }
};

function formatPrice(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function getData() {
  return Object.fromEntries(new FormData(form).entries());
}

function selectedExtras() {
  return [...form.querySelectorAll('[data-extra]:checked')].map((input) => ({
    key: input.dataset.extra, ...extras[input.dataset.extra]
  }));
}

function setField(root, name, value) {
  const node = root.querySelector(`[data-field="${name}"]`);
  if (node) node.textContent = value;
}

function fillList(root, name, items) {
  const list = root.querySelector(`[data-field="${name}"]`);
  list.replaceChildren(...items.map((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    return li;
  }));
}

function render(data) {
  const offer = offers[data.offer];
  const findings = [data.finding1, data.finding2, data.finding3].filter(Boolean);

  diagnosisOutput.replaceChildren();
  const diagnosisIntro = document.createElement('p');
  diagnosisIntro.textContent = `${data.business} presenta una oportunidad concreta para mejorar cómo una persona entiende y contacta al negocio:`;
  const list = document.createElement('ul');
  findings.forEach((finding) => {
    const li = document.createElement('li');
    li.textContent = finding;
    list.append(li);
  });
  const recommendation = document.createElement('p');
  const recommendationLabel = document.createElement('strong');
  recommendationLabel.textContent = 'Recomendación: ';
  recommendation.append(recommendationLabel, `${offer.name}, con foco en ${data.outcome.toLowerCase()}`);
  diagnosisOutput.append(diagnosisIntro, list, recommendation);

  messageOutput.textContent = `Hola, soy Sebastián de Gramagrowth. Revisé la presencia pública de ${data.business} y vi una oportunidad concreta: ${data.finding1} Preparé tres mejoras breves y una idea visual para facilitar las consultas. ¿Te las puedo mostrar en 10 minutos?`;

  const proposal = proposalTemplate.content.cloneNode(true);
  setField(proposal, 'business', data.business);
  setField(proposal, 'offerName', offer.name);
  setField(proposal, 'outcome', data.outcome);
  setField(proposal, 'timeline', data.timeline);
  setField(proposal, 'price', formatPrice(data.price));
  setField(proposal, 'sourceLine', data.source ? `Fuente pública revisada: ${data.source}` : 'Fuente pública revisada y registrada por Gramagrowth.');
  fillList(proposal, 'findings', findings);
  fillList(proposal, 'deliverables', offer.deliverables);

  const chosen = selectedExtras();
  const extrasBlock = proposal.querySelector('[data-block="extras"]');
  if (chosen.length) {
    extrasBlock.hidden = false;
    fillList(proposal, 'extras', chosen.map((extra) =>
      `${extra.name} — ${formatPrice(extra.price)} ${extra.unit}. ${extra.scope} No incluye: ${extra.limits.replace(/^No incluye /, '')}`));
  }
  proposalOutput.replaceChildren(proposal);

  emptyOutput.hidden = true;
  generatedOutput.hidden = false;
}

function persist() {
  const data = getData();
  delete data.evidenceConfirmed;
  data.extrasSeleccionados = selectedExtras().map((extra) => extra.key);
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function restore() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    Object.entries(data).forEach(([name, value]) => {
      if (name === 'extrasSeleccionados') return;
      if (form.elements[name] && name !== 'evidenceConfirmed') form.elements[name].value = value;
    });
    (data.extrasSeleccionados || []).forEach((key) => {
      const input = form.querySelector(`[data-extra="${key}"]`);
      if (input) input.checked = true;
    });
    updateExtrasTotal();
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function importProspectFromQuery() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('business')) return;
  const allowed = ['business', 'segment', 'location', 'source', 'finding1', 'finding2', 'finding3'];
  allowed.forEach((name) => {
    if (params.has(name) && form.elements[name]) form.elements[name].value = params.get(name);
  });
  if (params.has('offer') && offers[params.get('offer')]) {
    const offerKey = params.get('offer');
    const offer = offers[offerKey];
    form.elements.offer.value = offerKey;
    form.elements.price.value = offer.price;
    form.elements.timeline.value = offer.timeline;
    form.elements.outcome.value = offer.outcome;
  }
  form.elements.evidenceConfirmed.checked = false;
  persist();
}

function buildExtras() {
  const host = document.querySelector('[data-list="extras"]');
  host.replaceChildren(...Object.entries(extras).map(([key, extra]) => {
    const row = document.createElement('label');
    row.className = 'extra-row';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.dataset.extra = key;
    input.name = `extra-${key}`;

    const body = document.createElement('span');
    body.className = 'extra-body';
    body.append(
      Object.assign(document.createElement('strong'), {
        textContent: `${extra.name} · ${formatPrice(extra.price)} ${extra.unit}`
      }),
      Object.assign(document.createElement('span'), { className: 'extra-trigger', textContent: extra.trigger }),
      Object.assign(document.createElement('span'), { className: 'extra-scope', textContent: extra.scope })
    );

    row.append(input, body);
    input.addEventListener('change', () => { updateExtrasTotal(); persist(); });
    return row;
  }));
  updateExtrasTotal();
}

function updateExtrasTotal() {
  const chosen = selectedExtras();
  const node = document.querySelector('#extras-total');
  if (!chosen.length) { node.hidden = true; return; }
  const once = chosen.filter((extra) => extra.unit === 'una vez').reduce((sum, extra) => sum + extra.price, 0);
  const monthly = chosen.filter((extra) => extra.unit === 'mensual').reduce((sum, extra) => sum + extra.price, 0);
  const parts = [];
  if (once) parts.push(`${formatPrice(once)} por una vez`);
  if (monthly) parts.push(`${formatPrice(monthly)} al mes`);
  node.hidden = false;
  node.textContent = `Extras seleccionados: ${parts.join(' + ')}. Van aparte del precio del producto principal.`;
}

document.querySelector('#offer-select').addEventListener('change', (event) => {
  const offer = offers[event.target.value];
  form.elements.price.value = offer.price;
  form.elements.timeline.value = offer.timeline;
  form.elements.outcome.value = offer.outcome;
  persist();
});

form.addEventListener('input', persist);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  persist();
  render(getData());
});

document.querySelector('#clear-form').addEventListener('click', () => {
  form.reset();
  localStorage.removeItem(storageKey);
  emptyOutput.hidden = false;
  generatedOutput.hidden = true;
  proposalOutput.replaceChildren();
});

document.querySelector('#print-proposal').addEventListener('click', () => window.print());

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = button.dataset.copy === 'message' ? messageOutput : diagnosisOutput;
    await navigator.clipboard.writeText(target.innerText);
    const original = button.textContent;
    button.textContent = 'Copiado';
    button.classList.add('copy-success');
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove('copy-success');
    }, 1400);
  });
});

buildExtras();
restore();
importProspectFromQuery();
