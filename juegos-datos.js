/* ============================================================
   DANTE LAB · Juegos con lo que aprendiste
   Se arman solos con los datos de cada ficha:
   - Sopa de letras: palabras clave de la ficha
   - Rompecabezas: la foto (o ilustración) de la ficha
   - Trivia: preguntas sobre la ficha (nombre, dato, capital, reto)
   ============================================================ */
(function(){

  // ---------- utilidades ----------
  const barajar = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const tranquilo = () => window.DIF ? DIF.tranquilo() : false;
  const nivel = id => window.DIF ? DIF.nivel(id) : 1;
  function norm(w){ // mayúsculas, sin tildes, conserva la Ñ
    return w.toUpperCase().replace(/Ñ/g,'\u0001').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\u0001/g,'Ñ').replace(/[^A-ZÑ]/g,'');
  }
  function todasLasFichas(){ return (window.MUNDOS||[]).flatMap(m=>m.descubrimientos.map(d=>({m,d}))); }
  // desde el Arcade: elige una ficha al azar para que cada partida sea distinta
  function prepararFicha(){
    if(window._desdeArcade || !window.discActual){
      const t=todasLasFichas(), x=t[Math.floor(Math.random()*t.length)];
      window.discActual={mundo:x.m, d:x.d}; try{ discActual=window.discActual; }catch(e){}
    }
    return { d:window.discActual.d, m:window.discActual.mundo };
  }
  function terminar(juego, directoACarta){
    if(window.DIF) DIF.subir(juego);
    if(window.SFX) SFX.premio();
    if(typeof lanzarConfeti==='function') lanzarConfeti();
    setTimeout(()=>{
      // la trivia ya incluye la pregunta del reto: pasa directo a la carta
      if(directoACarta && !window._desdeArcade && typeof recompensa==='function'){
        if(window.TELEMETRIA) TELEMETRIA.termino();
        recompensa(true);
      } else if(typeof abrirReto==='function') abrirReto();
    }, 1100);
  }
  function volverFicha(){ show('v-disc'); }

  /* ======================= SOPA DE LETRAS ======================= */
  const LETRAS='AABCDEEEFGHIIJLLMNNOOOPQRRSSTTUUVYZÑ';
  let sopa=null;

  window.abrirSopa = function(){
    const {d,m}=prepararFicha();
    const calma=tranquilo(), lv=nivel('sopa');
    const N = calma ? 8 : (lv>=4 ? 10 : 9);
    const diag = !calma && lv>=3;
    let palabras = [...new Set((d.palabras||[]).map(norm))].filter(w=>w.length>=3 && w.length<=N);
    palabras = palabras.slice(0, calma?3:(lv>=3?5:4));
    let grid=null, colocadas=[];
    for(let intento=0; intento<40 && !grid; intento++){
      const g=Array.from({length:N},()=>Array(N).fill('')), col=[];
      let ok=true;
      for(const w of palabras.slice().sort((a,b)=>b.length-a.length)){
        const dirs = diag? [[0,1],[1,0],[1,1]] : [[0,1],[1,0]];
        let puesta=false;
        for(let k=0;k<120 && !puesta;k++){
          const [dr,dc]=dirs[Math.floor(Math.random()*dirs.length)];
          const r0=Math.floor(Math.random()*(N-(dr?w.length-1:0))), c0=Math.floor(Math.random()*(N-(dc?w.length-1:0)));
          let cabe=true;
          for(let i=0;i<w.length;i++){ const ch=g[r0+dr*i][c0+dc*i]; if(ch && ch!==w[i]){ cabe=false; break; } }
          if(!cabe) continue;
          const celdas=[];
          for(let i=0;i<w.length;i++){ g[r0+dr*i][c0+dc*i]=w[i]; celdas.push((r0+dr*i)*N+(c0+dc*i)); }
          col.push({w, celdas}); puesta=true;
        }
        if(!puesta){ ok=false; break; }
      }
      if(ok){ grid=g; colocadas=col; }
    }
    if(!grid){ return abrirTrivia(); } // respaldo: nunca dejar al niño sin juego
    for(let r=0;r<N;r++) for(let c=0;c<N;c++) if(!grid[r][c]) grid[r][c]=LETRAS[Math.floor(Math.random()*LETRAS.length)];
    sopa={N, grid, palabras:colocadas, halladas:new Set(), inicio:null, color:m.color};

    document.getElementById('sopaTitle').textContent='Busca las palabras de: '+d.nombre;
    document.getElementById('sopaBack').onclick=volverFicha;
    const G=document.getElementById('sopaGrid');
    G.style.gridTemplateColumns=`repeat(${N},1fr)`; G.innerHTML='';
    for(let i=0;i<N*N;i++){
      const b=document.createElement('button'); b.className='sCell'; b.textContent=grid[Math.floor(i/N)][i%N];
      b.dataset.i=i; b.onclick=()=>tocarCelda(i); G.appendChild(b);
    }
    pintarLista();
    document.getElementById('sopaHint').textContent='Toca la primera letra y luego la última de cada palabra.';
    show('v-sopa');
  };

  function pintarLista(){
    document.getElementById('sopaList').innerHTML = sopa.palabras.map(p=>`<span class="sWord${sopa.halladas.has(p.w)?' ok':''}">${p.w}</span>`).join('');
  }
  function celdasEntre(a,b){
    const N=sopa.N, ra=Math.floor(a/N), ca=a%N, rb=Math.floor(b/N), cb=b%N;
    const dr=Math.sign(rb-ra), dc=Math.sign(cb-ca), len=Math.max(Math.abs(rb-ra),Math.abs(cb-ca))+1;
    if(!(ra===rb || ca===cb || Math.abs(rb-ra)===Math.abs(cb-ca))) return null;
    return Array.from({length:len},(_,i)=>(ra+dr*i)*N+(ca+dc*i));
  }
  function tocarCelda(i){
    const cells=document.querySelectorAll('#sopaGrid .sCell');
    if(window.SFX) SFX.tap();
    if(sopa.inicio===null){ sopa.inicio=i; cells[i].classList.add('sel'); return; }
    const a=sopa.inicio; sopa.inicio=null; cells[a].classList.remove('sel');
    if(a===i) return;
    const camino=celdasEntre(a,i); if(!camino) return nota('Las palabras van en línea recta. ¡Prueba otra vez!');
    const clave=camino.join(','), inv=camino.slice().reverse().join(',');
    const p=sopa.palabras.find(x=>!sopa.halladas.has(x.w) && (x.celdas.join(',')===clave || x.celdas.join(',')===inv));
    if(!p){ return nota('Casi. Busca otra palabra de la lista 🔍'); }
    sopa.halladas.add(p.w);
    p.celdas.forEach(c=>{ cells[c].classList.add('found'); cells[c].style.background=sopa.color; });
    if(window.SFX) SFX.correcto();
    if(window.FX){ const cc=FX.centro(cells[p.celdas[Math.floor(p.celdas.length/2)]]); FX.burst(cc.x,cc.y,{n:10}); }
    pintarLista();
    if(sopa.halladas.size===sopa.palabras.length){ nota('¡Encontraste todas las palabras! 🎉'); terminar('sopa'); }
    else nota('¡Muy bien! Encontraste '+p.w+' ⭐');
  }
  function nota(t){ document.getElementById('sopaHint').textContent=t; }

  /* ======================= ROMPECABEZAS ======================= */
  let rc=null;
  // imagen cuadrada propia para el rompecabezas: rayos de colores + protagonista grande,
  // así cada pieza es distinta aunque no haya foto real
  function imagenPuzzle(d){
    const [c1,c2]=d.bg||['#1a2a4a','#2a4a6a'];
    const pal=[c2,'#ffd23f','#ff4d9d','#3fb4ff','#2fd479','#ff8c1a'];
    let rayos='';
    for(let i=0;i<24;i++){
      const a1=i*15*Math.PI/180, a2=(i+1)*15*Math.PI/180;
      rayos+=`<path d="M200 200 L${200+400*Math.cos(a1)} ${200+400*Math.sin(a1)} L${200+400*Math.cos(a2)} ${200+400*Math.sin(a2)}Z" fill="${pal[i%pal.length]}" opacity="${i%2?0.95:0.55}"/>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <rect width="400" height="400" fill="${c1}"/>${rayos}
      <circle cx="200" cy="190" r="118" fill="#ffffff" opacity="0.9"/>
      <circle cx="200" cy="190" r="118" fill="none" stroke="${c1}" stroke-width="8"/>
      <text x="200" y="198" font-size="150" text-anchor="middle" dominant-baseline="middle">${d.icono||d.emoji}</text>
      <rect x="40" y="330" width="320" height="50" rx="25" fill="#ffffff"/>
      <text x="200" y="363" font-size="26" font-weight="bold" font-family="sans-serif" fill="${c1}" text-anchor="middle">${d.nombre.replace(/&/g,'y')}</text>
    </svg>`;
  }
  window.abrirRompecabezas = async function(){
    const {d}=prepararFicha();
    const calma=tranquilo(), lv=nivel('rompecabezas');
    const N = calma ? 3 : (lv>=3 ? 4 : 3);
    // imagen: foto real si hay internet; si no, la ilustración de la ficha
    const svg = 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(imagenPuzzle(d));
    let img = svg;
    try{ if((d.wiki||d.wikiArticulo) && typeof urlFotoFicha==='function'){ const u=await Promise.race([urlFotoFicha(d), new Promise(r=>setTimeout(()=>r(null),2500))]); if(u) img=u; } }catch(e){}
    let orden; do{ orden=barajar([...Array(N*N).keys()]); }while(orden.every((v,i)=>v===i));
    rc={N, img, orden, sel:null};
    document.getElementById('rcTitle').textContent='Arma la imagen de: '+d.nombre;
    document.getElementById('rcBack').onclick=volverFicha;
    document.getElementById('rcRef').style.backgroundImage=`url("${img}")`;
    document.getElementById('rcHint').textContent='Toca dos piezas para cambiarlas de lugar.';
    pintarRC();
    show('v-rompe');
  };
  function pintarRC(){
    const B=document.getElementById('rcBoard'), N=rc.N; B.innerHTML='';
    B.style.gridTemplateColumns=`repeat(${N},1fr)`;
    rc.orden.forEach((pieza,pos)=>{
      const t=document.createElement('button'); t.className='rcTile'+(pieza===pos?' ok':'')+(rc.sel===pos?' sel':'');
      const x=(pieza%N)/(N-1)*100, y=Math.floor(pieza/N)/(N-1)*100;
      t.style.backgroundImage=`url("${rc.img}")`; t.style.backgroundSize=`${N*100}% ${N*100}%`; t.style.backgroundPosition=`${x}% ${y}%`;
      t.setAttribute('aria-label','Pieza '+(pos+1));
      t.onclick=()=>tocarPieza(pos); B.appendChild(t);
    });
  }
  function tocarPieza(pos){
    if(window.SFX) SFX.tap();
    if(rc.sel===null){ rc.sel=pos; return pintarRC(); }
    if(rc.sel!==pos){ const a=rc.sel; [rc.orden[a],rc.orden[pos]]=[rc.orden[pos],rc.orden[a]];
      if(rc.orden[a]===a || rc.orden[pos]===pos){ if(window.SFX) SFX.correcto(); } }
    rc.sel=null; pintarRC();
    const bien=rc.orden.filter((v,i)=>v===i).length;
    if(bien===rc.orden.length){ document.getElementById('rcHint').textContent='¡Armaste la imagen completa! 🎉'; terminar('rompecabezas'); }
    else document.getElementById('rcHint').textContent=`¡Vas muy bien! ${bien} de ${rc.orden.length} piezas en su lugar.`;
  }

  /* ======================= TRIVIA ======================= */
  let tv=null;
  function preguntas(d,m){
    const otros=barajar(m.descubrimientos.filter(x=>x.id!==d.id));
    const qs=[];
    // 1) reconocer el tesoro
    qs.push({ p: d.capital ? `¿Cuál es la bandera de ${d.nombre}?` : `¿Qué dibujo corresponde a «${d.nombre}»?`, o:barajar([d.emoji, ...otros.slice(0,2).map(x=>x.emoji)]), ok:d.emoji, grande:true });
    // 2) capital (países) o dato (resto)
    if(d.capital){
      const caps=otros.filter(x=>x.capital).slice(0,2).map(x=>x.capital);
      qs.push({ p:`¿Cuál es la capital de ${d.nombre}?`, o:barajar([d.capital, ...caps]), ok:d.capital });
    } else {
      const corta=x=>x.dato.split(/(?<=[.!?])\s/)[0].replace(/[¡!]/g,'').trim();
      qs.push({ p:`¿Qué dato es de ${d.nombre}?`, o:barajar([corta(d), ...otros.slice(2,4).map(corta)]), ok:corta(d) });
    }
    // 3) la pregunta del reto de la ficha
    qs.push({ p:d.reto.p, o:barajar(d.reto.o.slice()), ok:d.reto.o[d.reto.correcta] });
    return qs;
  }
  window.abrirTrivia = function(){
    const {d,m}=prepararFicha();
    tv={qs:preguntas(d,m), i:0, aciertos:0};
    document.getElementById('tvBack').onclick=volverFicha;
    cargarFoto(document.getElementById('tvPhoto'), d);
    pintarTV(); show('v-trivia');
  };
  function pintarTV(){
    const q=tv.qs[tv.i];
    document.getElementById('tvN').textContent=`Pregunta ${tv.i+1} de ${tv.qs.length}`;
    document.getElementById('tvBar').style.width=(tv.i/tv.qs.length*100)+'%';
    document.getElementById('tvQ').textContent=q.p;
    const O=document.getElementById('tvOpts'); O.innerHTML=''; O.className='tvOpts'+(q.grande?' big':'');
    q.o.forEach(op=>{
      const b=document.createElement('button'); b.className='opt'; b.innerHTML=`<span>${op}</span>`;
      b.onclick=()=>responderTV(b,op===q.ok); O.appendChild(b);
    });
  }
  function responderTV(btn, bien){
    const q=tv.qs[tv.i], opts=[...document.querySelectorAll('#tvOpts .opt')];
    opts.forEach(o=>o.style.pointerEvents='none');
    const correcta=opts.find(o=>o.textContent===q.ok); if(correcta) correcta.classList.add('right');
    if(bien){ tv.aciertos++; if(window.SFX) SFX.correcto(); if(window.FX){ const c=FX.centro(btn); FX.burst(c.x,c.y,{n:10}); FX.popText(c.x,c.y,'¡Muy bien!','#7ac86a'); } }
    else { if(window.SFX) SFX.animo(); document.getElementById('tvQ').textContent='¡Casi! Mira, la respuesta es esta 😊'; }
    setTimeout(()=>{
      tv.i++;
      if(tv.i<tv.qs.length) return pintarTV();
      document.getElementById('tvBar').style.width='100%';
      document.getElementById('tvQ').textContent=`¡Terminaste! Acertaste ${tv.aciertos} de ${tv.qs.length} 🎉`;
      document.getElementById('tvOpts').innerHTML='';
      terminar('trivia', true);
    }, bien?900:1500);
  }
})();
