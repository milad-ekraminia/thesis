# allocateBudget

Contract: distribute an integer-cent budget proportionally across positive valid
weights; use largest remainders for exact conservation and preserve input order.

- **SLS 1:** Budget and collection validation.
- **SLS 2:** Valid-item filtering and weight sum.
- **SLS 3:** Exact share, floor allocation, and fractional remainder.
- **SLS 4:** Residual-cent distribution and deterministic tie break.
- **SLS 5:** Input-order output.

