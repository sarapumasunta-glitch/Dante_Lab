/* ============================================================
   DANTE LAB · Taller creativo
   Dos modos:
   1) COLOREAR: plantilla con numeros; cada numero es un color.
      Al pintar se revela un dibujo y se compara con la FOTO REAL.
   2) LIBRE: cuadricula en blanco para construir/pintar libre.
   ============================================================ */
(function(){
  const COLS=12, ROWS=14;
  let modo='menu', colorSel='#e74c3c', pintando=false, grid=[], plantillaActual=null, colorNumSel=1;
  const PALETA=['#e74c3c','#ff9d2a','#ffd23f','#7ac86a','#3ac0c0','#2a9fe0','#8a5ce0','#ff6f9c','#8a6a4a','#2b2b3d','#ffffff','borrar'];

  window.abrirConstructor = function(){ mostrarMenu(); show('v-build'); };

  function mostrarMenu(){
    modo='menu';
    document.getElementById('buildBack').onclick=()=>show('v-home');
    document.getElementById('buildWrap').innerHTML=`
      <div class="buildMenu">
        <button class="buildModeCard c1" id="modoColorear">
          <div class="bmIcon">🎨</div><div class="bmName">Colorear un dibujo</div>
          <div class="bmDesc">Pinta por numeros y descubre que es</div></button>
        <button class="buildModeCard c2" id="modoLibre">
          <div class="bmIcon">🧱</div><div class="bmName">Construir libre</div>
          <div class="bmDesc">Crea lo que imagines con bloques</div></button>
      </div>`;
    document.getElementById('modoColorear').onclick=()=>{ if(window.SFX)SFX.swoosh(); elegirPlantilla(); };
    document.getElementById('modoLibre').onclick=()=>{ if(window.SFX)SFX.swoosh(); modoLibre(); };
    document.getElementById('buildHint').textContent='¿Que quieres hacer hoy? 🎨';
  }

  function elegirPlantilla(){
    const lista=(window.PLANTILLAS||[]);
    document.getElementById('buildWrap').innerHTML='<div class="tplGrid">'+lista.map((p,i)=>
      `<button class="tplCard" data-i="${i}"><div class="tplEmoji">🖼️</div><div class="tplName">${p.nombre}</div></button>`
    ).join('')+'</div>';
    document.querySelectorAll('#buildWrap .tplCard').forEach(b=>{
      b.onclick=()=>{ if(window.SFX)SFX.tap(); iniciarColorear(lista[+b.dataset.i]); };
    });
    document.getElementById('buildBack').onclick=mostrarMenu;
    document.getElementById('buildHint').textContent='Elige un dibujo para colorear 🖼️';
  }

  function iniciarColorear(pl){
    modo='colorear'; plantillaActual=pl;
    const nums=Object.keys(pl.colores).map(Number); colorNumSel=nums[0];
    const R=pl.grid.length, C=pl.grid[0].length;
    let cells='';
    for(let r=0;r<R;r++) for(let c=0;c<C;c++){ const v=pl.grid[r][c];
      cells+=`<div class="pcell${v===0?' vacio':''}" data-n="${v}">${v>0?v:''}</div>`; }
    document.getElementById('buildWrap').innerHTML=
      '<div class="colorNums">'+nums.map(n=>`<button class="cnum" data-n="${n}" style="background:${pl.colores[n]}">${n}</button>`).join('')+'</div>'+
      `<div class="pGrid" id="pGrid" style="grid-template-columns:repeat(${C},1fr)">${cells}</div>`;
    document.querySelectorAll('#buildWrap .cnum').forEach(b=>{
      if(+b.dataset.n===colorNumSel) b.classList.add('sel');
      b.onclick=()=>{ colorNumSel=+b.dataset.n; document.querySelectorAll('#buildWrap .cnum').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); if(window.SFX)SFX.tap(); };
    });
    const pg=document.getElementById('pGrid');
    function pinta(el){
      if(!el||!el.classList.contains('pcell')||el.classList.contains('vacio')||el.classList.contains('done')) return;
      const need=+el.dataset.n;
      if(need===colorNumSel){ el.style.background=pl.colores[need]; el.classList.add('done'); el.textContent=''; if(window.SFX)SFX.tap(); revisar(); }
      else { el.classList.add('wrongPick'); setTimeout(()=>el.classList.remove('wrongPick'),250); }
    }
    pg.onpointerdown=(e)=>{pintando=true;pinta(e.target);};
    pg.onpointermove=(e)=>{ if(pintando){ pinta(document.elementFromPoint(e.clientX,e.clientY)); } };
    pg.ontouchstart=(e)=>{pintando=true;const t=e.touches[0];pinta(document.elementFromPoint(t.clientX,t.clientY));};
    pg.ontouchmove=(e)=>{ if(pintando){e.preventDefault();const t=e.touches[0];pinta(document.elementFromPoint(t.clientX,t.clientY));} };
    window.addEventListener('pointerup',()=>pintando=false);
    pg.ontouchend=()=>pintando=false;
    document.getElementById('buildBack').onclick=elegirPlantilla;
    document.getElementById('buildHint').textContent='Pinta cada numero con su color 🎨';
  }

  function revisar(){ if(document.querySelectorAll('#pGrid .pcell:not(.vacio):not(.done)').length===0) comparar(); }

  function comparar(){
    if(window.SFX) SFX.premio();
    if(typeof lanzarConfeti==='function') lanzarConfeti();
    const pl=plantillaActual, R=pl.grid.length, C=pl.grid[0].length;
    let mini='<div class="miniArt" style="grid-template-columns:repeat('+C+',1fr)">';
    for(let r=0;r<R;r++) for(let c=0;c<C;c++){ const v=pl.grid[r][c]; mini+=`<span style="background:${v>0?pl.colores[v]:'transparent'}"></span>`; }
    mini+='</div>';
    document.getElementById('buildWrap').innerHTML=
      `<div class="compareTitle">🎉 ¡Terminaste tu ${pl.nombre}!</div>
       <div class="compareRow">
        <div class="compareCol"><div class="compareLabel">Tu dibujo 🎨</div>${mini}</div>
        <div class="compareCol"><div class="compareLabel">En la vida real 📷</div><div class="realPhoto" id="realPhoto">🖼️</div></div>
       </div>
       <button class="bigBtn" id="otroDibujo" style="max-width:300px;margin:16px auto 0">🎨 Colorear otro</button>`;
    document.getElementById('otroDibujo').onclick=elegirPlantilla;
    document.getElementById('buildHint').textContent='¡Compara tu dibujo con la foto real! 📷';
    cargarFotoReal(pl.wiki, document.getElementById('realPhoto'));
  }

  function cargarFotoReal(wiki, cont){
    if(!wiki||!cont) return;
    const url='https://commons.wikimedia.org/w/api.php?action=query&titles=File:'+encodeURIComponent(wiki)+'&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json&origin=*';
    fetch(url).then(r=>r.json()).then(d=>{
      const pages=d.query.pages, k=Object.keys(pages)[0], info=pages[k].imageinfo&&pages[k].imageinfo[0];
      if(info&&info.thumburl){ cont.style.backgroundImage='url('+info.thumburl+')'; cont.textContent=''; cont.classList.add('cargada'); }
    }).catch(()=>{});
  }

  function modoLibre(){
    modo='libre';
    try{ grid=JSON.parse(localStorage.getItem('danteLab_build_v1')||'null'); }catch(e){ grid=null; }
    if(!grid||grid.length!==ROWS) grid=Array.from({length:ROWS},()=>Array(COLS).fill(null));
    colorSel='#e74c3c';
    document.getElementById('buildWrap').innerHTML='<div class="buildPalette" id="buildPalette"></div><div class="buildGrid" id="buildGrid"></div>'+
      '<div class="buildBtns"><button class="buildAct" id="buildClear">🧽 Limpiar</button><button class="buildAct done" id="buildDone">💾 Guardar</button></div>';
    pintarPaleta(); pintarGrid();
    document.getElementById('buildClear').onclick=limpiar;
    document.getElementById('buildDone').onclick=terminarLibre;
    document.getElementById('buildBack').onclick=mostrarMenu;
    document.getElementById('buildHint').textContent='Toca para poner bloques 🧱';
  }
  function pintarPaleta(){
    const cont=document.getElementById('buildPalette'); cont.innerHTML='';
    PALETA.forEach(c=>{ const b=document.createElement('button'); b.className='swatch';
      if(c==='borrar'){b.classList.add('eraser');b.textContent='🧽';}else{b.style.background=c;if(c==='#ffffff')b.style.border='2px solid #ccc';}
      if(c===colorSel)b.classList.add('sel');
      b.onclick=()=>{colorSel=c;cont.querySelectorAll('.swatch').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');if(window.SFX)SFX.tap();};
      cont.appendChild(b); });
  }
  function pintarGrid(){
    const cont=document.getElementById('buildGrid'); cont.style.gridTemplateColumns='repeat('+COLS+',1fr)'; cont.innerHTML='';
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ const cell=document.createElement('div'); cell.className='bcell'; cell.dataset.r=r; cell.dataset.c=c; if(grid[r][c])cell.style.background=grid[r][c]; cont.appendChild(cell); }
    function poner(el){ if(!el||!el.classList.contains('bcell'))return; const r=+el.dataset.r,c=+el.dataset.c;
      if(colorSel==='borrar'){grid[r][c]=null;el.style.background='';}else{grid[r][c]=colorSel;el.style.background=colorSel;} }
    cont.onpointerdown=(e)=>{pintando=true;poner(e.target);};
    cont.onpointermove=(e)=>{ if(pintando){poner(document.elementFromPoint(e.clientX,e.clientY));} };
    cont.ontouchstart=(e)=>{pintando=true;const t=e.touches[0];poner(document.elementFromPoint(t.clientX,t.clientY));};
    cont.ontouchmove=(e)=>{ if(pintando){e.preventDefault();const t=e.touches[0];poner(document.elementFromPoint(t.clientX,t.clientY));} };
    window.addEventListener('pointerup',()=>{ if(pintando){pintando=false;guardar();} });
    cont.ontouchend=()=>{ if(pintando){pintando=false;guardar();} };
  }
  function guardar(){ try{ localStorage.setItem('danteLab_build_v1',JSON.stringify(grid)); }catch(e){} }
  function limpiar(){ grid=Array.from({length:ROWS},()=>Array(COLS).fill(null)); guardar(); pintarGrid(); if(window.SFX)SFX.tap(); }
  function terminarLibre(){ guardar(); if(window.SFX)SFX.premio(); document.getElementById('buildHint').textContent='¡Guardado! 💾'; setTimeout(()=>{show('v-home'); if(typeof toast==='function')toast('💾 ¡Tu construccion se guardo!');},800); }
})();
