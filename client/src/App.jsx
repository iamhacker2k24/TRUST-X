import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import WelcomeHero from "./components/WelcomeHero";
import InputBar from "./components/InputBar";
import AuditResultView from "./components/AuditResultView";
import ErrorBoundary from "./components/ErrorBoundary";
import { generateAuditReport } from "./utils/auditEngine";
import { Shield } from "lucide-react";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop
  const [currentAudit, setCurrentAudit] = useState(null);
  const [userQuery, setUserQuery] = useState("");
  const [queryType, setQueryType] = useState("url");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("url"); // 'url' | 'email' | 'ipfs'

  // Persist scan history across browser reloads like ChatGPT
  const [scanHistory, setScanHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("trustx_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("trustx_history", JSON.stringify(scanHistory));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  }, [scanHistory]);

  // Global keyboard shortcuts (Ctrl+K to start fresh audit)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        handleNewAudit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNewAudit = () => {
    setCurrentAudit(null);
    setUserQuery("");
    setIsLoading(false);
  };

  const handleSelectHistoryItem = (item) => {
    setCurrentAudit(item);
    setUserQuery(item.target);
    setQueryType(item.type || "url");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    try {
      localStorage.removeItem("trustx_history");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectCapability = (type) => {
    setActiveTab(type);
  };

  const handleRunAudit = async (input, type) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setUserQuery(trimmedInput);
    setQueryType(type);
    setIsLoading(true);

    // Immediately add an active pending entry in the left sidebar (ChatGPT style)
    const tempId = `audit-${Date.now().toString(36)}`;
    const pendingItem = {
      id: tempId,
      target: trimmedInput,
      displayTarget: trimmedInput,
      type,
      timestamp: new Date().toISOString(),
      pending: true
    };

    setScanHistory((prev) => [
      pendingItem,
      ...prev.filter((p) => p.target !== trimmedInput)
    ].slice(0, 30));

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await fetch(`${apiBase}/api/audit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: trimmedInput,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result = await response.json();
      const report = result.data || result;

      setCurrentAudit(report);

      // Update sidebar history with the full verified audit report
      setScanHistory((prev) =>
        prev.map((item) => (item.id === tempId ? report : item))
      );
    } catch (err) {
      console.warn("Backend API unreachable, using local fallback evaluator:", err.message);
      // Graceful fallback if backend is starting or offline
      const fallbackReport = generateAuditReport(trimmedInput, type);
      setCurrentAudit(fallbackReport);

      setScanHistory((prev) =>
        prev.map((item) => (item.id === tempId ? fallbackReport : item))
      );
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex h-screen bg-[#0d0f17] text-slate-100 overflow-hidden font-sans">
      {/* 1. Left Collapsible / Minimized Sidebar Rail (ChatGPT style) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
        onClose={() => setIsSidebarOpen(false)}
        scanHistory={scanHistory}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        activeScanId={currentAudit?.id}
        onNewAudit={handleNewAudit}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onNewAudit={handleNewAudit}
          currentModel="TRUST-X 5-Vector + Phase 8 AI"
        />

        {/* Scrollable Chat / Investigation Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {isLoading ? (
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              {/* User Prompt (Right side, like ChatGPT) */}
              <div className="flex items-start justify-end gap-3">
                <div className="max-w-[85%] bg-indigo-600/20 border border-indigo-500/30 rounded-2xl rounded-tr-sm p-4 text-sm text-slate-100 shadow-md">
                  <div className="text-[10px] uppercase font-mono text-indigo-300 font-semibold mb-1">
                    Investigate Target ({queryType.toUpperCase()})
                  </div>
                  <div className="font-mono text-xs break-all whitespace-pre-wrap">
                    {userQuery}
                  </div>
                </div>
              </div>

              {/* AI Processing Response (Left side, like ChatGPT) */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shrink-0 mt-1 shadow-lg shadow-indigo-500/20">
                  <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-indigo-400 animate-pulse" />
                  </div>
                </div>

                <div className="flex-1 bg-[#121520] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-semibold text-slate-200">
                      Analyzing target with TRUST-X Multi-Vector Engine...
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Resolving DNS/RDAP records, inspecting SSL/TLS certificates, querying global threat intelligence (VirusTotal, URLScan, McAfee), and synthesizing the AI risk assessment.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>DNS & WHOIS</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      <span>SSL Handshake</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                      <span>Threat Sandboxes</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span>AI Threat Reasoning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : currentAudit ? (
            <ErrorBoundary onReset={() => setCurrentAudit(null)}>
              <AuditResultView
                auditData={currentAudit}
                userQuery={userQuery}
                queryType={queryType}
              />
            </ErrorBoundary>
          ) : (
            <WelcomeHero onSelectCapability={handleSelectCapability} />
          )}
        </main>

        {/* Bottom ChatGPT Prompt Input Box */}
        <div className="bg-gradient-to-t from-[#0d0f17] via-[#0d0f17]/95 to-transparent pt-4">
          <InputBar
            onRunAudit={handleRunAudit}
            isLoading={isLoading}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
}
