# findLongestIncreasingRun

Contract: return the earliest longest strictly increasing contiguous run of finite
numbers. Invalid values break runs. Boundaries are inclusive and length is explicit.

- **SLS 1:** Non-array and empty input sentinels.
- **SLS 2:** Adjacent comparison, invalid-value reset, and best-run update.
- **SLS 3:** Empty sentinel when no finite values are present.
- **SLS 4:** Defensive copy of the selected range.
- **SLS 5:** Inclusive output boundaries and explicit length.
