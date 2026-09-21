/* ============================================================
   DANTE LAB · Penales ⚽ (deportes / timing)
   Vuela una pelota hacia una de 3 zonas de la portería.
   Dante toca la zona correcta ANTES de que llegue para atajar.
   Mecánica nueva: reflejos + anticipación. Temático por mundo.
   Sin "perder": si no ataja, la pelota entra pero sigue animando.
   ============================================================ */
(function(){
  const META = 6;          // atajadas para ganar
  let running=false, atajadas=0, tiros=0, tema=null, guante='🧤', pelota='⚽', porteria='🥅', turnoT=null, animT=null, zonaObjetivo=1, faseVuelo=false;

  const TEMAS_PEN = {
    oceano:  { pelota:'🐡', guante:'🐙', fondo:['#0d3a66','#2a7ab0'] },
    animales:{ pelota:'⚽', guante:'🦁', fondo:['#1a5a2a','#3aa85a'] },
    espacio: { pelota:'☄️', guante:'🚀', fondo:['#1a0a4a','#4a2a8a'] },
    lugares: { pelota:'⚽', guante:'🧤', fondo:['#5a4a2a','#8a6a3a'] }
  };

  function temaMundo(){ const id=(window.discActual&&window.discActual.mundo&&window.discActual.mundo.id)||'oceano'; return TEMAS_PEN[id]||TEMAS_PEN.oceano; }

  window.abrirPenales = function(){
    tema=temaMundo(); pelota=tema.pelota; guante=tema.guante;
    running=true; atajadas=0; tiros=0;
    const area=document.getElementById('penArea');
    area.style.background='linear-gradient(180deg,'+tema.fondo[1]+','+tema.fondo[0]+')';
    document.getElementById('penN').textContent='0';
    document.getElementById('penGoal').textContent=META;
    document.getElementById('penBar').style.width='0%';
    document.getElementById('penHint').textContent='¡Toca dónde va la pelota para atajar! 🧤';
    document.getElementById('penBack').onclick=()=>{ detener(); show('v-disc'); };
    // pintar portería con 3 zonas y el guante
    pintarPorteria();
    show('v-pen');
    setTimeout(nuevoTiro, 800);
  };

  function pintarPorteria(){
    const p=document.getElementById('penPorteria');
    p.innerHTML =
      '<div class="penZona" data-z="0">'+
      '</div><div class="penZona" data-z="1"></div><div class="penZona" data-z="2"></div>'+
      '<div class="penGuante" id="penGuante">'+guante+'</div>'+
      '<div class="penBall" id="penBall" style="opacity:0">'+pelota+'</div>';
    document.querySelectorAll('#penPorteria .penZona').forEach(z=>{
      z.onclick=()=>tocarZona(parseInt(z.dataset.z));
    });
  }

  function nuevoTiro(){
    if(!running) return;
    faseVuelo=true;
    zonaObjetivo=Math.floor(Math.random()*3);
    document.getElementById('penHint').textContent='👀 ¡Mira bien y toca la zona!';
    const ball=document.getElementById('penBall');
    ball.style.opacity='1';
    // la pelota empieza abajo-centro y "vuela" hacia la zona objetivo
    ball.style.left='50%'; ball.style.bottom='6px'; ball.style.transform='translateX(-50%) scale(.6)';
    // animar hacia la zona (arriba)
    const destX = zonaObjetivo===0?'22%':(zonaObjetivo===1?'50%':'78%');
    requestAnimationFrame(()=>{
      ball.style.transition='all 1.05s cubic-bezier(.4,.1,.7,1)';
      ball.style.left=destX; ball.style.bottom='60%'; ball.style.transform='translateX(-50%) scale(1.15)';
    });
    // ventana para atajar: se resuelve cuando "llega"
    clearTimeout(turnoT);
    turnoT=setTimeout(()=>resolverTiro(null), 1100);
  }

  let tocada=null;
  function tocarZona(z){
    if(!running || !faseVuelo) return;
    tocada=z;
    // mover el guante a esa zona
    const g=document.getElementById('penGuante');
    g.style.left = z===0?'22%':(z===1?'50%':'78%');
    if(window.SFX) SFX.tap();
    resolverTiro(z);
  }

  function resolverTiro(z){
    if(!faseVuelo) return;
    faseVuelo=false; clearTimeout(turnoT);
    tiros++;
    const atajo = (z!==null && z===zonaObjetivo);
    const ball=document.getElementById('penBall');
    if(atajo){
      atajadas++;
      document.getElementById('penN').textContent=atajadas;
      document.getElementById('penBar').style.width=Math.min(100,(atajadas/META)*100)+'%';
      document.getElementById('penHint').textContent='🧤 ¡ATAJADA! ¡Genial!';
      if(window.SFX) SFX.correcto();
      if(window.FX){ const r=ball.getBoundingClientRect(); FX.burst(r.left+r.width/2,r.top+r.height/2,{n:16}); FX.popText(r.left+r.width/2,r.top,'¡ATAJADA!','#2fd479'); }
    }else{
      document.getElementById('penHint').textContent='⚽ ¡Gol! Casi lo atajas, sigue 💪';
      if(window.SFX) SFX.animo();
      if(window.FX){ FX.shake(document.getElementById('penArea'),8); }
    }
    ball.style.transition='opacity .3s'; ball.style.opacity='0';
    tocada=null;
    if(atajadas>=META){ return ganar(); }
    setTimeout(nuevoTiro, 900);
  }

  function detener(){ running=false; clearTimeout(turnoT); clearTimeout(animT); }
  function ganar(){
    detener();
    if(window.SFX) SFX.premio();
    if(window.DIF) DIF.subir('penales');
    document.getElementById('penHint').textContent='🏆 ¡Eres un gran arquero! 🎉';
    if(window.FX){ const a=document.getElementById('penArea'); const r=a.getBoundingClientRect(); for(let k=0;k<3;k++) setTimeout(()=>FX.burst(r.left+r.width*(.3+Math.random()*.4),r.top+r.height*.3,{n:18,spread:110}),k*180); }
    setTimeout(()=>{ if(typeof abrirReto==='function') abrirReto(); }, 1200);
  }
})();
