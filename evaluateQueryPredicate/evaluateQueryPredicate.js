export function evaluateQueryPredicate(record, predicateTree) {
  // SLS 1: Parameter guards
  if (!record || typeof record !== 'object') return false;
  if (!predicateTree || typeof predicateTree !== 'object') return true; // Empty predicate = match all

  // SLS 2: Logical combinations (AND / OR / NOT)
  if (Array.isArray(predicateTree.AND)) {
    if (predicateTree.AND.length === 0) return false;
    for (let i = 0; i < predicateTree.AND.length; i++) {
      if (!evaluateQueryPredicate(record, predicateTree.AND[i])) return false;
    }
    return true;
  }

  if (Array.isArray(predicateTree.OR)) {
    if (predicateTree.OR.length === 0) return false;
    for (let j = 0; j < predicateTree.OR.length; j++) {
      if (evaluateQueryPredicate(record, predicateTree.OR[j])) return true;
    }
    return false;
  }

  if (predicateTree.NOT) {
    return !evaluateQueryPredicate(record, predicateTree.NOT);
  }

  // SLS 3: Leaf-node validation
  const { field, op, value } = predicateTree;
  if (typeof field !== 'string' || typeof op !== 'string') return false;

  const actualValue = record[field];

  // SLS 4: Operator switch matrix
  switch (op.toUpperCase()) {
    case 'EQ':
      return actualValue === value;
    case 'NEQ':
      return actualValue !== value;
    case 'GT':
      return typeof actualValue === 'number' && typeof value === 'number' && actualValue > value;
    case 'LT':
      return typeof actualValue === 'number' && typeof value === 'number' && actualValue < value;
    case 'IN':
      return Array.isArray(value) && value.includes(actualValue);
    case 'LIKE':
      if (typeof actualValue !== 'string' || typeof value !== 'string') return false;
      const regexPattern = '^' + value.replace(/%/g, '.*').replace(/_/g, '.') + '$';
      return new RegExp(regexPattern, 'i').test(actualValue);
    case 'IS_NULL':
      return actualValue === null || actualValue === undefined;
    default:
      return false; // Unknown operator
  }
}
