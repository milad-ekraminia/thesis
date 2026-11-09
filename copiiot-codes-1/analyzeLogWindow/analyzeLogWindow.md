# analyzeLogWindow

Contract: require positive window/bucket widths, ignore malformed and out-of-window
events, anchor a trailing window at the latest event, and count total/error events.

- **SLS 1:** Top-level and numeric parameter guards.
- **SLS 2:** Event validation and timestamp extent.
- **SLS 3:** Trailing-window bounds and exclusion accounting.
- **SLS 4:** Bucket assignment and severity counters.
- **SLS 5:** Chronological result assembly.
