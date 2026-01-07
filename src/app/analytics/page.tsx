"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Shield,
  Users,
  Download,
  ChevronDown,
  Zap,
  Target,
  Calendar,
} from "lucide-react";
import { Navbar } from "@/components/trackverse/navbar";
import { PerformanceChart } from "@/components/analytics/performance-chart";
import { TrainingLoadChart, TrainingLoadWidget } from "@/components/analytics/training-load";
import { InjuryRiskCard } from "@/components/analytics/injury-risk";
import { PeerComparisonCard } from "@/components/analytics/peer-comparison";
import { DateRangePicker, DateTabs } from "@/components/analytics/date-range-picker";
import {
  PerformanceDataPoint,
  TrainingLoad,
  InjuryRisk,
  PeerComparison,
  DateRange,
  TrainingInsight,
} from "@/lib/analytics/types";

// Mock Performance Data
const mockPerformanceData: PerformanceDataPoint[] = [
  { date: "2025-09-15", value: 11.45, event: "100m", meetName: "Season Opener" },
  { date: "2025-09-28", value: 11.32, event: "100m", meetName: "Invitational" },
  { date: "2025-10-12", value: 11.28, event: "100m", meetName: "Conference Meet", isPR: true },
  { date: "2025-10-26", value: 11.35, event: "100m", meetName: "Regional Qualifier" },
  { date: "2025-11-09", value: 11.18, event: "100m", meetName: "State Prelims", isPR: true },
  { date: "2025-11-23", value: 11.22, event: "100m", meetName: "State Finals" },
  { date: "2025-12-07", value: 11.15, event: "100m", meetName: "Indoor Opener", isPR: true },
  { date: "2026-01-04", value: 11.08, event: "100m", meetName: "Winter Classic", isPR: true },
];

// Mock Training Load Data
const mockTrainingLoad: TrainingLoad[] = Array.from({ length: 28 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (27 - i));
  const baseLoad = 350 + Math.random() * 150;
  const acuteLoad = baseLoad * (0.9 + Math.random() * 0.3);
  const chronicLoad = baseLoad * (0.85 + Math.random() * 0.2);
  
  return {
    date: date.toISOString(),
    acuteLoad,
    chronicLoad,
    acwr: acuteLoad / chronicLoad,
    trainingStress: baseLoad,
    volume: 8 + Math.random() * 6,
    intensity: 6 + Math.random() * 3,
  };
});

// Mock Injury Risk
const mockInjuryRisk: InjuryRisk = {
  level: "moderate",
  score: 35,
  factors: [
    {
      name: "Workload Ratio",
      impact: "neutral",
      value: 1.15,
      threshold: 1.3,
      description: "Workload ratio is balanced",
    },
    {
      name: "Load Progression",
      impact: "negative",
      value: 18,
      threshold: 20,
      description: "Moderate load increase this week",
    },
    {
      name: "Recovery Days",
      impact: "positive",
      value: 2,
      threshold: 3,
      description: "Adequate recovery between hard sessions",
    },
    {
      name: "Rest Frequency",
      impact: "positive",
      value: 4,
      threshold: 3,
      description: "Good rest day frequency",
    },
    {
      name: "Sleep Quality",
      impact: "neutral",
      value: 6.8,
      threshold: 7,
      description: "Sleep could be improved",
    },
  ],
  recommendations: [
    "Maintain current training approach",
    "Consider adding an extra rest day next week",
    "Focus on sleep quality - aim for 7+ hours",
  ],
  lastUpdated: new Date().toISOString(),
};

// Mock Peer Comparison
const mockPeerComparison: PeerComparison = {
  event: "100m",
  userPerformance: 11.08,
  peerAverage: 11.45,
  peerMedian: 11.42,
  percentile: 78,
  improvementRate: 2.8,
  peerImprovementRate: 1.9,
  sampleSize: 1234,
  filters: {
    ageGroup: "16-17",
    gender: "Male",
    region: "California",
    tier: "ELITE",
  },
};

// Mock Insights
const mockInsights: TrainingInsight[] = [
  {
    id: "1",
    type: "achievement",
    title: "New PR!",
    description: "You set a new 100m PR of 11.08s at Winter Classic",
    metric: "100m",
    value: 11.08,
    createdAt: "2026-01-04T14:00:00Z",
  },
  {
    id: "2",
    type: "trend",
    title: "Consistent Improvement",
    description: "You've improved by 0.37s over the last 4 months",
    change: -0.37,
    createdAt: "2026-01-04T10:00:00Z",
  },
  {
    id: "3",
    type: "suggestion",
    title: "Optimize Recovery",
    description: "Adding a recovery day after hard sessions could boost performance",
    actionable: true,
    action: "View recovery tips",
    createdAt: "2026-01-03T10:00:00Z",
  },
  {
    id: "4",
    type: "warning",
    title: "Training Load Spike",
    description: "Your acute load increased 18% this week. Monitor for fatigue.",
    createdAt: "2026-01-02T10:00:00Z",
  },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: "2025-09-01",
    end: new Date().toISOString().split("T")[0],
    preset: "season",
  });
  const [selectedEvent, setSelectedEvent] = useState("100m");
  const [activeTab, setActiveTab] = useState<"performance" | "training" | "health" | "comparison">("performance");

  const events = ["100m", "200m", "400m", "Long Jump"];

  const getInsightIcon = (type: TrainingInsight["type"]) => {
    switch (type) {
      case "achievement":
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case "trend":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "suggestion":
        return <Target className="w-4 h-4 text-blue-500" />;
      case "warning":
        return <Shield className="w-4 h-4 text-orange-500" />;
    }
  };

  const getInsightBg = (type: TrainingInsight["type"]) => {
    switch (type) {
      case "achievement":
        return "bg-yellow-500/10 border-yellow-500/30";
      case "trend":
        return "bg-green-500/10 border-green-500/30";
      case "suggestion":
        return "bg-blue-500/10 border-blue-500/30";
      case "warning":
        return "bg-orange-500/10 border-orange-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-black text-white">Analytics</h1>
            </div>
            <p className="text-zinc-400">Deep insights to optimize your performance</p>
          </div>

          <div className="flex items-center gap-3">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:bg-zinc-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Season Best", value: "11.08s", subValue: "100m", color: "orange" },
            { label: "Improvement", value: "-0.37s", subValue: "vs. season start", color: "green" },
            { label: "Training Load", value: "4,200", subValue: "pts/week", color: "blue" },
            { label: "Recovery Score", value: "85%", subValue: "Good", color: "purple" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
            >
              <div className="text-zinc-500 text-sm mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-zinc-500">{stat.subValue}</div>
            </div>
          ))}
        </div>

        {/* Insights Banner */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3">Recent Insights</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {mockInsights.map((insight) => (
              <motion.div
                key={insight.id}
                whileHover={{ scale: 1.02 }}
                className={`flex-shrink-0 p-3 rounded-lg border ${getInsightBg(insight.type)} min-w-[280px]`}
              >
                <div className="flex items-start gap-2">
                  {getInsightIcon(insight.type)}
                  <div>
                    <h3 className="font-medium text-white text-sm">{insight.title}</h3>
                    <p className="text-zinc-400 text-xs mt-1">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-6 overflow-x-auto">
          {[
            { id: "performance", label: "Performance", icon: TrendingUp },
            { id: "training", label: "Training Load", icon: Activity },
            { id: "health", label: "Health & Risk", icon: Shield },
            { id: "comparison", label: "Peer Comparison", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap
                ${activeTab === tab.id
                  ? "bg-orange-500 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            {/* Event Selector */}
            <div className="flex items-center gap-4">
              <span className="text-zinc-500 text-sm">Event:</span>
              <div className="flex gap-2">
                {events.map((event) => (
                  <button
                    key={event}
                    onClick={() => setSelectedEvent(event)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${selectedEvent === event
                        ? "bg-orange-500 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }
                    `}
                  >
                    {event}
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Chart */}
            <PerformanceChart
              data={mockPerformanceData}
              event={selectedEvent}
              showPrediction={true}
              height={350}
            />

            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h3 className="text-zinc-500 text-sm mb-2">Season Progress</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-500">-3.2%</span>
                  <span className="text-zinc-500">improvement</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">From 11.45s to 11.08s</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h3 className="text-zinc-500 text-sm mb-2">PRs This Season</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-500">4</span>
                  <span className="text-zinc-500">personal records</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Last PR: Jan 4, 2026</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h3 className="text-zinc-500 text-sm mb-2">Projected Time</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-500">10.95s</span>
                  <span className="text-zinc-500">by March</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Based on current trend</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "training" && (
          <div className="space-y-6">
            <TrainingLoadChart data={mockTrainingLoad} height={300} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TrainingLoadWidget
                acuteLoad={mockTrainingLoad[mockTrainingLoad.length - 1].acuteLoad}
                chronicLoad={mockTrainingLoad[mockTrainingLoad.length - 1].chronicLoad}
                acwr={mockTrainingLoad[mockTrainingLoad.length - 1].acwr}
              />

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h3 className="text-zinc-500 text-sm mb-2">Weekly Volume</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">42.5</span>
                  <span className="text-zinc-500">km</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">+12% vs last week</span>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h3 className="text-zinc-500 text-sm mb-2">Avg Intensity</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">7.2</span>
                  <span className="text-zinc-500">/ 10 RPE</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: "72%" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "health" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InjuryRiskCard risk={mockInjuryRisk} showDetails={true} />

            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h3 className="font-bold text-white mb-4">Recovery Metrics</h3>
                <div className="space-y-4">
                  {[
                    { label: "Sleep Quality", value: 78, color: "blue" },
                    { label: "Muscle Readiness", value: 85, color: "green" },
                    { label: "Mental Readiness", value: 90, color: "purple" },
                    { label: "Hydration", value: 72, color: "cyan" },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-400">{metric.label}</span>
                        <span className="text-white font-medium">{metric.value}%</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor:
                              metric.color === "blue" ? "#3b82f6" :
                              metric.color === "green" ? "#22c55e" :
                              metric.color === "purple" ? "#a855f7" : "#06b6d4",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h3 className="font-bold text-white mb-4">Wellness Check</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Energy", value: "High", emoji: "⚡" },
                    { label: "Mood", value: "Good", emoji: "😊" },
                    { label: "Soreness", value: "Low", emoji: "💪" },
                    { label: "Stress", value: "Moderate", emoji: "😌" },
                  ].map((item) => (
                    <div key={item.label} className="bg-zinc-800/50 rounded-lg p-3 text-center">
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="text-white font-medium text-sm mt-1">{item.value}</div>
                      <div className="text-zinc-500 text-xs">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "comparison" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PeerComparisonCard comparison={mockPeerComparison} />

            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h3 className="font-bold text-white mb-4">Event Percentiles</h3>
                <div className="space-y-4">
                  {[
                    { event: "100m", percentile: 78, time: "11.08s" },
                    { event: "200m", percentile: 72, time: "22.45s" },
                    { event: "Long Jump", percentile: 65, time: "6.12m" },
                  ].map((item) => (
                    <div key={item.event} className="flex items-center gap-4">
                      <div className="w-16 text-sm text-zinc-400">{item.event}</div>
                      <div className="flex-1">
                        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentile}%` }}
                            className="h-full bg-orange-500 rounded-full"
                          />
                        </div>
                      </div>
                      <div className="w-12 text-right text-orange-500 font-bold text-sm">
                        {item.percentile}%
                      </div>
                      <div className="w-16 text-right text-zinc-500 text-sm font-mono">
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h3 className="font-bold text-white mb-4">Ranking Progress</h3>
                <div className="space-y-3">
                  {[
                    { event: "100m", startRank: 156, currentRank: 42, region: "California" },
                    { event: "200m", startRank: 189, currentRank: 78, region: "California" },
                  ].map((item) => (
                    <div key={item.event} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{item.event}</div>
                        <div className="text-xs text-zinc-500">{item.region}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500">#{item.startRank}</span>
                        <span className="text-zinc-500">→</span>
                        <span className="text-orange-500 font-bold">#{item.currentRank}</span>
                        <span className="text-green-500 text-sm">
                          +{item.startRank - item.currentRank}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
