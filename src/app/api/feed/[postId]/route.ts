import { NextRequest, NextResponse } from 'next/server';

// GET single post
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const postId = params.postId;

  // Mock post data - in production would fetch from database
  const post = {
    id: postId,
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
  };

  return NextResponse.json({ post });
}

// POST - Like/unlike a post
export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const body = await request.json();
    const { action } = body; // 'like', 'unlike', 'share', 'save'
    const postId = params.postId;

    if (!action) {
      return NextResponse.json(
        { error: 'Missing action field' },
        { status: 400 }
      );
    }

    // In production, would update database
    return NextResponse.json({
      success: true,
      postId,
      action,
      message: action === 'like' ? 'Post liked! ❤️' : 
               action === 'unlike' ? 'Like removed' :
               action === 'share' ? 'Post shared!' :
               action === 'save' ? 'Post saved!' : 'Action completed',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
