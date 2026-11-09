# reconcileInventory

Contract: sum duplicate SKU quantities within each snapshot, compare the union of
SKUs, include additions/removals, sort changes, and count malformed rows.

- **SLS 1:** Two-snapshot input guard.
- **SLS 2:** Shared validation/indexing pass for both snapshots.
- **SLS 3:** Sorted union traversal, including missing-as-zero branches.
- **SLS 4:** Stable ordering and validity flag.
