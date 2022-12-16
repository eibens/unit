/** MAIN **/

/** Defines options for finding a path between two vertices in a graph. */
export type FindPathOptions<Vertex, Edge> = {
  /** A set of edges that define a directed graph. */
  edges: Edge[];
  /** Start vertex of the path. */
  source: Vertex;
  /** End vertex of the path. */
  target: Vertex;
  /** An equality operator for comparing vertices. */
  equals: (u: Vertex, v: Vertex) => boolean;
  /** Returns the source vertex of an edge. */
  getSource: (edge: Edge) => Vertex;
  /** Returns the target vertex of an edge. */
  getTarget: (edge: Edge) => Vertex;
};

/**
 * Finds a sequence of edges that connects two vertices of a directed graph.
 *
 * The function is generic to allow a caller to operate directly on their own
 * graphical data structure without an intermediate mapping step.
 *
 * @param options are the input parameters for the search.
 * @returns a sequence of edges that connects the two vertices.
 */
export function findPath<Vertex, Edge>(
  options: FindPathOptions<Vertex, Edge>,
): Edge[] {
  const visited: Set<Vertex> = new Set();

  const queue: {
    source: Vertex;
    target: Vertex;
    path: Edge[];
  }[] = [{
    source: options.source,
    target: options.target,
    path: [],
  }];

  while (queue.length > 0) {
    const { path, source, target } = queue.shift()!;

    if (options.equals(source, target)) {
      return path;
    }

    if (visited.has(source)) {
      continue;
    }

    visited.add(source);

    for (const edge of options.edges) {
      const edgeSource = options.getSource(edge);
      const edgeTarget = options.getTarget(edge);
      if (options.equals(edgeSource, source)) {
        queue.push({
          source: edgeTarget,
          target,
          path: [...path, edge],
        });
      }
    }
  }

  throw new Error(
    `No path exists between vertex '${options.source}' and vertex '${options.target}'`,
  );
}
