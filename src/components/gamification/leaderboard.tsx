"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Medal,
  Flame,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { LeaderboardEntry, LeaderboardType, LeaderboardMetric } from "@/lib/gamification/types";

type LeaderboardProps = {
  entries: LeaderboardEntry[];
  type: LeaderboardType;
  metric: LeaderboardMetric;
  currentUserId?: string;
  onTypeChange?: (type: LeaderboardType) => void;
  onMetricChange?: (metric: LeaderboardMetric) => void;
};

export function Leaderboard({
  entries,
  type,
  metric,
  currentUserId,
  onTypeChange,
  onMetricChange,
}: LeaderboardProps) {
  const [showAll, setShowAll] = useState(false);

  const displayEntries = showAll ? entries : entries.slice(0, 10);
  const currentUserEntry = entries.find(e => e.oderId === currentUserId);
  const currentUserRank = currentUserEntry?.rank;

  const getMetricLabel = (m: LeaderboardMetric): string => {
    switch (m) {
      case "xp": return "XP";
      case "distance": return "Distance";
      case "workouts": return "Workouts";
      case "prs": return "PRs";
      case "streak": return "Streak";
    }
  };

  const getMetricValue = (value: number, m: LeaderboardMetric): string => {
    switch (m) {
      case "xp": return value.toLocaleString();
      case "distance": return `${value.toFixed(1)}km`;
      case "workouts": return value.toString();
      case "prs": return value.toString();
      case "streak": return `${value}d`;
    }
  };

  const getRankChange = (change?: number) => {
    if (!change || change === 0) {
      return <Minus className="w-3 h-3 text-zinc-500" />;
    }
    if (change > 0) {
      return (
        <span className="flex items-center text-green-500 text-xs">
          <TrendingUp className="w-3 h-3" />
          {change}
        </span>
      );
    }
    return (
      <span className="flex items-center text-red-500 text-xs">
        <TrendingDown className="w-3 h-3" />
        {Math.abs(change)}
      </span>
    );
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
          <Crown className="w-4 h-4 text-black" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-zinc-400 flex items-center justify-center">
          <Medal className="w-4 h-4 text-black" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-orange-700 flex items-center justify-center">
          <Medal className="w-4 h-4 text-white" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
        <span className="text-sm font-bold text-zinc-400">{rank}</span>
      </div>
    );
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-white">Leaderboard</h3>
          </div>
          
          {currentUserRank && (
            <div className="text-sm">
              <span className="text-zinc-500">Your Rank: </span>
              <span className="text-orange-500 font-bold">#{currentUserRank}</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {/* Type Selector */}
          <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
            {(["weekly", "monthly", "all_time"] as LeaderboardType[]).map((t) => (
              <button
                key={t}
                onClick={() => onTypeChange?.(t)}
                className={`
                  px-3 py-1 rounded-md text-xs font-medium transition-colors
                  ${type === t ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"}
                `}
              >
                {t === "weekly" ? "Week" : t === "monthly" ? "Month" : "All Time"}
              </button>
            ))}
          </div>

          {/* Metric Selector */}
          <select
            value={metric}
            onChange={(e) => onMetricChange?.(e.target.value as LeaderboardMetric)}
            className="bg-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-1 border-none focus:ring-1 focus:ring-orange-500"
          >
            {(["xp", "distance", "workouts", "prs", "streak"] as LeaderboardMetric[]).map((m) => (
              <option key={m} value={m}>{getMetricLabel(m)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="p-4 bg-gradient-to-b from-zinc-800/50 to-transparent">
        <div className="flex items-end justify-center gap-4">
          {/* 2nd Place */}
          {entries[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-500 flex items-center justify-center text-white text-xl font-bold">
                {entries[1].userName.charAt(0).toUpperCase()}
              </div>
              <div className="w-16 h-20 bg-zinc-700 rounded-t-lg flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-zinc-400">2</span>
              </div>
              <p className="text-xs text-white mt-1 truncate max-w-[80px]">{entries[1].userName}</p>
              <p className="text-xs text-zinc-500">{getMetricValue(entries[1].value, metric)}</p>
            </motion.div>
          )}

          {/* 1st Place */}
          {entries[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Crown className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
              <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-yellow-500/30">
                {entries[0].userName.charAt(0).toUpperCase()}
              </div>
              <div className="w-20 h-28 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-t-lg flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <p className="text-sm text-white font-bold mt-1 truncate max-w-[100px]">{entries[0].userName}</p>
              <p className="text-xs text-orange-500 font-bold">{getMetricValue(entries[0].value, metric)}</p>
            </motion.div>
          )}

          {/* 3rd Place */}
          {entries[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-orange-700 to-orange-800 flex items-center justify-center text-white text-xl font-bold">
                {entries[2].userName.charAt(0).toUpperCase()}
              </div>
              <div className="w-16 h-16 bg-orange-900 rounded-t-lg flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-orange-300">3</span>
              </div>
              <p className="text-xs text-white mt-1 truncate max-w-[80px]">{entries[2].userName}</p>
              <p className="text-xs text-zinc-500">{getMetricValue(entries[2].value, metric)}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Rest of Leaderboard */}
      <div className="divide-y divide-zinc-800">
        {displayEntries.slice(3).map((entry, index) => {
          const isCurrentUser = entry.oderId === currentUserId;
          const rank = index + 4;

          return (
            <motion.div
              key={entry.oderId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center gap-3 p-3
                ${isCurrentUser ? "bg-orange-500/10" : "hover:bg-zinc-800/50"}
              `}
            >
              {getRankBadge(rank)}

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold">
                {entry.userName.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <span className={`font-medium ${isCurrentUser ? "text-orange-500" : "text-white"}`}>
                  {entry.userName}
                  {isCurrentUser && " (You)"}
                </span>
                {entry.tier && (
                  <span className="ml-2 text-xs text-zinc-500">{entry.tier}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {getRankChange(entry.change)}
                <span className="text-orange-500 font-bold min-w-[60px] text-right">
                  {getMetricValue(entry.value, metric)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Show More */}
      {entries.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full p-3 text-center text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors flex items-center justify-center gap-1"
        >
          {showAll ? "Show Less" : `Show All (${entries.length})`}
          <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* Current User (if not in top 10) */}
      {currentUserEntry && currentUserRank && currentUserRank > 10 && !showAll && (
        <div className="border-t border-zinc-800 p-3 bg-orange-500/10">
          <div className="flex items-center gap-3">
            {getRankBadge(currentUserRank)}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold">
              {currentUserEntry.userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <span className="font-medium text-orange-500">{currentUserEntry.userName} (You)</span>
            </div>
            <span className="text-orange-500 font-bold">
              {getMetricValue(currentUserEntry.value, metric)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact leaderboard for sidebars
type MiniLeaderboardProps = {
  entries: LeaderboardEntry[];
  metric: LeaderboardMetric;
  title?: string;
};

export function MiniLeaderboard({ entries, metric, title = "Top Athletes" }: MiniLeaderboardProps) {
  const getMetricValue = (value: number): string => {
    switch (metric) {
      case "xp": return `${value.toLocaleString()} XP`;
      case "distance": return `${value.toFixed(1)}km`;
      case "workouts": return `${value} workouts`;
      case "prs": return `${value} PRs`;
      case "streak": return `${value}d streak`;
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
      <h3 className="font-bold text-white mb-3 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-yellow-500" />
        {title}
      </h3>
      <div className="space-y-2">
        {entries.slice(0, 5).map((entry, index) => (
          <div key={entry.oderId} className="flex items-center gap-2">
            <span className={`
              w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
              ${index === 0 ? "bg-yellow-500 text-black" :
                index === 1 ? "bg-zinc-400 text-black" :
                index === 2 ? "bg-orange-700 text-white" :
                "bg-zinc-800 text-zinc-400"
              }
            `}>
              {index + 1}
            </span>
            <span className="flex-1 text-sm text-white truncate">{entry.userName}</span>
            <span className="text-xs text-zinc-500">{getMetricValue(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
