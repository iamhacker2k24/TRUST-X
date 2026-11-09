import React, { useState } from "react";
import {
  Shield,
  SquarePen,
  Search,
  Pin,
  MessageSquare,
  Library,
  PanelLeftClose,
  Clock,
  Puzzle,
  MoreHorizontal,
  Folder,
  Info,
  CheckCircle2,
  X,
  Trash2,
} from "lucide-react";

export default function Sidebar({
  isOpen,
  onToggle,
  onClose,
  scanHistory = [],
  onSelectHistoryItem,
  onClearHistory,
  activeScanId,
  onNewAudit,
}) {
  const [pinnedIds, setPinnedIds] = useState(new Set());
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null); // null | 'plugins' | 'scheduled'

  const togglePin = (e, id) => {
    e.stopPropagation();
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const [plugins, setPlugins] = useState([
    {
      id: "google-webrisk",
      name: "Google Cloud Web Risk",
      category: "Threat Feed",
      enabled: true,
      desc: "Live detection for social engineering & phishing.",
    },
    {
      id: "virustotal",
      name: "VirusTotal v3",
      category: "Multi-Engine",
      enabled: true,
      desc: "70+ vendor antivirus & IP blacklist telemetry.",
    },
    {
      id: "urlscan",
      name: "URLScan Sandbox",
      category: "DOM Crawler",
      enabled: true,
      desc: "Isolated headless browser execution.",
    },
    {
      id: "pinata-ipfs",
      name: "Pinata IPFS Node",
      category: "Web3 Ledger",
      enabled: true,
      desc: "Phase 9 decentralized immutable report pinning.",
    },
    {
      id: "polygon-anchor",
      name: "Polygon Blockchain",
      category: "Integrity",
      enabled: true,
      desc: "Cryptographic SHA-256 state root anchoring.",
    },
  ]);

  const togglePlugin = (id) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const filteredHistory = scanHistory.filter((item) => {
    if (!searchQuery.trim()) return true;
    return item.target.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const pinnedItems = scanHistory.filter((item) => pinnedIds.has(item.id));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. MINIMIZED VERTICAL ICON DOCK (Harmonized with #0d0f17)
          ───────────────────────────────────────────────────────────── */}
      {!isOpen && (
        <div className="hidden lg:flex flex-col items-center justify-between w-14 h-screen bg-[#0d0f17] border-r border-slate-800/80 py-4 z-30 shrink-0 select-none">
          <div className="flex flex-col items-center gap-4 w-full">
            {/* Top Logo / Toggle */}
            <button
              onClick={onToggle}
              className="p-2 text-slate-300 hover:text-white transition group relative"
              title="Open sidebar"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-indigo-400 stroke-[1.8]" />
              </div>
              <span className="absolute left-14 top-2 bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                Open sidebar
              </span>
            </button>

            {/* New Chat */}
            <button
              onClick={onNewAudit}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-xl transition group relative"
              title="New chat"
            >
              <SquarePen className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute left-14 top-2 bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                New chat
              </span>
            </button>

            {/* Search */}
            <button
              onClick={() => {
                setShowSearch(true);
                onToggle();
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-xl transition group relative"
              title="Search"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute left-14 top-2 bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                Search
              </span>
            </button>

            {/* Pin */}
            <button
              onClick={onToggle}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-xl transition group relative"
              title="Pinned"
            >
              <Pin className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute left-14 top-2 bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                Pinned ({pinnedItems.length})
              </span>
            </button>

            {/* Chats */}
            <button
              onClick={onToggle}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-xl transition group relative"
              title="Chats"
            >
              <MessageSquare className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute left-14 top-2 bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                Chats
              </span>
            </button>

            {/* Library / Plugins */}
            <button
              onClick={() => {
                setActiveModal("plugins");
                onToggle();
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-xl transition group relative"
              title="Library & Plugins"
            >
              <Library className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute left-14 top-2 bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                Library & Plugins
              </span>
            </button>
          </div>

          {/* Bottom Avatar */}
          <div className="w-8 h-8 rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
            pi
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. EXPANDED SIDEBAR (Harmonized with #0d0f17)
          ───────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d0f17] text-slate-200 border-r border-slate-800/80 flex flex-col transition-all duration-200 ease-in-out lg:static shrink-0 select-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:hidden"
        }`}
      >
        {/* Top Header Row: Branding + Icons */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-indigo-400 stroke-[1.8]" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">
              TRUST<span className="text-indigo-400">-X</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition"
              title="Search"
            >
              <Search className="w-4 h-4 stroke-[1.75]" />
            </button>

            <button
              onClick={onToggle}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4 stroke-[1.75]" />
            </button>
          </div>
        </div>

        {/* Search input (collapsible) */}
        {showSearch && (
          <div className="px-3 py-2 border-b border-slate-800/80 bg-[#090b11]/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                autoFocus
                className="w-full bg-[#131622] border border-slate-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Top Menu Actions */}
        <div className="p-2 space-y-0.5 text-sm">
          {/* 1. New chat */}
          <button
            onClick={() => {
              onNewAudit();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition group"
          >
            <SquarePen className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 stroke-[1.75]" />
            <span className="font-normal text-[13px]">New chat</span>
          </button>

          {/* 2. Scheduled */}
          <button
            onClick={() => setActiveModal("scheduled")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition group"
          >
            <Clock className="w-4 h-4 text-slate-400 group-hover:text-amber-400 stroke-[1.75]" />
            <span className="font-normal text-[13px]">Scheduled</span>
          </button>

          {/* 3. Library */}
          <button
            onClick={() => setActiveModal("plugins")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition group"
          >
            <Library className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 stroke-[1.75]" />
            <span className="font-normal text-[13px]">Library</span>
          </button>

          {/* 4. Plugins */}
          <button
            onClick={() => setActiveModal("plugins")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition group"
          >
            <Puzzle className="w-4 h-4 text-slate-400 group-hover:text-purple-400 stroke-[1.75]" />
            <span className="font-normal text-[13px]">Plugins</span>
          </button>

          {/* 5. Explore */}
          <button
            onClick={() => setActiveModal("plugins")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition group"
          >
            <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-200 stroke-[1.75]" />
            <span className="font-normal text-[13px]">Explore</span>
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5 text-sm">
          {/* SECTION: Pinned */}
          <div>
            <div className="px-3 mb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Pinned
            </div>

            {pinnedItems.length === 0 ? (
              <div className="px-3 py-1.5 text-xs text-slate-500">
                No pinned chats
              </div>
            ) : (
              <div className="space-y-0.5">
                {pinnedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectHistoryItem(item);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800/60 text-[13px] cursor-pointer group transition ${
                      activeScanId === item.id
                        ? "bg-slate-800/80 text-white font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="truncate">{item.displayTarget}</span>
                    <button
                      onClick={(e) => togglePin(e, item.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition"
                    >
                      <Pin className="w-3.5 h-3.5 fill-current text-amber-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION: Recents */}
          <div>
            <div className="flex items-center justify-between px-3 mb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Recents</span>
              {scanHistory.length > 0 && onClearHistory && (
                <button
                  onClick={onClearHistory}
                  className="text-[10px] text-slate-500 hover:text-rose-400 transition"
                >
                  Clear
                </button>
              )}
            </div>

            {filteredHistory.length === 0 ? (
              <div className="px-3 py-1.5 text-xs text-slate-500">
                No recent searches
              </div>
            ) : (
              <div className="space-y-0.5">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectHistoryItem(item);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800/60 text-[13px] cursor-pointer group transition ${
                      activeScanId === item.id
                        ? "bg-slate-800/80 text-white font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="truncate max-w-[170px]">{item.displayTarget}</span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => togglePin(e, item.id)}
                        className={`opacity-0 group-hover:opacity-100 transition ${
                          pinnedIds.has(item.id)
                            ? "opacity-100 text-amber-400"
                            : "text-slate-500 hover:text-slate-200"
                        }`}
                        title="Pin"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <Info className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 hover:text-slate-200 transition" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Profile Row */}
        <div className="p-3 border-t border-slate-800/80 flex items-center justify-between hover:bg-slate-800/50 transition cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-200">
              pi
            </div>
            <div>
              <div className="text-[13px] font-medium text-white leading-tight">
                pi2k25
              </div>
              <div className="text-[11px] text-slate-400">Go</div>
            </div>
          </div>
        </div>
      </aside>

      {/* PLUGINS / SCHEDULED MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121520] border border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {activeModal === "plugins" ? (
                  <>
                    <Puzzle className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold text-white text-base">
                      Threat Intelligence Plugins
                    </h3>
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-white text-base">
                      Phase 10: Scheduled Continuous Monitoring
                    </h3>
                  </>
                )}
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {activeModal === "plugins" ? (
                plugins.map((plugin) => (
                  <div
                    key={plugin.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            plugin.enabled ? "text-emerald-400" : "text-slate-600"
                          }`}
                        />
                        <span className="font-semibold text-slate-200">
                          {plugin.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                          {plugin.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {plugin.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePlugin(plugin.id)}
                      className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center shrink-0 ml-3 ${
                        plugin.enabled
                          ? "bg-indigo-600 justify-end"
                          : "bg-slate-800 justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="space-y-3 text-xs text-slate-300">
                  <p>
                    Automated background cron monitors target websites for certificate expiration, DNS drift, and newly listed phishing reports.
                  </p>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monitoring Interval:</span>
                      <span className="font-mono text-slate-200">Every 15 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Alert Webhook:</span>
                      <span className="font-mono text-indigo-400">Configured (Slack / Email)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
