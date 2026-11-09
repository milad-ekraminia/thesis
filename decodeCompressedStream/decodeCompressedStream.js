export function decodeCompressedStream(encodedChunks, options = {}) {
  // SLS 1: Parameter checks
  if (!Array.isArray(encodedChunks)) return { decoded: "", crc: 0 };
  const maxBytes = typeof options.maxBytes === 'number' ? options.maxBytes : 65536;
  const allowControlChars = Boolean(options.allowControlChars);

  let output = "";
  let totalBytes = 0;
  let chunkIdx = 0;

  // SLS 2: Primary stream reader
  while (chunkIdx < encodedChunks.length) {
    const chunk = encodedChunks[chunkIdx++];
    if (typeof chunk !== 'string') continue;

    let charCursor = 0;

    // SLS 3: Token extraction loop
    while (charCursor < chunk.length) {
      const char = chunk[charCursor++];
      let countStr = "";

      // Parse multi-digit frequency numbers
      while (charCursor < chunk.length && chunk.charCodeAt(charCursor) >= 48 && chunk.charCodeAt(charCursor) <= 57) {
        countStr += chunk[charCursor++];
      }

      const count = countStr.length > 0 ? parseInt(countStr, 10) : 1;

      // SLS 4: Character sanity checks
      const isControl = char.charCodeAt(0) < 32;
      if (isControl && !allowControlChars) {
        continue;
      }

      // Memory boundary checks
      if (totalBytes + count > maxBytes) {
        const allowedSlice = maxBytes - totalBytes;
        if (allowedSlice > 0) {
          output += char.repeat(allowedSlice);
          totalBytes += allowedSlice;
        }
        return { decoded: output, crc: totalBytes, overflow: true };
      }

      // SLS 5: Payload accumulation
      output += char.repeat(count);
      totalBytes += count;
    }
  }

  // SLS 6: Cyclic checksum calculation
  let crc = 0;
  for (let k = 0; k < output.length; k++) {
    crc = (crc + output.charCodeAt(k) * (k + 1)) % 65535;
  }

  return { decoded: output, crc, overflow: false };
}