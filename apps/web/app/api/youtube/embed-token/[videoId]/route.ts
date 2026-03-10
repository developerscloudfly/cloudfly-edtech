import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getVideoDetails, getYouTubeEmbedUrl } from '@/lib/youtube';

export async function GET(req: NextRequest, { params }: { params: Promise<{ videoId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { videoId } = await params;
    const embedUrl = getYouTubeEmbedUrl(videoId);
    const details = await getVideoDetails(videoId);

    return NextResponse.json({
      success: true,
      data: {
        videoId,
        embedUrl,
        title: details?.snippet?.title,
        duration: details?.contentDetails?.duration,
      },
    });
  } catch (err) {
    console.error('[GET /api/youtube/embed-token/[videoId]]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
