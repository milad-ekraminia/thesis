# aggregateSalesByRegion

Contract: ignore malformed, below-minimum, and out-of-scope sales; aggregate finite
amounts by trimmed region; round the final per-region values to cents.

- **SLS 1:** Invalid collection fallback and option defaults.
- **SLS 2:** Sequential loop across every input record.
- **SLS 3:** Region/amount validation and independent rejection branches.
- **SLS 4:** First-seen bucket initialization and accumulation.
- **SLS 5:** Sorted output keys, monetary rounding, region count, and grand total.
