/* ============================================================
   DANTE LAB · datos del juego
   Cada descubrimiento tiene:
   - id, emoji, nombre
   - dato: hecho corto y "wow" en lenguaje de niño
   - wiki: nombre de archivo en Wikimedia Commons (foto real, dominio público / CC)
   - bg: colores para la ilustración de respaldo (si no hay internet)
   - reto: pregunta con opciones (mini-juego)
   ============================================================ */

const MUNDOS = [
  {
    id: 'oceano', nombre: 'Océano', emoji: '🌊', color: '#2a8fd0',
    intro: 'Bajamos al fondo del mar, donde viven criaturas que casi nadie ha visto.',
    descubrimientos: [
      {
        id: 'oc1', emoji: '🎣', nombre: 'Pez que pesca con una lámpara',
        wiki: 'Humpback_anglerfish.png',
        dato: 'Vive tan profundo que no llega la luz del Sol. Por eso tiene una lucecita en la cabeza para atraer a su cena. ¡Es como pescar con una linterna!',
        bg: ['#0a2540','#123a5c'], icono:'🎣',
        reto: { p:'¿Para qué usa su lucecita el pez pescador?', o:['Para leer de noche','Para atraer a su comida','Para calentarse'], correcta:1 }
      },
      {
        id: 'oc2', emoji: '🐙', nombre: 'Pulpo súper inteligente',
        wiki: 'Octopus_vulgaris_2.jpg',
        dato: 'El pulpo tiene 8 brazos, 3 corazones y sangre azul. ¡Y puede cambiar de color para esconderse en un segundo!',
        bg: ['#3a1a5c','#5a2a8a'], icono:'🐙',
        reto: { p:'¿Cuántos corazones tiene un pulpo?', o:['1','3','8'], correcta:1 }
      },
      {
        id: 'oc3', emoji: '🐋', nombre: 'La ballena más grande del mundo',
        wiki: 'Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg',
        dato: 'La ballena azul es el animal más grande que ha existido, ¡más que un dinosaurio! Su corazón es del tamaño de un carro pequeño.',
        bg: ['#0d3a6a','#1a5a9a'], icono:'🐋',
        reto: { p:'¿Qué tan grande es el corazón de una ballena azul?', o:['Como una pelota','Como un carro','Como una moneda'], correcta:1 }
      },
      {
        id: 'oc4', emoji: '🐢', nombre: 'Tortuga viajera',
        wiki: 'Sea_turtle_(Green_turtle).jpg',
        dato: 'Las tortugas marinas pueden nadar miles de kilómetros y siempre vuelven a la misma playa donde nacieron. ¡Tienen un GPS natural!',
        bg: ['#0a4a4a','#1a7a6a'], icono:'🐢',
        reto: { p:'¿A dónde vuelven las tortugas a poner sus huevos?', o:['A cualquier playa','A la playa donde nacieron','Al río'], correcta:1 }
      },
      {
        id: 'oc5', emoji: '🦈', nombre: 'El tiburón, el rey del mar',
        wiki: 'White_shark.jpg',
        dato: 'Los tiburones existen desde antes que los dinosaurios, ¡hace más de 400 millones de años! Pueden oler una gota de sangre a gran distancia.',
        bg: ['#1a3a5c','#2a5a7c'], icono:'🦈',
        reto: { p:'¿Los tiburones son más antiguos o más nuevos que los dinosaurios?', o:['Más antiguos','Más nuevos','Igual'], correcta:0 }
      },
      {
        id: 'oc6', emoji: '🪼', nombre: 'Medusa que brilla',
        wiki: 'Sea_nettles_in_the_Monterey_Bay_Aquarium.jpg',
        dato: 'Algunas medusas brillan en la oscuridad con luz propia. No tienen cerebro, ni corazón, ni huesos, ¡pero llevan millones de años en el mar!',
        bg: ['#2a1a5c','#4a2a7c'], icono:'🪼',
        reto: { p:'¿Qué NO tiene una medusa?', o:['Cerebro','Tentáculos','Color'], correcta:0 }
      },
      {
        id: 'oc7', emoji: '🦭', nombre: 'La foca juguetona',
        wiki: 'Common_seal_(Phoca_vitulina).jpg',
        dato: '¡Las focas pueden dormir bajo el agua y aguantar la respiración por más de 20 minutos! Y les encanta jugar y hacer piruetas.',
        bg: ['#2a5a7a','#0d3a5a'], icono:'🦭',
        reto: { p:'¿Cuánto puede aguantar la respiración una foca?', o:['20 minutos','2 segundos','un día'], correcta:0 }
      },
      {
        id: 'oc8', emoji: '🐡', nombre: 'El pez globo',
        wiki: 'Pufferfish.jpg',
        dato: '¡Cuando tiene miedo se infla como un globo con pinchos para que nadie se lo coma! Es uno de los peces más curiosos del mar.',
        bg: ['#3a6a5a','#1a4a3a'], icono:'🐡',
        reto: { p:'¿Qué hace el pez globo cuando tiene miedo?', o:['Se infla','Se duerme','Vuela'], correcta:0 }
      }
    ]
  },
  {
    id: 'animales', nombre: 'Animales', emoji: '🦁', color: '#3aa85a',
    intro: 'Conoce animales tan increíbles que parecen inventados.',
    descubrimientos: [
      {
        id: 'an1', emoji: '🦎', nombre: 'El ajolote que nunca crece',
        wiki: 'AxolotlBE.jpg',
        dato: 'El ajolote vive en México y se queda "bebé" toda su vida. ¡Y si pierde una patita, le crece una nueva! Es como un superhéroe.',
        bg: ['#3a1a4a','#6a2a6a'], icono:'🦎',
        reto: { p:'¿Qué puede hacer el ajolote si pierde una patita?', o:['Nada','Le crece otra','Se esconde'], correcta:1 }
      },
      {
        id: 'an2', emoji: '🦒', nombre: 'La jirafa de cuello larguísimo',
        wiki: 'Giraffe_Mikumi_National_Park.jpg',
        dato: 'La jirafa es el animal más alto del mundo. ¡Su lengua mide casi medio metro y es azul para no quemarse con el sol!',
        bg: ['#5a4a1a','#8a6a2a'], icono:'🦒',
        reto: { p:'¿De qué color es la lengua de la jirafa?', o:['Roja','Azul','Verde'], correcta:1 }
      },
      {
        id: 'an3', emoji: '🐧', nombre: 'El pingüino que no vuela',
        wiki: 'Manchot_01.jpg',
        dato: 'Los pingüinos tienen alas pero no vuelan: ¡las usan para nadar súper rápido! Y se resbalan sobre el hielo con la panza para ir más veloz.',
        bg: ['#1a3a5c','#3a6a9a'], icono:'🐧',
        reto: { p:'¿Para qué usan las alas los pingüinos?', o:['Para volar','Para nadar','Para saludar'], correcta:1 }
      },
      {
        id: 'an4', emoji: '🐼', nombre: 'El oso panda comelón',
        wiki: 'Grosser_Panda.JPG',
        dato: 'El panda come bambú casi todo el día: ¡hasta 12 horas! Cuando nace es tan chiquito como una barra de mantequilla.',
        bg: ['#2a3a2a','#4a5a4a'], icono:'🐼',
        reto: { p:'¿Cuántas horas come bambú un panda al día?', o:['1 hora','12 horas','Ninguna'], correcta:1 }
      },
      {
        id: 'an5', emoji: '🦥', nombre: 'El perezoso más lento',
        wiki: 'Bradypus.jpg',
        dato: 'El perezoso es tan lento que le crecen algas verdes en el pelo. Duerme casi todo el día y baja de su árbol solo una vez a la semana.',
        bg: ['#3a4a1a','#5a6a2a'], icono:'🦥',
        reto: { p:'¿Qué le crece al perezoso en el pelo?', o:['Flores','Algas verdes','Nieve'], correcta:1 }
      },
      {
        id: 'an6', emoji: '🦩', nombre: 'El flamenco rosado',
        wiki: 'Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg',
        dato: 'Los flamencos nacen grises y se vuelven rosados por lo que comen. ¡Y pueden dormir parados en una sola pata!',
        bg: ['#5a2a4a','#8a3a6a'], icono:'🦩',
        reto: { p:'¿Por qué los flamencos son rosados?', o:['Nacen así','Por lo que comen','Se pintan'], correcta:1 }
      },
      {
        id: 'an7', emoji: '🦘', nombre: 'El canguro saltarín',
        wiki: 'Kangaroo_and_joey03.jpg',
        dato: '¡Los canguros bebés viven en la bolsa de su mamá! Y un canguro adulto puede saltar tan lejos como un carro de largo.',
        bg: ['#7a5a2a','#5a3a1a'], icono:'🦘',
        reto: { p:'¿Dónde viven los canguros bebés?', o:['En la bolsa de mamá','En un nido','Bajo el agua'], correcta:0 }
      },
      {
        id: 'an8', emoji: '🦇', nombre: 'El murciélago', 
        wiki: 'Big-eared-townsend-fledermaus.jpg',
        dato: '¡Es el único mamífero que vuela de verdad! Y "ve" en la oscuridad usando el sonido, como un superpoder.',
        bg: ['#2a2a4a','#1a1a3a'], icono:'🦇',
        reto: { p:'¿Cómo se guía el murciélago en la oscuridad?', o:['Con el sonido','Con una linterna','Con GPS'], correcta:0 }
      }
    ]
  },
  {
    id: 'espacio', nombre: 'Espacio', emoji: '🌙', color: '#7a4ac8',
    intro: 'Despegamos hacia el espacio, la Luna, los planetas y las estrellas.',
    descubrimientos: [
      {
        id: 'es1', emoji: '🌙', nombre: 'La Luna, nuestra vecina',
        wiki: 'FullMoon2010.jpg',
        dato: 'La Luna no tiene luz propia: brilla porque le rebota la luz del Sol, ¡como un espejo gigante! En ella hay huellas de astronautas que nunca se borran.',
        bg: ['#1a1a3a','#3a3a5a'], icono:'🌙',
        reto: { p:'¿Por qué brilla la Luna?', o:['Tiene fuego','Refleja la luz del Sol','Tiene luces'], correcta:1 }
      },
      {
        id: 'es2', emoji: '🪐', nombre: 'Saturno y sus anillos',
        wiki: 'Saturn_during_Equinox.jpg',
        dato: 'Saturno tiene anillos gigantes hechos de hielo y roca. ¡Es tan liviano que flotaría en una piscina enorme si existiera una!',
        bg: ['#3a2a1a','#6a4a2a'], icono:'🪐',
        reto: { p:'¿De qué están hechos los anillos de Saturno?', o:['De oro','De hielo y roca','De nubes'], correcta:1 }
      },
      {
        id: 'es3', emoji: '☀️', nombre: 'El Sol, una estrella gigante',
        wiki: 'The_Sun_in_white_light.jpg',
        dato: 'El Sol es una estrella tan grande que cabrían un millón de Tierras dentro. Su luz tarda 8 minutos en llegar hasta nosotros.',
        bg: ['#5a3a0a','#8a5a1a'], icono:'☀️',
        reto: { p:'¿Cuánto tarda la luz del Sol en llegar a la Tierra?', o:['1 segundo','8 minutos','1 día'], correcta:1 }
      },
      {
        id: 'es4', emoji: '🔴', nombre: 'Marte, el planeta rojo',
        wiki: 'OSIRIS_Mars_true_color.jpg',
        dato: 'Marte es rojo porque su tierra tiene óxido, ¡como un metal oxidado! Hay robots exploradores paseando por él ahora mismo.',
        bg: ['#5a1a1a','#8a2a2a'], icono:'🔴',
        reto: { p:'¿Por qué Marte es rojo?', o:['Por el fuego','Su tierra tiene óxido','Está pintado'], correcta:1 }
      },
      {
        id: 'es5', emoji: '⭐', nombre: 'Las estrellas y constelaciones',
        wiki: 'Milky_Way_Night_Sky_Black_Rock_Desert_Nevada.jpg',
        dato: 'Las constelaciones son dibujos que la gente imaginó uniendo estrellas, como conectar puntos. ¡Algunas estrellas que ves ya se apagaron hace mucho!',
        bg: ['#0a0a2a','#1a1a4a'], icono:'⭐',
        reto: { p:'¿Qué son las constelaciones?', o:['Planetas','Dibujos con estrellas','Nubes'], correcta:1 }
      },
      {
        id: 'es6', emoji: '☄️', nombre: 'Los cometas viajeros',
        wiki: 'Comet_P1_McNaught02_-_23-01-07.jpg',
        dato: 'Un cometa es una bola de hielo y polvo con una cola brillante. ¡Algunos tardan miles de años en dar una vuelta y volver a pasar cerca!',
        bg: ['#1a2a4a','#2a4a6a'], icono:'☄️',
        reto: { p:'¿De qué está hecho un cometa?', o:['Fuego','Hielo y polvo','Metal'], correcta:1 }
      }
    ]
  },
  {
    id: 'lugares', nombre: 'Lugares', emoji: '🏛️', color: '#e0762a', bloqueadoHasta: 6,
    intro: 'Viaja a lugares tan increíbles que parecen de un cuento.',
    descubrimientos: [
      {
        id: 'lu1', emoji: '🗼', nombre: 'La Torre Eiffel',
        wiki: 'Tour_Eiffel_Wikimedia_Commons.jpg',
        dato: 'Está en París, Francia, y mide como un edificio de 100 pisos. ¡En verano crece un poquito porque el metal se estira con el calor!',
        bg: ['#3a3a4a','#5a5a6a'], icono:'🗼',
        reto: { p:'¿Qué le pasa a la Torre Eiffel en verano?', o:['Se encoge','Crece un poco','Se cae'], correcta:1 }
      },
      {
        id: 'lu2', emoji: '🏛️', nombre: 'El Coliseo de Roma',
        wiki: 'Colosseo_2020.jpg',
        dato: 'Tiene casi 2000 años y ahí luchaban los gladiadores. ¡Cabían 50.000 personas viendo el espectáculo, como un estadio de fútbol!',
        bg: ['#4a3a1a','#6a5a2a'], icono:'🏛️',
        reto: { p:'¿Cuántos años tiene el Coliseo?', o:['100 años','Casi 2000 años','10 años'], correcta:1 }
      },
      {
        id: 'lu3', emoji: '🗿', nombre: 'Las pirámides de Egipto',
        wiki: 'Kheops-Pyramid.jpg',
        dato: 'Las construyeron hace más de 4500 años sin máquinas, ¡moviendo piedras gigantes a mano! Son tan grandes que se ven desde el espacio.',
        bg: ['#5a4a1a','#8a6a2a'], icono:'🔺',
        reto: { p:'¿Cómo movían las piedras de las pirámides?', o:['Con grúas','A mano','Con imanes'], correcta:1 }
      },
      {
        id: 'lu4', emoji: '🏔️', nombre: 'Machu Picchu',
        wiki: 'Machu_Picchu,_Peru.jpg',
        dato: '¡Es una ciudad de piedra construida por los incas en lo alto de una montaña, en Perú! Estuvo escondida entre las nubes por cientos de años.',
        bg: ['#2a5a3a','#4a7a5a'], icono:'🏔️',
        reto: { p:'¿Dónde está Machu Picchu?', o:['En el mar','En lo alto de una montaña','Bajo tierra'], correcta:1 }
      },
      {
        id: 'lu5', emoji: '🐉', nombre: 'La Gran Muralla China',
        wiki: 'The_Great_Wall_of_China_at_Jinshanling-edit.jpg',
        dato: '¡Es tan larga que si caminaras sin parar tardarías más de un año en recorrerla! La construyeron para proteger a la gente hace muchísimo tiempo.',
        bg: ['#5a4a3a','#7a6a4a'], icono:'🧱',
        reto: { p:'¿Para qué construyeron la Gran Muralla?', o:['Para proteger a la gente','Para jugar','Para dormir'], correcta:0 }
      },
      {
        id: 'lu6', emoji: '🗽', nombre: 'La Estatua de la Libertad',
        wiki: 'Statue_of_Liberty_7.jpg',
        dato: '¡Fue un regalo de Francia a Estados Unidos! Es tan alta como un edificio de 30 pisos y su corona tiene 7 picos, uno por cada mar y continente.',
        bg: ['#2a6a5a','#4a8a7a'], icono:'🗽',
        reto: { p:'¿Cuántos picos tiene su corona?', o:['3','7','20'], correcta:1 }
      }
    ]
  }
];

/* ---------- Temas de los juegos según el mundo elegido ----------
   Cada mundo define: vehículo/piloto de carreras, obstáculos a esquivar,
   blancos del juego de puntería, y rondas de "Párame la mano". */
const TEMAS = {
  oceano: {
    color:'#2a9fe0', color2:'#1a6fb0',
    carrera:{ piloto:'🐠', bueno:['🫧','💫','⭐'], malo:['🪸','🦑','🐡'], pista:['#0d3a66','#1a6fb0'], meta:'🏁' },
    laser:{ blancos:['🫧','🐠','⭐','🐚'], evitar:'🦑', fondo:['#0d3a66','#2a7ab0'] },
    parame:{ titulo:'cosas del mar', rondas:[
      { letra:'B', p:'¿Cuál empieza con B?', o:['🐋 Ballena','🐙 Pulpo','🦀 Cangrejo'], ok:0 },
      { letra:'T', p:'¿Cuál empieza con T?', o:['🐠 Pez','🐢 Tortuga','🦈 Tiburón'], ok:1 },
      { letra:'P', p:'¿Cuál empieza con P?', o:['🐙 Pulpo','🐳 Ballena','⭐ Estrella'], ok:0 },
      { letra:'D', p:'¿Cuál empieza con D?', o:['🐬 Delfín','🦈 Tiburón','🐡 Globo'], ok:0 },
      { letra:'M', p:'¿Cuál empieza con M?', o:['🐢 Tortuga','🪼 Medusa','🦀 Cangrejo'], ok:1 }
    ]}
  },
  animales: {
    color:'#3ac06a', color2:'#2a9050',
    carrera:{ piloto:'🐆', bueno:['🍃','⭐','🌸'], malo:['🌵','🪨','🌳'], pista:['#1a5a2a','#2a9050'], meta:'🏁' },
    laser:{ blancos:['🦋','🐞','🌸','🍃'], evitar:'🐝', fondo:['#1a5a2a','#3aa85a'] },
    parame:{ titulo:'animales', rondas:[
      { letra:'L', p:'¿Cuál empieza con L?', o:['🦁 León','🐯 Tigre','🐘 Elefante'], ok:0 },
      { letra:'P', p:'¿Cuál empieza con P?', o:['🐼 Panda','🦊 Zorro','🦥 Perezoso'], ok:0 },
      { letra:'T', p:'¿Cuál empieza con T?', o:['🐯 Tigre','🦁 León','🐵 Mono'], ok:0 },
      { letra:'C', p:'¿Cuál empieza con C?', o:['🦎 Camaleón','🐧 Pingüino','🦜 Tucán'], ok:0 },
      { letra:'M', p:'¿Cuál empieza con M?', o:['🐵 Mono','🐘 Elefante','🦒 Jirafa'], ok:0 }
    ]}
  },
  espacio: {
    color:'#8a5ce0', color2:'#6a3ac0',
    carrera:{ piloto:'🚀', bueno:['⭐','✨','💫'], malo:['☄️','🪨','🛰️'], pista:['#1a0a4a','#4a2a8a'], meta:'🏁' },
    laser:{ blancos:['⭐','🌟','✨','🪐'], evitar:'☄️', fondo:['#1a0a4a','#4a2a8a'] },
    parame:{ titulo:'el espacio', rondas:[
      { letra:'L', p:'¿Cuál empieza con L?', o:['🌙 Luna','☀️ Sol','⭐ Estrella'], ok:0 },
      { letra:'S', p:'¿Cuál empieza con S?', o:['☀️ Sol','🪐 Saturno','🌙 Luna'], ok:0 },
      { letra:'M', p:'¿Cuál empieza con M?', o:['🔴 Marte','🌙 Luna','⭐ Estrella'], ok:0 },
      { letra:'C', p:'¿Cuál empieza con C?', o:['☄️ Cometa','🪐 Saturno','🌟 Estrella'], ok:0 },
      { letra:'G', p:'¿Cuál empieza con G?', o:['🌌 Galaxia','🌙 Luna','☀️ Sol'], ok:0 }
    ]}
  },
  lugares: {
    color:'#ff9d2a', color2:'#e0762a',
    carrera:{ piloto:'🏎️', bueno:['⭐','🚩','💨'], malo:['🚧','🪨','🛑'], pista:['#5a4a2a','#8a6a3a'], meta:'🏁' },
    laser:{ blancos:['⭐','🎫','💎','🧭'], evitar:'🚧', fondo:['#5a4a2a','#8a6a3a'] },
    parame:{ titulo:'lugares del mundo', rondas:[
      { letra:'T', p:'¿Cuál empieza con T?', o:['🗼 Torre Eiffel','🗿 Pirámide','🗽 Estatua'], ok:0 },
      { letra:'P', p:'¿Cuál empieza con P?', o:['🔺 Pirámide','🗼 Torre','🐉 Muralla'], ok:0 },
      { letra:'M', p:'¿Cuál empieza con M?', o:['🏔️ Machu Picchu','🗼 Torre','🗽 Estatua'], ok:0 },
      { letra:'E', p:'¿Cuál empieza con E?', o:['🗽 Estatua','🔺 Pirámide','🏔️ Montaña'], ok:0 },
      { letra:'G', p:'¿Cuál empieza con G?', o:['🐉 Gran Muralla','🗼 Torre','🗿 Pirámide'], ok:0 }
    ]}
  }
};
window.TEMAS = TEMAS; window.MUNDOS = MUNDOS;
