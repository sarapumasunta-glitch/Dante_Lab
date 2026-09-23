/* ============================================================
   DANTE LAB · T-Rex comelón v2 (Phaser) 🦖
   Piloto de "sensación de juego": personajes propios animados,
   movimiento fluido, partículas, vibración de cámara y estrellas.
   - Phaser se carga SOLO al abrir este juego (la app sigue liviana)
   - Si Phaser no carga, se usa la versión clásica automáticamente
   Reglas: come todos los huesos, atrapa raptores (estrellas extra),
   esquiva meteoritos (vuelves al inicio, sin perder), la carne congela.
   ============================================================ */
(function(){
  const MAPA=[
    "#############",
    "#.....#.....#",
    "#.##.###.##.#",
    "#o#.......#o#",
    "#.#.##.##.#.#",
    "#...#...#...#",
    "###.#.#.#.###",
    "#.....M.....#",
    "#.###.#.###.#",
    "#...#...#...#",
    "#.#.#.#.#.#.#",
    "#o..D...D..o#",
    "#.####.####.#",
    "#.....P.....#",
    "#############"];
  const H=MAPA.length, W=MAPA[0].length, C=48;   // celda lógica (el juego escala al ancho)
  const DIRS={ arriba:[-1,0], abajo:[1,0], izq:[0,-1], der:[0,1] };
  const libre=(r,c)=> r>=0 && r<H && c>=0 && c<W && MAPA[r][c]!=='#';
  const px=c=>c*C+C/2, py=r=>r*C+C/2;

  let juego=null, escena=null, activo='phaser', cargando=null, imagenes=null;

  // ---------- carga diferida ----------
  function cargarPhaser(){
    if(window.Phaser) return Promise.resolve();
    if(cargando) return cargando;
    cargando=new Promise((ok,mal)=>{
      const s=document.createElement('script'); s.src='./phaser.min.js';
      const t=setTimeout(()=>mal(new Error('tiempo')),10000);
      s.onload=()=>{ clearTimeout(t); ok(); }; s.onerror=()=>{ clearTimeout(t); cargando=null; mal(new Error('carga')); };
      document.head.appendChild(s);
    });
    return cargando;
  }
  function cargarSprites(){
    if(imagenes) return Promise.resolve(imagenes);
    const S=window.TREX_SPRITES||{}, out={};
    return Promise.all(Object.keys(S).map(k=>new Promise(ok=>{
      const i=new Image(); i.onload=()=>{ out[k]=i; ok(); }; i.onerror=()=>ok();
      i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(S[k]);
    }))).then(()=>imagenes=out);
  }

  // ---------- estrellas: mejor marca por juego ----------
  function guardarMejor(juego, est){
    try{ const m=JSON.parse(localStorage.getItem('danteLab_mejores')||'{}'); if(!m[juego] || est>m[juego]) m[juego]=est; localStorage.setItem('danteLab_mejores',JSON.stringify(m)); }catch(e){}
  }

  // ---------- HUD (DOM) ----------
  const $=id=>document.getElementById(id);
  function hud(g){ $('trexFood').textContent=g.total-g.comidos; $('trexRap').textContent=g.raptores; $('trexBar').style.width=(g.comidos/g.total*100)+'%'; }
  function nota(t){ $('trexHint').textContent=t; }

  // ---------- flujo al terminar ----------
  function salir(){
    if(window._desdeMundo){ window._desdeMundo=false; if(window.TELEMETRIA) TELEMETRIA.termino(); toast('🦖 ¡Eres el rey de los dinosaurios!'); abrirMundo('dinosaurios'); }
    else if(typeof abrirReto==='function') abrirReto();
  }

  /* ======================= ESCENA ======================= */
  function crearEscena(){
    return class Juego extends Phaser.Scene {
      constructor(){ super('trex'); }

      create(){
        escena=this;
        Object.keys(imagenes).forEach(k=>{ if(!this.textures.exists(k)) this.textures.addImage(k, imagenes[k]); });
        if(!this.anims.exists('caminar')){
          this.anims.create({ key:'caminar', frames:[{key:'trex0'},{key:'trex1'}], frameRate:9, repeat:-1 });
          this.anims.create({ key:'correr', frames:[{key:'raptor0'},{key:'raptor1'}], frameRate:10, repeat:-1 });
        }
        const calma = window.DIF ? DIF.tranquilo() : false;
        const lv = window.DIF ? DIF.nivel('trex') : 1;
        const g = this.g = { comida:{}, total:0, comidos:0, raptores:0, golpes:0, congelado:0, invul:0, fin:false,
          quiere:[0,0], dir:[0,0], t0:this.time.now,
          pasoJ: calma?230:170, pasoM: calma?430:Math.max(190, 300-lv*15), persigue: calma?0.1:Math.min(0.7,0.25+lv*0.06) };

        this.pintarMapa();
        const spM=[], spD=[];
        for(let r=0;r<H;r++) for(let c=0;c<W;c++){
          const ch=MAPA[r][c];
          if(ch==='.'||ch==='o'){
            const s=this.add.image(px(c),py(r), ch==='o'?'carne':'hueso').setDisplaySize(ch==='o'?C*.7:C*.4, ch==='o'?C*.7:C*.4);
            s.fase=(r*7+c*3)%10; s.base=s.scale; s.esCarne=ch==='o';
            g.comida[r+','+c]=s; g.total++;
          }
          if(ch==='P') g.inicio={r,c};
          if(ch==='M') spM.push({r,c});
          if(ch==='D') spD.push({r,c});
        }
        // T-Rex
        this.j={ r:g.inicio.r, c:g.inicio.c, mov:false,
          s:this.add.sprite(px(g.inicio.c),py(g.inicio.r),'trex0').setDisplaySize(C*1.15,C*1.15).setDepth(10) };
        // meteoritos
        const nMet = calma?1:(lv>=4?3:2);
        this.met=[];
        for(let i=0;i<nMet;i++){
          const c=Math.max(1,Math.min(W-2, spM[0].c+(i-1)));
          const s=this.add.image(px(c),py(spM[0].r),'meteoro').setDisplaySize(C*.95,C*.95).setDepth(8);
          const cola=this.add.particles(0,0,'chispa',{ speed:{min:5,max:25}, scale:{start:.28,end:0}, alpha:{start:.9,end:0},
            lifespan:320, frequency:45, tint:[0xffd23f,0xff8c1a,0xff4d2a], blendMode:'ADD' }).setDepth(7);
          cola.startFollow(s);
          const giro=this.tweens.add({ targets:s, angle:360, duration:2400, repeat:-1 });
          this.met.push({ r:spM[0].r, c, d:[0,i%2?1:-1], mov:false, s, cola, giro });
        }
        // raptores
        this.rap=spD.map(p=>({ r:p.r, c:p.c, casa:{...p}, d:[0,1], mov:false, fuera:0,
          s:this.add.sprite(px(p.c),py(p.r),'raptor0').setDisplaySize(C*.95,C*.95).setDepth(9).play('correr') }));

        // controles
        let x0=null,y0=null;
        this.input.on('pointerdown',p=>{ x0=p.x; y0=p.y; });
        this.input.on('pointermove',p=>{ if(x0===null||!p.isDown) return; const dx=p.x-x0, dy=p.y-y0;
          if(Math.max(Math.abs(dx),Math.abs(dy))<C*.35) return;
          this.quiere(Math.abs(dx)>Math.abs(dy)?(dx>0?'der':'izq'):(dy>0?'abajo':'arriba')); x0=p.x; y0=p.y; });
        this.input.on('pointerup',()=>{ x0=null; });
        this.input.keyboard && this.input.keyboard.on('keydown',e=>{
          const m={ArrowUp:'arriba',ArrowDown:'abajo',ArrowLeft:'izq',ArrowRight:'der'}[e.key]; if(m){ e.preventDefault&&e.preventDefault(); this.quiere(m); } });

        hud(g);
        nota('Desliza el dedo: come los huesos 🦴, atrapa raptores 🦎 y esquiva meteoritos');
        this.cartel('¡A comer!', '#ffd23f');
      }

      quiere(k){ if(this.g && !this.g.fin) this.g.quiere=DIRS[k].slice(); }

      pintarMapa(){
        const gr=this.add.graphics();
        gr.fillStyle(0x16240c,1).fillRect(0,0,W*C,H*C);
        // textura del suelo
        for(let i=0;i<140;i++){ gr.fillStyle(0x1e3210,1).fillCircle((i*97)%(W*C),(i*61)%(H*C),2+(i%3)); }
        // muros continuos (setos de la selva)
        for(let r=0;r<H;r++) for(let c=0;c<W;c++){
          if(MAPA[r][c]!=='#') continue;
          const x=c*C, y=r*C, m=5;
          gr.fillStyle(0x3a5a14,1).fillRoundedRect(x+m,y+m+3,C-2*m,C-2*m,12);
          if(c+1<W && MAPA[r][c+1]==='#') gr.fillRect(x+C/2,y+m+3,C,C-2*m);
          if(r+1<H && MAPA[r+1][c]==='#') gr.fillRect(x+m,y+C/2+3,C-2*m,C);
        }
        for(let r=0;r<H;r++) for(let c=0;c<W;c++){
          if(MAPA[r][c]!=='#') continue;
          const x=c*C, y=r*C, m=5;
          gr.fillStyle(0x5a8a22,1).fillRoundedRect(x+m,y+m,C-2*m,C-2*m,12);
          if(c+1<W && MAPA[r][c+1]==='#') gr.fillRect(x+C/2,y+m,C,C-2*m);
          if(r+1<H && MAPA[r+1][c]==='#') gr.fillRect(x+m,y+C/2,C-2*m,C);
          if((r*5+c*3)%7===0){ gr.fillStyle(0x8ec84a,1).fillCircle(x+C/2-6,y+C/2-4,5).fillCircle(x+C/2+4,y+C/2-8,4); }
        }
      }

      // ---------- movimiento fluido entre casillas ----------
      mover(e, d, dur, alLlegar){
        if((!d[0] && !d[1]) || !libre(e.r+d[0], e.c+d[1])) return false;
        e.r+=d[0]; e.c+=d[1]; e.mov=true;
        this.tweens.add({ targets:e.s, x:px(e.c), y:py(e.r), duration:dur, onComplete:()=>{ e.mov=false; alLlegar&&alLlegar(); } });
        return true;
      }
      elegir(e, huir, prob){
        let ops=Object.values(DIRS).filter(([a,b])=>libre(e.r+a,e.c+b));
        const nv=ops.filter(([a,b])=>!(a===-e.d[0]&&b===-e.d[1])); if(nv.length) ops=nv;
        if(Math.random()<prob){ const j=this.j;
          ops.sort((a,b)=>{ const da=Math.abs(e.r+a[0]-j.r)+Math.abs(e.c+a[1]-j.c), db=Math.abs(e.r+b[0]-j.r)+Math.abs(e.c+b[1]-j.c); return huir?db-da:da-db; });
          return ops[0]; }
        return ops[Math.floor(Math.random()*ops.length)];
      }

      update(t){
        const g=this.g; if(!g || g.fin) return;
        // huesos que "respiran"
        Object.values(g.comida).forEach(s=>s.setScale(s.base*(1+0.08*Math.sin(t/260+s.fase))));
        // jugador
        const j=this.j;
        if(!j.mov){
          if(libre(j.r+g.quiere[0], j.c+g.quiere[1])) g.dir=g.quiere.slice();
          if(this.mover(j, g.dir, g.pasoJ, ()=>this.comer())){
            if(g.dir[1]) j.s.setFlipX(g.dir[1]<0);
            j.s.setAngle(g.dir[0]*(j.s.flipX?10:-10));
            if(!j.s.anims.isPlaying) j.s.play('caminar');
          } else if(j.s.anims.isPlaying){ j.s.stop(); j.s.setTexture('trex0'); }
        }
        // meteoritos
        const frio = t < g.congelado;
        this.met.forEach(m=>{
          if(frio){ if(m.s.texture.key!=='hielo'){ m.s.setTexture('hielo'); m.cola.stop(); m.giro.pause(); m.s.setAngle(0); } return; }
          if(m.s.texture.key==='hielo'){ m.s.setTexture('meteoro'); m.cola.start(); m.giro.resume(); }
          if(!m.mov){ m.d=this.elegir(m,false,g.persigue); this.mover(m,m.d,g.pasoM); }
        });
        // raptores
        this.rap.forEach(r=>{
          if(r.fuera){ if(t>r.fuera){ r.fuera=0; r.r=r.casa.r; r.c=r.casa.c; r.s.setPosition(px(r.c),py(r.r)).setAlpha(0).setVisible(true).setScale(r.s.scale);
              this.tweens.add({ targets:r.s, alpha:1, duration:400 }); } return; }
          if(!r.mov){ r.d=this.elegir(r,true,0.7); if(this.mover(r,r.d,g.pasoJ*1.3)) r.s.setFlipX(r.d[1]<0 ? true : r.d[1]>0 ? false : r.s.flipX); }
        });
        this.choques(t);
      }

      comer(){
        const g=this.g, j=this.j, k=j.r+','+j.c, s=g.comida[k];
        if(!s) return;
        delete g.comida[k]; g.comidos++;
        this.chispas(s.x,s.y, s.esCarne?[0xff8c1a,0xffd23f]:[0xfff4dc,0xffffff], s.esCarne?16:5);
        this.tweens.add({ targets:s, scale:0, duration:120, onComplete:()=>s.destroy() });
        // mordida
        j.s.anims.pause(); j.s.setTexture(j.s.texture.key==='trex1'?'trex3':'trex2');
        this.time.delayedCall(90,()=>{ if(j.s.anims) j.s.anims.resume(); });
        if(s.esCarne){
          g.congelado=this.time.now+5000;
          this.cameras.main.flash(250,120,220,255);
          this.cartel('¡Congelados! ❄️','#9ae0ff');
          nota('🍖 ¡Carne! Los meteoritos se congelaron por 5 segundos');
          if(window.SFX) SFX.premio();
        } else if(window.SFX && g.comidos%3===0) SFX.tap();
        hud(g);
        if(g.comidos===g.total) this.ganar();
      }

      choques(t){
        const g=this.g, j=this.j, cerca=(a,b)=>Phaser.Math.Distance.Between(a.x,a.y,b.x,b.y)<C*.6;
        this.rap.forEach(r=>{
          if(r.fuera || !cerca(r.s,j.s)) return;
          r.fuera=t+5000; g.raptores++;
          this.chispas(r.s.x,r.s.y,[0xffd23f,0xffffff],18,'estrella');
          this.tweens.add({ targets:r.s, scale:0, angle:180, duration:250, onComplete:()=>{ r.s.setVisible(false).setAngle(0).setDisplaySize(C*.95,C*.95); } });
          this.flotar(r.s.x,r.s.y,'+⭐ ¡Ñam!');
          this.cameras.main.shake(90,0.004);
          if(window.S){ S.estrellas=(S.estrellas||0)+1; if(typeof guardarJuego==='function') guardarJuego(); }
          if(window.SFX) SFX.correcto();
          hud(g);
        });
        if(t<g.invul || t<g.congelado) return;
        if(this.met.some(m=>cerca(m.s,j.s))){
          g.golpes++; g.invul=t+1800;
          this.cameras.main.shake(260,0.012); this.cameras.main.flash(180,255,90,60);
          this.tweens.killTweensOf(j.s); j.mov=false;
          j.r=g.inicio.r; j.c=g.inicio.c; g.dir=[0,0]; g.quiere=[0,0];
          j.s.setPosition(px(j.c),py(j.r)).setAngle(0);
          this.tweens.add({ targets:j.s, alpha:.25, duration:120, yoyo:true, repeat:6, onComplete:()=>j.s.setAlpha(1) });
          if(window.SFX) SFX.animo();
          nota('☄️ ¡Uy, un meteorito! Vuelves al inicio. ¡Sigue!');
        }
      }

      // ---------- "jugo": partículas, textos y carteles ----------
      chispas(x,y,colores,n,tex){
        const e=this.add.particles(x,y,tex||'chispa',{ speed:{min:60,max:180}, scale:{start:tex?.45:.3,end:0}, lifespan:450,
          tint:colores, emitting:false, blendMode:tex?'NORMAL':'ADD' }).setDepth(20);
        e.explode(n); this.time.delayedCall(600,()=>e.destroy());
      }
      flotar(x,y,txt){
        const t=this.add.text(x,y,txt,{ fontFamily:'"Baloo 2", Nunito, sans-serif', fontSize:'26px', fontStyle:'bold', color:'#ffd23f', stroke:'#2d1a00', strokeThickness:5 }).setOrigin(.5).setDepth(30);
        this.tweens.add({ targets:t, y:y-60, alpha:0, duration:900, ease:'Cubic.easeOut', onComplete:()=>t.destroy() });
      }
      cartel(txt,color){
        const t=this.add.text(W*C/2,H*C/2,txt,{ fontFamily:'"Baloo 2", Nunito, sans-serif', fontSize:'64px', fontStyle:'bold', color, stroke:'#16240c', strokeThickness:10 }).setOrigin(.5).setDepth(40).setScale(.2);
        this.tweens.chain({ targets:t, tweens:[ { scale:1, duration:280, ease:'Back.easeOut' }, { alpha:0, delay:600, duration:300, onComplete:()=>t.destroy() } ] });
      }

      ganar(){
        const g=this.g; g.fin=true;
        this.j.s.stop(); this.j.s.setTexture('trex2').setAngle(0);
        this.met.forEach(m=>{ this.tweens.killTweensOf(m.s); m.cola.stop(); });
        this.rap.forEach(r=>this.tweens.killTweensOf(r.s));
        const est = g.golpes===0 ? 3 : g.golpes<=2 ? 2 : 1;
        guardarMejor('trex', est);
        if(window.TELEMETRIA && TELEMETRIA.estrellas) TELEMETRIA.estrellas('trex2', est);
        if(window.DIF) DIF.subir('trex');
        if(window.SFX) SFX.premio();
        this.tweens.add({ targets:this.j.s, y:this.j.s.y-24, duration:180, yoyo:true, repeat:3, ease:'Quad.easeOut' });
        // lluvia de estrellas
        const lluvia=this.add.particles(0,-20,'estrella',{ x:{min:0,max:W*C}, speedY:{min:160,max:320}, speedX:{min:-40,max:40}, rotate:{min:0,max:360},
          scale:{min:.3,max:.6}, lifespan:2600, quantity:2, frequency:60 }).setDepth(25);
        this.time.delayedCall(1400,()=>lluvia.stop());
        // tablero de estrellas
        const cx=W*C/2, cy=H*C/2, caja=this.add.container(cx,cy).setDepth(50).setScale(.3).setAlpha(0);
        const fondo=this.add.graphics(); fondo.fillStyle(0x2a2450,.96).fillRoundedRect(-230,-150,460,300,28).lineStyle(6,0xffd23f,1).strokeRoundedRect(-230,-150,460,300,28);
        const titulo=this.add.text(0,-95, est===3?'¡Perfecto!':'¡Ganaste!',{ fontFamily:'"Baloo 2", Nunito, sans-serif', fontSize:'52px', fontStyle:'bold', color:'#ffffff' }).setOrigin(.5);
        const sub=this.add.text(0,95, `Atrapaste ${g.raptores} raptor${g.raptores===1?'':'es'}`,{ fontFamily:'Nunito, sans-serif', fontSize:'26px', fontStyle:'bold', color:'#b8c4e0' }).setOrigin(.5);
        caja.add([fondo,titulo,sub]);
        for(let i=0;i<3;i++){
          const s=this.add.image(-110+i*110,5,'estrella').setDisplaySize(90,90).setAlpha(i<est?1:.18).setScale(0);
          caja.add(s);
          this.tweens.add({ targets:s, scale:(90/64), duration:320, delay:500+i*260, ease:'Back.easeOut',
            onStart:()=>{ if(i<est && window.SFX) SFX.correcto(); } });
        }
        this.tweens.add({ targets:caja, scale:1, alpha:1, duration:350, delay:250, ease:'Back.easeOut' });
        nota(est===3?'🌟 ¡Tres estrellas! Sin chocar con ningún meteorito':'🎉 ¡Muy bien! Juega otra vez para ganar más estrellas');
        this.time.delayedCall(3300, salir);
      }
    };
  }

  /* ======================= ENTRADA ======================= */
  window.abrirTrex = async function(){
    // ficha de dinosaurio para el reto final (al azar si viene del Arcade)
    const D=(window.MUNDOS||[]).find(m=>m.id==='dinosaurios');
    if(D && (window._desdeArcade || !window.discActual || window.discActual.mundo.id!=='dinosaurios')){
      const pend=D.descubrimientos.filter(d=>!(window.S&&S.coleccion[d.id])), pool=pend.length?pend:D.descubrimientos;
      window.discActual={mundo:D, d:pool[Math.floor(Math.random()*pool.length)]}; try{ discActual=window.discActual; }catch(e){}
    }
    $('trexBack').onclick=()=>{ detener(); if(window._desdeMundo){ window._desdeMundo=false; abrirMundo('dinosaurios'); } else show('v-disc'); };
    show('v-trex');
    try{
      nota('Cargando la selva… 🌿');
      await Promise.all([cargarPhaser(), cargarSprites()]);
      activo='phaser';
      $('trexCanvas').style.display='none'; $('trexPhaser').style.display='block';
      if(!juego){
        juego=new Phaser.Game({ type:Phaser.AUTO, parent:'trexPhaser', width:W*C, height:H*C, backgroundColor:'#16240c', banner:false,
          scale:{ mode:Phaser.Scale.FIT, autoCenter:Phaser.Scale.CENTER_HORIZONTALLY }, audio:{ noAudio:true },
          render:{ antialias:true, roundPixels:false }, scene:[crearEscena()] });
      } else {
        juego.loop.wake(); juego.scene.getScene('trex').scene.restart();
      }
    }catch(e){
      // respaldo: versión clásica
      activo='clasico';
      $('trexPhaser').style.display='none'; $('trexCanvas').style.display='';
      if(typeof abrirTrexClasico==='function') abrirTrexClasico();
    }
  };
  function detener(){ if(juego){ try{ juego.loop.sleep(); }catch(e){} } }
  window.detenerTrex=detener;

  // cruceta en pantalla: reparte a la versión activa
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('#trexPad [data-d]').forEach(b=>b.addEventListener('pointerdown',e=>{
      e.preventDefault();
      if(activo==='phaser' && escena) escena.quiere(b.dataset.d);
      else if(window._trexClasicoPad) window._trexClasicoPad(b.dataset.d);
    }));
  });
})();
