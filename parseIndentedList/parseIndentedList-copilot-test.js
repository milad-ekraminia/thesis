import { describe, expect, it } from 'vitest';
import { parseIndentedList } from './parseIndentedList.js';

describe('parseIndentedList', () => {
  it('returns an empty forest for non-array input', () => {
    expect(parseIndentedList(null)).toEqual([]);
  });

  it('builds nested nodes using dash and star bullets', () => {
    expect(parseIndentedList(['- parent', '  * child', '    - grandchild', '- sibling'])).toEqual([
      { text: 'parent', children: [{ text: 'child', children: [{ text: 'grandchild', children: [] }] }] },
      { text: 'sibling', children: [] }
    ]);
  });

  it('skips invalid lines, empty bullets, and non-string values', () => {
    expect(parseIndentedList([null, 'not a bullet', '- ', '- valid'])).toEqual([{ text: 'valid', children: [] }]);
  });

  it('uses the fallback tab size for invalid sizes', () => {
    expect(parseIndentedList(['- root', '  - nested'], 0)[0].children).toHaveLength(1);
  });

  it('unwinds the stack when indentation returns to a parent level', () => {
    const parsed = parseIndentedList(['- first', '  - nested', '- second']);
    expect(parsed.map(node => node.text)).toEqual(['first', 'second']);
    expect(parsed[1].children).toEqual([]);
  });
});
