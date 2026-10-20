// Reglas de la subasta, sin DOM: dos lados, 5 lugares cada uno y 20 monedas para arrancar.
// Cada función devuelve un estado nuevo; si la acción no se puede, devuelve el mismo objeto.
export const TEAM_SIZE = 5;
export const START_BUDGET = 20;
export const START_PRICE = 1;

export interface Pick {
  dex: number;
  price: number;
}

export interface Side {
  name: string;
  budget: number;
  team: Pick[];
}

export interface AuctionState {
  sides: [Side, Side];
  /** Pokémon en subasta, o null antes de la primera tirada. */
  current: number | null;
  price: number;
  /** Últimos sorteados, para no repetir enseguida. */
  recent: number[];
}

export type SideIndex = 0 | 1;

const RECENT_LIMIT = 40;

export function newGame(names: [string, string] = ['JUGADOR 1', 'JUGADOR 2']): AuctionState {
  return {
    sides: [
      { name: names[0], budget: START_BUDGET, team: [] },
      { name: names[1], budget: START_BUDGET, team: [] },
    ],
    current: null,
    price: START_PRICE,
    recent: [],
  };
}

const taken = (s: AuctionState): Set<number> => new Set(s.sides.flatMap((side) => side.team.map((p) => p.dex)));

/** Sortea otro Pokémon que nadie tenga; evita los recientes mientras queden opciones. */
export function roll(s: AuctionState, pool: readonly number[], rand: () => number = Math.random): AuctionState {
  const owned = taken(s);
  const free = pool.filter((dex) => !owned.has(dex) && dex !== s.current);
  if (free.length === 0) return s;
  const recent = new Set(s.recent);
  const fresh = free.filter((dex) => !recent.has(dex));
  const options = fresh.length > 0 ? fresh : free;
  const current = options[Math.floor(rand() * options.length)];
  return { ...s, current, price: START_PRICE, recent: [...s.recent, current].slice(-RECENT_LIMIT) };
}

export function setPrice(s: AuctionState, price: number): AuctionState {
  const next = Math.max(0, Math.min(START_BUDGET, Math.round(price)));
  return next === s.price ? s : { ...s, price: next };
}

export function canAssign(s: AuctionState, side: SideIndex): boolean {
  const target = s.sides[side];
  return s.current !== null && target.team.length < TEAM_SIZE && s.price <= target.budget;
}

/** El lado se queda con el Pokémon actual y paga el precio. */
export function assign(s: AuctionState, side: SideIndex): AuctionState {
  if (!canAssign(s, side) || s.current === null) return s;
  const sides = s.sides.map((x, i) =>
    i === side ? { ...x, budget: x.budget - s.price, team: [...x.team, { dex: s.current!, price: s.price }] } : x,
  ) as [Side, Side];
  return { ...s, sides, current: null, price: START_PRICE };
}

/** Saca un Pokémon del equipo y devuelve lo que se pagó. */
export function release(s: AuctionState, side: SideIndex, slot: number): AuctionState {
  const pick = s.sides[side].team[slot];
  if (!pick) return s;
  const sides = s.sides.map((x, i) =>
    i === side ? { ...x, budget: x.budget + pick.price, team: x.team.filter((_, j) => j !== slot) } : x,
  ) as [Side, Side];
  return { ...s, sides };
}

export function rename(s: AuctionState, side: SideIndex, name: string): AuctionState {
  const clean = name.trim().slice(0, 16);
  if (!clean) return s;
  const sides = s.sides.map((x, i) => (i === side ? { ...x, name: clean } : x)) as [Side, Side];
  return { ...s, sides };
}

export const isFinished = (s: AuctionState): boolean => s.sides.every((x) => x.team.length >= TEAM_SIZE);
