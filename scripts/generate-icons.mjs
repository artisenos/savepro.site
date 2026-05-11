import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Site logo: cyan-to-purple gradient rounded square with white download arrow
// Matches the Header/Footer: from-cyan-500 to-purple-600
const SVG_LOGO = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#06b6d4"/>
      <stop offset="100%" style="stop-color:#9333ea"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#g)"/>
  <g transform="translate(${size * 0.2}, ${size * 0.2})">
    <svg width="${size * 0.6}" height="${size * 0.6}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  </g>
</svg>`;

// Generate OG preview (1200x630) with logo + SavePro text
const OG_PREVIEW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient>
    <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#06b6d4"/>
      <stop offset="100%" style="stop-color:#9333ea"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Logo box -->
  <rect x="460" y="155" width="280" height="280" rx="56" fill="url(#logoBg)"/>
  <!-- Download icon -->
  <g transform="translate(524, 219)">
    <svg width="152" height="152" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  </g>
  <!-- Text -->
  <text x="600" y="520" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="64" font-weight="bold">SavePro</text>
  <text x="600" y="570" text-anchor="middle" fill="#94a3b8" font-family="Arial, sans-serif" font-size="28">Download TikTok Videos Without Watermark</text>
</svg>`;

async function generate() {
  const sizes = [16, 32, 48, 180];

  // Generate PNGs at each size
  for (const size of sizes) {
    const svg = SVG_LOGO(size);
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    const filename = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}x${size}.png`;
    writeFileSync(join(publicDir, filename), png);
    console.log(`Created ${filename} (${size}x${size})`);
  }

  // Generate favicon.ico (using 32x32 PNG as base)
  const favicon32 = await sharp(Buffer.from(SVG_LOGO(32))).png().toBuffer();
  writeFileSync(join(publicDir, 'favicon.ico'), favicon32);
  console.log('Created favicon.ico (32x32 PNG-based)');

  // Generate OG preview image (1200x630)
  const ogPng = await sharp(Buffer.from(OG_PREVIEW_SVG)).png().resize(1200, 630).toBuffer();
  writeFileSync(join(publicDir, 'og-preview.png'), ogPng);
  console.log('Created og-preview.png (1200x630)');

  // Update standalone SVG logo
  writeFileSync(join(publicDir, 'logo.svg'), SVG_LOGO(200));
  console.log('Updated public/logo.svg');
}

generate().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
