# calculateCapacityPlan

Contract: clip valid positive-unit bookings to a half-open planning window, calculate
peak concurrent usage with a sweep line, and report each over-capacity event time.

- **SLS 1:** Planning argument guards.
- **SLS 2:** Booking validation and window clipping.
- **SLS 3:** End-before-start tie ordering for half-open intervals.
- **SLS 4:** Grouped event sweep and conflict collection.
- **SLS 5:** Peak, capacity flag, and invalid-row count.

