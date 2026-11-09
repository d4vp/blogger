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

## Plantilla de Blogger (`src/` → `dist/theme.xml`)

Plantilla modular: fragmentos XML, Tailwind CSS v4 y JS se compilan en un único `.xml` que se sube en *Blogger → Tema → Editar HTML*.

```
src/
  theme.xml        esqueleto: <html>, <head>, <body> y directivas
  partials/        head, header, hero (terminal), blog (widget Blog), footer
  styles/main.css  entrada de Tailwind v4 (@theme, modo oscuro, .post-body, tema de Prism)
  scripts/         head.js (tema pre-pintado) · main.js → theme-toggle, terminal, code (Prism + copiar)
scripts/
  build.mjs        resuelve directivas, compila CSS/JS, minifica y valida
  validate.mjs     XML bien formado + reglas de Blogger
```

Directivas disponibles en cualquier `.xml` de `src/` (rutas relativas a `src/`):

| Directiva | Efecto |
| --- | --- |
| `<!-- @include partials/x.xml -->` | Inserta otro fragmento (recursivo) |
| `<!-- @css styles/main.css -->` | Compila con Tailwind y lo incrusta en `<style>` |
| `<!-- @js scripts/main.js -->` | Empaqueta con esbuild y lo incrusta en `<script>` |

```bash
npm run theme:dev
```

```bash
npm run theme:build
```

`theme:build` minifica, valida y falla si el XML no es válido. El workflow `.github/workflows/theme.yml` hace lo mismo en cada PR y publica `dist/theme.xml` como artefacto.
