# flattenTree

Contract: flatten node objects in preorder, preserve child order, include parent ID,
depth, and path, obey a maximum depth, and emit repeated references only once.

- **SLS 1:** Non-array fallback.
- **SLS 2:** Reverse stack seeding for stable traversal order.
- **SLS 3:** Iterative pop, validation, and identity-based cycle guard.
- **SLS 4:** Reverse child scheduling, path extension, and depth cutoff.
- **SLS 5:** Flattened record output.
