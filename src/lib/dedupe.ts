// Simple in-memory deduper with TTL
const pending = new Map<string, number>(); // key -> expiry timestamp (ms)

export const isPending = (key: string) => {
  const expiry = pending.get(key);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    pending.delete(key);
    return false;
  }
  return true;
};

export const markPending = (key: string, ttlMs = 1000) => {
  pending.set(key, Date.now() + ttlMs);
};

export const clearPending = (key: string) => {
  pending.delete(key);
};

export const clearAll = () => pending.clear();
