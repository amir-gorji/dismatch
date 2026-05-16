import {
  createUnion,
  match,
  matchWithDefault,
  find,
  some,
  every,
  groupBy,
  filterMap,
  type InferUnion,
} from 'dismatch';

const Result = createUnion('type', {
  ok: (data: string) => ({ data }),
  error: (message: string) => ({ message }),
  loading: () => ({}),
});

type Result = InferUnion<typeof Result>;

const value: Result = Result.ok(' hello ');

const label = Result.match({
  ok: ({ data }) => data.trim(),
  error: ({ message }) => message,
  loading: () => 'loading',
});

const trim = Result.map({
  ok: ({ data }) => ({ data: data.trim() }),
  error: ({ message }) => ({ message: message.trim() }),
});

const trimmed: Result = trim(value);

const size: number = match(trimmed)({
  ok: ({ data }) => data.length,
  error: ({ message }) => message.length,
  loading: () => 0,
});

label(trimmed);
size;

const DefaultResult = createUnion({
  ok: (data: string) => ({ data }),
  error: (message: string) => ({ message }),
});

type DefaultResult = InferUnion<typeof DefaultResult>;

const defaultValue: DefaultResult = DefaultResult.ok(' hello ');
const defaultLabel = DefaultResult.match({
  ok: ({ data }) => data.trim(),
  error: ({ message }) => message,
});

const okType: 'ok' = DefaultResult.ok('ok').type;

defaultLabel(defaultValue);
okType;

createUnion('type', {
  broken: () => ({
    // @ts-expect-error createUnion injects the discriminant automatically
    type: 'broken',
  }),
});

createUnion({
  broken: () => ({
    // @ts-expect-error createUnion injects the default "type" discriminant automatically
    type: 'broken',
  }),
});

Result.map({
  error: ({ message }) => ({ message }),
});

({
  // @ts-expect-error map handlers cannot override the discriminant
  type: 'ok',
  message: '',
}) satisfies ReturnType<NonNullable<Parameters<typeof Result.map>[0]['error']>>;

declare const anyResult: Result;

// Default receives the full union item — narrow with item.type inside Default
matchWithDefault(anyResult)({
  ok: ({ data }) => data.length,
  Default: (item) => {
    item.type; // discriminant always present — compiles
    // @ts-expect-error 'data' does not exist on all variants of Result
    item.data;
    return 0;
  },
});

// Default: () => result (no declared params) still compiles — non-breaking
matchWithDefault(anyResult)({
  ok: ({ data }) => data.length,
  Default: () => 0,
});

declare const results: Result[];

// find — narrows to the specific variant or undefined
const found: { type: 'ok'; data: string } | undefined = find(results, 'ok');

// some / every — boolean predicates
const hasOk: boolean = some(results, 'ok');
const allOk: boolean = every(results, 'ok');
const multiSome: boolean = some(results, ['ok', 'loading'] as const);

// groupBy — each group is narrowed to the variant type
const groups = groupBy(results);
const okGroup: { type: 'ok'; data: string }[] | undefined = groups.ok;
const okGroupOrEmpty: { type: 'ok'; data: string }[] = groups.ok ?? [];
const boundGroups = Result.groupBy(results);
const boundOkGroup: { type: 'ok'; data: string }[] | undefined = boundGroups.ok;

// filterMap — transforms and filters in one pass
const lengths: number[] = filterMap(results, {
  ok: ({ data }) => data.length,
  // error and loading omitted — silently skipped
});

found; hasOk; allOk; multiSome; okGroup; okGroupOrEmpty; boundOkGroup; lengths;
