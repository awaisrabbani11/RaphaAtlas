import { useId } from "react";

/**
 * RaphaAtlas logo.
 *
 * <RaphaAtlasLogo variant="lockup" height={72} />
 * <RaphaAtlasLogo variant="mark" size={40} />
 * <RaphaAtlasLogo variant="favicon" size={16} />
 * <RaphaAtlasLogo serpents={2} />        // twin-serpent (caduceus) version
 * <RaphaAtlasLogo mono="#2F4A6D" />      // one-colour build for dark headers / print
 *
 * Notes
 * - clipPath id is generated per instance. Hardcoding it breaks the second
 *   instance on the page, because duplicate DOM ids make clip-path resolve
 *   to the first element and the landmasses disappear.
 * - `paper` must match the surface the logo sits on. It paints the knockout
 *   halo that separates the rod from the landmasses. On a dark header, pass
 *   paper="#0E1B26" or use mono.
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
        {/* landmasses */}
        <g clipPath={`url(#${clip})`}>
          <path fill={c.green} d="M40,58 C51,47 70,47 79,56 C85,63 79,71 71,75 C62,81 53,85 47,81 C39,74 34,65 40,58 Z" />
          <path fill={c.navy} d="M70,136 C79,132 85,142 83,155 C81,171 74,190 67,187 C61,184 63,167 65,155 C66,146 65,139 70,136 Z" />
          <path fill={c.navy} d="M150,50 C165,45 182,52 190,63 C195,70 186,78 176,80 C163,83 151,78 147,69 C143,62 144,53 150,50 Z" />
          <path fill={c.green} d="M152,102 C166,97 180,107 181,121 C183,138 171,158 160,167 C153,172 148,167 147,157 C145,142 141,125 145,114 C147,107 149,103 152,102 Z" />
          <path fill={c.navy} d="M180,148 C188,146 193,152 190,158 C187,164 179,164 176,159 C174,154 176,149 180,148 Z" />
        </g>

        {/* knockout halo — must render before the ring so the sphere stays unbroken */}
        <g fill={c.paper} stroke={c.paper} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round">
          {rod}
        </g>

        {/* sphere */}
        <path fill="none" stroke={c.navy} strokeWidth="5" strokeLinecap="round" d="M120,20 A100,100 0 0,0 120,220" />
        <path fill="none" stroke={c.green} strokeWidth="5" strokeLinecap="round" d="M120,20 A100,100 0 0,1 120,220" />

        {/* circuit traces */}
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

        {/* rod of Asclepius */}
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
