// Pantalla de la subasta: dibuja el estado y traduce toques en acciones de auction.ts.
import { ROSTER, portraitUrl } from '../content/roster';
import {
  assign, canAssign, isFinished, newGame, release, rename, roll, setPrice, TEAM_SIZE,
  type AuctionState, type SideIndex,
} from '../game/auction';
import { saveGame } from '../game/storage';

const NAMES = new Map(ROSTER.map((m) => [m.dex, m.name]));
const POOL = ROSTER.map((m) => m.dex);
const UNDO_LIMIT = 50;
const ROLL_MS = 650;
const ROLL_TICK_MS = 55;

const $ = <T extends Element>(root: ParentNode, sel: string): T => root.querySelector<T>(sel)!;

export function mountView(app: HTMLElement, initial: AuctionState): void {
  let state = initial;
  let rolling = false;
  const undo: AuctionState[] = [];

  const sideEls = [...app.querySelectorAll<HTMLElement>('.side')];
  const portrait = $<HTMLImageElement>(app, '.portrait');
  const monName = $<HTMLElement>(app, '.mon-name');
  const card = $<HTMLElement>(app, '.card');
  const rollBtn = $<HTMLButtonElement>(app, '.roll');
  const priceNum = $<HTMLElement>(app, '.price-num');
  const steps = [...app.querySelectorAll<HTMLButtonElement>('.step')];
  const giveBtns = [...app.querySelectorAll<HTMLButtonElement>('.give-btn')];
  const undoBtn = $<HTMLButtonElement>(app, '.undo');

  function commit(next: AuctionState): void {
    if (next === state) return;
    undo.push(state);
    if (undo.length > UNDO_LIMIT) undo.shift();
    state = next;
    saveGame(state);
    render();
  }

  function showMon(dex: number | null): void {
    if (dex === null) {
      portrait.removeAttribute('src');
      card.classList.add('empty');
      monName.textContent = isFinished(state) ? '¡EQUIPOS LISTOS!' : 'TOCÁ SORTEAR';
    } else {
      portrait.src = portraitUrl(dex);
      card.classList.remove('empty');
      monName.textContent = NAMES.get(dex) ?? `#${dex}`;
    }
  }

  function renderSide(i: SideIndex): void {
    const side = state.sides[i];
    const el = sideEls[i];
    $<HTMLElement>(el, '.side-name').textContent = side.name;
    $<HTMLElement>(el, '.budget').textContent = String(side.budget);
    el.classList.toggle('full', side.team.length >= TEAM_SIZE);
    const slots = $<HTMLOListElement>(el, '.slots');
    slots.replaceChildren(
      ...Array.from({ length: TEAM_SIZE }, (_, slot) => {
        const pick = side.team[slot];
        const li = document.createElement('li');
        li.className = 'slot';
        if (!pick) return li;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slot-btn';
        btn.dataset.slot = String(slot);
        btn.setAttribute('aria-label', `${NAMES.get(pick.dex)} (${pick.price})`);
        const img = document.createElement('img');
        img.src = portraitUrl(pick.dex);
        img.alt = '';
        const tag = document.createElement('span');
        tag.className = 'slot-price outline-s';
        tag.textContent = String(pick.price);
        btn.append(img, tag);
        li.append(btn);
        return li;
      }),
    );
  }

  function render(): void {
    renderSide(0);
    renderSide(1);
    if (!rolling) showMon(state.current);
    priceNum.textContent = String(state.price);
    rollBtn.textContent = state.current === null ? 'SORTEAR' : 'OTRO';
    rollBtn.disabled = rolling || isFinished(state);
    steps.forEach((b) => (b.disabled = rolling || state.current === null));
    giveBtns.forEach((b) => {
      const i = Number(b.dataset.side) as SideIndex;
      $<HTMLElement>(b, '.give-name').textContent = state.sides[i].name;
      b.disabled = rolling || !canAssign(state, i);
    });
    undoBtn.disabled = rolling || undo.length === 0;
  }

  // Ruleta corta de retratos antes de mostrar el sorteado.
  function doRoll(): void {
    const next = roll(state, POOL);
    if (next === state || rolling) return;
    rolling = true;
    card.classList.remove('empty', 'landed');
    render();
    const started = performance.now();
    const tick = () => {
      if (performance.now() - started < ROLL_MS) {
        const dex = POOL[Math.floor(Math.random() * POOL.length)];
        portrait.src = portraitUrl(dex);
        monName.textContent = '???';
        setTimeout(tick, ROLL_TICK_MS);
        return;
      }
      rolling = false;
      commit(next);
      void card.offsetWidth; // reinicia la animación de llegada
      card.classList.add('landed');
    };
    tick();
  }

  // ── Diálogo único para confirmar o pedir un nombre ──
  const dialog = document.getElementById('ask') as HTMLDialogElement;
  const askText = $<HTMLElement>(dialog, '.ask-text');
  const askInput = $<HTMLInputElement>(dialog, '.ask-input');
  function ask(text: string, input?: string): Promise<string | null> {
    askText.textContent = text;
    askInput.hidden = input === undefined;
    askInput.value = input ?? '';
    dialog.returnValue = '';
    dialog.showModal();
    if (input !== undefined) askInput.select();
    return new Promise((resolve) => {
      dialog.addEventListener('close', () => resolve(dialog.returnValue === 'ok' ? askInput.value : null), { once: true });
    });
  }

  rollBtn.addEventListener('click', doRoll);
  steps.forEach((b) => b.addEventListener('click', () => commit(setPrice(state, state.price + Number(b.dataset.step)))));
  giveBtns.forEach((b) =>
    b.addEventListener('click', () => {
      const i = Number(b.dataset.side) as SideIndex;
      commit(assign(state, i));
      sideEls[i].classList.remove('got');
      void sideEls[i].offsetWidth;
      sideEls[i].classList.add('got');
    }),
  );
  undoBtn.addEventListener('click', () => {
    const prev = undo.pop();
    if (!prev) return;
    state = prev;
    saveGame(state);
    render();
  });

  $<HTMLButtonElement>(app, '.reset').addEventListener('click', async () => {
    if ((await ask('¿Empezar una partida nueva? Se vacían los dos equipos.')) === null) return;
    commit(newGame([state.sides[0].name, state.sides[1].name]));
  });

  sideEls.forEach((el, idx) => {
    const i = idx as SideIndex;
    $<HTMLButtonElement>(el, '.side-name').addEventListener('click', async () => {
      const name = await ask('Nombre de este lado', state.sides[i].name);
      if (name !== null) commit(rename(state, i, name.toUpperCase()));
    });
    $<HTMLOListElement>(el, '.slots').addEventListener('click', async (e) => {
      const btn = (e.target as Element).closest<HTMLButtonElement>('.slot-btn');
      if (!btn || rolling) return;
      const slot = Number(btn.dataset.slot);
      const pick = state.sides[i].team[slot];
      const ok = await ask(`¿Sacar a ${NAMES.get(pick.dex)} de ${state.sides[i].name}? Se devuelven ${pick.price} monedas.`);
      if (ok !== null) commit(release(state, i, slot));
    });
  });

  render();
}
