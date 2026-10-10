// One-off generator for public/og-image.png — run with `node scripts/generate-og-image.mjs`.
// Not part of the build; the PNG it produces is committed as a static asset
// since it never needs to change unless the brand mark/copy does.
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '..', 'public', 'og-image.png');

const W = 1200;
const H = 630;

// The faceted-ring mark from public/logo.svg, scaled down and recentered
// inside this card (original viewBox is 0 0 648 648).
const LOGO_SCALE = 0.34;
const LOGO_SIZE = 648 * LOGO_SCALE;
const LOGO_X = 120;
const LOGO_Y = (H - LOGO_SIZE) / 2;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="15%" cy="10%" r="90%">
      <stop offset="0%" stop-color="#a3242a"/>
      <stop offset="55%" stop-color="#8d1b20"/>
      <stop offset="100%" stop-color="#5f1216"/>
    </radialGradient>
    <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1000" cy="80" r="260" fill="url(#glow1)"/>
  <circle cx="60" cy="560" r="220" fill="url(#glow1)"/>

  <!-- white tile behind the mark, same treatment as the install-section mockup -->
  <rect x="${LOGO_X - 36}" y="${LOGO_Y - 36}" width="${LOGO_SIZE + 72}" height="${LOGO_SIZE + 72}" rx="40" fill="#ffffff"/>
  <g transform="translate(${LOGO_X}, ${LOGO_Y}) scale(${LOGO_SCALE})">
    <g>
      <polygon fill="#8d1b20" points="159.05 83.36 323.17 138.07 323.17 19 159.05 83.36"/>
      <polygon fill="#8d1b20" points="97.91 105.89 126.87 93.02 303.86 150.94 197.67 208.87 97.91 105.89"/>
      <polygon fill="#8d1b20" points="88.25 125.2 88.25 315.06 181.58 273.23 184.8 224.96 88.25 125.2"/>
      <path fill="#8d1b20" d="M88.25,337.59l96.54-45.05s16.09,77.23,41.84,99.76l-135.16,25.74-3.22-80.45Z"/>
      <polygon fill="#8d1b20" points="107.56 437.35 229.85 543.55 226.63 418.04 107.56 437.35"/>
      <path fill="#8d1b20" d="M245.94,418.04s35.4,38.62,80.45,64.36v141.6l-77.23-67.58-3.22-138.38Z"/>
      <polygon fill="#8d1b20" points="511.43 83.36 347.31 138.07 347.31 19 511.43 83.36"/>
      <polygon fill="#8d1b20" points="572.58 105.89 543.61 93.02 366.62 150.94 472.81 208.87 572.58 105.89"/>
      <polygon fill="#8d1b20" points="582.23 125.2 582.23 315.06 488.9 273.23 485.69 224.96 582.23 125.2"/>
      <path fill="#8d1b20" d="M582.23,337.59l-96.54-45.05s-16.09,77.23-41.84,99.76l135.16,25.74,3.22-80.45Z"/>
      <polygon fill="#8d1b20" points="562.92 437.35 440.63 543.55 443.85 418.04 562.92 437.35"/>
      <path fill="#8d1b20" d="M424.54,418.04s-35.4,38.62-80.45,64.36v141.6s77.23-67.58,77.23-67.58l3.22-138.38Z"/>
    </g>
    <g>
      <circle fill="#4b4b4b" cx="358.57" cy="244.27" r="17.7"/>
      <path fill="#4b4b4b" d="M373.6,258.81c-3.8,3.93-9.14,6.37-15.03,6.37-2.99,0-5.82-.64-8.4-1.77-2.25-.97-4.31-2.35-6.08-4.05v4.51c1.83.19,3.64.55,5.41.97,18.15,4.6,31.6,21.05,31.6,40.58,0,23.07-18.76,41.84-41.84,41.84-14.1,0-26.58-6.98-34.14-17.7h-18.5c9.14,19.92,29.32,33.79,52.65,33.79,31.96,0,57.93-25.97,57.93-57.93,0-19.12-9.27-36.07-23.59-46.6Z"/>
      <path fill="#4b4b4b" d="M373.5,214.76l-5.25,10.97c-2.9-1.51-6.18-2.38-9.69-2.38-11.55,0-20.92,9.36-20.92,20.92,0,1.09.1,2.19.26,3.25,1.09,7.14,5.82,13.1,12.26,15.9l-.68,1.42-7.27,15.16-23.23-11.13-10.59-5.08,4.83-10.07,26.48-55.16,33.79,16.22Z"/>
      <rect fill="#4b4b4b" x="348.55" y="193.08" width="18.68" height="24.49" transform="translate(124.06 -134.63) rotate(25.64)"/>
      <rect fill="#4b4b4b" x="350.31" y="182.64" width="31.68" height="9.34" transform="translate(117.08 -139.98) rotate(25.64)"/>
      <rect fill="#4b4b4b" x="298.33" y="274.92" width="44.56" height="9.97" transform="translate(152.66 -111.16) rotate(25.64)"/>
      <rect fill="#4b4b4b" x="302.52" y="286.87" width="25.88" height="9.97" transform="translate(157.32 -107.75) rotate(25.64)"/>
      <rect fill="#4b4b4b" x="266.86" y="316.67" width="74.02" height="9.65"/>
      <path fill="#4b4b4b" d="M403.63,386.63v7.27h-130.33v-7.27c0-5.76,4.67-10.43,10.43-10.43h109.48c5.76,0,10.43,4.67,10.43,10.43Z"/>
      <rect fill="#4b4b4b" x="321.56" y="358.51" width="38.62" height="22.53"/>
    </g>
  </g>

  <text x="430" y="275" font-family="Georgia, 'Times New Roman', serif" font-size="68" font-weight="700" fill="#ffffff">Trusted</text>
  <text x="430" y="340" font-family="Georgia, 'Times New Roman', serif" font-size="68" font-weight="700" fill="#ffffff">Gemological</text>
  <text x="430" y="405" font-family="Georgia, 'Times New Roman', serif" font-size="68" font-weight="700" fill="#ffffff">Laboratory</text>
  <text x="432" y="455" font-family="Arial, Helvetica, sans-serif" font-size="23" letter-spacing="2" fill="#f4d9da">CERTIFIED &#183; REWARDED &#183; VERIFIED</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile(outPath);
writeFileSync(outPath.replace('.png', '.svg'), svg.trim());
console.log('Wrote', outPath);
