// Public API Types

import { ApiKey, ApiPermission, ApiUsageLog, Webhook, WebhookEvent, WebhookDelivery } from "../integrations/types";

// API Response wrapper
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    perPage?: number;
    total?: number;
    hasMore?: boolean;
  };
};

// Rate limit info
export type RateLimitInfo = {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
};

// Public API Endpoints

// GET /athletes/:id
export type PublicAthlete = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  school?: string;
  graduationYear?: number;
  events: string[];
  tier?: string;
  isVerified: boolean;
  followersCount: number;
  createdAt: string;
};

// GET /athletes/:id/prs
export type PublicPR = {
  event: string;
  time: number;
  timeFormatted: string;
  date: string;
  meetName?: string;
  isVerified: boolean;
  rank?: {
    state?: number;
    national?: number;
  };
};

// GET /athletes/:id/results
export type PublicResult = {
  id: string;
  event: string;
  time: number;
  timeFormatted: string;
  place?: number;
  meetName: string;
  meetDate: string;
  isPR: boolean;
  wind?: number;
};

// GET /rankings
export type PublicRanking = {
  rank: number;
  athlete: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    school?: string;
    graduationYear?: number;
  };
  event: string;
  time: number;
  timeFormatted: string;
  date: string;
  meetName?: string;
};

export type RankingsQuery = {
  event: string;
  scope: "state" | "national";
  state?: string;
  gender?: "male" | "female";
  graduationYear?: number;
  season?: string;
  page?: number;
  perPage?: number;
};

// GET /meets
export type PublicMeet = {
  id: string;
  name: string;
  date: string;
  location?: string;
  venue?: string;
  type: string;
  resultsCount: number;
  athletesCount: number;
};

// GET /meets/:id/results
export type PublicMeetResult = {
  event: string;
  results: Array<{
    place: number;
    athlete: {
      id: string;
      displayName: string;
      school?: string;
    };
    time: number;
    timeFormatted: string;
    isPR: boolean;
    wind?: number;
  }>;
};

// API Key creation request
export type CreateApiKeyRequest = {
  name: string;
  permissions: ApiPermission[];
  expiresInDays?: number;
};

// API Key response (only returned on creation)
export type CreateApiKeyResponse = {
  id: string;
  name: string;
  key: string; // Full key, only shown once
  keyPrefix: string;
  permissions: ApiPermission[];
  rateLimit: number;
  expiresAt?: string;
  createdAt: string;
};

// Webhook creation request
export type CreateWebhookRequest = {
  url: string;
  events: WebhookEvent[];
};

// Webhook response
export type WebhookResponse = {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string; // Only shown on creation
  status: Webhook["status"];
  createdAt: string;
};

// API Documentation types
export type ApiEndpoint = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  auth: boolean;
  permissions?: ApiPermission[];
  parameters?: Array<{
    name: string;
    in: "path" | "query" | "body";
    type: string;
    required: boolean;
    description: string;
  }>;
  responses: Array<{
    status: number;
    description: string;
    example?: unknown;
  }>;
};

// API Documentation
export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/athletes/:id",
    description: "Get athlete profile by ID",
    auth: true,
    permissions: ["read:profile"],
    parameters: [
      { name: "id", in: "path", type: "string", required: true, description: "Athlete ID" },
    ],
    responses: [
      { status: 200, description: "Athlete profile" },
      { status: 404, description: "Athlete not found" },
    ],
  },
  {
    method: "GET",
    path: "/athletes/:id/prs",
    description: "Get athlete's personal records",
    auth: true,
    permissions: ["read:prs"],
    parameters: [
      { name: "id", in: "path", type: "string", required: true, description: "Athlete ID" },
    ],
    responses: [
      { status: 200, description: "List of PRs" },
      { status: 404, description: "Athlete not found" },
    ],
  },
  {
    method: "GET",
    path: "/athletes/:id/results",
    description: "Get athlete's competition results",
    auth: true,
    permissions: ["read:prs"],
    parameters: [
      { name: "id", in: "path", type: "string", required: true, description: "Athlete ID" },
      { name: "event", in: "query", type: "string", required: false, description: "Filter by event" },
      { name: "season", in: "query", type: "string", required: false, description: "Filter by season" },
      { name: "page", in: "query", type: "number", required: false, description: "Page number" },
      { name: "perPage", in: "query", type: "number", required: false, description: "Results per page (max 100)" },
    ],
    responses: [
      { status: 200, description: "List of results" },
      { status: 404, description: "Athlete not found" },
    ],
  },
  {
    method: "GET",
    path: "/rankings",
    description: "Get rankings for an event",
    auth: true,
    permissions: ["read:rankings"],
    parameters: [
      { name: "event", in: "query", type: "string", required: true, description: "Event name (e.g., '100m')" },
      { name: "scope", in: "query", type: "string", required: true, description: "'state' or 'national'" },
      { name: "state", in: "query", type: "string", required: false, description: "State code (required if scope=state)" },
      { name: "gender", in: "query", type: "string", required: false, description: "'male' or 'female'" },
      { name: "graduationYear", in: "query", type: "number", required: false, description: "Filter by graduation year" },
      { name: "page", in: "query", type: "number", required: false, description: "Page number" },
      { name: "perPage", in: "query", type: "number", required: false, description: "Results per page (max 100)" },
    ],
    responses: [
      { status: 200, description: "List of rankings" },
      { status: 400, description: "Invalid parameters" },
    ],
  },
  {
    method: "GET",
    path: "/meets",
    description: "List meets",
    auth: true,
    permissions: ["read:meets"],
    parameters: [
      { name: "startDate", in: "query", type: "string", required: false, description: "Filter by start date (YYYY-MM-DD)" },
      { name: "endDate", in: "query", type: "string", required: false, description: "Filter by end date" },
      { name: "state", in: "query", type: "string", required: false, description: "Filter by state" },
      { name: "page", in: "query", type: "number", required: false, description: "Page number" },
      { name: "perPage", in: "query", type: "number", required: false, description: "Results per page (max 100)" },
    ],
    responses: [
      { status: 200, description: "List of meets" },
    ],
  },
  {
    method: "GET",
    path: "/meets/:id/results",
    description: "Get results for a meet",
    auth: true,
    permissions: ["read:meets"],
    parameters: [
      { name: "id", in: "path", type: "string", required: true, description: "Meet ID" },
      { name: "event", in: "query", type: "string", required: false, description: "Filter by event" },
    ],
    responses: [
      { status: 200, description: "Meet results by event" },
      { status: 404, description: "Meet not found" },
    ],
  },
];

// Rate limit tiers
export const RATE_LIMIT_TIERS = {
  free: {
    requestsPerHour: 100,
    requestsPerDay: 1000,
  },
  pro: {
    requestsPerHour: 10000,
    requestsPerDay: 100000,
  },
  enterprise: {
    requestsPerHour: 100000,
    requestsPerDay: 1000000,
  },
};
