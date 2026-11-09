export function planRetries(attempts, baseDelayMs, maxDelayMs, seed = 1, jitterRatio = 0.2) {
  // SLS 1: Validate retry count, delay bounds, and jitter configuration
  if (!Number.isInteger(attempts) || attempts <= 0 ||
      !Number.isFinite(baseDelayMs) || baseDelayMs < 0 ||
      !Number.isFinite(maxDelayMs) || maxDelayMs < 0 ||
      !Number.isFinite(jitterRatio)) {
    return [];
  }

  // SLS 2: Apply explicit limits to untrusted or extreme configuration values
  const retryCount = Math.min(attempts, 20);
  const safeJitter = Math.min(1, Math.max(0, jitterRatio));
  if (maxDelayMs === 0) return new Array(retryCount).fill(0);

  // SLS 3: Normalize the deterministic pseudo-random seed
  let randomState = Number.isInteger(seed) ? seed >>> 0 : 1;
  const delays = [];
  let attempt = 0;

  // SLS 4: Generate one exponentially increasing delay for each retry
  while (attempt < retryCount) {
    let nominalDelay = baseDelayMs * (2 ** attempt);
    if (!Number.isFinite(nominalDelay) || nominalDelay > maxDelayMs) {
      nominalDelay = maxDelayMs;
    }

    // SLS 5: Advance a seeded linear-congruential generator
    randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
    const randomUnit = randomState / 0x100000000;
    const jitterMultiplier = 1 - safeJitter + randomUnit * safeJitter * 2;
    const randomizedDelay = nominalDelay * jitterMultiplier;

    // SLS 6: Round and clamp the generated value before retaining it
    let delay = Math.round(randomizedDelay);
    if (!Number.isFinite(delay) || delay > maxDelayMs) delay = maxDelayMs;
    if (delay < 0) delay = 0;
    delays.push(delay);
    attempt++;
  }

  // SLS 7: Verify the output boundary even if numeric behavior changes upstream
  for (let index = 0; index < delays.length; index++) {
    delays[index] = Math.min(maxDelayMs, Math.max(0, delays[index]));
  }
  return delays;
}
