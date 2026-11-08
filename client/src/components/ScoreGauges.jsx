import React from "react";
import { ShieldAlert, Bug, Lock, Award, ShieldCheck, AlertTriangle } from "lucide-react";

export default function ScoreGauges({ scores, tenantClassification }) {
  if (!scores) return null;

  const { phishingRisk, malwareRisk, webSecurityScore, certificateTrustScore, overallDigitalTrust } = scores;

  return (
    <div className="space-y-4 my-4">
      {/* Shared Hosting / Multi-tenant Notice */}
      {tenantClassification?.isSharedHosting && (
        <div className="flex items-start gap-3 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Multi-Tenant Cloud Host Detected:</span>{" "}
            {tenantClassification.platform} (Tenant: <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-100 font-mono">{tenantClassification.tenantIdentifier}</code>).
            <p className="mt-1 text-amber-200/80 leading-relaxed">
              {tenantClassification.note}
            </p>
          </div>
        </div>
      )}

      {/* Main Overall Digital Trust Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-slate-700/60 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black text-2xl shadow-lg border ${
              overallDigitalTrust.score >= 80
                ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                : overallDigitalTrust.score >= 50
                ? "bg-amber-950/80 text-amber-400 border-amber-500/40"
                : "bg-rose-950/80 text-rose-400 border-rose-500/40"
            }`}>
              <span>{overallDigitalTrust.grade}</span>
              <span className="text-[10px] font-mono tracking-tight font-normal text-slate-300">
                {overallDigitalTrust.score}/100
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">
                  Synthesized Overall Digital Trust
                </h4>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                  overallDigitalTrust.score >= 80
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : overallDigitalTrust.score >= 50
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                    : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                }`}>
                  {overallDigitalTrust.level}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Confidence Rating: <strong className="text-slate-100">{overallDigitalTrust.confidence}</strong>
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6 text-xs text-slate-400">
            <span className="text-slate-500 block">Trust Engine Standard:</span>
            <span className="font-mono text-slate-300">TRUST-X 5-Vector Evidential Engine v2.4</span>
          </div>
        </div>
      </div>

      {/* 4 Discrete Factor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Phishing Risk */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Phishing Risk</span>
            </div>
            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
              phishingRisk.score > 60
                ? "bg-rose-500/20 text-rose-300"
                : phishingRisk.score > 25
                ? "bg-amber-500/20 text-amber-300"
                : "bg-emerald-500/20 text-emerald-300"
            }`}>
              {phishingRisk.score}%
            </span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full my-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                phishingRisk.score > 60 ? "bg-rose-500" : phishingRisk.score > 25 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${phishingRisk.score}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            {phishingRisk.summary}
          </p>
        </div>

        {/* Malware Risk */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Bug className="w-4 h-4 text-amber-400" />
              <span>Malware Risk</span>
            </div>
            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
              malwareRisk.score > 60
                ? "bg-rose-500/20 text-rose-300"
                : malwareRisk.score > 25
                ? "bg-amber-500/20 text-amber-300"
                : "bg-emerald-500/20 text-emerald-300"
            }`}>
              {malwareRisk.score}%
            </span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full my-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                malwareRisk.score > 60 ? "bg-rose-500" : malwareRisk.score > 25 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${malwareRisk.score}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            {malwareRisk.summary}
          </p>
        </div>

        {/* Web Security Score */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Web Security</span>
            </div>
            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
              webSecurityScore.score >= 70
                ? "bg-emerald-500/20 text-emerald-300"
                : webSecurityScore.score >= 40
                ? "bg-amber-500/20 text-amber-300"
                : "bg-rose-500/20 text-rose-300"
            }`}>
              {webSecurityScore.score}/100
            </span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full my-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                webSecurityScore.score >= 70 ? "bg-emerald-500" : webSecurityScore.score >= 40 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${webSecurityScore.score}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            {webSecurityScore.summary}
          </p>
        </div>

        {/* Certificate Trust Score */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Certificate Trust</span>
            </div>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              {certificateTrustScore.score}/100
            </span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full my-3 overflow-hidden">
            <div
              className="h-full transition-all duration-700 rounded-full bg-indigo-500"
              style={{ width: `${certificateTrustScore.score}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            {certificateTrustScore.summary}
          </p>
        </div>
      </div>
    </div>
  );
}

