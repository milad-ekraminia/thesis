export function mergeSortedEventStreams(streams) {
  // SLS 1: Validate the outer stream collection
  if (!Array.isArray(streams)) return { events: [], invalidCount: 0 };
  const cursors = streams.map(() => 0);
  const events = [];
  let invalidCount = 0;

  // SLS 2: Repeatedly select the earliest current event across all streams
  while (true) {
    let selectedStream = -1;
    let selectedEvent = null;
    let skippedInvalid = false;
    for (let streamIndex = 0; streamIndex < streams.length; streamIndex++) {
      const stream = streams[streamIndex];
      if (!Array.isArray(stream)) continue;
      const cursor = cursors[streamIndex];
      if (cursor >= stream.length) continue;
      const event = stream[cursor];
      if (!event || !Number.isFinite(event.timestamp)) {
        cursors[streamIndex]++;
        invalidCount++;
        skippedInvalid = true;
        continue;
      }
      if (selectedEvent === null || event.timestamp < selectedEvent.timestamp) {
        selectedEvent = event;
        selectedStream = streamIndex;
      }
    }

    // SLS 3: Stop only when every stream is exhausted
    if (selectedStream < 0) {
      if (skippedInvalid) continue;
      break;
    }
    events.push({ ...selectedEvent, sourceIndex: selectedStream });
    cursors[selectedStream]++;
  }

  // SLS 4: Retain stable stream-order tie breaking and count invalid streams
  for (const stream of streams) {
    if (!Array.isArray(stream)) invalidCount++;
  }
  const validStreamCount = streams.filter(Array.isArray).length;
  return { events, invalidCount, validStreamCount };
}
