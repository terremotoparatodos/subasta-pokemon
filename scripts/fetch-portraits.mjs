// Retratos de Pokémon Mystery Dungeon (PMDCollab/SpriteCollab, CC BY-NC 4.0), sólo los del roster,
// junto con credits.json: quién hizo el retrato Normal vigente de cada uno.
// Reutiliza el clon parcial de ¿Mayor o Menor? si existe; si no (por ejemplo en CI), hace uno propio en .cache/.
//
//   npm run portraits
//   SPRITECOLLAB=/ruta/al/clon npm run portraits
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sibling = join(root, '../mayor-o-menor-pokemon/.cache/SpriteCollab');
const own = join(root, '.cache/SpriteCollab');
const repo = process.env.SPRITECOLLAB ?? (existsSync(join(sibling, 'portrait')) ? sibling : own);
const outDir = join(root, 'public/portraits');
const SPARSE = ['/portrait/*/Normal.png', '/portrait/*/credits.txt', '/credit_names.txt', '/LICENSE*'];

if (!existsSync(join(repo, 'portrait'))) {
  mkdirSync(repo, { recursive: true });
  execFileSync('git', ['clone', '--depth', '1', '--filter=blob:none', '--no-checkout',
    'https://github.com/PMDCollab/SpriteCollab.git', repo], { stdio: 'inherit' });
  execFileSync('git', ['sparse-checkout', 'set', '--no-cone', ...SPARSE], { cwd: repo, stdio: 'inherit' });
  execFileSync('git', ['checkout'], { cwd: repo, stdio: 'inherit' });
}

// credit_names.txt: Name \t Discord \t Contact (el autor en credits.txt es el campo Discord o el nombre).
const people = new Map();
const namesFile = join(repo, 'credit_names.txt');
if (existsSync(namesFile)) {
  for (const line of readFileSync(namesFile, 'utf8').split(/\r?\n/).slice(1)) {
    const [name, discord, contact] = line.split('\t');
    if (!name) continue;
    const person = { name: name.trim(), contact: /^https?:\/\//.test(contact ?? '') ? contact.trim() : undefined };
    people.set(discord?.trim(), person);
    people.set(name.trim(), person);
  }
}

/** Autores vigentes (CUR) del retrato Normal, en orden de aparición. */
function normalAuthors(creditsPath) {
  if (!existsSync(creditsPath)) return [];
  const out = [];
  for (const line of readFileSync(creditsPath, 'utf8').split(/\r?\n/)) {
    const [, author, status, , emotions] = line.split('\t');
    if (status !== 'CUR' || !emotions?.split(',').includes('Normal')) continue;
    const p = people.get(author) ?? { name: 'Autor sin nombre registrado' };
    if (!out.some((o) => o.name === p.name)) out.push(p);
  }
  return out;
}

const roster = readFileSync(join(root, 'src/content/roster.ts'), 'utf8');
const dexes = [...roster.matchAll(/dex:\s*(\d+)/g)].map((m) => Number(m[1]));

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const missing = [];
const credits = {};
for (const dex of dexes) {
  const dir = join(repo, 'portrait', String(dex).padStart(4, '0'));
  const src = join(dir, 'Normal.png');
  if (!existsSync(src)) {
    missing.push(dex);
    continue;
  }
  copyFileSync(src, join(outDir, `${dex}.png`));
  credits[dex] = normalAuthors(join(dir, 'credits.txt'));
}
const license = ['LICENSE', 'LICENSE.md', 'LICENSE.txt'].map((f) => join(repo, f)).find(existsSync);
if (license) copyFileSync(license, join(outDir, 'LICENSE.txt'));
writeFileSync(join(outDir, 'credits.json'), JSON.stringify(credits));
const uncredited = Object.values(credits).filter((a) => a.length === 0).length;
console.log(`Listo: ${dexes.length - missing.length}/${dexes.length} retratos desde ${repo} · sin créditos: ${uncredited}`);
if (missing.length) {
  console.error(`Faltan retratos: ${missing.join(', ')}`);
  process.exitCode = 1;
}
