/** LOCALS **/

import { Conversion } from "../conversion.ts";
import { getSystem as factor } from "./factor.ts";

/** MAIN **/

export type Unit =
  | "hour"
  | "minute"
  | "second"
  | "millisecond"
  | "microsecond"
  | "nanosecond";

export function getSystem(): Conversion<Unit>[] {
  return [
    factor("hour", 60, "minute"),
    factor("minute", 60, "second"),
    factor("second", 1000, "millisecond"),
    factor("millisecond", 1000, "microsecond"),
    factor("microsecond", 1000, "nanosecond"),
  ].flat();
}
