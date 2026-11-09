# buildDependencyLayers

Contract: group valid tasks into deterministic topological layers; reject unknown
dependencies and cycles; ignore self-links and repeated dependency edges.

- **SLS 1:** Task collection guard.
- **SLS 2:** Unique task registration and malformed-task counting.
- **SLS 3:** Dependency graph construction and unknown references.
- **SLS 4:** Ready-layer discovery and cycle detection.
- **SLS 5:** Success and invalid-row metadata.

