/** LOCALS **/

import { Conversion } from "../conversion.ts";
import { getSystem as factor } from "./factor.ts";

/** MAIN **/

export type Unit =
  | "relative"
  | "percent"
  | "second"
  | "whole"
  | "half"
  | "quarter"
  | "eighth"
  | "sixteenth"
  | "beat"
  | "measure"
  | "whole";

export type Options = {
  tempo: number;
  beats: number;
  beatType: number;
  span: number;
};

export function getSystem(
  options: Options,
): Conversion<Unit>[] {
  return [
    factor("whole", 2, "half"),
    factor("whole", 4, "quarter"),
    factor("whole", 8, "eighth"),
    factor("whole", 16, "sixteenth"),
    factor("second", options.tempo / 60, "beat"),
    factor("measure", options.beats, "beat"),
    factor("whole", options.beatType, "beat"),
    factor("relative", 100, "percent"),
    factor("relative", options.span, "second"),
  ].flat();
}
