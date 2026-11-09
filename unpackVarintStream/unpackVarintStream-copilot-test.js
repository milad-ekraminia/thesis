import { describe, expect, it } from 'vitest';
import { unpackVarintStream } from './unpackVarintStream.js';

describe('unpackVarintStream', () => {
  it('accepts arrays and Uint8Array but rejects other inputs', () => {
    expect(() => unpackVarintStream('bytes')).toThrow(TypeError);
    expect(unpackVarintStream(new Uint8Array([1]))).toEqual({ values: [1], bytesRead: 1, completed: true });
  });

  it('decodes one-byte and multi-byte unsigned integers', () => {
    expect(unpackVarintStream([1, 0xac, 0x02])).toEqual({ values: [1, 300], bytesRead: 3, completed: true });
  });

  it('stops at maxElements and reports incomplete consumption', () => {
    expect(unpackVarintStream([1, 2, 3], 2)).toEqual({ values: [1, 2], bytesRead: 2, completed: false });
  });

  it('reports invalid bytes, overlong values, and truncated sequences', () => {
    expect(unpackVarintStream([1, 256])).toEqual({ values: [1], error: 'INVALID_BYTE_VALUE', offset: 1 });
    expect(unpackVarintStream([0x80])).toEqual({ values: [], error: 'UNTERMINATED_SEQUENCE', offset: 0 });
    expect(unpackVarintStream([0x80, 0x80, 0x80, 0x80, 0x80, 0x80])).toEqual({
      values: [], error: 'VARINT_OVERFLOW', offset: 0
    });
  });
});
