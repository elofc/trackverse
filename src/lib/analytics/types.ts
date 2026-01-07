// Advanced Analytics Types

// Performance Data Point
export type PerformanceDataPoint = {
  date: string;
  value: number; // time in seconds for track events
  event: string;
  meetName?: string;
  isPR?: boolean;
  conditions?: {
    wind?: number;
    temperature?: number;
    altitude?: number;
  };
};

// Performance Trend
export type PerformanceTrend = {
  event: string;
  dataPoints: PerformanceDataPoint[];
  currentBest: number;
  seasonBest: number;
  allTimeBest: number;
  averageImprovement: number; // per month
  projectedPerformance?: number;
  projectedDate?: string;
  trendDirection: "improving" | "stable" | "declining";
};

// Training Load
export type TrainingLoad = {
  date: string;
  acuteLoad: number; // last 7 days
  chronicLoad: number; // last 28 days
  acwr: number; // acute:chronic workload ratio
  trainingStress: number;
  volume: number; // km or minutes
  intensity: number; // 1-10 scale
};

// Injury Risk Assessment
export type InjuryRisk = {
  level: "low" | "moderate" | "high" | "critical";
  score: number; // 0-100
  factors: InjuryRiskFactor[];
  recommendations: string[];
  lastUpdated: string;
};

export type InjuryRiskFactor = {
  name: string;
  impact: "positive" | "negative" | "neutral";
  value: number;
  threshold: number;
  description: string;
};

// Recovery Metrics
export type RecoveryMetrics = {
  overallScore: number; // 0-100
  sleepQuality?: number;
  restingHeartRate?: number;
  hrvScore?: number;
  muscleReadiness?: number;
  mentalReadiness?: number;
  hydrationLevel?: number;
};

// Peer Comparison
export type PeerComparison = {
  event: string;
  userPerformance: number;
  peerAverage: number;
  peerMedian: number;
  percentile: number;
  improvementRate: number; // user's improvement rate
  peerImprovementRate: number;
  sampleSize: number;
  filters: {
    ageGroup?: string;
    gender?: string;
    region?: string;
    tier?: string;
  };
};

// Training Insights
export type TrainingInsight = {
  id: string;
  type: "achievement" | "warning" | "suggestion" | "trend";
  title: string;
  description: string;
  metric?: string;
  value?: number;
  change?: number;
  actionable?: boolean;
  action?: string;
  createdAt: string;
};

// Workout Summary
export type WorkoutSummary = {
  period: "week" | "month" | "season" | "year";
  totalWorkouts: number;
  totalDuration: number; // minutes
  totalDistance: number; // km
  avgIntensity: number;
  workoutTypes: Record<string, number>;
  completionRate: number; // planned vs completed
};

// Season Summary
export type SeasonSummary = {
  season: string; // "2025-2026 Indoor" etc
  events: string[];
  prsSet: number;
  meetsAttended: number;
  podiumFinishes: number;
  bestPerformances: Array<{
    event: string;
    time: number;
    date: string;
    meetName: string;
  }>;
  rankingProgress: Array<{
    event: string;
    startRank: number;
    endRank: number;
    change: number;
  }>;
};

// Coach Analytics - Team Overview
export type TeamAnalytics = {
  teamId: string;
  teamName: string;
  athleteCount: number;
  activeAthletes: number;
  
  // Aggregate metrics
  totalWorkouts: number;
  avgWorkoutsPerAthlete: number;
  totalPRs: number;
  avgTrainingLoad: number;
  
  // Risk overview
  athletesAtRisk: number;
  riskBreakdown: {
    low: number;
    moderate: number;
    high: number;
    critical: number;
  };
  
  // Performance
  athletesImproving: number;
  athletesStable: number;
  athletesDeclining: number;
  
  // Top performers
  topPerformers: Array<{
    athleteId: string;
    athleteName: string;
    metric: string;
    value: number;
  }>;
};

// Athlete Summary for Coach View
export type AthleteAnalyticsSummary = {
  athleteId: string;
  athleteName: string;
  avatarUrl?: string;
  
  // Current status
  trainingLoad: number;
  recoveryScore: number;
  injuryRisk: InjuryRisk["level"];
  streak: number;
  
  // Recent activity
  lastWorkout?: string;
  workoutsThisWeek: number;
  
  // Performance
  recentPRs: number;
  trendDirection: "improving" | "stable" | "declining";
  
  // Flags
  needsAttention: boolean;
  attentionReason?: string;
};

// Date Range Filter
export type DateRange = {
  start: string;
  end: string;
  preset?: "week" | "month" | "quarter" | "season" | "year" | "all" | "custom";
};

// Analytics Export
export type AnalyticsExport = {
  format: "pdf" | "csv" | "json";
  sections: Array<"performance" | "training" | "recovery" | "comparison">;
  dateRange: DateRange;
  includeCharts: boolean;
};

// Chart Configuration
export type ChartConfig = {
  type: "line" | "bar" | "area" | "scatter";
  xAxis: string;
  yAxis: string;
  color?: string;
  showTrendline?: boolean;
  showPrediction?: boolean;
  annotations?: Array<{
    type: "point" | "line" | "range";
    value: number | string;
    label: string;
  }>;
};
