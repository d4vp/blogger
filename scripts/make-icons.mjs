// Genera los iconos PNG del sitio a partir de assets/favicon.svg.
// Uso: npm run icons
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const svg = await readFile('assets/favicon.svg');
// iOS y Android recortan sus propias esquinas: para ellos se usa un fondo cuadrado completo.
const square = Buffer.from(svg.toString().replace('rx="7"', 'rx="0"'));
const OUT = [
  [svg, 'assets/favicon-32.png', 32],
  [square, 'assets/apple-touch-icon.png', 180],
  [square, 'assets/icon-192.png', 192],
  [square, 'assets/icon-512.png', 512],
];
for (const [src, file, px] of OUT) {
  const { size } = await sharp(src, { density: 72 * (px / 32) }).resize(px, px).png({ compressionLevel: 9, palette: true }).toFile(file);
  console.log(`${file}  ${(size / 1024).toFixed(1)} kB`);
}
