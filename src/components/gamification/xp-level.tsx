"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp, Zap, ChevronUp } from "lucide-react";
import { LEVELS } from "@/lib/gamification/types";

type XPLevelDisplayProps = {
  totalXP: number;
  currentLevel: number;
  size?: "sm" | "md" | "lg";
};

export function XPLevelDisplay({ totalXP, currentLevel, size = "md" }: XPLevelDisplayProps) {
  const levelData = LEVELS.find(l => l.level === currentLevel) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === currentLevel + 1);
  
  const xpInLevel = totalXP - levelData.minXP;
  const xpForLevel = levelData.maxXP - levelData.minXP;
  const progress = Math.min((xpInLevel / xpForLevel) * 100, 100);

  const sizeClasses = {
    sm: { container: "p-2", icon: "w-8 h-8", text: "text-sm", progress: "h-1" },
    md: { container: "p-4", icon: "w-12 h-12", text: "text-lg", progress: "h-2" },
    lg: { container: "p-6", icon: "w-16 h-16", text: "text-2xl", progress: "h-3" },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`${classes.container} bg-zinc-900 border border-zinc-800 rounded-xl`}>
      <div className="flex items-center gap-4">
        {/* Level Badge */}
        <div className={`
          ${classes.icon} rounded-xl bg-gradient-to-br from-orange-500 to-red-600
          flex items-center justify-center shadow-lg shadow-orange-500/30
        `}>
          <span className={`${classes.text} font-black text-white`}>{currentLevel}</span>
        </div>

        <div className="flex-1">
          {/* Title */}
          <div className="flex items-center gap-2">
            <span className={`${classes.text} font-bold text-white`}>{levelData.title}</span>
            {nextLevel && size !== "sm" && (
              <span className="text-xs text-zinc-500">→ {nextLevel.title}</span>
            )}
          </div>

          {/* XP Progress */}
          <div className="mt-2">
            <div className={`${classes.progress} bg-zinc-800 rounded-full overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              />
            </div>
            {size !== "sm" && (
              <div className="flex justify-between mt-1">
                <span className="text-xs text-zinc-500">{totalXP.toLocaleString()} XP</span>
                <span className="text-xs text-zinc-500">
                  {nextLevel ? `${(levelData.maxXP - totalXP).toLocaleString()} to Level ${currentLevel + 1}` : "MAX LEVEL"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact XP display for navbar/headers
type XPBadgeProps = {
  level: number;
  title: string;
  progress: number;
};

export function XPBadge({ level, title, progress }: XPBadgeProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{level}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-white leading-none">{title}</span>
        <div className="w-12 h-1 bg-zinc-800 rounded-full mt-0.5">
          <div
            className="h-full bg-orange-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// XP Gain Animation
type XPGainProps = {
  amount: number;
  source: string;
  onComplete?: () => void;
};

export function XPGainAnimation({ amount, source, onComplete }: XPGainProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      onAnimationComplete={onComplete}
      className="fixed bottom-24 right-4 z-50"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-orange-500 rounded-lg shadow-lg shadow-orange-500/30">
        <Zap className="w-5 h-5 text-white" />
        <span className="text-white font-bold">+{amount} XP</span>
        <span className="text-orange-200 text-sm">{source}</span>
      </div>
    </motion.div>
  );
}

// Level Up Celebration
type LevelUpProps = {
  newLevel: number;
  newTitle: string;
  onClose: () => void;
};

export function LevelUpCelebration({ newLevel, newTitle, onClose }: LevelUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Effects */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-48 h-48 mx-auto"
          >
            {[...Array(8)].map((_, i) => (
              <Star
                key={i}
                className="absolute w-6 h-6 text-yellow-500"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 45}deg) translateY(-80px)`,
                }}
              />
            ))}
          </motion.div>

          {/* Level Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="relative z-10 w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-500/50"
          >
            <div className="text-center">
              <ChevronUp className="w-8 h-8 text-white mx-auto" />
              <span className="text-4xl font-black text-white">{newLevel}</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <h2 className="text-3xl font-black text-white mb-2">LEVEL UP!</h2>
          <p className="text-xl text-orange-500 font-bold">{newTitle}</p>
          <p className="text-zinc-400 mt-2">Keep pushing your limits!</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onClose}
          className="mt-8 px-8 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// All Levels Display
export function LevelsOverview({ currentLevel }: { currentLevel: number }) {
  return (
    <div className="space-y-2">
      {LEVELS.map((level) => {
        const isCurrentLevel = level.level === currentLevel;
        const isUnlocked = level.level <= currentLevel;
        
        return (
          <div
            key={level.level}
            className={`
              flex items-center gap-3 p-3 rounded-lg border
              ${isCurrentLevel 
                ? "bg-orange-500/20 border-orange-500/50" 
                : isUnlocked 
                  ? "bg-zinc-800/50 border-zinc-700" 
                  : "bg-zinc-900/50 border-zinc-800 opacity-50"
              }
            `}
          >
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center font-bold
              ${isCurrentLevel 
                ? "bg-orange-500 text-white" 
                : isUnlocked 
                  ? "bg-zinc-700 text-white" 
                  : "bg-zinc-800 text-zinc-500"
              }
            `}>
              {level.level}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${isUnlocked ? "text-white" : "text-zinc-500"}`}>
                  {level.title}
                </span>
                {isCurrentLevel && (
                  <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>
              <span className="text-xs text-zinc-500">
                {level.minXP.toLocaleString()} - {level.maxXP === Infinity ? "∞" : level.maxXP.toLocaleString()} XP
              </span>
            </div>
            {level.perks && level.perks.length > 0 && (
              <div className="text-xs text-orange-400">
                {level.perks.length} perks
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
