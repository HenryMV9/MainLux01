/**
 * Simple client-side rate limiter using localStorage.
 * Prevents accidental double-submissions and brute-force attempts.
 *
 * Usage:
 *   import { checkRateLimit, recordAttempt } from './rate-limit.js';
 *   if (!checkRateLimit('login', 5, 15 * 60 * 1000)) {
 *     // blocked
 *   }
 *   recordAttempt('login');
 */

/**
 * @param {string} key      Unique action key (e.g. 'login', 'checkout')
 * @param {number} max      Max allowed attempts within the window
 * @param {number} windowMs Time window in milliseconds
 * @returns {boolean} true = allowed, false = blocked
 */
export function checkRateLimit(key, max, windowMs) {
  const now = Date.now();
  const stored = JSON.parse(localStorage.getItem(`rl_${key}`) || '[]');
  const recent = stored.filter(t => now - t < windowMs);
  return recent.length < max;
}

/**
 * Records a new attempt for the given key.
 * Trims old entries outside a 1-hour window to keep storage clean.
 */
export function recordAttempt(key) {
  const now = Date.now();
  const stored = JSON.parse(localStorage.getItem(`rl_${key}`) || '[]');
  const trimmed = stored.filter(t => now - t < 60 * 60 * 1000);
  trimmed.push(now);
  localStorage.setItem(`rl_${key}`, JSON.stringify(trimmed));
}

/**
 * Returns ms until the next allowed attempt, or 0 if currently allowed.
 */
export function getRetryAfter(key, max, windowMs) {
  const now = Date.now();
  const stored = JSON.parse(localStorage.getItem(`rl_${key}`) || '[]');
  const recent = stored.filter(t => now - t < windowMs).sort((a, b) => a - b);
  if (recent.length < max) return 0;
  return windowMs - (now - recent[0]);
}
