import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, mode = 'Detailed' } = body;

    if (!url) {
      return NextResponse.json({ error: 'YouTube URL is required in the body: { "url": "..." }' }, { status: 400 });
    }

    const origin = request.nextUrl.origin;

    // Step 1: Extract Transcript
    const transcriptRes = await fetch(`${origin}/api/transcript`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (!transcriptRes.ok) {
      const errorData = await transcriptRes.json();
      return NextResponse.json({ error: errorData.error || 'Transcript extraction failed' }, { status: transcriptRes.status });
    }

    const { transcript, videoTitle } = await transcriptRes.json();

    // Step 2: Generate AI Notes
    const summarizeRes = await fetch(`${origin}/api/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, videoTitle, mode })
    });

    if (!summarizeRes.ok) {
      const errorData = await summarizeRes.json();
      return NextResponse.json({ error: errorData.error || 'AI generation failed' }, { status: summarizeRes.status });
    }

    const aiData = await summarizeRes.json();

    return NextResponse.json({
      success: true,
      data: {
        videoTitle: aiData.title,
        mode: mode,
        topics: aiData.topics,
        markdownNotes: aiData.markdownContent
      }
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
