/* ============================================================
   DANTE LAB · cerebro del juego
   ============================================================ */

/* ---------- estado (guardado en el propio celular) ---------- */
const PERFILES_KEY = 'danteLab_perfiles';
const PERFIL_ACTUAL_KEY = 'danteLab_perfilActual';
let SAVE_KEY = 'danteLab_save_v1';   // se ajusta al perfil activo
let S = cargarJuego();
window.S = S;

/* ---------- perfiles (varios niños en un mismo dispositivo) ---------- */
function listaPerfiles(){
  try{ return JSON.parse(localStorage.getItem(PERFILES_KEY)||'[]'); }catch(e){ return []; }
}
function guardarListaPerfiles(arr){
  try{ localStorage.setItem(PERFILES_KEY, JSON.stringify(arr)); }catch(e){}
}
function perfilActual(){
  try{ return localStorage.getItem(PERFIL_ACTUAL_KEY)||''; }catch(e){ return ''; }
}
function setPerfilActual(id){
  try{ localStorage.setItem(PERFIL_ACTUAL_KEY, id); }catch(e){}
  SAVE_KEY = 'danteLab_save_v1_'+id;
  S = cargarJuego(); window.S = S;
}
function crearPerfil(nombre, avatar){
  const id = 'p'+Date.now();
  const arr = listaPerfiles();
  arr.push({ id, nombre, avatar });
  guardarListaPerfiles(arr);
  setPerfilActual(id);
  S.nombre = nombre; guardarJuego();
  return id;
}

function estadoInicial(){
  return { nombre:'', poder:'', modo:'aventura', nivel:1, xp:0, gemas:0, estrellas:0, coleccion:{}, retoDiaFecha:'' };
}
function cargarJuego(){
  try{ const raw=localStorage.getItem(SAVE_KEY); if(raw) return Object.assign(estadoInicial(), JSON.parse(raw)); }catch(e){}
  return estadoInicial();
}
function guardarJuego(){
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){}
}

/* ---------- niveles: XP necesaria por nivel ---------- */
function xpParaNivel(n){ return 100 + (n-1)*60; } // 100,160,220,...
function totalDescubrimientos(){ return MUNDOS.reduce((a,m)=>a+m.descubrimientos.length,0); }
function contarColeccion(){ return Object.keys(S.coleccion).length; }

/* ---------- personaje Dante (SVG dibujado, expresivo) ---------- */
function danteSVG(){
  return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">'+
   '<defs>'+
   '<radialGradient id="dbody" cx="40%" cy="34%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#cdd6e8"/></radialGradient>'+
   '<linearGradient id="dear" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eef2fb"/><stop offset="100%" stop-color="#b4bed6"/></linearGradient>'+
   '</defs>'+
   '<ellipse cx="42" cy="98" rx="18" ry="26" fill="url(#dear)"/>'+
   '<ellipse cx="158" cy="98" rx="18" ry="26" fill="url(#dear)"/>'+
   '<ellipse cx="100" cy="140" rx="58" ry="46" fill="url(#dbody)"/>'+
   '<ellipse cx="52" cy="150" rx="14" ry="20" fill="#cdd6e8"/>'+
   '<ellipse cx="148" cy="150" rx="14" ry="20" fill="#cdd6e8"/>'+
   '<text x="100" y="150" font-family="Baloo 2,sans-serif" font-size="15" font-weight="800" fill="#96a0ba" text-anchor="middle">DANTE</text>'+
   '<circle cx="100" cy="80" r="56" fill="url(#dbody)"/>'+
   '<ellipse cx="100" cy="80" rx="44" ry="40" fill="#1b1330"/>'+
   '<circle cx="82" cy="76" r="7.5" fill="#5ad1ff"><animate attributeName="ry" values="7.5;1;7.5" dur="4s" repeatCount="indefinite"/></circle>'+
   '<circle cx="118" cy="76" r="7.5" fill="#5ad1ff"><animate attributeName="ry" values="7.5;1;7.5" dur="4s" repeatCount="indefinite"/></circle>'+
   '<path d="M83 96 Q100 111 117 96" stroke="#5ad1ff" stroke-width="5" fill="none" stroke-linecap="round"/>'+
   '<line x1="100" y1="24" x2="100" y2="10" stroke="#b4bed6" stroke-width="4"/>'+
   '<circle cx="100" cy="7" r="6" fill="#ff9d2a"><animate attributeName="r" values="6;7.5;6" dur="1.5s" repeatCount="indefinite"/></circle>'+
   '<circle cx="70" cy="90" r="5" fill="#ff6f9c" opacity=".5"/>'+
   '<circle cx="130" cy="90" r="5" fill="#ff6f9c" opacity=".5"/>'+
   '</svg>';
}
window.danteSVG = danteSVG;

/* ---------- navegación ---------- */
function show(id){
  if(window.VOZ) VOZ.parar();
  if(id!=='v-globo' && window.cerrarGlobo) cerrarGlobo();
  if(id!=='v-trex' && window.detenerTrex) detenerTrex();
  if(id!=='v-trex' && window.detenerTrexClasico) detenerTrexClasico();
  if(id!=='v-orden' && window.pararOrdenar) pararOrdenar();
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
function goHome(){ render(); show('v-home'); }

/* ---------- ¿te gustó? (voz de Dante como co-creador) ---------- */
function abrirOpinion(){
  document.getElementById('opMascot').innerHTML=danteSVG();
  document.getElementById('opTitle').textContent = S.nombre? ('¿Te gustó, '+S.nombre+'?') : '¿Te gustó, explorador?';
  document.getElementById('opThanks').textContent='';
  document.querySelectorAll('#opFaces .opFace').forEach(f=>{
    f.classList.remove('sel');
    f.onclick=()=>guardarOpinion(f, f.dataset.v);
  });
  document.getElementById('opSkip').onclick=goHome;
  show('v-opinion');
}
function guardarOpinion(btn, valor){
  document.querySelectorAll('#opFaces .opFace').forEach(f=>f.classList.remove('sel'));
  btn.classList.add('sel');
  if(window.SFX) SFX.tap();
  // guardar como insumo del proyecto (product lead lo puede revisar)
  try{
    const key='danteLab_opiniones';
    const arr=JSON.parse(localStorage.getItem(key)||'[]');
    arr.push({ fecha:new Date().toISOString(), nombre:S.nombre||'', valor,
      descubrimiento:(window.discActual&&window.discActual.d&&window.discActual.d.id)||'' });
    localStorage.setItem(key, JSON.stringify(arr.slice(-200)));
  }catch(e){}
  const msg = valor==='genial'?'¡Gracias! A mí también me encantó 🎉'
            : valor==='bien'?'¡Gracias por contarme! 😊'
            : valor==='normal'?'¡Gracias! La próxima será mejor 💪'
            : '¡Gracias! Voy a hacerla más divertida 🚀';
  document.getElementById('opThanks').textContent=msg;
  if(window.SFX) SFX.premio();
  setTimeout(goHome, 1400);
}

/* ---------- gate ---------- */
function openGate(){ const g=document.getElementById('gate'); g.classList.add('hide'); setTimeout(()=>g.style.display='none',520); }

/* ---------- render principal (inicio) ---------- */
function render(){
  // HUD
  document.getElementById('hName').textContent = S.nombre || 'Explorador';
  const mt=document.getElementById('modeToggle'); if(mt) mt.textContent = S.modo==='tranquilo'?'🌈 Tranquilo':'🚀 Aventura';
  document.getElementById('hLvl').textContent = 'Nivel '+S.nivel;
  document.getElementById('hGems').textContent = S.gemas;
  document.getElementById('hStars').textContent = S.estrellas;
  const need = xpParaNivel(S.nivel);
  document.getElementById('hXp').style.width = Math.min(100, S.xp/need*100)+'%';

  // reto del día
  const reto = retoDelDia();
  document.getElementById('dailyTitle').textContent = reto.titulo;
  document.getElementById('dailyDesc').textContent = reto.desc;
  document.getElementById('dailyBtn').onclick = ()=> abrirDescubrimiento(reto.mundoId, reto.discId, 'v-home');

  // saludo mascota
  document.getElementById('speech').textContent = saludo();

  // META actual (objetivo que jala) + rango de explorador
  if(window.PROGRESO){
    const meta=PROGRESO.metaActual();
    const mc=document.getElementById('metaCard');
    if(meta && mc){
      mc.style.display='block';
      document.getElementById('metaTxt').textContent='Completa '+meta.nombre+': '+meta.hechas+'/'+meta.total;
      document.getElementById('metaBar').style.width=(meta.hechas/meta.total*100)+'%';
      document.getElementById('metaReward').textContent='🎁 Recompensa: '+meta.recompensa;
    } else if(mc){ mc.style.display='none'; }
    // rango en el HUD (junto al nivel)
    const r=PROGRESO.rango(S.nivel);
    const hl=document.getElementById('hLvl');
    if(hl) hl.textContent = r.emoji+' Nivel '+S.nivel;
  }

  // mundos
  const wc = document.getElementById('worlds'); wc.innerHTML='';
  MUNDOS.forEach(m=>{
    const total = m.descubrimientos.length;
    const hechos = m.descubrimientos.filter(d=>S.coleccion[d.id]).length;
    const b = document.createElement('button');
    b.className = 'world';
    b.style.background = `linear-gradient(150deg, ${m.color}, ${sombra(m.color)})`;
    b.style.boxShadow = `0 7px 0 ${sombra(m.color,0.55)}`;
    b.innerHTML = `<div class="we">${(window.ICONOS_MUNDO&&window.ICONOS_MUNDO[m.id])||m.emoji}</div>
      <div class="wn">${m.nombre}</div>
      <div class="wm">${hechos+' de '+total+' tesoros'}</div>
      <div class="dots">${m.descubrimientos.map((d,i)=>`<i class="${S.coleccion[d.id]?'on':''}"></i>`).join('')}</div>`;
    b.onclick = ()=> abrirMundo(m.id);
    wc.appendChild(b);
  });

  // colección
  const total = totalDescubrimientos();
  document.getElementById('collCnt').textContent = contarColeccion()+' / '+total;
  const cc = document.getElementById('collect'); cc.innerHTML='';
  const todos = MUNDOS.flatMap(m=>m.descubrimientos);
  todos.forEach(d=>{
    const got = !!S.coleccion[d.id];
    const el = document.createElement('div');
    el.className = 'card'+(got?' got':'');
    el.textContent = got ? d.emoji : '?';
    if(got) el.onclick = ()=> toast(d.emoji+' '+d.nombre);
    cc.appendChild(el);
  });

  // mascota en HUD + escenario + gate
  const pa=perfilActual(); const pf=listaPerfiles().find(p=>p.id===pa);
  if(pf && pf.avatar){ document.getElementById('chip').innerHTML='<span style="font-size:32px">'+pf.avatar+'</span>'; }
  else { document.getElementById('chip').innerHTML = danteSVG(); }
  document.getElementById('mascot').innerHTML = danteSVG();
  const gm=document.getElementById('gateMascot'); if(gm) gm.innerHTML = danteSVG();
  if(S.nombre){ const gh=document.getElementById('gateHi'); if(gh) gh.textContent = '¡Hola, '+S.nombre+'! 👋'; }
}

/* colores: oscurecer para sombra/degradado */
function sombra(hex, f=0.75){
  const n=parseInt(hex.slice(1),16); let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  r=Math.round(r*f); g=Math.round(g*f); b=Math.round(b*f);
  return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}

/* ---------- reto del día (rota según la fecha) ---------- */
function retoDelDia(){
  const hoy = new Date().toISOString().slice(0,10);
  // todos los descubrimientos (acceso libre) que NO estén coleccionados aún
  const dispo = MUNDOS
    .flatMap(m=> m.descubrimientos.map(d=>({mundoId:m.id, d})));
  const pend = dispo.filter(x=>!S.coleccion[x.d.id]);
  const pool = pend.length? pend : dispo;
  // elegir según el día (estable durante el día)
  const semilla = hoy.split('-').join('')|0;
  const pick = pool[semilla % pool.length];
  return { titulo:pick.d.nombre, desc:pick.d.dato.slice(0,60)+'…', mundoId:pick.mundoId, discId:pick.d.id };
}

/* ---------- saludos variados ---------- */
function saludo(){
  const n = S.nombre?(' '+S.nombre):'';
  const faltan = totalDescubrimientos()-contarColeccion();
  const frases = [
    `¡Hola${n}! Hoy escondí algo en uno de tus mundos… ¿lo encuentras? 🔭`,
    `¡Qué bueno verte${n}! Te faltan ${faltan} tesoros por descubrir 🃏`,
    `¡Vamos${n}! El mundo tiene sorpresas esperándote 🌍`,
    `¿Listo para explorar${n}? ¡Yo sí! 🚀`,
    `¡Buen día${n}! ¿A qué mundo viajamos hoy? 🌊🦁🌙`,
    `¡Hoy el reto está más divertido${n}! ¿Jugamos? 🎮`,
    `¡Te estaba esperando${n}! Hay algo nuevo en el arcade 🕹️`,
    `¿Sabías que hay animales que brillan en la oscuridad?${n?' ¡Ven, '+S.nombre+'!':''} 👀`,
    `¡Modo explorador ON${n}! Vamos a descubrir algo genial ⚡`,
    `${n?'¡'+S.nombre+'! ':'¡'}Cada tesoro que juntas hace crecer tu mundo 🌟`,
    `¡Hoy es un gran día para explorar${n}! 🧭`,
    `¿Construimos algo increíble hoy${n}? El taller te espera 🧱`
  ];
  // rota por día: misma frase todo el día, distinta cada día
  const dias = Math.floor(Date.now()/86400000);
  return frases[dias % frases.length];
}

/* ---------- abrir un mundo ---------- */
let mundoActual=null;
function abrirMundo(mundoId){
  if(window.SFX) SFX.swoosh();
  const m = MUNDOS.find(x=>x.id===mundoId); mundoActual=m;
  const head=document.getElementById('worldHead');
  head.style.background = `linear-gradient(150deg, ${m.color}, ${sombra(m.color)})`;
  head.style.boxShadow = `0 8px 0 ${sombra(m.color,0.55)}`;
  head.innerHTML = `<div class="big">${(window.ICONOS_MUNDO&&window.ICONOS_MUNDO[m.id])||m.emoji}</div><h1>${m.nombre}</h1><p>${m.intro}</p>`;
  pintarExtraMundo(m);
  const sc=document.getElementById('spots'); sc.innerHTML='';
  m.descubrimientos.forEach(d=>{
    const got=!!S.coleccion[d.id];
    const b=document.createElement('button');
    b.className='spot'+(got?' done':' nuevo');
    b.innerHTML=`<div class="se" style="background:${m.color}">${got?d.emoji:'❓'}</div>
      <div class="st"><b>${got?d.nombre:'¡Nuevo! Tesoro por descubrir'}</b><span>${got?'Ya es tuyo ✓ · toca para verlo':'✨ Toca para descubrir'}</span></div>
      <div class="chev">${got?'🃏':'›'}</div>`;
    b.onclick=()=> got ? verCarta(m,d) : abrirDescubrimiento(m.id,d.id,'v-world');
    sc.appendChild(b);
  });
  show('v-world');
}

/* ---------- extras de algunos mundos: sistema solar y T-Rex ---------- */
function pintarExtraMundo(m){
  const ex=document.getElementById('worldExtra'); if(!ex) return;
  ex.innerHTML=''; ex.style.display='none';
  const jugar=(fn)=>{ window._desdeArcade=false; window._desdeMundo=true; if(typeof mostrarGuia==='function') mostrarGuia(fn==='abrirOrdenar'?'ordenar':'trex', window[fn]); else window[fn](); };
  if(m.id==='espacio' && window.bolaPlaneta){
    const pl=m.descubrimientos.filter(d=>d.orden).sort((a,b)=>a.orden-b.orden);
    ex.innerHTML=`<div class="ssTitle">☀️ Toca un planeta para descubrirlo</div>
      <div class="ssRow"><span class="ssSun">☀️</span>${pl.map(d=>`<button class="ssP${S.coleccion[d.id]?' got':''}" data-id="${d.id}">${bolaPlaneta(d)}<span>${d.corto||d.nombre}</span></button>`).join('')}</div>
      <button class="bigBtn ssGo" id="ssGo">🪐 Juega: Ordena el sistema solar</button>`;
    ex.querySelectorAll('.ssP').forEach(b=>{ const d=pl.find(x=>x.id===b.dataset.id);
      b.onclick=()=> S.coleccion[d.id] ? verCarta(m,d) : abrirDescubrimiento(m.id,d.id,'v-world'); });
    document.getElementById('ssGo').onclick=()=>jugar('abrirOrdenar');
    ex.style.display='block';
  }
  if(m.id==='dinosaurios' && typeof abrirTrex==='function'){
    ex.innerHTML=`<button class="bigBtn ssGo trexGo" id="trexGo">🦖 Juega: T-Rex comelón</button>`;
    document.getElementById('trexGo').onclick=()=>jugar('abrirTrex');
    ex.style.display='block';
  }
}

/* ---------- ver una carta ya ganada (no repite el reto) ---------- */
function verCarta(m,d){
  if(window.SFX) SFX.tap();
  discActual={mundo:m, d}; window.discActual=discActual;
  document.getElementById('discTitle').textContent=d.nombre;
  document.getElementById('discFact').textContent=d.dato;
  pintarExtra(d);
  const vb=document.getElementById('vozBtn'); if(vb){ vb.style.display=(window.VOZ&&VOZ.disponible)?'':'none'; vb.onclick=()=>VOZ.leerFicha(d); }
  document.getElementById('discFb').innerHTML=danteSVG();
  document.getElementById('discBack').onclick=()=>abrirMundo(m.id);
  // el botón, en vez de repetir el reto, felicita y vuelve
  const btn=document.getElementById('discBtn');
  btn.textContent='🃏 ¡Ya tienes esta carta!';
  btn.onclick=()=>{ toast('🌟 ¡Genial! Busca un tesoro nuevo ✨'); abrirMundo(m.id); };
  cargarFoto(document.getElementById('discPhoto'), d);
  show('v-disc');
}

/* ---------- datos extra de la ficha: capital y momento importante ---------- */
function pintarExtra(d){
  const el=document.getElementById('discExtra'); if(!el) return;
  let h='';
  if(d.capital) h+=`<div class="xCap">🏙️ Capital: <b>${d.capital}</b></div>`;
  if(d.historia) h+=`<div class="xHist"><div class="xT">📜 ${d.capital?'Un momento importante':'¿Sabías que…?'}</div><p>${d.historia}</p></div>`;
  el.innerHTML=h; el.style.display=h?'block':'none';
}

/* ---------- descubrimiento (con foto real / respaldo) ---------- */
let discActual=null, discOrigen='v-home';
function abrirDescubrimiento(mundoId, discId, origen){
  const m=MUNDOS.find(x=>x.id===mundoId);
  const d=m.descubrimientos.find(x=>x.id===discId);
  discActual={mundo:m, d}; discOrigen=origen; window.discActual=discActual;
  document.getElementById('discTitle').textContent=d.nombre;
  document.getElementById('discFact').textContent=d.dato;
  pintarExtra(d);
  const vb=document.getElementById('vozBtn'); if(vb){ vb.style.display=(window.VOZ&&VOZ.disponible)?'':'none'; vb.onclick=()=>VOZ.leerFicha(d); }
  document.getElementById('discFb').innerHTML=danteSVG();
  document.getElementById('discBack').onclick=()=> origen==='v-world'?abrirMundo(mundoId): origen==='v-globo'?abrirGlobo():goHome();
  document.getElementById('discBtn').onclick=()=> elegirJuego(d);
  show('v-disc');
  cargarFoto(document.getElementById('discPhoto'), d); // foto real o respaldo
}

/* ---------- elige qué juego según el descubrimiento (variedad estable) ---------- */
function elegirJuego(d){
  let s=0; for(const c of (d.id||'')) s+=c.charCodeAt(0);
  // juegos con los datos de la ficha (lo que lee es lo que juega)
  const conDatos=[];
  if(typeof abrirSopa==='function')          conDatos.push({id:'sopa',fn:abrirSopa});
  if(typeof abrirRompecabezas==='function')  conDatos.push({id:'rompecabezas',fn:abrirRompecabezas});
  if(typeof abrirTrivia==='function')        conDatos.push({id:'trivia',fn:abrirTrivia});
  if(d.orden && typeof abrirOrdenar==='function') conDatos.push({id:'ordenar',fn:abrirOrdenar});
  if(/^di\d/.test(d.id) && typeof abrirTrex==='function') conDatos.push({id:'trex',fn:abrirTrex});
  window._desdeMundo=false;
  if(conDatos.length){
    let n=0; try{ n=parseInt(localStorage.getItem('danteLab_rotaJuego')||'0',10)||0; localStorage.setItem('danteLab_rotaJuego', String(n+1)); }catch(e){}
    const j=conDatos[(s+n) % conDatos.length];
    window._desdeArcade=false;
    if(typeof mostrarGuia==='function') return mostrarGuia(j.id, j.fn);
    return j.fn();
  }
  const juegos=[];
  if(typeof abrirCarrera==='function')   juegos.push({id:'carrera',fn:abrirCarrera});
  if(typeof abrirLaberinto==='function') juegos.push({id:'laberinto',fn:abrirLaberinto});
  if(typeof abrirParame==='function')    juegos.push({id:'parame',fn:abrirParame});
  if(typeof abrirLaser==='function')     juegos.push({id:'laser',fn:abrirLaser});
  if(typeof abrirRayuela==='function')   juegos.push({id:'rayuela',fn:abrirRayuela});
  if(typeof abrirMiniJuego==='function') juegos.push({id:'atrapa',fn:abrirMiniJuego});
  if(typeof abrirPenales==='function')   juegos.push({id:'penales',fn:abrirPenales});
  if(typeof abrirTablero==='function')   juegos.push({id:'tablero',fn:abrirTablero});
  if(juegos.length===0) return abrirReto();
  const j=juegos[s % juegos.length];
  if(typeof mostrarGuia==='function') return mostrarGuia(j.id, j.fn);
  return j.fn();
}

/* ---------- reto (mini-juego) ---------- */
function abrirReto(){
  // si el juego se lanzó desde el Arcade, no encadenar reto+carta: celebrar y volver
  if(window._desdeArcade){
    window._desdeArcade=false;
    if(window.SFX) SFX.premio();
    lanzarConfeti && lanzarConfeti();
    toast('🎉 ¡Buen juego! ¿Otra ronda?');
    if(typeof abrirArcade==='function') return abrirArcade();
    return show('v-home');
  }
  const d=discActual.d, m=discActual.mundo;
  document.getElementById('quizBack').onclick=()=>show('v-disc');
  document.getElementById('quizQ').textContent=d.reto.p;
  cargarFoto(document.getElementById('quizPhoto'), d);
  const oc=document.getElementById('quizOpts'); oc.innerHTML='';
  const letras=['A','B','C','D'];
  // barajar opciones para que la correcta no esté siempre en el mismo lugar
  const orden=d.reto.o.map((op,i)=>({op,i})).sort(()=>Math.random()-0.5);
  const correctaPos=orden.findIndex(x=>x.i===d.reto.correcta);
  orden.forEach((x,pos)=>{
    const b=document.createElement('button');
    b.className='opt';
    b.innerHTML=`<span class="letter">${letras[pos]}</span><span>${x.op}</span>`;
    b.onclick=()=>responder(b,pos,correctaPos);
    oc.appendChild(b);
  });
  show('v-quiz');
}
function responder(btn, elegida, correcta){
  const opts=document.querySelectorAll('#quizOpts .opt');
  opts.forEach(o=>o.style.pointerEvents='none');
  if(elegida===correcta){
    btn.classList.add('right');
    if(window.SFX) SFX.correcto();
    if(window.FX){ const c=FX.centro(btn); FX.burst(c.x,c.y,{n:12}); FX.popText(c.x,c.y,'¡Muy bien!','#7ac86a'); }
    setTimeout(()=>recompensa(true),800);
  }else{
    opts[correcta].classList.add('right');
    if(window.SFX) SFX.animo();
    const q=document.getElementById('quizQ'); if(q) q.textContent='¡Casi! Mira, la respuesta era esta 😊';
    setTimeout(()=>recompensa(true),1400);
  }
}

/* ---------- recompensa + subir nivel ---------- */
function recompensa(acierto){
  const d=discActual.d;
  const yaLoTenia = !!S.coleccion[d.id];
  // ganar carta
  if(!yaLoTenia){ S.coleccion[d.id]={fecha:new Date().toISOString()}; }
  // XP y gemas
  const xpGanado = acierto?50:20;
  S.xp += xpGanado;
  S.gemas += acierto?5:2;
  if(acierto) S.estrellas += 1;
  // subir de nivel (puede subir varios)
  let subio=false;
  while(S.xp >= xpParaNivel(S.nivel)){ S.xp -= xpParaNivel(S.nivel); S.nivel++; subio=true; }
  guardarJuego();

  // pantalla de recompensa
  document.getElementById('rewardTitle').textContent = acierto?('¡Lo lograste'+(S.nombre?', '+S.nombre:'')+'! 🎉'):'¡Casi! Igual aprendiste algo 💪';
  const rc=document.getElementById('rewardCard');
  rc.innerHTML=`<div class="rc-emoji">${d.emoji}</div><div class="rc-name">${d.nombre}</div>`;
  document.getElementById('xpGain').textContent='+'+xpGanado+' XP';
  document.getElementById('rewardMsg').textContent = yaLoTenia
     ? 'Ya tenías esta carta, ¡pero ganaste XP igual!'
     : (subio? '¡Nueva carta y SUBISTE al Nivel '+S.nivel+'! 🎊' : 'Ganaste una carta nueva para tu colección.');
  document.getElementById('rewardBtn').onclick=()=>continuarTrasRecompensa(subio, discActual.mundo?discActual.mundo.id:null);
  if(acierto||!yaLoTenia) lanzarConfeti();
  if(window.SFX){ if(subio) SFX.nivel(); else if(!yaLoTenia) SFX.premio(); }
  show('v-reward');
}

/* ---------- tras la recompensa: celebrar nivel y desbloqueos ---------- */
function continuarTrasRecompensa(subio, mundoId){
  // 1) ¿subió de nivel? -> celebración grande
  if(subio){ mostrarLevelUp(); return; }
  // 2) ¿completó un mundo? -> desbloqueo
  if(mundoId && window.PROGRESO){
    const rec=PROGRESO.revisarMundoCompleto(mundoId);
    if(rec){ mostrarUnlock(rec); return; }
  }
  // 3) nada especial -> opinión
  abrirOpinion();
}

function mostrarLevelUp(){
  const r = window.PROGRESO ? PROGRESO.rango(S.nivel) : {emoji:'⭐',nombre:'Explorador'};
  document.getElementById('luBadge').textContent = r.emoji;
  document.getElementById('luRank').textContent = r.nombre;
  document.getElementById('luSub').textContent = 'Ahora eres Nivel '+S.nivel+'. ¡Cada vez más fuerte!';
  document.getElementById('levelUp').classList.add('show');
  if(window.SFX) SFX.nivel();
  if(window.FX){ setTimeout(()=>{ for(let k=0;k<4;k++) setTimeout(()=>FX.burst(80+Math.random()*220, 150+Math.random()*200,{n:20,spread:130}), k*200); }, 300); }
}
function cerrarLevelUp(){
  document.getElementById('levelUp').classList.remove('show');
  // tras el nivel, revisar si además completó un mundo
  const mundoId = discActual && discActual.mundo ? discActual.mundo.id : null;
  if(mundoId && window.PROGRESO){
    const rec=PROGRESO.revisarMundoCompleto(mundoId);
    if(rec){ return mostrarUnlock(rec); }
  }
  abrirOpinion();
}

function mostrarUnlock(rec){
  document.getElementById('unlockEmoji').textContent = rec.emoji;
  document.getElementById('unlockName').textContent = rec.nombre;
  document.getElementById('unlockScreen').classList.add('show');
  if(window.SFX) SFX.premio();
  if(window.FX){ setTimeout(()=>{ for(let k=0;k<3;k++) setTimeout(()=>FX.burst(100+Math.random()*180, 180+Math.random()*160,{n:16,spread:110}), k*180); }, 300); }
}
function cerrarUnlock(){
  document.getElementById('unlockScreen').classList.remove('show');
  abrirOpinion();
}

/* ---------- confeti ---------- */
function lanzarConfeti(){
  const cols=['#ff9d2a','#ff6f9c','#5ad1ff','#95e06c','#ffd23f','#7a4ac8'];
  const c=document.createElement('div'); c.className='confetti';
  for(let i=0;i<60;i++){
    const p=document.createElement('div'); p.className='conf';
    p.style.left=Math.random()*100+'%';
    p.style.background=cols[i%cols.length];
    p.style.animationDuration=(1.5+Math.random()*1.5)+'s';
    p.style.animationDelay=(Math.random()*0.3)+'s';
    p.style.transform='rotate('+Math.random()*360+'deg)';
    c.appendChild(p);
  }
  document.body.appendChild(c);
  setTimeout(()=>c.remove(),3500);
}

/* ---------- mascota interactiva ---------- */
function mascotTap(){
  if(window.SFX) SFX.tap();
  const m=document.getElementById('mascot');
  m.classList.remove('jump'); void m.offsetWidth; m.classList.add('jump');
  document.getElementById('speech').textContent = saludo();
}

/* ---------- sonido on/off ---------- */
function toggleSnd(){
  if(!window.SFX) return;
  const on = SFX.toggle();
  document.getElementById('sndBtn').textContent = on ? '🔊' : '🔇';
  if(on) SFX.tap();
  toast(on ? '🔊 Sonido activado' : '🔇 Sonido apagado');
}

/* ---------- toast ---------- */
function toast(t){ const x=document.getElementById('toast'); x.textContent=t; x.classList.add('on'); setTimeout(()=>x.classList.remove('on'),2400); }

/* ---------- nubes decorativas ---------- */
(function(){
  const cl=document.getElementById('clouds');
  [[20,30,120],[72,12,90],[10,62,100],[80,55,80],[45,80,70]].forEach(c=>{
    const d=document.createElement('div'); d.className='cloud';
    d.style.left=c[0]+'%'; d.style.top=c[1]+'%'; d.style.width=c[2]+'px'; d.style.height=(c[2]*0.4)+'px';
    cl.appendChild(d);
  });
})();

/* ---------- primer arranque: perfiles ---------- */
function arranque(){
  // cargar el perfil activo si existe
  const pa = perfilActual();
  const perfiles = listaPerfiles();
  if(pa && perfiles.find(p=>p.id===pa)){
    SAVE_KEY='danteLab_save_v1_'+pa; S=cargarJuego(); window.S=S;
  }
  render();
  // MIGRACIÓN: si hay un save viejo sin perfiles, convertirlo en el primer perfil
  if(perfiles.length===0){
    try{
      const viejo = localStorage.getItem('danteLab_save_v1');
      if(viejo){ const v=JSON.parse(viejo); if(v && v.nombre){
        const id=crearPerfil(v.nombre, '🚀'); SAVE_KEY='danteLab_save_v1_'+id;
        S=Object.assign(estadoInicial(), v); guardarJuego(); window.S=S; render();
        return; // ya tiene perfil, entra normal
      }}
    }catch(e){}
  }
  // si no hay ningún perfil, o no hay activo -> pantalla de perfiles
  if(listaPerfiles().length===0 || !perfilActual()){
    mostrarPerfiles();
  }
}

/* ---------- pantalla de perfiles ---------- */
const AVATARES = ['🚀','🐠','🦊','🐼','🦁','🐲','🦉','🐙','🦄','🐯'];
function mostrarPerfiles(){
  const gc=document.querySelector('#gate .gc');
  const perfiles=listaPerfiles();
  let cards = perfiles.map(p=>
    `<button class="perfilCard" onclick="entrarPerfil('${p.id}')"><div class="paAv">${p.avatar||'🚀'}</div><div class="paName">${p.nombre}</div></button>`
  ).join('');
  const puedeCrear = perfiles.length<4;
  gc.innerHTML=`
    <div class="badge">✨ DANTE LAB</div>
    <h1 style="font-family:Baloo 2;font-weight:800;font-size:26px;color:var(--ink);margin:12px 0 4px;text-shadow:0 0 16px #a855f766">${perfiles.length? '¿Quién va a jugar?' : '¡Hola, explorador!'}</h1>
    <p style="font-weight:800;color:var(--inkSoft);margin-bottom:16px">${perfiles.length? 'Toca tu nombre para seguir tu aventura' : 'Vamos a crear tu explorador'}</p>
    <div class="perfilGrid">${cards}${puedeCrear? '<button class="perfilCard nuevo" onclick="nuevoPerfil()"><div class="paAv">➕</div><div class="paName">Nuevo</div></button>':''}</div>`;
}
function entrarPerfil(id){
  if(window.SFX) SFX.swoosh();
  setPerfilActual(id);
  render(); openGate();
}
function nuevoPerfil(){
  if(window.SFX) SFX.tap();
  const gc=document.querySelector('#gate .gc');
  gc.innerHTML=`
    <div class="badge">✨ Nuevo explorador</div>
    <h1 style="font-family:Baloo 2;font-weight:800;font-size:24px;color:var(--ink);margin:12px 0 8px">Elige tu avatar</h1>
    <div class="avatarGrid" id="avatarGrid">${AVATARES.map((a,i)=>`<button class="avOpt${i===0?' sel':''}" data-av="${a}">${a}</button>`).join('')}</div>
    <div class="nameCard" style="margin-top:16px">
      <input id="nameInput" placeholder="Tu nombre" maxlength="18" autocomplete="off">
      <button class="bigBtn" id="nameGo" style="margin-top:14px;opacity:.5;pointer-events:none">🚀 ¡EMPEZAR!</button>
    </div>`;
  let avSel=AVATARES[0];
  document.querySelectorAll('#avatarGrid .avOpt').forEach(b=>{
    b.onclick=()=>{ avSel=b.dataset.av; document.querySelectorAll('#avatarGrid .avOpt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); if(window.SFX)SFX.tap(); };
  });
  const inp=document.getElementById('nameInput'), go=document.getElementById('nameGo');
  inp.focus();
  inp.oninput=()=>{ const ok=inp.value.trim().length>=2; go.style.opacity=ok?'1':'.5'; go.style.pointerEvents=ok?'auto':'none'; };
  go.onclick=()=>{ const v=inp.value.trim(); if(v.length<2)return;
    crearPerfil(v, avSel); if(window.SFX)SFX.premio();
    render(); pedirPoderNuevo();
  };
}
// para un perfil nuevo, tras crear -> pedir poder y modo
function pedirPoderNuevo(){ pedirPoder(); }

/* ---------- cambiar de jugador (reabrir perfiles) ---------- */
function cambiarPerfil(){
  if(window.SFX) SFX.tap();
  const g=document.getElementById('gate');
  g.style.display='flex'; g.classList.remove('hide');
  mostrarPerfiles();
}
function pedirNombre(){
  const gc=document.querySelector('#gate .gc');
  gc.querySelector('p').style.display='none';
  gc.querySelectorAll('p')[1] && (gc.querySelectorAll('p')[1].style.display='none');
  const wrap=document.createElement('div');
  wrap.className='nameCard'; wrap.style.marginTop='14px';
  wrap.innerHTML=`<div style="font-family:Baloo 2;font-weight:800;font-size:18px;margin-bottom:10px;color:var(--ink)">¿Cómo te llamas?</div>
    <input id="nameInput" placeholder="Tu nombre" maxlength="18" autocomplete="off">
    <button class="bigBtn" id="nameGo" style="margin-top:14px;opacity:.5;pointer-events:none">✨ ¡ESE SOY YO!</button>`;
  gc.querySelector('.enter').replaceWith(wrap);
  const inp=document.getElementById('nameInput'), go=document.getElementById('nameGo');
  inp.focus();
  inp.oninput=()=>{ const v=inp.value.trim(); if(v.length>=2){go.style.opacity='1';go.style.pointerEvents='auto'} else {go.style.opacity='.5';go.style.pointerEvents='none'} };
  go.onclick=()=>{ const v=inp.value.trim(); if(v.length<2){toast('✍️ Escribe tu nombre');return} S.nombre=v; guardarJuego(); pedirPoder(); };
}

/* ---------- elegir superpoder (define cómo se adapta la rayuela) ---------- */
const PODERES=[
  {id:'ver',emoji:'👀',nombre:'Observar',desc:'Ves todos los detalles'},
  {id:'oir',emoji:'👂',nombre:'Escuchar',desc:'Descubres con sonidos'},
  {id:'recordar',emoji:'🧠',nombre:'Recordar',desc:'Tu memoria es genial'},
  {id:'resolver',emoji:'🧩',nombre:'Resolver',desc:'Te encantan los retos'},
  {id:'imaginar',emoji:'🎨',nombre:'Imaginar',desc:'Inventas cosas nuevas'},
  {id:'ayudar',emoji:'❤️',nombre:'Ayudar',desc:'Te importan los demás'}
];
function pedirPoder(){
  const gc=document.querySelector('#gate .gc');
  gc.innerHTML=`<div class="badge">✨ Una cosa más, ${S.nombre}</div>
    <h1 style="font-family:Baloo 2;font-weight:800;font-size:26px;color:var(--ink);margin:12px 0 4px">¿Cuál es tu superpoder?</h1>
    <p style="font-weight:800;color:#3a5a4a;margin-bottom:14px">Eso que haces increíble. Cambiará cómo juegas. 🦸</p>
    <div class="powerGrid" id="powerGrid"></div>`;
  const grid=document.getElementById('powerGrid');
  PODERES.forEach(p=>{
    const b=document.createElement('button'); b.className='powerCard';
    b.innerHTML=`<div class="pe">${p.emoji}</div><div class="pn">${p.nombre}</div><div class="pd">${p.desc}</div>`;
    b.onclick=()=>{ S.poder=p.id; guardarJuego(); if(window.SFX)SFX.premio();
      document.querySelectorAll('.powerCard').forEach(x=>x.classList.remove('sel')); b.classList.add('sel');
      setTimeout(()=>{ pedirModo(); }, 450); };
    grid.appendChild(b);
  });
}

/* ---------- elegir modo ---------- */
function pedirModo(){
  const gc=document.querySelector('#gate .gc');
  gc.innerHTML=`<div class="badge">✨ Última cosa, ${S.nombre}</div>
    <h1 style="font-family:Baloo 2;font-weight:800;font-size:24px;color:var(--ink);margin:12px 0 4px">¿Cómo quieres jugar?</h1>
    <p style="font-weight:800;color:#3a5a4a;margin-bottom:14px">Puedes cambiarlo cuando quieras 😊</p>
    <div class="modeGrid">
      <button class="modeCard m1" id="modoAventura"><div class="mcIcon">🚀</div><div class="mcName">Aventura</div><div class="mcDesc">Con retos y velocidad. ¡Va subiendo!</div></button>
      <button class="modeCard m2" id="modoTranquilo"><div class="mcIcon">🌈</div><div class="mcName">Tranquilo</div><div class="mcDesc">Sin reloj, sin prisa. Solo explorar.</div></button>
    </div>`;
  document.getElementById('modoAventura').onclick=()=>elegirModo('aventura');
  document.getElementById('modoTranquilo').onclick=()=>elegirModo('tranquilo');
}
function elegirModo(m){
  S.modo=m; guardarJuego(); if(window.SFX)SFX.premio();
  setTimeout(()=>{ render(); openGate(); }, 350);
}
function cambiarModo(){
  S.modo=(S.modo==='tranquilo')?'aventura':'tranquilo'; guardarJuego();
  if(window.SFX) SFX.tap();
  const b=document.getElementById('modeToggle'); if(b) b.textContent=S.modo==='tranquilo'?'🌈 Tranquilo':'🚀 Aventura';
  toast(S.modo==='tranquilo'?'🌈 Modo Tranquilo: sin prisa 😊':'🚀 Modo Aventura: ¡con retos!');
}

arranque();

/* ---------- PWA ---------- */
if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{})); }
