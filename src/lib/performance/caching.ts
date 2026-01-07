// Client-side caching utilities

// Simple in-memory cache with TTL
type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    // Evict oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
}

// Global cache instance
export const cache = new MemoryCache();

// Cache wrapper for async functions
export function withCache<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  keyFn: (...args: Args) => string,
  ttlMs: number = 5 * 60 * 1000
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    const key = keyFn(...args);
    const cached = cache.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const result = await fn(...args);
    cache.set(key, result, ttlMs);
    return result;
  };
}

// SWR-like stale-while-revalidate pattern
export function withSWR<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  keyFn: (...args: Args) => string,
  options: {
    staleTime?: number; // Time before data is considered stale
    cacheTime?: number; // Time before data is removed from cache
  } = {}
): (...args: Args) => Promise<{ data: T; isStale: boolean }> {
  const { staleTime = 60 * 1000, cacheTime = 5 * 60 * 1000 } = options;

  type CacheData = {
    data: T;
    fetchedAt: number;
  };

  return async (...args: Args) => {
    const key = keyFn(...args);
    const cached = cache.get<CacheData>(key);
    const now = Date.now();

    if (cached) {
      const isStale = now - cached.fetchedAt > staleTime;
      
      if (isStale) {
        // Return stale data immediately, revalidate in background
        fn(...args).then((freshData) => {
          cache.set(key, { data: freshData, fetchedAt: Date.now() }, cacheTime);
        });
      }

      return { data: cached.data, isStale };
    }

    // No cached data, fetch fresh
    const data = await fn(...args);
    cache.set(key, { data, fetchedAt: now }, cacheTime);
    return { data, isStale: false };
  };
}

// Debounce utility
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Throttle utility
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      window.setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Request deduplication
const pendingRequests = new Map<string, Promise<unknown>>();

export function dedupeRequest<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  const existing = pendingRequests.get(key) as Promise<T> | undefined;
  
  if (existing) {
    return existing;
  }

  const promise = fn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

// LocalStorage cache for persistence
export const localStorageCache = {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    
    try {
      const item = localStorage.getItem(`tv_cache_${key}`);
      if (!item) return null;
      
      const { data, expiresAt } = JSON.parse(item);
      if (Date.now() > expiresAt) {
        localStorage.removeItem(`tv_cache_${key}`);
        return null;
      }
      
      return data as T;
    } catch {
      return null;
    }
  },

  set<T>(key: string, data: T, ttlMs: number = 24 * 60 * 60 * 1000): void {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(
        `tv_cache_${key}`,
        JSON.stringify({
          data,
          expiresAt: Date.now() + ttlMs,
        })
      );
    } catch {
      // Storage full or unavailable
    }
  },

  delete(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`tv_cache_${key}`);
  },

  clear(): void {
    if (typeof window === "undefined") return;
    
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("tv_cache_"));
    keys.forEach((k) => localStorage.removeItem(k));
  },
};
