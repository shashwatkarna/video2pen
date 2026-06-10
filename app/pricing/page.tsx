'use client';

import Link from 'next/link';

export default function PricingPage() {
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

        <div className="text-center space-y-4 pt-12">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Pricing</h1>
          <p className="text-xl font-bold opacity-70">We believe in making education accessible.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="brutalist-card bg-white p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-secondary">Rebel Scholar</h2>
              <div className="text-5xl font-black">$0<span className="text-lg opacity-50">/forever</span></div>
              <ul className="space-y-3 font-bold">
                <li>✅ Unlimited Quick Summaries</li>
                <li>✅ Detailed & Exam Modes</li>
                <li>✅ PDF Exports</li>
                <li>✅ Interactive AI Tutor</li>
              </ul>
            </div>
            <Link href="/login" className="brutalist-button-secondary py-4 w-full block text-center">Start Free</Link>
          </div>

          {/* Pro Tier (Placeholder) */}
          <div className="brutalist-card bg-black text-white p-8 space-y-6 relative flex flex-col justify-between transform md:-translate-y-4 shadow-[12px_12px_0px_0px_#fadb14]">
            <div className="absolute top-4 right-4 bg-accent text-black font-black text-xs px-2 py-1 uppercase rotate-3">Coming Soon</div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-primary">Academic God</h2>
              <div className="text-5xl font-black">$9<span className="text-lg opacity-50">/mo</span></div>
              <ul className="space-y-3 font-bold">
                <li>🚀 Everything in Free</li>
                <li>🚀 Export directly to Notion</li>
                <li>🚀 Save multiple notebooks</li>
                <li>🚀 Custom flashcard decks</li>
              </ul>
            </div>
            <button disabled className="brutalist-button bg-white text-black py-4 w-full opacity-50 cursor-not-allowed">Waitlist</button>
          </div>
        </div>
      </div>
    </main>
  );
}
