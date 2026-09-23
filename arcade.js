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

  IC.sopa=`<svg viewBox="0 0 64 64"><rect x="10" y="10" width="44" height="44" rx="10" fill="#3fb4ff"/><g font-family="Arial" font-weight="800" font-size="11" fill="#fff" text-anchor="middle"><text x="22" y="26">S</text><text x="32" y="26">O</text><text x="42" y="26">L</text><text x="22" y="38">M</text><text x="32" y="38">A</text><text x="42" y="38">R</text><text x="22" y="50">P</text><text x="32" y="50">E</text><text x="42" y="50">Z</text></g><rect x="15" y="17" width="34" height="12" rx="6" fill="none" stroke="#ffd23f" stroke-width="3"/></svg>`;
  IC.rompecabezas=`<svg viewBox="0 0 64 64"><path d="M12 12h16v5a5 5 0 1 0 8 0v-5h16v16h-5a5 5 0 1 0 0 8h5v16H36v-5a5 5 0 1 0-8 0v5H12V36h5a5 5 0 1 0 0-8h-5z" fill="#ff4d9d"/></svg>`;
  IC.trivia=`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#ffd23f"/><text x="32" y="43" font-family="Arial" font-size="30" font-weight="900" fill="#4a2e00" text-anchor="middle">?</text></svg>`;

  IC.trex=`<svg viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" rx="12" fill="#4a6a1a"/><circle cx="20" cy="20" r="3" fill="#f5e6c0"/><circle cx="32" cy="20" r="3" fill="#f5e6c0"/><circle cx="44" cy="20" r="3" fill="#f5e6c0"/><path d="M14 50 q2 -12 12 -12 q2 -10 12 -11 q8 0 10 6 q-2 3 -6 3 q-2 5 -3 8 q5 2 6 6 h-5 l-3 -3 l-3 4 h-5 l1 -6 q-8 1 -12 5z" fill="#9ac02a"/><circle cx="44" cy="32" r="1.6" fill="#16240c"/></svg>`;
  IC.ordenar=`<svg viewBox="0 0 64 64"><circle cx="10" cy="32" r="8" fill="#ffd23f"/><circle cx="24" cy="32" r="3" fill="#bbb"/><circle cx="33" cy="32" r="4" fill="#e8c060"/><circle cx="43" cy="32" r="4.5" fill="#3a8ad0"/><circle cx="55" cy="32" r="6" fill="#d8955a"/><path d="M6 44 q26 10 52 0" stroke="#fff" stroke-width="2" fill="none" stroke-dasharray="3 3"/></svg>`;

  const JUEGOS = [
    { id:'carrera',     nombre:'Carreras',        desc:'Esquiva y llega a la meta', color:'#ff5a5f', fn:'abrirCarrera',   ic:IC.carrera },
    { id:'parame',      nombre:'Párame la mano',  desc:'Piensa rápido',            color:'#8a5ce0', fn:'abrirParame',    ic:IC.parame },
    { id:'laser',       nombre:'Puntería',        desc:'Apunta a los blancos',     color:'#e0762a', fn:'abrirLaser',     ic:IC.laser },
    { id:'laberinto',   nombre:'Laberinto',       desc:'Encuentra el camino',      color:'#3ac0c0', fn:'abrirLaberinto', ic:IC.laberinto },
    { id:'rayuela',     nombre:'Rayuela',         desc:'Salta hasta el final',     color:'#7ac86a', fn:'abrirRayuela',   ic:IC.rayuela },
    { id:'atrapa',      nombre:'Atrapa el tesoro',desc:'Toca lo que cae',          color:'#ffb04a', fn:'abrirMiniJuego', ic:IC.atrapa },
    { id:'penales',     nombre:'Penales',         desc:'¡Ataja los goles!',        color:'#2fd479', fn:'abrirPenales',   ic:IC.penales },
    { id:'tablero',     nombre:'Tablero',         desc:'Tira el dado y avanza',    color:'#ff8c1a', fn:'abrirTablero',   ic:IC.tablero },
    { id:'sopa',        nombre:'Sopa de letras',  desc:'Encuentra las palabras',   color:'#3fb4ff', fn:'abrirSopa',      ic:IC.sopa },
    { id:'rompecabezas',nombre:'Rompecabezas',    desc:'Arma la imagen',           color:'#ff4d9d', fn:'abrirRompecabezas', ic:IC.rompecabezas },
    { id:'trivia',      nombre:'Trivia',          desc:'¿Cuánto sabes?',           color:'#ffd23f', fn:'abrirTrivia',    ic:IC.trivia },
    { id:'trex',        nombre:'T-Rex comelón',   desc:'Come y esquiva',           color:'#9ac02a', fn:'abrirTrex',      ic:IC.trex },
    { id:'ordenar',     nombre:'Sistema solar',   desc:'Ordena los planetas',      color:'#8a5ce0', fn:'abrirOrdenar',   ic:IC.ordenar },
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
  paises:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#fff"/><path d="M18 22 q6 -4 10 2 q2 6 -4 8 q-6 2 -6 -10z M34 16 q8 0 12 8 q-6 4 -10 0 q-4 -4 -2 -8z M36 36 q8 -2 10 6 q-4 8 -10 6 q-4 -6 0 -12z" fill="#ff9d2a"/><ellipse cx="32" cy="32" rx="22" ry="22" fill="none" stroke="#ffffffaa" stroke-width="2"/></svg>`,
  tecnologia:`<svg viewBox="0 0 64 64"><rect x="18" y="8" width="28" height="48" rx="6" fill="#fff"/><rect x="22" y="14" width="20" height="30" rx="2" fill="#1aa0a0"/><circle cx="32" cy="50" r="3" fill="#1aa0a0"/><path d="M30 20 l-4 10 h6 l-2 10 l8 -13 h-6 l3 -7z" fill="#ffe24a"/></svg>`,
  dinosaurios:`<svg viewBox="0 0 64 64"><path d="M10 46 q4 -12 16 -12 q4 -14 16 -16 q10 0 12 8 q-2 4 -8 4 q-2 6 -4 10 q6 2 8 8 h-6 l-4 -4 l-4 6 h-6 l2 -8 q-10 2 -16 4z" fill="#fff"/><circle cx="46" cy="22" r="2" fill="#7a9a1a"/><path d="M28 30 l3 -5 l2 5 l3 -5 l2 5" stroke="#7a9a1a" stroke-width="2" fill="none"/></svg>`
};
