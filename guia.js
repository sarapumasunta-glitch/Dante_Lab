/* DANTE LAB · Mascota guía (cómo jugar) */
(function(){
  const GUIAS = {
    carrera:  { emoji:'👈👉', txt:'Toca los lados para mover a tu personaje y esquivar. ¡Llega a la meta!' },
    laser:    { emoji:'👆✨', txt:'Toca los blancos que aparecen. ¡Mientras más rápido, mejor!' },
    atrapa:   { emoji:'👆🎁', txt:'Toca las cosas que caen para atraparlas antes de que lleguen abajo.' },
    laberinto:{ emoji:'👉🏁', txt:'Lleva a Dante hasta el tesoro deslizando el dedo o con las flechas.' },
    rayuela:  { emoji:'🌟👆', txt:'Toca las casillas en orden para llegar al final. ¡Sigue el camino!' },
    parame:   { emoji:'🔤👆', txt:'Toca la palabra que empieza con la letra. ¡Tú puedes!' }
  };
  function yaVista(id){ try{ return (JSON.parse(localStorage.getItem('danteLab_guias')||'{}'))[id]; }catch(e){ return false; } }
  function marcar(id){ try{ const g=JSON.parse(localStorage.getItem('danteLab_guias')||'{}'); g[id]=1; localStorage.setItem('danteLab_guias',JSON.stringify(g)); }catch(e){} }
  window.mostrarGuia = function(id, onJugar){
    const g=GUIAS[id];
    if(!g || yaVista(id)){ onJugar(); return; }
    let ov=document.getElementById('guideOverlay');
    if(!ov){ ov=document.createElement('div'); ov.id='guideOverlay'; document.body.appendChild(ov); }
    ov.className='guideOverlay';
    ov.innerHTML='<div class="guideCard"><div class="guideMascot">'+(window.danteSVG?window.danteSVG():'🤖')+'</div>'+
      '<div class="guidePicto">'+g.emoji+'</div><div class="guideTxt">'+g.txt+'</div>'+
      '<button class="bigBtn guideGo">▶ ¡A JUGAR!</button><button class="guideSkip">Saltar</button></div>';
    ov.style.display='flex';
    if(window.SFX) SFX.swoosh();
    const cerrar=()=>{ marcar(id); ov.style.display='none'; onJugar(); };
    ov.querySelector('.guideGo').onclick=cerrar;
    ov.querySelector('.guideSkip').onclick=cerrar;
  };
  window.reiniciarGuias = function(){ try{ localStorage.removeItem('danteLab_guias'); }catch(e){} };
})();
