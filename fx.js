/* ============================================================
   DANTE LAB · Motor de efectos "jugosos" (FX) 🎆
   Un solo sistema que TODOS los juegos usan para sentirse vivos:
   - burst(x,y): estallido de partículas de colores
   - sparkle(el): destello sobre un elemento
   - shake(el): sacudida de pantalla (screen shake)
   - popText(x,y,txt): número/palabra flotante que sube
   - trail(x,y): rastro de brillo
   Ligero, sin librerías, en una capa <canvas>/<div> encima del juego.
   ============================================================ */
const FX = (function(){
  let layer=null;

  function capa(){
    if(layer && document.body.contains(layer)) return layer;
    layer=document.createElement('div');
    layer.id='fxLayer';
    layer.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden';
    document.body.appendChild(layer);
    return layer;
  }

  const COLORS=['#ff5a5f','#ffd23f','#3ac0c0','#7ac86a','#8a5ce0','#ff9d2a','#ff6f9c','#5ad1ff'];

  // estallido de partículas en (x,y)
  function burst(x,y,opts){
    opts=opts||{};
    const n=opts.n||14, L=capa();
    for(let i=0;i<n;i++){
      const p=document.createElement('div');
      const sz=(opts.size||6)+Math.random()*5;
      const col=opts.color||COLORS[(Math.random()*COLORS.length)|0];
      p.style.cssText='position:absolute;width:'+sz+'px;height:'+sz+'px;border-radius:'+(Math.random()<.5?'50%':'3px')+
        ';background:'+col+';left:'+x+'px;top:'+y+'px;will-change:transform,opacity';
      L.appendChild(p);
      const ang=Math.random()*Math.PI*2, spd=(opts.spread||60)+Math.random()*70;
      const dx=Math.cos(ang)*spd, dy=Math.sin(ang)*spd - 30;
      const dur=520+Math.random()*380;
      p.animate([
        {transform:'translate(0,0) scale(1)',opacity:1},
        {transform:'translate('+dx+'px,'+(dy+90)+'px) scale(.3)',opacity:0}
      ],{duration:dur,easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>p.remove();
    }
  }

  // destello circular sobre elemento o punto
  function sparkle(x,y){
    const L=capa(), s=document.createElement('div');
    s.style.cssText='position:absolute;left:'+(x-20)+'px;top:'+(y-20)+'px;width:40px;height:40px;border-radius:50%;'+
      'background:radial-gradient(circle,#ffffffdd,transparent 70%);will-change:transform,opacity';
    L.appendChild(s);
    s.animate([{transform:'scale(.2)',opacity:1},{transform:'scale(2.4)',opacity:0}],
      {duration:420,easing:'ease-out'}).onfinish=()=>s.remove();
  }

  // sacudida de pantalla sobre un contenedor
  function shake(el,fuerza){
    el=el||document.querySelector('.view.active')||document.body;
    fuerza=fuerza||8;
    el.animate([
      {transform:'translate(0,0)'},
      {transform:'translate('+(-fuerza)+'px,'+(fuerza/2)+'px)'},
      {transform:'translate('+fuerza+'px,'+(-fuerza/2)+'px)'},
      {transform:'translate('+(-fuerza/2)+'px,'+fuerza+'px)'},
      {transform:'translate(0,0)'}
    ],{duration:260,easing:'ease-in-out'});
  }

  // texto/numero flotante que sube y se desvanece
  function popText(x,y,txt,color){
    const L=capa(), t=document.createElement('div');
    t.textContent=txt;
    t.style.cssText='position:absolute;left:'+x+'px;top:'+y+'px;transform:translate(-50%,-50%);'+
      'font-family:"Baloo 2",sans-serif;font-weight:800;font-size:26px;color:'+(color||'#ffd23f')+
      ';text-shadow:0 2px 6px #0007,0 0 2px #0009;will-change:transform,opacity';
    L.appendChild(t);
    t.animate([
      {transform:'translate(-50%,-50%) scale(.6)',opacity:0},
      {transform:'translate(-50%,-120%) scale(1.2)',opacity:1,offset:.3},
      {transform:'translate(-50%,-210%) scale(1)',opacity:0}
    ],{duration:900,easing:'ease-out'}).onfinish=()=>t.remove();
  }

  // rastro de brillo (para cosas en movimiento)
  function trail(x,y,color){
    const L=capa(), d=document.createElement('div');
    d.style.cssText='position:absolute;left:'+(x-4)+'px;top:'+(y-4)+'px;width:8px;height:8px;border-radius:50%;'+
      'background:'+(color||'#ffffffaa')+';will-change:transform,opacity';
    L.appendChild(d);
    d.animate([{opacity:.8,transform:'scale(1)'},{opacity:0,transform:'scale(.3)'}],
      {duration:400}).onfinish=()=>d.remove();
  }

  // helpers para obtener el centro de un elemento
  function centro(el){ const r=el.getBoundingClientRect(); return {x:r.left+r.width/2, y:r.top+r.height/2}; }

  return { burst, sparkle, shake, popText, trail, centro, colors:COLORS };
})();
window.FX = FX;
