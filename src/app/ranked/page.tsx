"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Flame,
  Target,
  Zap,
  Crown,
  Swords,
  Shield,
  Star,
  TrendingUp,
  Clock,
  Users,
  ChevronRight,
  Lock,
  Unlock,
  Award,
  Medal,
  Sparkles,
  Timer,
  ArrowUp,
  Gift,
  Calendar,
} from "lucide-react";

// Rank tiers with XP thresholds (based on performance times converted to XP)
const RANK_TIERS = [
  { name: "Bronze V", icon: "🥉", minXP: 0, maxXP: 1000, color: "#CD7F32", division: 5 },
  { name: "Bronze IV", icon: "🥉", minXP: 1000, maxXP: 2000, color: "#CD7F32", division: 4 },
  { name: "Bronze III", icon: "🥉", minXP: 2000, maxXP: 3000, color: "#CD7F32", division: 3 },
  { name: "Bronze II", icon: "🥉", minXP: 3000, maxXP: 4000, color: "#CD7F32", division: 2 },
  { name: "Bronze I", icon: "🥉", minXP: 4000, maxXP: 5000, color: "#CD7F32", division: 1 },
  { name: "Silver V", icon: "🥈", minXP: 5000, maxXP: 6500, color: "#C0C0C0", division: 5 },
  { name: "Silver IV", icon: "🥈", minXP: 6500, maxXP: 8000, color: "#C0C0C0", division: 4 },
  { name: "Silver III", icon: "🥈", minXP: 8000, maxXP: 9500, color: "#C0C0C0", division: 3 },
  { name: "Silver II", icon: "🥈", minXP: 9500, maxXP: 11000, color: "#C0C0C0", division: 2 },
  { name: "Silver I", icon: "🥈", minXP: 11000, maxXP: 12500, color: "#C0C0C0", division: 1 },
  { name: "Gold V", icon: "🥇", minXP: 12500, maxXP: 14500, color: "#FFD700", division: 5 },
  { name: "Gold IV", icon: "🥇", minXP: 14500, maxXP: 16500, color: "#FFD700", division: 4 },
  { name: "Gold III", icon: "🥇", minXP: 16500, maxXP: 18500, color: "#FFD700", division: 3 },
  { name: "Gold II", icon: "🥇", minXP: 18500, maxXP: 20500, color: "#FFD700", division: 2 },
  { name: "Gold I", icon: "🥇", minXP: 20500, maxXP: 22500, color: "#FFD700", division: 1 },
  { name: "Platinum V", icon: "💎", minXP: 22500, maxXP: 25000, color: "#00CED1", division: 5 },
  { name: "Platinum IV", icon: "💎", minXP: 25000, maxXP: 27500, color: "#00CED1", division: 4 },
  { name: "Platinum III", icon: "💎", minXP: 27500, maxXP: 30000, color: "#00CED1", division: 3 },
  { name: "Platinum II", icon: "💎", minXP: 30000, maxXP: 32500, color: "#00CED1", division: 2 },
  { name: "Platinum I", icon: "💎", minXP: 32500, maxXP: 35000, color: "#00CED1", division: 1 },
  { name: "Diamond V", icon: "💠", minXP: 35000, maxXP: 38000, color: "#B9F2FF", division: 5 },
  { name: "Diamond IV", icon: "💠", minXP: 38000, maxXP: 41000, color: "#B9F2FF", division: 4 },
  { name: "Diamond III", icon: "💠", minXP: 41000, maxXP: 44000, color: "#B9F2FF", division: 3 },
  { name: "Diamond II", icon: "💠", minXP: 44000, maxXP: 47000, color: "#B9F2FF", division: 2 },
  { name: "Diamond I", icon: "💠", minXP: 47000, maxXP: 50000, color: "#B9F2FF", division: 1 },
  { name: "Master", icon: "👑", minXP: 50000, maxXP: 60000, color: "#9932CC", division: 0 },
  { name: "Grandmaster", icon: "🏆", minXP: 60000, maxXP: 75000, color: "#FF4500", division: 0 },
  { name: "Challenger", icon: "⚡", minXP: 75000, maxXP: 100000, color: "#FFD700", division: 0 },
];

// Mock user data
const mockUserRanked = {
  currentXP: 21850,
  mainEvent: "100m",
  mainEventPR: "10.15",
  seasonPRs: 5,
  totalXP: 21850,
  weeklyXP: 450,
  winStreak: 3,
  matchesPlayed: 47,
  matchesWon: 32,
  currentSeason: "Season 1",
  seasonEnds: "45 days",
  placement: {
    completed: true,
    wins: 7,
    losses: 3,
  },
};

// Weekly challenges
const weeklyChallenges = [
  { id: "c1", name: "Speed Demon", description: "Log 3 sprint workouts", progress: 2, total: 3, xpReward: 150, icon: "⚡" },
  { id: "c2", name: "Consistency King", description: "Train 5 days this week", progress: 4, total: 5, xpReward: 200, icon: "🔥" },
  { id: "c3", name: "PR Hunter", description: "Set a new personal record", progress: 0, total: 1, xpReward: 500, icon: "🎯" },
  { id: "c4", name: "Social Butterfly", description: "Cheer 10 teammates", progress: 6, total: 10, xpReward: 100, icon: "🦋" },
];

// Head-to-head matchups
const activeMatchups = [
  { 
    id: "m1", 
    opponent: "Marcus Johnson", 
    opponentSchool: "Roosevelt HS",
    opponentRank: "Gold II",
    event: "100m",
    yourTime: "10.15",
    theirTime: "10.28",
    status: "winning",
    endsIn: "2 days",
    xpStake: 75,
  },
  { 
    id: "m2", 
    opponent: "Tyler Smith", 
    opponentSchool: "Jefferson HS",
    opponentRank: "Gold III",
    event: "200m",
    yourTime: "20.68",
    theirTime: "20.45",
    status: "losing",
    endsIn: "4 days",
    xpStake: 75,
  },
];

// Rank rewards
const rankRewards = [
  { rank: "Silver I", reward: "Silver Profile Border", unlocked: true },
  { rank: "Gold V", reward: "Gold Tier Badge", unlocked: true },
  { rank: "Gold I", reward: "Exclusive Gold Avatar Frame", unlocked: false, current: true },
  { rank: "Platinum V", reward: "Platinum Profile Effects", unlocked: false },
  { rank: "Diamond V", reward: "Diamond Animated Badge", unlocked: false },
  { rank: "Master", reward: "Master Title + Custom Flair", unlocked: false },
];

// Leaderboard
const rankedLeaderboard = [
  { rank: 1, name: "Elias Bolt", school: "Lincoln HS", tier: "Grandmaster", xp: 68420, change: 0 },
  { rank: 2, name: "Sarah Chen", school: "Central HS", tier: "Master", xp: 54200, change: 1 },
  { rank: 3, name: "Derek Thompson", school: "Washington HS", tier: "Master", xp: 52100, change: -1 },
  { rank: 4, name: "Maya Rodriguez", school: "Roosevelt HS", tier: "Diamond I", xp: 49800, change: 2 },
  { rank: 5, name: "Alex Kim", school: "Eastside HS", tier: "Diamond II", xp: 45600, change: 0 },
];

function getCurrentRank(xp: number) {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (xp >= RANK_TIERS[i].minXP) {
      return { ...RANK_TIERS[i], index: i };
    }
  }
  return { ...RANK_TIERS[0], index: 0 };
}

function getNextRank(currentIndex: number) {
  if (currentIndex < RANK_TIERS.length - 1) {
    return RANK_TIERS[currentIndex + 1];
  }
  return null;
}

export default function RankedPage() {
  const [selectedTab, setSelectedTab] = useState<"overview" | "matchups" | "challenges" | "rewards">("overview");
  const [animatedXP, setAnimatedXP] = useState(0);

  const currentRank = getCurrentRank(mockUserRanked.currentXP);
  const nextRank = getNextRank(currentRank.index);
  const xpInCurrentRank = mockUserRanked.currentXP - currentRank.minXP;
  const xpNeededForNext = nextRank ? nextRank.minXP - currentRank.minXP : 0;
  const progressPercent = nextRank ? (xpInCurrentRank / xpNeededForNext) * 100 : 100;
  const xpToNextRank = nextRank ? nextRank.minXP - mockUserRanked.currentXP : 0;

  // Animate XP on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedXP(mockUserRanked.currentXP);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section - Your Rank */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at center, ${currentRank.color}40 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          {/* Season Banner */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-500" />
                <span className="text-orange-400 font-bold">{mockUserRanked.currentSeason}</span>
                <span className="text-zinc-500">•</span>
                <Clock className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-400">{mockUserRanked.seasonEnds} remaining</span>
              </div>
            </div>
          </div>

          {/* Main Rank Display */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {/* Glowing ring */}
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse"
                style={{ backgroundColor: currentRank.color }}
              />
              
              {/* Rank emblem */}
              <div 
                className="relative w-40 h-40 mx-auto rounded-full flex items-center justify-center border-4"
                style={{ 
                  borderColor: currentRank.color,
                  background: `linear-gradient(135deg, ${currentRank.color}20 0%, transparent 50%)`,
                }}
              >
                <span className="text-7xl">{currentRank.icon}</span>
              </div>
            </div>

            <h1 
              className="text-4xl font-black mt-6 mb-2"
              style={{ color: currentRank.color }}
            >
              {currentRank.name}
            </h1>
            
            <p className="text-zinc-400 text-lg">
              {mockUserRanked.mainEvent} Main • <span className="text-white font-mono font-bold">{mockUserRanked.mainEventPR}</span> PR
            </p>
          </div>

          {/* XP Progress Bar */}
          {nextRank && (
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">{currentRank.name}</span>
                <span className="font-bold" style={{ color: nextRank.color }}>{nextRank.name}</span>
              </div>
              <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, ${currentRank.color}, ${nextRank.color})`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-lg">
                    {xpInCurrentRank.toLocaleString()} / {xpNeededForNext.toLocaleString()} XP
                  </span>
                </div>
              </div>
              <p className="text-center text-zinc-500 text-sm mt-2">
                <span className="text-orange-400 font-bold">{xpToNextRank.toLocaleString()} XP</span> to {nextRank.name}
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-zinc-900/50 backdrop-blur rounded-xl p-4 border border-zinc-800 text-center">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{mockUserRanked.winStreak}</p>
              <p className="text-xs text-zinc-500">Win Streak</p>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur rounded-xl p-4 border border-zinc-800 text-center">
              <Swords className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{mockUserRanked.matchesWon}/{mockUserRanked.matchesPlayed}</p>
              <p className="text-xs text-zinc-500">Matches Won</p>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur rounded-xl p-4 border border-zinc-800 text-center">
              <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">+{mockUserRanked.weeklyXP}</p>
              <p className="text-xs text-zinc-500">XP This Week</p>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur rounded-xl p-4 border border-zinc-800 text-center">
              <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{mockUserRanked.seasonPRs}</p>
              <p className="text-xs text-zinc-500">Season PRs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-zinc-800 sticky top-0 bg-black/90 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: "overview", label: "Overview", icon: Crown },
              { id: "matchups", label: "Matchups", icon: Swords },
              { id: "challenges", label: "Challenges", icon: Target },
              { id: "rewards", label: "Rewards", icon: Gift },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                className={`flex items-center gap-2 px-6 py-4 font-bold transition-colors border-b-2 ${
                  selectedTab === tab.id
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-zinc-500 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - How to Earn XP */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-zinc-900 border-zinc-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  How to Earn XP
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { action: "Set a new PR", xp: "+500-2000", icon: "🎯", desc: "Based on improvement %" },
                    { action: "Win a matchup", xp: "+75", icon: "⚔️", desc: "Beat your opponent's time" },
                    { action: "Complete workout", xp: "+25-50", icon: "💪", desc: "Daily training bonus" },
                    { action: "Weekly challenges", xp: "+100-500", icon: "🏆", desc: "Complete special tasks" },
                    { action: "Compete in meet", xp: "+100-300", icon: "🏃", desc: "Based on placement" },
                    { action: "Maintain streak", xp: "+10/day", icon: "🔥", desc: "Consecutive training days" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-white">{item.action}</p>
                        <p className="text-xs text-zinc-500">{item.desc}</p>
                      </div>
                      <span className="text-green-400 font-mono font-bold">{item.xp}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Active Matchups Preview */}
              <Card className="bg-zinc-900 border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Swords className="w-5 h-5 text-blue-500" />
                    Active Matchups
                  </h2>
                  <Button 
                    variant="ghost" 
                    className="text-orange-400 hover:text-orange-300"
                    onClick={() => setSelectedTab("matchups")}
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {activeMatchups.slice(0, 2).map((match) => (
                    <div 
                      key={match.id}
                      className={`p-4 rounded-xl border ${
                        match.status === "winning" 
                          ? "bg-green-500/10 border-green-500/30" 
                          : "bg-red-500/10 border-red-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold">
                            {match.opponent.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-white">{match.opponent}</p>
                            <p className="text-xs text-zinc-500">{match.opponentSchool} • {match.opponentRank}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-zinc-400">{match.event}</p>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white">{match.yourTime}</span>
                            <span className="text-zinc-600">vs</span>
                            <span className="font-mono font-bold text-zinc-400">{match.theirTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-700">
                        <span className={`text-sm font-bold ${match.status === "winning" ? "text-green-400" : "text-red-400"}`}>
                          {match.status === "winning" ? "🏆 Winning" : "📉 Losing"}
                        </span>
                        <span className="text-xs text-zinc-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Ends in {match.endsIn} • {match.xpStake} XP at stake
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Leaderboard */}
            <div className="space-y-6">
              <Card className="bg-zinc-900 border-zinc-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Top Ranked
                </h2>
                <div className="space-y-2">
                  {rankedLeaderboard.map((player, i) => (
                    <div 
                      key={player.rank}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        i === 0 ? "bg-yellow-500/10 border border-yellow-500/30" : "bg-zinc-800/50"
                      }`}
                    >
                      <span className={`text-lg font-black w-6 ${
                        i === 0 ? "text-yellow-500" : 
                        i === 1 ? "text-zinc-300" : 
                        i === 2 ? "text-orange-400" : "text-zinc-500"
                      }`}>
                        #{player.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{player.name}</p>
                        <p className="text-xs text-zinc-500">{player.tier}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm text-white">{player.xp.toLocaleString()}</p>
                        <p className="text-xs text-zinc-500">XP</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 border-zinc-700 text-zinc-400 hover:text-white">
                  View Full Leaderboard
                </Button>
              </Card>

              {/* Your Rank Card */}
              <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{currentRank.icon}</span>
                  <div>
                    <p className="text-sm text-zinc-400">Your Rank</p>
                    <p className="text-xl font-black" style={{ color: currentRank.color }}>{currentRank.name}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total XP</span>
                    <span className="font-mono font-bold text-white">{mockUserRanked.totalXP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Global Rank</span>
                    <span className="font-bold text-orange-400">#1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">State Rank</span>
                    <span className="font-bold text-orange-400">#42</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Matchups Tab */}
        {selectedTab === "matchups" && (
          <div className="space-y-6">
            {/* Find Opponent */}
            <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Swords className="w-5 h-5 text-blue-500" />
                    Challenge an Opponent
                  </h2>
                  <p className="text-zinc-400 mt-1">Find athletes at your skill level and compete head-to-head</p>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold">
                  <Users className="w-4 h-4 mr-2" />
                  Find Match
                </Button>
              </div>
            </Card>

            {/* Active Matchups */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Active Matchups ({activeMatchups.length})</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {activeMatchups.map((match) => (
                  <Card 
                    key={match.id}
                    className={`p-6 ${
                      match.status === "winning" 
                        ? "bg-green-500/10 border-green-500/30" 
                        : "bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-lg">
                          {match.opponent.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-white">{match.opponent}</p>
                          <p className="text-sm text-zinc-500">{match.opponentSchool}</p>
                          <p className="text-xs text-zinc-600">{match.opponentRank}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        match.status === "winning" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {match.status === "winning" ? "Winning" : "Losing"}
                      </div>
                    </div>

                    <div className="bg-zinc-900/50 rounded-xl p-4 mb-4">
                      <p className="text-center text-zinc-400 text-sm mb-2">{match.event}</p>
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-zinc-500">You</p>
                          <p className="text-2xl font-mono font-black text-white">{match.yourTime}</p>
                        </div>
                        <span className="text-zinc-600 text-2xl">⚔️</span>
                        <div className="text-center">
                          <p className="text-xs text-zinc-500">Them</p>
                          <p className="text-2xl font-mono font-black text-zinc-400">{match.theirTime}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Clock className="w-4 h-4" />
                        Ends in {match.endsIn}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <Zap className="w-4 h-4" />
                        {match.xpStake} XP at stake
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Matchup History */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Recent Results</h3>
              <div className="space-y-2">
                {[
                  { opponent: "Alex Kim", result: "won", xp: "+75", event: "100m", yourTime: "10.15", theirTime: "10.48" },
                  { opponent: "Jordan White", result: "won", xp: "+75", event: "200m", yourTime: "20.68", theirTime: "21.02" },
                  { opponent: "Chris Brown", result: "lost", xp: "-25", event: "100m", yourTime: "10.32", theirTime: "10.28" },
                  { opponent: "Ryan Davis", result: "won", xp: "+75", event: "100m", yourTime: "10.18", theirTime: "10.62" },
                ].map((match, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${match.result === "won" ? "text-green-500" : "text-red-500"}`}>
                        {match.result === "won" ? "✓" : "✗"}
                      </span>
                      <div>
                        <p className="font-bold text-white">vs {match.opponent}</p>
                        <p className="text-xs text-zinc-500">{match.event} • {match.yourTime} vs {match.theirTime}</p>
                      </div>
                    </div>
                    <span className={`font-mono font-bold ${match.result === "won" ? "text-green-400" : "text-red-400"}`}>
                      {match.xp}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Challenges Tab */}
        {selectedTab === "challenges" && (
          <div className="space-y-6">
            {/* Weekly Challenges */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  Weekly Challenges
                </h3>
                <span className="text-sm text-zinc-500">Resets in 3 days</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {weeklyChallenges.map((challenge) => {
                  const isComplete = challenge.progress >= challenge.total;
                  return (
                    <Card 
                      key={challenge.id}
                      className={`p-6 ${isComplete ? "bg-green-500/10 border-green-500/30" : "bg-zinc-900 border-zinc-800"}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{challenge.icon}</span>
                          <div>
                            <p className="font-bold text-white">{challenge.name}</p>
                            <p className="text-sm text-zinc-500">{challenge.description}</p>
                          </div>
                        </div>
                        {isComplete && <span className="text-green-500 text-xl">✓</span>}
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-zinc-400">{challenge.progress}/{challenge.total}</span>
                          <span className="text-yellow-500 font-bold">+{challenge.xpReward} XP</span>
                        </div>
                        <Progress 
                          value={(challenge.progress / challenge.total) * 100} 
                          className="h-2 bg-zinc-800"
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Daily Bonus */}
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <Gift className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Daily Login Bonus</h3>
                    <p className="text-zinc-400">Log in every day to earn bonus XP</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <div 
                          key={day}
                          className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                            day <= 5 ? "bg-yellow-500 text-black" : "bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          {day <= 5 ? "✓" : day}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">Day 7 Reward</p>
                  <p className="text-2xl font-black text-yellow-500">+500 XP</p>
                </div>
              </div>
            </Card>

            {/* Season Challenges */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-500" />
                Season Challenges
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Century Club", desc: "Log 100 workouts this season", progress: 67, total: 100, xp: 2000 },
                  { name: "PR Machine", desc: "Set 10 personal records", progress: 5, total: 10, xp: 3000 },
                  { name: "Matchup Master", desc: "Win 50 head-to-head matchups", progress: 32, total: 50, xp: 2500 },
                  { name: "Streak Legend", desc: "Reach a 30-day training streak", progress: 14, total: 30, xp: 1500 },
                ].map((challenge, i) => (
                  <Card key={i} className="bg-zinc-900 border-zinc-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-white">{challenge.name}</p>
                        <p className="text-sm text-zinc-500">{challenge.desc}</p>
                      </div>
                      <span className="text-yellow-500 font-bold">+{challenge.xp.toLocaleString()} XP</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress 
                        value={(challenge.progress / challenge.total) * 100} 
                        className="flex-1 h-2 bg-zinc-800"
                      />
                      <span className="text-sm text-zinc-400 w-16 text-right">
                        {challenge.progress}/{challenge.total}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {selectedTab === "rewards" && (
          <div className="space-y-6">
            {/* Rank Rewards */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                Rank Rewards
              </h3>
              <div className="space-y-3">
                {rankRewards.map((reward, i) => (
                  <Card 
                    key={i}
                    className={`p-4 flex items-center gap-4 ${
                      reward.current 
                        ? "bg-orange-500/10 border-orange-500/30" 
                        : reward.unlocked 
                          ? "bg-green-500/10 border-green-500/30" 
                          : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      reward.unlocked ? "bg-green-500/20" : "bg-zinc-800"
                    }`}>
                      {reward.unlocked ? (
                        <Unlock className="w-6 h-6 text-green-500" />
                      ) : (
                        <Lock className="w-6 h-6 text-zinc-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white">{reward.reward}</p>
                      <p className="text-sm text-zinc-500">Unlock at {reward.rank}</p>
                    </div>
                    {reward.current && (
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm font-bold">
                        Next Reward
                      </span>
                    )}
                    {reward.unlocked && (
                      <span className="text-green-500 font-bold">Unlocked ✓</span>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Season Rewards */}
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Season 1 Rewards
              </h3>
              <p className="text-zinc-400 mb-4">Finish the season in these ranks to earn exclusive rewards:</p>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { rank: "Gold+", reward: "Season 1 Gold Badge", icon: "🥇" },
                  { rank: "Diamond+", reward: "Animated Profile Border", icon: "💠" },
                  { rank: "Master+", reward: "Exclusive \"OG\" Title", icon: "👑" },
                ].map((item, i) => (
                  <div key={i} className="bg-zinc-900/50 rounded-xl p-4 text-center">
                    <span className="text-4xl">{item.icon}</span>
                    <p className="font-bold text-white mt-2">{item.rank}</p>
                    <p className="text-sm text-zinc-500">{item.reward}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
