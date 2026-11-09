# topKFrequentWords

Contract: lowercase Unicode letter/number tokens, ignore configured stop words and
overlong tokens, rank by frequency then lexical order, and return no more than `k`.

- **SLS 1:** Type and `k` validation; stop-word set and token-limit creation.
- **SLS 2:** Token scan and frequency updates.
- **SLS 3:** Counter materialization and deterministic sorting.
- **SLS 4:** Bounded result loop.
- **SLS 5:** Empty/no-match result.
