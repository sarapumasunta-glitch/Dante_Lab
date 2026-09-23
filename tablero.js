/* ============================================================
   DANTE LAB · Tablero de aventura 🎲 (versión simple del Monopolio)
   Dante tira un dado y avanza por casillas de su mundo. Cada
   casilla le pasa algo: gana estrellas, sorpresa, avanza más, o
   un mini-dato. Mecánica nueva: dado + recorrido + azar.
   Es exploración pura — el corazón de DANTE LAB.
   Sin "perder": siempre avanza, llegar a la meta = ganar.
   ============================================================ */
(function(){
  const CASILLAS = 15;
  let running=false, pos=0, tema=null, ficha='🚀', tirando=false;

  const FICHAS = { oceano:'🐠', animales:'🦁', espacio:'🚀', paises:'🧭', tecnologia:'🤖', dinosaurios:'🦖' };
  // tipos de casilla: normal, estrella, sorpresa, salto, meta
  let tablero=[];

  function fichaMundo(){ const id=(window.discActual&&window.discActual.mundo&&window.discActual.mundo.id)||'oceano'; return FICHAS[id]||'🚀'; }

  window.abrirTablero = function(){
    ficha=fichaMundo(); running=true; pos=0;
    // generar tablero con casillas de tipo aleatorio (cada partida distinto)
    tablero=[];
    for(let i=0;i<CASILLAS;i++){
      if(i===0) tablero.push('inicio');
      else if(i===CASILLAS-1) tablero.push('meta');
      else{
        const r=Math.random();
        tablero.push(r<0.30?'estrella': r<0.50?'sorpresa': r<0.65?'salto': 'normal');
      }
    }
    document.getElementById('tabBack').onclick=()=>{ running=false; show('v-disc'); };
    document.getElementById('tabHint').textContent='¡Toca el dado para avanzar! 🎲';
    document.getElementById('tabStars').textContent='0';
    pintarTablero();
    const dado=document.getElementById('tabDado');
    dado.textContent='🎲'; dado.onclick=tirarDado;
    show('v-tab');
  };

  let estrellasGanadas=0;
  function pintarTablero(){
    const cont=document.getElementById('tabCasillas'); cont.innerHTML='';
    const iconos={inicio:'🏁',meta:'🏆',estrella:'⭐',sorpresa:'🎁',salto:'🚀',normal:'·'};
    tablero.forEach((t,i)=>{
      const c=document.createElement('div'); c.className='tabCell'+(i===pos?' aqui':'')+(t==='meta'?' meta':'');
      c.dataset.i=i;
      c.innerHTML='<span class="tc">'+(i===pos?ficha:iconos[t])+'</span>';
      cont.appendChild(c);
    });
  }

  function tirarDado(){
    if(!running || tirando) return;
    tirando=true;
    const dado=document.getElementById('tabDado');
    if(window.SFX) SFX.tap();
    // animación de dado girando
    let giros=0;
    const iv=setInterval(()=>{ dado.textContent='🎲'; dado.style.transform='rotate('+(giros*90)+'deg) scale(1.1)'; giros++; if(giros>6){ clearInterval(iv); dado.style.transform='';
      const n=1+Math.floor(Math.random()*4);   // dado de 1-4 (avance no muy largo)
      dado.textContent=['⚀','⚁','⚂','⚃','⚄','⚅'][n-1];
      document.getElementById('tabHint').textContent='¡Sacaste '+n+'! 🎲';
      setTimeout(()=>avanzar(n), 500);
    } }, 90);
  }

  function avanzar(n){
    let pasos=n;
    const paso=()=>{
      if(pasos<=0){ tirando=false; return resolverCasilla(); }
      pos=Math.min(tablero.length-1, pos+1);
      pintarTablero();
      if(window.SFX) SFX.tap();
      pasos--;
      if(pos>=tablero.length-1){ pintarTablero(); return resolverCasilla(); }
      setTimeout(paso, 260);
    };
    paso();
  }

  function resolverCasilla(){
    tirando=false;
    const t=tablero[pos];
    const cont=document.getElementById('tabCasillas');
    const cell=cont.querySelector('.tabCell[data-i="'+pos+'"]');
    const rect=cell?cell.getBoundingClientRect():null;
    if(t==='meta'){ return ganar(); }
    if(t==='estrella'){
      estrellasGanadas+=2; document.getElementById('tabStars').textContent=estrellasGanadas;
      document.getElementById('tabHint').textContent='⭐ ¡Ganaste 2 estrellas!';
      if(window.SFX) SFX.correcto();
      if(window.FX&&rect){ FX.burst(rect.left+rect.width/2,rect.top,{n:14,color:'#ffd23f'}); FX.popText(rect.left+rect.width/2,rect.top,'+2⭐','#ffd23f'); }
    } else if(t==='sorpresa'){
      const premios=[{t:'⭐ ¡Sorpresa! +3 estrellas',s:3},{t:'🎉 ¡Genial! +1 estrella',s:1},{t:'✨ ¡Qué suerte! +2 estrellas',s:2}];
      const pr=premios[Math.floor(Math.random()*premios.length)];
      estrellasGanadas+=pr.s; document.getElementById('tabStars').textContent=estrellasGanadas;
      document.getElementById('tabHint').textContent=pr.t;
      if(window.SFX) SFX.premio();
      if(window.FX&&rect){ FX.burst(rect.left+rect.width/2,rect.top,{n:18}); }
    } else if(t==='salto'){
      document.getElementById('tabHint').textContent='🚀 ¡Cohete! Avanzas 2 casillas más';
      if(window.SFX) SFX.correcto();
      setTimeout(()=>avanzar(2), 600);
      return;
    } else {
      document.getElementById('tabHint').textContent='Toca el dado para seguir 🎲';
    }
  }

  function ganar(){
    running=false;
    if(window.SFX) SFX.premio();
    if(window.DIF) DIF.subir('tablero');
    document.getElementById('tabHint').textContent='🏆 ¡Llegaste a la meta! Ganaste '+estrellasGanadas+' estrellas 🎉';
    if(window.FX){ const a=document.getElementById('tabCasillas'); const r=a.getBoundingClientRect(); for(let k=0;k<3;k++) setTimeout(()=>FX.burst(r.left+r.width*(.3+Math.random()*.4),r.top+r.height*.4,{n:18,spread:110}),k*180); }
    setTimeout(()=>{ if(typeof abrirReto==='function') abrirReto(); }, 1400);
  }
})();
