/* ============================================================
   DANTE LAB · Dificultad progresiva 🎚️
   Cada juego guarda su nivel. Cada vez que el niño gana, sube.
   Los juegos piden aquí sus parámetros según el nivel actual.
   Referencia: la dificultad crece como en Tomb of the Mask / Poki:
   más velocidad, más obstáculos, más memoria, menos tiempo.
   ============================================================ */
const DIF = (function(){
  const KEY='danteLab_niveles';
  function cargar(){ try{ return JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){ return {}; } }
  function guardar(o){ try{ localStorage.setItem(KEY, JSON.stringify(o)); }catch(e){} }

  return {
    // nivel actual de un juego (1..∞)
    tranquilo(){ try{ return window.S && window.S.modo==='tranquilo'; }catch(e){ return false; } },
    nivel(juego){ if(this.tranquilo()) return 1; const n=cargar(); return n[juego]||1; },
    // sube el nivel tras ganar (tope visual en 10 para no volverse imposible)
    subir(juego){ const n=cargar(); n[juego]=Math.min(10,(n[juego]||1)+1); guardar(n); return n[juego]; },
    // etiqueta bonita para mostrar
    etiqueta(juego){ const l=this.nivel(juego); return 'Nivel '+l; },

    // parámetros de CARRERAS según nivel
    carrera(l){ return {
      velBase: 3.0 + l*0.55,               // caen más rápido
      spawnMs: Math.max(320, 900 - l*70),   // aparecen más seguido
      dobleObstaculo: l>=4,                 // desde nivel 4, a veces 2 obstáculos por fila
      meta: 100 + (l-1)*12                  // pista un poco más larga
    }; },

    // parámetros de LÁSER según nivel
    laser(l){ var t=this.tranquilo(); return {
      meta: 10 + l*2,
      tiempo: t?999:Math.max(10, 16 - l),
      vidaMs: t?3000:Math.max(500, 900 - l*45),
      spawnMs: t?900:Math.max(380, 650 - l*30),
      probMalo: t?0:Math.min(0.38, 0.18 + l*0.03)
    }; },

    // parámetros de ATRAPA según nivel
    atrapa(l){ var t=this.tranquilo(); return {
      meta: 8 + l,
      tiempo: t?999:Math.max(8, 14 - l),
      velBase: t?1.6:3.0 + l*0.5,
      spawnMs: Math.max(300, 800 - l*55)
    }; },

    // parámetros de LABERINTO según nivel
    laberinto(l){ return {
      tam: Math.min(13, 7 + Math.floor((l-1)/1)*1) | 1  // 7,9,11,13 (siempre impar)
    }; },

    // parámetros de RAYUELA según nivel
    rayuela(l){ return {
      casillas: Math.min(12, 7 + (l-1)),    // más casillas
      velMostrar: Math.max(260, 520 - l*30) // secuencia más rápida (memoria)
    }; },

    // parámetros de PÁRAME según nivel
    parame(l){ var t=this.tranquilo(); return {
      tiempo: t?999:Math.max(3, 7 - Math.floor(l/2)),
      rondas: t?4:Math.min(8, 5 + Math.floor(l/2))
    }; }
  };
})();
window.DIF = DIF;
