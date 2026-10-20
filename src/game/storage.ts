// La partida se guarda en el navegador para sobrevivir a una recarga accidental.
// Es una comodidad local: si el almacenamiento falla o trae basura, se arranca de cero.
import { TEAM_SIZE, type AuctionState } from './auction';

const KEY = 'subasta-pokemon:v1';

const isInt = (v: unknown): v is number => Number.isInteger(v);

function isState(v: unknown): v is AuctionState {
  const s = v as AuctionState;
  return (
    !!s &&
    Array.isArray(s.sides) &&
    s.sides.length === 2 &&
    s.sides.every(
      (x) =>
        typeof x?.name === 'string' &&
        isInt(x.budget) &&
        Array.isArray(x.team) &&
        x.team.length <= TEAM_SIZE &&
        x.team.every((p) => isInt(p?.dex) && isInt(p?.price)),
    ) &&
    (s.current === null || isInt(s.current)) &&
    isInt(s.price) &&
    Array.isArray(s.recent)
  );
}

export function loadGame(): AuctionState | null {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return isState(parsed) ? parsed : null;
  } catch (err) {
    console.warn('No se pudo leer la partida guardada', err);
    return null;
  }
}

export function saveGame(s: AuctionState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch (err) {
    console.warn('No se pudo guardar la partida', err);
  }
}
