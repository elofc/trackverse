"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Flame,
  Star,
  Gift,
  Target,
  Medal,
  TrendingUp,
  Users,
  Zap,
  ChevronRight,
  X,
} from "lucide-react";
import { Navbar } from "@/components/trackverse/navbar";
import { BadgeCard, BadgeGrid, FeaturedBadge } from "@/components/gamification/badge-card";
import { StreakCard } from "@/components/gamification/streak-display";
import { XPLevelDisplay, LevelsOverview } from "@/components/gamification/xp-level";
import { ChallengeCard, ActiveChallengesSummary } from "@/components/gamification/challenge-card";
import { ReferralCard } from "@/components/gamification/referral-card";
import { Leaderboard, MiniLeaderboard } from "@/components/gamification/leaderboard";
import { BADGES, getBadgesByCategory, getBadgeById } from "@/lib/gamification/badges";
import { Badge, UserBadge, Challenge, LeaderboardEntry, Referral } from "@/lib/gamification/types";

// Mock data
const mockUserBadges: UserBadge[] = [
  { id: "ub1", oderId: "u1", badgeId: "first_workout", earnedAt: "2025-09-15T10:00:00Z" },
  { id: "ub2", oderId: "u1", badgeId: "week_warrior", earnedAt: "2025-09-22T10:00:00Z" },
  { id: "ub3", oderId: "u1", badgeId: "first_race", earnedAt: "2025-10-01T14:00:00Z" },
  { id: "ub4", oderId: "u1", badgeId: "on_the_board", earnedAt: "2025-10-15T10:00:00Z" },
  { id: "ub5", oderId: "u1", badgeId: "team_player", earnedAt: "2025-09-10T10:00:00Z" },
  { id: "ub6", oderId: "u1", badgeId: "podium_finish", earnedAt: "2025-11-20T16:00:00Z" },
  { id: "ub7", oderId: "u1", badgeId: "month_monster", earnedAt: "2025-12-15T10:00:00Z" },
];

const mockChallenges: (Challenge & { userProgress: number })[] = [
  {
    id: "c1",
    name: "January Mileage Madness",
    description: "Run 100km this month to earn exclusive rewards",
    type: "global",
    status: "active",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-01-31T23:59:59Z",
    goal: { type: "distance", targetKm: 100 },
    rewards: [
      { type: "badge", value: "mileage_madness", description: "Mileage Madness Badge" },
      { type: "xp", value: 500, description: "500 XP" },
    ],
    participantCount: 1234,
    userProgress: 68,
  },
  {
    id: "c2",
    name: "Speed Week",
    description: "Complete 5 sprint workouts this week",
    type: "team",
    status: "active",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-01-07T23:59:59Z",
    goal: { type: "specific_workout", workoutType: "sprint", target: 5 },
    rewards: [
      { type: "xp", value: 200, description: "200 XP" },
    ],
    participantCount: 89,
    teamId: "team1",
    userProgress: 60,
  },
  {
    id: "c3",
    name: "PR Hunter",
    description: "Set 3 personal records this month",
    type: "individual",
    status: "active",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-01-31T23:59:59Z",
    goal: { type: "pr_count", target: 3 },
    rewards: [
      { type: "badge", value: "pr_hunter", description: "PR Hunter Badge" },
      { type: "xp", value: 300, description: "300 XP" },
    ],
    participantCount: 567,
    userProgress: 33,
  },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, oderId: "u2", userName: "SpeedDemon", value: 12500, change: 0, tier: "ELITE" },
  { rank: 2, oderId: "u3", userName: "TrackStar99", value: 11200, change: 2, tier: "ELITE" },
  { rank: 3, oderId: "u4", userName: "RunnerX", value: 10800, change: -1, tier: "PRO" },
  { rank: 4, oderId: "u5", userName: "FlashFeet", value: 9500, change: 1, tier: "PRO" },
  { rank: 5, oderId: "u1", userName: "You", value: 8750, change: 3, tier: "ADVANCED" },
  { rank: 6, oderId: "u6", userName: "BoltJr", value: 8200, change: -2, tier: "ADVANCED" },
  { rank: 7, oderId: "u7", userName: "SprintKing", value: 7800, change: 0, tier: "ADVANCED" },
  { rank: 8, oderId: "u8", userName: "FastLane", value: 7500, change: 1, tier: "COMPETITOR" },
  { rank: 9, oderId: "u9", userName: "TrackLife", value: 7200, change: -1, tier: "COMPETITOR" },
  { rank: 10, oderId: "u10", userName: "SpeedForce", value: 6900, change: 0, tier: "COMPETITOR" },
];

const mockReferrals: Referral[] = [
  { id: "r1", referrerId: "u1", referredId: "u11", referredEmail: "friend1@email.com", status: "rewarded", referralCode: "TVUSER123", createdAt: "2025-12-01T10:00:00Z", qualifiedAt: "2025-12-05T10:00:00Z", rewardedAt: "2025-12-05T10:00:00Z" },
  { id: "r2", referrerId: "u1", referredId: "u12", referredEmail: "friend2@email.com", status: "rewarded", referralCode: "TVUSER123", createdAt: "2025-12-10T10:00:00Z", qualifiedAt: "2025-12-12T10:00:00Z", rewardedAt: "2025-12-12T10:00:00Z" },
  { id: "r3", referrerId: "u1", referredId: "", referredEmail: "friend3@email.com", status: "pending", referralCode: "TVUSER123", createdAt: "2026-01-02T10:00:00Z" },
];

type Tab = "badges" | "challenges" | "leaderboard" | "referrals";

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("badges");
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [badgeCategory, setBadgeCategory] = useState<string>("all");

  // Mock user stats
  const userStats = {
    totalXP: 8750,
    currentLevel: 8,
    currentStreak: 12,
    longestStreak: 45,
    referralCode: "TVUSER123",
    referralCount: 2,
  };

  const getBadgeProgress = (badgeId: string): number => {
    const badge = getBadgeById(badgeId);
    if (!badge) return 0;
    if (mockUserBadges.some(ub => ub.badgeId === badgeId)) return 100;

    // Mock progress calculation
    const req = badge.requirement;
    switch (req.type) {
      case "workout_count": return Math.min((45 / req.count) * 100, 99);
      case "streak_days": return Math.min((userStats.longestStreak / req.days) * 100, 99);
      case "total_distance": return Math.min((250 / req.distanceKm) * 100, 99);
      case "pr_count": return Math.min((6 / req.count) * 100, 99);
      case "meet_count": return Math.min((8 / req.count) * 100, 99);
      case "referral_count": return Math.min((userStats.referralCount / req.count) * 100, 99);
      default: return 0;
    }
  };

  const filteredBadges = badgeCategory === "all" 
    ? BADGES.filter(b => !b.secret || mockUserBadges.some(ub => ub.badgeId === b.id))
    : getBadgesByCategory(badgeCategory as Badge["category"]);

  const earnedCount = mockUserBadges.length;
  const totalBadges = BADGES.filter(b => !b.secret).length;

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: "badges", label: "Badges", icon: <Medal className="w-4 h-4" /> },
    { id: "challenges", label: "Challenges", icon: <Target className="w-4 h-4" /> },
    { id: "leaderboard", label: "Leaderboard", icon: <Trophy className="w-4 h-4" /> },
    { id: "referrals", label: "Referrals", icon: <Gift className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-black text-white">Achievements</h1>
          </div>
          <p className="text-zinc-400">Track your progress, earn badges, and compete with others</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <XPLevelDisplay
            totalXP={userStats.totalXP}
            currentLevel={userStats.currentLevel}
            size="md"
          />
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/30 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500 fire-animate" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-orange-500">{userStats.currentStreak}</span>
                  <span className="text-zinc-400">day streak</span>
                </div>
                <p className="text-xs text-zinc-500">Best: {userStats.longestStreak} days</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/30 flex items-center justify-center">
                <Medal className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-yellow-500">{earnedCount}</span>
                  <span className="text-zinc-400">/ {totalBadges} badges</span>
                </div>
                <p className="text-xs text-zinc-500">{Math.round((earnedCount / totalBadges) * 100)}% complete</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap
                ${activeTab === tab.id
                  ? "bg-orange-500 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "badges" && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Category Filter */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {[
                  { id: "all", label: "All" },
                  { id: "training", label: "🏃 Training" },
                  { id: "competition", label: "🏆 Competition" },
                  { id: "ranking", label: "📈 Ranking" },
                  { id: "social", label: "👥 Social" },
                  { id: "special", label: "⭐ Special" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setBadgeCategory(cat.id)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                      ${badgeCategory === cat.id
                        ? "bg-orange-500 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }
                    `}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Badge Grid */}
              <BadgeGrid
                badges={filteredBadges}
                userBadges={mockUserBadges}
                getProgress={getBadgeProgress}
                onBadgeClick={setSelectedBadge}
              />
            </motion.div>
          )}

          {activeTab === "challenges" && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">Active Challenges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      userProgress={challenge.userProgress}
                      isJoined={true}
                    />
                  ))}
                </div>
              </div>

              <div>
                <StreakCard
                  currentStreak={userStats.currentStreak}
                  longestStreak={userStats.longestStreak}
                  lastActivityDate={new Date().toISOString()}
                  streakType="workout"
                />
              </div>
            </motion.div>
          )}

          {activeTab === "leaderboard" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Leaderboard
                entries={mockLeaderboard}
                type="weekly"
                metric="xp"
                currentUserId="u1"
              />
            </motion.div>
          )}

          {activeTab === "referrals" && (
            <motion.div
              key="referrals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto"
            >
              <ReferralCard
                referralCode={userStats.referralCode}
                referralCount={userStats.referralCount}
                referrals={mockReferrals}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge Detail Modal */}
        <AnimatePresence>
          {selectedBadge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setSelectedBadge(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>

                <FeaturedBadge
                  badge={selectedBadge}
                  earnedAt={mockUserBadges.find(ub => ub.badgeId === selectedBadge.id)?.earnedAt}
                />

                {!mockUserBadges.some(ub => ub.badgeId === selectedBadge.id) && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-500">Progress</span>
                      <span className="text-orange-500">{Math.round(getBadgeProgress(selectedBadge.id))}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${getBadgeProgress(selectedBadge.id)}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
