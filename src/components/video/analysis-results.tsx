"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Timer,
  Ruler,
  Activity,
  Target,
  Zap,
  Award,
} from "lucide-react";
import { VideoAnalysis, AnalysisInsight, FormMetrics } from "@/lib/video/types";

type AnalysisResultsProps = {
  analysis: VideoAnalysis;
  onSeekToTimestamp?: (timestamp: number) => void;
};

export function AnalysisResults({ analysis, onSeekToTimestamp }: AnalysisResultsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("insights");

  const getInsightIcon = (type: AnalysisInsight["type"]) => {
    switch (type) {
      case "positive":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "improvement":
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryColor = (category: AnalysisInsight["category"]) => {
    switch (category) {
      case "start":
        return "bg-purple-500/20 text-purple-400";
      case "drive":
        return "bg-orange-500/20 text-orange-400";
      case "top_speed":
        return "bg-green-500/20 text-green-400";
      case "finish":
        return "bg-blue-500/20 text-blue-400";
      case "form":
        return "bg-cyan-500/20 text-cyan-400";
      default:
        return "bg-zinc-500/20 text-zinc-400";
    }
  };

  const formatTime = (ms: number): string => {
    const seconds = ms / 1000;
    return `${seconds.toFixed(2)}s`;
  };

  const renderMetricBar = (value: number, max: number = 100, color: string = "orange") => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full bg-${color}-500 rounded-full`}
          style={{ backgroundColor: color === "orange" ? "#f97316" : undefined }}
        />
      </div>
    );
  };

  const sections = [
    {
      id: "insights",
      title: "AI Insights",
      icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
      count: analysis.insights?.length || 0,
    },
    {
      id: "timing",
      title: "Timing Analysis",
      icon: <Timer className="w-5 h-5 text-blue-500" />,
      count: analysis.splitTimes?.length || 0,
    },
    {
      id: "form",
      title: "Form Metrics",
      icon: <Activity className="w-5 h-5 text-green-500" />,
      count: analysis.formMetrics ? Object.keys(analysis.formMetrics).length : 0,
    },
    {
      id: "recommendations",
      title: "Recommendations",
      icon: <Target className="w-5 h-5 text-orange-500" />,
      count: analysis.recommendations?.length || 0,
    },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-gradient-to-r from-orange-500/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-white">AI Analysis Results</h3>
              <p className="text-zinc-500 text-sm">
                {analysis.status === "complete" ? "Analysis complete" : "Processing..."}
              </p>
            </div>
          </div>
          
          {/* Overall Score */}
          {analysis.formMetrics?.overallScore && (
            <div className="text-center">
              <div className="text-3xl font-black text-orange-500">
                {analysis.formMetrics.overallScore}
              </div>
              <div className="text-xs text-zinc-500">Overall Score</div>
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="divide-y divide-zinc-800">
        {sections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {section.icon}
                <span className="font-medium text-white">{section.title}</span>
                {section.count > 0 && (
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                    {section.count}
                  </span>
                )}
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="w-5 h-5 text-zinc-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-500" />
              )}
            </button>

            <AnimatePresence>
              {expandedSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    {/* Insights */}
                    {section.id === "insights" && analysis.insights && (
                      <div className="space-y-3">
                        {analysis.insights.map((insight, i) => (
                          <div
                            key={i}
                            className="flex gap-3 p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors"
                            onClick={() => insight.timestamp && onSeekToTimestamp?.(insight.timestamp)}
                          >
                            {getInsightIcon(insight.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-white">{insight.title}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(insight.category)}`}>
                                  {insight.category}
                                </span>
                              </div>
                              <p className="text-zinc-400 text-sm">{insight.description}</p>
                              {insight.metric && (
                                <div className="mt-2 flex items-center gap-2 text-xs">
                                  <span className="text-zinc-500">{insight.metric}:</span>
                                  <span className="text-orange-500 font-bold">{insight.value}</span>
                                  {insight.benchmark && (
                                    <span className="text-zinc-500">(Elite: {insight.benchmark})</span>
                                  )}
                                </div>
                              )}
                            </div>
                            {insight.timestamp && (
                              <span className="text-xs text-zinc-500 font-mono">
                                {formatTime(insight.timestamp)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Timing */}
                    {section.id === "timing" && (
                      <div className="space-y-4">
                        {analysis.reactionTime && (
                          <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-yellow-500" />
                              <span className="text-white">Reaction Time</span>
                            </div>
                            <span className="text-orange-500 font-mono font-bold">
                              {analysis.reactionTime.toFixed(3)}s
                            </span>
                          </div>
                        )}

                        {analysis.splitTimes && analysis.splitTimes.length > 0 && (
                          <div className="bg-zinc-800/50 rounded-lg p-3">
                            <h4 className="text-white font-medium mb-3">Split Times</h4>
                            <div className="space-y-2">
                              {analysis.splitTimes.map((split, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <span className="text-zinc-400">{split.distance}m</span>
                                  <div className="flex items-center gap-4">
                                    <span className="text-white font-mono">{split.time.toFixed(2)}s</span>
                                    <span className="text-zinc-500">{split.velocity.toFixed(1)} m/s</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {analysis.totalTime && (
                          <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-orange-500" />
                              <span className="text-white font-medium">Total Time</span>
                            </div>
                            <span className="text-orange-500 font-mono font-bold text-lg">
                              {analysis.totalTime.toFixed(2)}s
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Form Metrics */}
                    {section.id === "form" && analysis.formMetrics && (
                      <div className="space-y-4">
                        {/* Phase Scores */}
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Start", value: analysis.formMetrics.startScore, color: "purple" },
                            { label: "Drive Phase", value: analysis.formMetrics.drivePhaseScore, color: "orange" },
                            { label: "Top Speed", value: analysis.formMetrics.topSpeedScore, color: "green" },
                            { label: "Finish", value: analysis.formMetrics.finishScore, color: "blue" },
                          ].map((metric) => metric.value !== undefined && (
                            <div key={metric.label} className="bg-zinc-800/50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-zinc-400 text-sm">{metric.label}</span>
                                <span className="text-white font-bold">{metric.value}</span>
                              </div>
                              {renderMetricBar(metric.value, 100, metric.color)}
                            </div>
                          ))}
                        </div>

                        {/* Detailed Metrics */}
                        <div className="bg-zinc-800/50 rounded-lg p-3">
                          <h4 className="text-white font-medium mb-3">Biomechanics</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {analysis.formMetrics.strideLength && (
                              <div>
                                <span className="text-zinc-500">Stride Length</span>
                                <div className="text-white font-bold">{analysis.formMetrics.strideLength.toFixed(2)}m</div>
                              </div>
                            )}
                            {analysis.formMetrics.strideFrequency && (
                              <div>
                                <span className="text-zinc-500">Stride Frequency</span>
                                <div className="text-white font-bold">{analysis.formMetrics.strideFrequency.toFixed(1)} steps/s</div>
                              </div>
                            )}
                            {analysis.formMetrics.groundContactTime && (
                              <div>
                                <span className="text-zinc-500">Ground Contact</span>
                                <div className="text-white font-bold">{analysis.formMetrics.groundContactTime}ms</div>
                              </div>
                            )}
                            {analysis.formMetrics.flightTime && (
                              <div>
                                <span className="text-zinc-500">Flight Time</span>
                                <div className="text-white font-bold">{analysis.formMetrics.flightTime}ms</div>
                              </div>
                            )}
                            {analysis.formMetrics.trunkLean && (
                              <div>
                                <span className="text-zinc-500">Trunk Lean</span>
                                <div className="text-white font-bold">{analysis.formMetrics.trunkLean}°</div>
                              </div>
                            )}
                            {analysis.formMetrics.kneeAngle && (
                              <div>
                                <span className="text-zinc-500">Knee Angle</span>
                                <div className="text-white font-bold">{analysis.formMetrics.kneeAngle}°</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {section.id === "recommendations" && analysis.recommendations && (
                      <div className="space-y-2">
                        {analysis.recommendations.map((rec, i) => (
                          <div key={i} className="flex gap-3 p-3 bg-zinc-800/50 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-orange-500 text-xs font-bold">{i + 1}</span>
                            </div>
                            <p className="text-zinc-300 text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Comparison Score */}
      {analysis.comparisonScore !== undefined && (
        <div className="p-4 border-t border-zinc-800 bg-gradient-to-r from-blue-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Elite Comparison</h4>
              <p className="text-zinc-500 text-sm">How your form compares to elite athletes</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-blue-500">{analysis.comparisonScore}%</div>
              <div className="text-xs text-zinc-500">Match Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
