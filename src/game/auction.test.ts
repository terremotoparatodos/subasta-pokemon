import { describe, expect, it } from 'vitest';
import { assign, canAssign, isFinished, newGame, release, roll, setPrice, START_BUDGET, TEAM_SIZE } from './auction';

const pool = Array.from({ length: 30 }, (_, i) => i + 1);
const first = () => 0;

describe('subasta', () => {
  it('ambos lados arrancan con 20 y vacíos', () => {
    const s = newGame();
    expect(s.sides.map((x) => x.budget)).toEqual([START_BUDGET, START_BUDGET]);
    expect(s.sides.every((x) => x.team.length === 0)).toBe(true);
  });

  it('asignar descuenta el precio y libera el actual', () => {
    let s = roll(newGame(), pool, first);
    s = setPrice(s, 7);
    s = assign(s, 1);
    expect(s.sides[1].budget).toBe(13);
    expect(s.sides[1].team).toEqual([{ dex: 1, price: 7 }]);
    expect(s.current).toBeNull();
  });

  it('no deja pagar más de lo que hay ni pasar de 5', () => {
    let s = roll(newGame(), pool, first);
    s = setPrice(s, 20);
    s = assign(s, 0);
    s = setPrice(roll(s, pool, first), 1);
    expect(canAssign(s, 0)).toBe(false);
    expect(assign(s, 0)).toBe(s);

    let t = newGame();
    for (let i = 0; i < TEAM_SIZE; i++) t = assign(setPrice(roll(t, pool, first), 0), 0);
    t = roll(t, pool, first);
    expect(canAssign(t, 0)).toBe(false);
  });

  it('nunca sortea uno que ya tiene alguien', () => {
    let s = newGame();
    for (let i = 0; i < 2 * TEAM_SIZE; i++) s = assign(setPrice(roll(s, pool, first), 0), (i % 2) as 0 | 1);
    expect(isFinished(s)).toBe(true);
    const owned = s.sides.flatMap((x) => x.team.map((p) => p.dex));
    expect(new Set(owned).size).toBe(owned.length);
  });

  it('devolver un Pokémon reintegra lo pagado', () => {
    let s = assign(setPrice(roll(newGame(), pool, first), 5), 0);
    s = release(s, 0, 0);
    expect(s.sides[0]).toMatchObject({ budget: 20, team: [] });
  });

  it('el precio queda entre 0 y 20', () => {
    const s = newGame();
    expect(setPrice(s, -3).price).toBe(0);
    expect(setPrice(s, 99).price).toBe(20);
  });
});
