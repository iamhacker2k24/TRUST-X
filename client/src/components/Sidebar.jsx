import React from "react";
import {
  Plus,
  History,
  ShieldAlert,
  ShieldCheck,
  Mail,
  Layers,
  Cpu,
  Box,
  Radio,
  Clock,
} from "lucide-react";

export default function Sidebar({
  isOpen,
  onClose,
  scanHistory = [],
  onSelectHistoryItem,
  activeScanId,
  onNewAudit,
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#090b11] border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:hidden"
        }`}
      >
        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <div className="flex items-center justify-between px-2 mb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              <span className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-400" />
                Investigation History
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {scanHistory.length}
              </span>
            </div>

            {scanHistory.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-slate-500 border border-dashed border-slate-800/80 rounded-xl">
                <Clock className="w-5 h-5 mx-auto mb-1.5 text-slate-600" />
                <p>No recent investigations yet.</p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Scanned targets will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {scanHistory.map((item) => {
                  const isActive = activeScanId === item.id;
                  const isHighRisk = item.scores?.phishingRisk?.score >= 60;
                  const isClean = item.scores?.overallDigitalTrust?.score >= 80;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectHistoryItem(item);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition flex flex-col gap-1 border ${
                        isActive
                          ? "bg-indigo-600/15 border-indigo-500/40 text-white"
                          : "hover:bg-slate-800/50 border-transparent text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="flex items-center gap-2 text-xs font-medium truncate">
                          {item.type === "email" ? (
                            <Mail className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                          ) : isHighRisk ? (
                            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                          )}
                          <span className="truncate">{item.displayTarget}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] pl-5">
                        <span className="text-slate-500 truncate">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded font-mono font-semibold text-[9px] border shrink-0 ${
                            isHighRisk
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              : isClean
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          }`}
                        >
                          Trust {item.scores?.overallDigitalTrust?.score}/100
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
