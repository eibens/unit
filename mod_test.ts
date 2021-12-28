/** LOCALS **/

import { assertEquals } from "./deps/asserts.ts";
import { Conversion, convert, MusicTime, SiTime } from "./mod.ts";

/** HELPERS **/

type Unit = SiTime.Unit | MusicTime.Unit;

const system: Conversion<Unit>[] = [
  SiTime.getSystem(),
  MusicTime.getSystem({
    span: 2,
    tempo: 120,
    beats: 4,
    beatType: 4,
  }),
].flat();

type Value = [number, Unit];
const cases: [Value, Value][] = [
  [[1, "second"], [1, "second"]],
  [[1, "minute"], [60, "second"]],
  [[1, "hour"], [60, "minute"]],
  [[1, "millisecond"], [1 / 1000, "second"]],
  [[1, "microsecond"], [1 / 1000, "millisecond"]],
  [[1, "microsecond"], [1000, "nanosecond"]],
  [[1, "beat"], [0.5, "second"]],
  [[1, "measure"], [2, "second"]],
  [[1, "whole"], [2, "second"]],
  [[1, "half"], [1, "second"]],
  [[1, "quarter"], [1 / 2, "second"]],
  [[1, "eighth"], [1 / 4, "second"]],
  [[1, "sixteenth"], [1 / 8, "second"]],
  [[2, "relative"], [4, "second"]],
  [[2, "percent"], [0.04, "second"]],
  [[2, "second"], [2, "second"]],
  [[2, "minute"], [120, "second"]],
  [[2, "hour"], [7200, "second"]],
  [[2, "beat"], [1, "second"]],
  [[2, "measure"], [4, "second"]],
  [[2, "whole"], [4, "second"]],
  [[2, "half"], [2, "second"]],
  [[2, "quarter"], [1, "second"]],
  [[2, "eighth"], [1 / 2, "second"]],
  [[2, "sixteenth"], [1 / 4, "second"]],
];

function testConversion(a: Value, b: Value) {
  Deno.test(`convert(${a.join(" ")}) === ${b.join(" ")}`, () => {
    assertEquals(
      convert({
        system,
        source: a[1],
        target: b[1],
        value: a[0],
      }),
      b[0],
    );
  });
}

/** MAIN **/

cases.forEach(([a, b]) => {
  testConversion(a, b);
  testConversion(b, a);
});
