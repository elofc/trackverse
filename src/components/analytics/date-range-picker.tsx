"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DateRange } from "@/lib/analytics/types";

type DateRangePickerProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
};

const PRESETS: Array<{ id: DateRange["preset"]; label: string }> = [
  { id: "week", label: "Last 7 Days" },
  { id: "month", label: "Last 30 Days" },
  { id: "quarter", label: "Last 3 Months" },
  { id: "season", label: "This Season" },
  { id: "year", label: "Last Year" },
  { id: "all", label: "All Time" },
  { id: "custom", label: "Custom Range" },
];

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(value.preset === "custom");
  const [customStart, setCustomStart] = useState(value.start);
  const [customEnd, setCustomEnd] = useState(value.end);

  const getPresetDates = (preset: DateRange["preset"]): { start: string; end: string } => {
    const end = new Date();
    const start = new Date();

    switch (preset) {
      case "week":
        start.setDate(end.getDate() - 7);
        break;
      case "month":
        start.setDate(end.getDate() - 30);
        break;
      case "quarter":
        start.setMonth(end.getMonth() - 3);
        break;
      case "season":
        // Assume track season starts in September
        const currentMonth = end.getMonth();
        if (currentMonth >= 8) {
          start.setMonth(8, 1); // September 1st of current year
        } else {
          start.setFullYear(end.getFullYear() - 1, 8, 1); // September 1st of last year
        }
        break;
      case "year":
        start.setFullYear(end.getFullYear() - 1);
        break;
      case "all":
        start.setFullYear(2020, 0, 1);
        break;
      default:
        break;
    }

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  };

  const handlePresetSelect = (preset: DateRange["preset"]) => {
    if (preset === "custom") {
      setShowCustom(true);
      return;
    }

    const dates = getPresetDates(preset);
    onChange({ ...dates, preset });
    setIsOpen(false);
    setShowCustom(false);
  };

  const handleCustomApply = () => {
    onChange({
      start: customStart,
      end: customEnd,
      preset: "custom",
    });
    setIsOpen(false);
  };

  const getDisplayLabel = () => {
    if (value.preset && value.preset !== "custom") {
      return PRESETS.find((p) => p.id === value.preset)?.label || "Select Range";
    }
    return `${formatDate(value.start)} - ${formatDate(value.end)}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:bg-zinc-700 transition-colors"
      >
        <Calendar className="w-4 h-4 text-orange-500" />
        <span className="text-sm">{getDisplayLabel()}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 right-0 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-2 min-w-[200px]">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                    ${value.preset === preset.id
                      ? "bg-orange-500 text-white"
                      : "text-zinc-300 hover:bg-zinc-800"
                    }
                  `}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {showCustom && (
              <div className="p-4 border-t border-zinc-800">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Start Date</label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">End Date</label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    onClick={handleCustomApply}
                    className="w-full py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Quick Date Tabs
type DateTabsProps = {
  value: DateRange["preset"];
  onChange: (preset: DateRange["preset"]) => void;
  options?: Array<DateRange["preset"]>;
};

export function DateTabs({
  value,
  onChange,
  options = ["week", "month", "quarter", "year"],
}: DateTabsProps) {
  const labels: Record<string, string> = {
    week: "Week",
    month: "Month",
    quarter: "Quarter",
    season: "Season",
    year: "Year",
    all: "All",
  };

  return (
    <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-colors
            ${value === option
              ? "bg-orange-500 text-white"
              : "text-zinc-400 hover:text-white"
            }
          `}
        >
          {labels[option || ""] || option}
        </button>
      ))}
    </div>
  );
}
