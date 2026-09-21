/* ============================================================
   DANTE LAB · Eventos aleatorios 🎲
   Hacen que NINGUNA partida sea igual. Durante un juego, cada
   cierto tiempo puede dispararse un evento sorpresa que cambia
   las reglas por unos segundos. El niño nunca sabe qué viene.
   Cada juego pide un evento al azar y lo aplica a su manera.
   ============================================================ */
const EVENTOS = (function(){

  // catálogo de eventos posibles (con su aviso visual)
  const CATALOGO = [
    { id:'lluvia',   nombre:'🌟 ¡LLUVIA DE ESTRELLAS!', color:'#ffd23f' },
    { id:'turbo',    nombre:'⚡ ¡TURBO!',                color:'#ff4d9d' },
    { id:'lento',    nombre:'🐢 ¡CÁMARA LENTA!',         color:'#22a7ff' },
    { id:'doble',    nombre:'✨ ¡PUNTOS DOBLES!',        color:'#2fd479' },
    { id:'frenesi',  nombre:'🔥 ¡FRENESÍ!',              color:'#ff8c1a' }
  ];

  // muestra un cartel grande de aviso del evento en pantalla
  function anunciar(ev){
    let el=document.getElementById('eventoBanner');
    if(!el){ el=document.createElement('div'); el.id='eventoBanner'; document.body.appendChild(el); }
    el.textContent=ev.nombre;
    el.style.cssText='position:fixed;top:38%;left:50%;transform:translate(-50%,-50%) scale(.5);'+
      'z-index:75;font-family:"Baloo 2",sans-serif;font-weight:800;font-size:30px;color:#fff;'+
      'background:'+ev.color+';padding:16px 28px;border-radius:20px;box-shadow:0 10px 30px #0007,0 0 30px '+ev.color+';'+
      'text-align:center;pointer-events:none;opacity:0';
    el.animate([
      {transform:'translate(-50%,-50%) scale(.5)',opacity:0},
      {transform:'translate(-50%,-50%) scale(1.1)',opacity:1,offset:.2},
      {transform:'translate(-50%,-50%) scale(1)',opacity:1,offset:.8},
      {transform:'translate(-50%,-50%) scale(1.05)',opacity:0}
    ],{duration:1600,easing:'ease-out'});
    if(window.SFX) SFX.premio();
  }

  // elige un evento al azar (o null si no toca)
  function tirar(prob){
    if(Math.random() > (prob||0.35)) return null;   // ~35% de que haya evento
    return CATALOGO[Math.floor(Math.random()*CATALOGO.length)];
  }

  return { CATALOGO, anunciar, tirar };
})();
window.EVENTOS = EVENTOS;
