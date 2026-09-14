/* Página de solicitud de hora para barberías, peluquerías y salones.
   Reutilizable: toda la información específica del cliente vive en config.js.

   Decisión de diseño: esto NO es una agenda en tiempo real ni cobra. Arma una
   solicitud completa —servicio, profesional, día, bloque, duración y valor
   publicado— que el negocio confirma a mano por WhatsApp, igual que hoy. Así
   no hay calendario que sincronizar, no hay doble reserva que explicar y no
   se necesita pasarela de pago.

   Lo que sí resuelve, y es el argumento de venta: hoy cada consulta llega como
   "¿tienen hora?" y empiezan cinco mensajes para saber qué servicio, cuándo,
   con quién y cuánto cuesta. Aquí eso sale escrito de una vez, con el bloque
   ya dentro del horario y con la duración del servicio considerada. */

const config = window.HORA_CONFIG;

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const money = (value) => clp.format(Math.round(value));

// Fechas en UTC para que el día no se corra por zona horaria.
const toDay = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};
const DAY_MS = 86400000;
const isoOf = (ms) => new Date(ms).toISOString().slice(0, 10);
const todayIso = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
const longDate = (isoDate) => new Date(toDay(isoDate)).toLocaleDateString('es-CL', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
});

const $ = (selector) => document.querySelector(selector);
const setText = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };

// ── Horario ────────────────────────────────────────────────────────────────

// Orden de getUTCDay(): domingo es 0. Las claves coinciden con config.horario.semana.
const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const DIAS_ROTULO = { lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo' };

const toMinutes = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const toHHMM = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const duracionTexto = (minutos) => {
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto ? `${horas} h ${resto} min` : `${horas} h`;
};

// Horario del día de la semana al que cae una fecha ISO, o null si cierra.
function horarioDelDia(isoDate) {
  const clave = DIAS[new Date(toDay(isoDate)).getUTCDay()];
  return config.horario.semana[clave] || null;
}

// Instante local en que empieza un bloque, para compararlo con "ahora".
function inicioLocal(isoDate, minutos) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day, Math.floor(minutos / 60), minutos % 60);
}

// Bloques ofrecidos para una fecha y un servicio: cada `bloqueMinutos` desde la
// apertura, y sólo los que terminan antes del cierre. Los que caen dentro de
// la anticipación mínima (o ya pasaron) se descartan. No consulta ninguna
// agenda: el negocio confirma si el bloque está libre.
function bloquesDisponibles(isoDate, service) {
  const dia = horarioDelDia(isoDate);
  if (!dia) return [];
  const paso = config.horario.bloqueMinutos || 30;
  const apertura = toMinutes(dia.apertura);
  const cierre = toMinutes(dia.cierre);
  const limite = Date.now() + (config.reglas?.anticipacionMinimaHoras || 0) * 3600000;
  const bloques = [];
  for (let inicio = apertura; inicio + service.duracionMinutos <= cierre; inicio += paso) {
    if (inicioLocal(isoDate, inicio).getTime() < limite) continue;
    bloques.push({ inicio: toHHMM(inicio), fin: toHHMM(inicio + service.duracionMinutos) });
  }
  return bloques;
}

// Primer día, desde hoy, con al menos un bloque para el servicio. Busca hasta
// dos semanas: si un negocio cierra más que eso, el problema no es de la página.
function primerDiaDisponible(service) {
  const hoy = toDay(todayIso());
  for (let offset = 0; offset < 14; offset += 1) {
    const iso = isoOf(hoy + offset * DAY_MS);
    if (bloquesDisponibles(iso, service).length) return iso;
  }
  return todayIso();
}

// ── Profesionales ──────────────────────────────────────────────────────────

const findService = (id) => config.servicios.find((service) => service.id === id) || config.servicios[0];
const findPro = (id) => (config.profesionales || []).find((pro) => pro.id === id) || null;

// Un profesional sin lista de servicios atiende todos.
const atiende = (pro, service) => !pro.servicios?.length || pro.servicios.includes(service.id);

// ── Estado del bloque elegido ──────────────────────────────────────────────

let bloqueElegido = null;

// ── Solicitud ──────────────────────────────────────────────────────────────

function leerFormulario() {
  return {
    servicio: $('#servicio').value,
    profesional: $('#profesional').value,
    fecha: $('#fecha').value,
    bloque: bloqueElegido
  };
}

function armarSolicitud(form) {
  const service = findService(form.servicio);
  const pro = findPro(form.profesional);

  if (!form.fecha) return { error: 'Elige el día para ver los bloques disponibles.' };
  if (toDay(form.fecha) < toDay(todayIso())) return { error: 'Ese día ya pasó. Elige una fecha desde hoy.' };

  const dia = horarioDelDia(form.fecha);
  if (!dia) {
    const clave = DIAS[new Date(toDay(form.fecha)).getUTCDay()];
    return { error: `Los ${DIAS_ROTULO[clave].toLowerCase()} el local está cerrado. Elige otro día.` };
  }

  const bloques = bloquesDisponibles(form.fecha, service);
  if (!bloques.length) {
    return { error: `Para ese día ya no queda ningún bloque de ${duracionTexto(service.duracionMinutos)} dentro del horario. Prueba con otro día.` };
  }
  if (!form.bloque || !bloques.some((bloque) => bloque.inicio === form.bloque.inicio)) {
    return { error: 'Elige un bloque horario para armar la solicitud.', pendiente: true };
  }

  return { service, pro, fecha: form.fecha, bloque: form.bloque };
}

// ── Mensaje de solicitud ───────────────────────────────────────────────────

function buildMessage(result) {
  const lines = [
    `Hola ${config.negocio.nombre}, quiero reservar una hora:`,
    '',
    `Servicio: ${result.service.nombre} (${result.service.duracionMinutos} min)`
  ];
  if ((config.profesionales || []).length) {
    lines.push(`Profesional: ${result.pro ? result.pro.nombre : 'sin preferencia'}`);
  }
  lines.push(
    `Día: ${longDate(result.fecha)}`,
    `Hora: ${result.bloque.inicio}`,
    result.service.precio === null || result.service.precio === undefined
      ? 'Valor publicado: a confirmar'
      : `Valor publicado: ${money(result.service.precio)}`,
    '',
    '¿Tienen ese horario disponible?'
  );
  return lines.join('\n');
}

// ── Render del resultado ───────────────────────────────────────────────────

function renderQuote() {
  const form = leerFormulario();
  const box = $('#quote-result');
  const whatsapp = $('#request-whatsapp');
  const email = $('#request-email');
  const ocultarBotones = () => { whatsapp.hidden = true; email.hidden = true; };

  const result = armarSolicitud(form);
  box.replaceChildren();

  if (result.error) {
    box.append(Object.assign(document.createElement('p'), {
      className: result.pendiente ? 'quote-empty' : 'quote-error',
      textContent: result.error
    }));
    ocultarBotones();
    return;
  }

  const summary = document.createElement('p');
  summary.className = 'quote-summary';
  summary.textContent = `${longDate(result.fecha)} · ${result.bloque.inicio} a ${result.bloque.fin}`;
  box.append(summary);

  const rows = document.createElement('dl');
  rows.className = 'quote-rows';
  const fila = (label, value) => rows.append(
    Object.assign(document.createElement('dt'), { textContent: label }),
    Object.assign(document.createElement('dd'), { textContent: value })
  );
  fila(result.service.nombre, duracionTexto(result.service.duracionMinutos));
  if ((config.profesionales || []).length) fila('Profesional', result.pro ? result.pro.nombre : 'Sin preferencia');
  box.append(rows);

  const total = document.createElement('p');
  total.className = 'quote-total';
  const sinPrecio = result.service.precio === null || result.service.precio === undefined;
  total.append(
    Object.assign(document.createElement('span'), { textContent: sinPrecio ? 'Valor' : 'Valor publicado' }),
    Object.assign(document.createElement('strong'), { textContent: sinPrecio ? 'a confirmar' : money(result.service.precio) })
  );
  box.append(total);

  if (sinPrecio) {
    box.append(Object.assign(document.createElement('p'), {
      className: 'quote-flag',
      textContent: 'Este servicio no tiene valor publicado: el equipo te lo confirma al responder.'
    }));
  }

  const text = buildMessage(result);
  const hostPreview = $('#host-preview');
  if (hostPreview) hostPreview.textContent = text;

  const asunto = `Hora para ${result.service.nombre.toLowerCase()} · ${longDate(result.fecha)} ${result.bloque.inicio}`;
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
    email.href = `mailto:${config.negocio.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(text)}`;
  } else {
    email.hidden = true;
  }
}

// ── Bloques horarios ───────────────────────────────────────────────────────

function renderBloques() {
  const service = findService($('#servicio').value);
  const fecha = $('#fecha').value;
  const grid = $('#slots-grid');
  const hint = $('#slots-hint');
  grid.replaceChildren();

  const dia = fecha ? horarioDelDia(fecha) : null;
  const bloques = fecha ? bloquesDisponibles(fecha, service) : [];

  // Si el bloque elegido antes sigue existiendo se conserva, pero con la hora
  // de término del servicio actual; si ya no cabe, se suelta.
  bloqueElegido = bloqueElegido
    ? bloques.find((bloque) => bloque.inicio === bloqueElegido.inicio) || null
    : null;

  if (!fecha) {
    hint.textContent = 'Elige un día para ver los bloques.';
  } else if (!dia) {
    hint.textContent = 'Ese día el local está cerrado.';
  } else if (!bloques.length) {
    hint.textContent = 'No quedan bloques para ese día dentro del horario.';
  } else {
    hint.textContent = `Atención de ${dia.apertura} a ${dia.cierre} · cada bloque dura ${duracionTexto(service.duracionMinutos)}.`;
  }

  bloques.forEach((bloque) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'slot';
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', String(bloqueElegido?.inicio === bloque.inicio));
    button.textContent = bloque.inicio;
    button.title = `${bloque.inicio} a ${bloque.fin}`;
    button.addEventListener('click', () => {
      bloqueElegido = bloque;
      grid.querySelectorAll('.slot').forEach((node) => node.setAttribute('aria-checked', String(node === button)));
      renderQuote();
    });
    grid.append(button);
  });

  renderQuote();
}

// ── Panel lateral del servicio elegido ─────────────────────────────────────

function renderServicePanel(service) {
  setText('#service-title', service.nombre);
  setText('#service-summary', service.detalle || '');

  const sinPrecio = service.precio === null || service.precio === undefined;
  const facts = [
    { label: 'Duración', value: duracionTexto(service.duracionMinutos) }
  ];
  if (!sinPrecio) facts.push({ label: 'Valor publicado', value: money(service.precio) });
  buildList('#service-facts', facts, (fact) => {
    const item = document.createElement('li');
    item.append(
      Object.assign(document.createElement('span'), { textContent: fact.label }),
      Object.assign(document.createElement('strong'), { textContent: fact.value })
    );
    return item;
  });
  $('#rates-empty').hidden = !sinPrecio;

  // La referencia dice de dónde salió el precio. Sólo se muestra en modo
  // demo: en el sitio real el dueño ya sabe de dónde salen sus valores.
  const source = $('#rates-source');
  const ref = service.referencia;
  if (config.demo?.activo && !sinPrecio && ref) {
    source.hidden = false;
    source.textContent = `Valor tomado de ${ref.fuente}${ref.rotulo ? ` (${ref.rotulo})` : ''}. Por confirmar con el cliente.`;
  } else {
    source.hidden = true;
  }
}

function renderProfesionales(service) {
  const pros = (config.profesionales || []).filter((pro) => atiende(pro, service));
  const field = $('#pro-field');
  const select = $('#profesional');
  const anterior = select.value;
  select.replaceChildren();
  if (!(config.profesionales || []).length) { field.hidden = true; return; }
  field.hidden = false;
  select.append(new Option('Sin preferencia', ''));
  pros.forEach((pro) => select.append(new Option(pro.nombre, pro.id)));
  if (pros.some((pro) => pro.id === anterior)) select.value = anterior;
}

// ── Construcción de la página desde config ─────────────────────────────────

function buildList(selector, items, render) {
  const host = $(selector);
  if (!host) return;
  host.replaceChildren(...items.map(render));
}

function boot() {
  const { negocio, operacion, marca, demo } = config;

  document.title = `${negocio.nombre} · Reserva tu hora`;
  document.documentElement.style.setProperty('--tinta', marca.tinta);
  document.documentElement.style.setProperty('--acento', marca.acento);
  document.documentElement.style.setProperty('--papel', marca.papel);

  if (demo?.activo) {
    const banner = $('#demo-banner');
    banner.hidden = false;
    banner.textContent = demo.aviso;
    $('#host-panel').hidden = false;
    setText('#footer-source', `Muestra construida con información publicada en ${demo.fuente} y en su agenda en línea, leídas el ${demo.leidoEl}. Valores, duraciones y horario por confirmar con el cliente.`);
  }

  setText('[data-field="comuna"]', negocio.comuna);
  setText('[data-field="nombre"]', negocio.nombre);
  setText('[data-field="bajada"]', negocio.bajada);
  setText('[data-field="operacionTitular"]', operacion.titular);
  setText('[data-field="operacionDescripcion"]', operacion.descripcion);
  setText('[data-field="direccion"]', negocio.direccion || negocio.comuna);
  setText('[data-field="nombreFooter"]', negocio.nombre);
  setText('[data-field="direccionFooter"]', [negocio.direccion, negocio.comuna].filter(Boolean).join(' · '));

  // No todos publican WhatsApp: si no hay, se ofrece correo y se ocultan los
  // botones en vez de dejar enlaces rotos.
  if (negocio.whatsapp) {
    const waHref = `https://api.whatsapp.com/send?phone=${negocio.whatsapp}`;
    $('#hero-whatsapp').href = waHref;
    $('#footer-whatsapp').href = waHref;
    $('#footer-whatsapp').textContent = 'WhatsApp';
  } else {
    $('#footer-whatsapp').hidden = true;
    if (negocio.email) {
      $('#hero-whatsapp').href = `mailto:${negocio.email}`;
      $('#hero-whatsapp').textContent = 'Escribir por correo';
      $('#hero-whatsapp').removeAttribute('target');
    } else {
      $('#hero-whatsapp').hidden = true;
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
  if (negocio.instagram) {
    $('#footer-instagram').href = negocio.instagram;
    $('#footer-instagram').textContent = 'Instagram';
  } else { $('#footer-instagram').hidden = true; }

  // Sin dirección publicada no se dibuja un mapa vacío.
  if (negocio.direccion) {
    const link = $('#map-link');
    link.hidden = false;
    link.href = negocio.mapa || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${negocio.direccion}, ${negocio.comuna || 'Chile'}`)}`;
    const mapHost = $('#map-embed');
    const frame = document.createElement('iframe');
    frame.src = negocio.mapaEmbed || `https://www.google.com/maps?q=${encodeURIComponent(`${negocio.direccion}, ${negocio.comuna || 'Chile'}`)}&output=embed`;
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.title = `Ubicación de ${negocio.nombre} en el mapa`;
    frame.allowFullscreen = true;
    mapHost.append(frame);
    mapHost.hidden = false;
  }

  buildList('[data-list="incluye"]', operacion.incluye || [],
    (item) => Object.assign(document.createElement('li'), { textContent: item }));
  buildList('[data-list="incluyeChips"]', operacion.incluye || [],
    (item) => Object.assign(document.createElement('span'), { className: 'amenity', textContent: item }));
  buildList('[data-list="contactoDirecto"]', config.contactoDirecto || [],
    (item) => Object.assign(document.createElement('li'), { textContent: item }));
  buildList('[data-list="reglas"]', config.reglas?.notas || [],
    (note) => Object.assign(document.createElement('li'), { textContent: note }));

  // Horario semanal, en el orden en que la gente lo lee (lunes primero).
  buildList('#hours-list', DIAS.slice(1).concat(DIAS[0]), (clave) => {
    const dia = config.horario.semana[clave];
    const item = document.createElement('li');
    item.append(
      Object.assign(document.createElement('span'), { textContent: DIAS_ROTULO[clave] }),
      Object.assign(document.createElement('strong'), { textContent: dia ? `${dia.apertura} – ${dia.cierre}` : 'Cerrado' })
    );
    if (!dia) item.className = 'closed';
    return item;
  });

  buildList('[data-list="pasos"]', [
    'Eliges servicio, día y bloque; la página sólo ofrece bloques dentro del horario.',
    'Envías la solicitud por WhatsApp con todo escrito.',
    'El equipo revisa su agenda y confirma, o te propone la hora más cercana.',
    'Pagas en el local, al terminar el servicio.'
  ], (paso) => Object.assign(document.createElement('li'), { textContent: paso }));

  buildList('[data-list="servicios"]', config.servicios, (service) => {
    const card = document.createElement('article');
    card.className = 'unit-card';
    card.append(Object.assign(document.createElement('h3'), { textContent: service.nombre }));
    if (service.detalle) {
      card.append(Object.assign(document.createElement('p'), { className: 'unit-detail', textContent: service.detalle }));
    }
    card.append(Object.assign(document.createElement('p'), {
      className: 'unit-cap', textContent: duracionTexto(service.duracionMinutos)
    }));
    card.append(Object.assign(document.createElement('p'), {
      className: 'unit-from',
      textContent: service.precio === null || service.precio === undefined ? 'Valor a consultar' : money(service.precio)
    }));
    const pick = document.createElement('button');
    pick.type = 'button';
    pick.className = 'button ghost small';
    pick.textContent = 'Pedir hora';
    pick.addEventListener('click', () => {
      $('#servicio').value = service.id;
      seleccionarServicio();
      $('#reservar').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    card.append(pick);
    return card;
  });

  // Equipo: sin profesionales en el config la sección no aparece.
  const pros = config.profesionales || [];
  if (pros.length) {
    $('#team').hidden = false;
    buildList('[data-list="profesionales"]', pros, (pro) => {
      const card = document.createElement('article');
      card.className = 'team-card';
      card.append(Object.assign(document.createElement('h3'), { textContent: pro.nombre }));
      const nombres = pro.servicios?.length
        ? pro.servicios.map((id) => findService(id).nombre).join(', ')
        : 'Todos los servicios';
      card.append(Object.assign(document.createElement('p'), { textContent: nombres }));
      return card;
    });
  }

  buildList('[data-list="faq"]', config.faq || [], (entry) => {
    const item = document.createElement('details');
    item.className = 'faq-item';
    item.append(
      Object.assign(document.createElement('summary'), { textContent: entry.pregunta }),
      Object.assign(document.createElement('p'), { textContent: entry.respuesta })
    );
    return item;
  });

  const servicio = $('#servicio');
  config.servicios.forEach((service) => {
    const precio = service.precio === null || service.precio === undefined ? 'consultar' : money(service.precio);
    servicio.append(new Option(`${service.nombre} · ${duracionTexto(service.duracionMinutos)} · ${precio}`, service.id));
  });

  // No permitir fechas pasadas, y partir en el primer día con bloques.
  $('#fecha').min = todayIso();
  $('#fecha').value = primerDiaDisponible(findService(servicio.value));

  servicio.addEventListener('change', seleccionarServicio);
  $('#profesional').addEventListener('change', renderQuote);
  $('#fecha').addEventListener('input', renderBloques);

  seleccionarServicio();
}

function seleccionarServicio() {
  const service = findService($('#servicio').value);
  renderServicePanel(service);
  renderProfesionales(service);
  renderBloques();
}

boot();
