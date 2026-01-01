import { NextRequest, NextResponse } from 'next/server';

// Mock posts data
const posts = [
  {
    id: "p1",
    authorId: "u1",
    author: {
      name: "Elias Bolt",
      username: "flashjaylen",
      school: "Lincoln HS",
      tier: "GODSPEED",
      verified: true,
    },
    type: "pr",
    content: "NEW PR ALERT! 🔥 Finally broke 10.2 in the 100m!",
    performance: {
      event: "100m",
      time: "10.15",
      improvement: "-0.08",
      tier: "GODSPEED",
    },
    likes: 342,
    comments: 47,
    shares: 23,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p2",
    authorId: "u2",
    author: {
      name: "Maya Rodriguez",
      username: "mayasprints",
      school: "Roosevelt HS",
      tier: "ELITE",
      verified: false,
    },
    type: "workout",
    content: "6x200m session complete! Legs are toast but feeling strong 💪",
    workout: {
      title: "Sprint Intervals",
      type: "sprint",
      duration: 45,
      effort: 8,
    },
    likes: 89,
    comments: 12,
    shares: 3,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'pr', 'workout', 'meet', or null for all
  const limit = parseInt(searchParams.get('limit') || '20');
  const cursor = searchParams.get('cursor'); // for pagination

  let filteredPosts = posts;
  
  if (type) {
    filteredPosts = posts.filter(p => p.type === type);
  }

  // Sort by date (newest first)
  filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({
    total: filteredPosts.length,
    posts: filteredPosts.slice(0, limit),
    nextCursor: filteredPosts.length > limit ? filteredPosts[limit - 1].id : null,
  });
}

// POST endpoint for creating a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, content, performance, workout, meet, media } = body;

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: type, content' },
        { status: 400 }
      );
    }

    // In production, this would save to the database
    const post = {
      id: `post-${Date.now()}`,
      authorId: "current-user", // Would come from auth
      type,
      content,
      performance: performance || null,
      workout: workout || null,
      meet: meet || null,
      media: media || null,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      post,
      message: 'Post created successfully! 🎉',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
