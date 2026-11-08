import React from "react";
import {
  Shield,
  Sparkles,
  Plus,
  PanelLeft,
  Database,
  Terminal,
  CheckCircle2,
} from "lucide-react";

export default function Header({
  isSidebarOpen,
  setIsSidebarOpen,
  onNewAudit,
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0d0f17]/95 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black tracking-tight text-base text-white flex items-center gap-1">
                TRUST<span className="text-indigo-400">-X</span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-medium">
                v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
              5-Vector Digital Trust & Scam Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 font-mono">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>IPFS</span>
        </div>

        <button
          onClick={onNewAudit}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
