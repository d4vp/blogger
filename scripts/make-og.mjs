// Genera la imagen para compartir en redes (Open Graph, 1200×630): assets/og.png
// Uso: npm run og
import sharp from 'sharp';

const W = 1200, H = 630, AV = 260;
const avatar = await sharp('originales/avatar.png')
  .rotate()
  .resize(AV, AV, { fit: 'cover', position: 'attention' })
  .composite([{ input: Buffer.from(`<svg width="${AV}" height="${AV}"><circle cx="${AV / 2}" cy="${AV / 2}" r="${AV / 2}"/></svg>`), blend: 'dest-in' }])
  .png()
  .toBuffer();

const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><radialGradient id="g" cx="80%" cy="0%" r="80%"><stop offset="0" stop-color="#3a220f"/><stop offset="1" stop-color="#0c0a09"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <circle cx="${120 + AV / 2}" cy="${H / 2}" r="${AV / 2 + 8}" fill="#fb923c"/>
  <g font-family="Poppins, DejaVu Sans, sans-serif" fill="#f5f5f4">
    <text x="460" y="250" font-size="30" fill="#fb923c" font-weight="700" letter-spacing="3">d4vp · POPAYÁN, COLOMBIA</text>
    <text x="460" y="330" font-size="72" font-weight="700">David Pinchao</text>
    <text x="460" y="395" font-size="34" fill="#d6d3d1">Desarrollador web full-stack</text>
    <text x="460" y="442" font-size="34" fill="#d6d3d1">que construye con agentes de IA</text>
  </g>
</svg>`;

const { size } = await sharp(Buffer.from(bg))
  .composite([{ input: avatar, left: 120, top: (H - AV) / 2 }])
  .png({ compressionLevel: 9 })
  .toFile('assets/og.png');
console.log(`assets/og.png  ${(size / 1024).toFixed(1)} kB`);
