// Compila src/ en una única plantilla de Blogger: dist/theme.xml
//
//   node scripts/build.mjs            build de desarrollo (legible)
//   node scripts/build.mjs --minify   build de producción
//   node scripts/build.mjs --watch    recompila al guardar
//
// Directivas (comentarios XML dentro de src/**/*.xml, rutas relativas a src/):
//   <!-- @include partials/x.xml -->  inserta otro fragmento XML (recursivo)
//   <!-- @css styles/main.css -->     compila con Tailwind e incrusta en <style>
//   <!-- @js scripts/main.js -->      empaqueta con esbuild e incrusta en <script>
import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { build as esbuild } from 'esbuild';
import { report, validateTheme } from './validate.mjs';

const SRC = 'src';
const ENTRY = 'theme.xml';
const OUT = 'dist/theme.xml';
const DIRECTIVE = /<!--\s*@(include|css|js)\s+(\S+)\s*-->/g;
const run = promisify(execFile);

const flags = new Set(process.argv.slice(2));
const minify = flags.has('--minify');

/** Tailwind v4 CLI: escanea las clases usadas en src/ y devuelve el CSS. */
async function compileCss(file) {
  const args = ['-i', path.join(SRC, file)];
  if (minify) args.push('--minify');
  const { stdout } = await run('node_modules/.bin/tailwindcss', args, { maxBuffer: 16 * 1024 * 1024 });
  return stdout.trim();
}

/** esbuild: resuelve imports (incluido Prism desde npm) y genera un único IIFE. */
async function compileJs(file) {
  const { outputFiles } = await esbuild({
    entryPoints: [path.join(SRC, file)],
    bundle: true,
    format: 'iife',
    target: 'es2022',
    minify,
    legalComments: 'none',
    write: false,
  });
  return outputFiles[0].text.trim();
}

/** El código incrustado no puede cerrar su CDATA ni su etiqueta contenedora. */
function assertEmbeddable(code, file, closingTag) {
  if (code.includes(']]>')) throw new Error(`${file}: la salida contiene "]]>", que cerraría el CDATA.`);
  if (code.toLowerCase().includes(closingTag)) throw new Error(`${file}: la salida contiene "${closingTag}".`);
}

/** Sustituye las directivas de un fragmento XML; los @include se expanden recursivamente. */
async function expand(file, stack = []) {
  if (stack.includes(file)) throw new Error(`Include circular: ${[...stack, file].join(' → ')}`);
  const xml = await readFile(path.join(SRC, file), 'utf8');

  const matches = [...xml.matchAll(DIRECTIVE)];
  const replacements = await Promise.all(matches.map(async ([, kind, target]) => {
    if (kind === 'include') return (await expand(target, [...stack, file])).trim();
    if (kind === 'css') {
      const css = await compileCss(target);
      assertEmbeddable(css, target, '</style');
      return `<style>/*<![CDATA[*/\n${css}\n/*]]>*/</style>`;
    }
    const js = await compileJs(target);
    assertEmbeddable(js, target, '</script');
    return `<script>//<![CDATA[\n${js}\n//]]></script>`;
  }));

  let i = 0;
  return xml.replace(DIRECTIVE, () => replacements[i++]);
}

/**
 * Minificado conservador del marcado: quita comentarios y sangrado sin tocar los CDATA.
 * Los espacios entre etiquetas se reducen a un salto de línea (no a nada) para no
 * pegar elementos inline ni alterar el render.
 */
function minifyXml(xml) {
  return xml
    .split(/(<!\[CDATA\[[\s\S]*?\]\]>)/)
    .map((part, i) => (i % 2 ? part : part.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s*\n\s*</g, '>\n<')))
    .join('');
}

async function build() {
  const started = performance.now();
  let xml = await expand(ENTRY);
  if (minify) xml = minifyXml(xml);

  const ok = report(validateTheme(xml));
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, xml);

  const kb = (Buffer.byteLength(xml) / 1024).toFixed(1);
  console.log(`${ok ? '✔' : '✖'} ${OUT}  ${kb} kB  (${Math.round(performance.now() - started)} ms)`);
  return ok;
}

if (flags.has('--watch')) {
  let timer;
  const rebuild = () => build().catch((err) => console.error(`✖ ${err.message}`));
  await rebuild();
  watch(SRC, { recursive: true }, () => { clearTimeout(timer); timer = setTimeout(rebuild, 100); });
  console.log(`Observando ${SRC}/ …`);
} else {
  process.exit((await build()) ? 0 : 1);
}
