export function flattenTree(roots, maxDepth = Infinity) {
  // SLS 1: Collection guard
  if (!Array.isArray(roots)) return [];
  const depthLimit = Number.isInteger(maxDepth) && maxDepth >= 0 ? maxDepth : Infinity;
  const output = [];
  const visited = new Set();
  const stack = [];

  // SLS 2: Seed in reverse so a stack preserves input preorder
  for (let index = roots.length - 1; index >= 0; index--) {
    stack.push({ node: roots[index], parentId: null, depth: 0, path: `$[${index}]` });
  }

  // SLS 3: Iterative depth-first traversal avoids recursive call depth limits
  while (stack.length > 0) {
    const frame = stack.pop();
    const node = frame.node;
    if (!node || typeof node !== 'object' || visited.has(node)) continue;
    visited.add(node);
    const id = node.id ?? null;
    output.push({
      id,
      value: node.value,
      parentId: frame.parentId,
      depth: frame.depth,
      path: frame.path
    });

    // SLS 4: Schedule children in reverse to preserve their original order
    if (Array.isArray(node.children) && frame.depth < depthLimit) {
      for (let childIndex = node.children.length - 1; childIndex >= 0; childIndex--) {
        const child = node.children[childIndex];
        if (child && typeof child === 'object' && !visited.has(child)) {
          stack.push({
            node: child,
            parentId: id,
            depth: frame.depth + 1,
            path: `${frame.path}.children[${childIndex}]`
          });
        }
      }
    }
  }

  // SLS 5: Return preorder records; repeated references are emitted once
  return output;
}
