import { NextRequest, NextResponse } from 'next/server';
import { createLeaderboard, calculateTier, calculateRankPoints, Tier } from '@/lib/rankings';

// Mock data - in production this would come from the database
const mockAthletes = {
  '100m': [
    { id: '1', name: "Jaylen 'Flash' Thompson", school: 'Lincoln HS', performance: 10150, previousRank: 1 },
    { id: '2', name: 'Marcus Johnson', school: 'Roosevelt HS', performance: 10480, previousRank: 3 },
    { id: '3', name: 'Tyler Smith', school: 'Jefferson HS', performance: 10620, previousRank: 2 },
    { id: '4', name: 'James Williams', school: 'Washington HS', performance: 10780, previousRank: 5 },
    { id: '5', name: 'Chris Davis', school: 'Adams HS', performance: 10950, previousRank: 4 },
    { id: '6', name: 'Michael Brown', school: 'Madison HS', performance: 11120, previousRank: 6 },
    { id: '7', name: 'David Wilson', school: 'Monroe HS', performance: 11180, previousRank: 9 },
    { id: '8', name: 'Kevin Taylor', school: 'Jackson HS', performance: 11250, previousRank: 7 },
    { id: '9', name: 'Ryan Anderson', school: 'Harrison HS', performance: 11320, previousRank: 8 },
    { id: '10', name: 'Brandon Lee', school: 'Franklin HS', performance: 11400, previousRank: 12 },
  ],
  '200m': [
    { id: '3', name: 'Tyler Smith', school: 'Jefferson HS', performance: 20450, previousRank: 1 },
    { id: '1', name: "Jaylen 'Flash' Thompson", school: 'Lincoln HS', performance: 20680, previousRank: 2 },
    { id: '2', name: 'Marcus Johnson', school: 'Roosevelt HS', performance: 21200, previousRank: 3 },
    { id: '4', name: 'James Williams', school: 'Washington HS', performance: 21800, previousRank: 4 },
    { id: '5', name: 'Chris Davis', school: 'Adams HS', performance: 22100, previousRank: 6 },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const event = searchParams.get('event') || '100m';
  const scope = searchParams.get('scope') || 'state';
  const limit = parseInt(searchParams.get('limit') || '50');

  // Get athletes for the event
  const athletes = mockAthletes[event as keyof typeof mockAthletes] || mockAthletes['100m'];
  
  // Create leaderboard
  const leaderboard = createLeaderboard(athletes, event, false);
  
  // Apply limit
  const limitedLeaderboard = leaderboard.slice(0, limit);

  return NextResponse.json({
    event,
    scope,
    total: leaderboard.length,
    leaderboard: limitedLeaderboard,
    lastUpdated: new Date().toISOString(),
  });
}

// POST endpoint for calculating tier/points for a single performance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, performance, isFieldEvent = false } = body;

    if (!event || performance === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: event, performance' },
        { status: 400 }
      );
    }

    const tier = calculateTier(event, performance, isFieldEvent);
    const points = calculateRankPoints(event, performance, isFieldEvent);

    return NextResponse.json({
      event,
      performance,
      tier,
      points,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
