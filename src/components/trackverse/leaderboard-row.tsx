"use client";

import { LeaderboardEntry, TIERS } from "@/lib/rankings";
import { TierBadge } from "./tier-badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
  showSchool?: boolean;
  onClick?: () => void;
}

export function LeaderboardRow({ 
  entry, 
  isCurrentUser = false,
  showSchool = true,
  onClick 
}: LeaderboardRowProps) {
  const tierInfo = TIERS[entry.tier];
  const isGodspeed = entry.tier === 'GODSPEED';
  const isTopThree = entry.rank <= 3;

  const getRankDisplay = () => {
    if (entry.rank === 1) return { emoji: "🥇", color: "text-yellow-400" };
    if (entry.rank === 2) return { emoji: "🥈", color: "text-gray-300" };
    if (entry.rank === 3) return { emoji: "🥉", color: "text-amber-600" };
    return { emoji: null, color: "text-white/50" };
  };

  const rankDisplay = getRankDisplay();

  const getRankChangeIcon = () => {
    switch (entry.rankChange.direction) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      case 'new':
        return <Sparkles className="h-3 w-3 text-orange-500" />;
      default:
        return <Minus className="h-3 w-3 text-white/30" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-4 transition-all cursor-pointer",
        "hover:bg-white/5",
        isCurrentUser && "bg-orange-500/10 border-l-2 border-orange-500",
        isGodspeed && "bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10",
        isTopThree && entry.rank === 1 && "bg-gradient-to-r from-yellow-500/10 to-transparent"
      )}
    >
      {/* Rank */}
      <div className="w-12 text-center">
        {rankDisplay.emoji ? (
          <span className="text-2xl">{rankDisplay.emoji}</span>
        ) : (
          <span className={cn("text-2xl font-black", rankDisplay.color)}>
            {entry.rank}
          </span>
        )}
      </div>

      {/* Athlete Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn(
            "font-bold truncate",
            isGodspeed && "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
          )}>
            {entry.athleteName}
          </p>
          {isGodspeed && (
            <span className="text-xs animate-pulse">⚡</span>
          )}
        </div>
        {showSchool && (
          <p className="text-sm text-white/40 truncate">{entry.school}</p>
        )}
      </div>

      {/* Performance */}
      <div className="text-right">
        <p className={cn(
          "text-lg font-black font-mono",
          isGodspeed 
            ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
            : "text-yellow-400"
        )}>
          {entry.formattedPerformance}
        </p>
        <div className="flex items-center justify-end gap-2">
          <TierBadge tier={entry.tier} size="sm" showEmoji={true} />
        </div>
      </div>

      {/* Rank Change */}
      <div className="w-12 text-right">
        <div className="flex items-center justify-end gap-1">
          {getRankChangeIcon()}
          <span className={cn(
            "text-xs font-bold",
            entry.rankChange.direction === 'up' && "text-green-500",
            entry.rankChange.direction === 'down' && "text-red-500",
            entry.rankChange.direction === 'new' && "text-orange-500",
            entry.rankChange.direction === 'same' && "text-white/30"
          )}>
            {entry.rankChange.display}
          </span>
        </div>
      </div>
    </div>
  );
}

// Compact version for sidebar/widgets
export function LeaderboardRowCompact({ 
  entry,
  onClick 
}: { 
  entry: LeaderboardEntry;
  onClick?: () => void;
}) {
  const isGodspeed = entry.tier === 'GODSPEED';

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer",
        "hover:bg-white/5",
        isGodspeed && "bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-red-500/5"
      )}
    >
      <span className={cn(
        "w-6 text-center font-bold text-sm",
        entry.rank <= 3 ? "text-yellow-400" : "text-white/40"
      )}>
        {entry.rank}
      </span>
      <span className="flex-1 truncate text-sm font-medium">{entry.athleteName}</span>
      <span className={cn(
        "font-mono text-sm font-bold",
        isGodspeed 
          ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
          : "text-yellow-400"
      )}>
        {entry.formattedPerformance}
      </span>
      <span className="text-sm">{TIERS[entry.tier].emoji}</span>
    </div>
  );
}
