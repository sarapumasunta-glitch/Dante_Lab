/* ============================================================
   DANTE LAB · Rayuela sensorial 🌀
   Salta de casilla en casilla hasta el final. La forma de jugar
   se ADAPTA al superpoder del niño (inclusión real):
     - ver / imaginar  -> VISUAL: toca la casilla marcada ⭐
     - oir / ayudar    -> SECUENCIA: sigue las casillas que brillan/suenan
     - recordar/resolver-> MEMORIA: mira el camino, luego repítelo
   Sin "perder": si se equivoca, la casilla vibra y puede reintentar.
   ============================================================ */
(function(){
  let N = 7;                 // casillas de la rayuela
  let modo='visual', paso=0, activo=false, secuencia=[], mostrando=false, tema=null;

  function poder(){ try{ return (window.S && window.S.poder) || 'ver'; }catch(e){ return 'ver'; } }
  function modoDe(p){
    if(p==='oir'||p==='ayudar') return 'sonido';
    if(p==='recordar'||p==='resolver') return 'memoria';
    return 'visual'; // ver, imaginar y por defecto
  }
  function tema_(){ const id=(window.discActual&&window.discActual.mundo&&window.discActual.mundo.id)||'oceano'; var T=window.TEMAS||{}; return T[id]||T.oceano||{color:'#2a9fe0'}; }

  window.abrirRayuela = function(){
    tema=tema_(); modo=modoDe(poder());
    var c=(window.DIF?DIF.rayuela(DIF.nivel('rayuela')):{casillas:7}); N=c.casillas;
    paso=0; activo=true; secuencia=[]; mostrando=false;
    const cont=document.getElementById('rayCasillas'); cont.innerHTML='';
    // construir casillas (de abajo hacia arriba, en zigzag como rayuela real)
    for(let i=0;i<N;i++){
      const c=document.createElement('button'); c.className='rayCell'; c.dataset.i=i;
      c.innerHTML='<span class="rn">'+(i+1)+'</span>';
      // zig-zag: alternar alineación
      c.style.alignSelf = (i%3===0?'center':(i%3===1?'flex-start':'flex-end'));
      c.onclick=()=>pisar(i, c);
      cont.appendChild(c);
    }
    // meta arriba
    document.getElementById('rayGoal').textContent = tema.color? '🏁' : '🏁';
    document.getElementById('rayBack').onclick=()=>{ activo=false; show('v-disc'); };
    pintarInstruccion();
    show('v-ray');
    if(modo==='memoria' || modo==='sonido'){ prepararSecuencia(); }
    else { marcarSiguiente(); }
  };

  function pintarInstruccion(){
    const h=document.getElementById('rayHint');
    if(modo==='visual')  h.textContent='👀 Toca la casilla que brilla ⭐';
    if(modo==='sonido')  h.textContent='👂 Mira y escucha… luego repite el camino';
    if(modo==='memoria') h.textContent='🧠 Memoriza el camino… ¡y repítelo!';
    document.getElementById('rayMode').textContent =
      modo==='visual'?'👀 Modo mirar':modo==='sonido'?'👂 Modo escuchar':'🧠 Modo recordar';
  }

  /* ----- modo VISUAL: marca la siguiente casilla, hay que tocarla en orden ----- */
  function marcarSiguiente(){
    limpiarMarcas();
    const c=celda(paso); if(!c) return ganar();
    c.classList.add('target');
  }

  /* ----- modos SECUENCIA/MEMORIA: muestra el camino y el niño lo repite ----- */
  function prepararSecuencia(){
    secuencia=[]; for(let i=0;i<N;i++) secuencia.push(i); // camino recto 0..N-1
    mostrarSecuencia();
  }
  function mostrarSecuencia(){
    mostrando=true; activo=false;
    document.getElementById('rayHint').textContent = modo==='sonido'?'👂 Escucha el camino…':'🧠 Observa el camino…';
    let k=0;
    const iv=setInterval(()=>{
      limpiarMarcas();
      const c=celda(secuencia[k]);
      if(c){ c.classList.add('flash'); if(window.SFX){ notaPaso(k); } setTimeout(()=>c.classList.remove('flash'),380); }
      k++;
      if(k>=secuencia.length){ clearInterval(iv); setTimeout(()=>{ mostrando=false; activo=true; paso=0;
        document.getElementById('rayHint').textContent='¡Ahora repite el camino! 👆'; }, 450); }
    }, 520);
  }
  function notaPaso(k){
    // sonidito ascendente por casilla (usa SFX.tap si no hay tono propio)
    if(window.SFX && SFX.tap) SFX.tap();
  }

  function pisar(i, c){
    if(!activo || mostrando) return;
    const esperado = (modo==='visual') ? paso : secuencia[paso];
    if(i===esperado){
      c.classList.add('ok'); if(window.SFX) SFX.tap();
      if(window.FX){ const cc=FX.centro(c); FX.burst(cc.x,cc.y,{n:8}); FX.sparkle(cc.x,cc.y); }
      setTimeout(()=>c.classList.remove('ok'),300);
      paso++;
      if(paso>=N) return ganar();
      if(modo==='visual') marcarSiguiente();
    }else{
      c.classList.add('nope'); if(window.SFX) SFX.animo();
      setTimeout(()=>c.classList.remove('nope'),350);
      document.getElementById('rayHint').textContent='¡Casi! Prueba otra casilla 😊';
      if(modo!=='visual'){ // en memoria, reinicia el intento con ayuda
        paso=0; setTimeout(()=>{ if(activo) mostrarSecuencia(); }, 700);
      }
    }
  }

  function celda(i){ return document.querySelector('#rayCasillas .rayCell[data-i="'+i+'"]'); }
  function limpiarMarcas(){ document.querySelectorAll('#rayCasillas .rayCell').forEach(c=>c.classList.remove('target','flash')); }

  function ganar(){
    if(window.DIF) DIF.subir('rayuela');
    if(!activo && modo==='visual'){} activo=false;
    limpiarMarcas();
    // celebrar: encender todas
    document.querySelectorAll('#rayCasillas .rayCell').forEach((c,i)=>setTimeout(()=>c.classList.add('ok'), i*70));
    document.getElementById('rayHint').textContent='🏁 ¡Llegaste al final! 🎉';
    if(window.SFX) SFX.premio();
    setTimeout(()=>{ if(typeof abrirReto==='function') abrirReto(); }, 1200);
  }
})();
