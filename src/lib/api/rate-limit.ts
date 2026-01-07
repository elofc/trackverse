// Rate Limiting Utilities

import { RateLimitInfo, RATE_LIMIT_TIERS } from "./types";

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Get rate limit tier for API key
export function getRateLimitTier(apiKeyTier: "free" | "pro" | "enterprise"): {
  requestsPerHour: number;
  requestsPerDay: number;
} {
  return RATE_LIMIT_TIERS[apiKeyTier] || RATE_LIMIT_TIERS.free;
}

// Check and update rate limit
export function checkRateLimit(
  apiKeyId: string,
  tier: "free" | "pro" | "enterprise" = "free"
): { allowed: boolean; info: RateLimitInfo } {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;
  const limits = getRateLimitTier(tier);

  const key = `ratelimit:${apiKeyId}:hour`;
  const existing = rateLimitStore.get(key);

  // Reset if expired
  if (!existing || existing.resetAt < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + hourMs,
    });

    return {
      allowed: true,
      info: {
        limit: limits.requestsPerHour,
        remaining: limits.requestsPerHour - 1,
        reset: Math.floor((now + hourMs) / 1000),
      },
    };
  }

  // Check if over limit
  if (existing.count >= limits.requestsPerHour) {
    return {
      allowed: false,
      info: {
        limit: limits.requestsPerHour,
        remaining: 0,
        reset: Math.floor(existing.resetAt / 1000),
      },
    };
  }

  // Increment counter
  existing.count++;
  rateLimitStore.set(key, existing);

  return {
    allowed: true,
    info: {
      limit: limits.requestsPerHour,
      remaining: limits.requestsPerHour - existing.count,
      reset: Math.floor(existing.resetAt / 1000),
    },
  };
}

// Get current rate limit status without incrementing
export function getRateLimitStatus(
  apiKeyId: string,
  tier: "free" | "pro" | "enterprise" = "free"
): RateLimitInfo {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;
  const limits = getRateLimitTier(tier);

  const key = `ratelimit:${apiKeyId}:hour`;
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt < now) {
    return {
      limit: limits.requestsPerHour,
      remaining: limits.requestsPerHour,
      reset: Math.floor((now + hourMs) / 1000),
    };
  }

  return {
    limit: limits.requestsPerHour,
    remaining: Math.max(0, limits.requestsPerHour - existing.count),
    reset: Math.floor(existing.resetAt / 1000),
  };
}

// Generate rate limit headers
export function getRateLimitHeaders(info: RateLimitInfo): Record<string, string> {
  return {
    "X-RateLimit-Limit": info.limit.toString(),
    "X-RateLimit-Remaining": info.remaining.toString(),
    "X-RateLimit-Reset": info.reset.toString(),
  };
}

// Clean up expired entries (call periodically)
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

// IP-based rate limiting for unauthenticated requests
const ipRateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkIpRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const minuteMs = 60 * 1000;
  const limit = 30; // 30 requests per minute for unauthenticated

  const key = `ip:${ip}`;
  const existing = ipRateLimitStore.get(key);

  if (!existing || existing.resetAt < now) {
    ipRateLimitStore.set(key, {
      count: 1,
      resetAt: now + minuteMs,
    });
    return { allowed: true };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count++;
  ipRateLimitStore.set(key, existing);
  return { allowed: true };
}
