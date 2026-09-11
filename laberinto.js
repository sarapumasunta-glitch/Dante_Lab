/* ============================================================
   DANTE LAB · mini-juego "Laberinto"
   Lleva a Dante hasta el tesoro. Se juega arrastrando el dedo
   O con las flechas grandes (inclusión: dos formas de jugar).
   Sin reloj, sin perder. Al llegar, sigue al reto/quiz.
   ============================================================ */
(function(){
  let N = 7;                 // tamaño del laberinto (crece con el nivel)
  let cv, ctx, cell, grid, px, py, tx, ty, activo=false, dragOn=false;

  // genera laberinto con DFS (siempre tiene solución)
  function generar(){
    // cada celda: paredes [arriba,derecha,abajo,izq] = true (cerrado)
    grid = Array.from({length:N},()=>Array.from({length:N},()=>({v:false,w:[true,true,true,true]})));
    const stack=[]; let cx=0, cy=0; grid[cy][cx].v=true; stack.push([cx,cy]);
    const dirs=[[0,-1,0,2],[1,0,1,3],[0,1,2,0],[-1,0,3,1]]; // dx,dy,paredActual,paredVecino
    while(stack.length){
      const [x,y]=stack[stack.length-1];
      const opciones=dirs.filter(([dx,dy])=>{
        const nx=x+dx, ny=y+dy;
        return nx>=0&&nx<N&&ny>=0&&ny<N&&!grid[ny][nx].v;
      });
      if(opciones.length){
        const [dx,dy,wa,wb]=opciones[Math.floor(Math.random()*opciones.length)];
        const nx=x+dx, ny=y+dy;
        grid[y][x].w[wa]=false; grid[ny][nx].w[wb]=false;
        grid[ny][nx].v=true; stack.push([nx,ny]);
      } else stack.pop();
    }
    px=0; py=0; tx=N-1; ty=N-1;
  }

  function dibujar(){
    const size=cv.width;
    cell=size/N;
    ctx.clearRect(0,0,size,size);
    // fondo suave
    ctx.fillStyle='#eaf6ff'; ctx.fillRect(0,0,size,size);
    // paredes
    ctx.strokeStyle='#3a7ab0'; ctx.lineWidth=Math.max(3,cell*0.10); ctx.lineCap='round';
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){
      const w=grid[y][x].w, X=x*cell, Y=y*cell;
      ctx.beginPath();
      if(w[0]){ctx.moveTo(X,Y);ctx.lineTo(X+cell,Y);}
      if(w[1]){ctx.moveTo(X+cell,Y);ctx.lineTo(X+cell,Y+cell);}
      if(w[2]){ctx.moveTo(X,Y+cell);ctx.lineTo(X+cell,Y+cell);}
      if(w[3]){ctx.moveTo(X,Y);ctx.lineTo(X,Y+cell);}
      ctx.stroke();
    }
    // tesoro
    ctx.font=(cell*0.62)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('🎁', tx*cell+cell/2, ty*cell+cell/2);
    // Dante (mascota)
    ctx.fillText('🤖', px*cell+cell/2, py*cell+cell/2);
  }

  function puedeIr(dx,dy){
    const w=grid[py][px].w;
    if(dx===1) return !w[1];
    if(dx===-1) return !w[3];
    if(dy===1) return !w[2];
    if(dy===-1) return !w[0];
    return false;
  }

  window.mazeMove=function(dx,dy){
    if(!activo) return;
    if(puedeIr(dx,dy)){
      px+=dx; py+=dy;
      if(window.SFX) SFX.tap();
      dibujar();
      if(px===tx&&py===ty) ganar();
    }
  };
  window.mazeTouch=function(ev,dx,dy){ if(ev&&ev.preventDefault) ev.preventDefault(); mazeMove(dx,dy); };

  // arrastre: mover según dirección del gesto entre celdas
  function pointer(ev){
    if(!activo||!dragOn) return;
    const r=cv.getBoundingClientRect();
    const t=ev.touches?ev.touches[0]:ev;
    const gx=Math.floor((t.clientX-r.left)/(r.width/N));
    const gy=Math.floor((t.clientY-r.top)/(r.height/N));
    const dx=gx-px, dy=gy-py;
    // solo pasos de 1 celda ortogonales
    if(Math.abs(dx)+Math.abs(dy)===1) mazeMove(dx,dy);
  }

  window.abrirLaberinto=function(){
    var c=(window.DIF?DIF.laberinto(DIF.nivel('laberinto')):{tam:7}); N=(c.tam%2===0?c.tam+1:c.tam);
    cv=document.getElementById('mazeCanvas'); ctx=cv.getContext('2d');
    // tamaño real del canvas segun su ancho en pantalla
    const w=Math.min(360, (document.getElementById('v-maze').clientWidth||340));
    cv.width=w; cv.height=w;
    generar(); dibujar(); activo=true;
    document.getElementById('mazeHint').textContent='Desliza el dedo o usa las flechas 👇';
    document.getElementById('mazeBack').onclick=()=>{ activo=false; show('v-disc'); };
    // gestos
    cv.ontouchstart=(e)=>{dragOn=true;pointer(e);};
    cv.ontouchmove=pointer;
    cv.ontouchend=()=>{dragOn=false;};
    cv.onmousedown=(e)=>{dragOn=true;pointer(e);};
    cv.onmousemove=pointer;
    cv.onmouseup=()=>{dragOn=false;};
    show('v-maze');
    // redibujar por si el layout tardó
    setTimeout(()=>{ const w2=Math.min(360,(document.getElementById('v-maze').clientWidth||340)); if(w2!==cv.width){cv.width=w2;cv.height=w2;dibujar();} },60);
  };

  function ganar(){
    if(!activo) return;
    activo=false;
    if(window.DIF) DIF.subir('laberinto');
    if(window.SFX) SFX.correcto();
    if(window.FX){ const r=cv.getBoundingClientRect(); FX.burst(r.left+r.width/2,r.top+r.height/2,{n:24,spread:120}); FX.shake(cv,6); }
    document.getElementById('mazeHint').textContent='¡Llegaste al tesoro! 🎉';
    setTimeout(()=>{ if(typeof abrirReto==='function') abrirReto(); }, 900);
  }
})();
