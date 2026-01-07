// Integration System Types

// Supported Integration Providers
export type IntegrationProvider = 
  | "strava"
  | "garmin"
  | "apple_health"
  | "google_fit"
  | "manual";

// OAuth State
export type OAuthState = {
  provider: IntegrationProvider;
  state: string;
  codeVerifier?: string; // For PKCE
  redirectUri: string;
  createdAt: string;
  expiresAt: string;
};

// Connected Integration
export type Integration = {
  id: string;
  userId: string;
  provider: IntegrationProvider;
  status: "connected" | "disconnected" | "error" | "syncing";
  
  // OAuth tokens (encrypted in production)
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  
  // Provider-specific data
  providerUserId?: string;
  providerUsername?: string;
  providerAvatarUrl?: string;
  
  // Sync settings
  autoSync: boolean;
  syncFrequency: "realtime" | "hourly" | "daily" | "manual";
  lastSyncAt?: string;
  lastSyncStatus?: "success" | "partial" | "failed";
  lastSyncError?: string;
  
  // Permissions/scopes
  scopes: string[];
  
  createdAt: string;
  updatedAt: string;
};

// Strava-specific types
export type StravaActivity = {
  id: number;
  name: string;
  type: string; // "Run", "Ride", etc.
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number;
  average_speed: number; // m/s
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  calories?: number;
  description?: string;
  workout_type?: number;
  map?: {
    id: string;
    summary_polyline: string;
    polyline?: string;
  };
  laps?: StravaLap[];
};

export type StravaLap = {
  id: number;
  name: string;
  elapsed_time: number;
  moving_time: number;
  distance: number;
  average_speed: number;
  max_speed: number;
  lap_index: number;
  split: number;
};

export type StravaAthlete = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  profile: string;
  profile_medium: string;
  city?: string;
  state?: string;
  country?: string;
};

// Garmin-specific types
export type GarminActivity = {
  activityId: number;
  activityName: string;
  activityType: string;
  startTimeLocal: string;
  startTimeGMT: string;
  duration: number; // seconds
  distance: number; // meters
  averageSpeed: number;
  maxSpeed: number;
  calories: number;
  averageHR?: number;
  maxHR?: number;
  steps?: number;
  elevationGain?: number;
  elevationLoss?: number;
};

// Imported Workout (normalized)
export type ImportedWorkout = {
  id: string;
  externalId: string;
  provider: IntegrationProvider;
  userId: string;
  
  // Core data
  name: string;
  type: WorkoutType;
  date: string;
  duration: number; // minutes
  distance?: number; // km
  
  // Performance metrics
  averagePace?: number; // min/km
  averageSpeed?: number; // km/h
  maxSpeed?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  calories?: number;
  elevationGain?: number;
  
  // Splits/laps
  splits?: ImportedSplit[];
  
  // GPS data
  hasGpsData: boolean;
  routePolyline?: string;
  
  // Notes
  description?: string;
  
  // Import metadata
  importedAt: string;
  rawData?: Record<string, unknown>;
};

export type ImportedSplit = {
  index: number;
  distance: number; // km
  duration: number; // seconds
  pace?: number; // min/km
  heartRate?: number;
};

export type WorkoutType = 
  | "run"
  | "track_workout"
  | "interval"
  | "tempo"
  | "long_run"
  | "easy_run"
  | "race"
  | "cross_training"
  | "strength"
  | "other";

// Manual Import Types
export type ManualImportFormat = "csv" | "json";

export type ManualImportMapping = {
  date: string;
  event?: string;
  time?: string;
  place?: string;
  meetName?: string;
  notes?: string;
};

export type ImportResult = {
  success: boolean;
  imported: number;
  skipped: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
};

// API Types
export type ApiKey = {
  id: string;
  userId: string;
  name: string;
  key: string; // hashed, only shown once on creation
  keyPrefix: string; // first 8 chars for identification
  permissions: ApiPermission[];
  rateLimit: number; // requests per hour
  usageCount: number;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
  revokedAt?: string;
};

export type ApiPermission = 
  | "read:profile"
  | "read:prs"
  | "read:workouts"
  | "read:rankings"
  | "read:meets"
  | "write:workouts"
  | "write:results";

export type ApiUsageLog = {
  id: string;
  apiKeyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number; // ms
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
};

// Webhook Types
export type Webhook = {
  id: string;
  userId: string;
  url: string;
  events: WebhookEvent[];
  secret: string; // for signature verification
  status: "active" | "paused" | "failed";
  failureCount: number;
  lastTriggeredAt?: string;
  lastResponseCode?: number;
  createdAt: string;
  updatedAt: string;
};

export type WebhookEvent = 
  | "workout.created"
  | "workout.updated"
  | "pr.set"
  | "result.added"
  | "ranking.changed";

export type WebhookDelivery = {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  payload: Record<string, unknown>;
  responseCode?: number;
  responseBody?: string;
  duration?: number;
  status: "pending" | "success" | "failed";
  attempts: number;
  nextRetryAt?: string;
  createdAt: string;
};

// Provider Configuration
export type ProviderConfig = {
  provider: IntegrationProvider;
  name: string;
  description: string;
  icon: string;
  color: string;
  authUrl?: string;
  tokenUrl?: string;
  scopes?: string[];
  features: string[];
  available: boolean;
};

export const PROVIDER_CONFIGS: Record<IntegrationProvider, ProviderConfig> = {
  strava: {
    provider: "strava",
    name: "Strava",
    description: "Import runs and workouts from Strava",
    icon: "strava",
    color: "#FC4C02",
    authUrl: "https://www.strava.com/oauth/authorize",
    tokenUrl: "https://www.strava.com/oauth/token",
    scopes: ["read", "activity:read_all"],
    features: ["Import workouts", "Sync training data", "GPS routes"],
    available: true,
  },
  garmin: {
    provider: "garmin",
    name: "Garmin Connect",
    description: "Sync data from your Garmin watch",
    icon: "garmin",
    color: "#007CC3",
    authUrl: "https://connect.garmin.com/oauthConfirm",
    tokenUrl: "https://connectapi.garmin.com/oauth-service/oauth/access_token",
    scopes: ["activity:read"],
    features: ["Import activities", "Heart rate data", "GPS routes"],
    available: true,
  },
  apple_health: {
    provider: "apple_health",
    name: "Apple Health",
    description: "Sync health data from your iPhone",
    icon: "apple",
    color: "#FF2D55",
    features: ["Workouts", "Heart rate", "Sleep data"],
    available: false, // Requires mobile app
  },
  google_fit: {
    provider: "google_fit",
    name: "Google Fit",
    description: "Sync fitness data from Google",
    icon: "google",
    color: "#4285F4",
    features: ["Workouts", "Steps", "Heart rate"],
    available: false, // Requires mobile app
  },
  manual: {
    provider: "manual",
    name: "Manual Import",
    description: "Import data from CSV or JSON files",
    icon: "upload",
    color: "#71717A",
    features: ["Meet results", "PRs", "Workout history"],
    available: true,
  },
};
