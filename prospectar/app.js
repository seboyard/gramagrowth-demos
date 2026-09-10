// Cola de prospección. Los datos viven en datos/prospectos.json a través de la API
// local; el navegador ya no guarda estado propio. No envía correos: sólo copia texto
// y abre borradores en el cliente de correo del sistema.

const statusLabels = {
  review: 'Por revisar', ready: 'Listo', contacted: 'Contactado',
  replied: 'Respondió', discarded: 'Descartado'
};

const list = document.querySelector('#prospect-list');
const detail = document.querySelector('#prospect-detail');
const template = document.querySelector('#detail-template');
const search = document.querySelector('#search');
const statusFilter = document.querySelector('#status-filter');
const segmentFilter = document.querySelector('#segment-filter');
const channelFilter = document.querySelector('#channel-filter');
const dataNote = document.querySelector('#data-note');

let prospects = [];
let selectedId = null;

const api = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `Error ${response.status}`);
  return payload;
};

const PRIORITY_RANK = { Alta: 0, Media: 1, Baja: 2 };

// Orden de trabajo: primero la prioridad que fijó Sebastián, y dentro de cada
// nivel el puntaje de auditoría, que es lo que hace fuerte al correo.
function byPriority(left, right) {
  const rank = (PRIORITY_RANK[left.priority] ?? 3) - (PRIORITY_RANK[right.priority] ?? 3);
  return rank !== 0 ? rank : (right.audit?.score || 0) - (left.audit?.score || 0);
}

const today = () => new Date().toISOString().slice(0, 10);
const formatDate = (value) => (value ? value.split('-').reverse().join('-') : '');

async function patchProspect(id, patch) {
  const updated = await api(`/prospectos/${id}`, { method: 'PATCH', body: patch });
  const index = prospects.findIndex((prospect) => prospect.id === id);
  prospects[index] = updated;
  renderList();
  updateSummary();
  return updated;
}

function filteredProspects() {
  const term = search.value.trim().toLocaleLowerCase('es');
  return prospects.filter((prospect) => {
    const matchesSearch = !term || `${prospect.business} ${prospect.segment}`.toLocaleLowerCase('es').includes(term);
    const matchesStatus = statusFilter.value === 'all' || prospect.status === statusFilter.value;
    const matchesSegment = segmentFilter.value === 'all' || prospect.segment === segmentFilter.value;
    const matchesChannel = channelFilter.value === 'all'
      || (channelFilter.value === 'email' && prospect.contact.type === 'email')
      || (channelFilter.value === 'phone' && prospect.contact.type !== 'email' && (prospect.audit?.meta?.phones || []).length)
      || (channelFilter.value === 'none' && prospect.contact.type !== 'email' && !(prospect.audit?.meta?.phones || []).length);
    return matchesSearch && matchesStatus && matchesSegment && matchesChannel;
  });
}

function renderList() {
  const visible = filteredProspects();
  list.replaceChildren();
  if (!visible.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-list';
    empty.textContent = prospects.length ? 'No hay prospectos con estos filtros.' : 'Aún no hay prospectos. Audita un sitio para empezar.';
    list.append(empty);
  }
  visible.forEach((prospect) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'prospect-item';
    button.dataset.id = prospect.id;
    button.setAttribute('aria-current', String(prospect.id === selectedId));

    const name = document.createElement('strong');
    name.textContent = prospect.business;
    const meta = document.createElement('span');
    meta.className = 'item-meta';
    const segment = document.createElement('span');
    segment.textContent = prospect.segment;
    const status = document.createElement('span');
    status.className = 'status-pill';
    status.dataset.status = prospect.status;
    status.textContent = statusLabels[prospect.status];
    meta.append(segment, status);

    if (prospect.audit) {
      const score = document.createElement('span');
      score.className = 'score-chip';
      score.textContent = prospect.audit.score;
      score.title = `${prospect.audit.signals.length} señales detectadas`;
      meta.append(score);
    }
    if (prospect.followUp && prospect.followUp <= today() && prospect.status === 'contacted') {
      const due = document.createElement('span');
      due.className = 'due-chip';
      due.textContent = 'seguir hoy';
      meta.append(due);
    }

    button.append(name, meta);
    button.addEventListener('click', () => {
      selectedId = prospect.id;
      renderList();
      renderDetail(prospect);
      if (window.innerWidth < 940) detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    list.append(button);
  });
  document.querySelector('#visible-count').textContent = visible.length;
}

function setText(root, selector, value) {
  const node = root.querySelector(selector);
  if (node) node.textContent = value;
}

function copyText(button, value) {
  navigator.clipboard.writeText(value).then(() => {
    const original = button.textContent;
    button.textContent = 'Copiado';
    button.classList.add('copy-success');
    setTimeout(() => { button.textContent = original; button.classList.remove('copy-success'); }, 1400);
  });
}

function buildKitUrl(prospect) {
  const params = new URLSearchParams({
    business: prospect.business, segment: prospect.segment, location: 'Valdivia',
    source: prospect.evidence[0]?.url || prospect.website, offer: prospect.offer
  });
  prospect.findings.slice(0, 3).forEach((finding, index) => params.set(`finding${index + 1}`, finding));
  return `../kit/?${params.toString()}`;
}

const SOCIAL_LABELS = {
  instagram: 'Instagram', facebook: 'Facebook', tripadvisor: 'TripAdvisor',
  booking: 'Booking', airbnb: 'Airbnb', tiktok: 'TikTok', youtube: 'YouTube'
};

// Todos los caminos para llegar al negocio, no sólo el correo. Cuando no hay
// correo, el teléfono pasa a ser el canal principal y se marca como tal.
function renderChannels(container, prospect) {
  const meta = prospect.audit?.meta || {};
  const hasSocials = Object.keys(meta.socials || {}).length > 0;
  const hasActivity = meta.socialActivity === 'activo';
  const offerSocial = hasSocials && !hasActivity;  // oportunidad de gestión
  const channels = [];

  if (prospect.contact.type === 'email' && prospect.contact.value) {
    channels.push({ kind: 'Correo', value: prospect.contact.value, primary: true,
      href: `mailto:${prospect.contact.value}?subject=${encodeURIComponent(prospect.subject || '')}&body=${encodeURIComponent(prospect.email || '')}`,
      action: 'Abrir borrador' });
  } else if (prospect.contact.type === 'form' && prospect.contact.value) {
    channels.push({ kind: 'Formulario', value: 'Formulario del sitio', href: prospect.contact.value, action: 'Abrir', external: true });
  }

  (meta.phones || []).forEach((phone) => {
    const digits = phone.replace(/\D/g, '');
    const mobile = /^569/.test(digits);
    channels.push({
      kind: mobile ? 'Celular' : 'Teléfono fijo',
      value: phone,
      href: `tel:${phone}`,
      action: 'Llamar',
      primary: prospect.contact.type !== 'email'
    });
    if (mobile) {
      channels.push({ kind: 'WhatsApp', value: phone, external: true,
        href: `https://api.whatsapp.com/send?phone=${digits}`, action: 'Abrir chat' });
    }
  });

  Object.entries(meta.socials || {}).forEach(([network, url]) => {
    channels.push({ kind: SOCIAL_LABELS[network] || network, value: url.replace(/^https?:\/\/(www\.)?/, ''), href: url, action: 'Ver perfil', external: true });
  });

  container.replaceChildren();
  if (!channels.length) {
    container.append(Object.assign(document.createElement('p'), {
      className: 'signal-empty',
      textContent: 'No se detectó ningún canal público. Hay que buscarlo en Google Maps o ir presencialmente.'
    }));
    return;
  }

  channels.forEach((channel) => {
    const row = document.createElement('div');
    row.className = 'channel';
    if (channel.primary) row.dataset.primary = 'true';
    row.append(
      Object.assign(document.createElement('span'), { className: 'channel-kind', textContent: channel.kind }),
      Object.assign(document.createElement('strong'), { className: 'channel-value', textContent: channel.value })
    );
    const link = document.createElement('a');
    link.href = channel.href;
    link.className = 'channel-action';
    link.textContent = channel.action;
    if (channel.external) { link.target = '_blank'; link.rel = 'noreferrer'; }
    row.append(link);
    container.append(row);
  });
}

function renderSignals(container, signals) {
  container.replaceChildren();
  if (!signals?.length) {
    const empty = document.createElement('li');
    empty.className = 'signal-empty';
    empty.textContent = 'La auditoría no encontró señales observables. Puede ser un sitio bien mantenido: revísalo a mano antes de descartarlo.';
    container.append(empty);
    return;
  }
  signals.forEach((signal) => {
    const item = document.createElement('li');
    item.className = 'signal';
    item.dataset.severity = signal.severity;
    const label = document.createElement('strong');
    label.textContent = signal.label;
    const detailText = document.createElement('p');
    detailText.textContent = signal.detail;
    item.append(label, detailText);
    if (signal.evidence) {
      const evidence = document.createElement('code');
      evidence.textContent = signal.evidence;
      item.append(evidence);
    }
    const use = document.createElement('button');
    use.type = 'button';
    use.className = 'quiet-button';
    use.textContent = 'Usar como hallazgo';
    use.addEventListener('click', async () => {
      const prospect = prospects.find((candidate) => candidate.id === selectedId);
      if (prospect.findings.includes(signal.label)) return;
      const findings = [...prospect.findings, signal.label];
      await patchProspect(prospect.id, { findings });
      renderDetail(prospects.find((candidate) => candidate.id === selectedId));
    });
    item.append(use);
    container.append(item);
  });
}

async function reverify(prospect, resultBox, signalList) {
  resultBox.hidden = false;
  resultBox.className = 'reverify-result';
  resultBox.textContent = 'Revisando el sitio…';

  const fresh = await api('/auditar', { method: 'POST', body: { url: prospect.website } });
  const before = new Map((prospect.audit?.signals || []).map((signal) => [signal.id, signal]));
  const after = new Map(fresh.signals.map((signal) => [signal.id, signal]));
  const gone = [...before.values()].filter((signal) => !after.has(signal.id));
  const added = [...after.values()].filter((signal) => !before.has(signal.id));

  await patchProspect(prospect.id, {
    verifiedAt: fresh.auditedAt,
    audit: {
      score: fresh.score, ok: fresh.ok, error: fresh.error, status: fresh.status,
      auditedAt: fresh.auditedAt, signals: fresh.signals, meta: fresh.meta
    }
  });

  resultBox.replaceChildren();
  const heading = document.createElement('strong');
  if (gone.length) {
    resultBox.classList.add('warn');
    heading.textContent = `${gone.length} ${gone.length === 1 ? 'hallazgo ya no existe' : 'hallazgos ya no existen'} — no los menciones`;
    const items = document.createElement('ul');
    gone.forEach((signal) => {
      const item = document.createElement('li');
      item.textContent = signal.label;
      items.append(item);
    });
    resultBox.append(heading, items);
  } else {
    resultBox.classList.add('ok');
    heading.textContent = 'Todos los hallazgos siguen vigentes.';
    resultBox.append(heading);
  }
  if (added.length) {
    const extra = document.createElement('p');
    extra.textContent = `${added.length} señal(es) nueva(s): ${added.map((signal) => signal.label).join('; ')}`;
    resultBox.append(extra);
  }
  renderSignals(signalList, fresh.signals);
}

function renderDetail(prospect) {
  const fragment = template.content.cloneNode(true);
  setText(fragment, '[data-field="priority"]', `Prioridad ${prospect.priority}`);
  setText(fragment, '[data-field="segment"]', prospect.segment);
  setText(fragment, '[data-field="score"]', prospect.audit ? `puntaje ${prospect.audit.score}` : 'sin auditar');
  setText(fragment, '[data-field="business"]', prospect.business);
  setText(fragment, '[data-field="opportunity"]', prospect.opportunity);
  setText(fragment, '[data-field="verifiedAt"]', `Revisado ${formatDate(prospect.verifiedAt)}`);
  setText(fragment, '[data-field="contactLabel"]', prospect.contact.label);
  setText(fragment, '[data-field="subject"]', prospect.subject || '(sin asunto todavía)');
  setText(fragment, '[data-field="email"]', prospect.email || '(sin borrador todavía)');

  const stale = prospect.audit && prospect.audit.auditedAt !== today();
  setText(fragment, '[data-field="auditStamp"]', prospect.audit
    ? `Auditado el ${formatDate(prospect.audit.auditedAt)}${stale ? ' · re-verifica antes de enviar' : ' · hoy'}`
    : 'Este prospecto no tiene auditoría automática.');

  fragment.querySelector('[data-link="website"]').href = prospect.website;

  const signalList = fragment.querySelector('[data-list="signals"]');
  renderSignals(signalList, prospect.audit?.signals);
  renderChannels(fragment.querySelector('[data-list="channels"]'), prospect);

  const findings = fragment.querySelector('[data-list="findings"]');
  // Si el sitio ya no carga, los hallazgos escritos describen páginas que no existen.
  // Avisar antes de que ese texto llegue a un correo.
  if (prospect.audit && !prospect.audit.ok && prospect.findings.length) {
    const stale = document.createElement('p');
    stale.className = 'reverify-result warn';
    stale.textContent = `El sitio no carga (${prospect.audit.error}), pero los hallazgos de abajo describen su contenido. Están vencidos: reescríbelos o contacta por otro canal antes de usar el borrador.`;
    findings.parentElement.insertBefore(stale, findings);
  }
  prospect.findings.forEach((finding) => {
    const item = document.createElement('li');
    item.textContent = finding;
    findings.append(item);
  });

  const evidence = fragment.querySelector('[data-list="evidence"]');
  (prospect.evidence.length ? prospect.evidence : [{ label: 'Sitio público', url: prospect.website }])
    .forEach((source) => {
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = `${source.label} ↗`;
      evidence.append(link);
    });

  const status = fragment.querySelector('#prospect-status');
  const followUp = fragment.querySelector('#follow-up');
  const notes = fragment.querySelector('#notes');
  status.value = prospect.status;
  followUp.value = prospect.followUp || '';
  notes.value = prospect.notes || '';

  status.addEventListener('change', async () => {
    const patch = { status: status.value };
    // Al marcar contactado, proponer el seguimiento a 48 horas del sprint.
    if (status.value === 'contacted' && !followUp.value) {
      const due = new Date();
      due.setDate(due.getDate() + 2);
      patch.followUp = due.toISOString().slice(0, 10);
      followUp.value = patch.followUp;
    }
    await patchProspect(prospect.id, patch);
  });
  followUp.addEventListener('change', () => patchProspect(prospect.id, { followUp: followUp.value }));
  const priority = fragment.querySelector('#prospect-priority');
  priority.value = prospect.priority;
  priority.addEventListener('change', async () => {
    await patchProspect(prospect.id, { priority: priority.value });
    prospects.sort(byPriority);
    renderList();
  });
  notes.addEventListener('change', () => patchProspect(prospect.id, { notes: notes.value }));

  fragment.querySelector('#copy-subject').addEventListener('click', (event) => copyText(event.currentTarget, prospect.subject));
  fragment.querySelector('#copy-email').addEventListener('click', (event) => copyText(event.currentTarget, prospect.email));

  const resultBox = fragment.querySelector('#reverify-result');
  fragment.querySelector('#reverify').addEventListener('click', async (event) => {
    event.currentTarget.disabled = true;
    try {
      await reverify(prospect, resultBox, signalList);
    } catch (error) {
      resultBox.hidden = false;
      resultBox.className = 'reverify-result warn';
      resultBox.textContent = `No se pudo re-verificar: ${error.message}`;
    } finally {
      event.currentTarget.disabled = false;
    }
  });

  const openContact = fragment.querySelector('#open-contact');
  if (prospect.contact.type === 'email') {
    openContact.href = `mailto:${prospect.contact.value}?subject=${encodeURIComponent(prospect.subject)}&body=${encodeURIComponent(prospect.email)}`;
    openContact.textContent = 'Abrir borrador de email';
  } else if (prospect.contact.value) {
    openContact.href = prospect.contact.value;
    openContact.textContent = 'Abrir formulario';
  } else {
    openContact.href = prospect.website;
    openContact.textContent = 'Abrir sitio';
  }
  fragment.querySelector('#open-kit').href = buildKitUrl(prospect);
  detail.replaceChildren(fragment);
}

function updateSummary() {
  document.querySelector('#ready-count').textContent = prospects.filter((prospect) => prospect.status === 'ready').length;
  document.querySelector('#contacted-count').textContent = prospects.filter((prospect) => ['contacted', 'replied'].includes(prospect.status)).length;
  document.querySelector('#due-count').textContent = prospects.filter((prospect) =>
    prospect.status === 'contacted' && prospect.followUp && prospect.followUp <= today()).length;

  const emailable = prospects.filter((prospect) => prospect.contact.type === 'email').length;
  dataNote.textContent = `${prospects.length} prospectos · ${emailable} con correo público · datos en datos/prospectos.json`;
}

function refreshSegments() {
  const segments = [...new Set(prospects.map((prospect) => prospect.segment))].sort();
  segmentFilter.replaceChildren(new Option('Todos', 'all'));
  document.querySelector('#segment-options').replaceChildren();
  segments.forEach((segment) => {
    segmentFilter.append(new Option(segment, segment));
    document.querySelector('#segment-options').append(new Option(segment));
  });
}

// --- Alta de prospecto por auditoría ---
const auditButton = document.querySelector('#audit-button');
const preview = document.querySelector('#audit-preview');

auditButton.addEventListener('click', async () => {
  const url = document.querySelector('#new-url').value.trim();
  const business = document.querySelector('#new-business').value.trim();
  if (!url) { preview.hidden = false; preview.textContent = 'Falta la URL del sitio.'; return; }

  auditButton.disabled = true;
  preview.hidden = false;
  preview.replaceChildren('Auditando el sitio…');
  try {
    const result = await api('/auditar', { method: 'POST', body: { url } });
    preview.replaceChildren();

    const heading = document.createElement('strong');
    heading.textContent = result.ok
      ? `Puntaje ${result.score} · ${result.signals.length} señales`
      : `No se pudo cargar: ${result.error}`;
    preview.append(heading);

    const signals = document.createElement('ul');
    signals.className = 'signal-list compact';
    renderSignalsPreview(signals, result.signals);
    preview.append(signals);

    if (result.meta.emails.length) {
      const mails = document.createElement('p');
      mails.textContent = `Correos públicos detectados: ${result.meta.emails.join(', ')}`;
      preview.append(mails);
    }

    const save = document.createElement('button');
    save.type = 'button';
    save.className = 'primary';
    save.textContent = 'Guardar en la cola';
    save.addEventListener('click', async () => {
      save.disabled = true;
      try {
        const created = await api('/prospectos', {
          method: 'POST',
          body: {
            business: business || result.meta.title || new URL(result.url).hostname,
            segment: document.querySelector('#new-segment').value.trim() || 'Sin clasificar',
            website: result.url,
            priority: result.score >= 8 ? 'Alta' : result.score >= 4 ? 'Media' : 'Baja',
            contact: result.meta.emails.length
              ? { type: 'email', value: result.meta.emails[0], label: 'Correo publicado en el sitio; confirmar antes de enviar' }
              : { type: 'none', value: '', label: 'Sin correo público: contactar por Instagram, formulario o teléfono' },
            evidence: [{ label: 'Sitio oficial', url: result.url }],
            findings: result.signals.filter((signal) => signal.severity === 'alta').map((signal) => signal.label),
            audit: {
              score: result.score, ok: result.ok, error: result.error, status: result.status,
              auditedAt: result.auditedAt, signals: result.signals, meta: result.meta
            }
          }
        });
        prospects.push(created);
        prospects.sort(byPriority);
        selectedId = created.id;
        refreshSegments();
        renderList();
        updateSummary();
        renderDetail(created);
        preview.hidden = true;
        document.querySelector('#new-url').value = '';
        document.querySelector('#new-business').value = '';
      } catch (error) {
        const failure = document.createElement('p');
        failure.className = 'error-text';
        failure.textContent = error.message;
        preview.append(failure);
        save.disabled = false;
      }
    });
    preview.append(save);
  } catch (error) {
    preview.replaceChildren(`Error: ${error.message}`);
  } finally {
    auditButton.disabled = false;
  }
});

function renderSignalsPreview(container, signals) {
  signals.forEach((signal) => {
    const item = document.createElement('li');
    item.className = 'signal';
    item.dataset.severity = signal.severity;
    const label = document.createElement('strong');
    label.textContent = signal.label;
    item.append(label);
    if (signal.evidence) {
      const evidence = document.createElement('code');
      evidence.textContent = signal.evidence;
      item.append(evidence);
    }
    container.append(item);
  });
}

[search, statusFilter, segmentFilter, channelFilter].forEach((control) => control.addEventListener('input', renderList));

async function boot() {
  try {
    prospects = await api('/prospectos');
    prospects.sort(byPriority);
    selectedId = prospects[0]?.id ?? null;
    refreshSegments();
    renderList();
    updateSummary();
    if (prospects[0]) renderDetail(prospects[0]);
  } catch (error) {
    dataNote.textContent = `No se pudo cargar la cola: ${error.message}. ¿Está corriendo "npm run serve"?`;
  }
}

boot();
