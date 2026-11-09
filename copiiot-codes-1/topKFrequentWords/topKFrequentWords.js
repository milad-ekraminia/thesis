export function topKFrequentWords(text, k, stopWords = [], maxTokenLength = 64) {
  // SLS 1: Validate text and normalize request count
  if (typeof text !== 'string' || !Number.isInteger(k) || k <= 0) return [];
  const excluded = new Set();
  if (Array.isArray(stopWords)) {
    for (const word of stopWords) {
      if (typeof word === 'string') excluded.add(word.toLowerCase());
    }
  }
  const tokenLimit = Number.isInteger(maxTokenLength) && maxTokenLength > 0
    ? maxTokenLength
    : 64;
  const counts = new Map();
  const words = text.toLowerCase().match(/[\p{L}\p{N}']+/gu) || [];
  let index = 0;

  // SLS 2: Count normalized tokens and skip configured stop words
  while (index < words.length) {
    const word = words[index++];
    if (word.length === 0 || excluded.has(word)) continue;
    if (word.length > tokenLimit) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  // SLS 3: Materialize counters for deterministic ranking
  const ranked = [];
  for (const [word, count] of counts.entries()) {
    ranked.push({ word, count });
  }
  ranked.sort((left, right) => {
    if (left.count !== right.count) return right.count - left.count;
    return left.word.localeCompare(right.word);
  });

  // SLS 4: Copy at most k ranked entries into the compact output
  const result = [];
  let cursor = 0;
  while (cursor < ranked.length && cursor < k) {
    result.push(ranked[cursor]);
    cursor++;
  }

  // SLS 5: Return an empty array when no token survives normalization
  return result;
}
