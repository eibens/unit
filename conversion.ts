/** MAIN **/

/** Defines a numeric conversion from a source to a target unit. */
export type Conversion<Unit> = {
  /** The input unit. */
  source: Unit;
  /** The output unit. */
  target: Unit;
  /** Converts from the source to the target unit. */
  apply: (x: number) => number;
};
