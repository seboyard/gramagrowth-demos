/* Página de solicitud de visita técnica para instaladores: ventanas,
   termopaneles, aislación, fachadas. Reutilizable: toda la información
   específica del cliente vive en config.js.

   Decisión de diseño: esto NO entrega un precio. Entrega un ALCANCE MEDIDO
   —cada vano con su ancho, alto y cantidad, y los m² sumados— y, sólo si el
   negocio publicó valores por m², un rango estimado. El número final lo pone
   el instalador después de medir en terreno, que es como funciona el rubro.

   Lo que sí resuelve, y es el argumento de venta: hoy el formulario pide
   "describe tu proyecto" y llega "quiero cotizar ventanas". Con eso nadie puede
   decidir si vale la pena mandar una camioneta a medir. Aquí la consulta llega
   con las medidas puestas. */

const config = window.INSTALACION_CONFIG;

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const money = (value) => clp.format(Math.round(value));
// Superficies con dos decimales y coma, como se leen en una cotización chilena.
const m2fmt = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const area = (value) => `${m2fmt.format(value)} m²`;

const $ = (selector) => document.querySelector(selector);
const setText = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };

// ── Vanos ──────────────────────────────────────────────────────────────────

// Estado de los vanos cargados. Es lo único que la página recuerda, y sólo
// mientras está abierta: no se guarda nada en ningún lado.
let vanos = [];
let nextVanoId = 1;

// Un vano nuevo arranca vacío de medidas, con nombre sugerido por orden. La
// medida la tiene que poner la persona; poner una por defecto sería inventar.
function nuevoVano() {
  return { id: nextVanoId++, ubicacion: '', ancho: null, alto: null, cantidad: 1, apertura: config.aperturas?.[0] || '' };
}

// Superficie de un vano en m². Con una medida faltante devuelve null: la fila
// se muestra "sin medida" y no suma, en vez de sumar cero como si midiera cero.
function areaVano(vano) {
  if (!Number.isFinite(vano.ancho) || !Number.isFinite(vano.alto) || vano.ancho <= 0 || vano.alto <= 0) return null;
  const unitario = (vano.ancho / 100) * (vano.alto / 100);
  const minimo = config.minimoM2PorVano;
  const facturable = Number.isFinite(minimo) && minimo > unitario ? minimo : unitario;
  return { real: unitario * vano.cantidad, facturable: facturable * vano.cantidad, minimoAplicado: facturable !== unitario };
}

function renderVanos() {
  const host = $('#vanos-list');
  host.replaceChildren(...vanos.map((vano, index) => {
    const row = document.createElement('div');
    row.className = 'vano-row';

    const head = document.createElement('div');
    head.className = 'vano-head';
    head.append(Object.assign(document.createElement('strong'), { textContent: `Vano ${index + 1}` }));
    const superficie = areaVano(vano);
    head.append(Object.assign(document.createElement('span'), {
      className: 'vano-area',
      textContent: superficie ? area(superficie.real) : 'sin medida'
    }));
    if (vanos.length > 1) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'vano-remove';
      remove.textContent = 'Quitar';
      remove.setAttribute('aria-label', `Quitar vano ${index + 1}`);
      remove.addEventListener('click', () => { vanos = vanos.filter((entry) => entry.id !== vano.id); renderVanos(); renderQuote(); });
      head.append(remove);
    }
    row.append(head);

    const grid = document.createElement('div');
    grid.className = 'vano-grid';

    const field = (label, input) => {
      const wrap = document.createElement('label');
      wrap.append(document.createTextNode(label), input);
      return wrap;
    };
    // fallback: valor que toma el campo cuando queda vacío o inválido. Las
    // medidas caen a null (no suman); la cantidad cae a 1 (una pieza).
    const number = (key, min, step, fallback = null) => {
      const input = document.createElement('input');
      input.type = 'number'; input.min = String(min); input.step = String(step); input.inputMode = 'decimal';
      if (vano[key] !== null && vano[key] !== undefined) input.value = String(vano[key]);
      input.addEventListener('input', () => {
        const value = Number(input.value);
        vano[key] = input.value === '' || !Number.isFinite(value) || value < min ? fallback : value;
        head.querySelector('.vano-area').textContent = areaVano(vano) ? area(areaVano(vano).real) : 'sin medida';
        renderQuote();
      });
      return input;
    };

    const ubicacion = document.createElement('input');
    ubicacion.type = 'text'; ubicacion.maxLength = 40; ubicacion.placeholder = 'Living, dormitorio, baño…';
    ubicacion.value = vano.ubicacion;
    ubicacion.addEventListener('input', () => { vano.ubicacion = ubicacion.value.trim(); renderQuote(); });

    const apertura = document.createElement('select');
    (config.aperturas || []).forEach((tipo) => apertura.append(new Option(tipo, tipo)));
    apertura.value = vano.apertura;
    apertura.addEventListener('change', () => { vano.apertura = apertura.value; renderQuote(); });

    grid.append(
      field('Ubicación', ubicacion),
      field('Ancho (cm)', number('ancho', 1, 1)),
      field('Alto (cm)', number('alto', 1, 1)),
      field('Cantidad', number('cantidad', 1, 1, 1)),
      field('Apertura', apertura)
    );
    row.append(grid);
    return row;
  }));
}

// ── Valores publicados ─────────────────────────────────────────────────────

const findTrabajo = (id) => config.trabajos.find((trabajo) => trabajo.id === id);
const findMaterial = (trabajo, id) => trabajo.materiales.find((material) => material.id === id) || trabajo.materiales[0];
const tieneRango = (material) => material.valorM2 && Number.isFinite(material.valorM2.desde) && Number.isFinite(material.valorM2.hasta);

// Valor rotulado con un año anterior al actual: se avisa, no se corrige solo.
// El aviso desaparece cuando el cliente entrega valores vigentes y se actualiza
// el rótulo en config.js.
function valorVencido(material) {
  if (!tieneRango(material)) return null;
  const rotulo = material.referencia?.rotulo;
  if (!rotulo) return { rotulo: null, motivo: 'sin año declarado' };
  return Number(rotulo) < new Date().getFullYear() ? { rotulo, motivo: 'año anterior' } : null;
}

function extrasSeleccionados() {
  return [...document.querySelectorAll('#extras-list input:checked')]
    .map((input) => (config.adicionales || []).find((extra) => extra.id === input.value))
    .filter(Boolean);
}

// ── Cálculo ────────────────────────────────────────────────────────────────

function quote(form) {
  const trabajo = findTrabajo(form.trabajo);
  const material = findMaterial(trabajo, form.material);
  const porVano = trabajo.medida === 'vano';

  // Alcance medido: es el resultado principal, con o sin precio.
  let m2Real = 0;
  let m2Facturable = 0;
  let piezas = 0;
  let sinMedida = 0;
  let minimoAplicado = false;
  const detalle = [];

  if (porVano) {
    vanos.forEach((vano, index) => {
      const superficie = areaVano(vano);
      if (!superficie) { sinMedida += 1; return; }
      m2Real += superficie.real;
      m2Facturable += superficie.facturable;
      piezas += vano.cantidad;
      minimoAplicado = minimoAplicado || superficie.minimoAplicado;
      detalle.push({
        indice: index + 1,
        ubicacion: vano.ubicacion,
        medida: `${vano.ancho} × ${vano.alto} cm`,
        apertura: vano.apertura,
        cantidad: vano.cantidad,
        area: superficie.real
      });
    });
    if (!detalle.length) {
      return { error: sinMedida ? 'Escribe el ancho y el alto de al menos un vano para ver los metros cuadrados.' : 'Agrega al menos un vano.' };
    }
  } else {
    if (!Number.isFinite(form.m2) || form.m2 <= 0) return { error: 'Indica cuántos metros cuadrados quieres intervenir.' };
    m2Real = form.m2;
    m2Facturable = form.m2;
  }

  // Rango estimado: sólo si el negocio publicó valores. Montos sin IVA y con
  // IVA se acumulan por separado para que sólo los primeros paguen impuesto.
  const rows = [];
  let netoDesde = 0, netoHasta = 0, conIvaDesde = 0, conIvaHasta = 0;
  let sinValorPublicado = false;

  if (tieneRango(material)) {
    const desde = material.valorM2.desde * m2Facturable;
    const hasta = material.valorM2.hasta * m2Facturable;
    rows.push({
      label: `${trabajo.nombre} · ${material.nombre} · ${area(m2Facturable)} × ${money(material.valorM2.desde)}–${money(material.valorM2.hasta)}`,
      desde, hasta
    });
    if (material.ivaIncluido) { conIvaDesde += desde; conIvaHasta += hasta; } else { netoDesde += desde; netoHasta += hasta; }
  } else {
    sinValorPublicado = true;
  }

  const extras = extrasSeleccionados();
  for (const extra of extras) {
    if (!Number.isFinite(extra.valor)) { sinValorPublicado = true; rows.push({ label: extra.nombre, desde: null, hasta: null }); continue; }
    const factor = extra.unidad === 'm2' ? m2Facturable : extra.unidad === 'vano' ? piezas : 1;
    const monto = extra.valor * factor;
    rows.push({
      label: extra.unidad === 'm2' ? `${extra.nombre} · ${area(m2Facturable)} × ${money(extra.valor)}`
        : extra.unidad === 'vano' ? `${extra.nombre} · ${piezas} × ${money(extra.valor)}`
          : extra.nombre,
      desde: monto, hasta: monto
    });
    if (extra.ivaIncluido) { conIvaDesde += monto; conIvaHasta += monto; } else { netoDesde += monto; netoHasta += monto; }
  }

  const hayMonto = netoHasta > 0 || conIvaHasta > 0;
  const ivaTasa = config.impuestos?.iva || 0;
  const ivaDesde = Math.round(netoDesde * (ivaTasa / 100));
  const ivaHasta = Math.round(netoHasta * (ivaTasa / 100));
  const totalDesde = hayMonto ? netoDesde + conIvaDesde + ivaDesde : null;
  const totalHasta = hayMonto ? netoHasta + conIvaHasta + ivaHasta : null;

  // Cobertura: se avisa, no se bloquea. El equipo puede aceptar una excepción.
  let avisoCobertura = null;
  const comunas = config.cobertura?.comunas;
  if (Array.isArray(comunas) && comunas.length && form.comuna && !comunas.includes(form.comuna)) {
    avisoCobertura = `${form.comuna} no está en la lista de comunas publicadas. Envía igual la solicitud y el equipo te confirma si llegan y con qué traslado.`;
  }

  return {
    trabajo, material, porVano, detalle, piezas, sinMedida, minimoAplicado,
    m2Real, m2Facturable, rows, extras,
    ivaDesde, ivaHasta, ivaTasa, totalDesde, totalHasta,
    avisoCobertura,
    vencido: valorVencido(material),
    mensajeSinValor: sinValorPublicado
      ? (hayMonto
        ? 'Algunos ítems no tienen valor publicado: ese tramo lo confirma el equipo en la visita.'
        : 'Este negocio no publica valores por metro cuadrado. El equipo confirma el presupuesto después de la visita técnica.')
      : null
  };
}

// ── Mensaje de solicitud ───────────────────────────────────────────────────

function buildMessage(result, form) {
  const lines = [
    `Hola ${config.negocio.nombre}, quiero pedir una visita técnica para cotizar:`,
    '',
    `Trabajo: ${result.trabajo.nombre}${result.trabajo.materiales.length > 1 ? ` · ${result.material.nombre}` : ''}`,
    `Tipo de proyecto: ${form.tipoProyecto}`
  ];
  if (form.comuna) lines.push(`Comuna: ${form.comuna}`);

  if (result.porVano) {
    lines.push('', 'Vanos medidos por mí (referenciales):');
    result.detalle.forEach((vano) => {
      const nombre = vano.ubicacion ? `${vano.ubicacion} · ` : '';
      const unidades = vano.cantidad > 1 ? ` · ${vano.cantidad} unidades` : '';
      lines.push(`${vano.indice}) ${nombre}${vano.medida} · ${vano.apertura.toLowerCase()}${unidades} · ${area(vano.area)}`);
    });
    lines.push(`Total: ${area(result.m2Real)} en ${result.piezas} ${result.piezas === 1 ? 'pieza' : 'piezas'}`);
    if (result.sinMedida) lines.push(`(${result.sinMedida} vano${result.sinMedida > 1 ? 's' : ''} sin medida, para medir en la visita)`);
  } else {
    lines.push('', `Superficie aproximada: ${area(result.m2Real)}`);
  }

  if (result.extras.length) lines.push(`Adicionales: ${result.extras.map((extra) => extra.nombre).join(', ')}`);

  if (result.totalHasta !== null) {
    lines.push('', `Rango estimado según sus valores publicados: ${money(result.totalDesde)} – ${money(result.totalHasta)} IVA incluido`);
    if (result.minimoAplicado) lines.push(`(incluye el mínimo de ${area(config.minimoM2PorVano)} por pieza que publican)`);
    if (result.vencido) {
      lines.push(`Nota: tomé los valores rotulados ${result.vencido.rotulo || 'sin año'}; agradezco confirmar si siguen vigentes.`);
    }
  }
  if (result.mensajeSinValor) lines.push('', result.mensajeSinValor);
  lines.push('', '¿Cuándo podrían venir a medir?');
  return lines.join('\n');
}

// ── Render del resultado ───────────────────────────────────────────────────

function leerFormulario() {
  const comunaInput = $('#comuna-slot select, #comuna-slot input');
  return {
    trabajo: $('#trabajo').value,
    material: $('#material').value,
    tipoProyecto: $('#tipo-proyecto').value,
    comuna: comunaInput ? comunaInput.value.trim() : '',
    m2: Number($('#m2').value)
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

  // El alcance medido es el titular. Va antes que cualquier peso.
  const summary = document.createElement('p');
  summary.className = 'quote-summary';
  summary.textContent = result.porVano
    ? `${result.trabajo.nombre} · ${result.piezas} ${result.piezas === 1 ? 'pieza' : 'piezas'}`
    : result.trabajo.nombre;
  box.append(summary);

  const scope = document.createElement('p');
  scope.className = 'quote-total quote-scope';
  scope.append(
    Object.assign(document.createElement('span'), { textContent: 'Superficie medida' }),
    Object.assign(document.createElement('strong'), { textContent: area(result.m2Real) })
  );
  box.append(scope);

  if (result.porVano) {
    const list = document.createElement('ol');
    list.className = 'scope-list';
    result.detalle.forEach((vano) => {
      const item = document.createElement('li');
      const nombre = vano.ubicacion || `Vano ${vano.indice}`;
      const unidades = vano.cantidad > 1 ? ` · ${vano.cantidad} unidades` : '';
      item.append(
        Object.assign(document.createElement('span'), { textContent: `${nombre} · ${vano.medida} · ${vano.apertura.toLowerCase()}${unidades}` }),
        Object.assign(document.createElement('strong'), { textContent: area(vano.area) })
      );
      list.append(item);
    });
    box.append(list);
  }

  if (result.totalHasta !== null) {
    const rows = document.createElement('dl');
    rows.className = 'quote-rows';
    result.rows.forEach((row) => {
      rows.append(
        Object.assign(document.createElement('dt'), { textContent: row.label }),
        Object.assign(document.createElement('dd'), {
          textContent: row.hasta === null ? 'a confirmar'
            : row.desde === row.hasta ? money(row.hasta) : `${money(row.desde)} – ${money(row.hasta)}`
        })
      );
    });
    if (result.ivaHasta > 0) {
      rows.append(
        Object.assign(document.createElement('dt'), { textContent: `IVA ${result.ivaTasa}%` }),
        Object.assign(document.createElement('dd'), {
          textContent: result.ivaDesde === result.ivaHasta ? money(result.ivaHasta) : `${money(result.ivaDesde)} – ${money(result.ivaHasta)}`
        })
      );
    }
    box.append(rows);

    const total = document.createElement('p');
    total.className = 'quote-total';
    total.append(
      Object.assign(document.createElement('span'), { textContent: 'Rango estimado' }),
      Object.assign(document.createElement('strong'), { textContent: `${money(result.totalDesde)} – ${money(result.totalHasta)}` })
    );
    box.append(total);
    box.append(Object.assign(document.createElement('p'), {
      className: 'quote-deposit',
      textContent: 'Es un rango, no un presupuesto. El valor final se confirma después de medir en terreno.'
    }));
  }

  [result.mensajeSinValor, result.avisoCobertura,
    result.sinMedida ? `${result.sinMedida} vano${result.sinMedida > 1 ? 's' : ''} sin medida: no suma, pero va en la solicitud para medirlo en la visita.` : null
  ].filter(Boolean).forEach((texto) => {
    box.append(Object.assign(document.createElement('p'), { className: 'quote-flag', textContent: texto }));
  });

  const text = buildMessage(result, form);
  const hostPreview = $('#host-preview');
  if (hostPreview) hostPreview.textContent = text;

  const asunto = `Visita técnica · ${result.trabajo.nombre} · ${area(result.m2Real)}`;
  if (config.negocio.whatsapp) {
    whatsapp.hidden = false;
    whatsapp.href = `https://api.whatsapp.com/send?phone=${config.negocio.whatsapp}&text=${encodeURIComponent(text)}`;
  } else {
    whatsapp.hidden = true;
  }
  if (config.negocio.email) {
    email.hidden = false;
    email.className = config.negocio.whatsapp ? 'button ghost block' : 'button primary block';
    email.textContent = config.negocio.whatsapp ? 'Pedir visita técnica por correo' : 'Pedir visita técnica';
    email.href = `mailto:${config.negocio.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(text)}`;
  } else {
    email.hidden = true;
  }
}

// ── Panel lateral del trabajo elegido ──────────────────────────────────────

function renderWorkPanel(trabajo) {
  setText('#work-title', trabajo.nombre);
  setText('#work-summary', trabajo.resumen || '');

  const conRango = trabajo.materiales.filter(tieneRango);
  buildList('#material-list', conRango, (material) => {
    const item = document.createElement('li');
    item.append(
      Object.assign(document.createElement('span'), { textContent: trabajo.materiales.length > 1 ? material.nombre : 'Valor por m²' }),
      Object.assign(document.createElement('strong'), {
        textContent: `${money(material.valorM2.desde)} – ${money(material.valorM2.hasta)}${material.ivaIncluido ? '' : ' + IVA'}`
      })
    );
    return item;
  });
  $('#rates-empty').hidden = conRango.length > 0;

  // Si cualquier material del trabajo tiene valor vencido, se avisa una vez.
  const vencido = trabajo.materiales.map(valorVencido).find(Boolean);
  const aviso = $('#rates-stale');
  aviso.hidden = !vencido;
  if (vencido) {
    aviso.textContent = vencido.rotulo
      ? `Valores publicados con rótulo ${vencido.rotulo}. Por confirmar antes de comprometerlos.`
      : 'Los valores publicados no declaran año de vigencia. Por confirmar.';
  }

  const visit = $('#visit-card');
  visit.replaceChildren();
  const { visita } = config;
  if (visita && (visita.gratuita !== null || visita.respuestaHoras)) {
    visit.append(Object.assign(document.createElement('strong'), {
      textContent: visita.gratuita ? 'Visita técnica gratuita y sin compromiso' : 'Visita técnica a coordinar'
    }));
    if (visita.respuestaHoras) {
      visit.append(Object.assign(document.createElement('span'), {
        textContent: `El negocio compromete respuesta dentro de ${visita.respuestaHoras} horas.`
      }));
    }
  }
}

function renderMateriales(trabajo) {
  const select = $('#material');
  select.replaceChildren();
  trabajo.materiales.forEach((material) => {
    const etiqueta = tieneRango(material)
      ? `${material.nombre} · ${money(material.valorM2.desde)}–${money(material.valorM2.hasta)} por m²${material.ivaIncluido ? '' : ' + IVA'}`
      : material.nombre;
    select.append(new Option(etiqueta, material.id));
  });
  // Un solo material no merece un selector: se oculta y se usa el único que hay.
  $('#material-field').hidden = trabajo.materiales.length < 2;
}

// Alterna entre cargar vanos y cargar una superficie según el trabajo.
function renderModo(trabajo) {
  const porVano = trabajo.medida === 'vano';
  $('#vanos').hidden = !porVano;
  $('#superficie').hidden = porVano;
  if (porVano && !vanos.length) { vanos = [nuevoVano()]; renderVanos(); }
}

// ── Construcción de la página desde config ─────────────────────────────────

function buildList(selector, items, render) {
  const host = $(selector);
  if (!host) return;
  host.replaceChildren(...items.map(render));
}

function boot() {
  const { negocio, operacion, marca, demo } = config;

  document.title = `${negocio.nombre} · Cotiza tu instalación`;
  document.documentElement.style.setProperty('--tinta', marca.tinta);
  document.documentElement.style.setProperty('--acento', marca.acento);
  document.documentElement.style.setProperty('--papel', marca.papel);

  if (demo?.activo) {
    const banner = $('#demo-banner');
    banner.hidden = false;
    banner.textContent = demo.aviso;
    $('#host-panel').hidden = false;
    setText('#footer-source', `Muestra construida con información publicada en ${demo.fuente}, leída el ${demo.leidoEl}. Ese sitio no publica valores por m²; los rangos aparecen cuando el cliente los entrega.`);
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
  // Un solo número por enlace tel:. Es exactamente el defecto que tiene hoy el
  // sitio del prospecto de la muestra (dos números en un href).
  if (negocio.telefono) {
    $('#footer-phone').href = `tel:${negocio.telefono.replace(/\s/g, '')}`;
    $('#footer-phone').textContent = negocio.telefono;
  } else { $('#footer-phone').hidden = true; }
  if (negocio.email) {
    $('#footer-email').href = `mailto:${negocio.email}`;
    $('#footer-email').textContent = negocio.email;
  } else { $('#footer-email').hidden = true; }

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

  const visita = config.visita || {};
  buildList('[data-list="pasos"]', [
    'Envías la solicitud con tus medidas y la comuna.',
    visita.respuestaHoras
      ? `El equipo te responde dentro de ${visita.respuestaHoras} horas y coordina la visita técnica${visita.gratuita ? ', gratuita y sin compromiso' : ''}.`
      : `El equipo coordina la visita técnica${visita.gratuita ? ', gratuita y sin compromiso' : ''}.`,
    'En la visita se miden los vanos y se define perfil, color y apertura.',
    'Recibes el presupuesto formal y decides.'
  ], (paso) => Object.assign(document.createElement('li'), { textContent: paso }));

  buildList('[data-list="trabajos"]', config.trabajos, (trabajo) => {
    const card = document.createElement('article');
    card.className = 'unit-card';
    card.append(Object.assign(document.createElement('h3'), { textContent: trabajo.nombre }));
    if (trabajo.resumen) {
      card.append(Object.assign(document.createElement('p'), { className: 'unit-detail', textContent: trabajo.resumen }));
    }
    card.append(Object.assign(document.createElement('p'), {
      className: 'unit-cap',
      textContent: trabajo.medida === 'vano' ? 'Se cotiza vano por vano' : 'Se cotiza por superficie'
    }));
    const conRango = trabajo.materiales.filter(tieneRango);
    card.append(Object.assign(document.createElement('p'), {
      className: 'unit-from',
      textContent: conRango.length
        ? `Desde ${money(Math.min(...conRango.map((material) => material.valorM2.desde)))} por m²`
        : 'Valor por m² a confirmar en la visita'
    }));
    const pick = document.createElement('button');
    pick.type = 'button';
    pick.className = 'button ghost small';
    pick.textContent = 'Medir este trabajo';
    pick.addEventListener('click', () => {
      $('#trabajo').value = trabajo.id;
      seleccionarTrabajo();
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
      const unidad = extra.unidad === 'm2' ? ' por m²' : extra.unidad === 'vano' ? ' por pieza' : '';
      const texto = Number.isFinite(extra.valor)
        ? `${extra.nombre} · ${money(extra.valor)}${unidad}`
        : `${extra.nombre} · a confirmar`;
      label.append(input, Object.assign(document.createElement('span'), { textContent: texto }));
      if (extra.nota) label.append(Object.assign(document.createElement('small'), { textContent: extra.nota }));
      return label;
    });
  }

  const tipoProyecto = $('#tipo-proyecto');
  (operacion.tiposProyecto || ['Residencial']).forEach((tipo) => tipoProyecto.append(new Option(tipo, tipo)));
  tipoProyecto.addEventListener('change', renderQuote);

  // Comuna: selector si el cliente publica cobertura, texto libre si no. Así
  // la página nunca inventa hasta dónde llega el negocio.
  const comunaSlot = $('#comuna-slot');
  const comunas = config.cobertura?.comunas;
  const comunaInput = Array.isArray(comunas) && comunas.length ? document.createElement('select') : document.createElement('input');
  if (comunaInput.tagName === 'SELECT') {
    comunas.forEach((comuna) => comunaInput.append(new Option(comuna, comuna)));
    comunaInput.append(new Option('Otra comuna', 'Otra comuna'));
    comunaInput.addEventListener('change', renderQuote);
  } else {
    comunaInput.type = 'text'; comunaInput.maxLength = 40; comunaInput.placeholder = 'Valdivia';
    comunaInput.addEventListener('input', renderQuote);
  }
  comunaSlot.replaceChildren(comunaInput);

  const trabajo = $('#trabajo');
  config.trabajos.forEach((entry) => trabajo.append(new Option(entry.nombre, entry.id)));
  trabajo.addEventListener('change', seleccionarTrabajo);
  $('#material').addEventListener('change', renderQuote);
  $('#m2').addEventListener('input', renderQuote);
  $('#add-vano').addEventListener('click', () => {
    vanos.push(nuevoVano());
    renderVanos();
    renderQuote();
    const last = $('#vanos-list .vano-row:last-child input[type="text"]');
    if (last) last.focus();
  });

  seleccionarTrabajo();
}

function seleccionarTrabajo() {
  const trabajo = findTrabajo($('#trabajo').value);
  renderMateriales(trabajo);
  renderWorkPanel(trabajo);
  renderModo(trabajo);
  renderQuote();
}

boot();
