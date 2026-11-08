import React, { useState, useRef, useEffect } from "react";
import { Send, Globe, Mail, Sparkles, RotateCcw, ShieldCheck } from "lucide-react";

export default function InputBar({ onRunAudit, isLoading, activeTab, setActiveTab }) {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    onRunAudit(inputValue.trim(), activeTab);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab("url");
              if (inputValue.includes("From:") || inputValue.includes("Subject:")) {
                setInputValue("");
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
              activeTab === "url"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>URL / Domain</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
              activeTab === "email"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email / SMS Lure</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ipfs")}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
              activeTab === "ipfs"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>IPFS Audit CID</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 hidden sm:block font-mono">
          Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Enter ↵</kbd> to run scan
        </div>
      </div>

      {/* Main Input Box (ChatGPT style) */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-[#131622] border border-slate-700/70 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-2xl shadow-2xl transition duration-200 overflow-hidden"
      >
        <div className="p-3">
          <textarea
            ref={textareaRef}
            rows={activeTab === "email" ? 4 : 2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeTab === "email"
                ? "Paste raw email headers, suspicious email body, or SMS message text to inspect..."
                : activeTab === "ipfs"
                ? "Enter IPFS Content ID (CID) or SHA-256 report hash to verify cryptographic integrity..."
                : "Enter URL, domain, or hostname to scan (e.g., example.com, secure-portal.app)..."
            }
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none font-sans leading-relaxed"
          />
        </div>

        {/* Action Toolbar */}
        <div className="px-3 py-2 bg-[#0e111b] border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Evidential engine treats user inputs as untrusted data</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue("")}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition text-xs"
                title="Clear"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition active:scale-95 ${
                inputValue.trim() && !isLoading
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <span>Run Audit</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
