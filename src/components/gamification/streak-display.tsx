"use client";

import { motion } from "framer-motion";
import { Flame, Calendar, TrendingUp, Zap } from "lucide-react";
import { Streak } from "@/lib/gamification/types";

type StreakDisplayProps = {
  streak: Streak;
  size?: "sm" | "md" | "lg";
};

export function StreakDisplay({ streak, size = "md" }: StreakDisplayProps) {
  const isActive = streak.isActive && streak.currentCount > 0;
  
  const sizeClasses = {
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`
      ${sizeClasses[size]} rounded-xl border
      ${isActive 
        ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30" 
        : "bg-zinc-900/50 border-zinc-800"
      }
    `}>
      <div className="flex items-center gap-3">
        <div className={`
          ${size === "lg" ? "w-16 h-16" : size === "md" ? "w-12 h-12" : "w-8 h-8"}
          rounded-xl flex items-center justify-center
          ${isActive ? "bg-orange-500/30" : "bg-zinc-800"}
        `}>
          <Flame className={`${iconSizes[size]} ${isActive ? "text-orange-500 fire-animate" : "text-zinc-500"}`} />
        </div>
        
        <div>
          <div className="flex items-baseline gap-2">
            <span className={`${textSizes[size]} font-black ${isActive ? "text-orange-500" : "text-zinc-500"}`}>
              {streak.currentCount}
            </span>
            <span className={`${size === "sm" ? "text-xs" : "text-sm"} text-zinc-400`}>
              day{streak.currentCount !== 1 ? "s" : ""}
            </span>
          </div>
          {size !== "sm" && (
            <p className="text-xs text-zinc-500">
              Best: {streak.longestCount} days
            </p>
          )}
        </div>
      </div>

      {/* Streak Calendar Preview */}
      {size === "lg" && (
        <div className="mt-4 flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => {
            const dayIndex = 6 - i;
            const isCompleted = dayIndex < streak.currentCount;
            return (
              <div
                key={i}
                className={`
                  flex-1 h-2 rounded-full
                  ${isCompleted ? "bg-orange-500" : "bg-zinc-800"}
                `}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// Streak Card with more details
type StreakCardProps = {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakType: string;
};

export function StreakCard({ currentStreak, longestStreak, lastActivityDate, streakType }: StreakCardProps) {
  const isActive = currentStreak > 0;
  const lastDate = new Date(lastActivityDate);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  const streakAtRisk = diffDays >= 1 && isActive;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className={`
        p-4 border-b border-zinc-800
        ${isActive ? "bg-gradient-to-r from-orange-500/20 to-transparent" : ""}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              ${isActive ? "bg-orange-500/30" : "bg-zinc-800"}
            `}>
              <Flame className={`w-6 h-6 ${isActive ? "text-orange-500 fire-animate" : "text-zinc-500"}`} />
            </div>
            <div>
              <h3 className="font-bold text-white capitalize">{streakType} Streak</h3>
              <p className="text-zinc-500 text-sm">
                {isActive ? "Keep it going!" : "Start your streak today"}
              </p>
            </div>
          </div>
          
          {streakAtRisk && (
            <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
              <span className="text-yellow-500 text-xs font-medium">At Risk!</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-zinc-500">Current</span>
          </div>
          <span className="text-3xl font-black text-orange-500">{currentStreak}</span>
          <span className="text-zinc-500 text-sm ml-1">days</span>
        </div>
        
        <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-xs text-zinc-500">Best</span>
          </div>
          <span className="text-3xl font-black text-green-500">{longestStreak}</span>
          <span className="text-zinc-500 text-sm ml-1">days</span>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500">This Week</span>
          <span className="text-xs text-zinc-500">{Math.min(currentStreak, 7)}/7</span>
        </div>
        <div className="flex gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => {
            const isCompleted = i < Math.min(currentStreak, 7);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`
                    w-full h-8 rounded-lg flex items-center justify-center
                    ${isCompleted ? "bg-orange-500" : "bg-zinc-800"}
                  `}
                >
                  {isCompleted && <Flame className="w-4 h-4 text-white" />}
                </div>
                <span className="text-xs text-zinc-500">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestones */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-zinc-500" />
          <span className="text-xs text-zinc-500">Next Milestones</span>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30, 60, 90].filter(m => m > currentStreak).slice(0, 3).map((milestone) => (
            <div
              key={milestone}
              className="flex-1 p-2 bg-zinc-800/50 rounded-lg text-center"
            >
              <span className="text-white font-bold">{milestone}</span>
              <span className="text-zinc-500 text-xs block">days</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
