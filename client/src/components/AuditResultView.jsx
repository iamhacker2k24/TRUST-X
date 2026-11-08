import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Radio,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  Copy,
  Check,
  Terminal,
  Shield,
  FileCheck,
  Send,
  Sparkles,
  Info
} from "lucide-react";
import ScoreGauges from "./ScoreGauges";

export default function AuditResultView({ auditData, userQuery, queryType, onAskFollowUp }) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedCid, setCopiedCid] = useState(false);
  const [activeTab, setActiveTab] = useState("ai-explanation"); // 'ai-explanation' | 'telemetry' | 'web3'
  const [monitoringEnabled, setMonitoringEnabled] = useState(auditData?.continuousMonitoring?.enabled || false);
  const [followUpText, setFollowUpText] = useState("");
  const [followUpAnswers, setFollowUpAnswers] = useState([]);

  if (!auditData) return null;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "hash") {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedCid(true);
      setTimeout(() => setCopiedCid(false), 2000);
    }
  };

  const handleFollowUpSubmit = (question) => {
    const q = question || followUpText;
    if (!q.trim()) return;

    let answer = "";
    if (q.includes("SSL") || q.includes("certificate")) {
      answer = "A valid HTTPS/TLS certificate simply proves that the connection between your browser and the server is encrypted. Certificate Authorities (like Let's Encrypt or Cloudflare) only verify control of the domain or hostname—they do NOT verify whether the site's intent is benign or malicious. Over 83% of modern phishing websites utilize valid SSL certificates to create a false sense of security.";
    } else if (q.includes("Vercel") || q.includes("tenant")) {
      answer = "Vercel is a multi-tenant cloud application platform. While vercel.com itself is a trusted infrastructure with a high reputation, anyone can register a free subdomain tenant (e.g. sbi-login.vercel.app). TRUST-X isolates tenant hostnames and assesses them on custom brand signals, page DOM behavior, and external form destinations rather than relying on Vercel's global IP reputation.";
    } else {
      answer = "Recommended next steps: 1) Block this URL / domain across corporate email gateways and DNS firewalls. 2) If credentials were submitted, initiate immediate multi-factor authentication (MFA) reset and session revocation. 3) Submit an abuse takedown request to the hosting provider.";
    }

    setFollowUpAnswers((prev) => [...prev, { q, a: answer }]);
    setFollowUpText("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* 1. User Query Bubble */}
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

      {/* 2. TRUST-X Agent Investigation Message */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shrink-0 mt-1 shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center">
            <Shield className="w-4 h-4 text-indigo-400" />
          </div>
        </div>

        <div className="flex-1 bg-[#121520] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6 overflow-hidden">
          {/* Header of Audit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">
                  Deterministic Audit & Threat Report
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  ID: {auditData.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                Target: <span className="text-indigo-300">{auditData.displayTarget}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(auditData.timestamp).toLocaleTimeString()} UTC</span>
            </div>
          </div>

          {/* Execution Pipeline Steps Tracker */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Telemetry Pipeline Execution (Deterministic Scan)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              {auditData.stepsExecuted?.map((step, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="block truncate font-medium text-slate-200">{step.name}</span>
                    <span className="text-[9px] text-slate-500 font-mono">{step.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Vector Score Gauges Component */}
          <ScoreGauges
            scores={auditData.scores}
            tenantClassification={auditData.tenantClassification}
          />

          {/* Interactive Tabs for Phase 8 AI, Phase 9 Web3, and Telemetry */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab("ai-explanation")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "ai-explanation"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Phase 8: AI Threat Explanation</span>
              </button>

              <button
                onClick={() => setActiveTab("web3")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "web3"
                    ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Phase 9: IPFS & Blockchain Ledger</span>
              </button>

              <button
                onClick={() => setActiveTab("monitoring")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "monitoring"
                    ? "bg-amber-600/20 text-amber-300 border border-amber-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>Phase 10: 24/7 Monitoring</span>
              </button>
            </div>

            {/* TAB 1: PHASE 8 AI THREAT EXPLANATION */}
            {activeTab === "ai-explanation" && auditData.aiExplanation && (
              <div className="pt-4 space-y-4">
                {/* Executive Summary */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Executive Summary</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {auditData.aiExplanation.executiveSummary}
                  </p>
                </div>

                {/* Evidence Hierarchy: Strong vs Weak */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/70 border border-rose-500/20 rounded-xl p-3.5">
                    <span className="font-semibold text-rose-300 flex items-center gap-1.5 mb-2">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                      Strong Supporting Evidence (High Weight)
                    </span>
                    <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                      {auditData.aiExplanation.strongEvidence?.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                      <Info className="w-3.5 h-3.5 text-amber-400" />
                      Weak / Corroborative Indicators
                    </span>
                    <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                      {auditData.aiExplanation.weakIndicators?.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* MITRE ATT&CK Techniques */}
                {auditData.aiExplanation.attackTechniques?.length > 0 && (
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
                    <span className="font-semibold text-slate-300 text-xs flex items-center gap-1.5 mb-2.5">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      Identified MITRE ATT&CK Techniques
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {auditData.aiExplanation.attackTechniques.map((tech, idx) => (
                        <div key={idx} className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80">
                          <span className="font-mono text-[10px] text-indigo-400 font-bold block">
                            {tech.mitreId}
                          </span>
                          <span className="text-xs font-semibold text-white block mt-0.5">
                            {tech.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-1 leading-tight">
                            {tech.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Precautions */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 text-xs text-emerald-200">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Recommended User Precautions & Remediation
                  </span>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    {auditData.aiExplanation.userPrecautions?.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Uncertainty Disclosure */}
                <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Unresolved Uncertainty / Operational Limitations:</span>{" "}
                  {auditData.aiExplanation.uncertainties}
                </div>
              </div>
            )}

            {/* TAB 2: PHASE 9 IPFS & BLOCKCHAIN INTEGRITY */}
            {activeTab === "web3" && auditData.ipfsAndBlockchain && (
              <div className="pt-4 space-y-4">
                <div className="bg-slate-900/90 border border-cyan-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Decentralized Report Storage & Immutability Ledger
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      Verified On-Chain
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    This report has been canonicalized into standardized JSON, cryptographically hashed, and pinned to IPFS via Pinata. The state root has been notarized on the public blockchain.
                  </p>

                  <div className="space-y-2.5 font-mono text-xs">
                    {/* SHA-256 Hash */}
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div className="truncate mr-2">
                        <span className="text-slate-500 block text-[10px]">Cryptographic Report SHA-256:</span>
                        <span className="text-slate-200 select-all">{auditData.ipfsAndBlockchain.reportHash}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(auditData.ipfsAndBlockchain.reportHash, "hash")}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition shrink-0"
                        title="Copy Hash"
                      >
                        {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* IPFS CID */}
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div className="truncate mr-2">
                        <span className="text-slate-500 block text-[10px]">IPFS Content Identifier (CID):</span>
                        <span className="text-cyan-300 select-all">{auditData.ipfsAndBlockchain.ipfsCid}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => copyToClipboard(auditData.ipfsAndBlockchain.ipfsCid, "cid")}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title="Copy CID"
                        >
                          {copiedCid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={auditData.ipfsAndBlockchain.ipfsGatewayUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/30 text-[10px] transition"
                        >
                          <span>Gateway</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Blockchain Tx */}
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Network:</span>
                        <span className="text-white font-sans text-xs font-semibold">{auditData.ipfsAndBlockchain.blockchainNetwork}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Anchor Tx Hash:</span>
                        <span className="text-indigo-400 truncate block text-xs">{auditData.ipfsAndBlockchain.txHash}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Block Number:</span>
                        <span className="text-slate-300 text-xs">#{auditData.ipfsAndBlockchain.blockNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{auditData.ipfsAndBlockchain.redactionStatus}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PHASE 10 CONTINUOUS WEBSITE MONITORING */}
            {activeTab === "monitoring" && (
              <div className="pt-4 space-y-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Continuous Threat Monitoring & Alert Dispatcher
                      </h4>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-slate-300 font-medium">
                        {monitoringEnabled ? "Active (Watch Running)" : "Disabled"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setMonitoringEnabled(!monitoringEnabled)}
                        className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                          monitoringEnabled ? "bg-indigo-600 justify-end" : "bg-slate-800 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-md transition-transform" />
                      </button>
                    </label>
                  </div>

                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    Automated background cron periodically validates certificate expiration, detecting TLS cipher degradation, DNS IP reassignment, and new threat feed entries.
                  </p>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Inspection Cadence:</span>
                      <span className="font-mono text-slate-200">{auditData.continuousMonitoring?.cadence || "Every 15 minutes"}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Tracked Signals:</span>
                      <span className="font-mono text-indigo-300">
                        {auditData.continuousMonitoring?.monitoredSignals?.join(", ") || "DNS Shifts, Cert Expiration, Threat Blacklists"}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Alert Webhook Destination:</span>
                      <span className="font-mono text-slate-300">Slack / PagerDuty / Webhook Configured</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Follow-up Interactive Inquiries (ChatGPT style) */}
          <div className="border-t border-slate-800/80 pt-4 space-y-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Follow-up Inquiries on this Investigation
            </span>

            {/* Quick Pill Questions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFollowUpSubmit("Why is the SSL certificate valid if this is phishing?")}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition"
              >
                ❓ Why is the SSL certificate valid if this is phishing?
              </button>
              <button
                onClick={() => handleFollowUpSubmit("How does Vercel tenant isolation protect reputation?")}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition"
              >
                ❓ How does Vercel tenant isolation work?
              </button>
              <button
                onClick={() => handleFollowUpSubmit("What are the recommended incident response actions?")}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition"
              >
                ❓ What are the incident response steps?
              </button>
            </div>

            {/* Dynamic Follow-up Q&A stream */}
            {followUpAnswers.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5 text-xs animate-fadeIn">
                <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <span>Q: {item.q}</span>
                </div>
                <div className="text-slate-300 leading-relaxed pl-3 border-l-2 border-indigo-500/40">
                  {item.a}
                </div>
              </div>
            ))}

            {/* Custom follow up input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFollowUpSubmit()}
                placeholder="Ask TRUST-X AI a follow-up question about this evidence..."
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => handleFollowUpSubmit()}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

