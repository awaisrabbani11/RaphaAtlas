const fs = require('fs');

// Create the 4 asset files
const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"
     role="img" aria-label="RaphaAtlas">
  <path fill="none" stroke="#2F4A6D" stroke-width="4" stroke-linecap="round" d="M32,6 A26,26 0 0,0 32,58"/>
  <path fill="none" stroke="#5C7F3E" stroke-width="4" stroke-linecap="round" d="M32,6 A26,26 0 0,1 32,58"/>
  <path fill="#2F4A6D" d="M28,50 L32,60 L36,50 Z"/>
  <path fill="none" stroke="#2F4A6D" stroke-width="4" stroke-linecap="round" d="M32,15 V52"/>
  <circle fill="#2F4A6D" cx="32" cy="12" r="4"/>
  <path fill="none" stroke="#5C7F3E" stroke-width="3.6" stroke-linecap="round"
        d="M27,50 C39,44 39,37 28,32 C17,27 17,20 30,15"/>
</svg>`;
fs.writeFileSync('public/raphaatlas-favicon.svg', svgFavicon);
fs.writeFileSync('raphaatlas-favicon.svg', svgFavicon);

const svgMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240"
     role="img" aria-label="RaphaAtlas">
    <g clip-path="url(#raGlobeClip)">
      <path fill="#5C7F3E" d="M40,58 C51,47 70,47 79,56 C85,63 79,71 71,75 C62,81 53,85 47,81 C39,74 34,65 40,58 Z"/>
      <path fill="#2F4A6D" d="M70,136 C79,132 85,142 83,155 C81,171 74,190 67,187 C61,184 63,167 65,155 C66,146 65,139 70,136 Z"/>
      <path fill="#2F4A6D" d="M150,50 C165,45 182,52 190,63 C195,70 186,78 176,80 C163,83 151,78 147,69 C143,62 144,53 150,50 Z"/>
      <path fill="#5C7F3E" d="M152,102 C166,97 180,107 181,121 C183,138 171,158 160,167 C153,172 148,167 147,157 C145,142 141,125 145,114 C147,107 149,103 152,102 Z"/>
      <path fill="#2F4A6D" d="M180,148 C188,146 193,152 190,158 C187,164 179,164 176,159 C174,154 176,149 180,148 Z"/>
    </g>
    <g fill="#F5F4EF" stroke="#F5F4EF" stroke-width="9" stroke-linejoin="round" stroke-linecap="round">
      <path d="M113,196 L120,222 L127,196 Z"/>
      <path d="M120,60 V198"/>
      <circle cx="120" cy="50" r="8.5"/>
      <path d="M118,92 C106,76 92,68 78,66 C80,81 94,93 116,96 Z"/>
      <path d="M122,92 C134,76 148,68 162,66 C160,81 146,93 124,96 Z"/>
      <path fill="none" d="M104,206 C130,194 130,176 106,164 C82,152 82,134 106,124 C120,120 130,120 136,114"/>
      <circle cx="138" cy="112" r="5"/>
    </g>
    <path fill="none" stroke="#2F4A6D" stroke-width="5" stroke-linecap="round" d="M120,20 A100,100 0 0,0 120,220"/>
    <path fill="none" stroke="#5C7F3E" stroke-width="5" stroke-linecap="round" d="M120,20 A100,100 0 0,1 120,220"/>
    <g fill="none" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="#C4A05A" d="M20,111 L8,99 L8,84"/>
      <path stroke="#C4A05A" d="M26,154 L12,168 L12,186"/>
      <path stroke="#5C7F3E" d="M49,191 L40,200 L22,200"/>
      <path stroke="#5C7F3E" d="M197,56 L210,43 L232,43"/>
      <path stroke="#C4A05A" d="M218,103 L230,91 L230,74"/>
      <path stroke="#C4A05A" d="M211,162 L224,175 L232,175"/>
      <path stroke="#5C7F3E" d="M184,197 L196,209 L214,209"/>
    </g>
    <g fill="#F5F4EF" stroke-width="3.4">
      <circle cx="8"   cy="84"  r="5.5" stroke="#C4A05A"/>
      <circle cx="12"  cy="186" r="5.5" stroke="#C4A05A"/>
      <circle cx="22"  cy="200" r="5.5" stroke="#5C7F3E"/>
      <circle cx="232" cy="43"  r="5.5" stroke="#5C7F3E"/>
      <circle cx="230" cy="74"  r="5.5" stroke="#C4A05A"/>
      <circle cx="232" cy="175" r="5.5" stroke="#C4A05A"/>
      <circle cx="214" cy="209" r="5.5" stroke="#5C7F3E"/>
    </g>
    <path fill="#2F4A6D" d="M113,196 L120,222 L127,196 Z"/>
    <path fill="none" stroke="#2F4A6D" stroke-width="7" stroke-linecap="round" d="M120,60 V198"/>
    <circle fill="#2F4A6D" cx="120" cy="50" r="8.5"/>
    <path fill="#2F4A6D" d="M118,92 C106,76 92,68 78,66 C80,81 94,93 116,96 Z"/>
    <path fill="#5C7F3E" d="M122,92 C134,76 148,68 162,66 C160,81 146,93 124,96 Z"/>
    <path fill="none" stroke="#5C7F3E" stroke-width="6" stroke-linecap="round"
          d="M104,206 C130,194 130,176 106,164 C82,152 82,134 106,124 C120,120 130,120 136,114"/>
    <circle fill="#5C7F3E" cx="138" cy="112" r="5"/>
  <defs><clipPath id="raGlobeClip"><circle cx="120" cy="120" r="97"/></clipPath></defs>
</svg>`;
fs.writeFileSync('public/raphaatlas-mark.svg', svgMark);
fs.writeFileSync('raphaatlas-mark.svg', svgMark);

const svgLockup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" width="640" height="400"
     role="img" aria-labelledby="ra-title ra-desc">
  <title id="ra-title">RaphaAtlas</title>
  <desc id="ra-desc">A globe encircling a rod of Asclepius wired to circuit traces, above the RaphaAtlas wordmark.</desc>
  <g transform="translate(200,16)">
    <g clip-path="url(#raGlobeClip)">
      <path fill="#5C7F3E" d="M40,58 C51,47 70,47 79,56 C85,63 79,71 71,75 C62,81 53,85 47,81 C39,74 34,65 40,58 Z"/>
      <path fill="#2F4A6D" d="M70,136 C79,132 85,142 83,155 C81,171 74,190 67,187 C61,184 63,167 65,155 C66,146 65,139 70,136 Z"/>
      <path fill="#2F4A6D" d="M150,50 C165,45 182,52 190,63 C195,70 186,78 176,80 C163,83 151,78 147,69 C143,62 144,53 150,50 Z"/>
      <path fill="#5C7F3E" d="M152,102 C166,97 180,107 181,121 C183,138 171,158 160,167 C153,172 148,167 147,157 C145,142 141,125 145,114 C147,107 149,103 152,102 Z"/>
      <path fill="#2F4A6D" d="M180,148 C188,146 193,152 190,158 C187,164 179,164 176,159 C174,154 176,149 180,148 Z"/>
    </g>
    <g fill="#F5F4EF" stroke="#F5F4EF" stroke-width="9" stroke-linejoin="round" stroke-linecap="round">
      <path d="M113,196 L120,222 L127,196 Z"/>
      <path d="M120,60 V198"/>
      <circle cx="120" cy="50" r="8.5"/>
      <path d="M118,92 C106,76 92,68 78,66 C80,81 94,93 116,96 Z"/>
      <path d="M122,92 C134,76 148,68 162,66 C160,81 146,93 124,96 Z"/>
      <path fill="none" d="M104,206 C130,194 130,176 106,164 C82,152 82,134 106,124 C120,120 130,120 136,114"/>
      <circle cx="138" cy="112" r="5"/>
    </g>
    <path fill="none" stroke="#2F4A6D" stroke-width="5" stroke-linecap="round" d="M120,20 A100,100 0 0,0 120,220"/>
    <path fill="none" stroke="#5C7F3E" stroke-width="5" stroke-linecap="round" d="M120,20 A100,100 0 0,1 120,220"/>
    <g fill="none" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="#C4A05A" d="M20,111 L8,99 L8,84"/>
      <path stroke="#C4A05A" d="M26,154 L12,168 L12,186"/>
      <path stroke="#5C7F3E" d="M49,191 L40,200 L22,200"/>
      <path stroke="#5C7F3E" d="M197,56 L210,43 L232,43"/>
      <path stroke="#C4A05A" d="M218,103 L230,91 L230,74"/>
      <path stroke="#C4A05A" d="M211,162 L224,175 L232,175"/>
      <path stroke="#5C7F3E" d="M184,197 L196,209 L214,209"/>
    </g>
    <g fill="#F5F4EF" stroke-width="3.4">
      <circle cx="8"   cy="84"  r="5.5" stroke="#C4A05A"/>
      <circle cx="12"  cy="186" r="5.5" stroke="#C4A05A"/>
      <circle cx="22"  cy="200" r="5.5" stroke="#5C7F3E"/>
      <circle cx="232" cy="43"  r="5.5" stroke="#5C7F3E"/>
      <circle cx="230" cy="74"  r="5.5" stroke="#C4A05A"/>
      <circle cx="232" cy="175" r="5.5" stroke="#C4A05A"/>
      <circle cx="214" cy="209" r="5.5" stroke="#5C7F3E"/>
    </g>
    <path fill="#2F4A6D" d="M113,196 L120,222 L127,196 Z"/>
    <path fill="none" stroke="#2F4A6D" stroke-width="7" stroke-linecap="round" d="M120,60 V198"/>
    <circle fill="#2F4A6D" cx="120" cy="50" r="8.5"/>
    <path fill="#2F4A6D" d="M118,92 C106,76 92,68 78,66 C80,81 94,93 116,96 Z"/>
    <path fill="#5C7F3E" d="M122,92 C134,76 148,68 162,66 C160,81 146,93 124,96 Z"/>
    <path fill="none" stroke="#5C7F3E" stroke-width="6" stroke-linecap="round"
          d="M104,206 C130,194 130,176 106,164 C82,152 82,134 106,124 C120,120 130,120 136,114"/>
    <circle fill="#5C7F3E" cx="138" cy="112" r="5"/>
  </g>
  <text x="320" y="322" text-anchor="middle"
        font-family="Archivo, Inter, 'Helvetica Neue', Arial, sans-serif"
        font-weight="700" font-size="50" letter-spacing="1.5">
    <tspan fill="#2F4A6D">RAPHA</tspan><tspan fill="#5C7F3E">ATLAS</tspan>
  </text>
  <text x="320" y="352" text-anchor="middle" fill="#2F4A6D" fill-opacity="0.78"
        font-family="Inter, 'Helvetica Neue', Arial, sans-serif"
        font-weight="500" font-size="12.5" letter-spacing="3">THE COMPLETE MAP OF HEALING &amp; HEALTH AI</text>
  <defs><clipPath id="raGlobeClip"><circle cx="120" cy="120" r="97"/></clipPath></defs>
</svg>`;
fs.writeFileSync('public/raphaatlas-lockup.svg', svgLockup);
fs.writeFileSync('raphaatlas-lockup.svg', svgLockup);

// JSX File is already existing, let's overwrite it
const jsxCode = `import { useId } from "react";

/**
 * RaphaAtlas logo.
 *
 * <RaphaAtlasLogo variant="lockup" height={72} />
 * <RaphaAtlasLogo variant="mark" size={40} />
 * <RaphaAtlasLogo variant="favicon" size={16} />
 * <RaphaAtlasLogo serpents={2} />        // twin-serpent (caduceus) version
 * <RaphaAtlasLogo mono="#2F4A6D" />      // one-colour build for dark headers / print
 */
export default function RaphaAtlasLogo({
  variant = "lockup",
  serpents = 1,
  size,
  height,
  navy = "#2F4A6D",
  green = "#5C7F3E",
  gold = "#C4A05A",
  paper = "#F5F4EF",
  mono,
  title = "RaphaAtlas",
  ...rest
}) {
  const clip = useId();
  const c = mono
    ? { navy: mono, green: mono, gold: mono, paper }
    : { navy, green, gold, paper };

  if (variant === "favicon") {
    const s = size ?? 32;
    return (
      <svg viewBox="0 0 64 64" width={s} height={s} role="img" aria-label={title} {...rest}>
        <path fill="none" stroke={c.navy} strokeWidth="4" strokeLinecap="round" d="M32,6 A26,26 0 0,0 32,58" />
        <path fill="none" stroke={c.green} strokeWidth="4" strokeLinecap="round" d="M32,6 A26,26 0 0,1 32,58" />
        <path fill={c.navy} d="M28,50 L32,60 L36,50 Z" />
        <path fill="none" stroke={c.navy} strokeWidth="4" strokeLinecap="round" d="M32,15 V52" />
        <circle fill={c.navy} cx="32" cy="12" r="4" />
        <path fill="none" stroke={c.green} strokeWidth="3.6" strokeLinecap="round"
              d="M27,50 C39,44 39,37 28,32 C17,27 17,20 30,15" />
        {serpents === 2 && (
          <path fill="none" stroke={c.green} strokeWidth="3.6" strokeLinecap="round"
                d="M37,50 C25,44 25,37 36,32 C47,27 47,20 34,15" />
        )}
      </svg>
    );
  }

  const isLockup = variant === "lockup";
  const box = isLockup ? "0 0 640 400" : "0 0 240 240";
  const dims = isLockup
    ? { height: height ?? 100, width: (height ?? 100) * 1.6 }
    : { width: size ?? 96, height: size ?? 96 };

  const SERPENT_A = "M104,206 C130,194 130,176 106,164 C82,152 82,134 106,124 C120,120 130,120 136,114";
  const SERPENT_B = "M136,206 C110,194 110,176 134,164 C158,152 158,134 134,124 C120,120 110,120 104,114";

  const rod = (
    <>
      <path d="M113,196 L120,222 L127,196 Z" />
      <path d="M120,60 V198" />
      <circle cx="120" cy="50" r="8.5" />
      <path d="M118,92 C106,76 92,68 78,66 C80,81 94,93 116,96 Z" />
      <path d="M122,92 C134,76 148,68 162,66 C160,81 146,93 124,96 Z" />
      <path fill="none" d={SERPENT_A} />
      <circle cx="138" cy="112" r="5" />
      {serpents === 2 && (
        <>
          <path fill="none" d={SERPENT_B} />
          <circle cx="102" cy="112" r="5" />
        </>
      )}
    </>
  );

  return (
    <svg viewBox={box} {...dims} role="img" aria-label={title} {...rest}>
      <g transform={isLockup ? "translate(200,16)" : undefined}>
        <g clipPath={\`url(#\${clip})\`}>
          <path fill={c.green} d="M40,58 C51,47 70,47 79,56 C85,63 79,71 71,75 C62,81 53,85 47,81 C39,74 34,65 40,58 Z" />
          <path fill={c.navy} d="M70,136 C79,132 85,142 83,155 C81,171 74,190 67,187 C61,184 63,167 65,155 C66,146 65,139 70,136 Z" />
          <path fill={c.navy} d="M150,50 C165,45 182,52 190,63 C195,70 186,78 176,80 C163,83 151,78 147,69 C143,62 144,53 150,50 Z" />
          <path fill={c.green} d="M152,102 C166,97 180,107 181,121 C183,138 171,158 160,167 C153,172 148,167 147,157 C145,142 141,125 145,114 C147,107 149,103 152,102 Z" />
          <path fill={c.navy} d="M180,148 C188,146 193,152 190,158 C187,164 179,164 176,159 C174,154 176,149 180,148 Z" />
        </g>
        <g fill={c.paper} stroke={c.paper} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round">
          {rod}
        </g>
        <path fill="none" stroke={c.navy} strokeWidth="5" strokeLinecap="round" d="M120,20 A100,100 0 0,0 120,220" />
        <path fill="none" stroke={c.green} strokeWidth="5" strokeLinecap="round" d="M120,20 A100,100 0 0,1 120,220" />
        <g fill="none" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
          <path stroke={c.gold} d="M20,111 L8,99 L8,84" />
          <path stroke={c.gold} d="M26,154 L12,168 L12,186" />
          <path stroke={c.green} d="M49,191 L40,200 L22,200" />
          <path stroke={c.green} d="M197,56 L210,43 L232,43" />
          <path stroke={c.gold} d="M218,103 L230,91 L230,74" />
          <path stroke={c.gold} d="M211,162 L224,175 L232,175" />
          <path stroke={c.green} d="M184,197 L196,209 L214,209" />
        </g>
        <g fill={c.paper} strokeWidth="3.4">
          <circle cx="8" cy="84" r="5.5" stroke={c.gold} />
          <circle cx="12" cy="186" r="5.5" stroke={c.gold} />
          <circle cx="22" cy="200" r="5.5" stroke={c.green} />
          <circle cx="232" cy="43" r="5.5" stroke={c.green} />
          <circle cx="230" cy="74" r="5.5" stroke={c.gold} />
          <circle cx="232" cy="175" r="5.5" stroke={c.gold} />
          <circle cx="214" cy="209" r="5.5" stroke={c.green} />
        </g>
        <path fill={c.navy} d="M113,196 L120,222 L127,196 Z" />
        <path fill="none" stroke={c.navy} strokeWidth="7" strokeLinecap="round" d="M120,60 V198" />
        <circle fill={c.navy} cx="120" cy="50" r="8.5" />
        <path fill={c.navy} d="M118,92 C106,76 92,68 78,66 C80,81 94,93 116,96 Z" />
        <path fill={c.green} d="M122,92 C134,76 148,68 162,66 C160,81 146,93 124,96 Z" />
        <path fill="none" stroke={c.green} strokeWidth="6" strokeLinecap="round" d={SERPENT_A} />
        <circle fill={c.green} cx="138" cy="112" r="5" />
        {serpents === 2 && (
          <>
            <path fill="none" stroke={c.navy} strokeWidth="6" strokeLinecap="round" d={SERPENT_B} />
            <circle fill={c.navy} cx="102" cy="112" r="5" />
          </>
        )}
      </g>
      {isLockup && (
        <>
          <text x="320" y="322" textAnchor="middle"
                fontFamily="Archivo, Inter, 'Helvetica Neue', Arial, sans-serif"
                fontWeight="700" fontSize="50" letterSpacing="1.5">
            <tspan fill={c.navy}>RAPHA</tspan>
            <tspan fill={c.green}>ATLAS</tspan>
          </text>
          <text x="320" y="352" textAnchor="middle" fill={c.navy} fillOpacity="0.78"
                fontFamily="Inter, 'Helvetica Neue', Arial, sans-serif"
                fontWeight="500" fontSize="12.5" letterSpacing="3">
            THE COMPLETE MAP OF HEALING &amp; HEALTH AI
          </text>
        </>
      )}
      <defs>
        <clipPath id={clip}><circle cx="120" cy="120" r="97" /></clipPath>
      </defs>
    </svg>
  );
}
`;
fs.writeFileSync('src/components/RaphaAtlasLogo.jsx', jsxCode);

// Read index.html and update the requested parts
let idx = fs.readFileSync('index.html', 'utf8');

// 1. Add favicon and font links
if (!idx.includes('<link rel="icon" type="image/svg+xml"')) {
  idx = idx.replace('</head>', `
<link rel="icon" type="image/svg+xml" href="/raphaatlas-favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700&family=Inter:wght@500&display=swap" rel="stylesheet" />
</head>`);
}

// 2. Fix Hero Section
// Background Color: Change `bg-header-black` to `bg-[#2F4A6D]`
idx = idx.replace(/<section class="relative min-h-\[80vh\] flex items-center bg-header-black overflow-hidden border-b border-border-subtle">/,
  '<section class="relative min-h-[80vh] flex items-center bg-[#2F4A6D] overflow-hidden border-b border-border-subtle">');

// Hero H1
idx = idx.replace(/<h1 class="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg font-black tracking-tight text-on-primary">[\s\S]*?<\/h1>/,
  '<h1 class="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg font-black tracking-tight text-[#F5F4EF]">A Complete Guide To Health</h1>');

// Remove Paragraph
idx = idx.replace(/<p class="font-body-lg text-body-lg text-on-primary opacity-90 max-w-xl mx-auto md:mx-0">[\s\S]*?<\/p>/, '');

// Buttons -> Just one button for Calculators
idx = idx.replace(/<div class="pt-4 flex flex-col sm:flex-row items-center sm:justify-start gap-4 justify-center">[\s\S]*?<\/div>\s*<\/div>\s*<!-- Hero Imagery -->/,
  `<div class="pt-4 flex flex-col sm:flex-row items-center sm:justify-start gap-4 justify-center">
<a class="inline-flex items-center justify-center bg-[#C4A05A] text-[#F5F4EF] font-label-bold text-label-bold rounded-full px-8 py-4 hover:bg-opacity-90 transition-transform hover:scale-105 shadow-lg w-full sm:w-auto" href="/calculators">Explore Calculators</a>
</div></div><!-- Hero Imagery -->`);

// Wait, the color of the "pulse" in the background webgl is currently:
// vec3 color2 = vec3(0.01, 0.51, 0.55); // vitality-teal vibe
// I'll change it to the navy or green from the logo #5C7F3E -> 0.36, 0.50, 0.24
idx = idx.replace(/vec3 color2 = vec3\(0\.01, 0\.51, 0\.55\); \/\/ vitality-teal vibe/,
  'vec3 color2 = vec3(0.36, 0.50, 0.24); // #5C7F3E green vibe');

// Wait, since I'm placing it over `#2F4A6D`, the WebGL uses `color1 = white`, `color2 = ...` and blends them. 
// If the background is navy, maybe we just leave it or let WebGL overlay. The WebGL `gl_FragColor` will completely overwrite the CSS background if it isn't transparent. Wait, the `<canvas>` has `opacity:0.4` so CSS background shows through.

fs.writeFileSync('index.html', idx);
console.log('index.html fixed');

// Fix footers and headers to use the new lockup where needed
const allFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const f of allFiles) {
  let content = fs.readFileSync(f, 'utf8');
  // Add favicon if not there
  if (!content.includes('raphaatlas-favicon.svg')) {
    content = content.replace('</head>', `
<link rel="icon" type="image/svg+xml" href="/raphaatlas-favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700&family=Inter:wght@500&display=swap" rel="stylesheet" />
</head>`);
  }
  
  // Replace the footer lockup text:
  // The footer currently has:
  // <img src="/raphaatlas-mark.svg" alt="RaphaAtlas" height="50" width="50" class="h-12 w-12">  <span style="font-family: 'Inter', sans-serif; font-size: 36px; font-weight: 900; letter-spacing: -1px; color: white; margin-left: 14px; transform: translateY(2px);">RaphaAtlas</span>
  // The prompt says "Footer, About, and author-bio pages use the full lockup: <RaphaAtlasLogo variant="lockup" height={90} />"
  // Since it's raw HTML, I'll replace it with an image tag to lockup.
  content = content.replace(
    /<a href="\/" class="flex items-center mb-2">\s*<img src="\/raphaatlas-mark\.svg" alt="RaphaAtlas" height="50" width="50" class="h-12 w-12">\s*<span style="font-family: 'Inter', sans-serif; font-size: 36px; font-weight: 900; letter-spacing: -1px; color: white; margin-left: 14px; transform: translateY\(2px\);">RaphaAtlas<\/span>\s*<\/a>/g,
    `<a href="/" class="flex items-center mb-2"><img src="/raphaatlas-lockup.svg" alt="RaphaAtlas" height="90" style="height:90px; width:auto;"></a>`
  );
  
  fs.writeFileSync(f, content);
}
console.log('all htmls fixed');
