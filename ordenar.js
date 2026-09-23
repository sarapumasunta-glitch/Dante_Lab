/* ============================================================
   DANTE LAB · Ordena el sistema solar 🪐
   Toca los planetas en orden, del más cercano al Sol al más lejano.
   - Aventura: contra reloj (el tiempo baja al subir de nivel)
   - Calma: sin reloj
   Sin "perder": si se acaba el tiempo, sigue jugando sin reloj.
   ============================================================ */
(function(){
  const COLOR = { es7:'#9a9a9a', es8:'#e8c060', es9:'#3a8ad0', es4:'#d0502a', es10:'#d8955a', es2:'#e0c080', es11:'#7ad8e0', es12:'#3a5ad8' };
  const TAM   = { es7:26, es8:34, es9:36, es4:30, es10:54, es2:48, es11:40, es12:40 };
  let st=null, reloj=null;

  function planetas(){
    const E=(window.MUNDOS||[]).find(m=>m.id==='espacio');
    return E ? E.descubrimientos.filter(d=>d.orden).sort((a,b)=>a.orden-b.orden) : [];
  }
  const barajar=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  function bola(d, px){
    const s=px||TAM[d.id]||36, c=COLOR[d.id]||'#888';
    const anillo = d.id==='es2' ? `<i class="oRing" style="width:${s*1.6}px;height:${s*0.45}px"></i>` : '';
    return `<span class="oBall" style="width:${s}px;height:${s}px;background:radial-gradient(circle at 35% 30%,#fff8,${c} 45%,${c})">${anillo}</span>`;
  }
  window.bolaPlaneta = bola;

  window.abrirOrdenar = function(){
    const lista=planetas(); if(lista.length<8){ toast('Faltan planetas para este juego'); return; }
    // si se lanza sin una ficha de planeta, usar uno para el reto final
    if(!window.discActual || !window.discActual.d || !window.discActual.d.orden || window._desdeArcade){
      const E=(window.MUNDOS||[]).find(m=>m.id==='espacio');
      const pend=lista.filter(d=>!(window.S&&S.coleccion[d.id]));
      const d=(pend.length?pend:lista)[Math.floor(Math.random()*(pend.length?pend:lista).length)];
      window.discActual={mundo:E, d}; try{ discActual=window.discActual; }catch(e){}
    }
    const calma = window.DIF ? DIF.tranquilo() : false;
    const lv = window.DIF ? DIF.nivel('ordenar') : 1;
    st={ lista, i:0, tiempo: calma?0:Math.max(30, 75-(lv-1)*7), fin:false };
    document.getElementById('oBack').onclick=()=>{ parar(); if(window._desdeMundo){ window._desdeMundo=false; abrirMundo('espacio'); } else show('v-disc'); };
    // órbita con huecos
    document.getElementById('oSlots').innerHTML = '<span class="oSun">☀️</span>' + lista.map((d,k)=>`<span class="oSlot" id="oS${k}">${k+1}</span>`).join('');
    // planetas mezclados
    const P=document.getElementById('oPool'); P.innerHTML='';
    barajar(lista).forEach(d=>{
      const b=document.createElement('button'); b.className='oPlanet'; b.dataset.id=d.id;
      b.innerHTML=bola(d)+`<span class="oName">${d.corto||d.nombre}</span>`;
      b.onclick=()=>tocar(b,d); P.appendChild(b);
    });
    nota('Toca el planeta más cercano al Sol ☀️');
    pintarReloj();
    parar();
    if(st.tiempo){ reloj=setInterval(()=>{ st.tiempo--; pintarReloj();
      if(st.tiempo<=0){ parar(); st.tiempo=0; pintarReloj(); nota('¡Se acabó el tiempo! Sigue sin reloj, tú puedes 😊'); } },1000); }
    show('v-orden');
  };
  function parar(){ if(reloj){ clearInterval(reloj); reloj=null; } }
  window.pararOrdenar=parar;
  function pintarReloj(){
    const el=document.getElementById('oTime');
    el.style.display = st.tiempo? '' : 'none';
    el.textContent='⏱️ '+st.tiempo+' s';
    el.classList.toggle('poco', st.tiempo>0 && st.tiempo<=10);
  }
  function nota(t){ document.getElementById('oHint').textContent=t; }

  function tocar(btn,d){
    if(st.fin) return;
    const esperado=st.lista[st.i];
    if(d.id===esperado.id){
      if(window.SFX) SFX.correcto();
      const slot=document.getElementById('oS'+st.i);
      slot.innerHTML=bola(d,22); slot.classList.add('ok');
      btn.classList.add('gone'); setTimeout(()=>btn.remove(),250);
      if(window.FX){ const c=FX.centro(slot); FX.burst(c.x,c.y,{n:8}); }
      st.i++;
      if(st.i===st.lista.length){ return ganar(); }
      nota(`¡Muy bien! ${d.corto||d.nombre} es el número ${d.orden}. ¿Cuál sigue?`);
    } else {
      if(window.SFX) SFX.animo();
      btn.classList.remove('wiggle'); void btn.offsetWidth; btn.classList.add('wiggle');
      nota(`${d.corto||d.nombre} está más lejos. Busca uno más cercano al Sol ☀️`);
    }
  }
  function ganar(){
    st.fin=true; parar();
    nota('¡Ordenaste el sistema solar completo! 🎉');
    if(window.DIF) DIF.subir('ordenar');
    if(window.SFX) SFX.premio();
    if(typeof lanzarConfeti==='function') lanzarConfeti();
    setTimeout(()=>{
      if(window._desdeMundo){ window._desdeMundo=false; if(window.TELEMETRIA) TELEMETRIA.termino(); toast('🪐 ¡Eres un experto del espacio!'); abrirMundo('espacio'); }
      else if(typeof abrirReto==='function') abrirReto();
    },1400);
  }
})();
