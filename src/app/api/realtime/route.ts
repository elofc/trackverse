import { NextRequest, NextResponse } from "next/server";
import { 
  emitNewPR, 
  emitRankChange, 
  emitNewPost, 
  emitPostLike,
  emitWorkoutComplete,
  emitMeetResult,
  isRealtimeAvailable,
} from "@/lib/socket/events";

// API endpoint to trigger real-time events from server-side actions
// This is useful for webhooks, background jobs, or admin actions

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, payload } = body;

    if (!isRealtimeAvailable()) {
      return NextResponse.json(
        { error: "Real-time server not available" },
        { status: 503 }
      );
    }

    switch (type) {
      case "NEW_PR":
        emitNewPR(
          payload.athleteId,
          payload.athleteName,
          payload.event,
          payload.time,
          payload.tier
        );
        break;

      case "RANK_CHANGE":
        emitRankChange(
          payload.athleteId,
          payload.athleteName,
          payload.event,
          payload.oldRank,
          payload.newRank
        );
        break;

      case "NEW_POST":
        emitNewPost(payload.post);
        break;

      case "POST_LIKE":
        emitPostLike(payload.postId, payload.userId, payload.userName);
        break;

      case "WORKOUT_COMPLETE":
        emitWorkoutComplete(
          payload.athleteId,
          payload.athleteName,
          payload.workout,
          payload.teamId
        );
        break;

      case "MEET_RESULT":
        emitMeetResult(payload.meetId, payload.result);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown event type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, type });
  } catch (error) {
    console.error("Realtime API error:", error);
    return NextResponse.json(
      { error: "Failed to emit event" },
      { status: 500 }
    );
  }
}

// GET endpoint to check real-time status
export async function GET() {
  return NextResponse.json({
    available: isRealtimeAvailable(),
    timestamp: new Date().toISOString(),
  });
}
