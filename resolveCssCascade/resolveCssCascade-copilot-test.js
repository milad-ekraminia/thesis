import { describe, expect, it } from 'vitest';
import { resolveCssCascade } from './resolveCssCascade.js';

describe('resolveCssCascade', () => {
  it('returns an empty style map for invalid inputs', () => {
    expect(resolveCssCascade(null, {})).toEqual({ computedStyles: {}, appliedRulesCount: 0 });
    expect(resolveCssCascade([], null)).toEqual({ computedStyles: {}, appliedRulesCount: 0 });
  });

  it('matches selectors and uses specificity over source order', () => {
    const result = resolveCssCascade([
      { selector: 'div', declarations: { color: 'red' } },
      { selector: '.active', declarations: { color: 'blue' } },
      { selector: '#main', declarations: { color: 'green' } }
    ], { tagName: 'div', id: 'main', classes: ['active'] });
    expect(result).toEqual({ computedStyles: { color: 'green' }, appliedRulesCount: 3 });
  });

  it('gives important rules priority and applies later equal-specificity rules last', () => {
    const result = resolveCssCascade([
      { selector: '.x', declarations: { color: 'red' } },
      { selector: '.x', declarations: { color: 'blue' } },
      { selector: 'div', declarations: { color: 'gold' }, important: true }
    ], { tagName: 'div', classes: ['x'] });
    expect(result.computedStyles.color).toBe('gold');
  });

  it('skips malformed, unmatched, and null declarations', () => {
    const result = resolveCssCascade([
      null,
      { selector: '.absent', declarations: { color: 'red' } },
      { selector: 'div', declarations: { color: null, display: 'block' } }
    ], { tagName: 'div' });
    expect(result).toEqual({ computedStyles: { display: 'block' }, appliedRulesCount: 1 });
  });
});
