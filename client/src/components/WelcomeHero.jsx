import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Mail,
  Globe,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Cpu,
  Database,
} from "lucide-react";

export default function WelcomeHero({ onSelectCapability }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-14 flex flex-col items-center text-center">
      {/* Insignia / Glowing badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-medium mb-6 backdrop-blur-md">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <span>Next-Generation Digital Trust Engine & IPFS Ledger</span>
      </div>

      {/* Main Title */}
      <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
        What would you like to{" "}
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          investigate
        </span>{" "}
        today?
      </h2>

      <p className="text-slate-400 text-sm sm:text-base max-w-2xl mb-10 leading-relaxed">
        Paste any suspicious URL, domain, or raw phishing email below. The
        engine resolves DNS/RDAP, inspects live SSL, runs 5-vector deterministic
        scoring, and synthesizes an AI threat explanation.
      </p>

      {/* Feature tags */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />5 Independent
          Risk Vectors
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Cloud Tenant Isolation (Vercel/Webflow)
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Phase 8 Prompt-Injection Proof AI
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Phase 9 IPFS CID & Blockchain Hash
        </span>
      </div>
    </div>
  );
}
