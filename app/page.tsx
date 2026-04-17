'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

const NotesPanel = dynamic(() => import('@/components/NotesPanel'), { ssr: false });

interface Notes {
  summary: string;
  keyPoints: string[];
  topics: string[];
  transcript: string;
}

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [notes, setNotes] = useState<Notes | null>(null);
  const [error, setError] = useState('');

  const handleExtractAndSummarize = async () => {
    setError('');
    setLoading(true);

    try {
      // Step 1: Extract transcript
      const transcriptResponse = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      if (!transcriptResponse.ok) {
        const errorData = await transcriptResponse.json();
        throw new Error(errorData.error || 'Failed to extract transcript');
      }

      const { transcript, languageCode } = await transcriptResponse.json();

      // Step 2: Summarize (Default to English)
      const summarizeResponse = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, language: 'English', sourceLangCode: languageCode }),
      });

      if (!summarizeResponse.ok) {
        const errorData = await summarizeResponse.json();
        throw new Error(errorData.error || 'Failed to summarize');
      }

      const { summary, keyPoints, topics } = await summarizeResponse.json();

      setNotes({
        summary,
        keyPoints: keyPoints.filter((p: string) => p.trim()),
        topics: topics.filter((t: string) => t.trim()),
        transcript,
        languageCode,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslateToHindi = async () => {
    if (!notes) return;
    setError('');
    setTranslating(true);

    try {
      const summarizeResponse = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: notes.transcript, language: 'Hindi', sourceLangCode: notes.languageCode }),
      });

      if (!summarizeResponse.ok) {
        const errorData = await summarizeResponse.json();
        throw new Error(errorData.error || 'Failed to translate to Hindi');
      }

      const { summary, keyPoints, topics } = await summarizeResponse.json();

      setNotes({
        ...notes,
        summary,
        keyPoints: keyPoints.filter((p: string) => p.trim()),
        topics: topics.filter((t: string) => t.trim()),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation error occurred');
      console.error('Translate Error:', err);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
            <span style={{ fontFamily: 'var(--font-caveat)', fontWeight: 400 }}>
              NotePad
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform YouTube videos into beautiful handwritten notes with AI-powered summarization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 p-6 border-2 border-primary/30">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    YouTube URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="border-primary/50 mb-4"
                  />
                </div>

                <Button
                  onClick={handleExtractAndSummarize}
                  disabled={!youtubeUrl || loading || translating}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Spinner className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Extract & Summarize'
                  )}
                </Button>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                    {error}
                  </div>
                )}

                {notes && (
                  <div className="pt-4 border-t border-border flex flex-col gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Topics Detected</h3>
                      <div className="flex flex-wrap gap-2">
                        {notes.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleTranslateToHindi}
                      disabled={translating}
                      variant="outline"
                      className="w-full mt-2 border-primary text-primary hover:bg-primary/10"
                    >
                      {translating ? <><Spinner className="mr-2 h-4 w-4" /> Converting...</> : '🔄 Convert to Hindi'}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Notes Display Panel */}
          {notes && (
            <div className="lg:col-span-2">
              <NotesPanel notes={notes} />
            </div>
          )}

          {/* Empty State */}
          {!notes && !loading && (
            <div className="lg:col-span-2">
              <Card className="p-12 border-2 border-dashed border-border flex items-center justify-center min-h-96">
                <div className="text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-muted-foreground text-lg">
                    Enter a YouTube URL to get started
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
