// API Key Management

import crypto from "crypto";
import { ApiKey, ApiPermission } from "../integrations/types";

// Generate a new API key
export function generateApiKey(): { key: string; hash: string; prefix: string } {
  // Generate a random key: tv_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
  const randomPart = crypto.randomBytes(24).toString("hex");
  const key = `tv_live_${randomPart}`;
  
  // Hash the key for storage
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  
  // Prefix for identification (first 8 chars after tv_live_)
  const prefix = `tv_live_${randomPart.slice(0, 8)}`;

  return { key, hash, prefix };
}

// Generate a test API key
export function generateTestApiKey(): { key: string; hash: string; prefix: string } {
  const randomPart = crypto.randomBytes(24).toString("hex");
  const key = `tv_test_${randomPart}`;
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  const prefix = `tv_test_${randomPart.slice(0, 8)}`;

  return { key, hash, prefix };
}

// Hash an API key for comparison
export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

// Validate API key format
export function isValidApiKeyFormat(key: string): boolean {
  return /^tv_(live|test)_[a-f0-9]{48}$/.test(key);
}

// Check if key is a test key
export function isTestKey(key: string): boolean {
  return key.startsWith("tv_test_");
}

// Default permissions for new API keys
export const DEFAULT_PERMISSIONS: ApiPermission[] = [
  "read:profile",
  "read:prs",
  "read:rankings",
  "read:meets",
];

// All available permissions
export const ALL_PERMISSIONS: ApiPermission[] = [
  "read:profile",
  "read:prs",
  "read:workouts",
  "read:rankings",
  "read:meets",
  "write:workouts",
  "write:results",
];

// Permission descriptions
export const PERMISSION_DESCRIPTIONS: Record<ApiPermission, string> = {
  "read:profile": "Read athlete profiles",
  "read:prs": "Read personal records and results",
  "read:workouts": "Read workout data",
  "read:rankings": "Read rankings data",
  "read:meets": "Read meet information and results",
  "write:workouts": "Create and update workouts",
  "write:results": "Submit competition results",
};

// Check if API key has required permission
export function hasPermission(
  apiKey: ApiKey,
  requiredPermission: ApiPermission
): boolean {
  return apiKey.permissions.includes(requiredPermission);
}

// Check if API key has any of the required permissions
export function hasAnyPermission(
  apiKey: ApiKey,
  requiredPermissions: ApiPermission[]
): boolean {
  return requiredPermissions.some((p) => apiKey.permissions.includes(p));
}

// Check if API key has all required permissions
export function hasAllPermissions(
  apiKey: ApiKey,
  requiredPermissions: ApiPermission[]
): boolean {
  return requiredPermissions.every((p) => apiKey.permissions.includes(p));
}

// Check if API key is expired
export function isApiKeyExpired(apiKey: ApiKey): boolean {
  if (!apiKey.expiresAt) return false;
  return new Date(apiKey.expiresAt) < new Date();
}

// Check if API key is revoked
export function isApiKeyRevoked(apiKey: ApiKey): boolean {
  return !!apiKey.revokedAt;
}

// Check if API key is valid (not expired, not revoked)
export function isApiKeyValid(apiKey: ApiKey): boolean {
  return !isApiKeyExpired(apiKey) && !isApiKeyRevoked(apiKey);
}

// Mask API key for display
export function maskApiKey(key: string): string {
  if (key.length < 20) return "****";
  return `${key.slice(0, 12)}...${key.slice(-4)}`;
}

// Create API key object
export function createApiKeyObject(
  userId: string,
  name: string,
  permissions: ApiPermission[],
  options: {
    expiresInDays?: number;
    rateLimit?: number;
  } = {}
): { apiKey: ApiKey; fullKey: string } {
  const { key, hash, prefix } = generateApiKey();

  const apiKey: ApiKey = {
    id: `key_${crypto.randomBytes(12).toString("hex")}`,
    userId,
    name,
    key: hash, // Store hash, not the actual key
    keyPrefix: prefix,
    permissions,
    rateLimit: options.rateLimit || 100, // Default 100 requests/hour
    usageCount: 0,
    createdAt: new Date().toISOString(),
  };

  if (options.expiresInDays) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + options.expiresInDays);
    apiKey.expiresAt = expiresAt.toISOString();
  }

  return { apiKey, fullKey: key };
}

// Validate permissions array
export function validatePermissions(permissions: string[]): {
  valid: boolean;
  invalidPermissions: string[];
} {
  const invalidPermissions = permissions.filter(
    (p) => !ALL_PERMISSIONS.includes(p as ApiPermission)
  );

  return {
    valid: invalidPermissions.length === 0,
    invalidPermissions,
  };
}
