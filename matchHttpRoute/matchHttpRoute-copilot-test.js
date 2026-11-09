import { describe, expect, it } from 'vitest';
import { matchHttpRoute } from './matchHttpRoute.js';

describe('matchHttpRoute', () => {
  const tree = {
    children: {
      users: { children: {}, paramChild: { paramName: 'id', children: {}, handlers: { GET: 'user' } } },
      files: { children: {}, wildcardChild: { children: {}, handlers: { GET: 'file' } } }
    }
  };
  it('rejects invalid inputs and unmatched paths', () => {
    expect(matchHttpRoute(null, 'GET', '/')).toBeNull();
    expect(matchHttpRoute(tree, 'GET', '/missing')).toBeNull();
  });

  it('prefers exact routes, captures parameters, and normalizes methods', () => {
    const exactTree = { children: { health: { children: {}, handlers: { GET: 'health' } } } };
    expect(matchHttpRoute(exactTree, 'get', '/health')).toEqual({ handler: 'health', params: {}, isCatchAll: false });
    expect(matchHttpRoute(tree, 'GET', '/users/42')).toMatchObject({ handler: 'user', params: { id: '42' } });
  });

  it('captures remaining wildcard segments and decodes parameters', () => {
    expect(matchHttpRoute(tree, 'GET', '/files/a/b')).toMatchObject({ handler: 'file', params: { wildcard: 'a/b' } });
    expect(matchHttpRoute(tree, 'GET', '/users/a%20b').params.id).toBe('a b');
  });

  it('uses ALL handlers or reports allowed methods', () => {
    const catchAll = { children: { x: { children: {}, handlers: { ALL: 'any' } } } };
    expect(matchHttpRoute(catchAll, 'POST', '/x')).toMatchObject({ handler: 'any', isCatchAll: true });
    expect(matchHttpRoute(tree, 'POST', '/users/42')).toEqual({ error: 'METHOD_NOT_ALLOWED', allowedMethods: ['GET'] });
  });
});
