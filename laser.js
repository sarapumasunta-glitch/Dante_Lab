/* ============================================================
   DANTE LAB · Puntería láser 🎯
   Aparecen blancos por poco tiempo; Dante los toca rápido para
   sumar. Hay un blanco "malo" que NO debe tocar. Temática láser
   con destellos, adaptada al mundo. Reto de puntería + rapidez.
   Sin "perder": el reloj termina y sigue animando.
   ============================================================ */
(function(){
  let META = 12, TIEMPO = 15, VIDA=800, SPAWN=650, PROBMALO=0.22;
  let area, tema=null, aciertos=0, restante=TIEMPO, running=false, spawnT=null, timer=null;

  function tema_(){
    const id=(window.discActual&&window.discActual.mundo&&window.discActual.mundo.id)||'oceano';
    var T=window.TEMAS||{}; return T[id]||T.oceano||{};
  }

  window.abrirLaser = function(){
    tema=tema_();
    var c = (window.DIF?DIF.laser(DIF.nivel('laser')):{meta:12,tiempo:15,vidaMs:800,spawnMs:650,probMalo:0.22});
    META=c.meta; TIEMPO=c.tiempo; VIDA=c.vidaMs; SPAWN=c.spawnMs; PROBMALO=c.probMalo;
    area=document.getElementById('laserArea');
    area.innerHTML='';
    aciertos=0; restante=TIEMPO; running=true;
    area.style.background='radial-gradient(circle at 50% 40%, '+tema.laser.fondo[1]+', '+tema.laser.fondo[0]+')';
    document.getElementById('laserN').textContent='0';
    document.getElementById('laserGoal').textContent=META;
    document.getElementById('laserT').textContent=TIEMPO;
    const laserTimeEl=document.getElementById('laserT').closest('.catchTime');
    if(TIEMPO>=999){ if(laserTimeEl) laserTimeEl.style.display='none'; } else if(laserTimeEl){ laserTimeEl.style.display=''; }
    document.getElementById('laserBar').style.width='0%';
    document.getElementById('laserHint').textContent='¡Toca los blancos! Evita el '+tema.laser.evitar;
    document.getElementById('laserBack').onclick=()=>{ detener(); show('v-disc'); };
    show('v-laser');
    if(TIEMPO<999) timer=setInterval(()=>{ restante--; document.getElementById('laserT').textContent=Math.max(0,restante); if(restante<=0) fin(); },1000);
    programar();
  };

  function programar(){
    if(!running) return;
    spawn();
    spawnT=setTimeout(programar, SPAWN + Math.random()*250);
  }

  function spawn(){
    if(!running) return;
    const esMalo = Math.random() < PROBMALO;
    const set = tema.laser.blancos;
    const emoji = esMalo ? tema.laser.evitar : set[Math.floor(Math.random()*set.length)];
    const el=document.createElement('div');
    el.className='laserTarget'+(esMalo?' bad':'');
    el.innerHTML='<span class="ring"></span><span class="em">'+emoji+'</span>';
    const w=area.clientWidth, h=area.clientHeight;
    const x=Math.max(8, Math.random()*(w-72));
    const y=Math.max(8, Math.random()*(h-72));
    el.style.left=x+'px'; el.style.top=y+'px';
    el._malo=esMalo; el._done=false;
    const vida=VIDA + Math.random()*300;
    el.addEventListener('touchstart',(ev)=>{ev.preventDefault(); pegar(el);},{passive:false});
    el.addEventListener('click',()=>pegar(el));
    area.appendChild(el);
    // auto-desaparecer
    el._t=setTimeout(()=>{ if(!el._done){ el._done=true; el.classList.add('fade'); setTimeout(()=>el.remove(),200); } }, vida);
  }

  function pegar(el){
    if(!running || el._done) return;
    el._done=true; clearTimeout(el._t);
    const c = window.FX ? FX.centro(el) : null;
    if(el._malo){
      el.classList.add('boom');
      aciertos=Math.max(0,aciertos-1);
      if(window.SFX) SFX.animo();
      if(window.FX && c){ FX.shake(document.getElementById('laserArea'),10); FX.burst(c.x,c.y,{color:'#ff5a5f',n:10}); }
      document.getElementById('laserHint').textContent='¡Ese no! 😅 Sigue';
    }else{
      el.classList.add('hit');
      aciertos++;
      if(window.SFX) SFX.tap();
      if(window.FX && c){ FX.burst(c.x,c.y,{n:12}); FX.sparkle(c.x,c.y); FX.popText(c.x,c.y,'+1','#ffd23f'); }
    }
    document.getElementById('laserN').textContent=aciertos;
    document.getElementById('laserBar').style.width=Math.min(100,(aciertos/META)*100)+'%';
    setTimeout(()=>el.remove(),220);
    if(aciertos>=META) ganar();
  }

  function detener(){ running=false; clearTimeout(spawnT); clearInterval(timer); }
  function ganar(){
    if(!running) return; detener();
    if(window.DIF) DIF.subir('laser');
    if(window.SFX) SFX.correcto();
    if(window.FX){ const a=document.getElementById('laserArea'); if(a){ const r=a.getBoundingClientRect(); for(let k=0;k<3;k++) setTimeout(()=>FX.burst(r.left+r.width*(.3+Math.random()*.4), r.top+r.height*(.3+Math.random()*.3),{n:18,spread:110}), k*180); } }
    document.getElementById('laserHint').textContent='🎯 ¡Puntería perfecta! 🎉 ¡Siguiente nivel más rápido!';
    setTimeout(()=>{ if(typeof abrirReto==='function') abrirReto(); }, 1200);
  }
  function fin(){
    detener();
    const ok=aciertos>=Math.ceil(META/2);
    document.getElementById('laserHint').textContent= ok?'¡Gran puntería! 💪':'¡Buen intento! 💪';
    if(window.SFX){ ok?SFX.correcto():SFX.tap(); }
    setTimeout(()=>{ if(typeof abrirReto==='function') abrirReto(); }, 1000);
  }
})();
