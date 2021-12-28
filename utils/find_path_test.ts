/** LOCALS **/

import { assert, assertEquals, assertThrows } from "../deps/asserts.ts";
import { findPath } from "./find_path.ts";

/** HELPERS **/

const defaultOptions = {
  equals: (a: string, b: string) => a === b,
  getSource: (e: [string, string]) => e[0],
  getTarget: (e: [string, string]) => e[1],
};

/** MAIN **/

Deno.test("always finds the trivial path from a vertex to itself", () => {
  const path = findPath({
    ...defaultOptions,
    edges: [],
    source: "a",
    target: "a",
  });
  assertEquals(path, []);
});

Deno.test("finds an existing edge by reference", () => {
  const edge: [string, string] = ["a", "b"];
  const path = findPath({
    ...defaultOptions,
    edges: [edge],
    source: "a",
    target: "b",
  });
  assert(edge === path[0]);
});

Deno.test("finds a path between two non-neighboring vertices", () => {
  const path = findPath({
    ...defaultOptions,
    edges: [["a", "b"], ["b", "c"]],
    source: "a",
    target: "c",
  });
  assertEquals(path, [["a", "b"], ["b", "c"]]);
});

Deno.test("does not get stuck in a circle", () => {
  const path = findPath({
    ...defaultOptions,
    edges: [["a", "b"], ["b", "a"], ["b", "c"]],
    source: "a",
    target: "c",
  });
  assertEquals(path.length, 2);
});

Deno.test("throws if vertices are not connected", () => {
  assertThrows(() => {
    findPath({
      ...defaultOptions,
      edges: [],
      source: "a",
      target: "b",
    });
  }, Error);
});
