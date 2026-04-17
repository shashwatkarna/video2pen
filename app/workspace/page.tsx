'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useUser } from "@stackframe/stack";
import Link from 'next/link';

const NotesPanel = dynamic(() => import('@/components/NotesPanel'), { ssr: false });

interface Notes {
  summary: string;
  keyPoints: string[];
  topics: string[];
  transcript: string;
  languageCode: string;
}

type Mode = 'Quick' | 'Detailed' | 'Exam';

export default function WorkspacePage() {
  const user = useUser({ or: 'redirect' });
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('Detailed');
  const [notes, setNotes] = useState<Notes | null>(null);
  const [error, setError] = useState('');

  const handleExtractAndSummarize = async () => {
    setError('');
    setLoading(true);

    try {
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

      const summarizeResponse = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript, 
          language: 'English', 
          sourceLangCode: languageCode,
          mode: mode 
        }),
      });

      if (!summarizeResponse.ok) {
        const errorData = await summarizeResponse.json();
        throw new Error(errorData.error || 'Failed to generate notes');
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fdfdf0] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Workspace Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 brutalist-card bg-white p-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-3xl font-black italic hover:text-primary transition-colors uppercase tracking-tighter">
              Video<span className="text-primary italic">2</span>Pen
            </Link>
            <div className="h-8 w-px bg-black hidden md:block" />
            <div className="flex flex-col">
               <span className="font-black text-xs uppercase tracking-widest">Active Workspace</span>
               <span className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">Powered by Qwen 2.5 72B</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
               <p className="font-black text-xs uppercase tracking-tighter">Academic Account</p>
               <p className="text-[10px] font-bold opacity-50">{user.email}</p>
            </div>
            <button 
              onClick={() => user.signOut()} 
              className="brutalist-button bg-destructive text-white text-xs px-6 py-2"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Controls Panel */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="brutalist-card p-6 bg-white space-y-6">
              <div>
                <label className="block text-xs font-black uppercase mb-2 tracking-widest">Input Video URL</label>
                <input
                  type="url"
                  placeholder="Paste YouTube Link..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="brutalist-input w-full font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-2 tracking-widest">Select Mode</label>
                <div className="grid grid-cols-1 gap-3">
                  {(['Quick', 'Detailed', 'Exam'] as Mode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`text-left px-4 py-4 border-[3px] border-black rounded-xl font-bold transition-all ${
                        mode === m 
                          ? 'bg-accent text-black translate-x-[2px] translate-y-[2px] shadow-none' 
                          : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="uppercase text-sm font-black">{m}</span>
                        {mode === m && <span className="text-xs">⚡</span>}
                      </div>
                      <span className="block text-[10px] font-bold opacity-60 uppercase leading-none">
                        {m === 'Quick' && 'Fast 5-min recap'}
                        {m === 'Detailed' && 'Deep hierarchical notes'}
                        {m === 'Exam' && 'Questions + definitions'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleExtractAndSummarize}
                disabled={!youtubeUrl || loading}
                className={`w-full brutalist-button-accent py-5 text-xl tracking-tighter ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'DIGESTING VIDEO...' : 'GENERATE NOTES'}
              </button>

              {error && (
                <div className="p-4 bg-red-100 border-[3px] border-black rounded-xl text-xs font-black text-red-600 uppercase italic">
                   ⚠️ {error}
                </div>
              )}
            </div>

            {notes && (
               <div className="brutalist-card p-4 bg-secondary/10 rotate-1">
                 <h4 className="font-black text-xs uppercase mb-3 border-b-2 border-black/10 pb-1">Contextual Tags</h4>
                 <div className="flex flex-wrap gap-2">
                   {notes.topics.map((t, idx) => (
                     <span key={idx} className="bg-white border-2 border-black px-3 py-1 text-[10px] font-black rounded-lg uppercase italic">
                       {t}
                     </span>
                   ))}
                 </div>
               </div>
            )}
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-3">
            {notes ? (
              <NotesPanel notes={notes} />
            ) : (
              <div className="brutalist-card min-h-[600px] flex items-center justify-center bg-white border-dashed border-black/20">
                <div className="text-center space-y-6 max-w-sm">
                  <div className="text-8xl animate-bounce">🖊️</div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Ready to write?</h3>
                  <p className="font-bold text-muted-foreground uppercase text-xs tracking-widest leading-relaxed">
                    Enter any YouTube URL on the left. We recommend educational videos, technical tutorials, or long-form lectures.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
