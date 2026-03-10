import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import ForumPost from '@/models/ForumPost';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    const post = await ForumPost.findByIdAndUpdate(
      id,
      {
        $push: {
          replies: {
            authorId: session.user.id,
            content: content.trim(),
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate('replies.authorId', 'name avatar');

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post.replies[post.replies.length - 1] });
  } catch (err) {
    console.error('[POST /api/forum/posts/[id]/reply]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
