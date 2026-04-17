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
  BookOpen,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

/* --- Helper Component for Handwritten Annotations --- */
const Annotation = ({ children, className = "", rotate = "rotate-[-2deg]", color = "text-primary" }: { children?: React.ReactNode, className?: string, rotate?: string, color?: string }) => (
  <div className={`font-indie ${color} ${rotate} ${className} pointer-events-none select-none`}>
    {children}
  </div>
);

export default function LandingPage() {
  const user = useUser();

  const features = [
    {
      title: "No More Pausing",
      description: "Stop hitting spacebar every 10 seconds. We digest the video so you can stay in flow.",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-accent",
      note: "Save 30 mins / video"
    },
    {
      title: "Handwritten Fidelity",
      description: "Our AI notes feel personal. Ruled paper, grid, or blank—you choose your vibe.",
      icon: <PenTool className="w-6 h-6" />,
      color: "bg-secondary",
      note: "Like a real Moleskine"
    },
    {
      title: "Exam-Ready Insights",
      description: "Get 'Must-Know Definitions' and 'Potential Test Questions' generated instantly.",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-primary",
      note: "A+ Guaranteed?"
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* 1. HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden text-center bg-[#fdfdf0]">
         {/* Brutalist accents */}
         <div className="absolute top-10 left-[10%] w-64 h-64 bg-secondary/10 border-4 border-black rounded-full -z-10 animate-pulse" />
         <div className="absolute bottom-10 right-[15%] w-80 h-80 bg-accent/10 border-[6px] border-black rounded-3xl rotate-12 -z-10" />

         <div className="max-w-5xl space-y-8 z-10 relative">
            {/* HERO ANNOTATION 1 */}
            <Annotation className="absolute -top-16 -right-12 text-3xl hidden md:block" rotate="rotate-[12deg]">
               <div className="border-2 border-primary p-2 rounded-lg bg-white/50 border-dashed">
                  Rebel Scholar Approved 🖊️
               </div>
            </Annotation>

            <div className="inline-block brutalist-card bg-black text-white px-8 py-2 rotate-[-1deg] mb-6 relative">
               <span className="font-black italic uppercase tracking-widest text-lg">Reintroducing Note-Taking</span>
               {/* MINI ANNOTATION */}
               <Annotation className="absolute -top-6 -left-12 text-lg" rotate="rotate-[-8deg]" color="text-secondary">
                  Finally! ➔
               </Annotation>
            </div>

            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
               Video<span className="text-primary italic">2</span>Pen
            </h1>

            <div className="relative">
              <p className="text-2xl md:text-4xl font-bold max-w-3xl mx-auto border-l-[8px] border-black p-6 bg-white brutalist-card text-left">
                 Turn "Watch Later" into <span className="text-secondary italic">"Know Forever."</span> Beautiful, handwritten AI notes from any video.
              </p>
              {/* STICKY NOTE ANNOTATION */}
              <Annotation className="absolute -bottom-10 -right-4 md:-right-24 text-2xl hidden md:block" rotate="rotate-[3deg]" color="text-primary">
                 <div className="bg-[#fdfd96] p-4 brutalist-card text-black font-caveat shadow-none text-base w-48 rotate-[-2deg]">
                    "I used to spend 2 hours for a 1 hour lecture. Now it takes 10 mins." 
                    <br/>- Alex, CS Student
                 </div>
              </Annotation>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center pt-8">
               {user ? (
                  <Link href="/workspace" className="brutalist-button text-2xl px-16 py-6 w-full md:w-auto">
                    Open My Workspace ➔
                  </Link>
               ) : (
                  <>
                    <Link href="/login" className="brutalist-button text-2xl px-16 py-6 w-full md:w-auto relative group">
                       Start Writing Free
                       <Annotation className="absolute -top-10 -right-10 text-xl opacity-0 group-hover:opacity-100 transition-opacity" rotate="rotate-[15deg]">
                          No CC Required!
                       </Annotation>
                    </Link>
                    <Link href="/login" className="brutalist-button-secondary text-2xl px-12 py-6">
                       Sign In
                    </Link>
                  </>
               )}
            </div>
            
            <p className="font-black text-sm uppercase opacity-60">Zero-latency AI • Academic Precision • Study Smarter</p>
         </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="py-24 px-4 bg-white border-y-[10px] border-black">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 relative">
               <h2 className="text-5xl md:text-6xl font-black leading-none uppercase">
                  Stop pausing.<br/>Start <span className="text-destructive relative inline-block">
                    absorbing.
                    <Annotation className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-4 bg-primary/20 -z-10" />
                  </span>
               </h2>
               <p className="text-xl font-bold text-muted-foreground leading-relaxed">
                  The manual way is broken. You watch a 10-minute video, but it takes 40 minutes because you're constantly pausing to scribble notes. 
                  <br/><br/>
                  Video2Pen watches with you. It understands the underlying concepts and translates them into a premium study guide within seconds.
               </p>
               <div className="brutalist-card p-6 bg-accent/10 space-y-4 relative">
                  <div className="flex gap-4 items-center font-black">
                     <span className="text-2xl">❌</span> 50+ Pauses per video
                  </div>
                  <div className="flex gap-4 items-center font-black">
                     <span className="text-2xl">❌</span> Messy, disorganized scraps
                  </div>
                  <div className="flex gap-4 items-center font-black">
                     <span className="text-2xl">✅</span> One-click handwritten clarity
                  </div>
                  {/* ANNOTATION */}
                  <Annotation className="absolute -top-8 right-4 text-2xl" rotate="rotate-[8deg]" color="text-destructive">
                    The Pain! ➔
                  </Annotation>
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
               <Annotation className="absolute -top-12 -left-4 text-2xl hidden md:block" rotate="rotate-[-10deg]">
                 Handwritten Feel ✨
               </Annotation>
            </div>
         </div>
      </section>

      {/* 3. HOW IT WORKS (THE 1-2-3) */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
         <div className="max-w-7xl mx-auto text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black uppercase mb-4">Pure simplicity.</h2>
            <p className="text-2xl font-bold opacity-60">From URL to PDF in under 60 seconds.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
            {/* LARGE SCRIBBLE ARROW BACKGROUND (MOCK) */}
            <Annotation className="absolute top-1/2 left-1/4 w-full h-2 text-7xl opacity-10 hidden lg:block" rotate="rotate-0">
               ➔ ➔ ➔ ➔ ➔ ➔
            </Annotation>

            {[ 
              { step: "01", title: "Drop The Link", text: "Paste any YouTube URL. Academic, tech tutorials, or lectures.", icon: <Monitor /> },
              { step: "02", title: "Pick Your Brain", text: "Choose Quick, Detailed, or Exam mode depending on your goals.", icon: <Search /> },
              { step: "03", title: "Refine & Export", text: "Customize handwriting, highlight keywords, and save to PDF.", icon: <Zap /> }
            ].map((s, i) => (
              <div key={i} className="brutalist-card p-8 bg-white space-y-6 relative overflow-hidden group hover:-translate-y-2 transition-transform">
                <span className="absolute -top-4 -right-4 text-9xl font-black text-black/5 group-hover:text-black/10 transition-colors tracking-tighter">{s.step}</span>
                <div className="w-14 h-14 brutalist-card bg-primary text-white flex items-center justify-center">
                   {s.icon}
                </div>
                <h3 className="text-3xl font-black uppercase">{s.title}</h3>
                <p className="font-bold text-muted-foreground">{s.text}</p>
                {/* STEP ANNOTATION */}
                <Annotation className="pt-2 text-lg opacity-0 group-hover:opacity-100 transition-opacity" rotate="rotate-[-2deg]" color="text-secondary">
                   Easy as that!
                </Annotation>
              </div>
            ))}
         </div>
      </section>

      {/* 4. MODE SHOWCASE */}
      <section className="py-24 px-4 bg-white border-t-[10px] border-black">
         <div className="max-w-6xl mx-auto space-y-16">
            <div className="bg-black text-white p-8 brutalist-card flex flex-col md:flex-row justify-between items-center gap-8 relative">
               <h2 className="text-5xl font-black uppercase">3 Intelligent Study Modes</h2>
               <Annotation className="absolute -top-10 right-10 text-3xl hidden md:block" rotate="rotate-[5deg]" color="text-accent">
                 Pick your vibe! 🖊️
               </Annotation>
               <div className="flex gap-4">
                  {features.map((f, i) => (
                    <div key={i} className={`${f.color} w-8 h-8 brutalist-card`} />
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
               {features.map((f, i) => (
                 <div key={i} className="space-y-4 group">
                   <div className={`${f.color} w-20 h-20 mx-auto brutalist-card flex items-center justify-center text-white relative`}>
                      {f.icon}
                      <Annotation className="absolute -top-8 -right-16 text-xl opacity-0 group-hover:opacity-100 transition-opacity" rotate="rotate-[10deg]">
                         {f.note}
                      </Annotation>
                   </div>
                   <h3 className="text-3xl font-black uppercase">{f.title}</h3>
                   <p className="font-bold opacity-70 px-4">{f.description}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. THE FINAL CALL */}
      <section className="py-32 px-4 bg-primary text-white text-center border-t-[10px] border-black relative overflow-hidden">
         <div className="max-w-4xl mx-auto space-y-12 relative z-10">
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none italic">
               Write Less.<br/><span className="underline decoration-white decoration-[10px]">Learn More.</span>
            </h2>
            
            <div className="flex flex-col md:flex-row justify-center gap-8 pt-8 relative">
               <Link href="/login" className="brutalist-button bg-white text-black text-3xl px-20 py-8 hover:bg-accent transition-colors">
                  Join 10k+ Learners
               </Link>
               {/* JOIN ANNOTATION */}
               <Annotation className="absolute -bottom-16 md:-right-24 md:bottom-auto md:top-10 text-4xl text-white" rotate="rotate-[-12deg]">
                  Don&apos;t miss out! ➔
               </Annotation>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-24 text-sm md:text-lg font-black uppercase">
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
         {/* SPLIT WATERMARK - TOP HALF (SECTION 5) */}
         <div className="absolute bottom-0 left-0 w-full overflow-hidden h-[8.5vw] select-none pointer-events-none">
            <div className="text-[17vw] font-black text-black leading-none whitespace-nowrap tracking-tighter w-full text-center">
               Video2Pen
            </div>
         </div>

         <Annotation className="absolute bottom-0 left-0 text-[10rem] opacity-5 -z-10" rotate="rotate-[-15deg]" color="text-white">
            REBEL
         </Annotation>
      </section>

      {/* 6. FOOTER */}
      {/* 6. REDESIGNED FOOTER */}
      <footer className="bg-black text-white pt-32 pb-12 px-4 border-t-[10px] border-black overflow-hidden relative">
         {/* SPLIT WATERMARK - BOTTOM HALF (SECTION 6) */}
         {/* Using solid primary blue to perfectly match the Join section background */}
         <div className="absolute -top-[10px] left-0 w-full h-[calc(8.5vw+10px)] overflow-hidden select-none pointer-events-none">
            <div className="text-[17vw] font-black text-primary leading-none whitespace-nowrap tracking-tighter w-full text-center -translate-y-1/2">
               Video2Pen
            </div>
         </div>

         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
            {/* Logo/Mission - Redundant logo removed */}
            <div className="lg:col-span-6 space-y-8">
               <div className="space-y-4">
                  <Annotation className="text-4xl" rotate="rotate-[-2deg]" color="text-accent">
                     Study harder. Pause less. 🖊️
                  </Annotation>
               </div>
               <p className="text-xl font-bold opacity-60 max-w-md leading-relaxed">
                  We built Video2Pen for the scholars who value their time as much as their knowledge. 
                  Digital notes with a human soul.
               </p>
               <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 brutalist-card bg-primary flex items-center justify-center text-white hover:-translate-y-1 transition-transform">
                     <Github className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 brutalist-card bg-secondary flex items-center justify-center text-white hover:-translate-y-1 transition-transform">
                     <Twitter className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 brutalist-card bg-accent flex items-center justify-center text-black hover:-translate-y-1 transition-transform">
                     <Linkedin className="w-6 h-6" />
                  </a>
               </div>
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
               <div className="space-y-6">
                  <h5 className="font-black uppercase tracking-widest text-sm text-primary">Platform</h5>
                  <ul className="space-y-4 font-bold uppercase text-xs">
                     <li className="hover:text-primary transition-colors cursor-pointer">Dashboard</li>
                     <li className="hover:text-primary transition-colors cursor-pointer">API Docs</li>
                     <li className="hover:text-primary transition-colors cursor-pointer relative group">
                        Pricing
                        <Annotation className="absolute -top-4 -right-12 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" rotate="rotate-[12deg]" color="text-accent">
                           It&apos;s Free!
                        </Annotation>
                     </li>
                  </ul>
               </div>

               <div className="space-y-6">
                  <h5 className="font-black uppercase tracking-widest text-sm text-secondary">Community</h5>
                  <ul className="space-y-4 font-bold uppercase text-xs">
                     <li className="hover:text-secondary transition-colors cursor-pointer">Discord</li>
                     <li className="hover:text-secondary transition-colors cursor-pointer">Twitter</li>
                     <li className="hover:text-secondary transition-colors cursor-pointer relative group">
                        Manifesto
                        <Annotation className="absolute -top-4 -right-12 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" rotate="rotate-[-10deg]" color="text-primary">
                           Must Read ➔
                        </Annotation>
                     </li>
                  </ul>
               </div>

               <div className="space-y-6">
                  <h5 className="font-black uppercase tracking-widest text-sm text-accent">Legal</h5>
                  <ul className="space-y-4 font-bold uppercase text-xs">
                     <li className="hover:text-accent transition-colors cursor-pointer">Privacy</li>
                     <li className="hover:text-accent transition-colors cursor-pointer">Terms</li>
                  </ul>
               </div>

               {/* Handwritten Open Source Notice - Inside the links block */}
               <div className="col-span-full pt-12">
                  <Annotation className="text-2xl leading-relaxed max-w-xl" rotate="rotate-[-1deg]" color="text-accent">
                     This is an open source project, you are welcome to implement more good ideas. check 
                     <a href="https://github.com/yourusername/Video2Pen" target="_blank" rel="noopener noreferrer" className="inline-block hover:scale-110 transition-transform mx-2 pointer-events-auto">
                        <Github className="w-6 h-6 mb-1" />
                     </a>
                     for more info
                  </Annotation>
               </div>
            </div>
         </div>

         {/* Bottom Bar */}
         <div className="max-w-7xl mx-auto mt-12 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="font-black uppercase text-[10px] opacity-40 italic tracking-widest">
               Hand-built by Rebel Scholars &copy; 2026 Video2Pen Labs
            </p>
            <div className="flex gap-4 items-center">
               <div className="h-1 w-24 bg-primary" />
               <Annotation className="text-sm" color="text-white/40">
                  Built with ink & pixels
               </Annotation>
            </div>
         </div>
      </footer>
    </main>
  );
}
