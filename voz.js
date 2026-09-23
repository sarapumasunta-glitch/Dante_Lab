/* ============================================================
   DANTE LAB · "Escúchalo": lee la ficha en voz alta
   Usa la voz del propio dispositivo (sin internet, sin peso extra)
   ============================================================ */
(function(){
  const ok = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  let voz=null, hablando=false;
  function elegirVoz(){
    if(!ok) return;
    const vs=speechSynthesis.getVoices().filter(v=>/^es/i.test(v.lang));
    const pref=['es-419','es-MX','es-US','es-EC','es-CO','es-ES'];
    voz = pref.map(p=>vs.find(v=>v.lang.replace('_','-')===p)).find(Boolean) || vs[0] || null;
  }
  if(ok){ elegirVoz(); speechSynthesis.onvoiceschanged=elegirVoz; }

  function pintar(){ const b=document.getElementById('vozBtn'); if(b){ b.textContent = hablando?'⏹️ Parar':'🔊 Escúchalo'; b.classList.toggle('on',hablando); } }
  function parar(){ if(ok){ speechSynthesis.cancel(); } hablando=false; pintar(); }

  window.VOZ = {
    disponible: ok,
    parar,
    leer(texto){
      if(!ok) return;
      if(hablando){ parar(); return; }
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(texto);
      u.lang = voz ? voz.lang : 'es-419'; if(voz) u.voice=voz;
      u.rate=0.95; u.pitch=1.05;
      u.onend=u.onerror=()=>{ hablando=false; pintar(); };
      hablando=true; pintar();
      speechSynthesis.speak(u);
      if(window.TELEMETRIA) TELEMETRIA.voz();
    },
    // arma el texto de una ficha
    leerFicha(d){
      if(!d) return;
      let t = d.nombre+'. '+d.dato;
      if(d.capital) t += ' Su capital es '+d.capital+'.';
      if(d.historia) t += ' '+d.historia;
      this.leer(t.replace(/[«»]/g,''));
    }
  };
})();
