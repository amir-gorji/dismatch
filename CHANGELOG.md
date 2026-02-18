# Changelog

## [0.1.1] - 2026-02-18

### Added
- MIT License

### Changed
- Discriminant generic parameter constraint widened from `string` to `string | number | symbol` across all types (`SampleUnion`, `Model`, `Matcher`, `MatcherWithDefault`, `Mapper`, `MapperAll`) and all functions (`match`, `matchWithDefault`, `map`, `mapAll`, `is`, `isUnion`)
- `UnionByArray` utility type updated to accept `string | number | symbol` discriminant
- New internal `TakeDiscriminant` utility type added to `types.ts`
- Improved tree shaking via updated package exports and `tsup` build config
- README improvements

## [0.1.0] - 2026-02-18

### Added
- Customizable discriminant property name across all APIs (`match`, `matchWithDefault`, `map`, `mapAll`, `is`, `isUnion`)
- All functions now accept an optional `discriminant` parameter (defaults to `'type'` for backward compatibility)
- `Model`, `SampleUnion`, `Matcher`, `MatcherWithDefault`, `Mapper`, `MapperAll` types updated with `Discriminant` generic parameter

### Fixed
- `match()` was not passing discriminant to `isUnion()` and `Module.match()`
