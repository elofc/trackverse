"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Copy,
  Check,
  Share2,
  Users,
  ChevronRight,
  Star,
} from "lucide-react";
import { Referral, ReferralReward } from "@/lib/gamification/types";

const REFERRAL_REWARDS: ReferralReward[] = [
  { milestone: 1, reward: { type: "xp", value: 150, description: "150 XP" } },
  { milestone: 3, reward: { type: "badge", value: "recruiter_bronze", description: "Bronze Recruiter Badge" } },
  { milestone: 5, reward: { type: "xp", value: 500, description: "500 XP" } },
  { milestone: 10, reward: { type: "badge", value: "ambassador", description: "Ambassador Badge" } },
  { milestone: 25, reward: { type: "title", value: "Community Builder", description: "Exclusive Title" } },
  { milestone: 50, reward: { type: "feature", value: "featured_profile", description: "Featured Profile" } },
];

type ReferralCardProps = {
  referralCode: string;
  referralCount: number;
  referrals: Referral[];
};

export function ReferralCard({ referralCode, referralCount, referrals }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://trackverse.app/join?ref=${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join TrackVerse",
          text: "Track your athletic journey with me on TrackVerse!",
          url: referralLink,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      copyToClipboard();
    }
  };

  const nextReward = REFERRAL_REWARDS.find(r => r.milestone > referralCount);
  const progressToNext = nextReward 
    ? (referralCount / nextReward.milestone) * 100 
    : 100;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/30 flex items-center justify-center">
            <Gift className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Invite Friends</h3>
            <p className="text-zinc-400 text-sm">Earn rewards for every friend who joins</p>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="p-4">
        <label className="text-xs text-zinc-500 mb-2 block">Your Referral Link</label>
        <div className="flex gap-2">
          <div className="flex-1 bg-zinc-800 rounded-lg px-3 py-2 font-mono text-sm text-zinc-300 truncate">
            {referralLink}
          </div>
          <button
            onClick={copyToClipboard}
            className={`
              px-3 py-2 rounded-lg transition-colors flex items-center gap-1
              ${copied ? "bg-green-500 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}
            `}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={shareReferral}
            className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-zinc-400">Friends Joined</span>
          </div>
          <span className="text-2xl font-bold text-white">{referralCount}</span>
        </div>
      </div>

      {/* Next Reward Progress */}
      {nextReward && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500">Next Reward</span>
            <span className="text-xs text-purple-400">
              {referralCount}/{nextReward.milestone} referrals
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-zinc-300">{nextReward.reward.description}</span>
          </div>
        </div>
      )}

      {/* Rewards Roadmap */}
      <div className="px-4 pb-4">
        <h4 className="text-xs text-zinc-500 mb-3">Rewards Roadmap</h4>
        <div className="space-y-2">
          {REFERRAL_REWARDS.map((reward, index) => {
            const isUnlocked = referralCount >= reward.milestone;
            const isCurrent = !isUnlocked && (index === 0 || referralCount >= REFERRAL_REWARDS[index - 1].milestone);

            return (
              <div
                key={reward.milestone}
                className={`
                  flex items-center gap-3 p-2 rounded-lg
                  ${isUnlocked ? "bg-purple-500/20" : isCurrent ? "bg-zinc-800" : "bg-zinc-800/30"}
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${isUnlocked ? "bg-purple-500 text-white" : "bg-zinc-700 text-zinc-400"}
                `}>
                  {isUnlocked ? <Check className="w-4 h-4" /> : reward.milestone}
                </div>
                <div className="flex-1">
                  <span className={`text-sm ${isUnlocked ? "text-purple-400" : "text-zinc-400"}`}>
                    {reward.reward.description}
                  </span>
                </div>
                {isUnlocked && (
                  <span className="text-xs text-green-400">Unlocked!</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Referrals */}
      {referrals.length > 0 && (
        <div className="px-4 pb-4">
          <h4 className="text-xs text-zinc-500 mb-3">Recent Referrals</h4>
          <div className="space-y-2">
            {referrals.slice(0, 3).map((referral) => (
              <div
                key={referral.id}
                className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  {referral.referredEmail.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white truncate block">
                    {referral.referredEmail}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {referral.status === "rewarded" ? "Joined" : "Pending"}
                  </span>
                </div>
                {referral.status === "rewarded" && (
                  <span className="text-xs text-green-400">+150 XP</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact referral prompt
export function ReferralPrompt({ referralCode }: { referralCode: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(`https://trackverse.app/join?ref=${referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
      <Gift className="w-5 h-5 text-purple-400" />
      <div className="flex-1">
        <span className="text-sm text-white">Invite friends & earn rewards!</span>
      </div>
      <button
        onClick={copyCode}
        className={`
          px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
          ${copied ? "bg-green-500 text-white" : "bg-purple-500 text-white hover:bg-purple-600"}
        `}
      >
        {copied ? "Copied!" : "Share"}
      </button>
    </div>
  );
}
