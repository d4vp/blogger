# blogger

Página personal de David Pinchao. Sitio estático de un solo archivo (`index.html`), sin dependencias en tiempo de ejecución ni paso de compilación.

## Estructura

- `index.html` — marcado, estilos (tokens CSS con `light-dark()`) y JS inline.
- `assets/img/` — imágenes WebP servidas por la página (1x y 2x), generadas con `npm run images`.
- `assets/fonts/` — Poppins (subset latin) auto-alojada.
- `assets/icons.svg` — sprite de iconos (Lucide + Simple Icons).
- `*.png`, `agricultor.jpg` — originales de alta resolución; la página no los carga.

## Desarrollo

```bash
npm run dev
```

Para regenerar las imágenes tras cambiar o añadir un original (edita la lista en `scripts/optimize-images.mjs`):

```bash
npm install
```

```bash
npm run images
```
