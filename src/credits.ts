// Página de créditos: autor del retrato Normal de cada Pokémon del roster (public/portraits/credits.json).
import './ui/credits.css';
import { ROSTER, portraitUrl } from './content/roster';

interface Author { name: string; contact?: string }

const list = document.querySelector<HTMLOListElement>('.list')!;
const filter = document.querySelector<HTMLInputElement>('.filter')!;

async function main() {
  const credits: Record<string, Author[]> = await fetch(`${import.meta.env.BASE_URL}portraits/credits.json`).then((r) => {
    if (!r.ok) throw new Error('Faltan los créditos. Corré "npm run portraits".');
    return r.json();
  });
  const rows = [...ROSTER].sort((a, b) => a.dex - b.dex).map((m) => {
    const authors = credits[m.dex] ?? [];
    const li = document.createElement('li');
    const img = Object.assign(document.createElement('img'), { src: portraitUrl(m.dex), alt: '', loading: 'lazy', width: 40, height: 40 });
    const name = Object.assign(document.createElement('b'), { textContent: `#${m.dex} ${m.name}` });
    const who = document.createElement('span');
    authors.forEach((a, i) => {
      if (i > 0) who.append(', ');
      // Sólo enlaces http(s) que vienen de credit_names.txt; el texto siempre como texto.
      if (a.contact) who.append(Object.assign(document.createElement('a'), { href: a.contact, textContent: a.name, target: '_blank', rel: 'noopener' }));
      else who.append(a.name);
    });
    if (!authors.length) who.append('Sin datos');
    li.append(img, name, who);
    return { li, text: `${m.dex} ${m.name} ${authors.map((a) => a.name).join(' ')}`.toLowerCase() };
  });
  list.replaceChildren(...rows.map((r) => r.li));
  document.querySelector('.count')!.textContent = `(${rows.length})`;
  filter.addEventListener('input', () => {
    const q = filter.value.trim().toLowerCase();
    for (const r of rows) r.li.hidden = q !== '' && !r.text.includes(q);
  });
}

main().catch((err: Error) => { list.replaceChildren(Object.assign(document.createElement('li'), { textContent: err.message })); });
