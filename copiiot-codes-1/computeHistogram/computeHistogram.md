# computeHistogram

Contract: boundaries must be finite and strictly increasing. Bins are half-open
except the final bin, which includes the last boundary; out-of-range values are counted
as ignored.

- **SLS 1:** Input and boundary validation.
- **SLS 2:** Value validation and range checks.
- **SLS 3:** Binary-search bin selection, including final-boundary handling.
- **SLS 4:** Explicit bin metadata, bin count, included-value summary, and total range.
