/* ============================================================
   DANTE LAB · fotos reales con respaldo
   - Intenta traer la foto real desde Wikimedia Commons (libre/CC)
   - Si no hay internet o falla, muestra una ilustración dibujada
   - Guarda en memoria las URLs que ya encontró (no repite pedidos)
   ============================================================ */

const _photoCache = {};

/* Construye una ilustración de respaldo (SVG) con los colores del descubrimiento */
function ilustracionRespaldo(d) {
  const [c1, c2] = d.bg || ['#1a2a4a', '#2a4a6a'];
  return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
    <defs>
      <radialGradient id="g_${d.id}" cx="50%" cy="40%">
        <stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c1}"/>
      </radialGradient>
      <linearGradient id="fl_${d.id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#g_${d.id})"/>
    ${Array.from({length:26}).map((_,i)=>{
      const x=(i*47%400), y=((i*61)%270)+8, r=(i%3)+1;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="0.22"/>`;
    }).join('')}
    <ellipse cx="200" cy="250" rx="150" ry="40" fill="url(#fl_${d.id})"/>
    <circle cx="200" cy="150" r="82" fill="#ffffff" opacity="0.10"/>
    <circle cx="200" cy="150" r="60" fill="#ffffff" opacity="0.08"/>
    <text x="200" y="165" font-size="110" text-anchor="middle" dominant-baseline="middle">${d.icono||d.emoji}</text>
    <text x="200" y="285" font-size="15" fill="#ffffff" opacity="0.7" text-anchor="middle" font-family="sans-serif" font-weight="bold">✨ ${d.nombre||''} ✨</text>
  </svg>`;
}

/* Pide a Wikimedia la URL directa de la foto (tamaño 800px) */
async function urlWikimedia(fileName) {
  if (_photoCache[fileName]) return _photoCache[fileName];
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*'
            + '&prop=imageinfo&iiprop=url&iiurlwidth=800&titles=File:'
            + encodeURIComponent(fileName);
  const ctrl = new AbortController();
  const t = setTimeout(()=>ctrl.abort(), 8000); // no esperar más de 6s
  try {
    const r = await fetch(api, { signal: ctrl.signal });
    clearTimeout(t);
    const j = await r.json();
    const pages = j.query.pages;
    const page = pages[Object.keys(pages)[0]];
    const info = page.imageinfo && page.imageinfo[0];
    const url = (info && (info.thumburl || info.url)) || null;
    if (url) _photoCache[fileName] = url;
    return url;
  } catch (e) {
    clearTimeout(t);
    return null;
  }
}

/* Imagen principal del artículo de Wikipedia (curada, apta para niños) */
async function urlArticulo(titulo){
  const k='art:'+titulo; if (_photoCache[k]) return _photoCache[k];
  const api='https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=800&redirects=1&titles='+encodeURIComponent(titulo);
  const ctrl=new AbortController(); const t=setTimeout(()=>ctrl.abort(),8000);
  try{
    const r=await fetch(api,{signal:ctrl.signal}); clearTimeout(t);
    const j=await r.json(); const pages=j.query.pages; const pg=pages[Object.keys(pages)[0]];
    const url=(pg && pg.thumbnail && pg.thumbnail.source)||null;
    if(url) _photoCache[k]=url; return url;
  }catch(e){ clearTimeout(t); return null; }
}
/* Foto de una ficha: archivo exacto de Commons y, si falla, la del artículo */
async function urlFotoFicha(d){
  let url=null;
  if(d.wiki) url=await urlWikimedia(d.wiki);
  if(!url && d.wikiArticulo) url=await urlArticulo(d.wikiArticulo);
  return url;
}
window.urlFotoFicha=urlFotoFicha;

/*
  Rellena un contenedor con la foto real (o la ilustración de respaldo).
  contenedor: el elemento donde va la imagen
  d: el descubrimiento
  Muestra primero la ilustración (instantánea), y si llega la foto real, la cambia con un fundido.
*/
async function cargarFoto(contenedor, d) {
  // 1) respaldo inmediato: ilustración (nunca pantalla vacía)
  contenedor.innerHTML = ilustracionRespaldo(d);
  contenedor.dataset.tipo = 'ilustracion';

  // 2) intentar foto real en segundo plano
  if (!d.wiki && !d.wikiArticulo) return;
  const url = await urlFotoFicha(d);
  if (!url) return; // sin internet o sin foto: se queda la ilustración

  // precargar la imagen antes de mostrarla (para que no aparezca a medias)
  const img = new Image();
  img.onload = () => {
    contenedor.innerHTML = '';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;opacity:0;transition:opacity .5s';
    img.alt = d.nombre;
    contenedor.appendChild(img);
    requestAnimationFrame(()=> img.style.opacity = '1');
    contenedor.dataset.tipo = 'foto';
    // etiqueta "foto real"
    const badge = document.createElement('div');
    badge.className = 'realBadge';
    badge.textContent = '📷 foto real';
    contenedor.appendChild(badge);
  };
  img.onerror = () => {}; // se queda la ilustración
  img.src = url;
}
