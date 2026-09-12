/* ============================================================
   DANTE LAB · Sistema de progresión 🏆
   El corazón del enganche: metas visibles + recompensas.
   - Cada mundo tiene una META (juntar sus cartas) y una RECOMPENSA.
   - Al completar un mundo: celebración + desbloqueo.
   - Subir de nivel: animación grande "¡SUBISTE DE NIVEL!".
   - XP total del explorador con rangos (Novato -> Leyenda).
   ============================================================ */
const PROGRESO = (function(){

  // rangos de explorador según nivel (da sensación de crecer)
  const RANGOS = [
    {min:1,  nombre:'Explorador Novato', emoji:'🌱'},
    {min:3,  nombre:'Explorador Curioso', emoji:'🔎'},
    {min:5,  nombre:'Explorador Valiente', emoji:'⚡'},
    {min:8,  nombre:'Explorador Experto', emoji:'🌟'},
    {min:12, nombre:'Explorador Maestro', emoji:'👑'},
    {min:16, nombre:'¡Leyenda de DANTE LAB!', emoji:'🏆'}
  ];

  // recompensa que da cada mundo al completarse (desbloqueables)
  const RECOMPENSAS = {
    oceano:   {emoji:'🐠', nombre:'Compañero Pez', tipo:'buddy', id:'pez'},
    animales: {emoji:'🦊', nombre:'Compañero Zorro', tipo:'buddy', id:'zorro'},
    espacio:  {emoji:'🚀', nombre:'Compañero Cohete', tipo:'buddy', id:'cohete'},
    lugares:  {emoji:'🌈', nombre:'Colores mágicos', tipo:'tema', id:'arcoiris'}
  };

  function rango(nivel){
    let r=RANGOS[0];
    for(const x of RANGOS){ if(nivel>=x.min) r=x; }
    return r;
  }

  // ¿cuántas cartas tiene un mundo y cuántas completó?
  function progresoMundo(mundoId){
    const S=window.S||{coleccion:{}};
    const m=(window.MUNDOS||[]).find(x=>x.id===mundoId);
    if(!m) return {hechas:0,total:0,completo:false};
    const total=m.descubrimientos.length;
    const hechas=m.descubrimientos.filter(d=>S.coleccion[d.id]).length;
    return {hechas,total,completo:hechas>=total && total>0};
  }

  // desbloqueados (guardado)
  function desbloqueados(){ try{ return JSON.parse(localStorage.getItem('danteLab_desbloqueos')||'[]'); }catch(e){ return []; } }
  function desbloquear(id){ try{ const d=desbloqueados(); if(!d.includes(id)){ d.push(id); localStorage.setItem('danteLab_desbloqueos',JSON.stringify(d)); return true; } }catch(e){} return false; }

  // revisa si algún mundo se acaba de completar y da su recompensa
  // devuelve la recompensa nueva (o null)
  function revisarMundoCompleto(mundoId){
    const p=progresoMundo(mundoId);
    if(p.completo){
      const rec=RECOMPENSAS[mundoId];
      if(rec && desbloquear('mundo_'+mundoId)){
        return rec; // recompensa nueva
      }
    }
    return null;
  }

  // ¿cuál es la meta más cercana para mostrar como objetivo?
  function metaActual(){
    for(const m of (window.MUNDOS||[])){
      if(m.bloqueado) continue;
      const p=progresoMundo(m.id);
      if(!p.completo && p.total>0){
        const rec=RECOMPENSAS[m.id];
        return {mundoId:m.id, nombre:m.nombre, hechas:p.hechas, total:p.total,
                recompensa: rec?(rec.emoji+' '+rec.nombre):'una sorpresa'};
      }
    }
    return null;
  }

  return { RANGOS, RECOMPENSAS, rango, progresoMundo, revisarMundoCompleto, metaActual, desbloqueados, desbloquear };
})();
window.PROGRESO = PROGRESO;
