import { NextRequest, NextResponse } from 'next/server';

function getYouTubeVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  throw new Error('Invalid YouTube URL');
}

async function getTranscript(videoId: string): Promise<string> {
  try {
    const payload = {
      context: {
        client: {
          clientName: 'ANDROID',
          clientVersion: '20.10.38',
        },
      },
      videoId: videoId,
    };

    const res = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error('Failed to connect to YouTube API');
    }

    const data = await res.json() as any;
    const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!Array.isArray(tracks) || tracks.length === 0) {
      throw new Error('No transcript tracks available for this video');
    }

    const baseCaptionUrl = tracks[0].baseUrl;
    const languageCode = tracks[0].languageCode || 'en';
    
    // Do not append tlang=en, as it immediately triggers strict Google CAPTCHAs
    const captionUrl = baseCaptionUrl;
    
    const xmlRes = await fetch(captionUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    const xmlText = await xmlRes.text();
    
    if (xmlText.includes('automated queries') && xmlText.includes('<body')) {
      throw new Error('YouTube blocked the transcript request (CAPTCHA). Please try again later.');
    }

    const transcript = xmlText
      .replace(/<text[^>]*>/g, ' ')
      .replace(/<\/text>/g, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!transcript) {
        throw new Error('Empty transcript returned');
    }

    const videoTitle = data?.videoDetails?.title || 'Unknown Video';

    return { transcript, languageCode, videoTitle };
  } catch (error) {
    console.error('Transcript Error:', error);
    const errMsg = error instanceof Error ? error.message : 'Unknown transcript error';
    throw new Error(`Unable to extract transcript: ${errMsg}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    const videoId = getYouTubeVideoId(url);
    const { transcript, languageCode, videoTitle } = await getTranscript(videoId);

    return NextResponse.json({
      success: true,
      transcript,
      languageCode,
      videoId,
      videoTitle,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
