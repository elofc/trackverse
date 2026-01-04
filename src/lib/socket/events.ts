import { getRealtimeServer, RealtimeEvent, FeedPost, WorkoutSummary, MeetResult } from "./server";

// Helper functions to emit real-time events from anywhere in the app

export function emitNewPR(
  athleteId: string,
  athleteName: string,
  event: string,
  time: string,
  tier: string
) {
  const server = getRealtimeServer();
  if (!server) return;

  const realtimeEvent: RealtimeEvent = {
    type: "NEW_PR",
    athleteId,
    athleteName,
    event,
    time,
    tier,
  };

  // Broadcast to everyone
  server.broadcast(realtimeEvent);
}

export function emitRankChange(
  athleteId: string,
  athleteName: string,
  event: string,
  oldRank: number,
  newRank: number
) {
  const server = getRealtimeServer();
  if (!server) return;

  const realtimeEvent: RealtimeEvent = {
    type: "RANK_CHANGE",
    athleteId,
    athleteName,
    event,
    oldRank,
    newRank,
  };

  // Broadcast to everyone watching this event
  server.sendToRoom(`event:${event}`, realtimeEvent);
  // Also broadcast globally
  server.broadcast(realtimeEvent);
}

export function emitNewPost(post: FeedPost) {
  const server = getRealtimeServer();
  if (!server) return;

  const realtimeEvent: RealtimeEvent = {
    type: "NEW_POST",
    post,
  };

  server.broadcast(realtimeEvent);
}

export function emitPostLike(postId: string, userId: string, userName: string) {
  const server = getRealtimeServer();
  if (!server) return;

  const realtimeEvent: RealtimeEvent = {
    type: "POST_LIKE",
    postId,
    userId,
    userName,
  };

  server.broadcast(realtimeEvent);
}

export function emitPostComment(
  postId: string,
  userId: string,
  userName: string,
  comment: string
) {
  const server = getRealtimeServer();
  if (!server) return;

  const realtimeEvent: RealtimeEvent = {
    type: "POST_COMMENT",
    postId,
    userId,
    userName,
    comment,
  };

  server.broadcast(realtimeEvent);
}

export function emitWorkoutComplete(
  athleteId: string,
  athleteName: string,
  workout: WorkoutSummary,
  teamId?: string
) {
  const server = getRealtimeServer();
  if (!server) return;

  const realtimeEvent: RealtimeEvent = {
    type: "WORKOUT_COMPLETE",
    athleteId,
    athleteName,
    workout,
  };

  // Send to team if applicable
  if (teamId) {
    server.sendToTeam(teamId, realtimeEvent);
  }
  
  // Also broadcast globally
  server.broadcast(realtimeEvent);
}

export function emitMeetResult(meetId: string, result: MeetResult) {
  const server = getRealtimeServer();
  if (!server) return;

  const realtimeEvent: RealtimeEvent = {
    type: "MEET_RESULT",
    meetId,
    result,
  };

  // Send to everyone watching this meet
  server.sendToRoom(`meet:${meetId}`, realtimeEvent);
  
  // If it's a PR, broadcast globally
  if (result.isPR) {
    server.broadcast(realtimeEvent);
  }
}

// Utility to check if real-time is available
export function isRealtimeAvailable(): boolean {
  return getRealtimeServer() !== null;
}
