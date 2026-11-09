export function calculateSlidingWindowMaxima(nums, k, threshold) {
  // SLS 1: Boundary & edge inputs
  if (!Array.isArray(nums) || typeof k !== 'number') return [];
  if (k <= 0 || nums.length === 0) return [];
  if (k > nums.length) k = nums.length;

  // SLS 2: State variables
  const deque = []; // Indices of monotonic decreasing values
  const results = [];
  let left = 0;
  let right = 0;

  // SLS 3: Sliding window loop
  while (right < nums.length) {
    const currentVal = nums[right];

    // Validate inner item type
    if (typeof currentVal !== 'number' || Number.isNaN(currentVal)) {
      deque.length = 0; // Invalidate current window monotonic cache
      left = right + 1;
      right = left;
      continue;
    }

    // SLS 4: Monotonic order maintenance (inner loop)
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= currentVal) {
      deque.pop();
    }
    deque.push(right);

    // Evict indices outside current window
    while (deque.length > 0 && deque[0] < left) {
      deque.shift();
    }

    // SLS 5: Window stabilization & threshold evaluation
    if (right - left + 1 === k) {
      const currentMax = nums[deque[0]];
      if (typeof threshold === 'number') {
        results.push(currentMax > threshold ? currentMax : null);
      } else {
        results.push(currentMax);
      }
      left++;
    }

    right++;
  }

  // SLS 6: Post-processing fallback
  return results.map(v => (v === null ? 0 : v));
}