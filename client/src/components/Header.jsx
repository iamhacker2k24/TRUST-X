import React from "react";
import {
  Shield,
  Sparkles,
  SquarePen,
  PanelLeftClose,
  PanelLeftOpen,
  Database,
} from "lucide-react";

export default function Header({
  isSidebarOpen,
  setIsSidebarOpen,
  onNewAudit,
  currentModel,
}) {
  return (
    <header className="h-14 border-b border-slate-800 bg-[#0d0f17]/95 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Toggle Button in Header */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0d0f17] rounded-[9px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black tracking-tight text-sm sm:text-base text-white flex items-center gap-1">
                TRUST<span className="text-indigo-400">-X</span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-medium">
                v2.4
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Status Pill (ChatGPT style) */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
        <span>Model:</span>
        <span className="font-semibold text-white">
          {currentModel || "TRUST-X 5-Vector + Phase 8 AI"}
        </span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 font-mono">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>IPFS Node Live</span>
        </div>

        <button
          onClick={onNewAudit}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition active:scale-95"
        >
          <SquarePen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>
    </header>
  );
}
