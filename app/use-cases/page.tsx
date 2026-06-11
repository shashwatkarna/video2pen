import Link from 'next/link';
import { BookOpen, Code, GraduationCap, Laptop, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Video2Pen Use Cases - YouTube to Notes for Students & Professionals',
  description: 'Discover how students, developers, and researchers use Video2Pen to transform long YouTube lectures into concise, handwritten study guides instantly.',
  alternates: {
    canonical: 'https://video2pen.vercel.app/use-cases',
  },
};

const useCases = [
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: 'University Students',
    description: 'Turn 2-hour organic chemistry or history lectures into scannable, beautifully formatted study guides. Never pause a video to take notes again.',
    keywords: ['Exam preparation', 'Study from YouTube', 'Active recall']
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: 'Software Developers',
    description: 'Extract code snippets and architectural concepts from tech talks, coding tutorials, and conference keynotes instantly.',
    keywords: ['Tech Talks', 'Video annotation', 'Extract insights']
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: 'Researchers & Writers',
    description: 'Summarize long-form podcast interviews, documentaries, and video essays into structured outlines for your next paper or article.',
    keywords: ['Research documentation', 'Content repurposing', 'Timestamped notes']
  }
];

export default function UseCasesPage() {
  return (
    <main className="min-h-screen bg-[#fdfdf0] text-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex items-center justify-between brutalist-card bg-white p-4">
          <Link href="/" className="text-3xl font-black italic hover:text-primary transition-colors uppercase tracking-tighter">
            Video<span className="text-primary">2</span>Pen
          </Link>
          <Link href="/login" className="brutalist-button text-xs px-6 py-2">
            Start Writing Free
          </Link>
        </header>

        <div className="text-center space-y-6 py-12">
           <div className="inline-block bg-accent px-4 py-1 rotate-[-2deg] mb-4">
              <span className="font-black uppercase text-sm tracking-widest border-b-[3px] border-black pb-1">SEO & Discoverability</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
             Built For <span className="text-primary italic">Everyone.</span>
           </h1>
           <p className="text-xl font-bold opacity-70 max-w-2xl mx-auto">
             Whether you're cramming for finals, learning a new programming language, or summarizing a 3-hour podcast, Video2Pen adapts to your workflow.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((uc, idx) => (
            <div key={idx} className="brutalist-card bg-white p-8 flex flex-col gap-4 group hover:-translate-y-2 transition-transform">
              <div className="p-4 bg-secondary text-white inline-block w-fit border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform">
                {uc.icon}
              </div>
              <h2 className="text-2xl font-black uppercase mt-4">{uc.title}</h2>
              <p className="font-medium opacity-80 leading-relaxed flex-grow">
                {uc.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {uc.keywords.map(kw => (
                  <span key={kw} className="text-xs font-bold uppercase bg-black/5 px-2 py-1 border-2 border-black/10">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="brutalist-card bg-primary text-white p-12 text-center mt-12">
           <Sparkles className="w-12 h-12 mx-auto mb-6 fill-white" />
           <h3 className="text-4xl font-black uppercase mb-6">Ready to stop pausing?</h3>
           <Link href="/login" className="brutalist-button bg-white text-black text-xl px-12 py-4 inline-block hover:bg-accent transition-colors">
              Transform Your First Video ➔
           </Link>
        </div>
      </div>
    </main>
  );
}
