/* Página de solicitud de cotización de evento. Reutilizable: toda la
   información específica del cliente vive en config.js.

   Decisión de diseño: esto NO reserva la fecha ni cobra. Arma una solicitud
   completa —fecha, servicio, invitados, presupuesto estimado y abono— que el
   equipo confirma a mano igual que hoy. Así no hay agenda que sincronizar, no
   hay riesgo de comprometer dos eventos el mismo día y no se necesita pasarela
   de pago.

   Lo que sí resuelve, y es el argumento de venta: hoy cada servicio se cotiza
   descargando un PDF distinto, con mínimos, abonos y plazos que no coinciden
   entre sí. Aquí eso vive en un solo lugar y se calcula solo. */

const config = window.EVENTO_CONFIG;

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const money = (value) => clp.format(Math.round(value));

// Fechas en UTC para que el día no se corra por zona horaria.
const toDay = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};
const DAY_MS = 86400000;
const todayIso = () => new Date().toISOString().slice(0, 10);
const longDate = (isoDate) => new Date(toDay(isoDate)).toLocaleDateString('es-CL', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
});

const $ = (selector) => document.querySelector(selector);
const setText = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };

// ── Reglas de calendario ───────────────────────────────────────────────────

// Días hábiles entre hoy y la fecha del evento, sin contar el día del evento.
// Sólo descuenta sábados y domingos: los feriados chilenos no están modelados,
// así que el aviso se redacta como "quedan aproximadamente" y nunca bloquea.
function businessDaysUntil(isoDate) {
  let count = 0;
  for (let day = toDay(todayIso()) + DAY_MS; day < toDay(isoDate); day += DAY_MS) {
    const weekday = new Date(day).getUTCDay();
    if (weekday !== 0 && weekday !== 6) count += 1;
  }
  return count;
}

// Fechas comprometidas, escritas a mano por el cliente. Acepta un día suelto
// { fecha } o un rango { desde, hasta }.
function fechaTomada(isoDate) {
  const day = toDay(isoDate);
  return (config.fechasTomadas || []).find((entry) => {
    if (entry.fecha) return day === toDay(entry.fecha);
    return entry.desde && entry.hasta && day >= toDay(entry.desde) && day <= toDay(entry.hasta);
  }) || null;
}

// Tarifa rotulada con un año anterior al actual: se avisa, no se corrige sola.
// Es el defecto que trajo a este cliente, y el aviso desaparece cuando entrega
// sus valores vigentes y se actualiza el rótulo en config.js.
function tarifaVencida(service) {
  const rotulo = service.documento?.rotulo;
  const tienePrecio = service.opciones.some((option) => option.valorPorInvitado !== null);
  if (!tienePrecio) return null;
  if (!rotulo) return { rotulo: null, motivo: 'sin año declarado' };
  return Number(rotulo) < new Date().getFullYear() ? { rotulo, motivo: 'año anterior' } : null;
}

// ── Cálculo ────────────────────────────────────────────────────────────────

const findService = (id) => config.servicios.find((service) => service.id === id);
const findOption = (service, id) => service.opciones.find((option) => option.id === id) || service.opciones[0];

function extrasSeleccionados() {
  return [...document.querySelectorAll('#extras-list input:checked')]
    .map((input) => (config.adicionales || []).find((extra) => extra.id === input.value))
    .filter(Boolean);
}

function quote(form) {
  const service = findService(form.servicio);
  const option = findOption(service, form.opcion);

  if (!form.fecha) return { error: 'Elige la fecha del evento para ver el presupuesto.' };

  const tomada = fechaTomada(form.fecha);
  if (tomada) {
    return { error: `${tomada.nota || 'Esa fecha ya está comprometida'}. Prueba otra fecha o escríbenos para consultar por una liberación.` };
  }

  if (!Number.isFinite(form.invitados) || form.invitados < 1) {
    return { error: 'Indica cuántos invitados esperas.' };
  }
  if (form.invitados < service.minimoInvitados) {
    return {
      error: `${service.nombre} se contrata desde ${service.minimoInvitados} personas y vas en ${form.invitados}. Elige otro servicio o escríbenos para revisarlo.`
    };
  }

  // Montos sin IVA y montos que ya lo incluyen se acumulan por separado: sólo
  // los primeros pagan el impuesto.
  const rows = [];
  let neto = 0;
  let conIva = 0;
  let sinValorPublicado = false;

  if (option.valorPorInvitado === null) {
    sinValorPublicado = true;
  } else {
    const monto = option.valorPorInvitado * form.invitados;
    rows.push({
      label: `${service.nombre}${service.opciones.length > 1 ? ` · ${option.nombre}` : ''} · ${form.invitados} × ${money(option.valorPorInvitado)}`,
      amount: monto
    });
    if (option.ivaIncluido) conIva += monto; else neto += monto;
  }

  const extras = extrasSeleccionados();
  for (const extra of extras) {
    if (extra.precio === null || extra.precio === undefined) {
      sinValorPublicado = true;
      rows.push({ label: extra.nombre, amount: null });
      continue;
    }
    const monto = extra.unidad === 'invitado' ? extra.precio * form.invitados : extra.precio;
    rows.push({
      label: extra.unidad === 'invitado' ? `${extra.nombre} · ${form.invitados} × ${money(extra.precio)}` : extra.nombre,
      amount: monto
    });
    if (extra.ivaIncluido) conIva += monto; else neto += monto;
  }

  const hayMonto = neto > 0 || conIva > 0;
  const ivaTasa = config.impuestos?.iva || 0;
  const iva = Math.round(neto * (ivaTasa / 100));
  const total = hayMonto ? neto + conIva + iva : null;
  const abono = (total !== null && service.abono?.porcentaje)
    ? total * (service.abono.porcentaje / 100)
    : null;

  // El plazo de abono es una regla real del cliente, no un invento del sitio.
  // Se informa; no se bloquea, porque el equipo puede aceptar una excepción.
  let avisoPlazo = null;
  if (service.abono?.plazoHabiles) {
    const habiles = businessDaysUntil(form.fecha);
    if (habiles < service.abono.plazoHabiles) {
      avisoPlazo = `Este servicio pide el abono ${service.abono.plazoHabiles} días hábiles antes del evento y para esa fecha quedan aproximadamente ${habiles}. Confirma disponibilidad antes de contar con ella.`;
    }
  }

  return {
    service, option, invitados: form.invitados, rows,
    neto, conIva, iva, ivaTasa, total, abono, extras,
    avisoPlazo,
    vencida: tarifaVencida(service),
    mensajeSinValor: sinValorPublicado
      ? (hayMonto
        ? 'Algunos ítems no tienen valor publicado: ese tramo lo confirma el equipo al responder.'
        : 'El valor por persona de este servicio no está publicado. El equipo te confirma el presupuesto al responder.')
      : null
  };
}

// ── Mensaje de solicitud ───────────────────────────────────────────────────

function buildMessage(result, form) {
  const lines = [
    `Hola ${config.negocio.nombre}, quiero cotizar un evento:`,
    '',
    `Tipo de evento: ${form.tipoEvento}`,
    `Fecha: ${longDate(form.fecha)}`,
    `Hora de inicio: ${form.hora}`,
    `Invitados: ${result.invitados}`,
    `Servicio: ${result.service.nombre}${result.service.opciones.length > 1 ? ` · ${result.option.nombre}` : ''}`
  ];
  if (result.extras.length) {
    lines.push(`Adicionales: ${result.extras.map((extra) => extra.nombre).join(', ')}`);
  }
  if (result.total !== null) {
    lines.push('', `Presupuesto estimado según su cotización publicada: ${money(result.total)} IVA incluido`);
    if (result.abono !== null) {
      const plazo = result.service.abono.plazoHabiles
        ? `, ${result.service.abono.plazoHabiles} días hábiles antes`
        : '';
      lines.push(`Abono para reservar la fecha (${result.service.abono.porcentaje}%${plazo}): ${money(result.abono)}`);
    }
    if (result.vencida) {
      lines.push(`Nota: tomé el valor de la cotización rotulada ${result.vencida.rotulo || 'sin año'}; agradezco confirmar si sigue vigente.`);
    }
  }
  if (result.mensajeSinValor) lines.push('', result.mensajeSinValor);
  lines.push('', '¿Tienen disponibilidad para esa fecha?');
  return lines.join('\n');
}

// ── Render del resultado ───────────────────────────────────────────────────

function leerFormulario() {
  return {
    fecha: $('#fecha').value,
    hora: $('#hora').value,
    tipoEvento: $('#tipo-evento').value,
    invitados: Number($('#invitados').value),
    servicio: $('#servicio').value,
    opcion: $('#opcion').value
  };
}

function renderQuote() {
  const form = leerFormulario();
  const box = $('#quote-result');
  const whatsapp = $('#request-whatsapp');
  const email = $('#request-email');
  const ocultarBotones = () => { whatsapp.hidden = true; email.hidden = true; };

  const result = quote(form);
  box.replaceChildren();

  if (result.error) {
    box.append(Object.assign(document.createElement('p'), { className: 'quote-error', textContent: result.error }));
    ocultarBotones();
    return;
  }

  const summary = document.createElement('p');
  summary.className = 'quote-summary';
  summary.textContent = `${longDate(form.fecha)} · ${result.invitados} invitados · ${result.service.nombre}`;
  box.append(summary);

  if (result.total !== null) {
    const rows = document.createElement('dl');
    rows.className = 'quote-rows';
    result.rows.forEach((row) => {
      rows.append(
        Object.assign(document.createElement('dt'), { textContent: row.label }),
        Object.assign(document.createElement('dd'), { textContent: row.amount === null ? 'a confirmar' : money(row.amount) })
      );
    });
    if (result.iva > 0) {
      rows.append(
        Object.assign(document.createElement('dt'), { textContent: `IVA ${result.ivaTasa}%` }),
        Object.assign(document.createElement('dd'), { textContent: money(result.iva) })
      );
    }
    box.append(rows);

    const total = document.createElement('p');
    total.className = 'quote-total';
    total.append(
      Object.assign(document.createElement('span'), { textContent: 'Presupuesto estimado' }),
      Object.assign(document.createElement('strong'), { textContent: money(result.total) })
    );
    box.append(total);

    if (result.abono !== null) {
      const plazo = result.service.abono.plazoHabiles
        ? ` · ${result.service.abono.plazoHabiles} días hábiles antes`
        : '';
      box.append(Object.assign(document.createElement('p'), {
        className: 'quote-deposit',
        textContent: `Abono para reservar la fecha (${result.service.abono.porcentaje}%${plazo}): ${money(result.abono)}`
      }));
    }
  }

  [result.mensajeSinValor, result.avisoPlazo].filter(Boolean).forEach((texto) => {
    box.append(Object.assign(document.createElement('p'), { className: 'quote-flag', textContent: texto }));
  });

  const text = buildMessage(result, form);
  const hostPreview = $('#host-preview');
  if (hostPreview) hostPreview.textContent = text;

  const asunto = `Cotización de ${result.service.nombre.toLowerCase()} · ${longDate(form.fecha)}`;
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

// ── Panel lateral del servicio elegido ─────────────────────────────────────

function renderServicePanel(service) {
  setText('#service-title', service.nombre);
  setText('#service-summary', service.resumen || '');

  const conPrecio = service.opciones.filter((option) => option.valorPorInvitado !== null);
  buildList('#option-list', conPrecio, (option) => {
    const item = document.createElement('li');
    item.append(
      Object.assign(document.createElement('span'), {
        textContent: service.opciones.length > 1 ? option.nombre : 'Valor por persona'
      }),
      Object.assign(document.createElement('strong'), {
        textContent: `${money(option.valorPorInvitado)}${option.ivaIncluido ? '' : ' + IVA'}`
      })
    );
    return item;
  });
  $('#rates-empty').hidden = conPrecio.length > 0;

  const vencida = tarifaVencida(service);
  const aviso = $('#rates-stale');
  aviso.hidden = !vencida;
  if (vencida) {
    aviso.textContent = vencida.rotulo
      ? `Valores publicados en la cotización rotulada ${vencida.rotulo}. Por confirmar antes de comprometerlos.`
      : 'La cotización publicada no declara el año de vigencia de estos valores. Por confirmar.';
  }

  const deposit = $('#deposit-card');
  deposit.replaceChildren();
  if (service.abono?.porcentaje) {
    deposit.append(Object.assign(document.createElement('strong'), {
      textContent: `Reserva de fecha: ${service.abono.porcentaje}% de abono`
    }));
    deposit.append(Object.assign(document.createElement('span'), {
      textContent: service.abono.plazoHabiles
        ? `Debe estar pagado ${service.abono.plazoHabiles} días hábiles antes del evento.`
        : 'El saldo se paga una vez realizado el servicio.'
    }));
  }
}

function renderOptions(service) {
  const select = $('#opcion');
  select.replaceChildren();
  service.opciones.forEach((option) => {
    const etiqueta = option.valorPorInvitado === null
      ? `${option.nombre} · valor a confirmar`
      : `${option.nombre} · ${money(option.valorPorInvitado)} por persona${option.ivaIncluido ? '' : ' + IVA'}`;
    select.append(new Option(etiqueta, option.id));
  });
  // Un solo menú no merece un selector: se oculta y se usa el único que hay.
  $('#option-field').hidden = service.opciones.length < 2;
}

// ── Construcción de la página desde config ─────────────────────────────────

function buildList(selector, items, render) {
  const host = $(selector);
  if (!host) return;
  host.replaceChildren(...items.map(render));
}

function boot() {
  const { negocio, operacion, marca, demo } = config;

  document.title = `${negocio.nombre} · Cotiza tu evento`;
  document.documentElement.style.setProperty('--tinta', marca.tinta);
  document.documentElement.style.setProperty('--acento', marca.acento);
  document.documentElement.style.setProperty('--papel', marca.papel);

  if (demo?.activo) {
    const banner = $('#demo-banner');
    banner.hidden = false;
    banner.textContent = demo.aviso;
    $('#host-panel').hidden = false;
    setText('#footer-source', `Muestra construida con información publicada en ${demo.fuente} y en sus PDF de cotización, leídos el ${demo.leidoEl}. Valores y reglas por confirmar con el cliente.`);
  }

  setText('[data-field="comuna"]', negocio.comuna);
  setText('[data-field="nombre"]', negocio.nombre);
  setText('[data-field="bajada"]', negocio.bajada);
  setText('[data-field="operacionTitular"]', operacion.titular);
  setText('[data-field="operacionDescripcion"]', operacion.descripcion);
  setText('[data-field="cobertura"]', negocio.cobertura || negocio.comuna);
  setText('[data-field="nombreFooter"]', negocio.nombre);
  setText('[data-field="responsableFooter"]', [negocio.responsable, negocio.cobertura].filter(Boolean).join(' · '));

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

  // Sin dirección publicada no se dibuja un mapa vacío: la sección se queda
  // con la cobertura, que es el dato que este negocio sí publica.
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

  // Los pasos de reserva se arman con los abonos reales de los servicios, para
  // que no queden dos versiones distintas de la misma regla en el config.
  const porcentajes = [...new Set(config.servicios.map((service) => service.abono?.porcentaje).filter(Boolean))].sort((a, b) => a - b);
  const abonoTexto = porcentajes.length > 1
    ? `Pagas el abono (${porcentajes.join('% o ')}% según el servicio) y la fecha queda reservada.`
    : `Pagas el abono (${porcentajes[0]}%) y la fecha queda reservada.`;
  buildList('[data-list="pasos"]', [
    'Envías la solicitud con fecha, servicio y número de invitados.',
    'El equipo confirma disponibilidad y el valor final.',
    abonoTexto,
    'El saldo se paga una vez realizado el servicio.'
  ], (paso) => Object.assign(document.createElement('li'), { textContent: paso }));

  buildList('[data-list="servicios"]', config.servicios, (service) => {
    const card = document.createElement('article');
    card.className = 'unit-card';
    card.append(Object.assign(document.createElement('h3'), { textContent: service.nombre }));
    if (service.resumen) {
      card.append(Object.assign(document.createElement('p'), { className: 'unit-detail', textContent: service.resumen }));
    }
    card.append(Object.assign(document.createElement('p'), {
      className: 'unit-cap', textContent: `Desde ${service.minimoInvitados} personas`
    }));
    const conPrecio = service.opciones.filter((option) => option.valorPorInvitado !== null);
    card.append(Object.assign(document.createElement('p'), {
      className: 'unit-from',
      textContent: conPrecio.length
        ? `Desde ${money(Math.min(...conPrecio.map((option) => option.valorPorInvitado)))} por persona`
        : 'Valor por persona a confirmar'
    }));
    const pick = document.createElement('button');
    pick.type = 'button';
    pick.className = 'button ghost small';
    pick.textContent = 'Cotizar este servicio';
    pick.addEventListener('click', () => {
      $('#servicio').value = service.id;
      seleccionarServicio();
      $('#cotizar').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    card.append(pick);
    return card;
  });

  buildList('[data-list="faq"]', config.faq || [], (entry) => {
    const item = document.createElement('details');
    item.className = 'faq-item';
    item.append(
      Object.assign(document.createElement('summary'), { textContent: entry.pregunta }),
      Object.assign(document.createElement('p'), { textContent: entry.respuesta })
    );
    return item;
  });

  // Adicionales: sin lista publicada la sección no aparece.
  const extras = config.adicionales || [];
  if (extras.length) {
    $('#extras').hidden = false;
    buildList('#extras-list', extras, (extra) => {
      const label = document.createElement('label');
      label.className = 'extra-item';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = extra.id;
      input.addEventListener('change', renderQuote);
      const texto = extra.precio === null || extra.precio === undefined
        ? `${extra.nombre} · a confirmar`
        : `${extra.nombre} · ${money(extra.precio)}${extra.unidad === 'invitado' ? ' por persona' : ''}`;
      label.append(input, Object.assign(document.createElement('span'), { textContent: texto }));
      if (extra.nota) label.append(Object.assign(document.createElement('small'), { textContent: extra.nota }));
      return label;
    });
  }

  const tipoEvento = $('#tipo-evento');
  (operacion.tiposEvento || ['Evento']).forEach((tipo) => tipoEvento.append(new Option(tipo, tipo)));

  const servicio = $('#servicio');
  config.servicios.forEach((service) => servicio.append(new Option(service.nombre, service.id)));

  // No permitir fechas pasadas.
  $('#fecha').min = todayIso();

  ['#fecha', '#hora', '#tipo-evento', '#invitados'].forEach((selector) =>
    $(selector).addEventListener('input', renderQuote));
  servicio.addEventListener('change', seleccionarServicio);
  $('#opcion').addEventListener('change', renderQuote);

  seleccionarServicio();
}

function seleccionarServicio() {
  const service = findService($('#servicio').value);
  renderOptions(service);
  renderServicePanel(service);
  renderQuote();
}

boot();
