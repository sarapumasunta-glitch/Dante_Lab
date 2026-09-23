/* ============================================================
   DANTE LAB · T-Rex comelón 🦖 (estilo Pac-Man)
   - Come todos los huesitos del laberinto para ganar
   - Atrapa a los pequeños raptores 🦎 para ganar estrellas extra
   - Esquiva los meteoritos ☄️: si te tocan, vuelves al inicio (sin perder)
   - La carne 🍖 congela los meteoritos por unos segundos
   Controles: deslizar el dedo, flechas del teclado o la cruceta.
   ============================================================ */
(function(){
  const MAPA=[
    "#############",
    "#.....#.....#",
    "#.##.###.##.#",
    "#o#.......#o#",
    "#.#.##.##.#.#",
    "#...#...#...#",
    "###.#.#.#.###",
    "#.....M.....#",
    "#.###.#.###.#",
    "#...#...#...#",
    "#.#.#.#.#.#.#",
    "#o..D...D..o#",
    "#.####.####.#",
    "#.....P.....#",
    "#############"];
  const H=MAPA.length, W=MAPA[0].length;
  const DIRS={ arriba:[-1,0], abajo:[1,0], izq:[0,-1], der:[0,1] };
  let cv, ctx, cel, g, raf=null, ult=0, jugando=false;

  function libre(r,c){ return r>=0 && r<H && c>=0 && c<W && MAPA[r][c]!=='#'; }
  function opciones(e){ return Object.values(DIRS).filter(([dr,dc])=>libre(e.r+dr,e.c+dc)); }
  function dist(a,b){ return Math.abs(a.r-b.r)+Math.abs(a.c-b.c); }

  function nuevoJuego(){
    const calma = window.DIF ? DIF.tranquilo() : false;
    const lv = window.DIF ? DIF.nivel('trex') : 1;
    g={ comida:{}, total:0, comidos:0, raptores:0, congelado:0, susto:0,
        jugador:null, dir:[0,0], quiere:[0,0], meteoros:[], dinos:[],
        pasoJ: calma?230:175, pasoM: calma?420:Math.max(190, 300-lv*15), persigue: calma?0.1:Math.min(0.7, 0.25+lv*0.06),
        tJ:0, tM:0, tD:0 };
    const spM=[], spD=[];
    for(let r=0;r<H;r++) for(let c=0;c<W;c++){
      const ch=MAPA[r][c];
      if(ch==='.'||ch==='o'){ g.comida[r+','+c]=ch; g.total++; }
      if(ch==='P') g.inicio={r,c};
      if(ch==='M') spM.push({r,c});
      if(ch==='D') spD.push({r,c});
    }
    g.jugador={...g.inicio, mira:-1};
    const nMet = calma?1:(lv>=4?3:2);
    for(let i=0;i<nMet;i++) g.meteoros.push({ r:spM[0].r, c:spM[0].c+(i-1), d:[0,i%2?1:-1], casa:{...spM[0]} });
    g.meteoros.forEach(m=>{ if(!libre(m.r,m.c)){ m.r=spM[0].r; m.c=spM[0].c; } });
    spD.forEach(p=>g.dinos.push({ r:p.r, c:p.c, casa:{...p}, d:[0,1], vuelve:0 }));
  }

  window.abrirTrexClasico = function(){
    // ficha para el reto final: un dinosaurio (si viene del Arcade, uno al azar)
    const D=(window.MUNDOS||[]).find(m=>m.id==='dinosaurios');
    if(D && (window._desdeArcade || !window.discActual || window.discActual.mundo.id!=='dinosaurios')){
      const pend=D.descubrimientos.filter(d=>!(window.S&&S.coleccion[d.id]));
      const pool=pend.length?pend:D.descubrimientos;
      window.discActual={mundo:D, d:pool[Math.floor(Math.random()*pool.length)]}; try{ discActual=window.discActual; }catch(e){}
    }
    nuevoJuego();
    cv=document.getElementById('trexCanvas'); ctx=cv.getContext('2d');
    show('v-trex');
    medir();
    if(!cv._listo){ controles(); cv._listo=true; }
    document.getElementById('trexBack').onclick=()=>{ detener(); if(window._desdeMundo){ window._desdeMundo=false; abrirMundo('dinosaurios'); } else show('v-disc'); };
    marcador(); nota('Come todos los huesitos 🦴 y esquiva los meteoritos ☄️');
    jugando=true; ult=performance.now(); cancelAnimationFrame(raf); raf=requestAnimationFrame(bucle);
  };
  function detener(){ jugando=false; cancelAnimationFrame(raf); raf=null; }
  window.detenerTrexClasico=detener;

  function medir(){
    const ancho=Math.min(cv.parentElement.clientWidth, 420), dpr=Math.min(window.devicePixelRatio||1,2);
    cel=Math.floor(ancho/W);
    cv.style.width=(cel*W)+'px'; cv.style.height=(cel*H)+'px';
    cv.width=cel*W*dpr; cv.height=cel*H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  // ---------- movimiento ----------
  function mover(e,d){ if(libre(e.r+d[0],e.c+d[1])){ e.r+=d[0]; e.c+=d[1]; return true; } return false; }
  function pasoJugador(){
    const j=g.jugador;
    if(libre(j.r+g.quiere[0], j.c+g.quiere[1])) g.dir=g.quiere.slice();
    if(mover(j,g.dir)){ if(g.dir[1]) j.mira=g.dir[1]>0?1:-1; }
    const k=j.r+','+j.c, ch=g.comida[k];
    if(ch){
      delete g.comida[k]; g.comidos++;
      if(ch==='o'){ g.congelado=Date.now()+5000; nota('🍖 ¡Carne! Los meteoritos se congelaron ❄️'); if(window.SFX) SFX.premio(); }
      else if(window.SFX && g.comidos%4===0) SFX.tap();
      marcador();
      if(g.comidos===g.total) return ganar();
    }
    choques();
  }
  function elegir(e, objetivo, huir, prob){
    let ops=opciones(e);
    const noVolver=ops.filter(([dr,dc])=>!(dr===-e.d[0] && dc===-e.d[1]));
    if(noVolver.length) ops=noVolver;
    if(objetivo && Math.random()<prob){
      ops.sort((a,b)=>{ const da=dist({r:e.r+a[0],c:e.c+a[1]},objetivo), db=dist({r:e.r+b[0],c:e.c+b[1]},objetivo); return huir? db-da : da-db; });
      return ops[0];
    }
    return ops[Math.floor(Math.random()*ops.length)];
  }
  function pasoMeteoros(){
    if(Date.now()<g.congelado) return;
    g.meteoros.forEach(m=>{ m.d=elegir(m, g.jugador, false, g.persigue); mover(m,m.d); });
    choques();
  }
  function pasoDinos(){
    g.dinos.forEach(d=>{
      if(d.vuelve){ if(Date.now()>d.vuelve){ d.vuelve=0; d.r=d.casa.r; d.c=d.casa.c; } return; }
      d.d=elegir(d, g.jugador, true, 0.7); mover(d,d.d);
    });
    choques();
  }
  function choques(){
    const j=g.jugador;
    g.dinos.forEach(d=>{
      if(!d.vuelve && d.r===j.r && d.c===j.c){
        d.vuelve=Date.now()+5000; g.raptores++;
        if(window.S){ S.estrellas=(S.estrellas||0)+1; if(typeof guardarJuego==='function') guardarJuego(); }
        if(window.SFX) SFX.correcto();
        if(window.FX){ const b=cv.getBoundingClientRect(); FX.popText(b.left+(j.c+.5)*cel, b.top+(j.r+.5)*cel, '¡Ñam! ⭐', '#ffd23f'); }
        marcador();
      }
    });
    if(Date.now()<g.susto) return;
    if(g.meteoros.some(m=>m.r===j.r && m.c===j.c) && Date.now()>=g.congelado){
      g.susto=Date.now()+1800; j.r=g.inicio.r; j.c=g.inicio.c; g.dir=[0,0]; g.quiere=[0,0];
      if(window.SFX) SFX.animo();
      nota('☄️ ¡Uy, un meteorito! Vuelves al inicio. ¡Sigue!');
    }
  }

  // ---------- dibujo ----------
  function emoji(t, r, c, tam, voltear){
    const x=(c+.5)*cel, y=(r+.55)*cel;
    ctx.save(); ctx.translate(x,y); if(voltear) ctx.scale(-1,1);
    ctx.font=`${Math.floor(cel*(tam||.85))}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(t,0,0); ctx.restore();
  }
  function dibujar(){
    ctx.fillStyle='#16240c'; ctx.fillRect(0,0,W*cel,H*cel);
    for(let r=0;r<H;r++) for(let c=0;c<W;c++){
      if(MAPA[r][c]==='#'){
        ctx.fillStyle='#4a6a1a'; ctx.beginPath();
        if(ctx.roundRect) ctx.roundRect(c*cel+1,r*cel+1,cel-2,cel-2,cel*.25); else ctx.rect(c*cel+1,r*cel+1,cel-2,cel-2);
        ctx.fill();
      }
    }
    Object.entries(g.comida).forEach(([k,ch])=>{
      const [r,c]=k.split(',').map(Number);
      if(ch==='o') emoji('🍖',r,c,.7);
      else { ctx.fillStyle='#f5e6c0'; ctx.beginPath(); ctx.arc((c+.5)*cel,(r+.5)*cel,cel*.12,0,Math.PI*2); ctx.fill(); }
    });
    g.dinos.forEach(d=>{ if(!d.vuelve) emoji('🦎',d.r,d.c,.72); });
    const frio=Date.now()<g.congelado;
    g.meteoros.forEach(m=>emoji(frio?'🧊':'☄️',m.r,m.c,.8));
    const j=g.jugador, parpadeo=Date.now()<g.susto && Math.floor(Date.now()/150)%2;
    if(!parpadeo) emoji('🦖',j.r,j.c,.95,j.mira>0);
  }

  function bucle(t){
    if(!jugando) return;
    const dt=Math.min(100,t-ult); ult=t;
    g.tJ+=dt; g.tM+=dt; g.tD+=dt;
    if(g.tJ>=g.pasoJ){ g.tJ=0; pasoJugador(); }
    if(!jugando) return;
    if(g.tM>=g.pasoM){ g.tM=0; pasoMeteoros(); }
    if(g.tD>=g.pasoJ*1.35){ g.tD=0; pasoDinos(); }
    dibujar();
    raf=requestAnimationFrame(bucle);
  }

  function marcador(){
    document.getElementById('trexFood').textContent=(g.total-g.comidos);
    document.getElementById('trexRap').textContent=g.raptores;
    document.getElementById('trexBar').style.width=(g.comidos/g.total*100)+'%';
  }
  function nota(t){ document.getElementById('trexHint').textContent=t; }

  function ganar(){
    detener(); dibujar();
    nota(`¡Te comiste todos los huesitos! Atrapaste ${g.raptores} raptores 🎉`);
    if(window.DIF) DIF.subir('trex');
    if(window.SFX) SFX.premio();
    if(typeof lanzarConfeti==='function') lanzarConfeti();
    setTimeout(()=>{
      if(window._desdeMundo){ window._desdeMundo=false; if(window.TELEMETRIA) TELEMETRIA.termino(); toast('🦖 ¡Eres el rey de los dinosaurios!'); abrirMundo('dinosaurios'); }
      else if(typeof abrirReto==='function') abrirReto();
    },1500);
  }

  // ---------- controles ----------
  function controles(){
    const fijar=k=>{ if(g) g.quiere=DIRS[k].slice(); };
    // la cruceta la maneja trex-phaser.js (reparte a la versión activa)
    let x0=null,y0=null;
    cv.addEventListener('pointerdown',e=>{ x0=e.clientX; y0=e.clientY; });
    window._trexClasicoPad=fijar;
    cv.addEventListener('pointermove',e=>{
      if(x0===null) return; const dx=e.clientX-x0, dy=e.clientY-y0;
      if(Math.max(Math.abs(dx),Math.abs(dy))<18) return;
      fijar(Math.abs(dx)>Math.abs(dy) ? (dx>0?'der':'izq') : (dy>0?'abajo':'arriba')); x0=e.clientX; y0=e.clientY;
    });
    cv.addEventListener('pointerup',()=>{ x0=null; });
    window.addEventListener('keydown',e=>{
      if(!jugando) return;
      const m={ArrowUp:'arriba',ArrowDown:'abajo',ArrowLeft:'izq',ArrowRight:'der'}[e.key];
      if(m){ e.preventDefault(); fijar(m); }
    });
  }
})();
