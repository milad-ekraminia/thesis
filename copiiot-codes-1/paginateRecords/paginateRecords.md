# paginateRecords

Contract: skip non-object records, optionally search and sort, preserve stable ties,
clamp page size to 100, and use one-based pages.

- **SLS 1:** Invalid collection and page/page-size defaults.
- **SLS 2:** Filtering and query matching.
- **SLS 3:** Nullable sort keys, direction, and stable tie-breaking.
- **SLS 4:** Page bounds and iterative slice.
- **SLS 5:** Result metadata.

