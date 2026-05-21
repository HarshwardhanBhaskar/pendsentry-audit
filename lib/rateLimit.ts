/**
 * Simple in-memory sliding-window rate limiter.
 * Tracks requests per IP within a configurable time window.
 * No external dependencies — suitable for serverless cold-start environments.
 *
 * Note: In a multi-instance deployment (e.g. Vercel edge),
 * each instance maintains its own map. For production scale,
 * swap this with an Upstash Redis rate limiter.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const ipMap = new Map<string, RateLimitEntry>();

// Auto-cleanup stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [ip, entry] of ipMap.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) {
      ipMap.delete(ip);
    }
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * Check if a given IP address is within the allowed rate limit.
 * Returns whether the request is allowed and remaining quota.
 */
export function checkRateLimit(
  ip: string,
  config: RateLimitConfig = { maxRequests: 10, windowMs: 60_000 }
): RateLimitResult {
  const now = Date.now();

  cleanupStaleEntries(config.windowMs);

  const entry = ipMap.get(ip) || { timestamps: [] };

  // Filter to only timestamps within the current window
  entry.timestamps = entry.timestamps.filter(
    (t) => now - t < config.windowMs
  );

  if (entry.timestamps.length >= config.maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = config.windowMs - (now - oldestInWindow);

    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, retryAfterMs),
    };
  }

  // Record this request
  entry.timestamps.push(now);
  ipMap.set(ip, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
    retryAfterMs: 0,
  };
}
