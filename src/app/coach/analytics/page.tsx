"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TierBadge } from "@/components/trackverse/tier-badge";
import { Tier } from "@/lib/rankings";
import {
  ChevronLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Flame,
  Trophy,
  Calendar,
  Clock,
  Activity,
  Zap,
  Award,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

// Mock analytics data
const teamStats = {
  totalAthletes: 42,
  activeThisWeek: 38,
  avgCompletionRate: 87,
  totalPRsThisSeason: 156,
  avgTrainingLoad: 4200,
  teamTierBreakdown: [
    { tier: "GODSPEED" as Tier, count: 1 },
    { tier: "WORLD_CLASS" as Tier, count: 3 },
    { tier: "NATIONAL" as Tier, count: 5 },
    { tier: "ALL_STATE" as Tier, count: 8 },
    { tier: "ELITE" as Tier, count: 10 },
    { tier: "VARSITY" as Tier, count: 8 },
    { tier: "JV" as Tier, count: 5 },
    { tier: "ROOKIE" as Tier, count: 2 },
  ],
};

const weeklyProgress = [
  { week: "Week 1", completionRate: 82, prs: 12, avgEffort: 6.5 },
  { week: "Week 2", completionRate: 85, prs: 18, avgEffort: 6.8 },
  { week: "Week 3", completionRate: 78, prs: 8, avgEffort: 5.9 },
  { week: "Week 4", completionRate: 91, prs: 24, avgEffort: 7.2 },
  { week: "Week 5", completionRate: 87, prs: 15, avgEffort: 6.9 },
  { week: "Week 6", completionRate: 89, prs: 21, avgEffort: 7.1 },
];

const topPerformers = [
  { id: "u1", name: "Jaylen Thompson", prs: 5, completionRate: 98, improvement: "+12%", tier: "GODSPEED" as Tier },
  { id: "u2", name: "Marcus Johnson", prs: 4, completionRate: 95, improvement: "+8%", tier: "WORLD_CLASS" as Tier },
  { id: "u3", name: "Sarah Chen", prs: 4, completionRate: 94, improvement: "+15%", tier: "ALL_STATE" as Tier },
  { id: "u4", name: "Tyler Smith", prs: 3, completionRate: 97, improvement: "+6%", tier: "NATIONAL" as Tier },
  { id: "u5", name: "Maya Rodriguez", prs: 3, completionRate: 92, improvement: "+10%", tier: "ELITE" as Tier },
];

const needsAttention = [
  { id: "u6", name: "Derek Thompson", issue: "Injured - 2 weeks", missedWorkouts: 4, lastActive: "5 days ago" },
  { id: "u7", name: "Alex Kim", issue: "Low completion rate", missedWorkouts: 3, lastActive: "2 days ago" },
  { id: "u8", name: "Jordan White", issue: "Declining performance", missedWorkouts: 1, lastActive: "1 day ago" },
];

const eventBreakdown = [
  { event: "100m", athletes: 8, avgImprovement: "-0.12s", prs: 12 },
  { event: "200m", athletes: 10, avgImprovement: "-0.25s", prs: 15 },
  { event: "400m", athletes: 6, avgImprovement: "-0.8s", prs: 8 },
  { event: "800m", athletes: 5, avgImprovement: "-2.1s", prs: 6 },
  { event: "Long Jump", athletes: 4, avgImprovement: "+4\"", prs: 5 },
  { event: "Shot Put", athletes: 3, avgImprovement: "+1' 2\"", prs: 4 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("season");

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/coach" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <BarChart3 className="h-10 w-10 text-orange-500" />
              ANALYTICS
            </h1>
            <p className="text-white/60 mt-1">
              Track team performance and identify trends
            </p>
          </div>
          <div className="flex items-center gap-2">
            {["week", "month", "season"].map((range) => (
              <Button
                key={range}
                variant="outline"
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`capitalize ${
                  timeRange === range
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-orange-500" />
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" /> 3
                </span>
              </div>
              <p className="text-2xl font-black text-white">{teamStats.activeThisWeek}/{teamStats.totalAthletes}</p>
              <p className="text-xs text-white/50">Active This Week</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="h-5 w-5 text-green-500" />
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" /> 5%
                </span>
              </div>
              <p className="text-2xl font-black text-white">{teamStats.avgCompletionRate}%</p>
              <p className="text-xs text-white/50">Completion Rate</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Flame className="h-5 w-5 text-yellow-500" />
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" /> 21
                </span>
              </div>
              <p className="text-2xl font-black text-white">{teamStats.totalPRsThisSeason}</p>
              <p className="text-xs text-white/50">PRs This Season</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <span className="text-xs text-yellow-400 flex items-center gap-1">
                  <Minus className="h-3 w-3" /> 0%
                </span>
              </div>
              <p className="text-2xl font-black text-white">{teamStats.avgTrainingLoad}</p>
              <p className="text-xs text-white/50">Avg Training Load</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-2xl font-black text-white">7.1</p>
              <p className="text-xs text-white/50">Avg Effort Rating</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Progress Chart */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyProgress.map((week, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">{week.week}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-white/50">{week.completionRate}% completion</span>
                          <span className="text-orange-400 font-bold">{week.prs} PRs</span>
                        </div>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full transition-all"
                          style={{ width: `${week.completionRate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Event Breakdown */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Event Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="p-3 text-left text-sm font-bold text-white/60">Event</th>
                        <th className="p-3 text-left text-sm font-bold text-white/60">Athletes</th>
                        <th className="p-3 text-left text-sm font-bold text-white/60">Avg Improvement</th>
                        <th className="p-3 text-left text-sm font-bold text-white/60">PRs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventBreakdown.map((event, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-3 font-bold text-white">{event.event}</td>
                          <td className="p-3 text-white/70">{event.athletes}</td>
                          <td className="p-3 text-green-400 font-mono">{event.avgImprovement}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                              {event.prs}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Tier Distribution */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-500" />
                  Team Tier Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamStats.teamTierBreakdown.map((item, i) => {
                    const percentage = Math.round((item.count / teamStats.totalAthletes) * 100);
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-28">
                          <TierBadge tier={item.tier} size="sm" />
                        </div>
                        <div className="flex-1">
                          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-white/70 w-16 text-right">{item.count} ({percentage}%)</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Performers */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPerformers.map((athlete, i) => (
                  <div key={athlete.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs font-black">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-sm truncate">{athlete.name}</p>
                        <TierBadge tier={athlete.tier} size="sm" showEmoji={false} />
                      </div>
                      <p className="text-xs text-white/50">{athlete.prs} PRs • {athlete.completionRate}%</p>
                    </div>
                    <span className="text-xs text-green-400 font-bold">{athlete.improvement}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Needs Attention */}
            <Card className="bg-red-500/10 border-red-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {needsAttention.map((athlete) => (
                  <div key={athlete.id} className="p-3 rounded-lg bg-black/30 border border-red-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-white text-sm">{athlete.name}</p>
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
                        {athlete.missedWorkouts} missed
                      </span>
                    </div>
                    <p className="text-xs text-red-400">{athlete.issue}</p>
                    <p className="text-xs text-white/40">Last active: {athlete.lastActive}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                  Send Check-in Messages
                </Button>
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Quick Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-green-400">📈 Team completion rate up 5% from last month</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <p className="text-sm text-orange-400">🔥 21 PRs set this week - highest this season!</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <p className="text-sm text-blue-400">💪 Sprints group has 95% completion rate</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <p className="text-sm text-purple-400">🎯 3 athletes promoted to higher tiers</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
