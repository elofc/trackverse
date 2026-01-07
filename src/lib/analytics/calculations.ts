// Analytics Calculation Utilities

import {
  PerformanceDataPoint,
  TrainingLoad,
  InjuryRisk,
  InjuryRiskFactor,
  RecoveryMetrics,
  PeerComparison,
} from "./types";

// Calculate performance trend and prediction
export function calculatePerformanceTrend(dataPoints: PerformanceDataPoint[]): {
  trendDirection: "improving" | "stable" | "declining";
  averageImprovement: number;
  projectedPerformance: number;
  confidence: number;
} {
  if (dataPoints.length < 2) {
    return {
      trendDirection: "stable",
      averageImprovement: 0,
      projectedPerformance: dataPoints[0]?.value || 0,
      confidence: 0,
    };
  }

  // Sort by date
  const sorted = [...dataPoints].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate linear regression
  const n = sorted.length;
  const xValues = sorted.map((_, i) => i);
  const yValues = sorted.map((p) => p.value);

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumX2 = xValues.reduce((acc, x) => acc + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared for confidence
  const yMean = sumY / n;
  const ssTotal = yValues.reduce((acc, y) => acc + Math.pow(y - yMean, 2), 0);
  const ssResidual = yValues.reduce(
    (acc, y, i) => acc + Math.pow(y - (intercept + slope * i), 2),
    0
  );
  const rSquared = 1 - ssResidual / ssTotal;

  // Project 30 days ahead (assuming ~2 data points per month)
  const projectedPerformance = intercept + slope * (n + 2);

  // For track events, negative slope = improvement (faster times)
  const trendDirection =
    Math.abs(slope) < 0.01
      ? "stable"
      : slope < 0
      ? "improving"
      : "declining";

  // Average improvement per month (in seconds)
  const averageImprovement = -slope * 2; // 2 data points per month assumption

  return {
    trendDirection,
    averageImprovement,
    projectedPerformance: Math.max(projectedPerformance, sorted[sorted.length - 1].value * 0.95),
    confidence: Math.max(0, Math.min(100, rSquared * 100)),
  };
}

// Calculate Acute:Chronic Workload Ratio (ACWR)
export function calculateACWR(
  dailyLoads: number[],
  acuteDays: number = 7,
  chronicDays: number = 28
): { acwr: number; risk: "optimal" | "caution" | "danger" } {
  if (dailyLoads.length < chronicDays) {
    return { acwr: 1, risk: "optimal" };
  }

  const acuteLoad =
    dailyLoads.slice(-acuteDays).reduce((a, b) => a + b, 0) / acuteDays;
  const chronicLoad =
    dailyLoads.slice(-chronicDays).reduce((a, b) => a + b, 0) / chronicDays;

  const acwr = chronicLoad > 0 ? acuteLoad / chronicLoad : 1;

  // ACWR risk zones
  let risk: "optimal" | "caution" | "danger";
  if (acwr >= 0.8 && acwr <= 1.3) {
    risk = "optimal";
  } else if (acwr >= 0.5 && acwr <= 1.5) {
    risk = "caution";
  } else {
    risk = "danger";
  }

  return { acwr, risk };
}

// Calculate Training Stress Score (simplified)
export function calculateTrainingStress(
  duration: number, // minutes
  intensity: number, // 1-10 RPE
  type: string
): number {
  // Base stress calculation
  const baseStress = duration * (intensity / 10);

  // Type multipliers
  const typeMultipliers: Record<string, number> = {
    sprint: 1.5,
    interval: 1.4,
    tempo: 1.2,
    easy: 0.8,
    recovery: 0.5,
    strength: 1.3,
    plyometrics: 1.4,
  };

  const multiplier = typeMultipliers[type.toLowerCase()] || 1;

  return Math.round(baseStress * multiplier);
}

// Calculate Injury Risk
export function calculateInjuryRisk(
  trainingData: {
    acwr: number;
    weeklyLoadChange: number; // percentage
    consecutiveHardDays: number;
    restDaysLast14: number;
    previousInjuries: number;
    sleepAverage: number; // hours
    age: number;
  }
): InjuryRisk {
  const factors: InjuryRiskFactor[] = [];
  let totalScore = 0;

  // ACWR Factor (0-25 points)
  const acwrScore =
    trainingData.acwr > 1.5
      ? 25
      : trainingData.acwr > 1.3
      ? 15
      : trainingData.acwr < 0.8
      ? 10
      : 0;
  factors.push({
    name: "Workload Ratio",
    impact: acwrScore > 10 ? "negative" : acwrScore > 0 ? "neutral" : "positive",
    value: trainingData.acwr,
    threshold: 1.3,
    description:
      acwrScore > 10
        ? "Training load spike detected"
        : "Workload ratio is balanced",
  });
  totalScore += acwrScore;

  // Weekly Load Change Factor (0-20 points)
  const loadChangeScore =
    trainingData.weeklyLoadChange > 30
      ? 20
      : trainingData.weeklyLoadChange > 20
      ? 12
      : trainingData.weeklyLoadChange > 10
      ? 5
      : 0;
  factors.push({
    name: "Load Progression",
    impact: loadChangeScore > 10 ? "negative" : loadChangeScore > 0 ? "neutral" : "positive",
    value: trainingData.weeklyLoadChange,
    threshold: 20,
    description:
      loadChangeScore > 10
        ? "Rapid load increase this week"
        : "Gradual load progression",
  });
  totalScore += loadChangeScore;

  // Consecutive Hard Days (0-20 points)
  const hardDaysScore =
    trainingData.consecutiveHardDays > 4
      ? 20
      : trainingData.consecutiveHardDays > 3
      ? 12
      : trainingData.consecutiveHardDays > 2
      ? 5
      : 0;
  factors.push({
    name: "Recovery Days",
    impact: hardDaysScore > 10 ? "negative" : hardDaysScore > 0 ? "neutral" : "positive",
    value: trainingData.consecutiveHardDays,
    threshold: 3,
    description:
      hardDaysScore > 10
        ? "Too many consecutive hard days"
        : "Adequate recovery between hard sessions",
  });
  totalScore += hardDaysScore;

  // Rest Days Factor (0-15 points)
  const restScore =
    trainingData.restDaysLast14 < 2
      ? 15
      : trainingData.restDaysLast14 < 3
      ? 8
      : 0;
  factors.push({
    name: "Rest Frequency",
    impact: restScore > 8 ? "negative" : restScore > 0 ? "neutral" : "positive",
    value: trainingData.restDaysLast14,
    threshold: 3,
    description:
      restScore > 8
        ? "Not enough rest days recently"
        : "Good rest day frequency",
  });
  totalScore += restScore;

  // Sleep Factor (0-10 points)
  const sleepScore =
    trainingData.sleepAverage < 6
      ? 10
      : trainingData.sleepAverage < 7
      ? 5
      : 0;
  factors.push({
    name: "Sleep Quality",
    impact: sleepScore > 5 ? "negative" : sleepScore > 0 ? "neutral" : "positive",
    value: trainingData.sleepAverage,
    threshold: 7,
    description:
      sleepScore > 5
        ? "Sleep deficit affecting recovery"
        : "Adequate sleep for recovery",
  });
  totalScore += sleepScore;

  // Previous Injuries Factor (0-10 points)
  const injuryHistoryScore = Math.min(trainingData.previousInjuries * 3, 10);
  factors.push({
    name: "Injury History",
    impact: injuryHistoryScore > 5 ? "negative" : injuryHistoryScore > 0 ? "neutral" : "positive",
    value: trainingData.previousInjuries,
    threshold: 2,
    description:
      injuryHistoryScore > 5
        ? "History increases risk"
        : "Limited injury history",
  });
  totalScore += injuryHistoryScore;

  // Determine risk level
  let level: InjuryRisk["level"];
  if (totalScore >= 60) {
    level = "critical";
  } else if (totalScore >= 40) {
    level = "high";
  } else if (totalScore >= 20) {
    level = "moderate";
  } else {
    level = "low";
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (acwrScore > 10) {
    recommendations.push("Reduce training intensity for the next 3-5 days");
  }
  if (loadChangeScore > 10) {
    recommendations.push("Limit weekly load increases to 10% or less");
  }
  if (hardDaysScore > 10) {
    recommendations.push("Add a recovery day between hard sessions");
  }
  if (restScore > 8) {
    recommendations.push("Schedule at least 2 rest days per week");
  }
  if (sleepScore > 5) {
    recommendations.push("Prioritize 7-9 hours of sleep per night");
  }

  if (recommendations.length === 0) {
    recommendations.push("Maintain current training approach");
    recommendations.push("Continue monitoring recovery metrics");
  }

  return {
    level,
    score: totalScore,
    factors,
    recommendations,
    lastUpdated: new Date().toISOString(),
  };
}

// Calculate Recovery Score
export function calculateRecoveryScore(metrics: Partial<RecoveryMetrics>): number {
  const weights = {
    sleepQuality: 0.3,
    hrvScore: 0.25,
    muscleReadiness: 0.2,
    mentalReadiness: 0.15,
    hydrationLevel: 0.1,
  };

  let totalWeight = 0;
  let weightedSum = 0;

  if (metrics.sleepQuality !== undefined) {
    weightedSum += metrics.sleepQuality * weights.sleepQuality;
    totalWeight += weights.sleepQuality;
  }
  if (metrics.hrvScore !== undefined) {
    weightedSum += metrics.hrvScore * weights.hrvScore;
    totalWeight += weights.hrvScore;
  }
  if (metrics.muscleReadiness !== undefined) {
    weightedSum += metrics.muscleReadiness * weights.muscleReadiness;
    totalWeight += weights.muscleReadiness;
  }
  if (metrics.mentalReadiness !== undefined) {
    weightedSum += metrics.mentalReadiness * weights.mentalReadiness;
    totalWeight += weights.mentalReadiness;
  }
  if (metrics.hydrationLevel !== undefined) {
    weightedSum += metrics.hydrationLevel * weights.hydrationLevel;
    totalWeight += weights.hydrationLevel;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 75; // Default to 75 if no data
}

// Calculate Percentile
export function calculatePercentile(value: number, dataset: number[]): number {
  const sorted = [...dataset].sort((a, b) => a - b);
  const index = sorted.findIndex((v) => v >= value);
  
  if (index === -1) return 100;
  if (index === 0) return 0;
  
  return Math.round((index / sorted.length) * 100);
}

// Format time for display
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return `${minutes}:${remainingSeconds.toFixed(2).padStart(5, "0")}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}:${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds.toFixed(0).padStart(2, "0")}`;
}

// Calculate improvement percentage
export function calculateImprovement(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  // For track events, lower is better
  return ((oldValue - newValue) / oldValue) * 100;
}

// Generate performance prediction
export function predictPerformance(
  dataPoints: PerformanceDataPoint[],
  targetDate: Date
): { predicted: number; confidence: number; range: { low: number; high: number } } {
  const trend = calculatePerformanceTrend(dataPoints);
  
  if (dataPoints.length < 3) {
    const current = dataPoints[dataPoints.length - 1]?.value || 0;
    return {
      predicted: current,
      confidence: 20,
      range: { low: current * 0.98, high: current * 1.02 },
    };
  }

  const lastDate = new Date(dataPoints[dataPoints.length - 1].date);
  const daysDiff = Math.floor((targetDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  const monthsDiff = daysDiff / 30;

  // Project based on average improvement
  const currentBest = Math.min(...dataPoints.map((p) => p.value));
  const predicted = currentBest - trend.averageImprovement * monthsDiff;

  // Confidence decreases with time
  const confidence = Math.max(10, trend.confidence - monthsDiff * 5);

  // Range based on confidence
  const margin = (100 - confidence) / 100 * 0.05; // 5% max margin
  
  return {
    predicted: Math.max(predicted, currentBest * 0.9), // Cap at 10% improvement
    confidence,
    range: {
      low: predicted * (1 - margin),
      high: predicted * (1 + margin),
    },
  };
}
