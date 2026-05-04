import { createUnion } from '../unions';

export type Shape =
  | { type: 'circle'; radius: number }
  | { type: 'rectangle'; width: number; height: number }
  | { type: 'triangle'; base: number; height: number };

export type Animal =
  | { kind: 'dog'; name: string }
  | { kind: 'cat'; lives: number }
  | { kind: 'bird'; canFly: boolean };

export const circle: Shape = { type: 'circle', radius: 5 };
export const rectangle: Shape = { type: 'rectangle', width: 4, height: 6 };
export const triangle: Shape = { type: 'triangle', base: 10, height: 3 };

export const dog: Animal = { kind: 'dog', name: 'Rex' };
export const cat: Animal = { kind: 'cat', lives: 9 };
export const bird: Animal = { kind: 'bird', canFly: true };
export const animals: Animal[] = [dog, cat, bird];

export const ShapeFactory = createUnion('type', {
  circle: (radius: number) => ({ radius }),
  rectangle: (width: number, height: number) => ({ width, height }),
  triangle: (base: number, height: number) => ({ base, height }),
});

export const areaHandlers = {
  circle: ({ radius }: { radius: number }) => Math.PI * radius ** 2,
  rectangle: ({ width, height }: { width: number; height: number }) => width * height,
  triangle: ({ base, height }: { base: number; height: number }) => (base * height) / 2,
};

export const doubleShapeData = {
  circle: ({ radius }: { radius: number }) => ({ radius: radius * 2 }),
  rectangle: ({ width, height }: { width: number; height: number }) => ({
    width: width * 2,
    height: height * 2,
  }),
  triangle: ({ base, height }: { base: number; height: number }) => ({
    base: base * 2,
    height: height * 2,
  }),
};

export const transformAnimalData = {
  dog: ({ name }: { name: string }) => ({ name: name.toUpperCase() }),
  cat: ({ lives }: { lives: number }) => ({ lives: lives + 1 }),
  bird: ({ canFly }: { canFly: boolean }) => ({ canFly: !canFly }),
};
