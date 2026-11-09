export function paginateRecords(records, page = 1, pageSize = 10, options = {}) {
  // SLS 1: Guard collection and normalize one-based page parameters
  if (!Array.isArray(records)) return { items: [], page: 1, pageSize: 0, total: 0, pages: 0 };
  const safeSize = Number.isInteger(pageSize) && pageSize > 0 ? Math.min(pageSize, 100) : 10;
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const query = typeof options.query === 'string' ? options.query.toLowerCase() : '';
  const field = typeof options.field === 'string' ? options.field : null;
  const filtered = [];

  // SLS 2: Select records passing the optional case-insensitive query
  for (let index = 0; index < records.length; index++) {
    const record = records[index];
    if (!record || typeof record !== 'object') continue;
    if (!query) {
      filtered.push({ record, index });
      continue;
    }
    const value = field ? record[field] : Object.values(record).join(' ');
    if (String(value ?? '').toLowerCase().includes(query)) filtered.push({ record, index });
  }

  // SLS 3: Apply stable sort by requested field and original input order
  if (typeof options.sortBy === 'string') {
    const key = options.sortBy;
    const direction = options.descending ? -1 : 1;
    filtered.sort((left, right) => {
      const a = left.record[key];
      const b = right.record[key];
      if (a === b) return left.index - right.index;
      if (a == null) return 1;
      if (b == null) return -1;
      return (a < b ? -1 : 1) * direction;
    });
  }

  // SLS 4: Compute bounds and copy the requested page
  const total = filtered.length;
  const pages = Math.ceil(total / safeSize);
  const start = (safePage - 1) * safeSize;
  const items = [];
  let cursor = start;
  while (cursor < Math.min(total, start + safeSize)) {
    items.push(filtered[cursor].record);
    cursor++;
  }

  // SLS 5: Keep pagination metadata consistent for empty and non-empty results
  return { items, page: safePage, pageSize: safeSize, total, pages };
}
