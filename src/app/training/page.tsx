"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TierBadge } from "@/components/trackverse/tier-badge";
import { Tier } from "@/lib/rankings";
import {
  Dumbbell,
  Calendar,
  TrendingUp,
  Flame,
  CheckCircle2,
  Clock,
  Zap,
  ChevronRight,
  X,
  Check,
  Sparkles,
} from "lucide-react";

// Quick workout types - one tap to log
const QUICK_WORKOUTS = [
  { id: "sprint", emoji: "⚡", label: "Sprints", color: "orange" },
  { id: "tempo", emoji: "🏃", label: "Tempo", color: "blue" },
  { id: "distance", emoji: "🛤️", label: "Distance", color: "green" },
  { id: "plyo", emoji: "🦘", label: "Plyo", color: "purple" },
  { id: "lift", emoji: "💪", label: "Strength", color: "red" },
  { id: "recovery", emoji: "🧘", label: "Recovery", color: "cyan" },
];

// Recent workouts (mock data)
const recentWorkouts = [
  { id: "w1", type: "sprint", emoji: "⚡", title: "Sprint Day", date: "Today", effort: 8 },
  { id: "w2", type: "tempo", emoji: "🏃", title: "Tempo Run", date: "Yesterday", effort: 6 },
  { id: "w3", type: "plyo", emoji: "🦘", title: "Plyometrics", date: "2 days ago", effort: 7 },
  { id: "w4", type: "recovery", emoji: "🧘", title: "Recovery", date: "3 days ago", effort: 3 },
];

export default function TrainingPage() {
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [effort, setEffort] = useState(5);
  const [justLogged, setJustLogged] = useState(false);

  const handleQuickLog = (workoutId: string) => {
    setSelectedWorkout(workoutId);
  };

  const handleConfirmLog = () => {
    // In real app, save to database
    setJustLogged(true);
    setTimeout(() => {
      setShowQuickLog(false);
      setSelectedWorkout(null);
      setEffort(5);
      setJustLogged(false);
    }, 1500);
  };

  const stats = {
    streak: 12,
    weeklyWorkouts: 4,
    weeklyGoal: 5,
    totalThisMonth: 18,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Simple Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-1">Training</h1>
          <p className="text-white/50 text-sm">Tap to log your workout</p>
        </div>

        {/* Streak & Progress - Simple */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-3xl font-black text-orange-500">
              <Flame className="w-7 h-7" />
              {stats.streak}
            </div>
            <p className="text-xs text-white/50">day streak</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-3xl font-black text-white">
              {stats.weeklyWorkouts}<span className="text-white/30">/{stats.weeklyGoal}</span>
            </div>
            <p className="text-xs text-white/50">this week</p>
          </div>
        </div>

        {/* Quick Log Button - Big & Obvious */}
        <motion.button
          onClick={() => setShowQuickLog(true)}
          className="w-full py-6 mb-8 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-orange-500/30"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap className="w-6 h-6" />
          LOG WORKOUT
        </motion.button>

        {/* This Week - Simple Calendar */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                This Week
              </h2>
              <span className="text-xs text-white/50">{stats.weeklyWorkouts} workouts</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                const isCompleted = i < stats.weeklyWorkouts;
                const isToday = i === 4; // Friday
                return (
                  <div key={i} className="text-center">
                    <p className="text-xs text-white/40 mb-1">{day}</p>
                    <div
                      className={`
                        w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm
                        ${isCompleted ? "bg-green-500 text-white" : 
                          isToday ? "border-2 border-orange-500 text-orange-500" : 
                          "bg-white/5 text-white/30"}
                      `}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Workouts - Compact */}
        <div className="mb-6">
          <h2 className="font-bold text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/50" />
            Recent
          </h2>
          <div className="space-y-2">
            {recentWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
              >
                <span className="text-2xl">{workout.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium text-white text-sm">{workout.title}</p>
                  <p className="text-xs text-white/40">{workout.date}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-3 rounded-full ${
                        i < workout.effort ? "bg-orange-500" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PR Progress - Simplified */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              PR Progress
            </h2>
            <div className="space-y-3">
              {[
                { event: "100m", current: "11.25", target: "11.00", progress: 75, tier: "ELITE" as Tier },
                { event: "200m", current: "22.80", target: "22.00", progress: 60, tier: "ALL_STATE" as Tier },
              ].map((pr, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{pr.event}</span>
                      <TierBadge tier={pr.tier} size="sm" showEmoji={false} />
                    </div>
                    <span className="text-xs text-white/50 font-mono">
                      {pr.current} → <span className="text-green-400">{pr.target}</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
                      style={{ width: `${pr.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Log Modal */}
        <AnimatePresence>
          {showQuickLog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
              onClick={() => !selectedWorkout && setShowQuickLog(false)}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="w-full max-w-md bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {!justLogged ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                      <h2 className="font-bold text-white text-lg">
                        {selectedWorkout ? "How hard?" : "What did you do?"}
                      </h2>
                      <button
                        onClick={() => {
                          if (selectedWorkout) {
                            setSelectedWorkout(null);
                          } else {
                            setShowQuickLog(false);
                          }
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg"
                      >
                        <X className="w-5 h-5 text-white/50" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {!selectedWorkout ? (
                        // Step 1: Select workout type
                        <div className="grid grid-cols-3 gap-3">
                          {QUICK_WORKOUTS.map((workout) => (
                            <motion.button
                              key={workout.id}
                              onClick={() => handleQuickLog(workout.id)}
                              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors text-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span className="text-3xl block mb-2">{workout.emoji}</span>
                              <span className="text-sm text-white">{workout.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        // Step 2: Select effort (1-10)
                        <div>
                          <p className="text-center text-white/50 text-sm mb-4">
                            Rate your effort (1-10)
                          </p>
                          
                          {/* Effort Slider */}
                          <div className="flex items-center justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                              <button
                                key={level}
                                onClick={() => setEffort(level)}
                                className={`
                                  w-8 h-12 rounded-lg font-bold text-sm transition-all
                                  ${level <= effort
                                    ? level <= 3 ? "bg-green-500 text-white" :
                                      level <= 6 ? "bg-yellow-500 text-black" :
                                      level <= 8 ? "bg-orange-500 text-white" :
                                      "bg-red-500 text-white"
                                    : "bg-white/10 text-white/30"
                                  }
                                `}
                              >
                                {level}
                              </button>
                            ))}
                          </div>

                          <p className="text-center text-2xl font-black text-white mb-6">
                            {effort <= 3 ? "Easy 😌" :
                             effort <= 5 ? "Moderate 💪" :
                             effort <= 7 ? "Hard 🔥" :
                             effort <= 9 ? "Very Hard 😤" :
                             "Max Effort 🏆"}
                          </p>

                          {/* Confirm Button */}
                          <Button
                            onClick={handleConfirmLog}
                            className="w-full py-6 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500"
                          >
                            <Check className="w-5 h-5 mr-2" />
                            Log It!
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  // Success State
                  <div className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10 }}
                      className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <Check className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-black text-white mb-2">Logged! 🎉</h2>
                    <p className="text-white/50">Keep up the great work!</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-orange-500">
                      <Flame className="w-5 h-5" />
                      <span className="font-bold">{stats.streak + 1} day streak!</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
