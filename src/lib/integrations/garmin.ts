// Garmin Connect Integration

import { GarminActivity, ImportedWorkout, WorkoutType } from "./types";

// Garmin OAuth Configuration
// Note: Garmin uses OAuth 1.0a which is more complex
const GARMIN_CONSUMER_KEY = process.env.GARMIN_CONSUMER_KEY || "";
const GARMIN_CONSUMER_SECRET = process.env.GARMIN_CONSUMER_SECRET || "";
const GARMIN_REDIRECT_URI = process.env.NEXT_PUBLIC_GARMIN_REDIRECT_URI || "http://localhost:3000/api/integrations/garmin/callback";

// Garmin API endpoints
const GARMIN_REQUEST_TOKEN_URL = "https://connectapi.garmin.com/oauth-service/oauth/request_token";
const GARMIN_AUTH_URL = "https://connect.garmin.com/oauthConfirm";
const GARMIN_ACCESS_TOKEN_URL = "https://connectapi.garmin.com/oauth-service/oauth/access_token";
const GARMIN_API_BASE = "https://apis.garmin.com";

// Generate OAuth 1.0a signature (simplified - in production use a library)
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string = ""
): string {
  // In production, use a proper OAuth 1.0a library like oauth-1.0a
  // This is a placeholder for the signature generation
  const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(
    Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;
  
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  
  // In production: return HMAC-SHA1 of baseString with signingKey, base64 encoded
  return Buffer.from(`${baseString}:${signingKey}`).toString("base64").slice(0, 32);
}

// Step 1: Get request token
export async function getGarminRequestToken(): Promise<{
  oauthToken: string;
  oauthTokenSecret: string;
}> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = Math.random().toString(36).substring(2);

  const params: Record<string, string> = {
    oauth_consumer_key: GARMIN_CONSUMER_KEY,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: "1.0",
    oauth_callback: GARMIN_REDIRECT_URI,
  };

  params.oauth_signature = generateOAuthSignature(
    "POST",
    GARMIN_REQUEST_TOKEN_URL,
    params,
    GARMIN_CONSUMER_SECRET
  );

  const response = await fetch(GARMIN_REQUEST_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${Object.entries(params)
        .map(([k, v]) => `${k}="${encodeURIComponent(v)}"`)
        .join(", ")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get Garmin request token");
  }

  const text = await response.text();
  const data = new URLSearchParams(text);

  return {
    oauthToken: data.get("oauth_token") || "",
    oauthTokenSecret: data.get("oauth_token_secret") || "",
  };
}

// Step 2: Generate auth URL for user
export function getGarminAuthUrl(oauthToken: string): string {
  return `${GARMIN_AUTH_URL}?oauth_token=${oauthToken}`;
}

// Step 3: Exchange verifier for access token
export async function exchangeGarminVerifier(
  oauthToken: string,
  oauthTokenSecret: string,
  oauthVerifier: string
): Promise<{
  accessToken: string;
  accessTokenSecret: string;
}> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = Math.random().toString(36).substring(2);

  const params: Record<string, string> = {
    oauth_consumer_key: GARMIN_CONSUMER_KEY,
    oauth_token: oauthToken,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: "1.0",
    oauth_verifier: oauthVerifier,
  };

  params.oauth_signature = generateOAuthSignature(
    "POST",
    GARMIN_ACCESS_TOKEN_URL,
    params,
    GARMIN_CONSUMER_SECRET,
    oauthTokenSecret
  );

  const response = await fetch(GARMIN_ACCESS_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${Object.entries(params)
        .map(([k, v]) => `${k}="${encodeURIComponent(v)}"`)
        .join(", ")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to exchange Garmin verifier");
  }

  const text = await response.text();
  const data = new URLSearchParams(text);

  return {
    accessToken: data.get("oauth_token") || "",
    accessTokenSecret: data.get("oauth_token_secret") || "",
  };
}

// Fetch activities from Garmin
export async function fetchGarminActivities(
  accessToken: string,
  accessTokenSecret: string,
  options: {
    startDate?: string; // YYYY-MM-DD
    endDate?: string;
    limit?: number;
  } = {}
): Promise<GarminActivity[]> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = Math.random().toString(36).substring(2);

  const queryParams = new URLSearchParams();
  if (options.startDate) queryParams.set("startDate", options.startDate);
  if (options.endDate) queryParams.set("endDate", options.endDate);
  if (options.limit) queryParams.set("limit", options.limit.toString());

  const url = `${GARMIN_API_BASE}/wellness-api/rest/activities?${queryParams.toString()}`;

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: GARMIN_CONSUMER_KEY,
    oauth_token: accessToken,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: "1.0",
  };

  oauthParams.oauth_signature = generateOAuthSignature(
    "GET",
    url.split("?")[0],
    { ...oauthParams, ...Object.fromEntries(queryParams) },
    GARMIN_CONSUMER_SECRET,
    accessTokenSecret
  );

  const response = await fetch(url, {
    headers: {
      Authorization: `OAuth ${Object.entries(oauthParams)
        .map(([k, v]) => `${k}="${encodeURIComponent(v)}"`)
        .join(", ")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Garmin activities");
  }

  return response.json();
}

// Convert Garmin activity to normalized workout
export function convertGarminActivity(
  activity: GarminActivity,
  userId: string
): ImportedWorkout {
  // Map Garmin activity type to our workout type
  const typeMap: Record<string, WorkoutType> = {
    running: "run",
    trail_running: "run",
    track_running: "track_workout",
    treadmill_running: "run",
    walking: "easy_run",
    hiking: "cross_training",
    strength_training: "strength",
    cycling: "cross_training",
  };

  const workoutType = typeMap[activity.activityType.toLowerCase()] || "other";

  return {
    id: `garmin_${activity.activityId}`,
    externalId: activity.activityId.toString(),
    provider: "garmin",
    userId,
    name: activity.activityName,
    type: workoutType,
    date: activity.startTimeLocal,
    duration: Math.round(activity.duration / 60), // seconds to minutes
    distance: activity.distance / 1000, // meters to km
    averagePace: activity.distance > 0
      ? (activity.duration / 60) / (activity.distance / 1000)
      : undefined,
    averageSpeed: activity.averageSpeed * 3.6, // m/s to km/h
    maxSpeed: activity.maxSpeed * 3.6,
    averageHeartRate: activity.averageHR,
    maxHeartRate: activity.maxHR,
    calories: activity.calories,
    elevationGain: activity.elevationGain,
    hasGpsData: false, // Would need separate API call for GPS data
    importedAt: new Date().toISOString(),
    rawData: activity as unknown as Record<string, unknown>,
  };
}

// Sync activities from Garmin
export async function syncGarminActivities(
  accessToken: string,
  accessTokenSecret: string,
  userId: string,
  lastSyncDate?: string
): Promise<ImportedWorkout[]> {
  const activities = await fetchGarminActivities(accessToken, accessTokenSecret, {
    startDate: lastSyncDate,
    limit: 100,
  });

  return activities.map((activity) => convertGarminActivity(activity, userId));
}
