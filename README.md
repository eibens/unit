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

A system is a set of [`Conversion`](conversion.ts) objects. For example, the
code below defines conversions from `"hour"` to `"minute"` and from `"minute"`
to `"second"`. Plugging this system into the `convert` function yields the same
result as before. Note how there is no explicit conversion function from
`"hour"` to `"second"`, but an implicit conversion exists via the `"minute"`
unit. The `convert` function automatically finds the `hour -> minute -> second`
path and chains the conversion functions:

```ts
import { Conversion, convert } from "./mod.ts";

type Unit =
  | "hour"
  | "second"
  | "minute";

function getSystem(): Conversion<Unit>[] {
  return [{
    source: "hour",
    target: "minute",
    apply: (value) => value * 60,
  }, {
    source: "minute",
    target: "second",
    apply: (value) => value * 60,
  }];
}

const result = convert({
  value: 0.5,
  source: "hour",
  target: "second",
  system: getSystem(),
});

console.assert(result === 1800);
```

## Parametric Systems

Systems sometimes depend on external parameters. For example, in a
[musical time unit system](systems/music_time.ts) a `tempo` parameter is needed
to convert from `"beat"` to `"second"`. Parameters can be passed to the
`getSystem` function:

```ts
import { Conversion, convert } from "./mod.ts";

type Unit =
  | "beat"
  | "second";

type Options = {
  tempo: number;
};

function getSystem(options: Options): Conversion<Unit>[] {
  return [{
    source: "beat",
    target: "second",
    apply: (value) => value * 60 / options.tempo,
  }];
}

const result = convert({
  value: 1,
  source: "beat",
  target: "second",
  system: getSystem({
    tempo: 120,
  }),
});

console.assert(result === 0.5);
```

## Generic Systems

Generic systems are not bound to a specific set of units and can thus be used as
templates for other unit systems. For example, the
[`Factor` system](systems/factor.ts) takes a `target` unit, numeric `factor`,
and `source` unit, and returns a system that consists of two conversions: one
multiplies the `source` unit by the `factor` and one divides the `target` unit
by the `factor`:

```ts
import { Conversion, convert, Factor } from "./mod.ts";

type Unit =
  | "minute"
  | "second";

const result = convert({
  value: 30,
  source: "second",
  target: "minute",
  system: Factor.getSystem<Unit>("minute", 60, "second"),
});

console.assert(result === 0.5);
```

## Composite Systems

Since a system is an array of conversions, two systems can be merged by
concatenating their arrays. For example, one can build a system for converting
between `"hour"`, `"minute"`, and `"second"` by concatenating two
[`Factor` systems](systems/factor.ts):

```ts
import { Conversion, convert, Factor } from "./mod.ts";

type Unit =
  | "hour"
  | "second"
  | "minute";

function getSystem(): Conversion<Unit>[] {
  return [
    ...Factor.getSystem("hour", 60, "minute"),
    ...Factor.getSystem("minute", 60, "second"),
  ];
}

const result = convert({
  value: 0.5,
  source: "hour",
  target: "second",
  system: getSystem(),
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

- Unit abbreviations or aliases (e.g. `second = s`).
- Unit parsing (e.g. `"1s" -> [1, "second"]`).
- Predefined systems for common units (e.g. weight, length).
- Additive conversion (e.g. `1h2m3s -> 1h + 2m + 3s`).
- Multi-dimensional conversions (e.g. `1 m/s -> 3.6 km/h`).
- More generic systems (e.g. `Linear` for `K -> °C`, `Exp` for `dB -> ratio`).
- Conversion DSL (e.g. `time("0.5h").to("s")`)
