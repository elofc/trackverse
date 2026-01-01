"use client";

import { TIERS, Tier } from "@/lib/rankings";
import { cn } from "@/lib/utils";

interface TierBadgeProps {
  tier: Tier;
  size?: "sm" | "md" | "lg";
  showEmoji?: boolean;
  showDescription?: boolean;
  className?: string;
}

export function TierBadge({ 
  tier, 
  size = "md", 
  showEmoji = true,
  showDescription = false,
  className 
}: TierBadgeProps) {
  const info = TIERS[tier];
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const isGodspeed = tier === 'GODSPEED';

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-bold border transition-all",
          info.bgColor,
          info.borderColor,
          isGodspeed ? "animate-pulse" : "",
          isGodspeed ? info.glowColor : "",
          sizeClasses[size]
        )}
      >
        {showEmoji && <span>{info.emoji}</span>}
        <span className={info.color}>{info.displayName}</span>
      </span>
      {showDescription && (
        <span className="text-xs text-white/40">{info.description}</span>
      )}
    </div>
  );
}

interface TierProgressProps {
  currentTier: Tier;
  points: number;
  className?: string;
}

export function TierProgress({ currentTier, points, className }: TierProgressProps) {
  const tierOrder: Tier[] = ['ROOKIE', 'JV', 'VARSITY', 'ELITE', 'ALL_STATE', 'NATIONAL', 'WORLD_CLASS', 'GODSPEED'];
  const currentIndex = tierOrder.indexOf(currentTier);
  const nextTier = currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] : null;
  
  const currentInfo = TIERS[currentTier];
  const nextInfo = nextTier ? TIERS[nextTier] : null;
  
  const progress = nextInfo 
    ? ((points - currentInfo.minPoints) / (nextInfo.minPoints - currentInfo.minPoints)) * 100
    : 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <TierBadge tier={currentTier} size="sm" />
        {nextTier && <TierBadge tier={nextTier} size="sm" />}
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500",
            currentTier === 'GODSPEED' 
              ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
              : `bg-gradient-to-r ${currentInfo.bgColor.replace('/20', '')}`
          )}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-white/40">
        <span>{points} pts</span>
        {nextInfo && <span>{nextInfo.minPoints} pts to {nextInfo.displayName}</span>}
      </div>
    </div>
  );
}

// All tiers display for reference
export function TierLegend({ className }: { className?: string }) {
  const tierOrder: Tier[] = ['ROOKIE', 'JV', 'VARSITY', 'ELITE', 'ALL_STATE', 'NATIONAL', 'WORLD_CLASS', 'GODSPEED'];
  
  return (
    <div className={cn("space-y-2", className)}>
      {tierOrder.map((tier) => {
        const info = TIERS[tier];
        return (
          <div 
            key={tier}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border transition-all",
              info.bgColor,
              info.borderColor,
              tier === 'GODSPEED' ? info.glowColor : ""
            )}
          >
            <span className="text-2xl">{info.emoji}</span>
            <div className="flex-1">
              <p className={cn("font-bold", info.color)}>{info.displayName}</p>
              <p className="text-xs text-white/50">{info.description}</p>
            </div>
            <span className="text-sm text-white/40">{info.minPoints}+ pts</span>
          </div>
        );
      })}
    </div>
  );
}
