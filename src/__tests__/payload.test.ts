import { describe, it, expect } from 'vitest';
import { createPipeHandlers } from '../unions';
import { type Shape, circle, rectangle, triangle, ShapeFactory } from './fixtures';

type Context = { scale: number; label: string };
const ctx: Context = { scale: 2, label: 'test' };

const labeledAreaHandlers = {
  circle: ({ radius }: { radius: number }, p: Context) => `${p.label}:${radius * p.scale}`,
  rectangle: ({ width, height }: { width: number; height: number }, p: Context) => `${p.label}:${width * height * p.scale}`,
  triangle: ({ base, height }: { base: number; height: number }, p: Context) => `${p.label}:${(base * height) / 2 * p.scale}`,
};

const scaleShapeHandlers = {
  circle: ({ radius }: { radius: number }, p: Context) => ({ radius: radius * p.scale }),
  rectangle: ({ width, height }: { width: number; height: number }, p: Context) => ({
    width: width * p.scale,
    height: height * p.scale,
  }),
  triangle: ({ base, height }: { base: number; height: number }, p: Context) => ({
    base: base * p.scale,
    height: height * p.scale,
  }),
};

// ── createPipeHandlers bound forms ─────────────────────────────────────────

describe('createPipeHandlers with payload', () => {
  const shapeOps = createPipeHandlers<Shape, 'type'>('type');

  describe('match', () => {
    it('accepts payload as second arg to the returned function', () => {
      const fn = shapeOps.match<string, Context>(labeledAreaHandlers);
      expect(fn(circle, ctx)).toBe('test:10');
      expect(fn(rectangle, ctx)).toBe('test:48');
    });
  });

  describe('matchWithDefault', () => {
    const fn = shapeOps.matchWithDefault<string, Context>({
      circle: ({ radius }, p) => `${p.label}:${radius * p.scale}`,
      Default: (p) => `${p.label}:other`,
    });

    it('passes payload to matched handler', () => {
      expect(fn(circle, ctx)).toBe('test:10');
    });

    it('passes payload to Default when no variant matched', () => {
      expect(fn(triangle, ctx)).toBe('test:other');
    });
  });

  describe('map', () => {
    it('passes payload to handler', () => {
      const fn = shapeOps.map<Context>({
        circle: ({ radius }, p) => ({ radius: radius * p.scale }),
      });
      expect(fn(circle, ctx)).toEqual({ type: 'circle', radius: 10 });
    });
  });

  describe('mapAll', () => {
    it('passes payload to all handlers', () => {
      const fn = shapeOps.mapAll<Context>(scaleShapeHandlers);
      expect(fn(circle, ctx)).toEqual({ type: 'circle', radius: 10 });
      expect(fn(rectangle, ctx)).toEqual({ type: 'rectangle', width: 8, height: 12 });
    });
  });
});

// ── createUnion bound forms ────────────────────────────────────────────────

describe('createUnion with payload', () => {
  const Shape = ShapeFactory;

  it('match passes payload to handler', () => {
    const fn = Shape.match<string, Context>(labeledAreaHandlers);
    expect(fn(Shape.circle(5), ctx)).toBe('test:10');
  });

  it('matchWithDefault passes payload to Default', () => {
    const fn = Shape.matchWithDefault<string, Context>({
      circle: ({ radius }, p) => `${p.label}:${radius}`,
      Default: (p) => `${p.label}:unknown`,
    });
    expect(fn(Shape.triangle(10, 3), ctx)).toBe('test:unknown');
  });

  it('map passes payload to handler', () => {
    const fn = Shape.map<Context>({
      circle: ({ radius }, p) => ({ radius: radius * p.scale }),
    });
    expect(fn(Shape.circle(5), ctx)).toEqual({ type: 'circle', radius: 10 });
  });

  it('mapAll passes payload to all handlers', () => {
    const fn = Shape.mapAll<Context>(scaleShapeHandlers);
    expect(fn(Shape.rectangle(4, 6), ctx)).toEqual({
      type: 'rectangle',
      width: 8,
      height: 12,
    });
  });
});
