'use client';

import { useState, useRef } from 'react';

import Link from 'next/link';
import { useUser } from "@stackframe/stack";
import QRCode from "react-qr-code";
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
   Linkedin,
   Pause
} from 'lucide-react';

/* --- Helper Component for Handwritten Annotations --- */
const Annotation = ({ children, className = "", rotate = "rotate-[-2deg]", color = "text-primary" }: { children?: React.ReactNode, className?: string, rotate?: string, color?: string }) => (
   <div className={`font-indie ${color} ${rotate} ${className} pointer-events-none select-none`}>
      {children}
   </div>
);

export default function LandingPage() {
   const user = useUser();
   const [isPlaying, setIsPlaying] = useState(true);
   const videoRef = useRef<HTMLVideoElement>(null);

   const togglePlay = () => {
      if (videoRef.current) {
         if (isPlaying) {
            videoRef.current.pause();
         } else {
            videoRef.current.play();
         }
         setIsPlaying(!isPlaying);
      }
   };

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

               <div className="inline-block brutalist-card bg-black text-white px-4 md:px-8 py-2 rotate-[-0.5deg] mb-6 relative">
                  <span className="font-black italic uppercase tracking-widest text-sm md:text-lg">Next-Gen Academic Intelligence</span>
                  {/* MINI ANNOTATION */}
                  <Annotation className="absolute -top-6 -left-8 md:-left-12 text-sm md:text-lg" rotate="rotate-[-8deg]" color="text-secondary">
                     Finally! ➔
                  </Annotation>
               </div>

               <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] font-black tracking-tighter leading-[0.85] uppercase">
                  Video<span className="text-primary italic">2</span>Pen
               </h1>

               <div className="relative pt-8">
                  <div className="bg-white border-[6px] border-black p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-4xl mx-auto relative group">
                     <p className="text-xl sm:text-2xl md:text-4xl font-black uppercase leading-[1.1] tracking-tighter">
                        Turn <span className="bg-accent px-2">"Watch Later"</span> into<br className="hidden sm:block" />
                        <span className="text-primary italic underline decoration-[4px] md:decoration-[6px] decoration-secondary/30 underline-offset-4 md:underline-offset-8 font-black">"Know Forever."</span>
                     </p>
                     <p className="text-lg md:text-xl font-bold opacity-60 mt-6 uppercase tracking-widest">
                        Beautiful, digital notes with a human soul.
                     </p>
                  </div>
                  {/* STICKY NOTE ANNOTATION */}
                  <Annotation className="absolute -bottom-16 -right-4 md:-right-16 text-2xl hidden lg:block z-20" rotate="rotate-[3deg]" color="text-primary">
                     <div className="bg-[#fdfd96] p-6 brutalist-card text-black font-caveat shadow-none text-lg w-56 rotate-[-2deg]">
                        "I used to spend 2 hours for a 1 hour lecture. Now it takes 10 mins."
                        <br />
                        <span className="font-bold text-xs uppercase tracking-widest opacity-50 block mt-2 text-right">- Alex, CS Student</span>
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
                        <Link href="/login" className="brutalist-button text-lg md:text-2xl px-8 md:px-16 py-4 md:py-6 w-full md:w-auto relative group">
                           Start Writing Free
                           <Annotation className="absolute -top-10 -right-4 md:-right-10 text-lg md:text-xl opacity-0 group-hover:opacity-100 transition-opacity" rotate="rotate-[15deg]">
                              No CC Required!
                           </Annotation>
                        </Link>
                        <Link href="/login" className="brutalist-button-secondary text-lg md:text-2xl px-8 md:px-12 py-4 md:py-6 w-full md:w-auto">
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
                     Stop pausing.<br />Start <span className="text-destructive relative inline-block">
                        absorbing.
                        <Annotation className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-4 bg-primary/20 -z-10" />
                     </span>
                  </h2>
                  <p className="text-xl font-bold text-muted-foreground leading-relaxed">
                     The manual way is broken. You watch a 10-minute video, but it takes 40 minutes because you're constantly pausing to scribble notes.
                     <br /><br />
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
                  <div 
                     className="brutalist-card aspect-video bg-black flex items-center justify-center overflow-hidden relative group cursor-pointer"
                     onClick={togglePlay}
                  >
                     <video 
                        ref={videoRef}
                        className="w-full h-full object-cover absolute top-0 left-0 opacity-70 group-hover:opacity-90 transition-opacity"
                        src="/demo.mp4" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                     />
                     <div className={`absolute z-10 p-4 bg-primary text-white border-[3px] border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group-hover:scale-110 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                        {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                     </div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 brutalist-card bg-secondary p-4 px-8 rotate-3 hidden md:block z-20">
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

         {/* 4.5 FAQ SECTION (SEO HACK) */}
         <section className="py-24 px-4 bg-white border-y-[10px] border-black">
            <div className="max-w-4xl mx-auto">
               <div className="text-center mb-16 space-y-6">
                  <h2 className="text-4xl md:text-6xl font-black uppercase">
                     How it <span className="text-primary italic underline decoration-8 underline-offset-8">works</span>
                  </h2>
                  <p className="text-sm md:text-base font-bold opacity-70 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
                     The ultimate AI Learning Assistant to extract insights and take timestamped notes. Turn long videos into automated summaries.
                  </p>
               </div>
               
               <div className="space-y-6">
                  {/* FAQ 1 */}
                  <details className="brutalist-card bg-[#fdfdf0] group [&_summary::-webkit-details-marker]:hidden cursor-pointer p-6">
                     <summary className="text-2xl font-black uppercase flex justify-between items-center">
                        How to take notes on YouTube videos?
                        <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                     </summary>
                     <p className="mt-4 text-lg font-bold opacity-80 leading-relaxed border-t-4 border-black pt-4">
                        Taking notes manually is obsolete. Video2Pen acts as your AI learning assistant. Simply paste any YouTube URL, and our engine automatically performs a video-to-text conversion, extracting the core insights into beautiful, timestamped notes that you can export instantly.
                     </p>
                  </details>

                  {/* FAQ 2 */}
                  <details className="brutalist-card bg-[#fdfdf0] group [&_summary::-webkit-details-marker]:hidden cursor-pointer p-6">
                     <summary className="text-2xl font-black uppercase flex justify-between items-center">
                        Can I summarize long YouTube videos with AI?
                        <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                     </summary>
                     <p className="mt-4 text-lg font-bold opacity-80 leading-relaxed border-t-4 border-black pt-4">
                        Yes! Whether it's a 10-minute tutorial or a 3-hour university lecture, our YouTube transcript generator processes the entire audio track and creates automated video summaries structured with active recall questions, key definitions, and deep analysis.
                     </p>
                  </details>

                  {/* FAQ 3 */}
                  <details className="brutalist-card bg-[#fdfdf0] group [&_summary::-webkit-details-marker]:hidden cursor-pointer p-6">
                     <summary className="text-2xl font-black uppercase flex justify-between items-center">
                        Is this better than a standard transcript generator?
                        <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                     </summary>
                     <p className="mt-4 text-lg font-bold opacity-80 leading-relaxed border-t-4 border-black pt-4">
                        Absolutely. Raw YouTube transcript generators just dump walls of text. We use advanced LLMs to process that text into structured study artifacts, ensuring you get high-fidelity research documentation and exam preparation material rather than just a messy script.
                     </p>
                  </details>
               </div>
            </div>
         </section>

         {/* 5. THE FINAL CALL */}
         <section className="py-32 px-4 bg-primary text-white text-center border-t-[10px] border-black relative overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-12 relative z-10">
               <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none italic">
                  Write Less.<br /><span className="underline decoration-white decoration-[10px]">Learn More.</span>
               </h2>

               <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-8 relative">
                  <Link href="/login" className="brutalist-button bg-white text-black text-xl md:text-3xl px-12 md:px-20 py-6 md:py-8 hover:bg-accent transition-colors w-full md:w-auto">
                     Join 10k+ Learners
                  </Link>
                  {/* JOIN ANNOTATION */}
                  <Annotation className="absolute -bottom-12 right-0 md:-right-24 md:bottom-auto md:top-10 text-2xl md:text-4xl text-white" rotate="rotate-[-12deg]">
                     Don&apos;t miss out! ➔
                  </Annotation>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 md:pt-24 text-sm md:text-lg font-black uppercase">
                  <div className="flex flex-col gap-2">
                     <span className="text-5xl md:text-5xl italic">1M+</span>
                     <span className="opacity-70">Notes Generated</span>
                  </div>
                  <div className="flex flex-col gap-2">
                     <span className="text-5xl md:text-5xl italic">98%</span>
                     <span className="opacity-70">Focus Score</span>
                  </div>
                  <div className="flex flex-col gap-2">
                     <span className="text-5xl md:text-5xl italic">0$</span>
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
                     <a href="https://github.com/shashwatkarna/Video2Pen" className="w-12 h-12 brutalist-card bg-primary flex items-center justify-center text-white hover:-translate-y-1 transition-transform">
                        <Github className="w-6 h-6" />
                     </a>
                     <a href="https://twitter.com/shashwat_karna" className="w-12 h-12 brutalist-card bg-secondary flex items-center justify-center text-white hover:-translate-y-1 transition-transform">
                        <Twitter className="w-6 h-6" />
                     </a>
                     <a href="https://www.linkedin.com/in/shashwatkarna/" className="w-12 h-12 brutalist-card bg-accent flex items-center justify-center text-black hover:-translate-y-1 transition-transform">
                        <Linkedin className="w-6 h-6" />
                     </a>
                  </div>
               </div>

               {/* Links Grid */}
               <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="space-y-6">
                     <h5 className="font-black uppercase tracking-widest text-sm text-primary">Platform</h5>
                     <ul className="space-y-4 font-bold uppercase text-xs">
                        <li className="hover:text-primary transition-colors cursor-pointer">
                           <Link href="/workspace">Dashboard</Link>
                        </li>
                        <li className="hover:text-primary transition-colors cursor-pointer">
                           <Link href="/use-cases">Use Cases</Link>
                        </li>
                        <li className="hover:text-primary transition-colors cursor-pointer">
                           <Link href="/api-docs">API Docs</Link>
                        </li>
                        <li className="hover:text-primary transition-colors cursor-pointer relative group">
                           <Link href="/pricing">Pricing</Link>
                           <Annotation className="absolute -top-4 -right-12 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" rotate="rotate-[12deg]" color="text-accent">
                              It&apos;s Free!
                           </Annotation>
                        </li>
                     </ul>
                  </div>

                  <div className="space-y-6">
                     <h5 className="font-black uppercase tracking-widest text-sm text-secondary">Community</h5>
                     <ul className="space-y-4 font-bold uppercase text-xs">
                        <li className="hover:text-secondary transition-colors cursor-pointer group">
                           <a href="https://discord.com" target="_blank" rel="noopener noreferrer">Discord <span className="text-[10px] opacity-50 ml-1 group-hover:opacity-100">(karn_shashwat)</span></a>
                        </li>
                        <li className="hover:text-secondary transition-colors cursor-pointer">
                           <a href="https://twitter.com/shashwatkarna" target="_blank" rel="noopener noreferrer">Twitter</a>
                        </li>
                        <li className="hover:text-secondary transition-colors cursor-pointer relative group">
                           <Link href="/terms">Manifesto</Link>
                           <Annotation className="absolute -top-4 -right-12 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" rotate="rotate-[-10deg]" color="text-primary">
                              Must Read ➔
                           </Annotation>
                        </li>
                     </ul>
                  </div>

                  <div className="space-y-6">
                     <h5 className="font-black uppercase tracking-widest text-sm text-accent">Legal</h5>
                     <ul className="space-y-4 font-bold uppercase text-xs">
                        <li className="hover:text-accent transition-colors cursor-pointer">
                           <Link href="/terms">Privacy</Link>
                        </li>
                        <li className="hover:text-accent transition-colors cursor-pointer">
                           <Link href="/terms">Terms</Link>
                        </li>
                     </ul>
                  </div>

                  {/* Handwritten Open Source Notice & Support */}
                  <div className="col-span-full pt-12 space-y-8">
                     <Annotation className="text-2xl leading-relaxed max-w-xl" rotate="rotate-[-1deg]" color="text-accent">
                        This is an open source project, you are welcome to implement more good ideas. check
                        <a href="https://github.com/shashwatkarna/Video2Pen" target="_blank" rel="noopener noreferrer" className="inline-block hover:scale-110 transition-transform mx-2 pointer-events-auto">
                           <Github className="w-6 h-6 mb-1" />
                        </a>
                        for more info
                     </Annotation>
                     
                     <div className="relative group/qr max-w-sm inline-block">
                        <div className="flex items-center gap-4 border-[3px] border-white p-4 brutalist-card bg-black hover:-translate-y-1 transition-transform pointer-events-auto">
                           <span className="text-4xl group-hover/qr:animate-bounce">☕</span>
                           <div>
                              <p className="font-black uppercase text-sm text-primary tracking-widest">Support the Creator</p>
                              <p className="font-bold text-xs mt-1 opacity-80">UPI: <span className="text-accent select-all font-black text-sm ml-1">9971374395@apl</span></p>
                           </div>
                        </div>
                        
                        {/* Hover QR Code */}
                        <div className="absolute bottom-full left-0 mb-4 opacity-0 group-hover/qr:opacity-100 transition-all pointer-events-none z-50 translate-y-2 group-hover/qr:translate-y-0">
                           <div className="bg-white p-4 brutalist-card border-[3px] border-black text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                              <div className="bg-white p-2 border-2 border-black/10 rounded-lg inline-block">
                                 <QRCode value="upi://pay?pa=9971374395@apl&pn=Video2Pen Creator" size={160} />
                              </div>
                              <p className="text-black font-black uppercase tracking-tighter text-xs mt-3">Scan with any UPI App</p>
                           </div>
                        </div>
                     </div>
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
