import { describe, expect, it } from 'vitest';
import { verifyAccessAuthorization } from './verifyAccessAuthorization.js';

describe('verifyAccessAuthorization', () => {
  const subject = { id: 'u1', roles: ['editor'] };
  const resource = { type: 'document' };
  it('rejects malformed parameters and honors the superuser override', () => {
    expect(verifyAccessAuthorization(null, 'read', resource, [])).toEqual({ authorized: false, reason: 'INVALID_PARAMETERS' });
    expect(verifyAccessAuthorization({ roles: ['SUPER_ADMIN'] }, 'read', resource, []))
      .toEqual({ authorized: true, reason: 'SUPERUSER_OVERRIDE' });
  });

  it('defaults to deny and allows matching principal, role, action, and resource', () => {
    expect(verifyAccessAuthorization(subject, 'read', resource, [])).toMatchObject({ authorized: false, reason: 'DEFAULT_DENY' });
    expect(verifyAccessAuthorization(subject, 'read', resource, [{
      effect: 'ALLOW', actions: ['read'], resourceType: 'document', roles: ['editor']
    }])).toMatchObject({ authorized: true, reason: 'PERMITTED', evaluatedRulesCount: 1 });
  });

  it('supports wildcard scopes and explicit deny precedence', () => {
    const policies = [
      { effect: 'ALLOW', actions: ['*'], resourceType: '*', principal: '*' },
      { effect: 'DENY', actions: ['read'], resourceType: 'document', principal: 'u1' }
    ];
    expect(verifyAccessAuthorization(subject, 'read', resource, policies))
      .toMatchObject({ authorized: false, reason: 'EXPLICIT_DENY', evaluatedRulesCount: 2 });
  });

  it('uses ABAC conditions and treats throwing conditions as non-matches', () => {
    expect(verifyAccessAuthorization(subject, 'read', resource, [{
      effect: 'ALLOW', actions: ['read'], resourceType: 'document', principal: '*', condition: () => true
    }])).toMatchObject({ authorized: true, reason: 'PERMITTED' });
    expect(verifyAccessAuthorization(subject, 'read', resource, [{
      effect: 'ALLOW', actions: ['read'], resourceType: 'document', principal: '*', condition: () => { throw new Error('no'); }
    }])).toMatchObject({ authorized: false, reason: 'DEFAULT_DENY', evaluatedRulesCount: 0 });
  });
});
