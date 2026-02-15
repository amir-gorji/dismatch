import { is, map, mapAll, match, matchWithDefault, UnionByArray } from '.';

type A = { type: 'A'; a: number };
type B = { type: 'B'; b: string };
type C = { type: 'C'; c: boolean };

type Model = UnionByArray<[A, B, C]>;

const x: Model = {} as any;

// Enforces exhaustiveness
match(x)<boolean>({
  A: (a) => a.a > 20,
  B: (b) => b.b.length > 5,
  C: (c) => c.c,
});

matchWithDefault(x)({
  A: (a) => {
    console.log('A');
  },
  B: (b) => console.log('B'),
  Default: () => {
    console.log('Default functionality');
  },
});

const updateddX = map(x)({
  A: (a) => ({ ...a, a: 1 }),
  B: (b) => ({ ...b, b: 'new B' }),
  C: (c) => ({ ...c, c: false }),
});

// Enforces exhaustiveness
const updatedX = mapAll(x)({
  A: (a) => ({ ...a, a: 1 }),
  B: (b) => ({ ...b, b: 'new B' }),
  C: (c) => ({ ...c, c: false }),
});

if (is(x, 'A')) {
  console.log(x.a);
}
