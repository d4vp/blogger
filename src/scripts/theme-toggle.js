const root = document.documentElement;

export function toggleTheme() {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
  return next;
}

export function initThemeToggle() {
  for (const btn of document.querySelectorAll('[data-theme-toggle]')) btn.addEventListener('click', toggleTheme);
}
