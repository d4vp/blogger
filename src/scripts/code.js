import './prism.js';
import Prism from 'prismjs/components/prism-core.js';
// Añade aquí solo los lenguajes que uses: cada uno pesa en el XML final.
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-clike.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-json.js';

// Resalta <pre><code class="language-xxx"> y añade un botón "Copiar" a todos los <pre> de la entrada.
export function initCodeBlocks() {
  for (const pre of document.querySelectorAll('.post-body pre')) {
    const code = pre.querySelector('code[class*="language-"]');
    if (code) Prism.highlightElement(code);

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.replaceWith(wrapper);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = 'Copiar';
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.textContent);
        button.textContent = '¡Copiado!';
      } catch {
        button.textContent = 'Error';
      }
      setTimeout(() => { button.textContent = 'Copiar'; }, 2000);
    });
    wrapper.append(pre, button);
  }
}
