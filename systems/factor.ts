/** LOCALS **/

import { Conversion } from "../conversion.ts";

/** MAIN **/

/**
 * Generates conversions from a source to a target unit and vice versa
 * using a numeric factor. These are the generated conversions:
 *
 * 1. source -> target by multiplication
 * 2. target -> source by division
 *
 * @param target is the target unit.
 * @param factor is the factor applied to the source unit.
 * @param source is the source unit.
 * @returns the two conversions.
 */
export function getSystem<Unit extends string>(
  target: Unit,
  factor: number,
  source: Unit,
): Conversion<Unit>[] {
  return [{
    source,
    target,
    apply: (x) => x / factor,
  }, {
    source: target,
    target: source,
    apply: (x) => x * factor,
  }];
}
