import { describe, expect, it } from 'vitest';
import { decodeCompressedStream } from './decodeCompressedStream.js';

describe('decodeCompressedStream', () => {
  it('returns the fallback for a non-array input', () => {
    expect(decodeCompressedStream('a2')).toEqual({ decoded: '', crc: 0 });
  });

  it('decodes implicit and multi-digit repeat counts across chunks', () => {
    expect(decodeCompressedStream(['a', 'b12'])).toEqual({
      decoded: 'abbbbbbbbbbbb',
      crc: 8917,
      overflow: false
    });
  });

  it('skips non-string chunks and control characters by default', () => {
    expect(decodeCompressedStream([null, 'A\x01B'])).toMatchObject({ decoded: 'AB', overflow: false });
  });

  it('can preserve control characters and truncates output to maxBytes', () => {
    expect(decodeCompressedStream(['\x01'], { allowControlChars: true }).decoded).toBe('\x01');
    expect(decodeCompressedStream(['x5'], { maxBytes: 3 })).toEqual({ decoded: 'xxx', crc: 3, overflow: true });
  });
});
