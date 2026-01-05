"use client";

import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { Badge, UserBadge } from "@/lib/gamification/types";
import { getRarityColor, getRarityBorder } from "@/lib/gamification/badges";

type BadgeCardProps = {
  badge: Badge;
  userBadge?: UserBadge;
  progress?: number;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  onClick?: () => void;
};

export function BadgeCard({
  badge,
  userBadge,
  progress = 0,
  size = "md",
  showProgress = true,
  onClick,
}: BadgeCardProps) {
  const isEarned = !!userBadge;
  const isSecret = badge.secret && !isEarned;

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const iconSizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative flex flex-col items-center cursor-pointer
        ${onClick ? "cursor-pointer" : "cursor-default"}
      `}
    >
      {/* Badge Icon */}
      <div
        className={`
          ${sizeClasses[size]} rounded-2xl border-2 flex items-center justify-center
          transition-all duration-300
          ${isEarned 
            ? `${getRarityBorder(badge.rarity)} bg-gradient-to-br from-zinc-800 to-zinc-900` 
            : "border-zinc-700 bg-zinc-900/50"
          }
          ${!isEarned && "grayscale opacity-50"}
        `}
      >
        {isSecret ? (
          <Lock className="w-8 h-8 text-zinc-600" />
        ) : (
          <span className={`${iconSizes[size]} ${!isEarned && "opacity-50"}`}>
            {badge.icon}
          </span>
        )}

        {/* Earned Checkmark */}
        {isEarned && (
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Rarity Glow */}
        {isEarned && badge.rarity === "legendary" && (
          <div className="absolute inset-0 rounded-2xl bg-orange-500/20 animate-pulse" />
        )}
      </div>

      {/* Badge Name */}
      <div className="mt-2 text-center">
        <p className={`font-medium ${isEarned ? "text-white" : "text-zinc-500"} ${size === "sm" ? "text-xs" : "text-sm"}`}>
          {isSecret ? "???" : badge.name}
        </p>
        
        {/* Rarity Tag */}
        {!isSecret && size !== "sm" && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${getRarityColor(badge.rarity)}`}>
            {badge.rarity}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && !isEarned && !isSecret && progress > 0 && size !== "sm" && (
        <div className="w-full mt-2">
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-orange-500 rounded-full"
            />
          </div>
          <p className="text-xs text-zinc-500 text-center mt-1">{Math.round(progress)}%</p>
        </div>
      )}
    </motion.div>
  );
}

// Badge Grid Component
type BadgeGridProps = {
  badges: Badge[];
  userBadges: UserBadge[];
  getProgress?: (badgeId: string) => number;
  onBadgeClick?: (badge: Badge) => void;
};

export function BadgeGrid({ badges, userBadges, getProgress, onBadgeClick }: BadgeGridProps) {
  const userBadgeMap = new Map(userBadges.map(ub => [ub.badgeId, ub]));

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {badges.map((badge) => (
        <BadgeCard
          key={badge.id}
          badge={badge}
          userBadge={userBadgeMap.get(badge.id)}
          progress={getProgress?.(badge.id) || 0}
          onClick={() => onBadgeClick?.(badge)}
        />
      ))}
    </div>
  );
}

// Featured Badge Display
type FeaturedBadgeProps = {
  badge: Badge;
  earnedAt?: string;
};

export function FeaturedBadge({ badge, earnedAt }: FeaturedBadgeProps) {
  return (
    <div className={`
      relative p-4 rounded-xl border-2 ${getRarityBorder(badge.rarity)}
      bg-gradient-to-br from-zinc-800/50 to-zinc-900/50
    `}>
      <div className="flex items-center gap-4">
        <div className="text-5xl">{badge.icon}</div>
        <div>
          <h3 className="font-bold text-white">{badge.name}</h3>
          <p className="text-zinc-400 text-sm">{badge.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getRarityColor(badge.rarity)}`}>
              {badge.rarity}
            </span>
            <span className="text-xs text-orange-500">+{badge.xpReward} XP</span>
          </div>
          {earnedAt && (
            <p className="text-xs text-zinc-500 mt-1">
              Earned {new Date(earnedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
