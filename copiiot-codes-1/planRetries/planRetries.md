# planRetries

Contract: return a deterministic, seeded jittered exponential schedule; invalid
inputs return an empty list; retries are capped at 20 and jitter/delays are bounded.

- **SLS 1:** Input validation.
- **SLS 2:** Retry/jitter bounds and zero-delay fast path.
- **SLS 3:** Seed normalization.
- **SLS 4:** Exponential progression and overflow handling.
- **SLS 5:** Seeded linear-congruential jitter.
- **SLS 6:** Per-delay rounding and clamping.
- **SLS 7:** Final invariant check.
