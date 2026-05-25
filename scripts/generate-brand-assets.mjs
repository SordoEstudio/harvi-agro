/**
 * Genera favicon, apple-touch-icon y OG image desde docs/13.png y docs/31.jpg
 * Uso: node scripts/generate-brand-assets.mjs
 */
import sharp from 'sharp';
import toIco from 'to-ico';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const publicDir = resolve(root, 'public');
const logoMark = resolve(root, 'docs/13.png');
const logoLight = resolve(root, 'docs/31.jpg');

const LIME = '#cbdf4a';
const BG = '#f7f7f7';
const DARK = '#203143';

/** Quita fondo negro del PNG de marca para iconos transparentes */
async function logoTransparent(size) {
  const { data, info } = await sharp(logoMark)
    .ensureAlpha()
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r < 40 && g < 40 && b < 40) data[i + 3] = 0;
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function squareIconBuffer(source, size, background) {
  const pad = Math.round(size * 0.12);
  const inner = size - pad * 2;
  const logo = await sharp(source)
    .resize(inner, inner, { fit: 'contain', background })
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: typeof background === 'string' ? background : { r: 247, g: 247, b: 247, alpha: 1 },
    },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function main() {
  // Apple touch 180×180
  writeFileSync(
    resolve(publicDir, 'apple-touch-icon.png'),
    await squareIconBuffer(logoLight, 180, BG),
  );
  console.log('✓ apple-touch-icon.png (180×180)');

  // PNG favicons
  const sizes = [16, 32, 48, 192];
  const icoBuffers = [];
  for (const s of sizes) {
    const buf = await (s <= 48 ? logoTransparent(s) : squareIconBuffer(logoLight, s, BG));
    if (s <= 48) icoBuffers.push(buf);
    if (s === 32) {
      writeFileSync(resolve(publicDir, 'favicon-32x32.png'), buf);
      console.log('✓ favicon-32x32.png');
    }
  }

  const faviconIco = await toIco(icoBuffers);
  writeFileSync(resolve(publicDir, 'favicon.ico'), faviconIco);
  console.log('✓ favicon.ico (16, 32, 48)');

  // favicon.svg con marca embebida (32px)
  const fav32 = await logoTransparent(32);
  const b64 = fav32.toString('base64');
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="Harvi Agro">
  <image width="32" height="32" href="data:image/png;base64,${b64}"/>
</svg>`;
  writeFileSync(resolve(publicDir, 'favicon.svg'), faviconSvg);
  console.log('✓ favicon.svg');

  // OG 1200×630
  const ogW = 1200;
  const ogH = 630;
  const logoOg = await sharp(logoLight)
    .resize(420, 420, { fit: 'contain', background: BG })
    .toBuffer();

  const textSvg = Buffer.from(`<svg width="${ogW}" height="${ogH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f7f7f7"/>
      <stop offset="100%" stop-color="#eef2e0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <circle cx="1050" cy="120" r="180" fill="${LIME}" opacity="0.15"/>
  <circle cx="150" cy="520" r="120" fill="${LIME}" opacity="0.12"/>
  <text x="520" y="280" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="800" fill="${DARK}">Harvi Agro</text>
  <text x="520" y="340" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="${DARK}" opacity="0.85">Plataforma GIS para análisis de trabajos de campo</text>
  <text x="520" y="400" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${DARK}" opacity="0.65">Solapamientos · Prescripción vs real · Informes PDF</text>
</svg>`);

  await sharp({
    create: { width: ogW, height: ogH, channels: 4, background: BG },
  })
    .composite([
      { input: logoOg, left: 48, top: Math.round((ogH - 420) / 2) },
      { input: textSvg, left: 0, top: 0 },
    ])
    .png()
    .toFile(resolve(publicDir, 'og-harviagro.png'));

  console.log('✓ og-harviagro.png (1200×630)');

  await sharp(resolve(publicDir, 'og-harviagro.png'))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(resolve(publicDir, 'og-harviagro.jpg'));

  console.log('✓ og-harviagro.jpg (versión liviana)');

  // PWA 192
  writeFileSync(resolve(publicDir, 'icon-192.png'), await squareIconBuffer(logoLight, 192, BG));
  console.log('✓ icon-192.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
