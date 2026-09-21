/* ============================================================
   DANTE LAB · Arcade 🕹️
   Pantalla donde el niño VE los 7 juegos y elige cuál jugar,
   cuando quiera. Cada juego se lanza con un descubrimiento del
   mundo activo (o uno de práctica) para que tenga tema.
   Íconos dibujados en SVG (no emojis) para verse intencionales.
   ============================================================ */
(function(){

  // Íconos SVG propios, con estilo redondeado y color plano (no "de IA")
  const IC = {
    carrera:`<svg viewBox="0 0 64 64"><rect x="10" y="30" width="44" height="16" rx="8" fill="#ff5a5f"/><rect x="20" y="20" width="20" height="14" rx="6" fill="#ff8a8f"/><circle cx="20" cy="48" r="7" fill="#2b2b3d"/><circle cx="44" cy="48" r="7" fill="#2b2b3d"/><circle cx="20" cy="48" r="3" fill="#fff"/><circle cx="44" cy="48" r="3" fill="#fff"/><rect x="42" y="24" width="8" height="6" rx="2" fill="#ffd23f"/></svg>`,
    laberinto:`<svg viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" rx="10" fill="#3ac0c0"/><path d="M18 18h20v6H24v10h14v6H18z" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="44" cy="44" r="5" fill="#ffd23f"/></svg>`,
    parame:`<svg viewBox="0 0 64 64"><rect x="10" y="10" width="44" height="44" rx="12" fill="#8a5ce0"/><text x="32" y="42" font-family="Baloo 2,Arial" font-size="30" font-weight="800" fill="#fff" text-anchor="middle">A</text></svg>`,
    laser:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="none" stroke="#ff5a5f" stroke-width="5"/><circle cx="32" cy="32" r="12" fill="none" stroke="#ff5a5f" stroke-width="5"/><circle cx="32" cy="32" r="4" fill="#ffd23f"/></svg>`,
    rayuela:`<svg viewBox="0 0 64 64"><rect x="24" y="10" width="16" height="14" rx="4" fill="#ffd23f"/><rect x="12" y="26" width="16" height="14" rx="4" fill="#7ac86a"/><rect x="36" y="26" width="16" height="14" rx="4" fill="#3ac0c0"/><rect x="24" y="42" width="16" height="14" rx="4" fill="#ff8a8f"/></svg>`,
    atrapa:`<svg viewBox="0 0 64 64"><path d="M14 22 h36 l-4 26 a6 6 0 0 1 -6 5 h-16 a6 6 0 0 1 -6 -5 z" fill="#ffb04a"/><rect x="12" y="16" width="40" height="8" rx="4" fill="#e0762a"/><circle cx="26" cy="12" r="4" fill="#ffd23f"/><circle cx="38" cy="10" r="4" fill="#ff8a8f"/></svg>`,
    constructor:`<svg viewBox="0 0 64 64"><rect x="10" y="30" width="20" height="16" rx="3" fill="#ff5a5f"/><rect x="32" y="30" width="20" height="16" rx="3" fill="#3ac0c0"/><rect x="21" y="14" width="20" height="16" rx="3" fill="#ffd23f"/></svg>`,
    penales:`<svg viewBox="0 0 64 64"><rect x="12" y="14" width="40" height="30" rx="3" fill="none" stroke="#fff" stroke-width="4"/><line x1="12" y1="24" x2="52" y2="24" stroke="#fff" stroke-width="2"/><line x1="12" y1="34" x2="52" y2="34" stroke="#fff" stroke-width="2"/><line x1="25" y1="14" x2="25" y2="44" stroke="#fff" stroke-width="2"/><line x1="39" y1="14" x2="39" y2="44" stroke="#fff" stroke-width="2"/><circle cx="32" cy="52" r="7" fill="#fff"/><path d="M32 47l2 3-2 3-2-3z" fill="#2b2b3d"/></svg>`,
    tablero:`<svg viewBox="0 0 64 64"><rect x="14" y="14" width="36" height="36" rx="8" fill="#ffd23f"/><circle cx="24" cy="24" r="3.5" fill="#2b2b3d"/><circle cx="40" cy="24" r="3.5" fill="#2b2b3d"/><circle cx="32" cy="32" r="3.5" fill="#2b2b3d"/><circle cx="24" cy="40" r="3.5" fill="#2b2b3d"/><circle cx="40" cy="40" r="3.5" fill="#2b2b3d"/></svg>`
  };

  const JUEGOS = [
    { id:'carrera',     nombre:'Carreras',        desc:'Esquiva y llega a la meta', color:'#ff5a5f', fn:'abrirCarrera',   ic:IC.carrera },
    { id:'parame',      nombre:'Párame la mano',  desc:'Piensa rápido',            color:'#8a5ce0', fn:'abrirParame',    ic:IC.parame },
    { id:'laser',       nombre:'Puntería',        desc:'Apunta a los blancos',     color:'#e0762a', fn:'abrirLaser',     ic:IC.laser },
    { id:'laberinto',   nombre:'Laberinto',       desc:'Encuentra el camino',      color:'#3ac0c0', fn:'abrirLaberinto', ic:IC.laberinto },
    { id:'rayuela',     nombre:'Rayuela',         desc:'Salta hasta el final',     color:'#7ac86a', fn:'abrirRayuela',   ic:IC.rayuela },
    { id:'atrapa',      nombre:'Atrapa el tesoro',desc:'Toca lo que cae',          color:'#ffb04a', fn:'abrirMiniJuego', ic:IC.atrapa },
    { id:'penales',     nombre:'Penales',         desc:'¡Ataja los goles!',        color:'#2fd479', fn:'abrirPenales',   ic:IC.penales },
    { id:'tablero',     nombre:'Tablero',         desc:'Tira el dado y avanza',    color:'#ff8c1a', fn:'abrirTablero',   ic:IC.tablero },
    { id:'constructor', nombre:'Taller de bloques',desc:'Construye lo que imagines',color:'#6a3ac0', fn:'abrirConstructor', ic:IC.constructor }
  ];

  // asegura que haya un discActual (para juegos temáticos), si no, usa uno de práctica del 1er mundo
  function asegurarDisc(){
    if(window.discActual && window.discActual.mundo) return;
    const M = window.MUNDOS && window.MUNDOS[0];
    if(M){ window.discActual = { mundo:M, d:M.descubrimientos[0] }; }
  }

  window.abrirArcade = function(){
    const cont=document.getElementById('arcadeGrid'); cont.innerHTML='';
    JUEGOS.forEach(j=>{
      const b=document.createElement('button'); b.className='arcadeCard';
      b.style.setProperty('--c', j.color);
      const icono = (window.ICONOS && window.ICONOS[j.id]) || j.ic;
      const nivel = (window.DIF && j.id!=='constructor') ? DIF.nivel(j.id==='atrapa'?'atrapa':j.id) : 0;
      b.innerHTML=`<span class="acIcon" style="background:${j.color}22">${icono}</span>
        <span class="acName">${j.nombre}</span>
        <span class="acDesc">${j.desc}</span>
        ${nivel? '<span class="acLvl">⭐ Nivel '+nivel+'</span>':''}`;
      b.onclick=()=>{
        if(window.SFX) SFX.swoosh();
        if(j.id==='constructor'){ if(typeof abrirConstructor==='function') abrirConstructor(); return; }
        asegurarDisc();
        window._desdeArcade = true;   // para que al terminar vuelva al arcade
        const lanzar=()=>{ if(typeof window[j.fn]==='function') window[j.fn](); };
        if(typeof mostrarGuia==='function') mostrarGuia(j.id, lanzar); else lanzar();
      };
      cont.appendChild(b);
    });
    document.getElementById('arcadeBack').onclick=()=> show('v-home');
    show('v-arcade');
  };
})();

/* Íconos SVG de los mundos (para reemplazar emojis en la home) */
window.ICONOS_MUNDO = {
  oceano:`<svg viewBox="0 0 64 64"><path d="M8 40 q8 -10 16 0 t16 0 t16 0 v14 h-48 z" fill="#ffffff55"/><path d="M8 44 q8 -8 16 0 t16 0 t16 0 v10 h-48 z" fill="#ffffff88"/><circle cx="40" cy="24" r="9" fill="#fff"/><circle cx="40" cy="24" r="5" fill="#2a9fe0"/><path d="M22 30 q3 -6 8 -3" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  animales:`<svg viewBox="0 0 64 64"><circle cx="32" cy="34" r="18" fill="#fff"/><circle cx="20" cy="18" r="7" fill="#fff"/><circle cx="44" cy="18" r="7" fill="#fff"/><circle cx="26" cy="32" r="3" fill="#3ac06a"/><circle cx="38" cy="32" r="3" fill="#3ac06a"/><path d="M28 40 q4 4 8 0" stroke="#3ac06a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  espacio:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#fff"/><ellipse cx="32" cy="32" rx="26" ry="8" fill="none" stroke="#ffffffaa" stroke-width="4" transform="rotate(-20 32 32)"/><circle cx="26" cy="28" r="3" fill="#8a5ce0"/><circle cx="38" cy="34" r="2" fill="#8a5ce0"/></svg>`,
  lugares:`<svg viewBox="0 0 64 64"><rect x="16" y="26" width="32" height="24" fill="#fff"/><path d="M12 26 L32 12 L52 26 z" fill="#fff"/><rect x="28" y="36" width="8" height="14" fill="#ff9d2a"/><rect x="20" y="32" width="6" height="6" fill="#ff9d2a"/><rect x="38" y="32" width="6" height="6" fill="#ff9d2a"/></svg>`
};
