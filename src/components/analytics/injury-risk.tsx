"use client";

import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";
import { InjuryRisk, InjuryRiskFactor } from "@/lib/analytics/types";

type InjuryRiskCardProps = {
  risk: InjuryRisk;
  showDetails?: boolean;
};

export function InjuryRiskCard({ risk, showDetails = true }: InjuryRiskCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getRiskConfig = () => {
    switch (risk.level) {
      case "low":
        return {
          color: "green",
          icon: CheckCircle,
          label: "Low Risk",
          description: "Your training load is well balanced",
          bgClass: "bg-green-500/20",
          borderClass: "border-green-500/30",
          textClass: "text-green-500",
        };
      case "moderate":
        return {
          color: "yellow",
          icon: AlertCircle,
          label: "Moderate Risk",
          description: "Some factors need attention",
          bgClass: "bg-yellow-500/20",
          borderClass: "border-yellow-500/30",
          textClass: "text-yellow-500",
        };
      case "high":
        return {
          color: "orange",
          icon: AlertTriangle,
          label: "High Risk",
          description: "Consider reducing training load",
          bgClass: "bg-orange-500/20",
          borderClass: "border-orange-500/30",
          textClass: "text-orange-500",
        };
      case "critical":
        return {
          color: "red",
          icon: XCircle,
          label: "Critical Risk",
          description: "Immediate action recommended",
          bgClass: "bg-red-500/20",
          borderClass: "border-red-500/30",
          textClass: "text-red-500",
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  // Risk gauge calculation
  const gaugeRotation = (risk.score / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-500" />
          <h3 className="font-bold text-white">Injury Risk Assessment</h3>
        </div>
      </div>

      {/* Risk Gauge */}
      <div className="p-6 flex flex-col items-center">
        <div className="relative w-48 h-24 mb-4">
          {/* Gauge Background */}
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#27272a"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Green zone (0-25) */}
            <path
              d="M 20 100 A 80 80 0 0 1 55 35"
              fill="none"
              stroke="#22c55e"
              strokeWidth="16"
              strokeLinecap="round"
              opacity="0.3"
            />
            {/* Yellow zone (25-50) */}
            <path
              d="M 55 35 A 80 80 0 0 1 100 20"
              fill="none"
              stroke="#eab308"
              strokeWidth="16"
              opacity="0.3"
            />
            {/* Orange zone (50-75) */}
            <path
              d="M 100 20 A 80 80 0 0 1 145 35"
              fill="none"
              stroke="#f97316"
              strokeWidth="16"
              opacity="0.3"
            />
            {/* Red zone (75-100) */}
            <path
              d="M 145 35 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#ef4444"
              strokeWidth="16"
              strokeLinecap="round"
              opacity="0.3"
            />
          </svg>

          {/* Needle */}
          <motion.div
            className="absolute bottom-0 left-1/2 origin-bottom"
            initial={{ rotate: -90 }}
            animate={{ rotate: gaugeRotation }}
            transition={{ type: "spring", damping: 15 }}
            style={{ width: 4, height: 70, marginLeft: -2 }}
          >
            <div className="w-full h-full bg-white rounded-full" />
          </motion.div>

          {/* Center circle */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-600" />
        </div>

        {/* Risk Level */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bgClass} border ${config.borderClass}`}>
          <Icon className={`w-5 h-5 ${config.textClass}`} />
          <span className={`font-bold ${config.textClass}`}>{config.label}</span>
        </div>

        <p className="text-zinc-400 text-sm mt-2 text-center">{config.description}</p>

        {/* Score */}
        <div className="mt-4 text-center">
          <span className="text-3xl font-black text-white">{risk.score}</span>
          <span className="text-zinc-500 text-sm">/100</span>
        </div>
      </div>

      {/* Factors */}
      {showDetails && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full p-3 border-t border-zinc-800 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-sm text-zinc-400">Risk Factors</span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-zinc-800"
            >
              <div className="p-4 space-y-3">
                {risk.factors.map((factor, i) => (
                  <RiskFactorRow key={i} factor={factor} />
                ))}
              </div>

              {/* Recommendations */}
              {risk.recommendations.length > 0 && (
                <div className="p-4 border-t border-zinc-800 bg-zinc-800/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-white">Recommendations</span>
                  </div>
                  <ul className="space-y-2">
                    {risk.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                        <span className="text-orange-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

// Risk Factor Row
function RiskFactorRow({ factor }: { factor: InjuryRiskFactor }) {
  const getImpactConfig = () => {
    switch (factor.impact) {
      case "positive":
        return { color: "text-green-500", bg: "bg-green-500", icon: CheckCircle };
      case "negative":
        return { color: "text-red-500", bg: "bg-red-500", icon: AlertTriangle };
      default:
        return { color: "text-zinc-500", bg: "bg-zinc-500", icon: AlertCircle };
    }
  };

  const config = getImpactConfig();
  const Icon = config.icon;
  const progress = Math.min((factor.value / factor.threshold) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 ${config.color} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-white">{factor.name}</span>
          <span className={`text-xs ${config.color}`}>
            {factor.value.toFixed(1)} / {factor.threshold}
          </span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${config.bg}`}
            style={{ width: `${progress}%`, opacity: 0.7 }}
          />
        </div>
        <p className="text-xs text-zinc-500 mt-1">{factor.description}</p>
      </div>
    </div>
  );
}

// Compact Risk Badge
type RiskBadgeProps = {
  level: InjuryRisk["level"];
  score?: number;
};

export function RiskBadge({ level, score }: RiskBadgeProps) {
  const config = {
    low: { color: "green", label: "Low" },
    moderate: { color: "yellow", label: "Moderate" },
    high: { color: "orange", label: "High" },
    critical: { color: "red", label: "Critical" },
  }[level];

  return (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `rgba(${config.color === "green" ? "34, 197, 94" : config.color === "yellow" ? "234, 179, 8" : config.color === "orange" ? "249, 115, 22" : "239, 68, 68"}, 0.2)`,
        color: config.color === "green" ? "#22c55e" : config.color === "yellow" ? "#eab308" : config.color === "orange" ? "#f97316" : "#ef4444",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{
        backgroundColor: config.color === "green" ? "#22c55e" : config.color === "yellow" ? "#eab308" : config.color === "orange" ? "#f97316" : "#ef4444",
      }} />
      {config.label}
      {score !== undefined && <span className="ml-1 opacity-70">({score})</span>}
    </div>
  );
}
