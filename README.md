# blogger

Página personal de David Pinchao. Sitio estático de un solo archivo (`index.html`), sin dependencias en tiempo de ejecución ni paso de compilación.

## Estructura

- `index.html` — marcado, estilos (tokens CSS con `light-dark()`) y JS inline.
- `assets/img/` — imágenes WebP servidas por la página (1x y 2x), generadas con `npm run images`.
- `assets/fonts/` — Poppins (subset latin) auto-alojada.
- `assets/icons.svg` — sprite de iconos (Lucide + Simple Icons).
- `*.png`, `agricultor.jpg` — originales de alta resolución; la página no los carga.

## Instalar el videojuego

La sección `#juego` de `index.html` tiene un contenedor 16:9 (`#game-root`) con un marcador "Próximamente". Copia el build web del juego en `games/<nombre>/` y sustituye el `<div class="game-placeholder">` por un `<iframe src="games/<nombre>/index.html" …>` o por un `<canvas>` con su script (el comentario en el HTML trae ambos ejemplos).

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

## Diseño: paleta y cards

Minimalista: neutros cálidos (escala *stone*) y **un solo acento** de marca. La misma paleta vive en `index.html` (variables `--*`) y en la plantilla de Blogger (`src/styles/main.css`, `@theme`). Todos los pares de texto cumplen WCAG AA (≥ 4.5:1).

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--brand` | `#fb923c` | `#fb923c` | Botones, iconos rellenos, foco |
| `--on-brand` | `#1c1917` | `#1c1917` | Texto sobre `--brand` (7.7:1) |
| `--brand-ink` | `#b43a0b` | `#fb923c` | Enlaces y texto de acento |
| `--brand-soft` | `#fff5ed` | `#2a1a0e` | Fondos suaves de acento |
| `--bg` | `#fafaf9` | `#0c0a09` | Fondo de página |
| `--surface` | `#ffffff` | `#1c1917` | Cards |
| `--surface-2` | `#f5f5f4` | `#292524` | Cards anidadas, chips, campos |
| `--border` | `#e7e5e4` | `#3a3532` | Bordes |
| `--text` | `#1c1917` | `#f5f5f4` | Texto principal |
| `--muted` | `#57534e` | `#a8a29e` | Texto secundario |
| `--success` / `--danger` | `#15803d` / `#b91c1c` | `#4ade80` / `#f87171` | Estados |

Todo el contenido usa el componente **`.card`** (variantes `card--link`, `card--feature`, `card--inset`); en Blogger, las entradas usan la misma clase `.card`.

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
