export function matchHttpRoute(routeTree, method, path) {
  // SLS 1: Parameter guards
  if (!routeTree || typeof routeTree !== 'object') return null;
  if (typeof method !== 'string' || typeof path !== 'string') return null;

  const normalizedMethod = method.toUpperCase();
  const rawSegments = path.split('/').filter(Boolean);
  const segments = rawSegments.length === 0 ? [''] : rawSegments;

  let current = routeTree;
  const params = {};
  let depth = 0;

  // SLS 2: Hierarchical segment traversal
  while (depth < segments.length) {
    const seg = segments[depth];
    if (!current.children) return null;

    // SLS 3: Priority-based match: Exact -> Dynamic (:id) -> Wildcard (*)
    if (current.children[seg]) {
      current = current.children[seg];
    } else if (current.paramChild) {
      current = current.paramChild;
      params[current.paramName] = decodeURIComponent(seg);
    } else if (current.wildcardChild) {
      current = current.wildcardChild;
      // Capture remaining segments into wildcard
      params['wildcard'] = segments.slice(depth).map(decodeURIComponent).join('/');
      depth = segments.length; // Jump to end
      break;
    } else {
      return null; // Route not found
    }
    depth++;
  }

  // SLS 4: Method dictionary validation
  if (!current.handlers || !current.handlers[normalizedMethod]) {
    // Check fallback catch-all handler
    if (current.handlers && current.handlers['ALL']) {
      return { handler: current.handlers['ALL'], params, isCatchAll: true };
    }
    return { error: "METHOD_NOT_ALLOWED", allowedMethods: Object.keys(current.handlers || {}) };
  }

  // SLS 5: Matched handler extraction
  return { handler: current.handlers[normalizedMethod], params, isCatchAll: false };
}
