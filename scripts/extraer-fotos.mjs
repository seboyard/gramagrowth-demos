// Extrae las mejores fotos del sitio público de un prospecto, para usarlas en
// su demo. Uso: node scripts/extraer-fotos.mjs <url> [cuantas]
//
// Por qué las suyas y no fotos de banco: la muestra tiene que verse como su
// negocio, no como una plantilla. Y por qué no Google Maps: esas imágenes son
// de Google o de quien las subió, y raspearlas va contra sus términos.
//
// Las URL se enlazan desde su propio servidor, no se copian. Para una entrega
// real el cliente entrega sus fotos.

const UA = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
  'Accept-Language': 'es-CL,es;q=0.9'
};

// Nombres que casi siempre son iconos, logos o adornos, no fotos del lugar.
const NOISE = /logo|icon|favicon|sprite|avatar|placeholder|banner-?ad|whatsapp|facebook|instagram|arrow|bullet|pixel|spinner|loader|badge|sello|boton|button/i;

const absolute = (src, base) => {
  try { return new URL(src, base).href; } catch { return null; }
};

function candidates(html, base) {
  const found = new Map();
  const push = (src, weight, alt = '') => {
    const url = absolute(src, base);
    if (!url || !/^https?:/i.test(url)) return;
    if (!/\.(jpe?g|png|webp)(\?|$)/i.test(url)) return;
    if (NOISE.test(url) || NOISE.test(alt)) return;
    // Una misma foto llega en varios tamaños, y el tamaño puede estar en el
    // nombre ("-800x600.jpg", "2000_foto.jpg") o en la ruta del CDN
    // ("/w=768,h=526/foto.png"). Se agrupa por nombre de archivo normalizado,
    // que cubre los dos casos, y se conserva la variante más grande.
    const clean = url.split('?')[0].split('/').pop()
      .replace(/-\d{2,4}x\d{2,4}(?=\.(jpe?g|png|webp))/i, '')
      .replace(/-scaled(?=\.(jpe?g|png|webp))/i, '')
      .replace(/^\d{3,4}_/, '')
      .toLowerCase();
    // Ancho declarado en la ruta del CDN, para elegir la versión mayor.
    const declared = Number(url.match(/[?,/]w=(\d{2,5})/i)?.[1] || url.match(/\/(\d{3,4})_/)?.[1] || 0);
    const previous = found.get(clean);
    // Gana la de mayor peso; a igual peso, la de mayor ancho declarado.
    if (!previous || weight > previous.weight
      || (weight === previous.weight && declared > previous.declared)) {
      found.set(clean, { url, weight, declared });
    }
  };

  // Imagen social: suele ser la que el negocio eligió para representarse.
  for (const match of html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*content=["']([^"']+)["']/gi)) {
    push(match[1], 100);
  }
  // Imágenes del cuerpo, con su alt para filtrar ruido.
  for (const match of html.matchAll(/<img[^>]+>/gi)) {
    const tag = match[0];
    const src = tag.match(/\ssrc=["']([^"']+)["']/i)?.[1];
    const lazy = tag.match(/\sdata-(?:src|lazy-src|original)=["']([^"']+)["']/i)?.[1];
    const alt = tag.match(/\salt=["']([^"']*)["']/i)?.[1] || '';
    const width = Number(tag.match(/\swidth=["'](\d+)["']/i)?.[1] || 0);
    // Declaradas chicas: casi siempre iconos.
    if (width && width < 300) continue;
    if (lazy) push(lazy, 60, alt);
    if (src) push(src, 50, alt);
  }
  // Fondos en estilos en línea: en sitios de turismo suelen ser las mejores.
  for (const match of html.matchAll(/background-image\s*:\s*url\((["']?)([^"')]+)\1\)/gi)) {
    push(match[2], 70);
  }
  return [...found.values()]
    .sort((left, right) => right.weight - left.weight || right.declared - left.declared)
    .map((entry) => entry.url);
}

// Descarta lo que no sea una foto de verdad: pide sólo la cabecera.
async function usable(url) {
  try {
    const response = await fetch(url, { headers: UA, method: 'GET', signal: AbortSignal.timeout(15000) });
    if (!response.ok) return null;
    const type = response.headers.get('content-type') || '';
    if (!/^image\//i.test(type)) return null;
    const size = Number(response.headers.get('content-length') || 0);
    // Menos de 15 KB casi nunca es una foto del lugar.
    if (size && size < 15000) return null;
    return { url, type, size };
  } catch { return null; }
}

export async function extractPhotos(siteUrl, limit = 6) {
  const response = await fetch(siteUrl, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(25000) });
  const html = await response.text();
  const list = candidates(html, response.url);

  const good = [];
  for (const url of list) {
    if (good.length >= limit) break;
    const check = await usable(url);
    if (check) good.push(check);
  }
  return good;
}

// Ejecutable directo
if (process.argv[1] && process.argv[1].endsWith('extraer-fotos.mjs')) {
  const [, , url, count] = process.argv;
  if (!url) {
    console.error('Uso: node scripts/extraer-fotos.mjs <url> [cuantas]');
    process.exit(1);
  }
  const photos = await extractPhotos(url, Number(count) || 6);
  if (!photos.length) {
    console.log('No se encontraron fotos utilizables. La demo va sin galería.');
  } else {
    console.log(`${photos.length} fotos utilizables:\n`);
    photos.forEach((photo) => console.log(`  ${Math.round(photo.size / 1024)} KB  ${photo.url}`));
    console.log('\nPara el config:\n');
    console.log(`  galeria: ${JSON.stringify(photos.map((photo) => photo.url), null, 2).replace(/\n/g, '\n  ')},`);
  }
}
