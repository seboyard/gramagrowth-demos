const prospect = window.PROSPECT;

document.querySelectorAll('[data-text]').forEach((node) => {
  node.textContent = prospect[node.dataset.text] || 'Pendiente de confirmar';
});

document.querySelectorAll('[data-link]').forEach((node) => {
  node.href = prospect[node.dataset.link] || '#contacto';
});

document.title = `${prospect.name} | Muestra conceptual`;

const serviceList = document.querySelector('#service-list');
prospect.services.forEach((service, index) => {
  const article = document.createElement('article');
  const number = document.createElement('span');
  const heading = document.createElement('h3');
  const detail = document.createElement('p');
  number.textContent = String(index + 1).padStart(2, '0');
  heading.textContent = service.name;
  detail.textContent = service.detail;
  article.append(number, heading, detail);
  serviceList.append(article);
});
