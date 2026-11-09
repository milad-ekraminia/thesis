# mergeSortedEventStreams

Contract: merge individually timestamp-sorted arrays, choose the lower stream index
for equal timestamps, skip malformed events, and count malformed stream entries.

- **SLS 1:** Invalid outer input.
- **SLS 2:** K-way selection scan on current stream heads.
- **SLS 3:** Invalid-head recovery, exhaustion condition, and selected-event advancement.
- **SLS 4:** Invalid stream accounting, valid-stream count, and deterministic ties.
