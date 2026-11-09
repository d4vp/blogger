import { toggleTheme } from './theme-toggle.js';

// Hero tipo consola. Toda la salida se escribe con textContent / nodos DOM (nunca innerHTML).
export function initTerminal() {
  const term = document.querySelector('[data-terminal]');
  if (!term) return;
  const out = term.querySelector('[data-terminal-output]');
  const form = term.querySelector('[data-terminal-form]');
  const input = form.querySelector('input');
  const history = [];
  let cursor = 0;

  const line = (content, className = '') => {
    const el = document.createElement('div');
    if (className) el.className = className;
    el.append(content);
    out.append(el);
    out.scrollTop = out.scrollHeight;
    return el;
  };

  const commands = {
    help: () => line('Comandos: about · posts · theme · clear · help'),
    about: () => line(term.dataset.about || term.dataset.host || 'Un blog hecho con Blogger.'),
    theme: () => line(`Tema: ${toggleTheme()}`),
    clear: () => out.replaceChildren(),
    async posts() {
      const status = line('Cargando…', 'text-neutral-500');
      try {
        // Feed público de Blogger: últimas entradas en JSON.
        const res = await fetch('/feeds/posts/summary?alt=json&max-results=5');
        const entries = (await res.json()).feed.entry ?? [];
        status.remove();
        if (!entries.length) return line('Todavía no hay entradas.');
        for (const entry of entries) {
          const a = document.createElement('a');
          a.href = entry.link.find((l) => l.rel === 'alternate').href;
          a.textContent = entry.title.$t;
          a.className = 'underline underline-offset-2 hover:text-accent';
          line(a);
        }
      } catch {
        status.textContent = 'No se pudieron cargar las entradas.';
      }
    },
  };

  const run = async (raw) => {
    const cmd = raw.trim().toLowerCase();
    line(`$ ${raw}`, 'text-accent');
    if (!cmd) return;
    if (Object.hasOwn(commands, cmd)) await commands[cmd]();
    else line(`Comando no encontrado: ${cmd}. Prueba "help".`, 'text-red-400');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value;
    input.value = '';
    if (value.trim()) cursor = history.push(value);
    run(value);
  });

  // Historial con las flechas, como en una shell.
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    cursor = Math.max(0, Math.min(history.length, cursor + (e.key === 'ArrowUp' ? -1 : 1)));
    input.value = history[cursor] ?? '';
  });

  // Clic en cualquier parte de la terminal enfoca el prompt (sin romper la selección de texto).
  term.addEventListener('click', (e) => {
    if (!e.target.closest('a') && !getSelection().toString()) input.focus({ preventScroll: true });
  });

  out.replaceChildren();
  line(`Bienvenido a ${term.dataset.host || 'este blog'}.`);
  line('Escribe "help" para ver los comandos.', 'text-neutral-500');
}
