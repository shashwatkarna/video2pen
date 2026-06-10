'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fdfdf0] text-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex items-center justify-between brutalist-card bg-white p-4">
          <Link href="/" className="text-3xl font-black italic hover:text-primary transition-colors uppercase tracking-tighter">
            Video<span className="text-primary">2</span>Pen
          </Link>
          <Link href="/" className="brutalist-button text-xs px-6 py-2">
            Back Home
          </Link>
        </header>

        <div className="brutalist-card bg-white p-8 md:p-12 space-y-12">
          {/* MANIFESTO */}
          <section className="space-y-6">
            <h1 className="text-5xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4 text-primary">The Manifesto</h1>
            <div className="prose prose-lg max-w-none font-bold">
              <p>
                We believe that learning should not be a chore. Hours spent pausing, rewinding, and frantically scribbling notes are hours stolen from actual comprehension and deep thought.
              </p>
              <p>
                Video2Pen was built by rebel scholars, for rebel scholars. We refuse the outdated methods of manual transcription. We embrace the power of artificial intelligence to instantly distill noise into knowledge.
              </p>
              <p className="italic font-black text-xl text-black">
                "Study harder. Pause less."
              </p>
            </div>
          </section>

          {/* PRIVACY */}
          <section className="space-y-6">
            <h2 className="text-4xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4 text-secondary">Privacy Policy</h2>
            <div className="prose prose-lg max-w-none font-bold">
              <p>Your privacy is respected here. We do not sell your data.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We use third-party authentication (Stackframe) to securely manage your login.</li>
                <li>Transcripts are sent to our AI partners (Groq, Cohere) strictly for generating your notes. They do not train models on your private data.</li>
                <li>Your generated notes are yours.</li>
              </ul>
            </div>
          </section>

          {/* TERMS */}
          <section className="space-y-6">
            <h2 className="text-4xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4 text-accent">Terms of Service</h2>
            <div className="prose prose-lg max-w-none font-bold">
              <p>By using Video2Pen, you agree to the following terms:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>This tool is provided "as-is". We are not responsible if the AI hallucinates incorrect facts on your final exam. Always double check your notes!</li>
                <li>Do not abuse the public API endpoints or we will block your IP address.</li>
                <li>This is an open-source project. Feel free to contribute on GitHub.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
