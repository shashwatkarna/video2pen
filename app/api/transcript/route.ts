import { NextRequest, NextResponse } from 'next/server';
// Trigger hot reload
import { YoutubeTranscript } from 'youtube-transcript';

function getYouTubeVideoId(url: string): string {
  const cleanUrl = url.trim();
  
  // Check if it's already just an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/live\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/i,
    /&v=([^&\n?#]+)/i, // Query parameter fallback
  ];
  
  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      const idMatch = match[1].match(/^([a-zA-Z0-9_-]{11})/);
      if (idMatch) return idMatch[1];
      return match[1];
    }
  }
  
  throw new Error('Invalid YouTube URL format. Please paste a valid YouTube watch, short, live, or embed link.');
}

async function getTranscript(videoId: string): Promise<{ transcript: string; languageCode: string; videoTitle: string }> {
  let firstError: Error | null = null;

  // Method 1: YouTube internal player API
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

    if (res.ok) {
      const data = await res.json() as any;
      const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

      if (Array.isArray(tracks) && tracks.length > 0) {
        const baseCaptionUrl = tracks[0].baseUrl;
        const languageCode = tracks[0].languageCode || 'en';
        const videoTitle = data?.videoDetails?.title || 'Unknown Video';

        const xmlRes = await fetch(baseCaptionUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          }
        });
        const xmlText = await xmlRes.text();

        if (!xmlText.includes('automated queries') || !xmlText.includes('<body')) {
          const transcript = xmlText
            .replace(/<text[^>]*>/g, ' ')
            .replace(/<\/text>/g, ' ')
            .replace(/<[^>]+>/g, '')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/\s+/g, ' ')
            .trim();

          if (transcript) {
            return { transcript, languageCode, videoTitle };
          }
        }
      }
    }
  } catch (error: any) {
    console.warn('[Video2Pen] Method 1 (Player API) failed, trying fallbacks:', error.message);
    firstError = error;
  }

  // Method 2: Fallback to youtube-transcript package
  try {
    console.log(`[Video2Pen] Falling back to youtube-transcript library for video ${videoId}...`);
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    if (transcriptItems && transcriptItems.length > 0) {
      const transcript = transcriptItems
        .map(item => item.text)
        .join(' ')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();

      if (transcript) {
        let videoTitle = 'Study Notes';
        try {
          const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
          if (oembedRes.ok) {
            const oembedData = await oembedRes.json();
            videoTitle = oembedData.title || 'Study Notes';
          }
        } catch (e) {
          console.warn('[Video2Pen] Could not fetch video title via oEmbed:', e);
        }

        return {
          transcript,
          languageCode: 'en',
          videoTitle,
        };
      }
    }
  } catch (error: any) {
    console.warn('[Video2Pen] Method 2 (youtube-transcript) failed:', error.message);
    if (!firstError) firstError = error;
  }

  // Method 3: Fallback to scraping ytInitialPlayerResponse from video watch page
  try {
    console.log(`[Video2Pen] Falling back to raw page scraping for video ${videoId}...`);
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const pageRes = await fetch(watchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    if (pageRes.ok) {
      const html = await pageRes.text();
      const match = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
      if (match) {
        const playerResponse = JSON.parse(match[1]);
        const tracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        if (Array.isArray(tracks) && tracks.length > 0) {
          const baseCaptionUrl = tracks[0].baseUrl;
          const languageCode = tracks[0].languageCode || 'en';
          const videoTitle = playerResponse?.videoDetails?.title || 'Unknown Video';

          const xmlRes = await fetch(baseCaptionUrl);
          const xmlText = await xmlRes.text();
          const transcript = xmlText
            .replace(/<text[^>]*>/g, ' ')
            .replace(/<\/text>/g, ' ')
            .replace(/<[^>]+>/g, '')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/\s+/g, ' ')
            .trim();

          if (transcript) {
            return { transcript, languageCode, videoTitle };
          }
        }
      }
    }
  } catch (error: any) {
    console.warn('[Video2Pen] Method 3 (raw page scraping) failed:', error.message);
  }

  const baseErrorMsg = firstError instanceof Error ? firstError.message : 'No transcript tracks available';
  throw new Error(`Unable to extract transcript: ${baseErrorMsg}. Please verify that the YouTube video exists and has closed captions/subtitles enabled.`);
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
