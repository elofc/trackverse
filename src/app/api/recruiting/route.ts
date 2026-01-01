import { NextRequest, NextResponse } from 'next/server';

// Mock athletes database
const athletes = [
  {
    id: "1",
    name: "Elias Bolt",
    school: "Lincoln High School",
    location: "Springfield, OR",
    state: "OR",
    gradYear: 2025,
    events: [
      { name: "100m", time: "10.15", timeMs: 10150, tier: "GODSPEED", stateRank: 1, nationalRank: 12 },
      { name: "200m", time: "20.45", timeMs: 20450, tier: "WORLD_CLASS", stateRank: 2, nationalRank: 28 },
    ],
    profileViews: 1234,
    savedBy: 45,
    recruitingStatus: "open",
    verified: true,
    gpa: "3.8",
    satScore: "1320",
    height: "5'11\"",
    weight: "165 lbs",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    school: "Roosevelt High School",
    location: "Portland, OR",
    state: "OR",
    gradYear: 2025,
    events: [
      { name: "200m", time: "20.82", timeMs: 20820, tier: "WORLD_CLASS", stateRank: 3, nationalRank: 45 },
      { name: "400m", time: "46.92", timeMs: 46920, tier: "NATIONAL", stateRank: 1, nationalRank: 32 },
    ],
    profileViews: 892,
    savedBy: 32,
    recruitingStatus: "open",
    verified: true,
    gpa: "3.5",
    satScore: "1280",
    height: "6'0\"",
    weight: "170 lbs",
  },
  {
    id: "3",
    name: "Tyler Smith",
    school: "Jefferson High School",
    location: "Eugene, OR",
    state: "OR",
    gradYear: 2026,
    events: [
      { name: "110H", time: "13.85", timeMs: 13850, tier: "NATIONAL", stateRank: 1, nationalRank: 18 },
      { name: "300H", time: "37.42", timeMs: 37420, tier: "ALL_STATE", stateRank: 2, nationalRank: 56 },
    ],
    profileViews: 567,
    savedBy: 18,
    recruitingStatus: "open",
    verified: false,
    gpa: "3.9",
    satScore: "1350",
    height: "6'2\"",
    weight: "175 lbs",
  },
  {
    id: "4",
    name: "Chris Davis",
    school: "Washington High School",
    location: "Seattle, WA",
    state: "WA",
    gradYear: 2025,
    events: [
      { name: "800m", time: "1:49.23", timeMs: 109230, tier: "NATIONAL", stateRank: 1, nationalRank: 24 },
      { name: "1600m", time: "4:05.67", timeMs: 245670, tier: "ALL_STATE", stateRank: 3, nationalRank: 89 },
    ],
    profileViews: 723,
    savedBy: 28,
    recruitingStatus: "committed",
    verified: true,
    gpa: "4.0",
    satScore: "1420",
    height: "5'10\"",
    weight: "145 lbs",
  },
  {
    id: "5",
    name: "Jordan Williams",
    school: "Central High School",
    location: "Boise, ID",
    state: "ID",
    gradYear: 2026,
    events: [
      { name: "Long Jump", time: "7.42m", distanceCm: 742, tier: "ALL_STATE", stateRank: 1, nationalRank: 67 },
      { name: "Triple Jump", time: "15.23m", distanceCm: 1523, tier: "ELITE", stateRank: 2, nationalRank: 112 },
    ],
    profileViews: 412,
    savedBy: 15,
    recruitingStatus: "open",
    verified: true,
    gpa: "3.6",
    satScore: "1240",
    height: "6'1\"",
    weight: "165 lbs",
  },
];

// Mock prospect lists
const prospectLists: Record<string, { id: string; name: string; athleteIds: string[]; createdAt: string }[]> = {
  "scout-1": [
    { id: "list-1", name: "Top Sprinters 2025", athleteIds: ["1", "2"], createdAt: "2024-12-15" },
    { id: "list-2", name: "Distance Runners", athleteIds: ["4"], createdAt: "2024-12-10" },
  ],
};

// Mock messages
const messages: { id: string; scoutId: string; athleteId: string; content: string; sender: string; timestamp: string }[] = [
  { id: "m1", scoutId: "scout-1", athleteId: "1", content: "Hi Jaylen! Interested in our program?", sender: "scout", timestamp: "2024-12-30T14:30:00Z" },
  { id: "m2", scoutId: "scout-1", athleteId: "1", content: "Yes, I'd love to learn more!", sender: "athlete", timestamp: "2024-12-30T16:45:00Z" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  // Search athletes
  if (type === 'search') {
    const event = searchParams.get('event');
    const state = searchParams.get('state');
    const gradYear = searchParams.get('gradYear');
    const minTier = searchParams.get('minTier');
    const query = searchParams.get('q');

    let results = [...athletes];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.school.toLowerCase().includes(q)
      );
    }

    if (event && event !== 'All Events') {
      results = results.filter(a => a.events.some(e => e.name === event));
    }

    if (state && state !== 'All States') {
      results = results.filter(a => a.state === state);
    }

    if (gradYear && gradYear !== 'All Years') {
      results = results.filter(a => a.gradYear.toString() === gradYear);
    }

    if (minTier && minTier !== 'All Tiers') {
      const tierOrder = ['GODSPEED', 'WORLD_CLASS', 'NATIONAL', 'ALL_STATE', 'ELITE', 'VARSITY', 'JV', 'ROOKIE'];
      const minIndex = tierOrder.indexOf(minTier);
      results = results.filter(a => 
        a.events.some(e => tierOrder.indexOf(e.tier) <= minIndex)
      );
    }

    return NextResponse.json({
      total: results.length,
      athletes: results,
    });
  }

  // Get single athlete profile
  if (type === 'profile') {
    const athleteId = searchParams.get('athleteId');
    const athlete = athletes.find(a => a.id === athleteId);
    
    if (!athlete) {
      return NextResponse.json({ error: 'Athlete not found' }, { status: 404 });
    }

    // Increment view count (in real app, would update DB)
    return NextResponse.json({ athlete });
  }

  // Get prospect lists
  if (type === 'prospects') {
    const scoutId = searchParams.get('scoutId') || 'scout-1';
    const lists = prospectLists[scoutId] || [];
    
    const listsWithAthletes = lists.map(list => ({
      ...list,
      athletes: list.athleteIds.map(id => athletes.find(a => a.id === id)).filter(Boolean),
    }));

    return NextResponse.json({ lists: listsWithAthletes });
  }

  // Get messages
  if (type === 'messages') {
    const scoutId = searchParams.get('scoutId') || 'scout-1';
    const athleteId = searchParams.get('athleteId');

    let filteredMessages = messages.filter(m => m.scoutId === scoutId);
    
    if (athleteId) {
      filteredMessages = filteredMessages.filter(m => m.athleteId === athleteId);
    }

    // Group by athlete
    const conversations = athletes
      .filter(a => filteredMessages.some(m => m.athleteId === a.id))
      .map(athlete => ({
        athlete,
        messages: filteredMessages.filter(m => m.athleteId === athlete.id),
        lastMessage: filteredMessages
          .filter(m => m.athleteId === athlete.id)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0],
      }));

    return NextResponse.json({ conversations });
  }

  // Get recruiting analytics (for athletes)
  if (type === 'analytics') {
    const athleteId = searchParams.get('athleteId') || '1';
    
    return NextResponse.json({
      profileViews: { total: 1234, thisMonth: 342, trend: "+18%" },
      savedBy: { total: 45, thisMonth: 12, trend: "+50%" },
      messagesReceived: { total: 28, thisMonth: 8, trend: "+60%" },
      recentViewers: [
        { name: "Coach Smith", school: "State University", date: "2 hours ago" },
        { name: "Coach Johnson", school: "Tech University", date: "5 hours ago" },
      ],
    });
  }

  return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Save athlete to prospects
    if (action === 'save_athlete') {
      const { scoutId, athleteId, listId } = body;
      
      return NextResponse.json({
        success: true,
        message: 'Athlete saved to prospects! ⭐',
      });
    }

    // Remove athlete from prospects
    if (action === 'unsave_athlete') {
      const { scoutId, athleteId } = body;
      
      return NextResponse.json({
        success: true,
        message: 'Athlete removed from prospects',
      });
    }

    // Create prospect list
    if (action === 'create_list') {
      const { scoutId, name, description } = body;
      
      const newList = {
        id: `list-${Date.now()}`,
        name,
        description,
        athleteIds: [],
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        list: newList,
        message: 'Prospect list created! 📁',
      });
    }

    // Send message
    if (action === 'send_message') {
      const { scoutId, athleteId, content } = body;
      
      if (!content || !athleteId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const newMessage = {
        id: `msg-${Date.now()}`,
        scoutId,
        athleteId,
        content,
        sender: 'scout',
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        message: newMessage,
        notification: 'Message sent! 📨',
      });
    }

    // Update recruiting status (for athletes)
    if (action === 'update_status') {
      const { athleteId, status, visibility } = body;
      
      return NextResponse.json({
        success: true,
        message: 'Recruiting settings updated! ✅',
      });
    }

    // Track profile view
    if (action === 'track_view') {
      const { athleteId, viewerId, viewerType } = body;
      
      return NextResponse.json({
        success: true,
        message: 'View tracked',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
