# normalizePhoneNumber

Contract: strip display punctuation, parse an optional extension, prefix ten-digit
local numbers with the configured country code, and reject implausible lengths.

- **SLS 1:** Input guard and extension extraction.
- **SLS 2:** Digit-only scan.
- **SLS 3:** Reject all-zero local numbers before prefixing.
- **SLS 4:** International prefix and local-number normalization.
- **SLS 5:** All-zero normalized-number guard.
- **SLS 6:** Stable normalized output.
