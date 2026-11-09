Method 3: Resilient JSON Patch Engine with Path Expansion
JavaScript
export function applyPatchOperations(baseObject, patches, options = {}) {
  // SLS 1: Defensive parameter check
  if (typeof baseObject !== 'object' || baseObject === null) throw new Error("Base target must be an object");
  if (!Array.isArray(patches)) return { target: baseObject, applied: 0, failed: 0 };

  const strictMode = Boolean(options.strict);
  const target = JSON.parse(JSON.stringify(baseObject)); // Deep clone
  let appliedCount = 0;
  let failedCount = 0;

  // SLS 2: Patch processing loop
  for (let i = 0; i < patches.length; i++) {
    const patch = patches[i];
    if (!patch || typeof patch.op !== 'string' || typeof patch.path !== 'string') {
      if (strictMode) throw new Error(`Malformed patch at index ${i}`);
      failedCount++;
      continue;
    }

    const segments = patch.path.split('/').filter(Boolean);
    let cursor = target;
    let traversalFailed = false;

    // SLS 3: Deep nested path traversal
    for (let j = 0; j < segments.length - 1; j++) {
      const seg = segments[j];
      if (!(seg in cursor) || typeof cursor[seg] !== 'object' || cursor[seg] === null) {
        if (patch.op === 'add' && options.autoCreatePaths) {
          cursor[seg] = {};
        } else {
          traversalFailed = true;
          break;
        }
      }
      cursor = cursor[seg];
    }

    // SLS 4: Traversal failure handling
    if (traversalFailed || segments.length === 0) {
      if (strictMode) throw new Error(`Path not found: ${patch.path}`);
      failedCount++;
      continue;
    }

    // SLS 5: Operation dispatch & mutation logic
    const leaf = segments[segments.length - 1];
    if (patch.op === 'add' || patch.op === 'replace') {
      cursor[leaf] = patch.value;
      appliedCount++;
    } else if (patch.op === 'remove') {
      if (Array.isArray(cursor)) {
        const idx = parseInt(leaf, 10);
        if (!isNaN(idx) && idx >= 0 && idx < cursor.length) {
          cursor.splice(idx, 1);
          appliedCount++;
        } else {
          failedCount++;
        }
      } else if (leaf in cursor) {
        delete cursor[leaf];
        appliedCount++;
      } else {
        failedCount++;
      }
    } else {
      failedCount++;
    }
  }

  // SLS 6: Final payload assembly
  return { target, applied: appliedCount, failed: failedCount };
}
Strategic Locational Sections:

SLS 1 (Lines 2–8): Defensive root assertions and deep clone initialization.

SLS 2 (Lines 11–18): Strict vs non-strict patch structure validation.

SLS 3 (Lines 20–35): Dynamic nested path traversal with dynamic branch creation (autoCreatePaths).

SLS 4 (Lines 37–43): Missing-path recovery and strict-mode throwing.

SLS 5 (Lines 45–66): Operation discrimination (add, replace, remove) with array splice vs object key deletion branches.

SLS 6 (Lines 68–69): Return summary metrics.