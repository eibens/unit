/** LOCALS **/

import { Conversion } from "./conversion.ts";
import { findPath } from "./utils/find_path.ts";

/** MAIN **/

/**
 * Defines a numeric conversion between two units in a unit system.
 */
export type ConvertOptions<Unit> = {
  /** A set of pairwise conversions between units. */
  system: Conversion<Unit>[];
  /** The input value. */
  value: number;
  /** The input unit. */
  source: Unit;
  /** The output unit. */
  target: Unit;
};

/**
 * Converts a value from one unit to another.
 *
 * The system can be seen as a directed graph, where the vertices are `Unit`s
 * and the edges are `Conversion<Unit>`s. For example, a conversion from meter
 * to kilometer defines an edge from the 'm' unit to the 'km' unit.
 *
 * A chain of conversions can be seen as a path through the graph. For
 * example, a conversion from 'mm' to 'km' can be achieved by a conversion
 * from 'mm' to 'm' and from 'm' to 'km'. A unit can be converted to another
 * iff there exists a path between them.
 *
 * @param options define the conversion.
 * @returns the converted value in the target unit.
 * @throws if the unit system has no path for the conversion.
 */
export function convert<Unit extends string>(
  options: ConvertOptions<Unit>,
): number {
  // Find the conversion path.
  const path = findPath<Unit, Conversion<Unit>>({
    source: options.source,
    target: options.target,
    edges: options.system,
    equals: (a, b) => a === b,
    getSource: (edge) => edge.source,
    getTarget: (edge) => edge.target,
  });
  // Chain the conversions.
  return path.reduce((acc, edge) => edge.apply(acc), options.value);
}
