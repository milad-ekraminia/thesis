export function executeWorkflowTransition(workflow, event, context) {
  // SLS 1: Parameter verification
  if (!workflow || typeof workflow !== 'object') throw new Error("Workflow config missing");
  if (!event || typeof event.type !== 'string') return { status: "REJECTED", reason: "INVALID_EVENT" };

  const currentState = workflow.currentState;
  const stateDef = workflow.states?.[currentState];

  // SLS 2: State definition validation
  if (!stateDef) {
    return { status: "ERROR", reason: `Undefined state: ${currentState}` };
  }

  // SLS 3: Target transition evaluation
  const transitions = stateDef.on?.[event.type];
  if (!transitions) {
    return { status: "IGNORED", state: currentState, reason: "NO_MATCHING_TRANSITION" };
  }

  const candidateTransitions = Array.isArray(transitions) ? transitions : [transitions];
  let resolvedTarget = null;

  // SLS 4: Iterative condition evaluation
  for (let i = 0; i < candidateTransitions.length; i++) {
    const candidate = candidateTransitions[i];
    if (typeof candidate === 'string') {
      resolvedTarget = candidate;
      break;
    }

    if (typeof candidate === 'object' && candidate !== null) {
      if (typeof candidate.guard === 'function') {
        try {
          if (candidate.guard(context, event.payload)) {
            resolvedTarget = candidate.target;
            break;
          }
        } catch (guardErr) {
          return { status: "GUARD_EXCEPTION", error: guardErr.message };
        }
      } else if (!candidate.guard) {
        resolvedTarget = candidate.target;
        break;
      }
    }
  }

  // SLS 5: Final state transition
  if (!resolvedTarget) {
    return { status: "BLOCKED", state: currentState, reason: "GUARDS_FAILED" };
  }

  // Ensure target exists in the workflow graph
  if (!workflow.states[resolvedTarget]) {
    return { status: "FATAL", reason: `Target state does not exist: ${resolvedTarget}` };
  }

  return { status: "TRANSITIONED", previousState: currentState, nextState: resolvedTarget };
}
