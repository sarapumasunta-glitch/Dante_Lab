/* ============================================================
   DANTE LAB · Planeta Tierra interactivo
   - Gira con el dedo, acerca con pellizco o con ＋ / －
   - Toca un país: si tiene ficha, la abre; si no, dice su nombre
   - Toca el agua: muestra el océano y lleva al mundo Océano
   - Funciona sin internet (mapa y librerías van dentro de la app)
   ============================================================ */
(function(){
  const C = {
    agua1:'#3fb4ff', agua2:'#1560b8', borde:'#0d3a7a',
    tierra:'#3fbf6a', ficha:'#ffb02e', fichaHecha:'#ffd23f', sel:'#ff4d9d',
    linea:'#ffffffcc', reticula:'#ffffff22'
  };
  const OCEANOS = {
    pacifico:{ n:'Océano Pacífico', d:'Es el océano más grande y más profundo. ¡Todos los continentes juntos cabrían dentro de él!' },
    atlantico:{ n:'Océano Atlántico', d:'Es el segundo océano más grande. En 1492 Cristóbal Colón lo cruzó en barco desde Europa hasta América.' },
    indico:{ n:'Océano Índico', d:'Es el océano más cálido del planeta. En sus aguas viven tortugas, delfines y arrecifes de coral.' },
    artico:{ n:'Océano Ártico', d:'Es el océano más pequeño y casi siempre está cubierto de hielo. Cerca de él viven los osos polares.' },
    austral:{ n:'Océano Antártico', d:'Rodea la Antártida, el continente más frío. Ahí nadan pingüinos, focas y ballenas.' }
  };

  let feats=null, fichasPorIso={}, proj=null, path=null, ctx=null, cv=null;
  let rot=[78,-5], zoom=1, sel=null, vel=[0,0], anim=null, idleT=0;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function preparar(){
    if(feats) return true;
    if(!window.d3 || !window.topojson || !window.MAPA_TOPO) return false;
    feats = topojson.feature(MAPA_TOPO, MAPA_TOPO.objects.countries).features;
    const P = (window.MUNDOS||[]).find(m=>m.id==='paises');
    (P?P.descubrimientos:[]).forEach(d=>{ if(d.iso) fichasPorIso[d.iso]=d; });
    return true;
  }

  function oceanoDe(lon,lat){
    if(lat>66) return 'artico';
    if(lat<-58) return 'austral';
    if(lon>=20 && lon<125 && lat<24) return 'indico';
    if((lon>=-70 && lon<20) || (lat>8 && lon>-100 && lon<-70) || (lon>=20 && lon<45 && lat>=24)) return 'atlantico';
    return 'pacifico';
  }

  function tam(){
    const w = Math.min(cv.parentElement.clientWidth, 440);
    const dpr = Math.min(window.devicePixelRatio||1, 2);
    cv.style.width = w+'px'; cv.style.height = w+'px';
    cv.width = w*dpr; cv.height = w*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    proj = d3.geoOrthographic().translate([w/2,w/2]).clipAngle(90).precision(0.6);
    path = d3.geoPath(proj, ctx);
    cv._w = w;
  }

  function dibujar(){
    const w=cv._w, r=(w/2-6)*zoom;
    proj.scale(r).rotate([rot[0],rot[1]]);
    ctx.clearRect(0,0,w,w);
    // sombra y océano
    const g = ctx.createRadialGradient(w/2-r*0.35, w/2-r*0.4, r*0.1, w/2, w/2, r);
    g.addColorStop(0,C.agua1); g.addColorStop(1,C.agua2);
    ctx.beginPath(); path({type:'Sphere'}); ctx.fillStyle=g; ctx.fill();
    // retícula
    ctx.beginPath(); path(d3.geoGraticule10()); ctx.strokeStyle=C.reticula; ctx.lineWidth=0.6; ctx.stroke();
    // países
    const col = (window.S && S.coleccion) || {};
    feats.forEach(f=>{
      const fi = fichasPorIso[f.id];
      ctx.beginPath(); path(f);
      ctx.fillStyle = (sel && sel.id===f.id) ? C.sel : fi ? (col[fi.id]?C.fichaHecha:C.ficha) : C.tierra;
      ctx.fill();
    });
    ctx.beginPath(); path(topojson.mesh(MAPA_TOPO, MAPA_TOPO.objects.countries, (a,b)=>a!==b));
    ctx.strokeStyle=C.linea; ctx.lineWidth=0.7; ctx.stroke();
    // brillo y borde
    ctx.beginPath(); path({type:'Sphere'}); ctx.strokeStyle=C.borde; ctx.lineWidth=2; ctx.stroke();
    const h = ctx.createRadialGradient(w/2-r*0.45, w/2-r*0.5, 0, w/2-r*0.45, w/2-r*0.5, r*0.9);
    h.addColorStop(0,'#ffffff40'); h.addColorStop(1,'#ffffff00');
    ctx.beginPath(); path({type:'Sphere'}); ctx.fillStyle=h; ctx.fill();
  }

  function bucle(){
    let mover=false;
    if(Math.abs(vel[0])>0.02 || Math.abs(vel[1])>0.02){
      rot[0]+=vel[0]; rot[1]=Math.max(-70,Math.min(70,rot[1]+vel[1]));
      vel[0]*=0.93; vel[1]*=0.93; mover=true;
    } else if(!arrastrando && !reduce && !sel && Date.now()-idleT>2500){
      rot[0]+=0.12; mover=true;
    }
    if(mover) dibujar();
    anim = requestAnimationFrame(bucle);
  }

  // volar hacia un punto [lon,lat]
  function volarA(lonlat, z){
    const r0=rot.slice(), r1=[-lonlat[0], -lonlat[1]], z0=zoom, z1=z||zoom;
    let dl=r1[0]-r0[0]; dl=((dl+540)%360)-180;
    const t0=performance.now(), dur=reduce?1:700;
    vel=[0,0]; idleT=Date.now();
    (function paso(t){
      const k=Math.min(1,(t-t0)/dur), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
      rot=[r0[0]+dl*e, r0[1]+(r1[1]-r0[1])*e]; zoom=z0+(z1-z0)*e; dibujar();
      if(k<1) requestAnimationFrame(paso);
    })(t0);
  }

  // ---------- gestos ----------
  let arrastrando=false, ptrs={}, ult=null, movido=0, pinch0=null;
  function xy(e){ const b=cv.getBoundingClientRect(); return [e.clientX-b.left, e.clientY-b.top]; }
  function down(e){
    cv.setPointerCapture(e.pointerId); ptrs[e.pointerId]=xy(e);
    arrastrando=true; movido=0; ult=xy(e); vel=[0,0]; idleT=Date.now();
    const ids=Object.keys(ptrs); if(ids.length===2){ const a=ptrs[ids[0]], b=ptrs[ids[1]]; pinch0={d:Math.hypot(a[0]-b[0],a[1]-b[1]), z:zoom}; }
  }
  function move(e){
    if(!ptrs[e.pointerId]) return;
    const p=xy(e); ptrs[e.pointerId]=p;
    const ids=Object.keys(ptrs);
    if(ids.length===2 && pinch0){
      const a=ptrs[ids[0]], b=ptrs[ids[1]];
      zoom=Math.max(1,Math.min(5, pinch0.z*Math.hypot(a[0]-b[0],a[1]-b[1])/pinch0.d)); movido=99; dibujar(); return;
    }
    const k=0.35/zoom, dx=p[0]-ult[0], dy=p[1]-ult[1];
    movido+=Math.abs(dx)+Math.abs(dy);
    rot[0]+=dx*k; rot[1]=Math.max(-70,Math.min(70,rot[1]-dy*k));
    vel=[dx*k, -dy*k]; ult=p; dibujar();
  }
  function up(e){
    const p=xy(e); delete ptrs[e.pointerId];
    if(Object.keys(ptrs).length<2) pinch0=null;
    if(Object.keys(ptrs).length===0){ arrastrando=false; idleT=Date.now(); if(movido<8){ vel=[0,0]; tocar(p); } }
  }

  function tocar(p){
    const ll = proj.invert(p);
    if(!ll || isNaN(ll[0]) || d3.geoDistance(ll, [-rot[0],-rot[1]]) > Math.PI/2) return;
    const f = feats.find(x=>d3.geoContains(x, ll));
    if(window.SFX) SFX.tap();
    if(f){ sel=f; mostrarPais(f); volarA(d3.geoCentroid(f), Math.max(zoom, 1.6)); if(window.TELEMETRIA) TELEMETRIA.globo('pais', f.id); }
    else { sel=null; const o=oceanoDe(ll[0],ll[1]); mostrarOceano(o); dibujar(); if(window.TELEMETRIA) TELEMETRIA.globo('oceano', o); }
  }

  // ---------- tarjeta de información ----------
  function tarjeta(html){ const t=document.getElementById('globoInfo'); t.innerHTML=html; t.classList.add('show'); }
  function mostrarPais(f){
    const p=f.properties, fi=fichasPorIso[f.id], col=(window.S&&S.coleccion)||{};
    if(fi){
      tarjeta(`<div class="giHead"><span class="giFlag">${p.f||'🏳️'}</span><div><div class="giName">${fi.nombre}</div><div class="giSub">Capital: ${fi.capital}${col[fi.id]?' · ✓ ya es tuyo':''}</div></div></div>
        <p class="giTxt">${fi.dato}</p>
        <button class="bigBtn" id="giGo">📖 Ver ficha y jugar</button>`);
      document.getElementById('giGo').onclick=()=>abrirDescubrimiento('paises', fi.id, 'v-globo');
    } else {
      tarjeta(`<div class="giHead"><span class="giFlag">${p.f||'🏳️'}</span><div><div class="giName">${p.n}</div><div class="giSub">Ficha en camino</div></div></div>
        <p class="giTxt">Todavía no exploramos este país. ¡Pronto llegará su ficha! Mientras tanto, busca los países naranjas.</p>`);
    }
  }
  function mostrarOceano(k){
    const o=OCEANOS[k];
    tarjeta(`<div class="giHead"><span class="giFlag">🌊</span><div><div class="giName">${o.n}</div><div class="giSub">Toca para bucear</div></div></div>
      <p class="giTxt">${o.d}</p>
      <button class="bigBtn" id="giGo">🐠 Explorar el océano</button>`);
    document.getElementById('giGo').onclick=()=>abrirMundo('oceano');
  }

  // ---------- atajos a los países con ficha ----------
  function chips(){
    const c=document.getElementById('globoChips'); if(!c) return;
    const P=(window.MUNDOS||[]).find(m=>m.id==='paises'); c.innerHTML='';
    (P?P.descubrimientos:[]).forEach(d=>{
      const f=feats.find(x=>x.id===d.iso); if(!f) return;
      const b=document.createElement('button'); b.className='gChip';
      b.innerHTML=`<span>${d.emoji}</span>${d.nombre}`;
      b.onclick=()=>{ sel=f; mostrarPais(f); volarA(d3.geoCentroid(f), 2.4); if(window.TELEMETRIA) TELEMETRIA.globo('pais', f.id); };
      c.appendChild(b);
    });
  }

  window.abrirGlobo = function(){
    if(!preparar()){ toast('🌍 El planeta no pudo cargar. Intenta de nuevo.'); return; }
    show('v-globo');
    cv=document.getElementById('globoCanvas'); ctx=cv.getContext('2d');
    if(!cv._listo){
      cv.addEventListener('pointerdown',down); cv.addEventListener('pointermove',move);
      cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
      document.getElementById('gZoomIn').onclick=()=>{ zoom=Math.min(5,zoom*1.5); idleT=Date.now(); dibujar(); };
      document.getElementById('gZoomOut').onclick=()=>{ zoom=Math.max(1,zoom/1.5); idleT=Date.now(); dibujar(); };
      window.addEventListener('resize',()=>{ if(document.getElementById('v-globo').classList.contains('active')){ tam(); dibujar(); } });
      cv._listo=true;
    }
    tam(); chips(); dibujar();
    if(!sel) document.getElementById('globoInfo').classList.remove('show');
    cancelAnimationFrame(anim); anim=requestAnimationFrame(bucle);
    if(window.TELEMETRIA) TELEMETRIA.globo('abrir');
  };
  window.cerrarGlobo = function(){ cancelAnimationFrame(anim); anim=null; };

  // vista previa fija para la tarjeta de inicio (centrada en Ecuador)
  window.previewGlobo = function(el){
    if(!el || !preparar()) return;
    const w=el.clientWidth||96, dpr=Math.min(window.devicePixelRatio||1,2);
    el.width=w*dpr; el.height=w*dpr; const c=el.getContext('2d'); c.setTransform(dpr,0,0,dpr,0,0);
    const pr=d3.geoOrthographic().translate([w/2,w/2]).scale(w/2-2).rotate([78,-5]).clipAngle(90), pa=d3.geoPath(pr,c);
    c.beginPath(); pa({type:'Sphere'}); c.fillStyle=C.agua2; c.fill();
    feats.forEach(f=>{ c.beginPath(); pa(f); c.fillStyle=fichasPorIso[f.id]?C.ficha:C.tierra; c.fill(); });
    c.beginPath(); pa({type:'Sphere'}); c.strokeStyle='#ffffffaa'; c.lineWidth=2; c.stroke();
  };
  window.addEventListener('load', ()=>previewGlobo(document.getElementById('globoPrev')));
})();
