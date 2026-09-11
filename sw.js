const CACHE='dantelab-v11';
const ASSETS=['./','./index.html','./data.js','./photos.js','./sfx.js','./fx.js','./iconos.js','./dificultad.js','./minijuego.js','./laberinto.js','./carreras.js','./parame.js','./laser.js','./rayuela.js','./constructor.js','./plantillas.js','./guia.js','./arcade.js','./app.js','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  // Las fotos de Wikimedia siempre desde la red (no cachear en el SW; el navegador ya cachea)
  if(u.hostname.indexOf('wikimedia')>-1||u.hostname.indexOf('wikipedia')>-1){return;}
  e.respondWith(
    fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
