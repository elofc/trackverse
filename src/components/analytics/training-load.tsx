"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { TrainingLoad } from "@/lib/analytics/types";
import { calculateACWR } from "@/lib/analytics/calculations";

type TrainingLoadChartProps = {
  data: TrainingLoad[];
  height?: number;
};

export function TrainingLoadChart({ data, height = 250 }: TrainingLoadChartProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const sortedData = useMemo(
    () => [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [data]
  );

  const latestData = sortedData[sortedData.length - 1];
  const acwrStatus = latestData ? calculateACWR(sortedData.map(d => d.trainingStress)) : { acwr: 1, risk: "optimal" as const };

  // Calculate max values for scaling
  const maxLoad = Math.max(...sortedData.map(d => Math.max(d.acuteLoad, d.chronicLoad)));

  const getBarHeight = (value: number) => {
    return (value / maxLoad) * (height - 60);
  };

  const getACWRColor = (acwr: number) => {
    if (acwr >= 0.8 && acwr <= 1.3) return "text-green-500";
    if (acwr >= 0.5 && acwr <= 1.5) return "text-yellow-500";
    return "text-red-500";
  };

  const getACWRBg = (acwr: number) => {
    if (acwr >= 0.8 && acwr <= 1.3) return "bg-green-500/20 border-green-500/30";
    if (acwr >= 0.5 && acwr <= 1.5) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-white">Training Load</h3>
          </div>
          
          {/* ACWR Badge */}
          {latestData && (
            <div className={`px-3 py-1 rounded-full border ${getACWRBg(latestData.acwr)}`}>
              <span className={`text-sm font-medium ${getACWRColor(latestData.acwr)}`}>
                ACWR: {latestData.acwr.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span className="text-zinc-400">Acute (7-day)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-zinc-400">Chronic (28-day)</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4" style={{ height }}>
        <div className="relative h-full flex items-end gap-1">
          {sortedData.slice(-14).map((day, i) => {
            const isHovered = hoveredDay === i;
            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
                onMouseEnter={() => setHoveredDay(i)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Bars */}
                <div className="relative w-full flex gap-0.5 items-end" style={{ height: height - 80 }}>
                  {/* Acute Load Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: getBarHeight(day.acuteLoad) }}
                    className={`flex-1 rounded-t ${isHovered ? "bg-orange-400" : "bg-orange-500"}`}
                    transition={{ delay: i * 0.02 }}
                  />
                  {/* Chronic Load Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: getBarHeight(day.chronicLoad) }}
                    className={`flex-1 rounded-t ${isHovered ? "bg-blue-400" : "bg-blue-500"}`}
                    transition={{ delay: i * 0.02 }}
                  />
                </div>

                {/* Date Label */}
                <span className="text-xs text-zinc-500">
                  {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }).charAt(0)}
                </span>

                {/* Tooltip */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl z-10 whitespace-nowrap"
                  >
                    <div className="text-white text-sm font-medium mb-2">
                      {new Date(day.date).toLocaleDateString()}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between gap-4">
                        <span className="text-orange-400">Acute:</span>
                        <span className="text-white">{day.acuteLoad.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-blue-400">Chronic:</span>
                        <span className="text-white">{day.chronicLoad.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between gap-4 pt-1 border-t border-zinc-700">
                        <span className={getACWRColor(day.acwr)}>ACWR:</span>
                        <span className={getACWRColor(day.acwr)}>{day.acwr.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Footer */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-800/30">
        <div className="flex items-center gap-2">
          {acwrStatus.risk === "optimal" ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-zinc-400">
                Training load is in the <span className="text-green-500 font-medium">optimal zone</span>
              </span>
            </>
          ) : acwrStatus.risk === "caution" ? (
            <>
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-zinc-400">
                Training load requires <span className="text-yellow-500 font-medium">attention</span>
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-zinc-400">
                Training load is in the <span className="text-red-500 font-medium">danger zone</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact Training Load Widget
type TrainingLoadWidgetProps = {
  acuteLoad: number;
  chronicLoad: number;
  acwr: number;
};

export function TrainingLoadWidget({ acuteLoad, chronicLoad, acwr }: TrainingLoadWidgetProps) {
  const getStatus = () => {
    if (acwr >= 0.8 && acwr <= 1.3) return { label: "Optimal", color: "green" };
    if (acwr >= 0.5 && acwr <= 1.5) return { label: "Caution", color: "yellow" };
    return { label: "High Risk", color: "red" };
  };

  const status = getStatus();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-5 h-5 text-orange-500" />
        <h3 className="font-bold text-white">Training Load</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <div className="text-xl font-bold text-orange-500">{acuteLoad.toFixed(0)}</div>
          <div className="text-xs text-zinc-500">Acute</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-500">{chronicLoad.toFixed(0)}</div>
          <div className="text-xs text-zinc-500">Chronic</div>
        </div>
        <div className="text-center">
          <div className={`text-xl font-bold text-${status.color}-500`}>{acwr.toFixed(2)}</div>
          <div className="text-xs text-zinc-500">ACWR</div>
        </div>
      </div>

      <div className={`
        flex items-center justify-center gap-2 py-2 rounded-lg
        bg-${status.color}-500/20 border border-${status.color}-500/30
      `}
        style={{
          backgroundColor: status.color === "green" ? "rgba(34, 197, 94, 0.2)" : status.color === "yellow" ? "rgba(234, 179, 8, 0.2)" : "rgba(239, 68, 68, 0.2)",
          borderColor: status.color === "green" ? "rgba(34, 197, 94, 0.3)" : status.color === "yellow" ? "rgba(234, 179, 8, 0.3)" : "rgba(239, 68, 68, 0.3)",
        }}
      >
        {status.color === "green" ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <AlertTriangle className={`w-4 h-4 text-${status.color}-500`} style={{ color: status.color === "yellow" ? "#eab308" : "#ef4444" }} />
        )}
        <span className="text-sm font-medium" style={{ color: status.color === "green" ? "#22c55e" : status.color === "yellow" ? "#eab308" : "#ef4444" }}>
          {status.label}
        </span>
      </div>
    </div>
  );
}
