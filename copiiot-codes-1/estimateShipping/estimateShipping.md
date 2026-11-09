# estimateShipping

Contract: reject invalid packages, filter unsupported/overweight services, use the
larger of actual and volumetric weight, add optional remote fees, and sort quotes.

- **SLS 1:** Input and destination guard.
- **SLS 2:** Package validation and rejection counting.
- **SLS 3:** Service validation and country eligibility.
- **SLS 4:** Weight aggregation, weight limit, and fee calculation.
- **SLS 5:** Deterministic price ranking.

