# unit

[unit](#) is an extensible library for strongly-typed unit conversions in
TypeScript for Deno.

<!-- badges -->

[![License](https://img.shields.io/github/license/eibens/unit?color=informational)](LICENSE)
[![Repository](https://img.shields.io/github/v/tag/eibens/unit?label&logo=github)](https://github.com/eibens/unit)
[![ci](https://github.com/eibens/unit/actions/workflows/ci.yml/badge.svg)](https://github.com/eibens/unit/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/eibens/unit/branch/master/graph/badge.svg?token=OV98O91EJ1)](https://codecov.io/gh/eibens/unit)

<!-- /badges -->

# Conversions

The [`convert` function](convert.ts) converts a numeric `value` in a `source`
unit to a value in a `target` unit using a `system` of conversions. For example,
the code below converts the value `0.5` from `"hour"` to `"second"` using a
[predefined system](#predefined-systems), and tests whether the result is
`1800`. The names of the units are strongly-typed:

```ts
import { convert, SiTime } from "./mod.ts";

const result = convert({
  value: 0.5,
  source: "hour",
  target: "second",
  system: SiTime.getSystem(),
});

console.assert(result === 1800);
```

# Systems

A system is a set of [`Conversion` objects](conversion.ts). For example, the
code below defines conversions from `"hour"` to `"minute"` and from `"minute"`
to `"second"`. Plugging this system into the `convert` function yields the same
result as before:

```ts
import { Conversion, convert } from "./mod.ts";

type Unit =
  | "hour"
  | "second"
  | "minute";

const system: Conversion<Unit>[] = [{
  source: "hour",
  target: "minute",
  apply: (value) => value * 60,
}, {
  source: "minute",
  target: "second",
  apply: (value) => value * 60,
}];

const result = convert({
  value: 0.5,
  source: "hour",
  target: "second",
  system,
});

console.assert(result === 1800);
```

Note how there is no explicit conversion function from `"hour"` to `"second"`,
but an implicit conversion exists via the `"minute"` unit. The `convert`
function automatically finds the `hour -> minute -> second` path and chains the
conversion functions.

If we wanted to convert back from `"second"` to `"hour"`, two additional
conversions could be added to the system: one from `"second"` to `"minute"` and
one from `"minute"` to `"hour"`. There is a simpler way to do this using a
[parametric system](#parametric-systems).

## Parametric Systems

Conversions in a system sometimes require parameters. For example, in a
[musical time unit system](systems/music_time.ts), a `tempo` parameter is needed
to convert from `"beat"` to `"second"`. Parametric systems can further be
generic, which means they are not bound to a specific set of units. Such systems
can be used to compose larger systems from smaller ones.

An example of a generic, parametric system is the
[`Factor` system](systems/factor.ts). It takes `target` unit, a `factor`, and a
`source` unit, and returns a system that consists of two conversions: one
multiplies the `source` unit by the `factor` and one divides the `target` unit
by the `factor`. For example, one can build a partial
[`SiTime` system](systems/si_time.ts) by concatenating two
[`Factor` systems](systems/factor.ts):

```ts
import { Conversion, convert, Factor } from "./mod.ts";

type Unit =
  | "hour"
  | "second"
  | "minute";

const system: Conversion<Unit>[] = [
  ...Factor.getSystem("hour", 60, "minute"),
  ...Factor.getSystem("minute", 60, "second"),
];

const result = convert({
  value: 0.5,
  source: "hour",
  target: "second",
  system,
});

console.assert(result === 1800);
```

## Predefined Systems

The package comes with predefined systems, each with a `Unit` type and a
`getSystem` function that generates a minimal spanning-tree of conversions.
While still very limited in number, they may serve as a starting point for
building custom systems:

- [`SiTime`](systems/si_time.ts) is a constant system for SI time units.
- [`MusicTime`](systems/music_time.ts) is a parametric system for musical time
  units.
- [`Factor`](systems/factor.ts) is a generic system for multiplicative
  conversions.

# Future Work

- Conversion DSL.
- Predefined systems for common units.
- Support for unit abbreviations or aliases.
- Multi-dimensional conversions (e.g. `m/s -> km/h`).
- Additional parametric systems (e.g. `Linear` for `K -> °C`, `Exp` for
  `dB -> ratio`).
