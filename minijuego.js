/* ============================================================
   DANTE LAB · mini-juego "Atrapa el tesoro"
   Caen tesoros del mundo; Dante los toca para llenar la barra.
   Al llegar a la meta (o acabar el tiempo) sigue al reto/quiz.
   Ligero: sin librerías, usa emojis y los sonidos existentes.
   ============================================================ */
(function(){
  let META = 8, TIEMPO = 12, VELB=2.2, SPAWNMS=450;
  let area, running=false, timer=null, spawnT=null, caidos=[], atrapados=0, restante=TIEMPO, rafId=null, lastTs=0;

  // emojis por mundo (tesoros buenos) y algún distractor
  const BUENOS = {
    oceano:['🐟','🐠','🦀','🐚','⭐','🐡'],
    animales:['🦋','🐛','🍃','🐞','⭐','🌸'],
    espacio:['⭐','🌟','☄️','🪐','✨','🌙'],
    lugares:['⭐','🗝️','💎','🎫','✨','🧭']
  };

  function areaEl(){ return document.getElementById('catchArea'); }

  window.abrirMiniJuego = function(){
    var c=(window.DIF?DIF.atrapa(DIF.nivel('atrapa')):{meta:8,tiempo:12,velBase:2.2,spawnMs:450}); META=c.meta;TIEMPO=c.tiempo;VELB=c.velBase;SPAWNMS=c.spawnMs;
    // preparar
    area = areaEl();
    area.innerHTML='';
    caidos=[]; atrapados=0; restante=TIEMPO; running=true; lastTs=0;
    document.getElementById('catchN').textContent='0';
    document.getElementById('catchGoal').textContent=META;
    document.getElementById('catchT').textContent=TIEMPO;
    document.getElementById('catchBar').style.width='0%';
    document.getElementById('catchHint').textContent='¡Toca los tesoros que caen! 👆';
    document.getElementById('catchBack').onclick=()=>{ detener(); show('v-disc'); };
    show('v-catch');

    const catchTimeEl=document.getElementById('catchT').closest('.catchTime');
    if(TIEMPO>=999){ if(catchTimeEl) catchTimeEl.style.display='none'; }
    else { if(catchTimeEl) catchTimeEl.style.display='';
      timer=setInterval(()=>{ restante--; document.getElementById('catchT').textContent=Math.max(0,restante); if(restante<=0) finJuego(); },1000);
    }
    // aparición de tesoros
    programarSpawn();
    // animación de caída
    rafId=requestAnimationFrame(loop);
  };

  function mundoActualId(){
    try { return (window.discActual && window.discActual.mundo && window.discActual.mundo.id) || 'oceano'; }
    catch(e){ return 'oceano'; }
  }

  function programarSpawn(){
    if(!running) return;
    spawn();
    const prox = 480 + Math.random()*420; // cada ~0.5-0.9s
    spawnT=setTimeout(programarSpawn, prox);
  }

  function spawn(){
    if(!running) return;
    const set = BUENOS[mundoActualId()] || BUENOS.oceano;
    const emoji = set[Math.floor(Math.random()*set.length)];
    const el=document.createElement('div');
    el.className='falling';
    el.textContent=emoji;
    const w=area.clientWidth;
    const x=Math.max(6, Math.random()*(w-56));
    el.style.left=x+'px';
    el.style.top='-60px';
    el._y=-60;
    el._vy=VELB + Math.random()*1.5;
    el._x=x;
    el.addEventListener('touchstart', (ev)=>{ ev.preventDefault(); atrapar(el); }, {passive:false});
    el.addEventListener('click', ()=>atrapar(el));
    area.appendChild(el);
    caidos.push(el);
  }

  function atrapar(el){
    if(!running || el._done) return;
    el._done=true;
    atrapados++;
    document.getElementById('catchN').textContent=atrapados;
    document.getElementById('catchBar').style.width=Math.min(100,(atrapados/META)*100)+'%';
    if(window.SFX) SFX.tap();
    if(window.FX){ const c=FX.centro(el); FX.burst(c.x,c.y,{n:12}); FX.sparkle(c.x,c.y); FX.popText(c.x,c.y,'+1','#3ac0c0'); }
    el.classList.add('pop');
    setTimeout(()=>{ el.remove(); caidos=caidos.filter(c=>c!==el); },260);
    if(atrapados>=META) ganar();
  }

  function loop(ts){
    if(!running) return;
    if(!lastTs) lastTs=ts;
    lastTs=ts;
    const h=area.clientHeight;
    for(const el of caidos){
      if(el._done) continue;
      el._y += el._vy;
      el.style.transform='translateY('+el._y+'px)';
      if(el._y > h+10){ el.remove(); el._done=true; }
    }
    caidos=caidos.filter(c=>!c._done || c.classList.contains('pop'));
    rafId=requestAnimationFrame(loop);
  }

  function detener(){
    running=false;
    clearInterval(timer); clearTimeout(spawnT); cancelAnimationFrame(rafId);
  }

  function ganar(){
    if(window.DIF) DIF.subir('atrapa');
    if(!running) return;
    detener();
    if(window.SFX) SFX.correcto();
    if(window.FX){ const a=document.getElementById('catchArea'); if(a){ const r=a.getBoundingClientRect(); for(let k=0;k<3;k++) setTimeout(()=>FX.burst(r.left+r.width*(.3+Math.random()*.4), r.top+r.height*(.3+Math.random()*.3),{n:18,spread:110}), k*180); } }
    document.getElementById('catchHint').textContent='¡Lo lograste! 🎉 Ahora, una pregunta…';
    setTimeout(()=>{ if(typeof abrirReto==='function') abrirReto(); }, 900);
  }

  function finJuego(){
    // se acabó el tiempo: igual continúa (nunca castiga), pero anima según logro
    detener();
    const ok = atrapados>=Math.ceil(META/2);
    document.getElementById('catchHint').textContent = ok ? '¡Muy bien! Sigamos… 💪' : '¡Buen intento! Sigamos… 💪';
    if(window.SFX){ ok?SFX.correcto():SFX.tap(); }
    setTimeout(()=>{ if(typeof abrirReto==='function') abrirReto(); }, 900);
  }
})();
