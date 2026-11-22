# Portafolio de David Pinchao (d4vp)

Página de presentación personal: proyectos, habilidades, videojuego y contacto. Sitio estático de un solo archivo (`index.html`), sin dependencias en tiempo de ejecución ni paso de compilación.

URL pública prevista: **https://d4vp.github.io/** (usada en `canonical`, `og:url`, `og:image` y el JSON-LD de `index.html`; si cambia el dominio, actualízalas ahí).

## Estructura

- `index.html`: marcado, estilos (tokens CSS con `light-dark()`) y JS inline.
- `assets/img/`: imágenes WebP servidas por la página (1x y 2x), generadas con `npm run images`.
- `assets/og.png`: imagen para compartir en redes (1200×630), generada con `npm run og`.
- `assets/fonts/`: Poppins (subset latin) auto-alojada.
- `assets/icons.svg`: sprite de iconos (Lucide + Simple Icons).
- `originales/`: originales en alta resolución. **No están en git** (ver `.gitignore`); guárdalos aparte.

Orden de secciones: Inicio → Proyectos → Sobre mí → Habilidades → Aprendizajes → Videojuego → Rutas en bici → Contacto (incluye Nequi / Bre-B).

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

```bash
npm run og
```

## Publicar en GitHub Pages

1. En GitHub, renombra el repositorio a `d4vp.github.io` (*Settings → General → Repository name*).
2. En *Settings → Pages*, elige *Deploy from a branch*, rama `master` y carpeta `/ (root)`.

## Diseño: paleta y cards

Minimalista: neutros cálidos (escala *stone*) y **un solo acento** de marca, definidos como variables `--*` en `index.html`. Todos los pares de texto cumplen WCAG AA (≥ 4.5:1).

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--brand` | `#fb923c` | `#fb923c` | Botones, iconos rellenos, foco |
| `--on-brand` | `#1c1917` | `#1c1917` | Texto sobre `--brand` (7.7:1) |
| `--brand-ink` | `#b43a0b` | `#fb923c` | Enlaces y texto de acento |
| `--brand-soft` | `#fff5ed` | `#2a1a0e` | Fondos suaves de acento |
| `--bg` | `#fafaf9` | `#0c0a09` | Fondo de página |
| `--surface` | `#ffffff` | `#1c1917` | Cards |
| `--surface-2` | `#f5f5f4` | `#292524` | Chips, campos, estadísticas |
| `--border` | `#e7e5e4` | `#3a3532` | Bordes |
| `--text` | `#1c1917` | `#f5f5f4` | Texto principal |
| `--muted` | `#57534e` | `#a8a29e` | Texto secundario |
| `--success` / `--danger` | `#15803d` / `#b91c1c` | `#4ade80` / `#f87171` | Estados |

Todo el contenido usa el componente **`.card`** (variantes `card--link`, `card--feature`, `card--media`; `.card-shot` para capturas a sangre).
