import { describe, expect, it } from 'vitest';
import { topKFrequentWords } from './topKFrequentWords.js';

describe('topKFrequentWords', () => {
  it('validates input and k', () => {
    expect(topKFrequentWords(null, 2)).toEqual([]);
    expect(topKFrequentWords('a', 0)).toEqual([]);
  });
  it('counts case-insensitive tokens and ranks ties lexically', () => {
    expect(topKFrequentWords('B a b C a', 3)).toEqual([
      { word: 'a', count: 2 }, { word: 'b', count: 2 }, { word: 'c', count: 1 }
    ]);
  });
  it('ignores stop words and limits output to k', () => {
    expect(topKFrequentWords('the cat the dog cat', 1, ['THE'])).toEqual([{ word: 'cat', count: 2 }]);
  });
  it('returns no entries when no token survives', () => {
    expect(topKFrequentWords('!!!', 5)).toEqual([]);
  });
  it('ignores overlong words and non-string stop-word entries', () => {
    expect(topKFrequentWords('cat elephant dog', 5, [3], 3).map(item => item.word)).toEqual(['cat', 'dog']);
  });
});
