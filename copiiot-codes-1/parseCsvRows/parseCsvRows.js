export function parseCsvRows(input, delimiter = ',') {
  // SLS 1: Verify text and delimiter contract
  if (typeof input !== 'string' || typeof delimiter !== 'string' || delimiter.length !== 1) {
    return { rows: [], columnCounts: [], error: 'INVALID_INPUT' };
  }
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  let cursor = 0;
  let error = null;

  // SLS 2: Character scanner with quote-state transitions
  while (cursor < input.length) {
    const char = input[cursor++];
    if (quoted) {
      if (char === '"') {
        if (input[cursor] === '"') {
          field += '"';
          cursor++;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    // SLS 3: Start quote, separator, and newline handling
    if (char === '"' && field.length === 0) {
      quoted = true;
    } else if (char === delimiter) {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[cursor] === '\n') cursor++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  // SLS 4: Resolve end-of-input and incomplete quoted-field state
  if (quoted) error = 'UNTERMINATED_QUOTE';
  if (field.length > 0 || row.length > 0 || input.endsWith(delimiter)) {
    row.push(field);
    rows.push(row);
  }

  // SLS 5: Report each row width so callers can identify ragged records
  const columnCounts = [];
  for (const parsedRow of rows) {
    columnCounts.push(parsedRow.length);
  }

  // SLS 6: Return parsed rows, width metadata, and the recoverable parse error
  return { rows, columnCounts, error };
}
