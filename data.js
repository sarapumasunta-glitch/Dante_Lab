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
        palabras: ['PEZ', 'LUZ', 'LÁMPARA', 'PROFUNDO', 'CENA'],
        wiki: 'Humpback_anglerfish.png',
        dato: 'Vive tan profundo que no llega la luz del Sol. Por eso tiene una lucecita en la cabeza para atraer a su cena. ¡Es como pescar con una linterna!',
        bg: ['#0a2540','#123a5c'], icono:'🎣',
        reto: { p:'¿Para qué usa su lucecita el pez pescador?', o:['Para leer de noche','Para atraer a su comida','Para calentarse'], correcta:1 }
      },
      {
        id: 'oc2', emoji: '🐙', nombre: 'Pulpo súper inteligente',
        palabras: ['PULPO', 'BRAZOS', 'CORAZÓN', 'AZUL', 'COLOR'],
        wiki: 'Octopus_vulgaris_2.jpg',
        dato: 'El pulpo tiene 8 brazos, 3 corazones y sangre azul. ¡Y puede cambiar de color para esconderse en un segundo!',
        bg: ['#3a1a5c','#5a2a8a'], icono:'🐙',
        reto: { p:'¿Cuántos corazones tiene un pulpo?', o:['1','3','8'], correcta:1 }
      },
      {
        id: 'oc3', emoji: '🐋', nombre: 'La ballena más grande del mundo',
        palabras: ['BALLENA', 'AZUL', 'CORAZÓN', 'GIGANTE', 'MAR'],
        wiki: 'Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg',
        dato: 'La ballena azul es el animal más grande que ha existido, ¡más que un dinosaurio! Su corazón es del tamaño de un carro pequeño.',
        bg: ['#0d3a6a','#1a5a9a'], icono:'🐋',
        reto: { p:'¿Qué tan grande es el corazón de una ballena azul?', o:['Como una pelota','Como un carro','Como una moneda'], correcta:1 }
      },
      {
        id: 'oc4', emoji: '🐢', nombre: 'Tortuga viajera',
        palabras: ['TORTUGA', 'PLAYA', 'NADAR', 'VIAJE'],
        wiki: 'Sea_turtle_(Green_turtle).jpg',
        dato: 'Las tortugas marinas pueden nadar miles de kilómetros y siempre vuelven a la misma playa donde nacieron. ¡Tienen un GPS natural!',
        bg: ['#0a4a4a','#1a7a6a'], icono:'🐢',
        reto: { p:'¿A dónde vuelven las tortugas a poner sus huevos?', o:['A cualquier playa','A la playa donde nacieron','Al río'], correcta:1 }
      },
      {
        id: 'oc5', emoji: '🦈', nombre: 'El tiburón, el rey del mar',
        palabras: ['TIBURÓN', 'OCÉANO', 'ALETA', 'REY'],
        wiki: 'White_shark.jpg',
        dato: 'Los tiburones existen desde antes que los dinosaurios, ¡hace más de 400 millones de años! Pueden oler una gota de sangre a gran distancia.',
        bg: ['#1a3a5c','#2a5a7c'], icono:'🦈',
        reto: { p:'¿Los tiburones son más antiguos o más nuevos que los dinosaurios?', o:['Más antiguos','Más nuevos','Igual'], correcta:0 }
      },
      {
        id: 'oc6', emoji: '🪼', nombre: 'Medusa que brilla',
        palabras: ['MEDUSA', 'BRILLO', 'LUZ', 'AGUA'],
        wiki: 'Sea_nettles_in_the_Monterey_Bay_Aquarium.jpg',
        dato: 'Algunas medusas brillan en la oscuridad con luz propia. No tienen cerebro, ni corazón, ni huesos, ¡pero llevan millones de años en el mar!',
        bg: ['#2a1a5c','#4a2a7c'], icono:'🪼',
        reto: { p:'¿Qué NO tiene una medusa?', o:['Cerebro','Tentáculos','Color'], correcta:0 }
      },
      {
        id: 'oc7', emoji: '🦭', nombre: 'La foca juguetona',
        palabras: ['FOCA', 'DORMIR', 'AGUA', 'NADAR'],
        wiki: 'Common_seal_(Phoca_vitulina).jpg',
        dato: '¡Las focas pueden dormir bajo el agua y aguantar la respiración por más de 20 minutos! Y les encanta jugar y hacer piruetas.',
        bg: ['#2a5a7a','#0d3a5a'], icono:'🦭',
        reto: { p:'¿Cuánto puede aguantar la respiración una foca?', o:['20 minutos','2 segundos','un día'], correcta:0 }
      },
      {
        id: 'oc8', emoji: '🐡', nombre: 'El pez globo',
        palabras: ['GLOBO', 'PINCHOS', 'MIEDO', 'PEZ'],
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
        palabras: ['AJOLOTE', 'MÉXICO', 'BEBÉ', 'AGUA'],
        wiki: 'AxolotlBE.jpg',
        dato: 'El ajolote vive en México y se queda "bebé" toda su vida. ¡Y si pierde una patita, le crece una nueva! Es como un superhéroe.',
        bg: ['#3a1a4a','#6a2a6a'], icono:'🦎',
        reto: { p:'¿Qué puede hacer el ajolote si pierde una patita?', o:['Nada','Le crece otra','Se esconde'], correcta:1 }
      },
      {
        id: 'an2', emoji: '🦒', nombre: 'La jirafa de cuello larguísimo',
        palabras: ['JIRAFA', 'CUELLO', 'LENGUA', 'ALTA'],
        wiki: 'Giraffe_Mikumi_National_Park.jpg',
        dato: 'La jirafa es el animal más alto del mundo. ¡Su lengua mide casi medio metro y es azul para no quemarse con el sol!',
        bg: ['#5a4a1a','#8a6a2a'], icono:'🦒',
        reto: { p:'¿De qué color es la lengua de la jirafa?', o:['Roja','Azul','Verde'], correcta:1 }
      },
      {
        id: 'an3', emoji: '🐧', nombre: 'El pingüino que no vuela',
        palabras: ['PINGÜINO', 'ALAS', 'NADAR', 'HIELO'],
        wiki: 'Manchot_01.jpg',
        dato: 'Los pingüinos tienen alas pero no vuelan: ¡las usan para nadar súper rápido! Y se resbalan sobre el hielo con la panza para ir más veloz.',
        bg: ['#1a3a5c','#3a6a9a'], icono:'🐧',
        reto: { p:'¿Para qué usan las alas los pingüinos?', o:['Para volar','Para nadar','Para saludar'], correcta:1 }
      },
      {
        id: 'an4', emoji: '🐼', nombre: 'El oso panda comelón',
        palabras: ['PANDA', 'BAMBÚ', 'OSO', 'COMER'],
        wiki: 'Grosser_Panda.JPG',
        dato: 'El panda come bambú casi todo el día: ¡hasta 12 horas! Cuando nace es tan chiquito como una barra de mantequilla.',
        bg: ['#2a3a2a','#4a5a4a'], icono:'🐼',
        reto: { p:'¿Cuántas horas come bambú un panda al día?', o:['1 hora','12 horas','Ninguna'], correcta:1 }
      },
      {
        id: 'an5', emoji: '🦥', nombre: 'El perezoso más lento',
        palabras: ['PEREZOSO', 'LENTO', 'ALGAS', 'DORMIR'],
        wiki: 'Bradypus.jpg',
        dato: 'El perezoso es tan lento que le crecen algas verdes en el pelo. Duerme casi todo el día y baja de su árbol solo una vez a la semana.',
        bg: ['#3a4a1a','#5a6a2a'], icono:'🦥',
        reto: { p:'¿Qué le crece al perezoso en el pelo?', o:['Flores','Algas verdes','Nieve'], correcta:1 }
      },
      {
        id: 'an6', emoji: '🦩', nombre: 'El flamenco rosado',
        palabras: ['FLAMENCO', 'ROSADO', 'GRIS', 'PATA'],
        wiki: 'Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg',
        dato: 'Los flamencos nacen grises y se vuelven rosados por lo que comen. ¡Y pueden dormir parados en una sola pata!',
        bg: ['#5a2a4a','#8a3a6a'], icono:'🦩',
        reto: { p:'¿Por qué los flamencos son rosados?', o:['Nacen así','Por lo que comen','Se pintan'], correcta:1 }
      },
      {
        id: 'an7', emoji: '🦘', nombre: 'El canguro saltarín',
        palabras: ['CANGURO', 'BOLSA', 'SALTAR', 'MAMÁ'],
        wiki: 'Kangaroo_and_joey03.jpg',
        dato: '¡Los canguros bebés viven en la bolsa de su mamá! Y un canguro adulto puede saltar tan lejos como un carro de largo.',
        bg: ['#7a5a2a','#5a3a1a'], icono:'🦘',
        reto: { p:'¿Dónde viven los canguros bebés?', o:['En la bolsa de mamá','En un nido','Bajo el agua'], correcta:0 }
      },
      {
        id: 'an8', emoji: '🦇', nombre: 'El murciélago', 
        palabras: ['MURCIÉLAGO', 'VOLAR', 'SONIDO', 'NOCHE'],
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
        id: 'es1', wikiArticulo: 'Moon', emoji: '🌙', nombre: 'La Luna, nuestra vecina',
        palabras: ['LUNA', 'SOL', 'ESPEJO', 'LUZ'],
        wiki: 'FullMoon2010.jpg',
        dato: 'La Luna no tiene luz propia: brilla porque le rebota la luz del Sol, ¡como un espejo gigante! En ella hay huellas de astronautas que nunca se borran.',
        bg: ['#1a1a3a','#3a3a5a'], icono:'🌙',
        reto: { p:'¿Por qué brilla la Luna?', o:['Tiene fuego','Refleja la luz del Sol','Tiene luces'], correcta:1 }
      },
      {
        id: 'es2', wikiArticulo: 'Saturn', orden: 6, corto: 'Saturno', emoji: '🪐', nombre: 'Saturno y sus anillos',
        palabras: ['SATURNO', 'ANILLOS', 'HIELO', 'ROCA'],
        wiki: 'Saturn_during_Equinox.jpg',
        dato: 'Saturno tiene anillos gigantes hechos de hielo y roca. ¡Es tan liviano que flotaría en una piscina enorme si existiera una!',
        bg: ['#3a2a1a','#6a4a2a'], icono:'🪐',
        reto: { p:'¿De qué están hechos los anillos de Saturno?', o:['De oro','De hielo y roca','De nubes'], correcta:1 }
      },
      {
        id: 'es3', wikiArticulo: 'Sun', emoji: '☀️', nombre: 'El Sol, una estrella gigante',
        palabras: ['SOL', 'ESTRELLA', 'LUZ', 'TIERRA'],
        wiki: 'The_Sun_in_white_light.jpg',
        dato: 'El Sol es una estrella tan grande que cabrían un millón de Tierras dentro. Su luz tarda 8 minutos en llegar hasta nosotros.',
        bg: ['#5a3a0a','#8a5a1a'], icono:'☀️',
        reto: { p:'¿Cuánto tarda la luz del Sol en llegar a la Tierra?', o:['1 segundo','8 minutos','1 día'], correcta:1 }
      },
      {
        id: 'es4', wikiArticulo: 'Mars', orden: 4, corto: 'Marte', emoji: '🔴', nombre: 'Marte, el planeta rojo',
        palabras: ['MARTE', 'ROJO', 'ÓXIDO', 'ROBOT'],
        wiki: 'OSIRIS_Mars_true_color.jpg',
        dato: 'Marte es rojo porque su tierra tiene óxido, ¡como un metal oxidado! Hay robots exploradores paseando por él ahora mismo.',
        bg: ['#5a1a1a','#8a2a2a'], icono:'🔴',
        reto: { p:'¿Por qué Marte es rojo?', o:['Por el fuego','Su tierra tiene óxido','Está pintado'], correcta:1 }
      },
      {
        id: 'es5', wikiArticulo: 'Constellation', emoji: '⭐', nombre: 'Las estrellas y constelaciones',
        palabras: ['ESTRELLA', 'PUNTOS', 'DIBUJO', 'CIELO'],
        wiki: 'Milky_Way_Night_Sky_Black_Rock_Desert_Nevada.jpg',
        dato: 'Las constelaciones son dibujos que la gente imaginó uniendo estrellas, como conectar puntos. ¡Algunas estrellas que ves ya se apagaron hace mucho!',
        bg: ['#0a0a2a','#1a1a4a'], icono:'⭐',
        reto: { p:'¿Qué son las constelaciones?', o:['Planetas','Dibujos con estrellas','Nubes'], correcta:1 }
      },
      {
        id: 'es6', wikiArticulo: 'Comet', emoji: '☄️', nombre: 'Los cometas viajeros',
        palabras: ['COMETA', 'HIELO', 'POLVO', 'COLA'],
        wiki: 'Comet_P1_McNaught02_-_23-01-07.jpg',
        dato: 'Un cometa es una bola de hielo y polvo con una cola brillante. ¡Algunos tardan miles de años en dar una vuelta y volver a pasar cerca!',
        bg: ['#1a2a4a','#2a4a6a'], icono:'☄️',
        reto: { p:'¿De qué está hecho un cometa?', o:['Fuego','Hielo y polvo','Metal'], correcta:1 }
      },
{
        id: 'es7', orden: 1, emoji: '🪨', nombre: 'Mercurio', wikiArticulo: 'Mercury (planet)',
        palabras: ['MERCURIO','SOL','CALOR','FRÍO'],
        dato: 'Es el planeta más cercano al Sol y el más pequeño. ¡Da una vuelta completa al Sol en solo 88 días!',
        historia: 'No tiene lunas ni aire para respirar. De día hace muchísimo calor y de noche muchísimo frío.',
        bg: ['#3a3a3a','#8a8a8a'], icono:'🪨',
        reto: { p:'¿Cuál es el planeta más cercano al Sol?', o:['Mercurio','Neptuno','Júpiter'], correcta:0 }
      },
      {
        id: 'es8', orden: 2, emoji: '🟡', nombre: 'Venus', wikiArticulo: 'Venus',
        palabras: ['VENUS','NUBES','LUCERO','CALOR'],
        dato: 'Venus es el planeta más caliente, ¡más que Mercurio! Sus nubes gruesas atrapan el calor como una olla tapada.',
        historia: 'Brilla mucho al amanecer y al atardecer, por eso lo llaman «el lucero». ¡Y gira al revés que casi todos los planetas!',
        bg: ['#6a4a1a','#e0b050'], icono:'🟡',
        reto: { p:'¿Cuál es el planeta más caliente?', o:['Venus','Neptuno','La Tierra'], correcta:0 }
      },
      {
        id: 'es9', orden: 3, corto: 'Tierra', emoji: '🌍', nombre: 'La Tierra', wikiArticulo: 'Earth',
        palabras: ['TIERRA','AGUA','VIDA','HOGAR'],
        dato: '¡Es nuestro hogar! Es el único planeta que conocemos con vida, y casi tres cuartas partes están cubiertas de agua.',
        historia: 'En 1968 los astronautas del Apolo 8 fotografiaron la Tierra saliendo detrás de la Luna. ¡Fue la primera vez que la vimos así!',
        bg: ['#0a2a5a','#2a8ad0'], icono:'🌍',
        reto: { p:'¿Qué cubre la mayor parte de la Tierra?', o:['El agua','La arena','El hielo'], correcta:0 }
      },
      {
        id: 'es10', orden: 5, emoji: '🟠', nombre: 'Júpiter', wikiArticulo: 'Jupiter',
        palabras: ['JÚPITER','GIGANTE','TORMENTA','LUNAS'],
        dato: 'Júpiter es el planeta más grande: ¡dentro cabrían más de 1000 Tierras! Tiene una tormenta gigante, la Gran Mancha Roja, más grande que nuestro planeta.',
        historia: 'En 1610 Galileo Galilei miró Júpiter con su telescopio y descubrió cuatro de sus lunas.',
        bg: ['#6a3a1a','#d0904a'], icono:'🟠',
        reto: { p:'¿Cuál es el planeta más grande?', o:['Júpiter','Mercurio','Marte'], correcta:0 }
      },
      {
        id: 'es11', orden: 7, emoji: '🩵', nombre: 'Urano', wikiArticulo: 'Uranus',
        palabras: ['URANO','ACOSTADO','HIELO','AZUL'],
        dato: 'Urano gira acostado, como una pelota que rueda. Es de color azul verdoso y muy, muy frío.',
        historia: 'En 1781 el astrónomo William Herschel lo descubrió con un telescopio. Fue el primer planeta descubierto con telescopio.',
        bg: ['#1a4a5a','#6ad0e0'], icono:'🩵',
        reto: { p:'¿Cómo gira Urano?', o:['Acostado, como una pelota que rueda','No gira','Muy rápido hacia arriba'], correcta:0 }
      },
      {
        id: 'es12', orden: 8, emoji: '🔵', nombre: 'Neptuno', wikiArticulo: 'Neptune',
        palabras: ['NEPTUNO','VIENTO','AZUL','LEJOS'],
        dato: 'Neptuno es el planeta más lejano del Sol. ¡Tiene los vientos más rápidos del sistema solar!',
        historia: 'En 1846 lo encontraron gracias a las matemáticas: los científicos calcularon dónde debía estar antes de verlo.',
        bg: ['#0a1a5a','#2a5ad0'], icono:'🔵',
        reto: { p:'¿Cuál es el planeta más lejano del Sol?', o:['Neptuno','Venus','La Tierra'], correcta:0 }
      }
    ]
  },
  {
    id: 'paises', nombre: 'Países', emoji: '🌎', color: '#e0762a',
    intro: 'Viaja por el mundo: conoce países, sus capitales y los momentos que cambiaron su historia.',
    descubrimientos: [
      {
        id: 'pa7', wikiArticulo: 'Galápagos tortoise', iso: '218', emoji: '🇪🇨', nombre: 'Ecuador', capital: 'Quito',
        palabras: ['ECUADOR', 'QUITO', 'TORTUGA', 'VOLCÁN', 'DARWIN'],
        wiki: 'Galapagos_giant_tortoise_Geochelone_elephantopus.jpg',
        dato: '¡Por Ecuador pasa la línea que divide a la Tierra en dos mitades! Y la cima del volcán Chimborazo es el punto más lejano del centro de la Tierra: ¡el lugar más cercano al espacio!',
        historia: 'En 1835 el científico Charles Darwin visitó las islas Galápagos. Sus tortugas gigantes y sus pájaros le ayudaron a entender cómo cambian los seres vivos con el tiempo.',
        bg: ['#1a4a6a','#e0b020'], icono:'🐢',
        reto: { p:'¿Qué línea pasa por Ecuador?', o:['La línea equinoccial','La línea del tren','La línea del Polo Norte'], correcta:0 }
      },
      {
        id: 'lu4', iso: '604', emoji: '🇵🇪', nombre: 'Perú', capital: 'Lima',
        palabras: ['PERÚ', 'LIMA', 'INCAS', 'PIEDRA', 'MONTAÑA'],
        wiki: 'Machu_Picchu,_Peru.jpg',
        dato: 'Aquí está Machu Picchu, una ciudad de piedra que los incas construyeron en lo alto de una montaña. ¡Sus piedras encajan tan bien que no les cabe ni una hoja de papel!',
        historia: 'Los incas tuvieron un imperio enorme con caminos que llegaban hasta Quito. En 1911 Machu Picchu se hizo famoso en todo el mundo y hoy lo visitan miles de personas.',
        bg: ['#2a5a3a','#4a7a5a'], icono:'🏔️',
        reto: { p:'¿Quiénes construyeron Machu Picchu?', o:['Los romanos','Los incas','Los vikingos'], correcta:1 }
      },
      {
        id: 'pa8', wikiArticulo: 'Chichen Itza', iso: '484', emoji: '🇲🇽', nombre: 'México', capital: 'Ciudad de México',
        palabras: ['MÉXICO', 'MAYAS', 'AZTECAS', 'LAGO', 'CHOCOLATE'],
        wiki: 'Chichen_Itza_3.jpg',
        dato: 'En México está Chichén Itzá, una pirámide de los mayas. ¡Y los pueblos antiguos de México ya tomaban chocolate hace miles de años!',
        historia: 'Los aztecas construyeron su capital, Tenochtitlan, sobre un lago. Justo ahí está hoy la Ciudad de México, una de las ciudades más grandes del mundo.',
        bg: ['#1a6a3a','#c0302a'], icono:'🔺',
        reto: { p:'¿Dónde construyeron los aztecas su capital?', o:['Sobre un lago','En una nube','Bajo tierra'], correcta:0 }
      },
      {
        id: 'pa9', wikiArticulo: 'Christ the Redeemer (statue)', iso: '076', emoji: '🇧🇷', nombre: 'Brasil', capital: 'Brasilia',
        palabras: ['BRASIL', 'BRASILIA', 'SELVA', 'ANIMALES'],
        wiki: 'Christ_the_Redeemer_-_Cristo_Redentor.jpg',
        dato: 'Brasil tiene la mayor parte de la selva amazónica, la selva tropical más grande del planeta. ¡Ahí viven miles de animales que no existen en ningún otro lugar!',
        historia: 'Mucha gente cree que la capital es Río de Janeiro, pero no. En 1960 Brasil estrenó una capital nueva, Brasilia, construida en muy pocos años en medio del país.',
        bg: ['#1a7a3a','#f0c020'], icono:'🌳',
        reto: { p:'¿Cuál es la capital de Brasil?', o:['Río de Janeiro','Brasilia','São Paulo'], correcta:1 }
      },
      {
        id: 'lu6', iso: '840', emoji: '🇺🇸', nombre: 'Estados Unidos', capital: 'Washington D. C.',
        palabras: ['ESTATUA', 'LUNA', 'ARMSTRONG', 'WASHINGTON'],
        wiki: 'Statue_of_Liberty_7.jpg',
        dato: 'La Estatua de la Libertad fue un regalo de Francia. ¡Es tan alta como un edificio de 30 pisos!',
        historia: 'En 1969 los astronautas de Estados Unidos llegaron a la Luna. Neil Armstrong fue el primer ser humano en caminar sobre ella.',
        bg: ['#2a3a6a','#b02a2a'], icono:'🗽',
        reto: { p:'¿Quién fue el primero en caminar en la Luna?', o:['Neil Armstrong','Cristóbal Colón','Albert Einstein'], correcta:0 }
      },
      {
        id: 'lu1', iso: '250', emoji: '🇫🇷', nombre: 'Francia', capital: 'París',
        palabras: ['FRANCIA', 'PARÍS', 'TORRE', 'EIFFEL'],
        wiki: 'Tour_Eiffel_Wikimedia_Commons.jpg',
        dato: 'La Torre Eiffel mide como un edificio de 100 pisos. ¡En verano crece un poquito porque el metal se estira con el calor!',
        historia: 'La Torre Eiffel se construyó en 1889 para una gran feria mundial. Al principio a mucha gente no le gustaba… ¡y hoy es el símbolo de Francia!',
        bg: ['#2a3a7a','#5a5a6a'], icono:'🗼',
        reto: { p:'¿Cuál es la capital de Francia?', o:['Roma','París','Madrid'], correcta:1 }
      },
      {
        id: 'lu2', iso: '380', emoji: '🇮🇹', nombre: 'Italia', capital: 'Roma',
        palabras: ['ITALIA', 'ROMA', 'COLISEO', 'IMPERIO'],
        wiki: 'Colosseo_2020.jpg',
        dato: 'En Roma está el Coliseo, donde luchaban los gladiadores hace casi 2000 años. ¡Cabían 50.000 personas, como en un estadio de fútbol!',
        historia: 'Hace unos 2000 años Roma era el centro de un imperio gigante. Sus caminos llegaban tan lejos que nació el dicho: «todos los caminos llevan a Roma».',
        bg: ['#1a6a3a','#6a5a2a'], icono:'🏛️',
        reto: { p:'¿Dónde luchaban los gladiadores?', o:['En el Coliseo','En la Torre Eiffel','En una pirámide'], correcta:0 }
      },
      {
        id: 'lu3', iso: '818', emoji: '🇪🇬', nombre: 'Egipto', capital: 'El Cairo',
        palabras: ['EGIPTO', 'CAIRO', 'PIRÁMIDE', 'ROSETTA'],
        wiki: 'Kheops-Pyramid.jpg',
        dato: 'Las pirámides de Egipto tienen más de 4500 años. ¡Las construyeron sin máquinas, moviendo piedras gigantes entre muchísimas personas!',
        historia: 'Los egipcios escribían con dibujos llamados jeroglíficos. Durante siglos nadie sabía leerlos, hasta que en 1822 un investigador logró descifrarlos gracias a la Piedra de Rosetta.',
        bg: ['#5a4a1a','#8a6a2a'], icono:'🔺',
        reto: { p:'¿Cómo se llama la escritura con dibujos de Egipto?', o:['Jeroglíficos','Emojis','Números'], correcta:0 }
      },
      {
        id: 'lu5', iso: '156', emoji: '🇨🇳', nombre: 'China', capital: 'Pekín',
        palabras: ['CHINA', 'PEKÍN', 'MURALLA', 'PAPEL', 'BRÚJULA'],
        wiki: 'The_Great_Wall_of_China_at_Jinshanling-edit.jpg',
        dato: 'La Gran Muralla China es tan larga que si caminaras sin parar tardarías meses en recorrerla. ¡La construyeron para proteger a la gente!',
        historia: 'En China se inventaron cosas que usamos todos los días, como el papel y la brújula. ¡Sin ellos no tendríamos cuadernos ni mapas para viajar!',
        bg: ['#8a1a1a','#7a6a4a'], icono:'🧱',
        reto: { p:'¿Qué se inventó en China?', o:['El papel','El celular','El avión'], correcta:0 }
      },
      {
        id: 'pa10', wikiArticulo: 'Mount Fuji', iso: '392', emoji: '🇯🇵', nombre: 'Japón', capital: 'Tokio',
        palabras: ['JAPÓN', 'TOKIO', 'VOLCÁN', 'TREN', 'ISLAS'],
        wiki: '080103_hakkai_fuji.jpg',
        dato: 'Japón está formado por miles de islas. Su montaña más famosa, el monte Fuji, ¡es un volcán!',
        historia: 'En 1964 Japón estrenó el tren bala, uno de los trenes más rápidos del mundo. Japón también es la tierra de muchos videojuegos famosos.',
        bg: ['#f0f0f0','#c02a3a'], icono:'🗻',
        reto: { p:'¿Cómo se llama el tren rápido de Japón?', o:['Tren bala','Tren tortuga','Tren nube'], correcta:0 }
      }
    ]
  },
  {
    id: 'tecnologia', nombre: 'Tecnología', emoji: '💡', color: '#1aa0a0',
    intro: 'Descubre quién inventó las cosas que usas todos los días: el celular, la computadora y los videojuegos.',
    descubrimientos: [
      {
        id: 'te1', wikiArticulo: 'Motorola DynaTAC', emoji: '📱', nombre: 'El primer celular',
        palabras: ['CELULAR', 'COOPER', 'LLAMADA', 'KILO'],
        wiki: '',
        dato: 'El primer celular pesaba casi 1 kilo, ¡como una botella grande de agua! Y cargarlo tardaba horas para hablar solo un ratito.',
        historia: 'En 1973 el ingeniero Martin Cooper hizo la primera llamada con un celular portátil, caminando por una calle de Nueva York.',
        bg: ['#0a3a4a','#1aa0a0'], icono:'📱',
        reto: { p:'¿Quién hizo la primera llamada con un celular?', o:['Martin Cooper','Thomas Edison','Neil Armstrong'], correcta:0 }
      },
      {
        id: 'te2', wikiArticulo: 'ENIAC', emoji: '💻', nombre: 'La computadora',
        palabras: ['ENIAC', 'ADA', 'PROGRAMA', 'ELEFANTE'],
        wiki: 'Eniac.jpg',
        dato: 'Una de las primeras computadoras, ENIAC, ocupaba un cuarto entero y pesaba como 5 elefantes. ¡Hoy un celular es muchísimo más poderoso!',
        historia: 'Mucho antes, en 1843, Ada Lovelace escribió lo que muchos llaman el primer programa de computadora. ¡Imaginó máquinas que todavía no existían!',
        bg: ['#1a2a4a','#2a6a8a'], icono:'💻',
        reto: { p:'¿Cuánto pesaba ENIAC, una de las primeras computadoras?', o:['Como un gato','Como 5 elefantes','Como una pluma'], correcta:1 }
      },
      {
        id: 'te3', wikiArticulo: 'Tennis for Two', emoji: '🎮', nombre: 'Los videojuegos',
        palabras: ['TENIS', 'PONG', 'PANTALLA', 'JUEGO'],
        wiki: '',
        dato: 'Uno de los primeros videojuegos fue un tenis que se jugaba en una pantallita redonda de laboratorio. ¡No había colores ni personajes, solo una bolita de luz!',
        historia: 'Ese juego, «Tennis for Two», se creó en 1958. En 1972 llegó Pong, el videojuego que hizo que el mundo entero quisiera jugar.',
        bg: ['#2a0a4a','#6a2ac0'], icono:'🕹️',
        reto: { p:'¿Qué deporte era uno de los primeros videojuegos?', o:['Tenis','Fútbol','Natación'], correcta:0 }
      },
      {
        id: 'te4', wikiArticulo: 'Submarine communications cable', emoji: '🌐', nombre: 'Internet y la web',
        palabras: ['INTERNET', 'WEB', 'CABLES', 'PÁGINA'],
        wiki: '',
        dato: 'Internet conecta millones de computadoras por cables, incluso cables gigantes que van por el fondo del mar. ¡Por eso puedes ver un video de otro país!',
        historia: 'En 1989 Tim Berners-Lee inventó la web, la forma de navegar por páginas con enlaces. La primera página web apareció en 1991.',
        bg: ['#0a2a5a','#2a8ad0'], icono:'🌐',
        reto: { p:'¿Por dónde pasan algunos cables de internet?', o:['Por el fondo del mar','Por la Luna','Por las nubes'], correcta:0 }
      },
      {
        id: 'te5', wikiArticulo: 'Incandescent light bulb', emoji: '💡', nombre: 'El foco',
        palabras: ['FOCO', 'EDISON', 'VELAS', 'LUZ'],
        wiki: '',
        dato: 'Antes del foco, la gente se alumbraba con velas y lámparas de aceite. ¡Leer de noche era difícil!',
        historia: 'En 1879 Thomas Edison y su equipo lograron un foco que se mantenía encendido muchas horas. Así la luz eléctrica llegó a las casas.',
        bg: ['#4a3a0a','#e0b020'], icono:'💡',
        reto: { p:'¿Con qué se alumbraba la gente antes del foco?', o:['Con velas','Con celulares','Con linternas LED'], correcta:0 }
      },
      {
        id: 'te6', wikiArticulo: 'Wright Flyer', emoji: '✈️', nombre: 'El avión',
        palabras: ['AVIÓN', 'WRIGHT', 'VUELO', 'MOTOR'],
        wiki: 'Wright_First_Flight_1903Dec17_(full_restore_115).jpg',
        dato: '¡El primer vuelo en avión duró solo 12 segundos! Hoy un avión puede cruzar el océano sin parar.',
        historia: 'El 17 de diciembre de 1903 los hermanos Wright volaron por primera vez en un avión con motor.',
        bg: ['#1a4a7a','#6ab0e0'], icono:'✈️',
        reto: { p:'¿Cuánto duró el primer vuelo en avión?', o:['12 segundos','12 horas','12 días'], correcta:0 }
      },
      {
        id: 'te7', wikiArticulo: 'Perseverance (rover)', emoji: '🤖', nombre: 'Los robots',
        palabras: ['ROBOT', 'MARTE', 'TEATRO', 'PALABRA'],
        wiki: '',
        dato: 'Hay robots que exploran Marte, robots que arman carros y robots que ayudan a los doctores. ¡Algunos van a lugares donde las personas no pueden ir!',
        historia: 'La palabra «robot» apareció en 1920 en una obra de teatro del escritor Karel Čapek, del país que hoy es Chequia.',
        bg: ['#2a2a3a','#6a7a8a'], icono:'🤖',
        reto: { p:'¿Qué planeta exploran algunos robots?', o:['Marte','El Sol','Ninguno'], correcta:0 }
      },
      {
        id: 'te8', wikiArticulo: 'Sputnik 1', emoji: '🛰️', nombre: 'Los satélites',
        palabras: ['SATÉLITE', 'SPUTNIK', 'MAPAS', 'CLIMA'],
        wiki: '',
        dato: 'Hay miles de satélites dando vueltas alrededor de la Tierra. ¡Gracias a ellos funcionan los mapas del celular y el pronóstico del clima!',
        historia: 'En 1957 se lanzó el Sputnik, el primer satélite artificial. Era una esfera de metal con antenas que hacía «bip bip».',
        bg: ['#0a0a3a','#3a3a8a'], icono:'🛰️',
        reto: { p:'¿Para qué nos ayudan los satélites?', o:['Para los mapas del celular','Para cocinar','Para dormir'], correcta:0 }
      }
    ]
  },
  {
    id: 'dinosaurios', nombre: 'Dinosaurios', emoji: '🦖', color: '#7a9a1a',
    intro: 'Viaja millones de años atrás, cuando los dinosaurios dominaban la Tierra.',
    descubrimientos: [
      {
        id: 'di1', wikiArticulo: 'Tyrannosaurus', emoji: '🦖', nombre: 'Tiranosaurio rex',
        palabras: ['REX', 'DIENTES', 'BRAZOS', 'MORDIDA'],
        wiki: '',
        dato: 'El T-Rex tenía dientes del tamaño de un plátano y una de las mordidas más fuertes de todos los animales. ¡Pero sus brazos eran cortitos!',
        historia: 'Vivió hace unos 66 millones de años, en lo que hoy es Norteamérica. Su nombre significa «rey de los lagartos tiranos».',
        bg: ['#3a4a1a','#7a9a1a'], icono:'🦖',
        reto: { p:'¿Cómo eran los brazos del T-Rex?', o:['Cortitos','Larguísimos','Tenía 6 brazos'], correcta:0 }
      },
      {
        id: 'di2', wikiArticulo: 'Brachiosaurus', emoji: '🦕', nombre: 'Braquiosaurio',
        palabras: ['CUELLO', 'HOJAS', 'PLANTAS', 'ÁRBOL'],
        wiki: '',
        dato: 'Su cuello era tan largo que podía comer hojas de la punta de los árboles, ¡a la altura de un edificio de 4 pisos! Solo comía plantas.',
        historia: 'Los dinosaurios de cuello largo fueron de los animales más grandes que han caminado sobre la Tierra.',
        bg: ['#1a4a3a','#3a8a5a'], icono:'🦕',
        reto: { p:'¿Qué comía el Braquiosaurio?', o:['Plantas','Carne','Piedras'], correcta:0 }
      },
      {
        id: 'di3', wikiArticulo: 'Triceratops', emoji: '🦏', nombre: 'Triceratops',
        palabras: ['CUERNOS', 'ESCUDO', 'TRES', 'PLANTAS'],
        wiki: '',
        dato: 'Tenía 3 cuernos en la cabeza y un gran escudo en el cuello para defenderse. ¡Vivió al mismo tiempo que el T-Rex!',
        historia: 'Su nombre significa «cara con tres cuernos». Era herbívoro: comía plantas.',
        bg: ['#4a3a1a','#9a7a3a'], icono:'🦏',
        reto: { p:'¿Cuántos cuernos tenía el Triceratops?', o:['1','3','10'], correcta:1 }
      },
      {
        id: 'di4', wikiArticulo: 'Velociraptor', emoji: '🪶', nombre: 'Velociraptor',
        palabras: ['RAPTOR', 'PLUMAS', 'PAVO', 'RÁPIDO'],
        wiki: '',
        dato: 'En las películas se ve enorme, pero en realidad era del tamaño de un pavo. ¡Y tenía plumas!',
        historia: 'Los científicos encontraron marcas en sus huesos donde se sujetaban las plumas. Era rápido y listo.',
        bg: ['#5a3a1a','#b0702a'], icono:'🪶',
        reto: { p:'¿Qué tenía el Velociraptor?', o:['Plumas','Escamas de pez','Ruedas'], correcta:0 }
      },
      {
        id: 'di5', wikiArticulo: 'Stegosaurus', emoji: '🦎', nombre: 'Estegosaurio',
        palabras: ['PLACAS', 'PÚAS', 'COLA', 'CEREBRO'],
        wiki: '',
        dato: 'Tenía placas grandes en la espalda y púas en la cola para defenderse. ¡Su cerebro era pequeñito para su gran tamaño!',
        historia: 'Vivió mucho antes que el T-Rex. Entre los dos hay más tiempo que entre el T-Rex y nosotros.',
        bg: ['#2a4a2a','#5a8a3a'], icono:'🦎',
        reto: { p:'¿Qué tenía el Estegosaurio en la cola?', o:['Púas','Una flor','Una campana'], correcta:0 }
      },
      {
        id: 'di6', wikiArticulo: 'Pterosaur', emoji: '🦅', nombre: 'Pterosaurios',
        palabras: ['ALAS', 'VOLAR', 'REPTIL', 'CIELO'],
        wiki: '',
        dato: '¡Sorpresa! Los pterosaurios volaban junto a los dinosaurios, pero NO eran dinosaurios: eran reptiles voladores.',
        historia: 'Algunos pterosaurios tenían alas más anchas que una avioneta pequeña.',
        bg: ['#1a3a5a','#5a8ab0'], icono:'🦅',
        reto: { p:'¿Los pterosaurios eran dinosaurios?', o:['No, eran reptiles voladores','Sí','Eran peces'], correcta:0 }
      },
      {
        id: 'di7', wikiArticulo: 'Chicxulub crater', emoji: '☄️', nombre: 'La gran extinción',
        palabras: ['ASTEROIDE', 'CRÁTER', 'MÉXICO', 'CLIMA'],
        wiki: '',
        dato: 'Hace unos 66 millones de años cayó un asteroide gigante sobre la Tierra. Cambió el clima y la mayoría de los dinosaurios desapareció.',
        historia: 'El cráter que dejó el asteroide está en México, en un lugar llamado Chicxulub.',
        bg: ['#4a1a0a','#c0502a'], icono:'☄️',
        reto: { p:'¿Qué hizo desaparecer a la mayoría de los dinosaurios?', o:['Un asteroide','Un terremoto pequeño','Una lluvia'], correcta:0 }
      },
      {
        id: 'di8', wikiArticulo: 'Archaeopteryx', emoji: '🐔', nombre: 'Dinosaurios de hoy',
        palabras: ['AVES', 'GALLINA', 'PALOMA', 'PLUMAS'],
        wiki: '',
        dato: '¡Los dinosaurios no desaparecieron del todo! Las aves son sus descendientes. Cada paloma y cada gallina es pariente del T-Rex.',
        historia: 'Los científicos lo descubrieron comparando huesos de aves con fósiles de dinosaurios con plumas.',
        bg: ['#5a4a1a','#e0a02a'], icono:'🐔',
        reto: { p:'¿Qué animales de hoy son descendientes de los dinosaurios?', o:['Las aves','Los peces','Los gatos'], correcta:0 }
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
      { letra:'M', p:'¿Cuál empieza con M?', o:['🐢 Tortuga','🪼 Medusa','🦀 Cangrejo'], ok:1 },
      { letra:'C', p:'¿Cuál empieza con C?', o:['🦀 Cangrejo','🐙 Pulpo','🐬 Delfín'], ok:0 },
      { letra:'🏆', p:'¿Cuál es el MÁS grande del mar?', o:['🐋 Ballena','🦐 Camarón','🐠 Pez'], ok:0 },
      { letra:'💡', p:'¿Cuál tiene 8 brazos?', o:['🐙 Pulpo','🦈 Tiburón','🐢 Tortuga'], ok:0 },
      { letra:'💡', p:'¿Cuál brilla en la oscuridad?', o:['🪼 Medusa','🦀 Cangrejo','🐡 Globo'], ok:0 },
      { letra:'A', p:'¿Cuál empieza con A?', o:['🦭 Foca','🐚 Almeja','🐠 Pez'], ok:1 },
      { letra:'💡', p:'¿Cuál es súper rápido nadando?', o:['🐬 Delfín','🐢 Tortuga','🐌 Caracol'], ok:0 },
      { letra:'E', p:'¿Cuál empieza con E?', o:['⭐ Estrella','🐙 Pulpo','🦈 Tiburón'], ok:0 },
      { letra:'💡', p:'¿Cuál tiene caparazón?', o:['🐢 Tortuga','🐋 Ballena','🐙 Pulpo'], ok:0 },
      { letra:'F', p:'¿Cuál empieza con F?', o:['🐠 Pez','🦭 Foca','🦀 Cangrejo'], ok:1 },
      { letra:'💡', p:'¿Cuál puede inflarse como globo?', o:['🐡 Pez globo','🐬 Delfín','🦈 Tiburón'], ok:0 }
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
      { letra:'M', p:'¿Cuál empieza con M?', o:['🐵 Mono','🐘 Elefante','🦒 Jirafa'], ok:0 },
      { letra:'🏆', p:'¿Cuál es el MÁS grande?', o:['🐘 Elefante','🐭 Ratón','🐰 Conejo'], ok:0 },
      { letra:'💡', p:'¿Cuál cambia de color?', o:['🦎 Camaleón','🦁 León','🐼 Panda'], ok:0 },
      { letra:'💡', p:'¿Cuál es el más lento?', o:['🦥 Perezoso','🐆 Guepardo','🐎 Caballo'], ok:0 },
      { letra:'💡', p:'¿Cuál tiene el cuello largo?', o:['🦒 Jirafa','🐘 Elefante','🦁 León'], ok:0 },
      { letra:'J', p:'¿Cuál empieza con J?', o:['🦒 Jirafa','🐯 Tigre','🐵 Mono'], ok:0 },
      { letra:'💡', p:'¿Cuál vuela?', o:['🦜 Tucán','🐘 Elefante','🦥 Perezoso'], ok:0 },
      { letra:'E', p:'¿Cuál empieza con E?', o:['🐘 Elefante','🦁 León','🐼 Panda'], ok:0 },
      { letra:'💡', p:'¿Cuál come solo bambú?', o:['🐼 Panda','🐯 Tigre','🦊 Zorro'], ok:0 },
      { letra:'💡', p:'¿Cuál es el rey de la selva?', o:['🦁 León','🐭 Ratón','🐧 Pingüino'], ok:0 },
      { letra:'Z', p:'¿Cuál empieza con Z?', o:['🦓 Cebra','🦁 León','🐘 Elefante'], ok:0 }
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
      { letra:'G', p:'¿Cuál empieza con G?', o:['🌌 Galaxia','🌙 Luna','☀️ Sol'], ok:0 },
      { letra:'🏆', p:'¿Cuál es el MÁS grande?', o:['☀️ Sol','🌙 Luna','⭐ Estrella'], ok:0 },
      { letra:'💡', p:'¿Cuál tiene anillos?', o:['🪐 Saturno','🌙 Luna','🔴 Marte'], ok:0 },
      { letra:'💡', p:'¿Cuál es el planeta rojo?', o:['🔴 Marte','🌙 Luna','☀️ Sol'], ok:0 },
      { letra:'💡', p:'¿Cuál nos da luz de día?', o:['☀️ Sol','🌙 Luna','⭐ Estrella'], ok:0 },
      { letra:'💡', p:'¿Cuál tiene una cola de luz?', o:['☄️ Cometa','🪐 Saturno','🔴 Marte'], ok:0 },
      { letra:'E', p:'¿Cuál empieza con E?', o:['⭐ Estrella','🌙 Luna','☀️ Sol'], ok:0 },
      { letra:'💡', p:'¿Qué vemos de noche brillar?', o:['⭐ Estrellas','☀️ Sol','🌈 Arcoíris'], ok:0 },
      { letra:'T', p:'¿Cuál empieza con T?', o:['🌍 Tierra','🌙 Luna','⭐ Estrella'], ok:0 },
      { letra:'💡', p:'¿Dónde vivimos nosotros?', o:['🌍 La Tierra','🔴 Marte','☀️ El Sol'], ok:0 },
      { letra:'J', p:'¿Cuál empieza con J?', o:['🪐 Júpiter','🌙 Luna','⭐ Estrella'], ok:0 }
    ]}
  },
  paises: {
    color:'#ff9d2a', color2:'#e0762a',
    carrera:{ piloto:'✈️', bueno:['⭐','🚩','🧭'], malo:['🌪️','⛰️','🌧️'], pista:['#5a4a2a','#8a6a3a'], meta:'🏁' },
    laser:{ blancos:['⭐','🧭','🗺️','🎫'], evitar:'🌪️', fondo:['#5a4a2a','#8a6a3a'] },
    parame:{ titulo:'países del mundo', rondas:[
      { letra:'E', p:'¿Cuál empieza con E?', o:['🇪🇨 Ecuador','🇵🇪 Perú','🇲🇽 México'], ok:0 },
      { letra:'P', p:'¿Cuál empieza con P?', o:['🇵🇪 Perú','🇧🇷 Brasil','🇯🇵 Japón'], ok:0 },
      { letra:'M', p:'¿Cuál empieza con M?', o:['🇲🇽 México','🇫🇷 Francia','🇨🇳 China'], ok:0 },
      { letra:'J', p:'¿Cuál empieza con J?', o:['🇯🇵 Japón','🇮🇹 Italia','🇪🇬 Egipto'], ok:0 },
      { letra:'💡', p:'¿Dónde está la Torre Eiffel?', o:['🇫🇷 Francia','🇧🇷 Brasil','🇯🇵 Japón'], ok:0 },
      { letra:'💡', p:'¿Dónde están las pirámides más antiguas?', o:['🇪🇬 Egipto','🇨🇳 China','🇪🇨 Ecuador'], ok:0 },
      { letra:'💡', p:'¿Cuál es la capital de Ecuador?', o:['🏙️ Quito','🏙️ Lima','🏙️ Tokio'], ok:0 },
      { letra:'💡', p:'¿Dónde está Machu Picchu?', o:['🇵🇪 Perú','🇮🇹 Italia','🇺🇸 EE. UU.'], ok:0 },
      { letra:'💡', p:'¿Dónde está la Gran Muralla?', o:['🇨🇳 China','🇲🇽 México','🇫🇷 Francia'], ok:0 },
      { letra:'💡', p:'¿Dónde viven las tortugas gigantes de Galápagos?', o:['🇪🇨 Ecuador','🇪🇬 Egipto','🇯🇵 Japón'], ok:0 },
      { letra:'💡', p:'¿Dónde nació el tren bala?', o:['🇯🇵 Japón','🇧🇷 Brasil','🇵🇪 Perú'], ok:0 },
      { letra:'💡', p:'¿Cuál es la capital de Brasil?', o:['🏙️ Brasilia','🏙️ Río de Janeiro','🏙️ Lima'], ok:0 },
      { letra:'I', p:'¿Cuál empieza con I?', o:['🇮🇹 Italia','🇫🇷 Francia','🇨🇳 China'], ok:0 },
      { letra:'🏆', p:'¿Qué país tiene la selva más grande?', o:['🇧🇷 Brasil','🇪🇬 Egipto','🇫🇷 Francia'], ok:0 }
    ]}
  },
  tecnologia: {
    color:'#2ad0c0', color2:'#1aa0a0',
    carrera:{ piloto:'🛸', bueno:['⚡','💾','🔋'], malo:['🐛','🔥','🧲'], pista:['#0a3a4a','#1a7a8a'], meta:'🏁' },
    laser:{ blancos:['⚡','💾','🔋','📡'], evitar:'🐛', fondo:['#0a3a4a','#1a7a8a'] },
    parame:{ titulo:'tecnología', rondas:[
      { letra:'C', p:'¿Cuál empieza con C?', o:['📱 Celular','💡 Foco','✈️ Avión'], ok:0 },
      { letra:'R', p:'¿Cuál empieza con R?', o:['🤖 Robot','📱 Celular','🎮 Control'], ok:0 },
      { letra:'A', p:'¿Cuál empieza con A?', o:['✈️ Avión','💻 Laptop','🛰️ Satélite'], ok:0 },
      { letra:'S', p:'¿Cuál empieza con S?', o:['🛰️ Satélite','🤖 Robot','💡 Foco'], ok:0 },
      { letra:'💡', p:'¿Quién hizo la primera llamada con celular?', o:['Martin Cooper','Neil Armstrong','Charles Darwin'], ok:0 },
      { letra:'💡', p:'¿Quiénes hicieron volar el primer avión?', o:['Los hermanos Wright','Los incas','Los mayas'], ok:0 },
      { letra:'💡', p:'¿Quién inventó la web?', o:['Tim Berners-Lee','Thomas Edison','Ada Lovelace'], ok:0 },
      { letra:'💡', p:'¿Quién escribió uno de los primeros programas?', o:['Ada Lovelace','Martin Cooper','Karel Čapek'], ok:0 },
      { letra:'💡', p:'¿Qué nos ayuda a ver en la noche?', o:['💡 Foco','🎮 Control','📡 Antena'], ok:0 },
      { letra:'💡', p:'¿Qué da vueltas alrededor de la Tierra?', o:['🛰️ Satélite','🚗 Carro','📱 Celular'], ok:0 },
      { letra:'💡', p:'¿Qué juego fue uno de los primeros?', o:['🎾 Tenis','⚽ Fútbol','🏀 Básquet'], ok:0 },
      { letra:'🏆', p:'¿Qué es más poderoso hoy?', o:['📱 Tu celular','📻 Un radio viejo','🕯️ Una vela'], ok:0 },
      { letra:'V', p:'¿Cuál empieza con V?', o:['🎮 Videojuego','🤖 Robot','📱 Celular'], ok:0 }
    ]}
  },
  dinosaurios: {
    color:'#9ac02a', color2:'#6a8a1a',
    carrera:{ piloto:'🦖', bueno:['🥚','🌿','⭐'], malo:['🌋','🪨','☄️'], pista:['#2a3a0a','#5a7a1a'], meta:'🏁' },
    laser:{ blancos:['🥚','🦴','🌿','⭐'], evitar:'🌋', fondo:['#2a3a0a','#5a7a1a'] },
    parame:{ titulo:'dinosaurios', rondas:[
      { letra:'T', p:'¿Cuál empieza con T?', o:['🦖 T-Rex','🦕 Braquiosaurio','🥚 Huevo'], ok:0 },
      { letra:'B', p:'¿Cuál empieza con B?', o:['🦕 Braquiosaurio','🦖 T-Rex','🦅 Pterosaurio'], ok:0 },
      { letra:'V', p:'¿Cuál empieza con V?', o:['🪶 Velociraptor','🦏 Triceratops','🌋 Volcán'], ok:0 },
      { letra:'H', p:'¿Cuál empieza con H?', o:['🥚 Huevo','🦴 Fósil','🌿 Planta'], ok:0 },
      { letra:'F', p:'¿Cuál empieza con F?', o:['🦴 Fósil','🦖 T-Rex','☄️ Asteroide'], ok:0 },
      { letra:'💡', p:'¿Cuál tenía 3 cuernos?', o:['🦏 Triceratops','🦖 T-Rex','🦕 Braquiosaurio'], ok:0 },
      { letra:'💡', p:'¿Cuál tenía el cuello más largo?', o:['🦕 Braquiosaurio','🦖 T-Rex','🪶 Velociraptor'], ok:0 },
      { letra:'💡', p:'¿Cuál tenía brazos cortitos?', o:['🦖 T-Rex','🦕 Braquiosaurio','🦅 Pterosaurio'], ok:0 },
      { letra:'💡', p:'¿Cuál tenía plumas?', o:['🪶 Velociraptor','🦏 Triceratops','🦎 Estegosaurio'], ok:0 },
      { letra:'💡', p:'¿Cuál volaba pero NO era dinosaurio?', o:['🦅 Pterosaurio','🦖 T-Rex','🦕 Braquiosaurio'], ok:0 },
      { letra:'💡', p:'¿Qué animal de hoy desciende de los dinosaurios?', o:['🐔 Gallina','🐟 Pez','🐱 Gato'], ok:0 },
      { letra:'🏆', p:'¿Qué cayó del cielo hace 66 millones de años?', o:['☄️ Asteroide','🌧️ Lluvia','❄️ Nieve'], ok:0 },
      { letra:'E', p:'¿Cuál empieza con E?', o:['🦎 Estegosaurio','🦖 T-Rex','🦏 Triceratops'], ok:0 }
    ]}
  }

};
window.TEMAS = TEMAS; window.MUNDOS = MUNDOS;
