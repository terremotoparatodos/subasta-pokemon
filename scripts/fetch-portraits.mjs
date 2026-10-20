// Retratos de Pokémon Mystery Dungeon (PMDCollab/SpriteCollab, CC BY-NC 4.0), sólo los del roster.
// Reutiliza el clon parcial de ¿Mayor o Menor? si existe; si no, hace uno propio en .cache/.
//
//   npm run portraits
//   SPRITECOLLAB=/ruta/al/clon npm run portraits
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, readFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sibling = join(root, '../mayor-o-menor-pokemon/.cache/SpriteCollab');
const own = join(root, '.cache/SpriteCollab');
const repo = process.env.SPRITECOLLAB ?? (existsSync(join(sibling, 'portrait')) ? sibling : own);
const outDir = join(root, 'public/portraits');

if (!existsSync(join(repo, 'portrait'))) {
  mkdirSync(repo, { recursive: true });
  execFileSync('git', ['clone', '--depth', '1', '--filter=blob:none', '--no-checkout',
    'https://github.com/PMDCollab/SpriteCollab.git', repo], { stdio: 'inherit' });
  execFileSync('git', ['sparse-checkout', 'set', '--no-cone', '/portrait/*/Normal.png', '/LICENSE*'], { cwd: repo, stdio: 'inherit' });
  execFileSync('git', ['checkout'], { cwd: repo, stdio: 'inherit' });
}

const roster = readFileSync(join(root, 'src/content/roster.ts'), 'utf8');
const dexes = [...roster.matchAll(/dex:\s*(\d+)/g)].map((m) => Number(m[1]));

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const missing = [];
for (const dex of dexes) {
  const src = join(repo, 'portrait', String(dex).padStart(4, '0'), 'Normal.png');
  if (existsSync(src)) copyFileSync(src, join(outDir, `${dex}.png`));
  else missing.push(dex);
}
const license = ['LICENSE', 'LICENSE.md', 'LICENSE.txt'].map((f) => join(repo, f)).find(existsSync);
if (license) copyFileSync(license, join(outDir, 'LICENSE.txt'));
console.log(`Listo: ${dexes.length - missing.length}/${dexes.length} retratos desde ${repo}`);
if (missing.length) {
  console.error(`Faltan retratos: ${missing.join(', ')}`);
  process.exitCode = 1;
}
