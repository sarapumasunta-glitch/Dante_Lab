/* DANTE LAB · personajes del T-Rex comelón */
/* Sprites vectoriales propios del T-Rex comelón (se ven igual en cualquier celular) */
window.TREX_SPRITES = (function(){
  const O='#2d4a12';           // contorno
  const trex = (piernas, boca) => {
    const [l1,l2] = piernas ? [['22','44','16','58'],['34','44','40','58']] : [['22','44','26','58'],['34','44','30','58']];
    const mandibula = boca
      ? `<g transform="rotate(28 40 27)"><rect x="38" y="25" width="21" height="8" rx="3.5" fill="#8ec84a" stroke="${O}" stroke-width="2.5"/><path d="M42 25 l2 -3 l2 3 M48 25 l2 -3 l2 3 M54 25 l2 -3 l2 3" fill="#fff" stroke="#fff" stroke-width="1"/></g><path d="M38 26 q10 14 21 3" fill="#c0304a"/>`
      : `<rect x="38" y="25" width="21" height="7" rx="3.5" fill="#8ec84a" stroke="${O}" stroke-width="2.5"/><path d="M42 25 l2 3 l2 -3 M48 25 l2 3 l2 -3 M54 25 l2 3 l2 -3" fill="#fff"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128">
      <path d="M4 30 Q14 30 20 36 L16 44 Q8 40 4 30Z" fill="#7ab83a" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="${l1[0]}" y1="${l1[1]}" x2="${l1[2]}" y2="${l1[3]}" stroke="${O}" stroke-width="7" stroke-linecap="round"/>
      <line x1="${l1[0]}" y1="${l1[1]}" x2="${l1[2]}" y2="${l1[3]}" stroke="#6aa82a" stroke-width="4" stroke-linecap="round"/>
      <line x1="${l2[0]}" y1="${l2[1]}" x2="${l2[2]}" y2="${l2[3]}" stroke="${O}" stroke-width="7" stroke-linecap="round"/>
      <line x1="${l2[0]}" y1="${l2[1]}" x2="${l2[2]}" y2="${l2[3]}" stroke="#7ab83a" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="28" cy="36" rx="15" ry="12" fill="#7ab83a" stroke="${O}" stroke-width="2.5"/>
      <ellipse cx="31" cy="40" rx="9" ry="6" fill="#d8ec9a"/>
      <path d="M22 28 l3 -4 l3 4 l3 -4 l3 4" fill="#e0a02a" stroke="${O}" stroke-width="1.5" stroke-linejoin="round"/>
      ${mandibula}
      <rect x="33" y="11" width="27" height="17" rx="8" fill="#8ec84a" stroke="${O}" stroke-width="2.5"/>
      <circle cx="49" cy="17" r="4" fill="#fff" stroke="${O}" stroke-width="1.5"/><circle cx="50.5" cy="17" r="2.2" fill="#1a1a1a"/><circle cx="51.2" cy="16.2" r=".8" fill="#fff"/>
      <circle cx="57" cy="15" r="1.2" fill="${O}"/>
      <path d="M40 37 l6 3" stroke="${O}" stroke-width="4.5" stroke-linecap="round"/><path d="M40 37 l6 3" stroke="#8ec84a" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  };
  const raptor = piernas => {
    const L = piernas ? 'M24 42 L18 56 M34 42 L40 56' : 'M24 42 L28 56 M34 42 L30 56';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128">
      <path d="${L}" stroke="#1a4a5a" stroke-width="6" stroke-linecap="round"/><path d="${L}" stroke="#3ab0c0" stroke-width="3" stroke-linecap="round"/>
      <path d="M4 26 Q14 30 20 34 L18 40 Q8 34 4 26Z" fill="#3ab0c0" stroke="#1a4a5a" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="29" cy="36" rx="12" ry="9" fill="#3ab0c0" stroke="#1a4a5a" stroke-width="2.5"/>
      <path d="M22 28 q4 -8 8 -2 q3 -7 7 -1" fill="#ff8c1a" stroke="#1a4a5a" stroke-width="1.5"/>
      <path d="M36 32 Q42 18 52 20 Q60 22 58 28 L44 30Z" fill="#4ac8d8" stroke="#1a4a5a" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="51" cy="23" r="3" fill="#fff"/><circle cx="52" cy="23" r="1.6" fill="#1a1a1a"/>
      <path d="M36 38 l5 4" stroke="#1a4a5a" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`;
  };
  const meteoro = hielo => hielo
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128">
        <path d="M32 6 L52 18 L56 40 L40 58 L18 54 L8 34 L14 14Z" fill="#9ae0ff" stroke="#2a7ab0" stroke-width="3" stroke-linejoin="round"/>
        <path d="M20 18 L30 12 M16 30 L22 24" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
        <path d="M32 6 L32 58 M8 34 L56 40" stroke="#ffffff88" stroke-width="1.5"/>
        <circle cx="26" cy="36" r="3" fill="#1a3a5a"/><circle cx="38" cy="36" r="3" fill="#1a3a5a"/>
        <path d="M27 45 q5 -3 10 0" stroke="#1a3a5a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128">
        <circle cx="34" cy="34" r="22" fill="#8a5a3a" stroke="#3a2010" stroke-width="3"/>
        <circle cx="26" cy="26" r="6" fill="#6a4028"/><circle cx="42" cy="44" r="5" fill="#6a4028"/><circle cx="44" cy="26" r="3.5" fill="#6a4028"/>
        <path d="M18 22 q6 -8 14 -8" stroke="#c08a5a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M24 34 l5 3 M44 34 l-5 3" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/>
        <circle cx="29" cy="39" r="2.5" fill="#ffd23f"/><circle cx="39" cy="39" r="2.5" fill="#ffd23f"/>
        <path d="M29 48 q5 -4 10 0" stroke="#1a0a00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </svg>`;
  const hueso = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64">
      <g transform="rotate(-30 16 16)"><rect x="8" y="13" width="16" height="6" rx="3" fill="#fff4dc" stroke="#b09060" stroke-width="1.5"/>
      <circle cx="8" cy="13" r="3.6" fill="#fff4dc" stroke="#b09060" stroke-width="1.5"/><circle cx="8" cy="19" r="3.6" fill="#fff4dc" stroke="#b09060" stroke-width="1.5"/>
      <circle cx="24" cy="13" r="3.6" fill="#fff4dc" stroke="#b09060" stroke-width="1.5"/><circle cx="24" cy="19" r="3.6" fill="#fff4dc" stroke="#b09060" stroke-width="1.5"/>
      <rect x="8" y="13.8" width="16" height="4.4" fill="#fff4dc"/></g></svg>`;
  const carne = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128">
      <path d="M40 40 L54 54" stroke="#b09060" stroke-width="8" stroke-linecap="round"/><path d="M40 40 L54 54" stroke="#fff4dc" stroke-width="5" stroke-linecap="round"/>
      <circle cx="55" cy="51" r="4" fill="#fff4dc" stroke="#b09060" stroke-width="1.5"/><circle cx="51" cy="56" r="4" fill="#fff4dc" stroke="#b09060" stroke-width="1.5"/>
      <ellipse cx="28" cy="28" rx="20" ry="17" transform="rotate(-40 28 28)" fill="#c0502a" stroke="#6a2010" stroke-width="3"/>
      <ellipse cx="24" cy="23" rx="9" ry="6" transform="rotate(-40 24 23)" fill="#e07a4a"/>
    </svg>`;
  const estrella = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64"><path d="M16 2 L20 12 L31 12 L22 19 L25 30 L16 23 L7 30 L10 19 L1 12 L12 12Z" fill="#ffd23f" stroke="#e0a010" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  const chispa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="32" height="32"><circle cx="8" cy="8" r="7" fill="#ffffff"/></svg>`;
  return {
    trex0:trex(0,0), trex1:trex(1,0), trex2:trex(0,1), trex3:trex(1,1),
    raptor0:raptor(0), raptor1:raptor(1), meteoro:meteoro(0), hielo:meteoro(1),
    hueso, carne, estrella, chispa
  };
})();
