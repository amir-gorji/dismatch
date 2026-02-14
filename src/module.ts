import {
  Mapper,
  MapperAll,
  Matcher,
  MatcherWithDefault,
  SampleUnion,
} from './types';

/**
 * Type predicate that checks whether the given value is a valid discriminated union
 * (a non-null object with a string `type` property).
 *
 * @param input - The value to check
 * @returns `true` if the value is an object with a string `type` property, `false` otherwise
 *
 * @example
 * ```ts
 * isUnion({ type: 'circle', radius: 5 }); // true
 * isUnion({ name: 'not a union' });        // false
 * isUnion(null);                            // false
 * isUnion({ type: 123 });                   // false
 * ```
 */
export function isUnion(input: any): input is SampleUnion {
  return (
    typeof input === 'object' &&
    input !== null &&
    typeof input.type === 'string'
  );
}

/**
 * Core implementation of exhaustive pattern matching.
 * Looks up the handler for the union's `type` discriminant and invokes it.
 *
 * @internal Used by the public API in `unions.ts`. Not exported directly.
 */
function match<T extends SampleUnion, Result>(
  union: T,
  matcher: Matcher<T, Result>,
): Result {
  const fn = matcher[union.type as keyof Matcher<T, Result>];
  if (!fn) {
    throw new Error('Matcher incomplete!');
  }

  return fn(union as Parameters<typeof fn>[0]);
}

/**
 * Core implementation of non-exhaustive pattern matching with a default fallback.
 * If no handler exists for the union's `type`, the `Default` handler is called.
 *
 * @internal Used by the public API in `unions.ts`. Not exported directly.
 */
function matchWithDefault<T extends SampleUnion, Result>(
  union: T,
  matcher: MatcherWithDefault<T, Result>,
): Result {
  const fn = matcher[union.type as keyof Matcher<T, Result>];
  if (!fn) {
    return matcher['Default']();
  }

  return fn(union as Parameters<typeof fn>[0]);
}

/**
 * Core implementation of partial transformation.
 * Delegates to `matchWithDefault` with a `Default` that returns the union unchanged.
 *
 * @internal Used by the public API in `unions.ts`. Not exported directly.
 */
function map<T extends SampleUnion>(union: T, mapper: Mapper<T>): T {
  return matchWithDefault<T, T>(union, {
    ...mapper,
    Default: () => union,
  });
}

/**
 * Core implementation of full transformation.
 * Delegates to `map` — since all handlers are required by `MapperAll`,
 * the identity default in `map` is never reached.
 *
 * @internal Used by the public API in `unions.ts`. Not exported directly.
 */
function mapAll<T extends SampleUnion>(union: T, mapper: MapperAll<T>): T {
  return map<T>(union, mapper);
}

/**
 * Type guard that narrows a discriminated union to a specific variant
 * by checking whether the `type` discriminant matches the given string.
 *
 * @typeParam T - The discriminated union type (must have a `type` property)
 * @typeParam U - The specific type literal to check against
 * @param union - The discriminated union value to check
 * @param type - The type discriminant string to match against
 * @returns `true` if `union.type === type`, narrowing the union to `Extract<T, { type: U }>`
 *
 * @example
 * ```ts
 * type Shape =
 *   | { type: 'circle'; radius: number }
 *   | { type: 'rectangle'; width: number; height: number };
 *
 * declare const shape: Shape;
 *
 * if (is(shape, 'circle')) {
 *   // shape is narrowed to { type: 'circle'; radius: number }
 *   console.log(shape.radius);
 * }
 * ```
 */
export function is<T extends { type: string }, U extends T['type']>(
  union: T,
  type: U,
): union is Extract<T, { type: U }> {
  return union.type === type;
}

/**
 * Internal module containing the core implementations of pattern matching
 * and transformation functions. These are consumed by the public API in `unions.ts`,
 * which adds input validation and clean stack traces.
 *
 * @internal
 */
export const Module = {
  match,
  matchWithDefault,
  map,
  mapAll,
};
