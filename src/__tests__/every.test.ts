import { describe, it, expect } from 'vitest';
import { every } from '../unions';

type Shape =
  | { type: 'circle'; radius: number }
  | { type: 'rectangle'; width: number; height: number }
  | { type: 'triangle'; base: number; height: number };

type Animal =
  | { kind: 'dog'; name: string }
  | { kind: 'cat'; lives: number }
  | { kind: 'bird'; canFly: boolean };

const circle: Shape = { type: 'circle', radius: 5 };
const circle2: Shape = { type: 'circle', radius: 10 };
const rectangle: Shape = { type: 'rectangle', width: 4, height: 6 };
const triangle: Shape = { type: 'triangle', base: 10, height: 3 };

describe('every — single variant', () => {
  it('returns true when all items match', () => {
    expect(every([circle, circle2], 'circle')).toBe(true);
  });

  it('returns false when any item does not match', () => {
    expect(every([circle, rectangle], 'circle')).toBe(false);
  });

  it('returns true for empty array (vacuous truth)', () => {
    expect(every([] as Shape[], 'circle')).toBe(true);
  });
});

describe('every — multi-variant', () => {
  it('returns true when all items match any of the variants', () => {
    expect(every([circle, rectangle], ['circle', 'rectangle'])).toBe(true);
  });

  it('returns false when any item is outside the variant set', () => {
    expect(every([circle, rectangle, triangle], ['circle', 'rectangle'])).toBe(false);
  });
});

describe('every — non-union items skipped', () => {
  it('skips non-union items and evaluates only union items', () => {
    const mixed = [null, circle, circle2] as any[];
    expect(every(mixed, 'circle')).toBe(true);
  });

  it('returns true for array of only non-union items (vacuous)', () => {
    const mixed = [null, 'hello', 42] as any[];
    expect(every(mixed, 'circle')).toBe(true);
  });

  it('returns false when union items fail the predicate despite non-union items', () => {
    const mixed = [null, circle, rectangle] as any[];
    expect(every(mixed, 'circle')).toBe(false);
  });
});

describe('every — custom discriminant', () => {
  const dog: Animal = { kind: 'dog', name: 'Rex' };
  const cat: Animal = { kind: 'cat', lives: 9 };

  it('returns true when all items match with custom discriminant', () => {
    const dog2: Animal = { kind: 'dog', name: 'Buddy' };
    expect(every([dog, dog2], 'dog', 'kind')).toBe(true);
  });

  it('returns false when not all match with custom discriminant', () => {
    expect(every([dog, cat], 'dog', 'kind')).toBe(false);
  });
});
