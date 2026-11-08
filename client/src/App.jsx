import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import WelcomeHero from "./components/WelcomeHero";
import InputBar from "./components/InputBar";
import AuditResultView from "./components/AuditResultView";
import { generateAuditReport } from "./utils/auditEngine";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentAudit, setCurrentAudit] = useState(null);
  const [userQuery, setUserQuery] = useState("");
  const [queryType, setQueryType] = useState("url");
  const [isLoading, setIsLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("url"); // 'url' | 'email' | 'ipfs'

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
    setQueryType(item.type);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectCapability = (type) => {
    setActiveTab(type);
  };

  const handleRunAudit = (input, type) => {
    setUserQuery(input);
    setQueryType(type);
    setIsLoading(true);

    // Run dynamic evaluation using the evidential audit engine
    setTimeout(() => {
      const report = generateAuditReport(input, type);
      setCurrentAudit(report);
      setScanHistory((prev) =>
        [report, ...prev.filter((p) => p.id !== report.id)].slice(0, 20),
      );
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 750);
  };

  return (
    <div className="flex h-screen bg-[#0d0f17] text-slate-100 overflow-hidden font-sans">
      {/* 1. Left Collapsible Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        scanHistory={scanHistory}
        onSelectHistoryItem={handleSelectHistoryItem}
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
            <div className="max-w-2xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white">
                Running 5-Vector Evidential Engine...
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Resolving DoH DNS, inspecting TLS handshakes, querying threat
                feeds, and synthesizing Phase 8 AI explanation.
              </p>
            </div>
          ) : currentAudit ? (
            <AuditResultView
              auditData={currentAudit}
              userQuery={userQuery}
              queryType={queryType}
            />
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
