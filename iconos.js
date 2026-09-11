/* ============================================================
   DANTE LAB · íconos de juegos (SVG dibujado, con personalidad)
   Cada uno devuelve un <svg> con estilo consistente: formas
   redondeadas, colores vivos, sin depender de emojis.
   ============================================================ */
const ICONOS = {
  // Atrapa el tesoro: cofre con brillo
  atrapa: `<svg viewBox="0 0 64 64" fill="none">
    <rect x="10" y="26" width="44" height="26" rx="6" fill="#ffd23f"/>
    <path d="M10 32 Q32 18 54 32 V32 H10Z" fill="#ffb02a"/>
    <rect x="10" y="34" width="44" height="6" fill="#e0902a"/>
    <rect x="28" y="34" width="8" height="10" rx="2" fill="#8a5a1a"/>
    <circle cx="32" cy="38" r="2.4" fill="#5a3a10"/>
    <path d="M20 14 l2 5 5 2 -5 2 -2 5 -2-5 -5-2 5-2Z" fill="#fff5c0"/>
  </svg>`,
  // Laberinto: caminito serpenteante
  laberinto: `<svg viewBox="0 0 64 64" fill="none">
    <rect x="8" y="8" width="48" height="48" rx="10" fill="#6a5ce0"/>
    <path d="M18 44 h14 v-14 h-8 v-6 h20" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="18" cy="44" r="4.5" fill="#ffd23f"/>
    <rect x="42" y="16" width="8" height="8" rx="2" fill="#ff6f9c"/>
  </svg>`,
  // Carreras: banderín + destello de velocidad
  carreras: `<svg viewBox="0 0 64 64" fill="none">
    <rect x="8" y="12" width="48" height="40" rx="10" fill="#2a9fe0"/>
    <path d="M20 40 l8-16 8 16Z" fill="#fff"/>
    <circle cx="28" cy="40" r="4" fill="#26324a"/>
    <path d="M42 20 h8 M40 28 h10 M42 36 h8" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/>
  </svg>`,
  // Párame la mano: mano/stop
  parame: `<svg viewBox="0 0 64 64" fill="none">
    <rect x="8" y="8" width="48" height="48" rx="12" fill="#ff9d2a"/>
    <path d="M24 44 V28 a3 3 0 016 0 M30 28 a3 3 0 016 0 v-2 a3 3 0 016 0 M42 28 a3 3 0 016 0 v10 a10 10 0 01-10 10 h-4 a10 10 0 01-8-4 l-4-6 a3 3 0 015-3 l3 3" fill="#fff"/>
  </svg>`,
  // Puntería láser: diana
  laser: `<svg viewBox="0 0 64 64" fill="none">
    <rect x="8" y="8" width="48" height="48" rx="12" fill="#8a5ce0"/>
    <circle cx="32" cy="32" r="16" fill="#fff"/>
    <circle cx="32" cy="32" r="11" fill="#ff6f9c"/>
    <circle cx="32" cy="32" r="6" fill="#fff"/>
    <circle cx="32" cy="32" r="2.5" fill="#ff5a5a"/>
  </svg>`,
  // Rayuela: casillas numeradas
  rayuela: `<svg viewBox="0 0 64 64" fill="none">
    <rect x="8" y="8" width="48" height="48" rx="12" fill="#3ac06a"/>
    <rect x="26" y="14" width="14" height="12" rx="3" fill="#fff"/>
    <rect x="18" y="28" width="14" height="12" rx="3" fill="#fff"/>
    <rect x="34" y="28" width="14" height="12" rx="3" fill="#ffd23f"/>
    <rect x="26" y="42" width="14" height="12" rx="3" fill="#fff"/>
  </svg>`,
  // Constructor: bloques apilados
  constructor: `<svg viewBox="0 0 64 64" fill="none">
    <rect x="8" y="8" width="48" height="48" rx="12" fill="#e0762a"/>
    <rect x="16" y="34" width="14" height="14" rx="2" fill="#ff6f9c"/>
    <rect x="34" y="34" width="14" height="14" rx="2" fill="#4ecdc4"/>
    <rect x="25" y="18" width="14" height="14" rx="2" fill="#ffd23f"/>
  </svg>`
};
window.ICONOS = ICONOS;
