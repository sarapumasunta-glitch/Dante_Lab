/* ============================================================
   DANTE LAB · Párame la mano 🔤 (Basta / Stop ecuatoriano)
   Sale una LETRA y Dante elige rápido cuál empieza con ella,
   con cosas de SU mundo. Tiene reloj (pensar rápido) pero
   NUNCA castiga: si se acaba el tiempo o falla, sigue animando.
   ============================================================ */
(function(){
  let T_RONDA = 6, N_RONDAS = 5;
  let tema=null, rondas=[], idx=0, aciertos=0, restante=T_RONDA, timer=null, activo=false;

  function tema_(){
    const id=(window.discActual&&window.discActual.mundo&&window.discActual.mundo.id)||'oceano';
    var T=window.TEMAS||{}; return T[id]||T.oceano||{};
  }

  window.abrirParame = function(){
    tema=tema_();
    var c=(window.DIF?DIF.parame(DIF.nivel('parame')):{tiempo:6,rondas:5}); T_RONDA=c.tiempo; N_RONDAS=c.rondas;
    // mezclar y tomar N rondas
    rondas=(tema.parame.rondas||[]).slice().sort(()=>Math.random()-0.5).slice(0,N_RONDAS);
    idx=0; aciertos=0; activo=true;
    document.getElementById('pmTitle').textContent='Párame la mano · '+tema.parame.titulo;
    document.getElementById('pmBack').onclick=()=>{ pararTimer(); activo=false; show('v-disc'); };
    document.getElementById('pmScore').textContent='0';
    document.getElementById('pmTotal').textContent=rondas.length;
    show('v-parame');
    pintarRonda();
  };

  function pintarRonda(){
    if(idx>=rondas.length){ return fin(); }
    const r=rondas[idx];
    document.getElementById('pmLetter').textContent=r.letra;
    document.getElementById('pmQ').textContent=r.p;
    document.getElementById('pmNum').textContent=(idx+1);
    const cont=document.getElementById('pmOpts'); cont.innerHTML='';
    // barajar opciones manteniendo el índice correcto
    const opts=r.o.map((t,i)=>({t,ok:i===r.ok}));
    opts.sort(()=>Math.random()-0.5);
    opts.forEach(o=>{
      const b=document.createElement('button'); b.className='pmOpt'; b.textContent=o.t;
      b.onclick=()=>responder(b,o.ok);
      cont.appendChild(b);
    });
    const pmTimeWrap=document.querySelector('.pmTimeWrap');
    const pmTimeChip=document.getElementById('pmTime')?document.getElementById('pmTime').closest('.catchTime'):null;
    restante=T_RONDA; pintarReloj(); pararTimer();
    if(T_RONDA>=999){ if(pmTimeWrap)pmTimeWrap.style.display='none'; if(pmTimeChip)pmTimeChip.style.display='none'; }
    else { if(pmTimeWrap)pmTimeWrap.style.display=''; if(pmTimeChip)pmTimeChip.style.display='';
      timer=setInterval(()=>{ restante--; pintarReloj(); if(restante<=0){ pararTimer(); tiempoFuera(); } },1000);
    }
  }

  function pintarReloj(){
    document.getElementById('pmTime').textContent=Math.max(0,restante);
    const bar=document.getElementById('pmTimeBar');
    if(bar) bar.style.width=(Math.max(0,restante)/T_RONDA*100)+'%';
  }
  function pararTimer(){ if(timer){ clearInterval(timer); timer=null; } }

  function responder(btn, ok){
    if(!activo) return;
    pararTimer();
    const botones=document.querySelectorAll('#pmOpts .pmOpt');
    botones.forEach(b=>b.disabled=true);
    if(ok){
      btn.classList.add('right'); aciertos++;
      if(window.FX){ const c=FX.centro(btn); FX.burst(c.x,c.y,{n:14}); FX.sparkle(c.x,c.y); FX.popText(c.x,c.y-20,'¡Bien!','#7ac86a'); }
      document.getElementById('pmScore').textContent=aciertos;
      if(window.SFX) SFX.correcto();
    }else{
      botones.forEach(b=>{ if(b.textContent && rondas[idx].o[rondas[idx].ok] && b.textContent===rondas[idx].o[rondas[idx].ok]) b.classList.add('right'); });
      if(window.SFX) SFX.animo();
      document.getElementById('pmHint').textContent='¡Casi! Esta era 😊';
    }
    idx++;
    setTimeout(pintarRonda, 900);
  }

  function tiempoFuera(){
    if(!activo) return;
    const botones=document.querySelectorAll('#pmOpts .pmOpt');
    botones.forEach(b=>{ b.disabled=true; if(b.textContent===rondas[idx].o[rondas[idx].ok]) b.classList.add('right'); });
    document.getElementById('pmHint').textContent='¡Rápido la próxima! ⏱️';
    if(window.SFX) SFX.tap();
    idx++;
    setTimeout(pintarRonda, 1000);
  }

  function fin(){
    activo=false; pararTimer();
    if(window.DIF) DIF.subir('parame');
    // mensaje según desempeño, siempre positivo
    const msg = aciertos>=rondas.length-1 ? '¡Increíble memoria! 🌟'
              : aciertos>=Math.ceil(rondas.length/2) ? '¡Muy bien pensado! 💪'
              : '¡Buen intento! Cada vez más rápido 🚀';
    document.getElementById('pmHint').textContent=msg;
    if(window.SFX) SFX.premio();
    setTimeout(()=>{ if(typeof abrirReto==='function') abrirReto(); }, 1200);
  }
})();
