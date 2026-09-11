/* ============================================================
   DANTE LAB · sonidos (Web Audio API, sin archivos)
   Sonidos alegres tipo juego. Se activan al primer toque
   (los navegadores móviles exigen un gesto para sonar).
   Se puede silenciar con SFX.toggle().
   ============================================================ */
const SFX = (function(){
  let ctx = null, activado = false, silencio = false;

  function init(){
    if(ctx) return;
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ ctx = null; }
  }
  // desbloquear con el primer toque del usuario
  function unlock(){
    init();
    if(ctx && ctx.state === 'suspended') ctx.resume();
    activado = true;
  }
  window.addEventListener('touchstart', unlock, { once:false });
  window.addEventListener('click', unlock, { once:false });

  // una notita
  function nota(freq, t0, dur, tipo, vol){
    if(!ctx || silencio) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo || 'sine';
    o.frequency.value = freq;
    o.connect(g); g.connect(ctx.destination);
    const now = ctx.currentTime + t0;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.start(now); o.stop(now + dur + 0.02);
  }

  const api = {
    toggle(){ silencio = !silencio; return !silencio; },
    isOn(){ return !silencio; },
    // toque de botón: pop corto
    tap(){ init(); nota(520, 0, 0.09, 'triangle', 0.14); },
    // entrar a un mundo: subidita
    swoosh(){ init(); nota(300,0,0.12,'sine',0.12); nota(480,0.06,0.14,'sine',0.12); },
    // acierto: dos notas alegres ascendentes
    correcto(){ init(); nota(660,0,0.12,'triangle',0.16); nota(880,0.11,0.18,'triangle',0.16); },
    // error: suave, no castiga (nota grave corta, amable)
    // 'error' ya NO es castigo: toque suave y neutro (refuerzo positivo)
    error(){ init(); nota(440,0,0.10,'sine',0.10); },
    animo(){ init(); nota(500,0,0.10,'triangle',0.12); nota(620,0.09,0.14,'triangle',0.12); },
    // ganar carta: arpegio feliz
    premio(){ init(); [523,659,784,1046].forEach((f,i)=>nota(f,i*0.09,0.20,'triangle',0.16)); },
    // subir de nivel: fanfarria cortita
    nivel(){ init(); [523,659,784,1046,1318].forEach((f,i)=>nota(f,i*0.10,0.24,'square',0.12)); }
  };
  return api;
})();
