import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimit } from '@/lib/rate-limit';

describe('rateLimit', () => {
  it('allows requests under the limit', () => {
    const key = `test_${Math.random()}`;
    const result = rateLimit(key, 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('blocks after limit is exceeded', () => {
    const key = `test_${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      rateLimit(key, 3, 60_000);
    }
    const result = rateLimit(key, 3, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('allows requests again after window expires', async () => {
    const key = `test_${Math.random()}`;
    // Use a very short window
    rateLimit(key, 1, 1);
    rateLimit(key, 1, 1); // blocked

    // Wait for the window to expire
    await new Promise((r) => setTimeout(r, 10));

    const result = rateLimit(key, 1, 1);
    expect(result.allowed).toBe(true);
  });

  it('uses separate buckets for different keys', () => {
    const key1 = `test_${Math.random()}`;
    const key2 = `test_${Math.random()}`;

    for (let i = 0; i < 2; i++) rateLimit(key1, 2, 60_000);
    const blocked = rateLimit(key1, 2, 60_000);
    expect(blocked.allowed).toBe(false);

    const other = rateLimit(key2, 2, 60_000);
    expect(other.allowed).toBe(true);
  });
});
