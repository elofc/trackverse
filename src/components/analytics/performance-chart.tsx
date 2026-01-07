"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Calendar,
  ChevronDown,
  Zap,
} from "lucide-react";
import { PerformanceDataPoint, PerformanceTrend } from "@/lib/analytics/types";
import { formatTime, calculatePerformanceTrend, predictPerformance } from "@/lib/analytics/calculations";

type PerformanceChartProps = {
  data: PerformanceDataPoint[];
  event: string;
  showPrediction?: boolean;
  height?: number;
};

export function PerformanceChart({
  data,
  event,
  showPrediction = true,
  height = 300,
}: PerformanceChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<PerformanceDataPoint | null>(null);
  const [showTrendline, setShowTrendline] = useState(true);

  const sortedData = useMemo(
    () => [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [data]
  );

  const trend = useMemo(() => calculatePerformanceTrend(sortedData), [sortedData]);

  const prediction = useMemo(() => {
    if (!showPrediction || sortedData.length < 3) return null;
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 2);
    return predictPerformance(sortedData, targetDate);
  }, [sortedData, showPrediction]);

  // Calculate chart dimensions
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = 100; // percentage
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const values = sortedData.map((d) => d.value);
  const minValue = Math.min(...values) * 0.98;
  const maxValue = Math.max(...values) * 1.02;
  const valueRange = maxValue - minValue;

  const getY = (value: number) => {
    return ((maxValue - value) / valueRange) * chartHeight + padding.top;
  };

  const getX = (index: number) => {
    if (sortedData.length === 1) return 50;
    return (index / (sortedData.length - 1)) * 80 + 10; // 10-90% range
  };

  // Generate path for line chart
  const linePath = sortedData
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)}% ${getY(d.value)}`)
    .join(" ");

  // Generate trendline
  const trendlinePath = useMemo(() => {
    if (sortedData.length < 2) return "";
    const firstY = getY(sortedData[0].value);
    const lastY = getY(sortedData[sortedData.length - 1].value);
    
    // Simple linear interpolation for trendline
    const avgFirst = sortedData.slice(0, Math.ceil(sortedData.length / 3)).reduce((a, b) => a + b.value, 0) / Math.ceil(sortedData.length / 3);
    const avgLast = sortedData.slice(-Math.ceil(sortedData.length / 3)).reduce((a, b) => a + b.value, 0) / Math.ceil(sortedData.length / 3);
    
    return `M 10% ${getY(avgFirst)} L 90% ${getY(avgLast)}`;
  }, [sortedData]);

  const getTrendIcon = () => {
    switch (trend.trendDirection) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "declining":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-zinc-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend.trendDirection) {
      case "improving":
        return "text-green-500";
      case "declining":
        return "text-red-500";
      default:
        return "text-zinc-500";
    }
  };

  const currentBest = Math.min(...values);
  const seasonBest = currentBest; // In real app, filter by season

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white">{event} Performance</h3>
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium capitalize">{trend.trendDirection}</span>
            </div>
          </div>
          <button
            onClick={() => setShowTrendline(!showTrendline)}
            className={`text-xs px-2 py-1 rounded ${
              showTrendline ? "bg-orange-500/20 text-orange-400" : "bg-zinc-800 text-zinc-400"
            }`}
          >
            Trendline
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-zinc-500">Current Best: </span>
            <span className="text-white font-mono">{formatTime(currentBest)}</span>
          </div>
          <div>
            <span className="text-zinc-500">Season Best: </span>
            <span className="text-orange-500 font-mono">{formatTime(seasonBest)}</span>
          </div>
          {prediction && (
            <div>
              <span className="text-zinc-500">Projected: </span>
              <span className="text-blue-400 font-mono">{formatTime(prediction.predicted)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height }}>
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const value = maxValue - ratio * valueRange;
            return (
              <g key={ratio}>
                <text
                  x={padding.left - 10}
                  y={padding.top + ratio * chartHeight}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="fill-zinc-500 text-xs"
                >
                  {formatTime(value)}
                </text>
                <line
                  x1={`${padding.left}px`}
                  y1={padding.top + ratio * chartHeight}
                  x2="95%"
                  y2={padding.top + ratio * chartHeight}
                  stroke="#27272a"
                  strokeDasharray="4"
                />
              </g>
            );
          })}

          {/* Trendline */}
          {showTrendline && trendlinePath && (
            <path
              d={trendlinePath}
              fill="none"
              stroke={trend.trendDirection === "improving" ? "#22c55e" : trend.trendDirection === "declining" ? "#ef4444" : "#71717a"}
              strokeWidth="2"
              strokeDasharray="6"
              opacity="0.5"
            />
          )}

          {/* Main line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Prediction line */}
          {prediction && showPrediction && sortedData.length > 0 && (
            <line
              x1="90%"
              y1={getY(sortedData[sortedData.length - 1].value)}
              x2="98%"
              y2={getY(prediction.predicted)}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="4"
              opacity="0.7"
            />
          )}

          {/* Data points */}
          {sortedData.map((point, i) => (
            <g key={i}>
              <motion.circle
                cx={`${getX(i)}%`}
                cy={getY(point.value)}
                r={hoveredPoint === point ? 8 : point.isPR ? 6 : 5}
                fill={point.isPR ? "#f97316" : "#18181b"}
                stroke={point.isPR ? "#fdba74" : "#f97316"}
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
              />
              {point.isPR && (
                <text
                  x={`${getX(i)}%`}
                  y={getY(point.value) - 15}
                  textAnchor="middle"
                  className="fill-orange-500 text-xs font-bold"
                >
                  PR
                </text>
              )}
            </g>
          ))}

          {/* Prediction point */}
          {prediction && showPrediction && (
            <circle
              cx="98%"
              cy={getY(prediction.predicted)}
              r="5"
              fill="#3b82f6"
              stroke="#93c5fd"
              strokeWidth="2"
              strokeDasharray="2"
            />
          )}

          {/* X-axis labels */}
          {sortedData.filter((_, i) => i % Math.ceil(sortedData.length / 5) === 0 || i === sortedData.length - 1).map((point, i, arr) => {
            const originalIndex = sortedData.indexOf(point);
            return (
              <text
                key={i}
                x={`${getX(originalIndex)}%`}
                y={height - 10}
                textAnchor="middle"
                className="fill-zinc-500 text-xs"
              >
                {new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </text>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl z-10 pointer-events-none"
            style={{
              left: `${getX(sortedData.indexOf(hoveredPoint))}%`,
              top: getY(hoveredPoint.value) - 80,
              transform: "translateX(-50%)",
            }}
          >
            <div className="text-white font-mono text-lg">{formatTime(hoveredPoint.value)}</div>
            <div className="text-zinc-400 text-xs">
              {new Date(hoveredPoint.date).toLocaleDateString()}
            </div>
            {hoveredPoint.meetName && (
              <div className="text-zinc-500 text-xs mt-1">{hoveredPoint.meetName}</div>
            )}
            {hoveredPoint.isPR && (
              <div className="text-orange-500 text-xs font-bold mt-1">Personal Record!</div>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer with insights */}
      {trend.averageImprovement !== 0 && (
        <div className="p-4 border-t border-zinc-800 bg-zinc-800/30">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-zinc-400">
              {trend.trendDirection === "improving" ? (
                <>
                  Improving by <span className="text-green-500 font-medium">{Math.abs(trend.averageImprovement).toFixed(2)}s</span> per month on average
                </>
              ) : trend.trendDirection === "declining" ? (
                <>
                  Performance declining by <span className="text-red-500 font-medium">{Math.abs(trend.averageImprovement).toFixed(2)}s</span> per month
                </>
              ) : (
                "Performance is stable"
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Mini performance sparkline
type PerformanceSparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
};

export function PerformanceSparkline({
  data,
  width = 100,
  height = 30,
  color = "#f97316",
}: PerformanceSparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
