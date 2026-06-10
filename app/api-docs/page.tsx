'use client';

import Link from 'next/link';

export default function ApiDocsPage() {
  const curlExample = `curl -X POST https://video2pen.com/api/v1/extract \\
-H "Content-Type: application/json" \\
-d '{"url": "https://youtube.com/watch?v=dQw4w9WgXcQ", "mode": "Detailed"}'`;

  const responseExample = `{
  "success": true,
  "data": {
    "videoTitle": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    "mode": "Detailed",
    "topics": ["Music", "Pop", "Rickroll"],
    "markdownNotes": "## Video Overview\\nThe video is a classic 1980s pop music video..."
  }
}`;

  return (
    <main className="min-h-screen bg-[#fdfdf0] text-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex items-center justify-between brutalist-card bg-white p-4">
          <Link href="/" className="text-3xl font-black italic hover:text-primary transition-colors uppercase tracking-tighter">
            Video<span className="text-primary">2</span>Pen <span className="text-accent text-xl not-italic">API</span>
          </Link>
          <Link href="/workspace" className="brutalist-button text-xs px-6 py-2 hidden md:block">
            Back to App
          </Link>
        </header>

        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Developer API</h1>
          <p className="text-xl font-bold opacity-70">Integrate Video2Pen's AI generation directly into your own applications.</p>
        </div>

        {/* Warning Card */}
        <div className="brutalist-card bg-accent/20 border-accent p-6 flex gap-4 items-start">
          <span className="text-4xl">⚠️</span>
          <div>
            <h3 className="font-black uppercase text-lg">Public Beta</h3>
            <p className="font-bold text-sm opacity-80 mt-1">
              The API is currently open and does not require an authentication key. Rate limits are aggressively enforced. Please do not abuse the endpoint or we will have to restrict access.
            </p>
          </div>
        </div>

        {/* Endpoint Doc */}
        <div className="brutalist-card bg-white p-6 md:p-10 space-y-8">
          <div className="flex items-center gap-4 border-b-[3px] border-black pb-4">
            <span className="bg-primary text-white font-black px-3 py-1 rounded">POST</span>
            <code className="text-xl md:text-2xl font-black tracking-tighter">/api/v1/extract</code>
          </div>

          <p className="font-bold text-lg">
            Extracts the transcript from a YouTube video and generates intelligent, structured study notes using Groq's Llama-3.3-70b model.
          </p>

          {/* Request */}
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-secondary">Request Body</h4>
            <div className="bg-black text-white p-4 brutalist-card font-mono text-sm overflow-x-auto">
              <pre>{`{
  "url": "string (Required. A valid YouTube URL)",
  "mode": "string (Optional. 'Quick', 'Detailed', or 'Exam'. Defaults to 'Detailed')"
}`}</pre>
            </div>
          </div>

          {/* cURL Example */}
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-primary">cURL Example</h4>
            <div className="bg-black text-white p-4 brutalist-card font-mono text-sm overflow-x-auto relative">
              <pre>{curlExample}</pre>
            </div>
          </div>

          {/* Response Example */}
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-accent">Response Format</h4>
            <div className="bg-black text-white p-4 brutalist-card font-mono text-sm overflow-x-auto">
              <pre>{responseExample}</pre>
            </div>
          </div>

          {/* Errors */}
          <div className="space-y-4 border-t-[3px] border-black pt-8 mt-8">
            <h4 className="font-black uppercase tracking-widest text-destructive">Error Codes</h4>
            <ul className="space-y-2 font-bold text-sm">
              <li><code className="bg-black/10 px-2 py-1">400</code> - Invalid URL or missing transcript track.</li>
              <li><code className="bg-black/10 px-2 py-1">500</code> - AI generation failed or server timeout.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
