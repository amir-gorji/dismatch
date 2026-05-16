import { describe, it, expect } from 'vitest';
import { some } from '../unions';

type Shape =
  | { type: 'circle'; radius: number }
  | { type: 'rectangle'; width: number; height: number }
  | { type: 'triangle'; base: number; height: number };

type Animal =
  | { kind: 'dog'; name: string }
  | { kind: 'cat'; lives: number }
  | { kind: 'bird'; canFly: boolean };

const circle: Shape = { type: 'circle', radius: 5 };
const rectangle: Shape = { type: 'rectangle', width: 4, height: 6 };
const triangle: Shape = { type: 'triangle', base: 10, height: 3 };

describe('some — single variant', () => {
  it('returns true when at least one item matches', () => {
    expect(some([rectangle, circle, triangle], 'circle')).toBe(true);
  });

  it('returns false when no item matches', () => {
    expect(some([rectangle, triangle] as Shape[], 'circle')).toBe(false);
  });

  it('returns false for empty array', () => {
    expect(some([] as Shape[], 'circle')).toBe(false);
  });
});

describe('some — multi-variant', () => {
  it('returns true when any item matches any of the variants', () => {
    expect(some([triangle] as Shape[], ['circle', 'triangle'])).toBe(true);
  });

  it('returns false when no item matches any variant', () => {
    expect(some([triangle] as Shape[], ['circle', 'rectangle'])).toBe(false);
  });
});

describe('some — non-union items skipped', () => {
  it('skips null, undefined, and non-union objects', () => {
    const mixed = [null, undefined, { type: 42 }, circle] as any[];
    expect(some(mixed, 'circle')).toBe(true);
  });

  it('returns false for array of only non-union items', () => {
    const mixed = [null, 'hello', 42] as any[];
    expect(some(mixed, 'circle')).toBe(false);
  });
});

describe('some — custom discriminant', () => {
  const dog: Animal = { kind: 'dog', name: 'Rex' };
  const cat: Animal = { kind: 'cat', lives: 9 };

  it('returns true with custom discriminant', () => {
    expect(some([cat, dog], 'dog', 'kind')).toBe(true);
  });

  it('returns false with custom discriminant when not found', () => {
    expect(some([cat] as Animal[], 'dog', 'kind')).toBe(false);
  });
});
