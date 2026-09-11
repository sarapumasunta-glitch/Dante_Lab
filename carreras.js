/* ============================================================
   DANTE LAB · Carreras 🏎️
   El piloto cambia según el mundo (pez, guepardo, nave, carro).
   Toca IZQUIERDA / DERECHA (o los lados de la pista) para cambiar
   de carril, esquiva obstáculos y recoge estrellas.
   Sin "perder": si choca, pierde velocidad pero sigue. Al llenar
   la barra de meta, continúa al reto.
   ============================================================ */
(function(){
  const CARRILES = 3;
  const META = 100;           // % para llegar a la meta
  let area, running=false, carril=1, avance=0, filas=[], spawnT=null, rafId=null, tema=null, piloto='🏎️';
  let velocidad=1, cfg=null;

  function tema_(){
    const id = (window.discActual && window.discActual.mundo && window.discActual.mundo.id) || 'oceano';
    var T=window.TEMAS||{}; return T[id]||T.oceano||{};
  }

  window.abrirCarrera = function(){
    tema = tema_(); piloto = tema.carrera.piloto;
    cfg = (window.DIF?DIF.carrera(DIF.nivel('carrera')):{velBase:3.2,spawnMs:900,dobleObstaculo:false,meta:100});
    area = document.getElementById('raceArea');
    area.innerHTML='';
    carril=1; avance=0; velocidad=1; running=true; filas=[];
    // pista de fondo con carriles
    const track=document.createElement('div'); track.className='raceTrack';
    for(let i=1;i<CARRILES;i++){ const ln=document.createElement('div'); ln.className='raceLine'; ln.style.left=(i*100/CARRILES)+'%'; track.appendChild(ln); }
    area.appendChild(track);
    // piloto
    const p=document.createElement('div'); p.className='racer'; p.id='racer'; p.textContent=piloto;
    area.appendChild(p);
    colocarPiloto();
    // fondo temático
    area.style.background='linear-gradient(180deg,'+tema.carrera.pista[0]+','+tema.carrera.pista[1]+')';
    document.getElementById('raceBar').style.width='0%';
    document.getElementById('raceHint').textContent='Toca los lados para esquivar 👈👉';
    document.getElementById('raceBack').onclick=()=>{ detener(); show('v-disc'); };
    // controles: tocar mitad izquierda/derecha del área
    area.ontouchstart=(e)=>{ tocar(e.touches[0].clientX); };
    area.onclick=(e)=>{ tocar(e.clientX); };
    document.getElementById('raceLeft').onclick=()=>mover(-1);
    document.getElementById('raceRight').onclick=()=>mover(1);
    show('v-race');
    programarFilas();
    rafId=requestAnimationFrame(loop);
  };

  function tocar(clientX){
    const r=area.getBoundingClientRect();
    mover(clientX < r.left + r.width/2 ? -1 : 1);
  }
  function mover(dir){
    if(!running) return;
    carril=Math.max(0,Math.min(CARRILES-1,carril+dir));
    colocarPiloto();
    if(window.SFX) SFX.tap();
  }
  function colocarPiloto(){
    const p=document.getElementById('racer'); if(!p) return;
    p.style.left=((carril+0.5)*100/CARRILES)+'%';
  }

  function programarFilas(){
    if(!running) return;
    spawnFila();
    spawnT=setTimeout(programarFilas, Math.max(300, cfg.spawnMs - avance*2));
  }
  function spawnFila(){
    if(!running) return;
    // una fila: en un carril al azar va un obstáculo; en otro, algo bueno
    const cMalo=Math.floor(Math.random()*CARRILES);
    let cMalo2=-1;
    if(cfg.dobleObstaculo && Math.random()<0.4){ cMalo2=Math.floor(Math.random()*CARRILES); if(cMalo2===cMalo) cMalo2=(cMalo2+1)%CARRILES; }
    let cBueno=Math.floor(Math.random()*CARRILES); if(cBueno===cMalo||cBueno===cMalo2) cBueno=(cBueno+1)%CARRILES; if(cBueno===cMalo||cBueno===cMalo2) cBueno=(cBueno+1)%CARRILES;
    for(let c=0;c<CARRILES;c++){
      let emoji=null, tipo=null;
      if(c===cMalo||c===cMalo2){ emoji=tema.carrera.malo[Math.floor(Math.random()*tema.carrera.malo.length)]; tipo='malo'; }
      else if(c===cBueno){ emoji=tema.carrera.bueno[Math.floor(Math.random()*tema.carrera.bueno.length)]; tipo='bueno'; }
      if(emoji){
        const el=document.createElement('div'); el.className='raceItem'; el.textContent=emoji;
        el.style.left=((c+0.5)*100/CARRILES)+'%'; el.style.top='-40px';
        el._y=-40; el._c=c; el._tipo=tipo; el._hit=false;
        area.appendChild(el); filas.push(el);
      }
    }
  }

  function loop(){
    if(!running) return;
    const h=area.clientHeight, racerY=h-64;
    for(const el of filas){
      if(el._done) continue;
      el._y += cfg.velBase*velocidad;
      el.style.top=el._y+'px';
      // colisión con el piloto (mismo carril, misma altura)
      if(!el._hit && el._c===carril && el._y>racerY-30 && el._y<racerY+30){
        el._hit=true;
        if(el._tipo==='malo'){ chocar(el); }
        else { recoger(el); }
      }
      if(el._y>h+20){ el._done=true; el.remove(); }
    }
    filas=filas.filter(e=>!e._done);
    // avanzar la barra de meta con el tiempo
    avance += 0.14*velocidad;
    document.getElementById('raceBar').style.width=Math.min(100,avance)+'%';
    if(avance>=cfg.meta){ ganar(); return; }
    rafId=requestAnimationFrame(loop);
  }

  function recoger(el){
    if(window.FX){ const c=FX.centro(el); FX.burst(c.x,c.y,{n:10,color:'#ffd23f'}); FX.popText(c.x,c.y,'¡+!','#7ac86a'); }
    el._done=true; el.classList.add('pop'); setTimeout(()=>el.remove(),250);
    avance=Math.min(cfg.meta, avance+4);
    if(window.SFX) SFX.correcto();
  }
  function chocar(el){
    el._done=true; el.classList.add('bump'); setTimeout(()=>el.remove(),300);
    velocidad=0.55; setTimeout(()=>{ velocidad=1; }, 700);
    const p=document.getElementById('racer'); if(p){ p.classList.add('shake'); setTimeout(()=>p.classList.remove('shake'),400); }
    if(window.FX){ const c=FX.centro(el); FX.shake(document.getElementById('raceArea'),12); FX.burst(c.x,c.y,{n:8,color:'#ff5a5f'}); }
    if(window.SFX) SFX.animo();
    document.getElementById('raceHint').textContent='¡Uy! Sigue, tú puedes 💪';
  }

  function detener(){ running=false; clearTimeout(spawnT); cancelAnimationFrame(rafId); }
  function ganar(){
    if(!running) return; detener();
    if(window.DIF){ const nv=DIF.subir('carrera'); }
    if(window.SFX) SFX.correcto();
    if(window.FX){ const a=document.getElementById('raceArea'); if(a){ const r=a.getBoundingClientRect(); for(let k=0;k<3;k++) setTimeout(()=>FX.burst(r.left+r.width*(.3+Math.random()*.4), r.top+r.height*(.3+Math.random()*.3),{n:18,spread:110}), k*180); } }
    document.getElementById('raceHint').textContent='🏁 ¡Llegaste a la meta! 🎉 ¡Siguiente nivel más difícil!';
    const p=document.getElementById('racer'); if(p) p.textContent='🏁';
    setTimeout(()=>{ if(typeof abrirReto==='function') abrirReto(); }, 1200);
  }
})();
