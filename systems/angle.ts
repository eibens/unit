/** LOCALS **/

import { Conversion } from "../conversion.ts";
import { getSystem as factor } from "./factor.ts";

/** MAIN **/

export const TAU = 2 * Math.PI;

export type Unit =
  | "turn"
  | "degree"
  | "radian"
  | "milliradian"
  | "arcminute"
  | "arcsecond"
  | "gradian";

export function getSystem(): Conversion<Unit>[] {
  return [
    ...factor<Unit>("turn", 360, "degree"),
    ...factor<Unit>("turn", TAU, "radian"),
    ...factor<Unit>("radian", 1000, "milliradian"),
    ...factor<Unit>("degree", 60, "arcminute"),
    ...factor<Unit>("arcminute", 60, "arcsecond"),
    ...factor<Unit>("turn", 400, "gradian"),
  ];
}
