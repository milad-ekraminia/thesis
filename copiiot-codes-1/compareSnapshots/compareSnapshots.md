# compareSnapshots

Contract: compare JSON-like values, report added/removed/changed leaf paths, handle
arrays as indexed objects, avoid infinite traversal on cyclic references, and sort paths.

- **SLS 1:** Explicit stack setup.
- **SLS 2:** Identity fast path and scalar/type mismatch reporting.
- **SLS 3:** Visited object-pair cycle guard.
- **SLS 4:** Key union and child scheduling.
- **SLS 5:** Deterministic path ordering.

