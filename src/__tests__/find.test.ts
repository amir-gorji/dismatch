import { describe, it, expect, expectTypeOf } from 'vitest';
import { find } from '../unions';

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

describe('find — single variant', () => {
  it('returns first matching item', () => {
    const shapes = [rectangle, circle, triangle];
    expect(find(shapes, 'circle')).toBe(circle);
  });

  it('returns the first match when multiple exist', () => {
    const c2: Shape = { type: 'circle', radius: 99 };
    expect(find([circle, rectangle, c2], 'circle')).toBe(circle);
  });

  it('returns undefined when no match', () => {
    expect(find([rectangle, triangle] as Shape[], 'circle')).toBeUndefined();
  });

  it('returns undefined for empty array', () => {
    expect(find([] as Shape[], 'circle')).toBeUndefined();
  });
});

describe('find — multi-variant', () => {
  it('returns first item matching any of the variants', () => {
    const shapes = [triangle, rectangle, circle];
    const result = find(shapes, ['circle', 'rectangle']);
    expect(result).toBe(rectangle);
  });

  it('returns undefined when none match', () => {
    expect(find([triangle] as Shape[], ['circle', 'rectangle'])).toBeUndefined();
  });
});

describe('find — non-union items skipped', () => {
  it('skips null entries', () => {
    const mixed = [null, undefined, circle] as any[];
    expect(find(mixed, 'circle')).toBe(circle);
  });

  it('skips objects without string discriminant', () => {
    const mixed = [{ type: 42 }, circle] as any[];
    expect(find(mixed, 'circle')).toBe(circle);
  });
});

describe('find — custom discriminant', () => {
  const dog: Animal = { kind: 'dog', name: 'Rex' };
  const cat: Animal = { kind: 'cat', lives: 9 };

  it('finds with custom discriminant', () => {
    expect(find([cat, dog], 'dog', 'kind')).toBe(dog);
  });

  it('returns undefined when not found with custom discriminant', () => {
    expect(find([cat] as Animal[], 'dog', 'kind')).toBeUndefined();
  });
});

describe('find — type narrowing', () => {
  it('narrows single-variant result to that variant type', () => {
    const result = find([circle, rectangle], 'circle');
    expectTypeOf(result).toEqualTypeOf<{ type: 'circle'; radius: number } | undefined>();
  });

  it('narrows multi-variant result to sub-union', () => {
    const result = find([circle, rectangle, triangle], ['circle', 'rectangle'] as const);
    expectTypeOf(result).toEqualTypeOf<
      { type: 'circle'; radius: number } | { type: 'rectangle'; width: number; height: number } | undefined
    >();
  });
});
