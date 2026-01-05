"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Globe,
  Calendar,
  Clock,
  Target,
  ChevronRight,
  Check,
  Flame,
} from "lucide-react";
import { Challenge, ChallengeParticipant } from "@/lib/gamification/types";

type ChallengeCardProps = {
  challenge: Challenge;
  userProgress?: number;
  isJoined?: boolean;
  onJoin?: () => void;
  onClick?: () => void;
};

export function ChallengeCard({
  challenge,
  userProgress = 0,
  isJoined = false,
  onJoin,
  onClick,
}: ChallengeCardProps) {
  const isCompleted = userProgress >= 100;
  const isActive = challenge.status === "active";
  const isUpcoming = challenge.status === "upcoming";

  const getTypeIcon = () => {
    switch (challenge.type) {
      case "team":
        return <Users className="w-4 h-4" />;
      case "global":
        return <Globe className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getGoalText = () => {
    const goal = challenge.goal;
    switch (goal.type) {
      case "distance":
        return `Run ${goal.targetKm}km`;
      case "workout_count":
        return `Complete ${goal.target} workouts`;
      case "duration":
        return `Train for ${goal.targetMinutes} minutes`;
      case "pr_count":
        return `Set ${goal.target} PRs`;
      case "specific_workout":
        return `Complete ${goal.target} ${goal.workoutType} workouts`;
    }
  };

  const getTimeRemaining = () => {
    const end = new Date(challenge.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl border cursor-pointer
        ${isCompleted 
          ? "bg-green-500/10 border-green-500/30" 
          : isActive 
            ? "bg-zinc-900 border-zinc-800 hover:border-orange-500/50" 
            : "bg-zinc-900/50 border-zinc-800"
        }
      `}
    >
      {/* Header Image/Gradient */}
      <div className={`
        h-24 relative
        ${challenge.imageUrl 
          ? "" 
          : "bg-gradient-to-br from-orange-500/30 to-red-500/30"
        }
      `}>
        {challenge.imageUrl && (
          <img
            src={challenge.imageUrl}
            alt={challenge.name}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`
            text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1
            ${isActive 
              ? "bg-green-500/90 text-white" 
              : isUpcoming 
                ? "bg-yellow-500/90 text-black" 
                : "bg-zinc-700 text-zinc-300"
            }
          `}>
            {isActive && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
            {challenge.status.toUpperCase()}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full flex items-center gap-1">
            {getTypeIcon()}
            {challenge.type}
          </span>
        </div>

        {/* Completed Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-white mb-1">{challenge.name}</h3>
        <p className="text-zinc-400 text-sm line-clamp-2 mb-3">{challenge.description}</p>

        {/* Goal */}
        <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3">
          <Target className="w-4 h-4 text-orange-500" />
          {getGoalText()}
        </div>

        {/* Progress Bar (if joined) */}
        {isJoined && isActive && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-500">Progress</span>
              <span className="text-orange-500 font-medium">{Math.round(userProgress)}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${userProgress}%` }}
                className={`h-full rounded-full ${isCompleted ? "bg-green-500" : "bg-orange-500"}`}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {challenge.participantCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getTimeRemaining()}
            </span>
          </div>

          {!isJoined && isActive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onJoin?.();
              }}
              className="px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Join
            </button>
          )}

          {isJoined && !isCompleted && (
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          )}
        </div>
      </div>

      {/* Rewards Preview */}
      {challenge.rewards.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 text-xs">
            <Trophy className="w-3 h-3 text-yellow-500" />
            <span className="text-zinc-500">Rewards:</span>
            {challenge.rewards.slice(0, 2).map((reward, i) => (
              <span key={i} className="text-zinc-300">
                {reward.type === "xp" ? `${reward.value} XP` : reward.description}
                {i < Math.min(challenge.rewards.length - 1, 1) && ","}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Challenge Leaderboard
type ChallengeLeaderboardProps = {
  participants: ChallengeParticipant[];
  currentUserId?: string;
};

export function ChallengeLeaderboard({ participants, currentUserId }: ChallengeLeaderboardProps) {
  const sortedParticipants = [...participants].sort((a, b) => b.progress - a.progress);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Leaderboard
        </h3>
      </div>

      <div className="divide-y divide-zinc-800">
        {sortedParticipants.slice(0, 10).map((participant, index) => {
          const isCurrentUser = participant.oderId === currentUserId;
          const rank = index + 1;

          return (
            <div
              key={participant.oderId}
              className={`
                flex items-center gap-3 p-3
                ${isCurrentUser ? "bg-orange-500/10" : ""}
              `}
            >
              {/* Rank */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${rank === 1 ? "bg-yellow-500 text-black" :
                  rank === 2 ? "bg-zinc-400 text-black" :
                  rank === 3 ? "bg-orange-700 text-white" :
                  "bg-zinc-800 text-zinc-400"
                }
              `}>
                {rank}
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold">
                {participant.userName.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <div className="flex-1">
                <span className={`font-medium ${isCurrentUser ? "text-orange-500" : "text-white"}`}>
                  {participant.userName}
                  {isCurrentUser && " (You)"}
                </span>
              </div>

              {/* Progress */}
              <div className="text-right">
                <span className="text-orange-500 font-bold">{Math.round(participant.progress)}%</span>
                {participant.completedAt && (
                  <span className="text-green-500 text-xs block">✓ Complete</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Active Challenges Summary
type ActiveChallengesProps = {
  challenges: Array<Challenge & { userProgress: number }>;
};

export function ActiveChallengesSummary({ challenges }: ActiveChallengesProps) {
  if (challenges.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
        <Trophy className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
        <h3 className="font-bold text-white mb-1">No Active Challenges</h3>
        <p className="text-zinc-500 text-sm">Join a challenge to compete with others!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg"
        >
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-sm truncate">{challenge.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${challenge.userProgress}%` }}
                />
              </div>
              <span className="text-xs text-orange-500 font-medium">
                {Math.round(challenge.userProgress)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
