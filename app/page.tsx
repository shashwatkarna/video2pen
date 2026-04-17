'use client';

import Link from 'next/link';
import { useUser } from "@stackframe/stack";
import { 
  Play, 
  PenTool, 
  Zap, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Monitor,
  Search,
  BookOpen
} from 'lucide-react';

export default function LandingPage() {
  const user = useUser();

  const features = [
    {
      title: "No More Pausing",
      description: "Stop hit spacebar every 10 seconds. We digest the video so you can stay in flow.",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-accent"
    },
    {
      title: "Handwritten Fidelity",
      description: "Our AI notes feel personal. Ruled paper, grid, or blank—you choose your vibe.",
      icon: <PenTool className="w-6 h-6" />,
      color: "bg-secondary"
    },
    {
      title: "Exam-Ready Insights",
      description: "Get 'Must-Know Definitions' and 'Potential Test Questions' generated instantly.",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-primary"
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* 1. HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden text-center bg-[#fdfdf0]">
         {/* Brutalist accents */}
         <div className="absolute top-10 left-[10%] w-64 h-64 bg-secondary/10 border-4 border-black rounded-full -z-10 animate-pulse" />
         <div className="absolute bottom-10 right-[15%] w-80 h-80 bg-accent/10 border-[6px] border-black rounded-3xl rotate-12 -z-10" />

         <div className="max-w-5xl space-y-8 z-10">
            <div className="inline-block brutalist-card bg-black text-white px-8 py-2 rotate-[-1deg] mb-6">
               <span className="font-black italic uppercase tracking-widest text-lg">Reintroducing Note-Taking</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
               Video<span className="text-primary italic">2</span>Pen
            </h1>

            <p className="text-2xl md:text-4xl font-bold max-w-3xl mx-auto border-l-[8px] border-black p-6 bg-white brutalist-card text-left">
               Turn "Watch Later" into <span className="text-secondary italic">"Know Forever."</span> Beautiful, handwritten AI notes from any video.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center pt-8">
               {user ? (
                  <Link href="/workspace" className="brutalist-button text-2xl px-16 py-6 w-full md:w-auto">
                    Open My Workspace ➔
                  </Link>
               ) : (
                  <>
                    <Link href="/login" className="brutalist-button text-2xl px-16 py-6 w-full md:w-auto">
                       Start Writing Free
                    </Link>
                    <Link href="/login" className="brutalist-button-secondary text-2xl px-12 py-6">
                       Sign In
                    </Link>
                  </>
               )}
            </div>
            
            <p className="font-black text-sm uppercase opacity-60">No credit card required • Zero-latency AI • Academic Precision</p>
         </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="py-24 px-4 bg-white border-y-[10px] border-black">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
               <h2 className="text-5xl md:text-6xl font-black leading-none uppercase">
                  Stop pausing.<br/>Start <span className="text-destructive underline decoration-[6px]">absorbing.</span>
               </h2>
               <p className="text-xl font-bold text-muted-foreground leading-relaxed">
                  The manual way is broken. You watch a 10-minute video, but it takes 40 minutes because you're constantly pausing to scribble notes. 
                  <br/><br/>
                  Video2Pen watches with you. It understands the underlying concepts and translates them into a premium study guide within seconds.
               </p>
               <div className="brutalist-card p-6 bg-accent/10 space-y-4">
                  <div className="flex gap-4 items-center font-black">
                     <span className="text-2xl">❌</span> 50+ Pauses per video
                  </div>
                  <div className="flex gap-4 items-center font-black">
                     <span className="text-2xl">❌</span> Messy, disorganized scraps
                  </div>
                  <div className="flex gap-4 items-center font-black">
                     <span className="text-2xl">✅</span> One-click handwritten clarity
                  </div>
               </div>
            </div>
            <div className="relative">
               <div className="brutalist-card aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <div className="text-white text-center space-y-4">
                     <Play className="w-20 h-20 mx-auto fill-primary text-primary" />
                     <p className="font-bold text-lg">Watch AI Notes Evolve in Real-Time</p>
                  </div>
               </div>
               <div className="absolute -bottom-8 -right-8 brutalist-card bg-secondary p-4 px-8 rotate-3 hidden md:block">
                  <span className="text-white font-black italic">Speed: 10x Human 🚀</span>
               </div>
            </div>
         </div>
      </section>

      {/* 3. HOW IT WORKS (THE 1-2-3) */}
      <section className="py-24 px-4 bg-background">
         <div className="max-w-7xl mx-auto text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black uppercase mb-4">Pure simplicity.</h2>
            <p className="text-2xl font-bold opacity-60">From URL to PDF in under 60 seconds.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[ 
              { step: "01", title: "Drop The Link", text: "Paste any YouTube URL. Academic, tech tutorials, or lectures.", icon: <Monitor /> },
              { step: "02", title: "Pick Your Brain", text: "Choose Quick, Detailed, or Exam mode depending on your goals.", icon: <Search /> },
              { step: "03", title: "Refine & Export", text: "Customize handwriting, highlight keywords, and save to PDF.", icon: <Zap /> }
            ].map((s, i) => (
              <div key={i} className="brutalist-card p-8 bg-white space-y-6 relative overflow-hidden group hover:-translate-y-2 transition-transform">
                <span className="absolute -top-4 -right-4 text-9xl font-black text-black/5 group-hover:text-black/10 transition-colors">{s.step}</span>
                <div className="w-14 h-14 brutalist-card bg-primary text-white flex items-center justify-center">
                   {s.icon}
                </div>
                <h3 className="text-3xl font-black uppercase">{s.title}</h3>
                <p className="font-bold text-muted-foreground">{s.text}</p>
              </div>
            ))}
         </div>
      </section>

      {/* 4. MODE SHOWCASE */}
      <section className="py-24 px-4 bg-white border-t-[10px] border-black">
         <div className="max-w-6xl mx-auto space-y-16">
            <div className="bg-black text-white p-8 brutalist-card flex flex-col md:flex-row justify-between items-center gap-8">
               <h2 className="text-5xl font-black uppercase">3 Intelligent Study Modes</h2>
               <div className="flex gap-4">
                  {features.map((f, i) => (
                    <div key={i} className={`${f.color} w-8 h-8 brutalist-card`} />
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
               {features.map((f, i) => (
                 <div key={i} className="space-y-4">
                   <div className={`${f.color} w-20 h-20 mx-auto brutalist-card flex items-center justify-center text-white`}>
                      {f.icon}
                   </div>
                   <h3 className="text-3xl font-black uppercase">{f.title}</h3>
                   <p className="font-bold opacity-70 px-4">{f.description}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. THE FINAL CALL */}
      <section className="py-32 px-4 bg-primary text-white text-center border-t-[10px] border-black">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none italic">
               Write Less.<br/><span className="underline decoration-white decoration-[10px]">Learn More.</span>
            </h2>
            
            <div className="flex flex-col md:flex-row justify-center gap-8 pt-8">
               <Link href="/login" className="brutalist-button bg-white text-black text-3xl px-20 py-8 hover:bg-accent transition-colors">
                  Join 10k+ Learners
               </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-12 text-sm md:text-lg font-black uppercase">
               <div className="flex flex-col gap-2">
                  <span className="text-3xl md:text-5xl italic">1M+</span>
                  <span className="opacity-70">Notes Generated</span>
               </div>
               <div className="flex flex-col gap-2">
                  <span className="text-3xl md:text-5xl italic">98%</span>
                  <span className="opacity-70">Focus Score</span>
               </div>
               <div className="flex flex-col gap-2">
                  <span className="text-3xl md:text-5xl italic">0$</span>
                  <span className="opacity-70">Monthly Fee</span>
               </div>
            </div>
         </div>
      </section>

      {/* 6. MODAL/STATIC FOOTER */}
      <footer className="bg-black text-white py-12 px-4 flex flex-col md:flex-row justify-between items-center gap-8 border-t-[10px] border-black">
         <div className="space-y-2">
            <h4 className="text-4xl font-black uppercase italic">Video2Pen</h4>
            <p className="font-bold opacity-50 text-sm">© 2026 Video2Pen Labs. All rights reserved.</p>
         </div>
         <div className="flex gap-8 font-black uppercase text-sm">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
         </div>
      </footer>
    </main>
  );
}
