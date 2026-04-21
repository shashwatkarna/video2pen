"use client";

import { SignIn } from "@stackframe/stack";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

export default function LoginPage() {
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

      <div className="w-full max-w-[480px] space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-6xl font-black tracking-tighter uppercase italic">
            Video<span className="text-primary text-blue-600">2</span>Pen
          </h1>
          <p className="font-bold opacity-70 uppercase text-xs tracking-[0.2em]">
            Welcome Back, Scholar.
          </p>
        </div>

        <div className="brutalist-card bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="p-10 flex flex-col items-center">
            <div className="w-full max-w-sm">
              <SignIn 
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
