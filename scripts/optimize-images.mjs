// Genera las variantes WebP servidas por index.html a partir de los originales.
// Uso: npm run images
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const OUT = 'assets/img';
// [origen, nombre de salida, tamaño CSS máximo en px]
const IMAGES = [
  ['avatar.png', 'avatar', 180],
  ['inge.png', 'inge', 200],
  ['fotografo.png', 'fotografo', 200],
  ['run.png', 'run', 200],
  ['guitar.png', 'guitar', 200],
  ['agricultor.jpg', 'agricultor', 200],
  ['repartidor_rappi.png', 'repartidor_rappi', 200],
];

await mkdir(OUT, { recursive: true });
for (const [src, name, size] of IMAGES) {
  for (const dpr of [1, 2]) {
    const px = size * dpr;
    const file = `${OUT}/${name}-${px}.webp`;
    // rotate() aplica la orientación EXIF; sharp descarta el resto de metadatos.
    const { size: bytes } = await sharp(src)
      .rotate()
      .resize(px, px, { fit: 'cover', position: 'attention' })
      .webp({ quality: 78 })
      .toFile(file);
    console.log(`${file}  ${(bytes / 1024).toFixed(1)} kB`);
  }
}
