// Valida una plantilla de Blogger ya compilada.
// Uso: node scripts/validate.mjs [dist/theme.xml]
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { XMLValidator } from 'fast-xml-parser';

const XML_ENTITIES = new Set(['amp', 'lt', 'gt', 'quot', 'apos']);

export function validateTheme(xml) {
  const errors = [];
  const warnings = [];

  // 1. XML bien formado: es lo primero que Blogger rechaza al subir la plantilla.
  const result = XMLValidator.validate(xml, { allowBooleanAttributes: false });
  if (result !== true) errors.push(`XML mal formado (línea ${result.err.line}, col ${result.err.col}): ${result.err.msg}`);

  // El resto de comprobaciones ignora el contenido de CDATA (CSS y JS incrustados).
  const markup = xml.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');

  // 2. Estructura mínima que exige Blogger.
  if (!/<html[^>]*xmlns:b=/.test(markup)) errors.push("Falta xmlns:b en <html>.");
  if (!/<b:skin[\s>/]/.test(markup)) errors.push('Falta <b:skin>.');
  if (!/<b:section[\s>]/.test(markup)) errors.push('Hace falta al menos un <b:section>.');
  if (!/<b:widget[^>]*type='Blog'/.test(markup)) warnings.push("No hay ningún widget type='Blog': no se mostrarán entradas.");

  // 3. Los id de secciones y widgets deben ser únicos.
  const seen = new Set();
  for (const [, tag, id] of markup.matchAll(/<b:(section|widget)[^>]*\bid='([^']+)'/g)) {
    if (seen.has(id)) errors.push(`id duplicado en <b:${tag}>: ${id}`);
    seen.add(id);
  }

  // 4. Directivas de compilación sin resolver.
  for (const [directive] of markup.matchAll(/<!--\s*@\w+[^>]*-->/g)) errors.push(`Directiva sin resolver: ${directive}`);

  // 5. Entidades HTML con nombre (&nbsp;…): no son XML; mejor usar la forma numérica.
  for (const [entity, name] of markup.matchAll(/&([a-zA-Z][\w]*);/g)) {
    if (!XML_ENTITIES.has(name)) warnings.push(`Entidad HTML ${entity}: usa su forma numérica (p. ej. &#160;).`);
  }

  return { errors, warnings };
}

export function report({ errors, warnings }) {
  for (const w of warnings) console.warn(`⚠ ${w}`);
  for (const e of errors) console.error(`✖ ${e}`);
  return errors.length === 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = process.argv[2] ?? 'dist/theme.xml';
  const ok = report(validateTheme(await readFile(file, 'utf8')));
  if (ok) console.log(`✔ ${file} es válido`);
  process.exit(ok ? 0 : 1);
}
