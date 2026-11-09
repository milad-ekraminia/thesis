# findShortestPath

Contract: run Dijkstra on a directed adjacency-list graph with finite non-negative
weights; return a path, distance, and a clear error for invalid/unknown/unreachable inputs.

- **SLS 1:** Graph and endpoint validation.
- **SLS 2:** Minimum-distance unvisited selection and termination.
- **SLS 3:** Edge guards and relaxation.
- **SLS 4:** Unreachable detection.
- **SLS 5:** Predecessor reconstruction.

