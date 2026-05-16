import { describe, it, expect } from 'vitest';
import { filterMap } from '../unions';

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

describe('filterMap — basic transform+filter', () => {
  it('transforms handled variants and skips unhandled ones', () => {
    const areas = filterMap([circle, rectangle, triangle], {
      circle: ({ radius }) => Math.PI * radius ** 2,
    });
    expect(areas).toHaveLength(1);
    expect(areas[0]).toBeCloseTo(Math.PI * 25);
  });

  it('transforms multiple handled variants', () => {
    const result = filterMap([circle, rectangle, triangle], {
      circle: ({ radius }) => `circle:${radius}`,
      rectangle: ({ width, height }) => `rect:${width}x${height}`,
    });
    expect(result).toEqual(['circle:5', 'rect:4x6']);
  });

  it('returns empty array when no handlers provided', () => {
    expect(filterMap([circle, rectangle], {})).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    expect(filterMap([] as Shape[], { circle: ({ radius }) => radius })).toEqual([]);
  });
});

describe('filterMap — undefined skips, null keeps', () => {
  it('skips items whose handler returns undefined', () => {
    const result = filterMap([circle, rectangle], {
      circle: ({ radius }) => (radius > 10 ? radius : undefined),
    });
    expect(result).toEqual([]);
  });

  it('keeps items whose handler returns null', () => {
    const result = filterMap([circle], {
      circle: () => null,
    });
    expect(result).toEqual([null]);
  });

  it('keeps 0 and empty string as valid values', () => {
    const result = filterMap([circle, rectangle], {
      circle: () => 0,
      rectangle: () => '',
    });
    expect(result).toEqual([0, '']);
  });
});

describe('filterMap — non-union items skipped', () => {
  it('skips null and non-union entries in the input array', () => {
    const mixed = [null, circle, undefined, rectangle] as any[];
    const result = filterMap(mixed, {
      circle: ({ radius }) => radius,
    });
    expect(result).toEqual([5]);
  });
});

describe('filterMap — custom discriminant', () => {
  const dog: Animal = { kind: 'dog', name: 'Rex' };
  const cat: Animal = { kind: 'cat', lives: 9 };

  it('transforms with custom discriminant', () => {
    const result = filterMap([dog, cat], {
      dog: ({ name }) => name.toUpperCase(),
    }, 'kind');
    expect(result).toEqual(['REX']);
  });
});

describe('filterMap — all handlers covered', () => {
  it('acts like map when all variants have handlers returning non-undefined', () => {
    const result = filterMap([circle, rectangle, triangle], {
      circle: ({ radius }) => radius,
      rectangle: ({ width, height }) => width * height,
      triangle: ({ base, height }) => (base * height) / 2,
    });
    expect(result).toEqual([5, 24, 15]);
  });
});
