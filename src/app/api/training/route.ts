import { NextRequest, NextResponse } from 'next/server';

// Mock workouts data
const workouts = [
  {
    id: "w1",
    title: "Sprint Intervals",
    type: "sprint",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    totalDistance: 1200,
    duration: 45,
    effort: 8,
    description: "6x200m at 90% with 3min rest",
    splits: ["26.5", "26.8", "27.1", "26.9", "27.3", "26.4"],
    surface: "track",
    location: "Lincoln HS Track",
  },
  {
    id: "w2",
    title: "Tempo Run",
    type: "tempo",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    totalDistance: 3000,
    duration: 15,
    effort: 6,
    description: "Steady state 3k at 75%",
    surface: "track",
  },
  {
    id: "w3",
    title: "Plyometrics",
    type: "plyo",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 45,
    effort: 7,
    description: "Box jumps, bounds, hurdle hops",
    surface: "gym",
  },
];

// Training stats
const trainingStats = {
  weeklyVolume: 8200, // meters
  trainingStreak: 12, // days
  workoutsThisWeek: 4,
  workoutsGoal: 6,
  avgEffort: 6.8,
  acuteLoad: 4200,
  chronicLoad: 3800,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'workouts', 'stats', or null for both
  const limit = parseInt(searchParams.get('limit') || '10');

  if (type === 'stats') {
    return NextResponse.json({
      stats: trainingStats,
      acwr: (trainingStats.acuteLoad / trainingStats.chronicLoad).toFixed(2),
    });
  }

  if (type === 'workouts') {
    return NextResponse.json({
      total: workouts.length,
      workouts: workouts.slice(0, limit),
    });
  }

  // Return both
  return NextResponse.json({
    stats: trainingStats,
    acwr: (trainingStats.acuteLoad / trainingStats.chronicLoad).toFixed(2),
    workouts: workouts.slice(0, limit),
  });
}

// POST endpoint for logging a new workout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, 
      title, 
      description, 
      duration, 
      totalDistance, 
      effort, 
      splits, 
      surface, 
      location, 
      notes 
    } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title' },
        { status: 400 }
      );
    }

    // Calculate training load points (simplified)
    const loadPoints = (duration || 0) * (effort || 5) + (totalDistance || 0) / 100;

    // In production, this would save to the database
    const workout = {
      id: `workout-${Date.now()}`,
      type,
      title,
      description: description || null,
      duration: duration || null,
      totalDistance: totalDistance || null,
      effort: effort || 5,
      splits: splits || null,
      surface: surface || 'track',
      location: location || null,
      notes: notes || null,
      loadPoints,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      workout,
      message: 'Workout logged successfully! 💪',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
