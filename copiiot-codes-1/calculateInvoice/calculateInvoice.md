# calculateInvoice

Contract: invalid lines are skipped; quantities default to one; line discounts and
clearance discounts are bounded; customer discount precedes tax; outputs are cents.

- **SLS 1:** Input and rate guards.
- **SLS 2:** Line traversal, validation, and quantity fallback.
- **SLS 3:** Line discount normalization and clearance override.
- **SLS 4:** Discounted-line aggregation.
- **SLS 5:** Customer discount and taxable total.
- **SLS 6:** Centralized monetary rounding and output shape.
