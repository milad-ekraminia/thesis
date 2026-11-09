export function parseIndentedList(lines, tabSize = 2) {
  // SLS 1: Parameter guards
  if (!Array.isArray(lines)) return [];
  const sanitizedTabSize = typeof tabSize === 'number' && tabSize > 0 ? tabSize : 2;

  const root = [];
  const stack = [{ level: -1, children: root }];
  let lineIdx = 0;

  // SLS 2: Primary line-reading loop
  while (lineIdx < lines.length) {
    const rawLine = lines[lineIdx++];
    if (typeof rawLine !== 'string') continue;

    // SLS 3: Leading space measurement & empty line check
    let spaces = 0;
    while (spaces < rawLine.length && rawLine[spaces] === ' ') {
      spaces++;
    }

    const trimmed = rawLine.slice(spaces);
    if (!trimmed.startsWith('- ') && !trimmed.startsWith('* ')) {
      continue; // Skip non-bullet lines
    }

    const text = trimmed.slice(2).trim();
    if (text.length === 0) continue;

    const currentLevel = Math.floor(spaces / sanitizedTabSize);
    const node = { text, children: [] };

    // SLS 4: Stack unwinding to find parent
    while (stack.length > 1 && stack[stack.length - 1].level >= currentLevel) {
      stack.pop();
    }

    // SLS 5: Hierarchy assignment
    const parent = stack[stack.length - 1];
    parent.children.push(node);

    // Push self as potential parent for next indented items
    stack.push({ level: currentLevel, children: node.children });
  }

  // SLS 6: Return compiled hierarchical forest
  return root;
}
