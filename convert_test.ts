/** LOCALS **/

import { convert, ConvertOptions } from "./convert.ts";
import { assertEquals } from "./deps/asserts.ts";
import { Conversion } from "./conversion.ts";

/** MAIN **/

Deno.test("convert works", () => {
  type LengthUnit = "m" | "cm" | "km";

  const system: Conversion<LengthUnit>[] = [
    { source: "m", target: "km", apply: (x) => x / 1000 },
    { source: "cm", target: "m", apply: (x) => x / 100 },
  ];

  const options: ConvertOptions<LengthUnit> = {
    system,
    value: 100,
    source: "cm",
    target: "km",
  };

  const result = convert(options);
  assertEquals(result, 0.001);
});
