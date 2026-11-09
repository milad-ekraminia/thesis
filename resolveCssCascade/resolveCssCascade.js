export function resolveCssCascade(rules, element) {
  // SLS 1: Parameter checks
  if (!Array.isArray(rules) || typeof element !== 'object' || element === null) {
    return { computedStyles: {}, appliedRulesCount: 0 };
  }

  const computedStyles = {};
  const scoredRules = [];

  // SLS 2: Selector inspection loop
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (!rule || typeof rule.selector !== 'string' || typeof rule.declarations !== 'object') continue;

    let a = 0; // ID count
    let b = 0; // Class/attribute count
    let c = 0; // Element count

    const parts = rule.selector.split(/\s+/);
    let matched = true;

    // SLS 3: Token matching inner loop
    for (const part of parts) {
      if (part.startsWith('#')) {
        a++;
        if (element.id !== part.slice(1)) matched = false;
      } else if (part.startsWith('.')) {
        b++;
        if (!Array.isArray(element.classes) || !element.classes.includes(part.slice(1))) matched = false;
      } else {
        c++;
        if (element.tagName !== part.toLowerCase()) matched = false;
      }
    }

    // SLS 4: Specificity scoring and capture
    if (matched) {
      const specificity = a * 100 + b * 10 + c;
      scoredRules.push({ specificity, declarations: rule.declarations, index: i, important: Boolean(rule.important) });
    }
  }

  // SLS 5: Cascade resolution with priority weights
  scoredRules.sort((r1, r2) => {
    if (r1.important !== r2.important) return r1.important ? 1 : -1;
    if (r1.specificity !== r2.specificity) return r1.specificity - r2.specificity;
    return r1.index - r2.index;
  });

  for (const r of scoredRules) {
    for (const [prop, val] of Object.entries(r.declarations)) {
      if (val !== null && val !== undefined) {
        computedStyles[prop] = String(val);
      }
    }
  }

  // SLS 6: Return compiled cascade state
  return { computedStyles, appliedRulesCount: scoredRules.length };
}