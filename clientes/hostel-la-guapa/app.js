/* Página de solicitud de reserva. Reutilizable: toda la información específica
   del cliente vive en config.js.

   Decisión de diseño: esto NO confirma reservas ni bloquea fechas. Envía una
   solicitud completa al anfitrión, que confirma a mano igual que hoy. Así no
   hay calendario que sincronizar, no hay riesgo de doble reserva y no se
   necesita pasarela de pago. */

const config = window.RESERVA_CONFIG;

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const money = (value) => clp.format(Math.round(value));

// Fechas en UTC para que el día no se corra por zona horaria.
const toDay = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};
const DAY_MS = 86400000;
const iso = (stamp) => new Date(stamp).toISOString().slice(0, 10);
const longDate = (isoDate) => new Date(toDay(isoDate)).toLocaleDateString('es-CL', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
});

const $ = (selector) => document.querySelector(selector);
const setText = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };

// ── Cálculo ────────────────────────────────────────────────────────────────

// Cada tipo de unidad puede traer su propia tabla de tarifas. Si no la trae,
// usa la tabla global: así un hospedaje de tarifa única sigue funcionando igual.
function seasonsOf(unitType) {
  return (unitType && unitType.temporadas?.length) ? unitType.temporadas : (config.temporadas || []);
}

function seasonFor(isoDate, unitType) {
  const day = toDay(isoDate);
  return seasonsOf(unitType).find((season) => day >= toDay(season.desde) && day <= toDay(season.hasta)) || null;
}

// Bloques marcados a mano por el anfitrión. Se comprueban sobre las noches
// ocupadas (la de salida no se ocupa), para no rechazar una llegada válida.
function blockedNights(checkin, nights) {
  const blocks = config.noDisponibles || [];
  const hits = [];
  for (let index = 0; index < nights; index += 1) {
    const night = toDay(checkin) + index * DAY_MS;
    const block = blocks.find((range) => night >= toDay(range.desde) && night <= toDay(range.hasta));
    if (block && !hits.includes(block)) hits.push(block);
  }
  return hits;
}

function quote({ checkin, checkout, guests, unit }) {
  const nights = Math.round((toDay(checkout) - toDay(checkin)) / DAY_MS);
  if (nights <= 0) return { error: 'La fecha de salida debe ser posterior a la de llegada.' };
  if (nights > 60) return { error: 'Para estadías largas conviene escribir directamente.' };

  const blocked = blockedNights(checkin, nights);
  if (blocked.length) {
    return {
      blocked,
      error: `${blocked[0].nota || 'Esas fechas ya están tomadas'}. Prueba otras fechas o escribe para consultar por una cancelación.`
    };
  }

  const unitType = config.tipos.find((type) => type.id === unit);
  const breakdown = [];
  let subtotal = 0;
  let unpriced = 0;
  for (let index = 0; index < nights; index += 1) {
    const night = iso(toDay(checkin) + index * DAY_MS);
    const season = seasonFor(night, unitType);
    if (season) { subtotal += season.tarifa; breakdown.push({ night, season: season.nombre, rate: season.tarifa }); }
    else { unpriced += 1; breakdown.push({ night, season: null, rate: null }); }
  }

  // Sin tarifa publicada para esas fechas: se dice, no se inventa.
  if (unpriced === nights) {
    return { nights, unit: unitType, guests, unpriced, extraGuests: Math.max(0, guests - unitType.capacidadTarifa),
      total: null, deposit: null, breakdown, surcharges: [], promoApplied: null,
      message: 'Esas fechas están fuera de las tarifas publicadas. El anfitrión te confirma el valor al responder.' };
  }

  const surcharges = [];
  if (nights === 1 && config.reglas.recargoUnaNoche) {
    subtotal += config.reglas.recargoUnaNoche;
    surcharges.push({ label: 'Recargo por una sola noche', amount: config.reglas.recargoUnaNoche });
  }

  // Promoción: aplica si coincide el número de noches y la llegada cae en vigencia.
  let promoApplied = null;
  for (const promo of config.promociones || []) {
    const inRange = toDay(checkin) >= toDay(promo.desde) && toDay(checkin) <= toDay(promo.hasta);
    if (promo.noches === nights && inRange && !unpriced && promo.precio < subtotal) {
      promoApplied = promo;
      subtotal = promo.precio;
      break;
    }
  }

  const extraGuests = Math.max(0, guests - unitType.capacidadTarifa);

  return {
    nights, unit: unitType, guests, unpriced, breakdown, surcharges, promoApplied, extraGuests,
    total: subtotal,
    deposit: config.reglas.abonoPorcentaje ? subtotal * (config.reglas.abonoPorcentaje / 100) : null,
    message: unpriced ? `${unpriced} de las ${nights} noches están fuera de las tarifas publicadas: ese tramo lo confirma el anfitrión.` : null
  };
}

// ── Mensaje de solicitud ───────────────────────────────────────────────────

function buildMessage(result, form) {
  const lines = [
    `Hola ${config.negocio.nombre}, quiero consultar disponibilidad:`,
    '',
    `Llegada: ${longDate(form.checkin)}`,
    `Salida: ${longDate(form.checkout)}`,
    `Noches: ${result.nights}`,
    `Pasajeros: ${result.guests}`,
    `${config.unidadLabel || 'Cabaña'}: ${result.unit.nombre}`
  ];
  if (result.total !== null) {
    lines.push('', ratesSource === 'ejemplo'
      ? `Valor de referencia (precios de ejemplo, por confirmar): ${money(result.total)}`
      : `Valor estimado según sus tarifas: ${money(result.total)}`);
    if (result.promoApplied) lines.push(`Incluye ${result.promoApplied.nombre}`);
    if (result.deposit !== null) {
      lines.push(`Abono para reservar (${config.reglas.abonoPorcentaje}%): ${money(result.deposit)}`);
    }
  }
  if (result.extraGuests > 0) {
    lines.push('', `Consulta: somos ${result.guests}, ${result.extraGuests} sobre la tarifa base. ¿Tiene costo adicional?`);
  }
  if (result.message) lines.push('', result.message);
  lines.push('', '¿Tienen disponibilidad para esas fechas?');
  return lines.join('\n');
}

// ── Render del resultado ───────────────────────────────────────────────────

function renderQuote() {
  const form = {
    checkin: $('#checkin').value,
    checkout: $('#checkout').value,
    guests: Number($('#guests').value),
    unit: $('#unit').value
  };
  const box = $('#quote-result');
  const whatsapp = $('#request-whatsapp');
  const email = $('#request-email');

  if (!form.checkin || !form.checkout) {
    box.replaceChildren(Object.assign(document.createElement('p'), {
      className: 'quote-empty', textContent: 'Elige fecha de llegada y salida para ver el valor.'
    }));
    whatsapp.hidden = true;
    email.hidden = true;
    return;
  }

  const result = quote(form);
  box.replaceChildren();

  if (result.error) {
    box.append(Object.assign(document.createElement('p'), { className: 'quote-error', textContent: result.error }));
    whatsapp.hidden = true;
    email.hidden = true;
    return;
  }


  const summary = document.createElement('p');
  summary.className = 'quote-summary';
  summary.textContent = `${result.nights} ${result.nights === 1 ? 'noche' : 'noches'} · ${result.guests} ${result.guests === 1 ? 'pasajero' : 'pasajeros'} · ${result.unit.nombre}`;
  box.append(summary);

  if (result.total !== null) {
    const rows = document.createElement('dl');
    rows.className = 'quote-rows';

    const grouped = new Map();
    result.breakdown.filter((night) => night.season).forEach((night) => {
      const entry = grouped.get(night.season) || { count: 0, rate: night.rate };
      entry.count += 1;
      grouped.set(night.season, entry);
    });
    grouped.forEach((entry, season) => {
      rows.append(
        Object.assign(document.createElement('dt'), { textContent: `${season} · ${entry.count} × ${money(entry.rate)}` }),
        Object.assign(document.createElement('dd'), { textContent: money(entry.count * entry.rate) })
      );
    });
    (result.surcharges || []).forEach((item) => {
      rows.append(
        Object.assign(document.createElement('dt'), { textContent: item.label }),
        Object.assign(document.createElement('dd'), { textContent: money(item.amount) })
      );
    });
    if (result.promoApplied) {
      rows.append(
        Object.assign(document.createElement('dt'), { className: 'promo', textContent: result.promoApplied.nombre }),
        Object.assign(document.createElement('dd'), { className: 'promo', textContent: money(result.promoApplied.precio) })
      );
    }
    box.append(rows);

    const total = document.createElement('p');
    total.className = 'quote-total';
    const totalValue = Object.assign(document.createElement('strong'), { textContent: money(result.total) });
    if (ratesSource === 'ejemplo') totalValue.prepend(exampleBadge());
    total.append(
      Object.assign(document.createElement('span'), { textContent: ratesSource === 'ejemplo' ? 'Total con precios de ejemplo' : 'Total estimado' }),
      totalValue
    );
    box.append(total);
    // Sin porcentaje de abono publicado no se inventa uno: se omite la línea.
    if (result.deposit !== null) {
      const deposit = document.createElement('p');
      deposit.className = 'quote-deposit';
      deposit.textContent = `Abono para reservar (${config.reglas.abonoPorcentaje}%): ${money(result.deposit)}`;
      box.append(deposit);
    }
  }

  if (result.extraGuests > 0) {
    box.append(Object.assign(document.createElement('p'), {
      className: 'quote-flag',
      textContent: `La tarifa cubre ${result.unit.capacidadTarifa} personas. Consulta el valor por ${result.extraGuests} pasajero(s) adicional(es).`
    }));
  }
  if (result.message) {
    box.append(Object.assign(document.createElement('p'), { className: 'quote-flag', textContent: result.message }));
  }

  const text = buildMessage(result, form);
  const hostPreview = $('#host-preview');
  if (hostPreview) hostPreview.textContent = text;
  if (config.negocio.whatsapp) {
    whatsapp.hidden = false;
    whatsapp.href = `https://api.whatsapp.com/send?phone=${config.negocio.whatsapp}&text=${encodeURIComponent(text)}`;
  } else {
    whatsapp.hidden = true;
  }
  if (config.negocio.email) {
    email.hidden = false;
    email.className = config.negocio.whatsapp ? 'button ghost block' : 'button primary block';
    email.textContent = config.negocio.whatsapp ? 'Enviar por correo' : 'Enviar solicitud por correo';
    email.href = `mailto:${config.negocio.email}?subject=${encodeURIComponent(`Consulta de disponibilidad · ${result.nights} noches`)}&body=${encodeURIComponent(text)}`;
  }
}

// ── Construcción de la página desde config ─────────────────────────────────

// Origen de las tarifas que se están mostrando. 'anfitrion' cuando las escribió
// él en la reunión; 'ejemplo' cuando son de muestra y llevan etiqueta visible.
let ratesSource = null;

function exampleBadge() {
  const badge = document.createElement('span');
  badge.className = 'example-badge';
  badge.textContent = 'ejemplo';
  return badge;
}

function renderRates(unitType) {
  const seasons = seasonsOf(unitType);
  const title = $('#rates-title');
  if (title) {
    title.textContent = (config.tipos.length > 1 && unitType?.temporadas?.length)
      ? `Tarifas · ${unitType.nombre}`
      : 'Tarifas por noche';
  }
  buildList('[data-list="temporadas"]', seasons, (season) => {
    const item = document.createElement('li');
    const price = Object.assign(document.createElement('strong'), { textContent: `${money(season.tarifa)} / noche` });
    if (ratesSource === 'ejemplo') price.prepend(exampleBadge());
    item.append(Object.assign(document.createElement('span'), { textContent: season.nombre }), price);
    return item;
  });
  const empty = $('#rates-empty');
  if (empty) empty.hidden = seasons.length > 0;
}

// Tarifa más baja de una unidad, para el "desde" de su tarjeta.
function fromPrice(unitType) {
  const seasons = seasonsOf(unitType);
  if (!seasons.length) return null;
  return Math.min(...seasons.map((season) => season.tarifa));
}

function buildList(selector, items, render) {
  const host = $(selector);
  if (!host) return;
  host.replaceChildren(...items.map(render));
}

// ── Editor de tarifas para la reunión ─────────────────────────────────────
// Sólo existe en modo muestra. Resuelve el caso más común: el prospecto no
// publica precios, y sin precios el cotizador no puede lucirse. El anfitrión
// dicta sus tarifas, el asociado las escribe y la página se enciende con SUS
// números. Se guardan en este navegador; nunca se publican desde aquí.

const editorKey = () => `gramagrowth.tarifas.${(config.demo?.fuente || config.negocio.nombre).replace(/\W+/g, '-')}`;

// Precios de ejemplo: orientativos por capacidad, para mostrar el mecanismo
// cuando el anfitrión no tiene el número a mano. Van etiquetados en toda la página.
const EXAMPLE_PER_PERSON = 22000;

function applyRates(rates, source) {
  const year = new Date().getFullYear();
  config.tipos.forEach((type) => {
    const price = rates.units?.[type.id];
    if (price) {
      type.temporadas = [
        { id: 'todo-el-ano', nombre: 'Tarifa por noche', desde: `${year}-01-01`, hasta: `${year + 1}-12-31`, tarifa: price }
      ];
    } else {
      delete type.temporadas;
    }
  });
  config.temporadas = [];
  config.reglas.abonoPorcentaje = rates.deposit || 0;
  ratesSource = Object.keys(rates.units || {}).length ? source : null;

  renderRates(config.tipos.find((type) => type.id === $('#unit').value) || config.tipos[0]);
  renderUnitCards();
  renderQuote();
  const status = $('#rates-editor-status');
  if (status) {
    status.textContent = ratesSource === 'anfitrion'
      ? 'Tarifas del anfitrión cargadas. Cotiza fechas arriba para verlas funcionando.'
      : ratesSource === 'ejemplo'
        ? 'Precios de ejemplo activos: aparecen etiquetados en toda la página.'
        : 'Sin tarifas: la página muestra "consultar".';
  }
}

function readEditor() {
  const units = {};
  document.querySelectorAll('#rates-editor-rows input[data-unit]').forEach((input) => {
    const value = Number(input.value);
    if (value > 0) units[input.dataset.unit] = value;
  });
  return { units, deposit: Number($('#rates-editor-deposit').value) || 0 };
}

function persistEditor(rates, source) {
  try { localStorage.setItem(editorKey(), JSON.stringify({ ...rates, source })); } catch { /* sin storage */ }
}

function setupRatesEditor() {
  if (!config.demo?.activo || document.documentElement.dataset.captura) return;
  const toggle = $('#rates-editor-toggle');
  const panel = $('#rates-editor');
  const rows = $('#rates-editor-rows');
  if (!toggle || !panel) return;
  toggle.hidden = false;

  rows.replaceChildren(...config.tipos.map((type) => {
    const row = document.createElement('label');
    row.className = 'rates-editor-row';
    const input = Object.assign(document.createElement('input'), { type: 'number', min: 0, step: 1000, placeholder: '$ por noche' });
    input.dataset.unit = type.id;
    row.append(Object.assign(document.createElement('span'), { textContent: `${type.nombre} · hasta ${type.capacidad}` }), input);
    return row;
  }));

  const apply = (source) => {
    const rates = readEditor();
    persistEditor(rates, source);
    applyRates(rates, source);
  };

  rows.addEventListener('input', () => apply('anfitrion'));
  $('#rates-editor-deposit').addEventListener('input', () => apply(ratesSource || 'anfitrion'));

  $('#rates-editor-example').addEventListener('click', () => {
    config.tipos.forEach((type) => {
      const input = rows.querySelector(`input[data-unit="${type.id}"]`);
      if (input) input.value = Math.round((EXAMPLE_PER_PERSON * type.capacidad) / 1000) * 1000;
    });
    if (!$('#rates-editor-deposit').value) $('#rates-editor-deposit').value = 50;
    apply('ejemplo');
  });
  $('#rates-editor-clear').addEventListener('click', () => {
    rows.querySelectorAll('input').forEach((input) => { input.value = ''; });
    $('#rates-editor-deposit').value = '';
    try { localStorage.removeItem(editorKey()); } catch { /* sin storage */ }
    applyRates({ units: {}, deposit: 0 }, null);
  });
  $('#rates-editor-copy').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    const snippet = config.tipos.map((type) => ({ id: type.id, nombre: type.nombre, temporadas: type.temporadas || [] }));
    const header = `// Tarifas dictadas en la reunión (${new Date().toLocaleDateString('es-CL')}). Confirmar por escrito antes de publicar.`;
    const text = `${header}\ntipos: ${JSON.stringify(snippet, null, 2)},\nreglas: { abonoPorcentaje: ${config.reglas.abonoPorcentaje} }`;
    await navigator.clipboard.writeText(text);
    const original = button.textContent;
    button.textContent = 'Copiado';
    setTimeout(() => { button.textContent = original; }, 1400);
  });

  toggle.addEventListener('click', () => { panel.hidden = !panel.hidden; });
  $('#rates-editor-close').addEventListener('click', () => { panel.hidden = true; });

  try {
    const saved = JSON.parse(localStorage.getItem(editorKey()) || 'null');
    if (saved?.units) {
      Object.entries(saved.units).forEach(([id, price]) => {
        const input = rows.querySelector(`input[data-unit="${id}"]`);
        if (input) input.value = price;
      });
      if (saved.deposit) $('#rates-editor-deposit').value = saved.deposit;
      applyRates(saved, saved.source || 'anfitrion');
    }
  } catch { /* sin storage */ }
}

function boot() {
  const { negocio, propiedad, marca, reglas, demo } = config;

  document.title = `${negocio.nombre} · Reserva directa`;
  document.documentElement.style.setProperty('--tinta', marca.tinta);
  document.documentElement.style.setProperty('--acento', marca.acento);
  document.documentElement.style.setProperty('--papel', marca.papel);

  // ?captura=1: para fotografiar la página y ponerla en la propuesta. Oculta lo
  // que sólo existe en modo muestra (aviso, editor), que en un PDF es ruido.
  const captura = new URLSearchParams(location.search).has('captura');
  if (demo?.activo && !captura) {
    const banner = $('#demo-banner');
    banner.hidden = false;
    banner.textContent = demo.aviso;
  }
  if (captura) document.documentElement.dataset.captura = 'true';

  // "Cabaña" por defecto; un hostal dice "Habitación", un lodge "Unidad".
  setText('[data-field="unidadLabel"]', config.unidadLabel || 'Cabaña');
  setText('[data-field="comuna"]', negocio.comuna);
  setText('[data-field="nombre"]', negocio.nombre);
  setText('[data-field="bajada"]', negocio.bajada);
  setText('[data-field="propiedadTitular"]', propiedad.titular);
  setText('[data-field="propiedadDescripcion"]', propiedad.descripcion);
  setText('[data-field="direccion"]', negocio.direccion);
  setText('[data-field="nombreFooter"]', negocio.nombre);
  setText('[data-field="direccionFooter"]', negocio.direccion);

  // No todos publican WhatsApp: si no hay, se ofrece correo y se ocultan los
  // botones en vez de dejar enlaces rotos.
  if (negocio.whatsapp) {
    const waHref = `https://api.whatsapp.com/send?phone=${negocio.whatsapp}`;
    $('#hero-whatsapp').href = waHref;
    $('#footer-whatsapp').href = waHref;
    $('#footer-whatsapp').textContent = 'WhatsApp';
  } else {
    $('#hero-whatsapp').hidden = true;
    $('#footer-whatsapp').hidden = true;
    if (negocio.email) {
      $('#hero-whatsapp').hidden = false;
      $('#hero-whatsapp').href = `mailto:${negocio.email}`;
      $('#hero-whatsapp').textContent = 'Escribir por correo';
      $('#hero-whatsapp').removeAttribute('target');
    }
  }
  if (negocio.telefono) {
    $('#footer-phone').href = `tel:${negocio.telefono.replace(/\s/g, '')}`;
    $('#footer-phone').textContent = negocio.telefono;
  } else { $('#footer-phone').hidden = true; }
  if (negocio.email) {
    $('#footer-email').href = `mailto:${negocio.email}`;
    $('#footer-email').textContent = negocio.email;
  } else { $('#footer-email').hidden = true; }
  $('#map-link').href = negocio.mapa;
  // Mapa embebido: usa mapaEmbed si el config lo trae, si no lo arma desde la
  // dirección. Sin API key — el modo `output=embed` es público.
  const mapHost = $('#map-embed');
  const consulta = negocio.mapaEmbed || (negocio.direccion
    ? `https://www.google.com/maps?q=${encodeURIComponent(`${negocio.direccion}, ${negocio.comuna || 'Chile'}`)}&output=embed`
    : null);
  if (mapHost && consulta) {
    const frame = document.createElement('iframe');
    frame.src = consulta;
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.title = `Ubicación de ${negocio.nombre} en el mapa`;
    frame.allowFullscreen = true;
    mapHost.append(frame);
    mapHost.hidden = false;
  }
  if (demo?.activo) {
    setText('#footer-source', `Muestra construida con información publicada en ${demo.fuente}, leída el ${demo.leidoEl}. Tarifas por confirmar con el anfitrión.`);
  }

  buildList('[data-list="reservaDirecta"]', config.reservaDirecta || [],
    (item) => Object.assign(document.createElement('li'), { textContent: item }));

  // El panel del anfitrión es material de venta: sólo existe mientras es muestra.
  if (demo?.activo) $('#host-panel').hidden = false;

  // Galería: fotos del propio sitio del cliente. La primera se usa de fondo en
  // la portada. Si alguna no carga (protección de hotlink, imagen movida) se
  // quita sola en vez de dejar un hueco roto.
  const fotos = (config.galeria || []).filter(Boolean);
  if (fotos.length) {
    const hero = document.querySelector('.hero');
    const probe = new Image();
    probe.addEventListener('load', () => {
      hero.style.backgroundImage =
        `linear-gradient(150deg, rgba(0,0,0,.78), rgba(0,0,0,.55)), url("${fotos[0]}")`;
      hero.classList.add('has-photo');
    });
    probe.src = fotos[0];

    const section = $('#galeria');
    const grid = $('[data-list="galeria"]');
    grid.replaceChildren(...fotos.map((src, index) => {
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      const image = document.createElement('img');
      image.src = src;
      image.loading = index === 0 ? 'eager' : 'lazy';
      image.alt = `${negocio.nombre} — foto ${index + 1}`;
      image.addEventListener('error', () => figure.remove());
      figure.append(image);
      return figure;
    }));
    section.hidden = false;
    if (demo?.activo) {
      $('#gallery-note').textContent = `Fotos tomadas del sitio público ${demo.fuente}. En la entrega final se reemplazan por las que entregue el cliente.`;
    }
  }

  buildList('[data-list="certificaciones"]', propiedad.certificaciones,
    (item) => Object.assign(document.createElement('li'), { textContent: item }));
  buildList('[data-list="amenidades"]', propiedad.amenidades,
    (item) => Object.assign(document.createElement('span'), { className: 'amenity', textContent: item }));
  buildList('[data-list="atractivos"]', config.atractivos,
    (item) => Object.assign(document.createElement('li'), { textContent: item }));

  renderUnitCards();
}

function renderUnitCards() {
  buildList('[data-list="tipos"]', config.tipos, (type) => {
    const card = document.createElement('article');
    card.className = 'unit-card';
    card.append(
      Object.assign(document.createElement('h3'), { textContent: type.nombre }),
      Object.assign(document.createElement('p'), { className: 'unit-detail', textContent: type.detalle }),
      Object.assign(document.createElement('p'), { className: 'unit-cap', textContent: `Hasta ${type.capacidad} personas` })
    );
    const desde = fromPrice(type);
    if (desde !== null) {
      const from = Object.assign(document.createElement('p'), { className: 'unit-from', textContent: `Desde ${money(desde)} por noche` });
      if (ratesSource === 'ejemplo') from.prepend(exampleBadge());
      card.append(from);
    }
    const pick = document.createElement('button');
    pick.type = 'button';
    pick.className = 'button ghost small';
    pick.textContent = 'Cotizar esta cabaña';
    pick.addEventListener('click', () => {
      $('#unit').value = type.id;
      renderQuote();
      $('#cotizar').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    card.append(pick);
    return card;
  });
}

function bootRest() {
  const { reglas } = config;
  renderRates(config.tipos[0]);

  buildList('[data-list="promociones"]', config.promociones || [], (promo) => {
    const card = document.createElement('p');
    card.className = 'promo-card';
    card.append(
      Object.assign(document.createElement('strong'), { textContent: `${promo.nombre}: ${promo.noches} noches por ${money(promo.precio)}` }),
      Object.assign(document.createElement('span'), { textContent: promo.nota })
    );
    return card;
  });

  buildList('[data-list="reglas"]', reglas.notas,
    (note) => Object.assign(document.createElement('li'), { textContent: note }));

  buildList('[data-list="faq"]', config.faq, (entry) => {
    const item = document.createElement('details');
    item.className = 'faq-item';
    item.append(
      Object.assign(document.createElement('summary'), { textContent: entry.pregunta }),
      Object.assign(document.createElement('p'), { textContent: entry.respuesta })
    );
    return item;
  });

  // Selectores del cotizador
  const maxCapacity = Math.max(...config.tipos.map((type) => type.capacidad));
  const guests = $('#guests');
  for (let count = 1; count <= maxCapacity; count += 1) {
    guests.append(new Option(`${count} ${count === 1 ? 'persona' : 'personas'}`, String(count)));
  }
  guests.value = String(Math.min(2, maxCapacity));

  const unit = $('#unit');
  config.tipos.forEach((type) => unit.append(new Option(type.nombre, type.id)));

  // No permitir fechas pasadas.
  const today = new Date().toISOString().slice(0, 10);
  $('#checkin').min = today;
  $('#checkout').min = today;

  $('#checkin').addEventListener('change', () => {
    const checkin = $('#checkin').value;
    if (checkin) {
      const next = iso(toDay(checkin) + DAY_MS);
      $('#checkout').min = next;
      if ($('#checkout').value && $('#checkout').value <= checkin) $('#checkout').value = next;
    }
    renderQuote();
  });
  ['#checkout', '#guests'].forEach((selector) =>
    $(selector).addEventListener('change', renderQuote));
  $('#unit').addEventListener('change', () => {
    renderRates(config.tipos.find((type) => type.id === $('#unit').value));
    renderQuote();
  });

  renderQuote();
  setupRatesEditor();
}

boot();
bootRest();
