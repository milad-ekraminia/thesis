# parseCsvRows

Contract: parse one-character-delimited text, support quoted fields and doubled quote
escapes, normalize CRLF line breaks, report row widths, and report unterminated quotes.

- **SLS 1:** Input and delimiter validation.
- **SLS 2:** Character-by-character scan with quoted/unquoted states.
- **SLS 3:** Escaped quote and delimiter/newline branches.
- **SLS 4:** Final partial row and unfinished quote handling.
- **SLS 5:** Per-row column-count metadata.
- **SLS 6:** Stable result shape with recoverable parse error.
