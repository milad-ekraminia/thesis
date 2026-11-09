export function findShortestPath(graph, start, goal) {
  // SLS 1: Validate the graph container and endpoint identifiers
  if (!graph || typeof graph !== 'object' || typeof start !== 'string' || typeof goal !== 'string') {
    return { path: [], distance: Infinity, error: 'INVALID_INPUT' };
  }
  if (!(start in graph) || !(goal in graph)) return { path: [], distance: Infinity, error: 'UNKNOWN_NODE' };
  const distances = new Map();
  const previous = new Map();
  const visited = new Set();
  for (const node of Object.keys(graph)) distances.set(node, Infinity);
  distances.set(start, 0);

  // SLS 2: Dijkstra selection loop over the unvisited node with minimum distance
  while (true) {
    let current = null;
    let bestDistance = Infinity;
    for (const [node, distance] of distances.entries()) {
      if (!visited.has(node) && distance < bestDistance) {
        current = node;
        bestDistance = distance;
      }
    }
    if (current === null) break;
    if (current === goal) break;
    visited.add(current);
    const edges = Array.isArray(graph[current]) ? graph[current] : [];

    // SLS 3: Validate outgoing edges and relax their distances
    for (let index = 0; index < edges.length; index++) {
      const edge = edges[index];
      if (!edge || typeof edge.to !== 'string' || !Number.isFinite(edge.weight) || edge.weight < 0) continue;
      if (!distances.has(edge.to)) continue;
      const candidate = bestDistance + edge.weight;
      if (candidate < distances.get(edge.to)) {
        distances.set(edge.to, candidate);
        previous.set(edge.to, current);
      }
    }
  }

  // SLS 4: Distinguish an unreachable target from a valid zero-distance route
  const distance = distances.get(goal);
  if (!Number.isFinite(distance)) return { path: [], distance: Infinity, error: 'UNREACHABLE' };

  // SLS 5: Walk predecessor links backwards, then reverse to source-to-target order
  const path = [];
  let cursor = goal;
  while (cursor !== undefined) {
    path.push(cursor);
    if (cursor === start) break;
    cursor = previous.get(cursor);
  }
  path.reverse();
  return { path, distance, error: null };
}
