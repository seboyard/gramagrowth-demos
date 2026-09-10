/* Página de planes y clase de prueba para gimnasios y estudios.
   Reutilizable: toda la información del cliente vive en config.js.

   Decisión de diseño: esto NO vende ni cobra membresías. Calcula el precio por
   mes de cada plan, muestra el ahorro real frente al mensual y manda una
   solicitud de clase de prueba con nombre, plan y horario. Sin pasarela de
   pago, sin cuentas de usuario y sin operación que mantener.

   Por qué el cálculo importa: un gimnasio vive de convertir mensuales en
   anuales, y casi ninguno muestra la cuenta que hace evidente la conveniencia. */

const config = window.GIMNASIO_CONFIG;

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const money = (value) => clp.format(Math.round(value));

const $ = (selector) => document.querySelector(selector);
const setText = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const BLOQUES = ['Temprano (7:00 a 10:00)', 'Media mañana (10:00 a 13:00)',
  'Tarde (14:00 a 18:00)', 'Después del trabajo (18:00 a 22:00)'];

// ── Cálculo de planes ──────────────────────────────────────────────────────

// Plan de referencia: el mensual publicado. Sin él no hay ahorro que mostrar,
// porque el ahorro sólo existe comparado contra pagar mes a mes.
function monthlyReference() {
  return config.planes.find((plan) => plan.meses === 1 && plan.precio) || null;
}

function planMath(plan) {
  if (!plan.precio) return { priced: false };
  const perMonth = plan.precio / plan.meses;
  const reference = monthlyReference();
  const comparable = reference && plan.meses > 1;
  const fullPrice = comparable ? reference.precio * plan.meses : null;
  const saving = comparable ? fullPrice - plan.precio : 0;
  return {
    priced: true,
    perMonth,
    saving: saving > 0 ? saving : 0,
    savingPercent: saving > 0 ? Math.round((saving / fullPrice) * 100) : 0,
    total: plan.precio + (plan.matricula || 0)
  };
}

// ── Solicitud ──────────────────────────────────────────────────────────────

function buildMessage() {
  const name = $('#visitor-name').value.trim();
  const planId = $('#plan-select').value;
  const plan = config.planes.find((candidate) => candidate.id === planId);
  const lines = [`Hola ${config.negocio.nombre}, quiero agendar una clase de prueba:`, ''];
  if (name) lines.push(`Nombre: ${name}`);

  if (plan) {
    const math = planMath(plan);
    lines.push(math.priced
      ? `Plan que me interesa: ${plan.nombre} — ${money(plan.precio)} (${money(math.perMonth)} por mes)`
      : `Plan que me interesa: ${plan.nombre}`);
    if (!math.priced) lines.push('Quiero confirmar el valor, no está publicado en el sitio.');
  }
  lines.push(`Día que me acomoda: ${$('#day-select').value}`);
  lines.push(`Horario preferido: ${$('#time-select').value}`);
  lines.push('', '¿Tienen cupo?');
  return lines.join('\n');
}

function renderSummary() {
  const box = $('#trial-summary');
  const whatsapp = $('#request-whatsapp');
  const email = $('#request-email');
  const name = $('#visitor-name').value.trim();

  box.replaceChildren();
  if (!name) {
    box.append(Object.assign(document.createElement('p'), {
      className: 'trial-empty', textContent: 'Escribe tu nombre para enviar la solicitud.'
    }));
    whatsapp.hidden = true;
    email.hidden = true;
    return;
  }

  const plan = config.planes.find((candidate) => candidate.id === $('#plan-select').value);
  const math = plan ? planMath(plan) : { priced: false };

  const summary = document.createElement('p');
  summary.className = 'trial-line';
  summary.textContent = plan
    ? `${plan.nombre} · ${$('#day-select').value} · ${$('#time-select').value}`
    : `${$('#day-select').value} · ${$('#time-select').value}`;
  box.append(summary);

  if (math.priced) {
    const price = document.createElement('p');
    price.className = 'trial-price';
    price.append(
      Object.assign(document.createElement('strong'), { textContent: money(math.perMonth) }),
      Object.assign(document.createElement('span'), { textContent: ' por mes' })
    );
    box.append(price);
    if (math.saving > 0) {
      box.append(Object.assign(document.createElement('p'), {
        className: 'trial-saving',
        textContent: `Ahorras ${money(math.saving)} frente a pagar mes a mes (${math.savingPercent}%).`
      }));
    }
  } else if (plan) {
    box.append(Object.assign(document.createElement('p'), {
      className: 'trial-flag', textContent: 'El valor de este plan no está publicado. Lo confirmamos al responder.'
    }));
  }

  const text = buildMessage();
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
    email.href = `mailto:${config.negocio.email}?subject=${encodeURIComponent('Consulta por clase de prueba')}&body=${encodeURIComponent(text)}`;
  } else {
    email.hidden = true;
  }
}

// ── Construcción desde config ──────────────────────────────────────────────

function buildList(selector, items, render) {
  const host = $(selector);
  if (host) host.replaceChildren(...items.map(render));
}

function renderPlans() {
  const host = $('[data-list="planes"]');
  host.replaceChildren(...config.planes.map((plan) => {
    const math = planMath(plan);
    const card = document.createElement('article');
    card.className = 'plan-card';
    if (plan.destacado) card.dataset.featured = 'true';

    card.append(Object.assign(document.createElement('h3'), { textContent: plan.nombre }));

    const price = document.createElement('p');
    price.className = 'plan-price';
    if (math.priced) {
      price.append(
        Object.assign(document.createElement('strong'), { textContent: money(math.perMonth) }),
        Object.assign(document.createElement('span'), { textContent: ' / mes' })
      );
    } else {
      price.append(Object.assign(document.createElement('strong'), { className: 'ask', textContent: 'Consultar' }));
    }
    card.append(price);

    if (math.priced) {
      const detail = plan.meses > 1
        ? `${money(plan.precio)} por ${plan.meses} meses`
        : 'Pago mensual';
      card.append(Object.assign(document.createElement('p'), { className: 'plan-detail', textContent: detail }));
      if (math.saving > 0) {
        card.append(Object.assign(document.createElement('p'), {
          className: 'plan-saving',
          textContent: `Ahorras ${money(math.saving)} (${math.savingPercent}%)`
        }));
      }
      if (plan.matricula) {
        card.append(Object.assign(document.createElement('p'), {
          className: 'plan-detail', textContent: `Matrícula ${money(plan.matricula)}`
        }));
      }
    } else if (plan.nota) {
      card.append(Object.assign(document.createElement('p'), { className: 'plan-note', textContent: plan.nota }));
    }

    const includes = document.createElement('ul');
    includes.className = 'plan-includes';
    (plan.incluye || []).forEach((item) => {
      includes.append(Object.assign(document.createElement('li'), { textContent: item }));
    });
    card.append(includes);

    const pick = document.createElement('button');
    pick.type = 'button';
    pick.className = 'button ghost small';
    pick.textContent = 'Elegir este plan';
    pick.addEventListener('click', () => {
      $('#plan-select').value = plan.id;
      renderSummary();
      $('#prueba').scrollIntoView({ behavior: 'smooth', block: 'start' });
      $('#visitor-name').focus();
    });
    card.append(pick);
    return card;
  }));

  // Si ningún plan tiene precio, decirlo una vez y no repetirlo por tarjeta.
  const anyPriced = config.planes.some((plan) => plan.precio);
  const missing = $('#plans-missing');
  missing.hidden = anyPriced;
  if (!anyPriced) {
    missing.textContent = 'Los valores de los planes no están publicados en el sitio. Envía tu consulta indicando cuál te interesa y te confirmamos el precio vigente.';
  }
}

function boot() {
  const { negocio, centro, marca, demo, prueba } = config;

  document.title = `${negocio.nombre} · Planes y clase de prueba`;
  document.documentElement.style.setProperty('--tinta', marca.tinta);
  document.documentElement.style.setProperty('--acento', marca.acento);
  document.documentElement.style.setProperty('--papel', marca.papel);

  if (demo?.activo) {
    const banner = $('#demo-banner');
    banner.hidden = false;
    banner.textContent = demo.aviso;
    $('#host-panel').hidden = false;
    setText('#footer-source', `Muestra construida con información publicada en ${demo.fuente}, leída el ${demo.leidoEl}. Precios de planes por confirmar con el gimnasio.`);
  }

  setText('[data-field="comuna"]', negocio.comuna);
  setText('[data-field="nombre"]', negocio.nombre);
  setText('[data-field="bajada"]', negocio.bajada);
  setText('[data-field="direccion"]', negocio.direccion);
  setText('[data-field="nombreFooter"]', negocio.nombre);
  setText('[data-field="direccionFooter"]', negocio.direccion);
  setText('[data-field="pruebaTitulo"]', prueba?.titulo || 'Agenda una clase de prueba');
  setText('[data-field="pruebaTexto"]', prueba?.texto || '');

  // Contacto: cada canal se oculta si el cliente no lo publica.
  if (negocio.whatsapp) {
    $('#footer-whatsapp').href = `https://api.whatsapp.com/send?phone=${negocio.whatsapp}`;
    $('#footer-whatsapp').textContent = 'WhatsApp';
  } else { $('#footer-whatsapp').hidden = true; }
  if (negocio.telefono) {
    $('#footer-phone').href = `tel:${negocio.telefono.replace(/\s/g, '')}`;
    $('#footer-phone').textContent = negocio.telefono;
  } else { $('#footer-phone').hidden = true; }
  if (negocio.instagram) {
    $('#footer-instagram').href = negocio.instagram;
    $('#footer-instagram').textContent = 'Instagram';
  } else { $('#footer-instagram').hidden = true; }
  if (negocio.email) {
    $('#footer-email').href = `mailto:${negocio.email}`;
    $('#footer-email').textContent = negocio.email;
  } else { $('#footer-email').hidden = true; }

  $('#map-link').href = negocio.mapa;
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

  buildList('[data-list="instalaciones"]', centro.instalaciones || [],
    (item) => Object.assign(document.createElement('li'), { textContent: item }));
  buildList('[data-list="clases"]', config.clases || [],
    (item) => Object.assign(document.createElement('span'), { className: 'class-chip', textContent: item }));
  buildList('[data-list="horarios"]', config.horarios || [], (slot) => {
    const item = document.createElement('li');
    item.append(
      Object.assign(document.createElement('span'), { textContent: slot.dia }),
      Object.assign(document.createElement('strong'), { textContent: `${slot.desde} a ${slot.hasta}` })
    );
    return item;
  });
  buildList('[data-list="servicios"]', config.servicios || [], (service) => {
    const row = document.createElement('div');
    row.className = 'service';
    row.append(
      Object.assign(document.createElement('strong'), { textContent: service.nombre }),
      Object.assign(document.createElement('span'), { className: 'service-price', textContent: money(service.precio) }),
      Object.assign(document.createElement('span'), { className: 'service-includes', textContent: (service.incluye || []).join(' · ') })
    );
    return row;
  });
  buildList('[data-list="reglas"]', config.reglas?.notas || [],
    (note) => Object.assign(document.createElement('li'), { textContent: note }));
  buildList('[data-list="faq"]', config.faq || [], (entry) => {
    const item = document.createElement('details');
    item.className = 'faq-item';
    item.append(
      Object.assign(document.createElement('summary'), { textContent: entry.pregunta }),
      Object.assign(document.createElement('p'), { textContent: entry.respuesta })
    );
    return item;
  });

  renderPlans();

  const planSelect = $('#plan-select');
  config.planes.forEach((plan) => planSelect.append(new Option(plan.nombre, plan.id)));
  const daySelect = $('#day-select');
  ['Cualquier día', ...DIAS].forEach((day) => daySelect.append(new Option(day, day)));
  const timeSelect = $('#time-select');
  BLOQUES.forEach((block) => timeSelect.append(new Option(block, block)));
  timeSelect.value = BLOQUES[3];

  ['#visitor-name', '#plan-select', '#day-select', '#time-select'].forEach((selector) => {
    $(selector).addEventListener('input', renderSummary);
    $(selector).addEventListener('change', renderSummary);
  });

  renderSummary();
}

boot();
