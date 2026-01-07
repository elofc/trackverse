"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Download,
  Filter,
  Calendar,
} from "lucide-react";
import { Navbar } from "@/components/trackverse/navbar";
import { TeamAnalyticsDashboard } from "@/components/analytics/team-analytics";
import { DateRangePicker } from "@/components/analytics/date-range-picker";
import { TeamAnalytics, AthleteAnalyticsSummary, DateRange } from "@/lib/analytics/types";

// Mock Team Data
const mockTeam: TeamAnalytics = {
  teamId: "team1",
  teamName: "Westview Track & Field",
  athleteCount: 24,
  activeAthletes: 22,
  totalWorkouts: 156,
  avgWorkoutsPerAthlete: 6.5,
  totalPRs: 8,
  avgTrainingLoad: 3850,
  athletesAtRisk: 3,
  riskBreakdown: {
    low: 15,
    moderate: 6,
    high: 2,
    critical: 1,
  },
  athletesImproving: 14,
  athletesStable: 7,
  athletesDeclining: 3,
  topPerformers: [
    { athleteId: "a1", athleteName: "Marcus Johnson", metric: "100m PR", value: 10.85 },
    { athleteId: "a2", athleteName: "Sarah Chen", metric: "Training Load", value: 4500 },
    { athleteId: "a3", athleteName: "David Kim", metric: "12-day Streak", value: 12 },
    { athleteId: "a4", athleteName: "Emma Wilson", metric: "200m PR", value: 24.12 },
    { athleteId: "a5", athleteName: "James Brown", metric: "Long Jump PR", value: 6.45 },
  ],
};

// Mock Athletes Data
const mockAthletes: AthleteAnalyticsSummary[] = [
  {
    athleteId: "a1",
    athleteName: "Marcus Johnson",
    trainingLoad: 4200,
    recoveryScore: 88,
    injuryRisk: "low",
    streak: 8,
    lastWorkout: "2026-01-06T10:00:00Z",
    workoutsThisWeek: 5,
    recentPRs: 2,
    trendDirection: "improving",
    needsAttention: false,
  },
  {
    athleteId: "a2",
    athleteName: "Sarah Chen",
    trainingLoad: 4500,
    recoveryScore: 82,
    injuryRisk: "moderate",
    streak: 12,
    lastWorkout: "2026-01-06T14:00:00Z",
    workoutsThisWeek: 6,
    recentPRs: 1,
    trendDirection: "improving",
    needsAttention: false,
  },
  {
    athleteId: "a3",
    athleteName: "David Kim",
    trainingLoad: 3800,
    recoveryScore: 75,
    injuryRisk: "high",
    streak: 5,
    lastWorkout: "2026-01-05T16:00:00Z",
    workoutsThisWeek: 4,
    recentPRs: 0,
    trendDirection: "stable",
    needsAttention: true,
    attentionReason: "High injury risk - ACWR at 1.45",
  },
  {
    athleteId: "a4",
    athleteName: "Emma Wilson",
    trainingLoad: 3600,
    recoveryScore: 90,
    injuryRisk: "low",
    streak: 15,
    lastWorkout: "2026-01-06T08:00:00Z",
    workoutsThisWeek: 5,
    recentPRs: 1,
    trendDirection: "improving",
    needsAttention: false,
  },
  {
    athleteId: "a5",
    athleteName: "James Brown",
    trainingLoad: 2800,
    recoveryScore: 65,
    injuryRisk: "critical",
    streak: 0,
    lastWorkout: "2026-01-02T10:00:00Z",
    workoutsThisWeek: 2,
    recentPRs: 0,
    trendDirection: "declining",
    needsAttention: true,
    attentionReason: "Critical injury risk - missed 3 days, low recovery",
  },
  {
    athleteId: "a6",
    athleteName: "Olivia Martinez",
    trainingLoad: 4100,
    recoveryScore: 85,
    injuryRisk: "low",
    streak: 10,
    lastWorkout: "2026-01-06T11:00:00Z",
    workoutsThisWeek: 5,
    recentPRs: 0,
    trendDirection: "stable",
    needsAttention: false,
  },
  {
    athleteId: "a7",
    athleteName: "Michael Lee",
    trainingLoad: 3950,
    recoveryScore: 78,
    injuryRisk: "moderate",
    streak: 6,
    lastWorkout: "2026-01-06T09:00:00Z",
    workoutsThisWeek: 4,
    recentPRs: 1,
    trendDirection: "improving",
    needsAttention: false,
  },
  {
    athleteId: "a8",
    athleteName: "Sophia Taylor",
    trainingLoad: 3200,
    recoveryScore: 92,
    injuryRisk: "low",
    streak: 20,
    lastWorkout: "2026-01-06T15:00:00Z",
    workoutsThisWeek: 6,
    recentPRs: 2,
    trendDirection: "improving",
    needsAttention: false,
  },
  {
    athleteId: "a9",
    athleteName: "William Anderson",
    trainingLoad: 4300,
    recoveryScore: 70,
    injuryRisk: "high",
    streak: 3,
    lastWorkout: "2026-01-05T14:00:00Z",
    workoutsThisWeek: 3,
    recentPRs: 0,
    trendDirection: "declining",
    needsAttention: true,
    attentionReason: "Rapid load increase - 25% spike this week",
  },
  {
    athleteId: "a10",
    athleteName: "Ava Thompson",
    trainingLoad: 3700,
    recoveryScore: 88,
    injuryRisk: "low",
    streak: 9,
    lastWorkout: "2026-01-06T07:00:00Z",
    workoutsThisWeek: 5,
    recentPRs: 1,
    trendDirection: "improving",
    needsAttention: false,
  },
];

export default function CoachAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: "2026-01-01",
    end: new Date().toISOString().split("T")[0],
    preset: "month",
  });

  const handleAthleteClick = (athleteId: string) => {
    // In real app, navigate to athlete detail page
    console.log("View athlete:", athleteId);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-black text-white">Team Analytics</h1>
            </div>
            <p className="text-zinc-400">{mockTeam.teamName} • {mockTeam.athleteCount} athletes</p>
          </div>

          <div className="flex items-center gap-3">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:bg-zinc-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Alerts Banner */}
        {mockTeam.athletesAtRisk > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="font-bold text-red-500">
                  {mockTeam.athletesAtRisk} athlete{mockTeam.athletesAtRisk > 1 ? "s" : ""} need attention
                </h3>
                <p className="text-zinc-400 text-sm">
                  Review athletes with high or critical injury risk
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Team Dashboard */}
        <TeamAnalyticsDashboard
          team={mockTeam}
          athletes={mockAthletes}
          onAthleteClick={handleAthleteClick}
        />
      </main>
    </div>
  );
}
