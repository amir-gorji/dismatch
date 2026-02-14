import { describe, it, expect } from 'vitest';
import { isUnion, is } from '../module';

type Shape =
  | { type: 'circle'; radius: number }
  | { type: 'rectangle'; width: number; height: number };

describe('isUnion', () => {
  it('should return true for object with truthy type property', () => {
    expect(isUnion({ type: 'circle' })).toBe(true);
  });

  it('should return true for object with type and additional data', () => {
    expect(isUnion({ type: 'circle', radius: 5 })).toBe(true);
  });

  it('should return false for null', () => {
    expect(isUnion(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isUnion(undefined)).toBe(false);
  });

  it('should return false for string primitive', () => {
    expect(isUnion('hello')).toBe(false);
  });

  it('should return false for number primitive', () => {
    expect(isUnion(42)).toBe(false);
  });

  it('should return false for boolean primitive', () => {
    expect(isUnion(true)).toBe(false);
  });

  it('should return false for empty object (no type property)', () => {
    expect(isUnion({})).toBe(false);
  });

  it('should return true for object with empty string type (still a string)', () => {
    expect(isUnion({ type: '' })).toBe(true);
  });

  it('should return false for arrays', () => {
    expect(isUnion([1, 2, 3])).toBe(false);
  });

  it('should return false for array with type-like element', () => {
    expect(isUnion([])).toBe(false);
  });

  it('should return false for object with numeric type', () => {
    expect(isUnion({ type: 123 })).toBe(false);
  });

  it('should return false for object with boolean type', () => {
    expect(isUnion({ type: true })).toBe(false);
  });
});

describe('is', () => {
  const circle: Shape = { type: 'circle', radius: 5 };
  const rectangle: Shape = { type: 'rectangle', width: 4, height: 6 };

  it('should return true when type matches', () => {
    expect(is(circle, 'circle')).toBe(true);
  });

  it('should return false when type does not match', () => {
    expect(is(circle, 'rectangle')).toBe(false);
  });

  it('should return true for rectangle variant', () => {
    expect(is(rectangle, 'rectangle')).toBe(true);
  });

  it('should return false for rectangle checked as circle', () => {
    expect(is(rectangle, 'circle')).toBe(false);
  });

  it('should narrow the type correctly (compile-time verified)', () => {
    const shape: Shape = { type: 'circle', radius: 10 };

    if (is(shape, 'circle')) {
      // TypeScript narrows shape to { type: 'circle'; radius: number }
      expect(shape.radius).toBe(10);
    } else {
      // This branch should not execute
      expect.unreachable('Expected circle variant');
    }
  });

  it('should narrow rectangle variant correctly', () => {
    const shape: Shape = { type: 'rectangle', width: 3, height: 7 };

    if (is(shape, 'rectangle')) {
      expect(shape.width).toBe(3);
      expect(shape.height).toBe(7);
    } else {
      expect.unreachable('Expected rectangle variant');
    }
  });
});
