// Strava Integration

import { StravaActivity, StravaAthlete, ImportedWorkout, WorkoutType } from "./types";

// Strava OAuth Configuration
const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || "";
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET || "";
const STRAVA_REDIRECT_URI = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI || "http://localhost:3000/api/integrations/strava/callback";

// Generate OAuth URL
export function getStravaAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    redirect_uri: STRAVA_REDIRECT_URI,
    response_type: "code",
    scope: "read,activity:read_all",
    state,
  });

  return `https://www.strava.com/oauth/authorize?${params.toString()}`;
}

// Exchange code for tokens
export async function exchangeStravaCode(code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  athlete: StravaAthlete;
}> {
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange Strava code");
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
    athlete: data.athlete,
  };
}

// Refresh access token
export async function refreshStravaToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}> {
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Strava token");
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
  };
}

// Fetch activities from Strava
export async function fetchStravaActivities(
  accessToken: string,
  options: {
    after?: number; // Unix timestamp
    before?: number;
    page?: number;
    perPage?: number;
  } = {}
): Promise<StravaActivity[]> {
  const params = new URLSearchParams();
  
  if (options.after) params.set("after", options.after.toString());
  if (options.before) params.set("before", options.before.toString());
  if (options.page) params.set("page", options.page.toString());
  params.set("per_page", (options.perPage || 30).toString());

  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("STRAVA_TOKEN_EXPIRED");
    }
    throw new Error("Failed to fetch Strava activities");
  }

  return response.json();
}

// Fetch single activity with details
export async function fetchStravaActivity(
  accessToken: string,
  activityId: number
): Promise<StravaActivity> {
  const response = await fetch(
    `https://www.strava.com/api/v3/activities/${activityId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Strava activity");
  }

  return response.json();
}

// Get authenticated athlete
export async function fetchStravaAthlete(accessToken: string): Promise<StravaAthlete> {
  const response = await fetch("https://www.strava.com/api/v3/athlete", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Strava athlete");
  }

  return response.json();
}

// Deauthorize (revoke access)
export async function deauthorizeStrava(accessToken: string): Promise<void> {
  await fetch("https://www.strava.com/oauth/deauthorize", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// Convert Strava activity to normalized workout
export function convertStravaActivity(
  activity: StravaActivity,
  userId: string
): ImportedWorkout {
  // Map Strava activity type to our workout type
  const typeMap: Record<string, WorkoutType> = {
    Run: "run",
    TrailRun: "run",
    Track: "track_workout",
    Workout: "interval",
    Race: "race",
    Walk: "easy_run",
    Hike: "cross_training",
    WeightTraining: "strength",
    CrossFit: "strength",
  };

  const workoutType = typeMap[activity.type] || "other";

  // Convert splits/laps
  const splits = activity.laps?.map((lap, index) => ({
    index: index + 1,
    distance: lap.distance / 1000, // meters to km
    duration: lap.moving_time,
    pace: lap.distance > 0 ? (lap.moving_time / 60) / (lap.distance / 1000) : undefined,
  }));

  return {
    id: `strava_${activity.id}`,
    externalId: activity.id.toString(),
    provider: "strava",
    userId,
    name: activity.name,
    type: workoutType,
    date: activity.start_date_local,
    duration: Math.round(activity.moving_time / 60), // seconds to minutes
    distance: activity.distance / 1000, // meters to km
    averagePace: activity.distance > 0 
      ? (activity.moving_time / 60) / (activity.distance / 1000) 
      : undefined,
    averageSpeed: activity.average_speed * 3.6, // m/s to km/h
    maxSpeed: activity.max_speed * 3.6,
    averageHeartRate: activity.average_heartrate,
    maxHeartRate: activity.max_heartrate,
    calories: activity.calories,
    elevationGain: activity.total_elevation_gain,
    splits,
    hasGpsData: !!activity.map?.summary_polyline,
    routePolyline: activity.map?.summary_polyline,
    description: activity.description,
    importedAt: new Date().toISOString(),
    rawData: activity as unknown as Record<string, unknown>,
  };
}

// Sync all activities since last sync
export async function syncStravaActivities(
  accessToken: string,
  userId: string,
  lastSyncTimestamp?: number
): Promise<ImportedWorkout[]> {
  const activities: StravaActivity[] = [];
  let page = 1;
  const perPage = 50;
  let hasMore = true;

  // Fetch all activities since last sync
  while (hasMore) {
    const batch = await fetchStravaActivities(accessToken, {
      after: lastSyncTimestamp,
      page,
      perPage,
    });

    activities.push(...batch);
    hasMore = batch.length === perPage;
    page++;

    // Safety limit
    if (page > 10) break;
  }

  // Convert to normalized format
  return activities.map((activity) => convertStravaActivity(activity, userId));
}
