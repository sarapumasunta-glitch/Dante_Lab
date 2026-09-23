/* ============================================================
   DANTE LAB · métricas de prueba (solo en este dispositivo)
   Nada se envía a internet. El adulto las comparte si quiere
   desde el Panel para adultos.
   ============================================================ */
(function(){
  const KEY='danteLab_metricas';
  function leer(){ try{ return JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){ return {}; } }
  function guardar(m){ try{ localStorage.setItem(KEY, JSON.stringify(m)); }catch(e){} }
  function pid(){ try{ return localStorage.getItem('danteLab_perfilActual')||'sin_perfil'; }catch(e){ return 'sin_perfil'; } }
  function hoy(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function perfil(m){
    const id=pid(); m.perfiles=m.perfiles||{};
    return m.perfiles[id] = m.perfiles[id] || { dias:{}, mundos:{}, fichas:{}, juegos:{}, globo:{aperturas:0,paises:{},oceanos:{}}, voz:0 };
  }
  function sumar(fn){ const m=leer(); if(!m.desde) m.desde=new Date().toISOString(); fn(perfil(m)); guardar(m); }
  function inc(obj,k,n){ obj[k]=(obj[k]||0)+(n||1); }

  // tiempo activo: suma cada 15 s mientras la app está a la vista
  let ultimoJuego=null;
  setInterval(()=>{ if(document.visibilityState==='visible') sumar(p=>inc(p.dias, hoy(), 15)); }, 15000);

  window.TELEMETRIA = {
    KEY, leer, guardar,
    mundo(id){ sumar(p=>inc(p.mundos,id)); },
    ficha(id){ sumar(p=>inc(p.fichas,id)); },
    juego(id){ ultimoJuego=id; sumar(p=>{ p.juegos[id]=p.juegos[id]||{jugadas:0,terminadas:0}; p.juegos[id].jugadas++; }); },
    termino(){ if(!ultimoJuego) return; const id=ultimoJuego; ultimoJuego=null; sumar(p=>{ p.juegos[id]=p.juegos[id]||{jugadas:0,terminadas:0}; p.juegos[id].terminadas++; }); },
    globo(tipo,id){ sumar(p=>{ if(tipo==='abrir') p.globo.aperturas++; else if(tipo==='pais') inc(p.globo.paises,id); else if(tipo==='oceano') inc(p.globo.oceanos,id); }); },
    voz(){ sumar(p=>p.voz++); },
    estrellas(id,n){ sumar(p=>{ p.estrellas=p.estrellas||{}; p.estrellas[id]=p.estrellas[id]||[0,0,0]; p.estrellas[id][n-1]++; }); }
  };

  // engancha las funciones existentes sin tocar cada juego
  function envolver(nombre, antes){
    const f=window[nombre]; if(typeof f!=='function' || f._tm) return;
    const w=function(){ try{ antes.apply(this,arguments); }catch(e){} return f.apply(this,arguments); };
    w._tm=true; window[nombre]=w;
  }
  window.addEventListener('load', ()=>{
    envolver('abrirMundo', id=>TELEMETRIA.mundo(id));
    envolver('abrirDescubrimiento', (m,d)=>TELEMETRIA.ficha(d));
    const JUEGOS={ abrirMiniJuego:'atrapa', abrirLaberinto:'laberinto', abrirCarrera:'carreras', abrirParame:'parame',
      abrirLaser:'laser', abrirRayuela:'rayuela', abrirConstructor:'constructor', abrirPenales:'penales', abrirTablero:'tablero',
      abrirSopa:'sopa', abrirRompecabezas:'rompecabezas', abrirTrivia:'trivia', abrirOrdenar:'ordenar', abrirTrex:'trex2', abrirTrexClasico:'trex' };
    Object.keys(JUEGOS).forEach(fn=>envolver(fn, ()=>TELEMETRIA.juego(JUEGOS[fn])));
    envolver('abrirReto', ()=>TELEMETRIA.termino());
  });
})();
