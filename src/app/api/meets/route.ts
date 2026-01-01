import { NextRequest, NextResponse } from 'next/server';

// Mock meets data
const meets = [
  {
    id: "meet-1",
    name: "Regional Championships",
    date: "2025-01-15",
    startTime: "8:00 AM",
    location: "Lincoln Stadium",
    city: "Springfield",
    state: "OR",
    type: "championship",
    level: "high_school",
    participants: 450,
    status: "upcoming",
    events: ["100m", "200m", "400m", "800m", "1600m", "4x100m", "4x400m", "Long Jump", "High Jump", "Shot Put"],
  },
  {
    id: "meet-2",
    name: "Winter Invitational",
    date: "2025-01-22",
    location: "Roosevelt Track Complex",
    city: "Riverside",
    state: "CA",
    type: "invitational",
    level: "high_school",
    participants: 280,
    status: "upcoming",
    events: ["100m", "200m", "400m", "800m", "High Jump", "Shot Put"],
  },
  {
    id: "meet-5",
    name: "Season Opener",
    date: "2024-12-10",
    location: "Adams Field",
    city: "Portland",
    state: "OR",
    type: "invitational",
    level: "high_school",
    participants: 200,
    status: "completed",
    events: ["100m", "200m", "400m"],
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); // 'upcoming', 'completed', or null for all
  const limit = parseInt(searchParams.get('limit') || '50');

  let filteredMeets = meets;
  
  if (status) {
    filteredMeets = meets.filter(m => m.status === status);
  }

  // Sort by date
  filteredMeets.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return status === 'completed' ? dateB - dateA : dateA - dateB;
  });

  return NextResponse.json({
    total: filteredMeets.length,
    meets: filteredMeets.slice(0, limit),
  });
}

// POST endpoint for creating a new meet result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { meetId, eventId, performance, place, heat, lane, windSpeed, isPR, videoUrl } = body;

    if (!meetId || !eventId || performance === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: meetId, eventId, performance' },
        { status: 400 }
      );
    }

    // In production, this would save to the database
    const result = {
      id: `result-${Date.now()}`,
      meetId,
      eventId,
      performance,
      place: place || null,
      heat: heat || null,
      lane: lane || null,
      windSpeed: windSpeed || null,
      isPR: isPR || false,
      videoUrl: videoUrl || null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
