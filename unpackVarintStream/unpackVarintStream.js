export function unpackVarintStream(buffer, maxElements) {
  // SLS 1: Parameter checking
  if (!Array.isArray(buffer) && !(buffer instanceof Uint8Array)) {
    throw new TypeError("Buffer must be an array of bytes or Uint8Array");
  }
  const limit = typeof maxElements === 'number' && maxElements > 0 ? maxElements : Infinity;

  const results = [];
  let byteCursor = 0;
  let elementCount = 0;

  // SLS 2: Stream decoding loop
  while (byteCursor < buffer.length && elementCount < limit) {
    let result = 0;
    let shift = 0;
    let isTerminated = false;
    const startOffset = byteCursor;

    // SLS 3: Inner varint byte reading
    while (byteCursor < buffer.length) {
      const byte = buffer[byteCursor++];
      if (typeof byte !== 'number' || byte < 0 || byte > 255) {
        return { values: results, error: "INVALID_BYTE_VALUE", offset: byteCursor - 1 };
      }

      // 7-bit payload extraction
      const payload = byte & 0x7f;
      result |= payload << shift;

      // Check continuation bit
      if ((byte & 0x80) === 0) {
        isTerminated = true;
        break;
      }

      shift += 7;
      // SLS 4: 32-bit integer overflow guard
      if (shift > 35) {
        return { values: results, error: "VARINT_OVERFLOW", offset: startOffset };
      }
    }

    // SLS 5: Truncated stream validation
    if (!isTerminated) {
      return { values: results, error: "UNTERMINATED_SEQUENCE", offset: startOffset };
    }

    results.push(result >>> 0); // Unsigned 32-bit cast
    elementCount++;
  }

  // SLS 6: Return parsed stream
  return { values: results, bytesRead: byteCursor, completed: byteCursor === buffer.length };
}
