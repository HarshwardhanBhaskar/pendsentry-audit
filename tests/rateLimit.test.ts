import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkRateLimit } from '../lib/rateLimit';

describe('IP-Based Sliding Window Rate Limiter Tests', () => {
  beforeEach(() => {
    // Reset system time before each test if using timer mocks,
    // or use unique IPs to ensure independent test states.
    vi.useFakeTimers();
  });

  it('should allow requests under the limit and decrease remaining quota correctly', () => {
    const ip = '192.168.1.100';
    const config = { maxRequests: 3, windowMs: 60_000 };

    // Request 1
    const res1 = checkRateLimit(ip, config);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);
    expect(res1.retryAfterMs).toBe(0);

    // Request 2
    const res2 = checkRateLimit(ip, config);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);
    expect(res2.retryAfterMs).toBe(0);

    // Request 3
    const res3 = checkRateLimit(ip, config);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);
    expect(res3.retryAfterMs).toBe(0);
  });

  it('should block requests exceeding the limit and calculate retry time correctly', () => {
    const ip = '192.168.1.101';
    const config = { maxRequests: 2, windowMs: 60_000 };

    // 1st request
    checkRateLimit(ip, config);
    // Move time forward 10s
    vi.advanceTimersByTime(10_000);

    // 2nd request
    checkRateLimit(ip, config);

    // 3rd request (should be blocked)
    const res = checkRateLimit(ip, config);
    expect(res.allowed).toBe(false);
    expect(res.remaining).toBe(0);
    // retryAfterMs should be close to windowMs - (current - oldest)
    // current - oldest = 10_000 ms. Config window = 60_000 ms.
    // retryAfterMs should be approx 50_000 ms.
    expect(res.retryAfterMs).toBeLessThanOrEqual(50_000);
    expect(res.retryAfterMs).toBeGreaterThan(45_000);
  });

  it('should isolate rate limiting counts between different IP addresses', () => {
    const ipA = '192.168.1.201';
    const ipB = '192.168.1.202';
    const config = { maxRequests: 2, windowMs: 60_000 };

    // Fill quota for IP A
    checkRateLimit(ipA, config);
    checkRateLimit(ipA, config);
    const resA = checkRateLimit(ipA, config);
    expect(resA.allowed).toBe(false); // IP A is rate limited

    // IP B should still be completely allowed
    const resB = checkRateLimit(ipB, config);
    expect(resB.allowed).toBe(true);
    expect(resB.remaining).toBe(1);
  });

  it('should reset limits and allow new requests after the window expires', () => {
    const ip = '192.168.1.102';
    const config = { maxRequests: 2, windowMs: 60_000 };

    // Consume all requests
    checkRateLimit(ip, config);
    checkRateLimit(ip, config);
    
    // Confirm rate limited
    const blockedRes = checkRateLimit(ip, config);
    expect(blockedRes.allowed).toBe(false);

    // Advance system time past the window (61 seconds)
    vi.advanceTimersByTime(61_000);

    // Request should be allowed again
    const allowedRes = checkRateLimit(ip, config);
    expect(allowedRes.allowed).toBe(true);
    expect(allowedRes.remaining).toBe(1);
  });
});
