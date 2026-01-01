import { NextRequest, NextResponse } from 'next/server';

// Mock comments data
const mockComments = [
  {
    id: "c1",
    postId: "p1",
    authorId: "u2",
    author: {
      name: "Maya Rodriguez",
      username: "mayasprints",
      tier: "ELITE",
    },
    content: "Congrats! That's insane! 🔥🔥",
    likes: 12,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "c2",
    postId: "p1",
    authorId: "u3",
    author: {
      name: "Marcus Johnson",
      username: "marcusj_track",
      tier: "WORLD_CLASS",
    },
    content: "Beast mode! See you at regionals 💪",
    likes: 8,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// GET comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const postId = params.postId;
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');

  // Filter comments for this post
  const comments = mockComments.filter(c => c.postId === postId);

  return NextResponse.json({
    total: comments.length,
    comments: comments.slice(0, limit),
  });
}

// POST - Add a comment
export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const body = await request.json();
    const { content } = body;
    const postId = params.postId;

    if (!content) {
      return NextResponse.json(
        { error: 'Missing content field' },
        { status: 400 }
      );
    }

    // In production, would save to database
    const comment = {
      id: `comment-${Date.now()}`,
      postId,
      authorId: "current-user",
      author: {
        name: "You",
        username: "yourhandle",
        tier: "ELITE",
      },
      content,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      comment,
      message: 'Comment added! 💬',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
