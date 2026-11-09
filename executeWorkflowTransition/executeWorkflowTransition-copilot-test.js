import { describe, expect, it, vi } from 'vitest';
import { executeWorkflowTransition } from './executeWorkflowTransition.js';

describe('executeWorkflowTransition', () => {
  const workflow = {
    currentState: 'idle',
    states: { idle: { on: { START: 'running' } }, running: {} }
  };
  it('validates workflow and event inputs', () => {
    expect(() => executeWorkflowTransition(null, {}, {})).toThrow('Workflow config missing');
    expect(executeWorkflowTransition(workflow, {}, {})).toEqual({ status: 'REJECTED', reason: 'INVALID_EVENT' });
  });

  it('reports undefined states and unmatched events', () => {
    expect(executeWorkflowTransition({ currentState: 'missing', states: {} }, { type: 'START' }))
      .toMatchObject({ status: 'ERROR' });
    expect(executeWorkflowTransition(workflow, { type: 'STOP' }))
      .toEqual({ status: 'IGNORED', state: 'idle', reason: 'NO_MATCHING_TRANSITION' });
  });

  it('transitions on strings and passing guards, while skipping failed guards', () => {
    expect(executeWorkflowTransition(workflow, { type: 'START' }).nextState).toBe('running');
    const guarded = { ...workflow, states: { ...workflow.states, idle: { on: { START: [
      { target: 'running', guard: () => false }, { target: 'running', guard: () => true }
    ] } } } };
    expect(executeWorkflowTransition(guarded, { type: 'START' }).status).toBe('TRANSITIONED');
  });

  it('reports guard exceptions, blocked transitions, and missing targets', () => {
    const badGuard = { ...workflow, states: { ...workflow.states, idle: { on: { START: { target: 'running', guard: () => { throw new Error('boom'); } } } } } };
    expect(executeWorkflowTransition(badGuard, { type: 'START' })).toEqual({ status: 'GUARD_EXCEPTION', error: 'boom' });
    const blocked = { ...workflow, states: { ...workflow.states, idle: { on: { START: { target: 'running', guard: () => false } } } } };
    expect(executeWorkflowTransition(blocked, { type: 'START' }).status).toBe('BLOCKED');
    const missingTarget = { ...workflow, states: { ...workflow.states, idle: { on: { START: 'missing' } } } };
    expect(executeWorkflowTransition(missingTarget, { type: 'START' }).status).toBe('FATAL');
  });

  it('does not execute a guard after an earlier transition resolves', () => {
    const guard = vi.fn(() => true);
    const wf = { ...workflow, states: { ...workflow.states, idle: { on: { START: ['running', { target: 'running', guard }] } } } };
    executeWorkflowTransition(wf, { type: 'START' });
    expect(guard).not.toHaveBeenCalled();
  });
});
