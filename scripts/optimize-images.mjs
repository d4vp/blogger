// Genera las variantes WebP servidas por index.html a partir de los originales.
// Los originales viven en originales/ (ignorada por git). Uso: npm run images
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'originales';
const OUT = 'assets/img';
// [origen, nombre de salida, ancho CSS, alto CSS] — se generan en 1x y 2x
const IMAGES = [
  ['avatar.png', 'avatar', 180, 180],
  ['inge.png', 'inge', 200, 200],
  ['fotografo.png', 'fotografo', 200, 200],
  ['run.png', 'run', 200, 200],
  ['guitar.png', 'guitar', 200, 200],
  ['agricultor.jpg', 'agricultor', 200, 200],
  // Capturas de los proyectos (1280×800, 16:10)
  ['khipuops.png', 'khipuops', 640, 400],
  ['copa-arrayanes.png', 'copa-arrayanes', 640, 400],
  ['hogarsync.png', 'hogarsync', 640, 400],
];

await mkdir(OUT, { recursive: true });
for (const [src, name, w, h] of IMAGES) {
  for (const dpr of [1, 2]) {
    const file = `${OUT}/${name}-${w * dpr}.webp`;
    // rotate() aplica la orientación EXIF; sharp descarta el resto de metadatos.
    const { size: bytes } = await sharp(`${SRC}/${src}`)
      .rotate()
      .resize(w * dpr, h * dpr, { fit: 'cover', position: w === h ? 'attention' : 'top', withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(file);
    console.log(`${file}  ${(bytes / 1024).toFixed(1)} kB`);
  }
}
