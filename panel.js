/* ============================================================
   DANTE LAB · Panel para adultos (validación del MVP)
   - Acceso con una pregunta para adultos
   - Muestra qué engancha: tiempo, mundos, juegos, globo, voz, opiniones
   - Compartir resultados (texto) o borrar datos de prueba
   ============================================================ */
(function(){
  const NOMBRES_JUEGO = { atrapa:'Atrapa el tesoro', laberinto:'Laberinto', carreras:'Carreras', parame:'Párame la mano',
    laser:'Láser', rayuela:'Rayuela', constructor:'Taller de bloques', penales:'Penales', tablero:'Tablero',
    sopa:'Sopa de letras', rompecabezas:'Rompecabezas', trivia:'Trivia', ordenar:'Sistema solar', trex:'T-Rex (clásico)', trex2:'T-Rex (nuevo)' };
  const OC = { pacifico:'Pacífico', atlantico:'Atlántico', indico:'Índico', artico:'Ártico', austral:'Antártico' };
  const CARAS = { genial:'😍', bien:'🙂', normal:'😐', aburrido:'😴' };
  let respuesta=0;

  function nombreMundo(id){ const m=(window.MUNDOS||[]).find(x=>x.id===id); return m?m.emoji+' '+m.nombre:id; }
  function nombreFicha(id){ for(const m of (window.MUNDOS||[])){ const d=m.descubrimientos.find(x=>x.id===id); if(d) return d.nombre; } return id; }
  function nombrePais(iso){ const g=window.MAPA_TOPO&&MAPA_TOPO.objects.countries.geometries.find(x=>x.id===iso); return g?g.properties.n:iso; }
  function perfiles(){ try{ return JSON.parse(localStorage.getItem('danteLab_perfiles')||'[]'); }catch(e){ return []; } }
  function opiniones(){ try{ return JSON.parse(localStorage.getItem('danteLab_opiniones')||'[]'); }catch(e){ return []; } }
  function min(seg){ const m=Math.round(seg/60); return m<60? m+' min' : Math.floor(m/60)+' h '+(m%60)+' min'; }
  function top(obj,n){ return Object.entries(obj||{}).sort((a,b)=>b[1]-a[1]).slice(0,n||5); }

  // ---------- acceso ----------
  window.abrirAccesoAdultos = function(){
    const a=6+Math.floor(Math.random()*4), b=6+Math.floor(Math.random()*4); respuesta=a*b;
    document.getElementById('adQ').textContent=`¿Cuánto es ${a} × ${b}?`;
    const i=document.getElementById('adIn'); i.value=''; document.getElementById('adMsg').textContent='';
    document.getElementById('adultGate').classList.add('show');
    setTimeout(()=>i.focus(),150);
  };
  window.cerrarAccesoAdultos = function(){ document.getElementById('adultGate').classList.remove('show'); };
  window.validarAdulto = function(){
    const v=parseInt(document.getElementById('adIn').value,10);
    if(v===respuesta){ cerrarAccesoAdultos(); abrirPanel(); }
    else document.getElementById('adMsg').textContent='Esa no es la respuesta. Esta sección es para adultos.';
  };

  // ---------- panel ----------
  function datos(){
    const m=window.TELEMETRIA?TELEMETRIA.leer():{}; const ps=perfiles();
    return { m, lista:Object.entries(m.perfiles||{}).map(([id,p])=>({ id, p, nombre:(ps.find(x=>x.id===id)||{}).nombre||'Jugador' })) };
  }

  function bloquePerfil(x){
    const p=x.p, dias=Object.keys(p.dias||{}), seg=Object.values(p.dias||{}).reduce((a,b)=>a+b,0);
    const juegos=Object.entries(p.juegos||{}).sort((a,b)=>b[1].jugadas-a[1].jugadas);
    const maxJ=Math.max(1,...juegos.map(j=>j[1].jugadas));
    const mundos=top(p.mundos,6), maxM=Math.max(1,...mundos.map(m=>m[1]));
    const fichasVistas=Object.keys(p.fichas||{}).length;
    const total=(window.MUNDOS||[]).reduce((a,m)=>a+m.descubrimientos.length,0);
    const paises=top(p.globo.paises,5).map(([k,v])=>nombrePais(k)+' ('+v+')').join(', ')||'—';
    const oceanos=top(p.globo.oceanos,5).map(([k,v])=>(OC[k]||k)+' ('+v+')').join(', ')||'—';
    const barra=(txt,v,max,extra)=>`<div class="pRow"><span class="pLbl">${txt}</span><span class="pBar"><i style="width:${Math.round(v/max*100)}%"></i></span><span class="pVal">${extra||v}</span></div>`;
    return `<div class="pCard">
      <div class="pName">${x.nombre}</div>
      <div class="pKpis">
        <div><b>${min(seg)}</b><span>tiempo de juego</span></div>
        <div><b>${dias.length}</b><span>días que jugó</span></div>
        <div><b>${fichasVistas}/${total}</b><span>fichas abiertas</span></div>
      </div>
      <div class="pSub">Mundos que más visita</div>
      ${mundos.length? mundos.map(([k,v])=>barra(nombreMundo(k),v,maxM)).join('') : '<p class="pEmpty">Aún no visita mundos.</p>'}
      <div class="pSub">Juegos (terminadas / empezadas)</div>
      ${juegos.length? juegos.map(([k,v])=>barra(NOMBRES_JUEGO[k]||k,v.jugadas,maxJ,v.terminadas+'/'+v.jugadas)).join('') : '<p class="pEmpty">Aún no juega.</p>'}
      ${p.estrellas&&p.estrellas.trex2?`<div class="pSub">Piloto T-Rex nuevo: estrellas por partida</div><p class="pTxt">⭐ ${p.estrellas.trex2[0]} · ⭐⭐ ${p.estrellas.trex2[1]} · ⭐⭐⭐ ${p.estrellas.trex2[2]}</p>`:''}
      <div class="pSub">Planeta Tierra</div>
      <p class="pTxt">Lo abrió <b>${p.globo.aperturas}</b> veces. Países que tocó: ${paises}. Océanos: ${oceanos}.</p>
      <div class="pSub">Escúchalo</div>
      <p class="pTxt">Usó la lectura en voz alta <b>${p.voz}</b> veces.</p>
    </div>`;
  }

  window.abrirPanel = function(){
    const {m,lista}=datos(), ops=opiniones();
    const cuenta={}; ops.forEach(o=>cuenta[o.valor]=(cuenta[o.valor]||0)+1);
    const c=document.getElementById('panelBody');
    c.innerHTML = `
      <p class="pIntro">Datos de prueba de este dispositivo${m.desde?' desde el '+new Date(m.desde).toLocaleDateString('es-EC'):''}. Se guardan solo aquí: nada se envía a internet.</p>
      ${lista.length? lista.map(bloquePerfil).join('') : '<div class="pCard"><p class="pEmpty">Todavía no hay datos. Deja que el niño juegue y vuelve aquí.</p></div>'}
      <div class="pCard">
        <div class="pSub">¿Te gustó? (opinión del niño)</div>
        <div class="pFaces">${Object.keys(CARAS).map(k=>`<div><span>${CARAS[k]}</span><b>${cuenta[k]||0}</b></div>`).join('')}</div>
      </div>
      <button class="bigBtn" onclick="compartirPanel()">📤 Compartir resultados</button>
      <button class="pDanger" onclick="borrarPanel()">🗑️ Borrar datos de prueba</button>`;
    show('v-panel');
  };

  function textoResumen(){
    const {m,lista}=datos(), ops=opiniones(), cuenta={}; ops.forEach(o=>cuenta[o.valor]=(cuenta[o.valor]||0)+1);
    let t='DANTE LAB · resultados de prueba\n';
    if(m.desde) t+='Desde: '+new Date(m.desde).toLocaleDateString('es-EC')+'\n';
    lista.forEach(x=>{
      const p=x.p, seg=Object.values(p.dias||{}).reduce((a,b)=>a+b,0);
      t+='\n👤 '+x.nombre+'\n';
      t+='Tiempo: '+min(seg)+' · Días: '+Object.keys(p.dias||{}).length+' · Fichas abiertas: '+Object.keys(p.fichas||{}).length+'\n';
      t+='Mundos: '+(top(p.mundos,6).map(([k,v])=>nombreMundo(k)+' '+v).join(', ')||'—')+'\n';
      t+='Juegos (terminadas/empezadas): '+(Object.entries(p.juegos||{}).map(([k,v])=>(NOMBRES_JUEGO[k]||k)+' '+v.terminadas+'/'+v.jugadas).join(', ')||'—')+'\n';
      t+='Globo: '+p.globo.aperturas+' veces · Países: '+(top(p.globo.paises,5).map(([k,v])=>nombrePais(k)+' '+v).join(', ')||'—')+'\n';
      t+='Voz: '+p.voz+' veces\n';
      if(p.estrellas&&p.estrellas.trex2) t+='T-Rex nuevo, estrellas (1/2/3): '+p.estrellas.trex2.join('/')+'\n';
    });
    t+='\nOpinión: '+Object.keys(CARAS).map(k=>CARAS[k]+' '+(cuenta[k]||0)).join('  ')+'\n';
    return t;
  }
  window.compartirPanel = async function(){
    const t=textoResumen();
    try{ if(navigator.share){ await navigator.share({title:'DANTE LAB · resultados', text:t}); return; } }catch(e){ if(e&&e.name==='AbortError') return; }
    try{ await navigator.clipboard.writeText(t); toast('📋 Resultados copiados. Pégalos en WhatsApp o correo.'); }
    catch(e){ toast('No se pudo compartir en este dispositivo.'); }
  };
  window.borrarPanel = function(){
    if(!confirm('¿Borrar los datos de prueba? El progreso del juego no se borra.')) return;
    try{ localStorage.removeItem(window.TELEMETRIA?TELEMETRIA.KEY:'danteLab_metricas'); localStorage.removeItem('danteLab_opiniones'); }catch(e){}
    toast('🗑️ Datos de prueba borrados'); abrirPanel();
  };
})();
