"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Activity,
  Target,
  Award,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { TeamAnalytics, AthleteAnalyticsSummary } from "@/lib/analytics/types";
import { RiskBadge } from "./injury-risk";

type TeamAnalyticsDashboardProps = {
  team: TeamAnalytics;
  athletes: AthleteAnalyticsSummary[];
  onAthleteClick?: (athleteId: string) => void;
};

export function TeamAnalyticsDashboard({
  team,
  athletes,
  onAthleteClick,
}: TeamAnalyticsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "risk" | "load" | "streak">("name");

  const filteredAthletes = athletes
    .filter((a) => {
      if (searchQuery && !a.athleteName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filterRisk !== "all" && a.injuryRisk !== filterRisk) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "risk":
          const riskOrder = { critical: 0, high: 1, moderate: 2, low: 3 };
          return riskOrder[a.injuryRisk] - riskOrder[b.injuryRisk];
        case "load":
          return b.trainingLoad - a.trainingLoad;
        case "streak":
          return b.streak - a.streak;
        default:
          return a.athleteName.localeCompare(b.athleteName);
      }
    });

  const needsAttentionCount = athletes.filter((a) => a.needsAttention).length;

  return (
    <div className="space-y-6">
      {/* Team Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Active Athletes"
          value={team.activeAthletes}
          subValue={`of ${team.athleteCount}`}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Avg Training Load"
          value={team.avgTrainingLoad.toFixed(0)}
          subValue="pts/week"
          icon={Activity}
          color="orange"
        />
        <StatCard
          label="PRs This Month"
          value={team.totalPRs}
          icon={Award}
          color="green"
        />
        <StatCard
          label="Needs Attention"
          value={needsAttentionCount}
          icon={AlertTriangle}
          color={needsAttentionCount > 0 ? "red" : "green"}
          highlight={needsAttentionCount > 0}
        />
      </div>

      {/* Risk Distribution */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <h3 className="font-bold text-white mb-4">Injury Risk Distribution</h3>
        <div className="flex gap-2 h-8">
          {(["low", "moderate", "high", "critical"] as const).map((level) => {
            const count = team.riskBreakdown[level];
            const percentage = (count / team.athleteCount) * 100;
            const colors = {
              low: "bg-green-500",
              moderate: "bg-yellow-500",
              high: "bg-orange-500",
              critical: "bg-red-500",
            };

            return (
              <motion.div
                key={level}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className={`${colors[level]} rounded-lg flex items-center justify-center min-w-[40px]`}
                title={`${level}: ${count} athletes`}
              >
                {percentage > 10 && (
                  <span className="text-xs font-bold text-white">{count}</span>
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          <span>Low ({team.riskBreakdown.low})</span>
          <span>Moderate ({team.riskBreakdown.moderate})</span>
          <span>High ({team.riskBreakdown.high})</span>
          <span>Critical ({team.riskBreakdown.critical})</span>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <h3 className="font-bold text-white mb-4">Performance Trends</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-500/10 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">{team.athletesImproving}</div>
            <div className="text-xs text-zinc-500">Improving</div>
          </div>
          <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
            <Minus className="w-6 h-6 text-zinc-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zinc-400">{team.athletesStable}</div>
            <div className="text-xs text-zinc-500">Stable</div>
          </div>
          <div className="text-center p-3 bg-red-500/10 rounded-lg">
            <TrendingDown className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-500">{team.athletesDeclining}</div>
            <div className="text-xs text-zinc-500">Declining</div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      {team.topPerformers.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <h3 className="font-bold text-white mb-4">Top Performers This Week</h3>
          <div className="space-y-2">
            {team.topPerformers.slice(0, 5).map((performer, i) => (
              <div
                key={performer.athleteId}
                className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg"
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${i === 0 ? "bg-yellow-500 text-black" : i === 1 ? "bg-zinc-400 text-black" : i === 2 ? "bg-orange-700 text-white" : "bg-zinc-700 text-zinc-300"}
                `}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <span className="text-white font-medium">{performer.athleteName}</span>
                  <span className="text-zinc-500 text-sm ml-2">{performer.metric}</span>
                </div>
                <span className="text-orange-500 font-bold">{performer.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Athletes List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Athletes</h3>
            <span className="text-sm text-zinc-500">{filteredAthletes.length} athletes</span>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search athletes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Risk</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="name">Name</option>
              <option value="risk">Risk Level</option>
              <option value="load">Training Load</option>
              <option value="streak">Streak</option>
            </select>
          </div>
        </div>

        {/* Athletes Table */}
        <div className="divide-y divide-zinc-800">
          {filteredAthletes.map((athlete) => (
            <AthleteRow
              key={athlete.athleteId}
              athlete={athlete}
              onClick={() => onAthleteClick?.(athlete.athleteId)}
            />
          ))}

          {filteredAthletes.length === 0 && (
            <div className="p-8 text-center text-zinc-500">
              No athletes match your filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
type StatCardProps = {
  label: string;
  value: number | string;
  subValue?: string;
  icon: React.ElementType;
  color: "blue" | "orange" | "green" | "red";
  highlight?: boolean;
};

function StatCard({ label, value, subValue, icon: Icon, color, highlight }: StatCardProps) {
  const colors = {
    blue: "text-blue-500 bg-blue-500/20",
    orange: "text-orange-500 bg-orange-500/20",
    green: "text-green-500 bg-green-500/20",
    red: "text-red-500 bg-red-500/20",
  };

  return (
    <div className={`
      bg-zinc-900 border rounded-xl p-4
      ${highlight ? "border-red-500/50 animate-pulse" : "border-zinc-800"}
    `}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-zinc-500 text-sm">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {subValue && <span className="text-zinc-500 text-sm">{subValue}</span>}
      </div>
    </div>
  );
}

// Athlete Row Component
type AthleteRowProps = {
  athlete: AthleteAnalyticsSummary;
  onClick?: () => void;
};

function AthleteRow({ athlete, onClick }: AthleteRowProps) {
  const getTrendIcon = () => {
    switch (athlete.trendDirection) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "declining":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-4 p-4 hover:bg-zinc-800/50 cursor-pointer transition-colors
        ${athlete.needsAttention ? "bg-red-500/5" : ""}
      `}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
          {athlete.athleteName.charAt(0).toUpperCase()}
        </div>
        {athlete.needsAttention && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Name & Status */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{athlete.athleteName}</span>
          {getTrendIcon()}
        </div>
        {athlete.needsAttention && athlete.attentionReason && (
          <p className="text-xs text-red-400 truncate">{athlete.attentionReason}</p>
        )}
        {!athlete.needsAttention && athlete.lastWorkout && (
          <p className="text-xs text-zinc-500">
            Last workout: {new Date(athlete.lastWorkout).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="text-center">
          <div className="text-white font-medium">{athlete.trainingLoad.toFixed(0)}</div>
          <div className="text-xs text-zinc-500">Load</div>
        </div>
        <div className="text-center">
          <div className="text-white font-medium">{athlete.recoveryScore}%</div>
          <div className="text-xs text-zinc-500">Recovery</div>
        </div>
        <div className="text-center">
          <div className="text-orange-500 font-medium">{athlete.streak}d</div>
          <div className="text-xs text-zinc-500">Streak</div>
        </div>
      </div>

      {/* Risk Badge */}
      <RiskBadge level={athlete.injuryRisk} />

      <ChevronRight className="w-5 h-5 text-zinc-500" />
    </div>
  );
}
