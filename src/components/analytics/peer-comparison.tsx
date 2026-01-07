"use client";

import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  Zap,
  Target,
} from "lucide-react";
import { useState } from "react";
import { PeerComparison } from "@/lib/analytics/types";
import { formatTime } from "@/lib/analytics/calculations";

type PeerComparisonCardProps = {
  comparison: PeerComparison;
};

export function PeerComparisonCard({ comparison }: PeerComparisonCardProps) {
  const [showFilters, setShowFilters] = useState(false);

  const isAboveAverage = comparison.userPerformance < comparison.peerAverage;
  const isFasterImprovement = comparison.improvementRate > comparison.peerImprovementRate;

  const getPercentileLabel = () => {
    if (comparison.percentile >= 90) return "Elite";
    if (comparison.percentile >= 75) return "Above Average";
    if (comparison.percentile >= 50) return "Average";
    if (comparison.percentile >= 25) return "Below Average";
    return "Developing";
  };

  const getPercentileColor = () => {
    if (comparison.percentile >= 90) return "text-orange-500";
    if (comparison.percentile >= 75) return "text-green-500";
    if (comparison.percentile >= 50) return "text-blue-500";
    if (comparison.percentile >= 25) return "text-yellow-500";
    return "text-zinc-500";
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-white">Peer Comparison</h3>
          </div>
          <span className="text-xs text-zinc-500">{comparison.event}</span>
        </div>
      </div>

      {/* Percentile Display */}
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            {/* Background circle */}
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#27272a"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f97316"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${comparison.percentile * 2.83} 283`}
                initial={{ strokeDasharray: "0 283" }}
                animate={{ strokeDasharray: `${comparison.percentile * 2.83} 283` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{comparison.percentile}</span>
              <span className="text-xs text-zinc-500">percentile</span>
            </div>
          </div>

          <div className={`text-lg font-bold ${getPercentileColor()}`}>
            {getPercentileLabel()}
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Faster than {comparison.percentile}% of similar athletes
          </p>
        </div>

        {/* Comparison Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
            <div className="text-xs text-zinc-500 mb-1">Your Time</div>
            <div className="text-xl font-bold text-orange-500 font-mono">
              {formatTime(comparison.userPerformance)}
            </div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
            <div className="text-xs text-zinc-500 mb-1">Peer Average</div>
            <div className="text-xl font-bold text-zinc-300 font-mono">
              {formatTime(comparison.peerAverage)}
            </div>
          </div>
        </div>

        {/* Difference */}
        <div className={`
          flex items-center justify-center gap-2 p-3 rounded-lg
          ${isAboveAverage ? "bg-green-500/20" : "bg-red-500/20"}
        `}>
          {isAboveAverage ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={isAboveAverage ? "text-green-500" : "text-red-500"}>
            {Math.abs(comparison.userPerformance - comparison.peerAverage).toFixed(2)}s {isAboveAverage ? "faster" : "slower"} than average
          </span>
        </div>
      </div>

      {/* Improvement Rate Comparison */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-white">Improvement Rate</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">You</span>
              <span className="text-orange-500">{comparison.improvementRate.toFixed(1)}% / month</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(comparison.improvementRate * 10, 100)}%` }}
                className="h-full bg-orange-500 rounded-full"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">Peers</span>
              <span className="text-zinc-500">{comparison.peerImprovementRate.toFixed(1)}% / month</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(comparison.peerImprovementRate * 10, 100)}%` }}
                className="h-full bg-zinc-600 rounded-full"
              />
            </div>
          </div>
        </div>

        {isFasterImprovement && (
          <div className="mt-3 flex items-center gap-2 text-sm text-green-500">
            <TrendingUp className="w-4 h-4" />
            You're improving {((comparison.improvementRate / comparison.peerImprovementRate - 1) * 100).toFixed(0)}% faster than peers!
          </div>
        )}
      </div>

      {/* Filters */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full p-3 border-t border-zinc-800 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
      >
        <span className="text-xs text-zinc-500">Comparison Filters</span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${showFilters ? "rotate-180" : ""}`} />
      </button>

      {showFilters && (
        <div className="p-4 border-t border-zinc-800 bg-zinc-800/30">
          <div className="flex flex-wrap gap-2 text-xs">
            {comparison.filters.ageGroup && (
              <span className="px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">
                Age: {comparison.filters.ageGroup}
              </span>
            )}
            {comparison.filters.gender && (
              <span className="px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">
                {comparison.filters.gender}
              </span>
            )}
            {comparison.filters.region && (
              <span className="px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">
                {comparison.filters.region}
              </span>
            )}
            {comparison.filters.tier && (
              <span className="px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">
                Tier: {comparison.filters.tier}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Based on {comparison.sampleSize.toLocaleString()} athletes
          </p>
        </div>
      )}
    </div>
  );
}

// Compact Percentile Badge
type PercentileBadgeProps = {
  percentile: number;
  event?: string;
};

export function PercentileBadge({ percentile, event }: PercentileBadgeProps) {
  const getColor = () => {
    if (percentile >= 90) return "orange";
    if (percentile >= 75) return "green";
    if (percentile >= 50) return "blue";
    return "zinc";
  };

  const color = getColor();

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
      style={{
        backgroundColor: `rgba(${color === "orange" ? "249, 115, 22" : color === "green" ? "34, 197, 94" : color === "blue" ? "59, 130, 246" : "113, 113, 122"}, 0.2)`,
      }}
    >
      <Target className="w-4 h-4" style={{ color: color === "orange" ? "#f97316" : color === "green" ? "#22c55e" : color === "blue" ? "#3b82f6" : "#71717a" }} />
      <div>
        <span className="text-sm font-bold" style={{ color: color === "orange" ? "#f97316" : color === "green" ? "#22c55e" : color === "blue" ? "#3b82f6" : "#71717a" }}>
          {percentile}th
        </span>
        <span className="text-xs text-zinc-500 ml-1">percentile</span>
        {event && <span className="text-xs text-zinc-600 ml-1">({event})</span>}
      </div>
    </div>
  );
}
