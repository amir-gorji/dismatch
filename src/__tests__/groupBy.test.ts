import { describe, it, expect, expectTypeOf } from 'vitest';
import { groupBy } from '../unions';

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

describe('groupBy — basic grouping', () => {
  it('groups items by variant', () => {
    const result = groupBy([circle, rectangle, circle2, triangle]);
    expect(result.circle).toEqual([circle, circle2]);
    expect(result.rectangle).toEqual([rectangle]);
    expect(result.triangle).toEqual([triangle]);
  });

  it('returns an empty object for an empty array', () => {
    const result = groupBy([] as Shape[]);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('groups a single item correctly', () => {
    const result = groupBy([circle]);
    expect(result.circle).toEqual([circle]);
  });

  it('preserves insertion order within each group', () => {
    const c1: Shape = { type: 'circle', radius: 1 };
    const c2: Shape = { type: 'circle', radius: 2 };
    const c3: Shape = { type: 'circle', radius: 3 };
    const result = groupBy([c1, rectangle, c2, c3]);
    expect(result.circle).toEqual([c1, c2, c3]);
  });
});

describe('groupBy — non-union items skipped', () => {
  it('skips null and undefined', () => {
    const mixed = [null, circle, undefined, rectangle] as any[];
    const result = groupBy(mixed);
    expect(result.circle).toEqual([circle]);
    expect(result.rectangle).toEqual([rectangle]);
  });

  it('skips objects without string discriminant', () => {
    const mixed = [{ type: 42 }, circle] as any[];
    const result = groupBy(mixed);
    expect(result.circle).toEqual([circle]);
  });
});

describe('groupBy — custom discriminant', () => {
  const dog: Animal = { kind: 'dog', name: 'Rex' };
  const cat: Animal = { kind: 'cat', lives: 9 };
  const dog2: Animal = { kind: 'dog', name: 'Buddy' };

  it('groups with custom discriminant', () => {
    const result = groupBy([dog, cat, dog2], 'kind');
    expect(result.dog).toEqual([dog, dog2]);
    expect(result.cat).toEqual([cat]);
  });
});

describe('groupBy — type narrowing', () => {
  it('each group is narrowed to the specific variant type', () => {
    const result = groupBy([circle, rectangle]);
    expectTypeOf(result.circle).toEqualTypeOf<{ type: 'circle'; radius: number }[] | undefined>();
    expectTypeOf(result.rectangle).toEqualTypeOf<{ type: 'rectangle'; width: number; height: number }[] | undefined>();
  });
});
