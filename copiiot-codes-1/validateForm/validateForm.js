export function validateForm(fields, values) {
  // SLS 1: Validate schema and value containers
  if (!Array.isArray(fields) || !values || typeof values !== 'object') {
    return { valid: false, errors: [{ field: null, code: 'INVALID_INPUT' }] };
  }
  const errors = [];
  const seen = new Set();

  // SLS 2: Check every declared field and reject duplicate schema identifiers
  for (let index = 0; index < fields.length; index++) {
    const rule = fields[index];
    if (!rule || typeof rule.name !== 'string' || rule.name.length === 0) {
      errors.push({ field: null, code: 'INVALID_RULE' });
      continue;
    }
    if (seen.has(rule.name)) {
      errors.push({ field: rule.name, code: 'DUPLICATE_RULE' });
      continue;
    }
    seen.add(rule.name);
    const value = values[rule.name];

    // SLS 3: Required and basic type checks
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({ field: rule.name, code: 'REQUIRED' });
      continue;
    }
    if (value === undefined || value === null || value === '') continue;
    if (rule.type === 'number' && (typeof value !== 'number' || !Number.isFinite(value))) {
      errors.push({ field: rule.name, code: 'TYPE' });
      continue;
    }
    if (rule.type === 'string' && typeof value !== 'string') {
      errors.push({ field: rule.name, code: 'TYPE' });
      continue;
    }

    // SLS 4: Apply length, range, and regular-expression constraints
    const measured = typeof value === 'string' ? value.length : value;
    if (Number.isFinite(rule.min) && measured < rule.min) errors.push({ field: rule.name, code: 'MIN' });
    if (Number.isFinite(rule.max) && measured > rule.max) errors.push({ field: rule.name, code: 'MAX' });
    if (rule.pattern && typeof value === 'string' && !new RegExp(rule.pattern).test(value)) {
      errors.push({ field: rule.name, code: 'PATTERN' });
    }
  }

  // SLS 5: Report supplied values that do not belong to the declared schema
  const suppliedNames = Object.keys(values);
  let suppliedIndex = 0;
  while (suppliedIndex < suppliedNames.length) {
    const name = suppliedNames[suppliedIndex++];
    if (!seen.has(name)) errors.push({ field: name, code: 'UNKNOWN_FIELD' });
  }

  // SLS 6: Return every discovered issue in declaration order and input-key order
  return { valid: errors.length === 0, errors };
}
