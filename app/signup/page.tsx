"use client";

import { SignUp } from "@stackframe/stack";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#fdfdf0] flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 font-black uppercase text-sm hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-[540px] space-y-10">
        <div className="text-center space-y-3 relative">
          {/* Absolutely positioned badge relative to the entire header block */}
          <div className="absolute -top-4 -right-8 md:-right-16 font-indie text-accent rotate-[12deg] text-xl md:text-2xl pointer-events-none select-none z-10">
            It's Free! ✨
          </div>
          
          <div className="inline-block bg-black text-white px-4 py-1 mb-2 rotate-[-2deg]">
            <span className="font-black italic uppercase tracking-widest text-[10px] md:text-xs">Next-Gen Academic Intelligence</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic">
            Video<span className="text-primary">2</span>Pen
          </h1>
          <p className="font-bold opacity-70 uppercase text-xs tracking-[0.2em]">
            Join the Rebellion.
          </p>
        </div>

        <div className="brutalist-card bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="p-10 flex flex-col items-center">
            <div className="w-full max-w-sm">
              <SignUp 
                fullPage={false} 
              />
            </div>
          </div>
        </div>

        <p className="text-center font-bold text-[10px] uppercase opacity-40">
          Academic Precision • Study Smarter
        </p>
      </div>
    </div>
  );
}
