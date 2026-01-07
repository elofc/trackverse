"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/trackverse/navbar";
import {
  Skeleton,
  CardSkeleton,
  FeedSkeleton,
  TableSkeleton,
  WorkoutCardSkeleton,
  ChartSkeleton,
  LeaderboardSkeleton,
} from "@/components/ui/skeleton";
import {
  StaggerContainer,
  StaggerItem,
  RevealOnScroll,
  HoverScale,
  FloatingElement,
  LoadingSpinner,
} from "@/components/ui/page-transition";
import {
  Confetti,
  PRCelebration,
  StreakCelebration,
  BadgeUnlock,
  LevelUp,
  Toast,
} from "@/components/ui/celebrations";
import { AccessibilitySettings, AccessibilityProvider } from "@/components/ui/accessibility";
import { Trophy, Flame, Star, Medal } from "lucide-react";

export default function PolishDemoPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPRCelebration, setShowPRCelebration] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error" | "info" | "warning">("success");

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Polish & Performance Demo</h1>
          <p className="text-zinc-400">Interactive showcase of UI polish components</p>
        </div>

        {/* Celebrations Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">🎉 Celebrations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              onClick={() => setShowConfetti(true)}
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-500/50 transition-colors text-center"
            >
              <span className="text-2xl block mb-2">🎊</span>
              <span className="text-sm text-white">Confetti</span>
            </button>

            <button
              onClick={() => setShowPRCelebration(true)}
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-500/50 transition-colors text-center"
            >
              <Trophy className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <span className="text-sm text-white">PR Celebration</span>
            </button>

            <button
              onClick={() => setShowStreak(true)}
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-500/50 transition-colors text-center"
            >
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <span className="text-sm text-white">Streak</span>
            </button>

            <button
              onClick={() => setShowBadge(true)}
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-500/50 transition-colors text-center"
            >
              <Medal className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <span className="text-sm text-white">Badge Unlock</span>
            </button>

            <button
              onClick={() => setShowLevelUp(true)}
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-500/50 transition-colors text-center"
            >
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <span className="text-sm text-white">Level Up</span>
            </button>

            <button
              onClick={() => {
                setToastType(["success", "error", "info", "warning"][Math.floor(Math.random() * 4)] as typeof toastType);
                setShowToast(true);
              }}
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-500/50 transition-colors text-center"
            >
              <span className="text-2xl block mb-2">💬</span>
              <span className="text-sm text-white">Toast</span>
            </button>
          </div>
        </section>

        {/* Skeleton Loading Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">💀 Skeleton Loading</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-zinc-400 mb-3">Card Skeleton</h3>
              <CardSkeleton />
            </div>

            <div>
              <h3 className="text-sm text-zinc-400 mb-3">Workout Card Skeleton</h3>
              <WorkoutCardSkeleton />
            </div>

            <div>
              <h3 className="text-sm text-zinc-400 mb-3">Chart Skeleton</h3>
              <ChartSkeleton height={150} />
            </div>

            <div>
              <h3 className="text-sm text-zinc-400 mb-3">Table Skeleton</h3>
              <TableSkeleton rows={3} cols={3} />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm text-zinc-400 mb-3">Leaderboard Skeleton</h3>
            <LeaderboardSkeleton rows={5} />
          </div>
        </section>

        {/* Animations Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">✨ Animations</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-sm text-zinc-400 mb-3">Staggered Items</h3>
              <StaggerContainer className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <StaggerItem key={i}>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white">
                      Item {i}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            <div>
              <h3 className="text-sm text-zinc-400 mb-3">Hover Scale</h3>
              <HoverScale>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center cursor-pointer">
                  <span className="text-white font-medium">Hover me!</span>
                </div>
              </HoverScale>
            </div>

            <div>
              <h3 className="text-sm text-zinc-400 mb-3">Floating Element</h3>
              <div className="flex justify-center">
                <FloatingElement>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                </FloatingElement>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-zinc-400 mb-3">Reveal on Scroll (scroll down)</h3>
            <div className="space-y-4">
              {["up", "left", "right"].map((dir) => (
                <RevealOnScroll key={dir} direction={dir as "up" | "left" | "right"}>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <span className="text-white">Revealed from {dir}</span>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Loading Spinners */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">⏳ Loading States</h2>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <LoadingSpinner size={24} />
              <p className="text-xs text-zinc-500 mt-2">Small</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size={32} />
              <p className="text-xs text-zinc-500 mt-2">Medium</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size={48} />
              <p className="text-xs text-zinc-500 mt-2">Large</p>
            </div>
          </div>
        </section>

        {/* Accessibility Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">♿ Accessibility</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <AccessibilityProvider>
              <AccessibilitySettings />
            </AccessibilityProvider>
          </div>
        </section>

        {/* Celebration Modals */}
        <Confetti isActive={showConfetti} duration={3000} />
        {showConfetti && (
          <div className="fixed inset-0 z-30" onClick={() => setShowConfetti(false)} />
        )}

        <PRCelebration
          isOpen={showPRCelebration}
          onClose={() => setShowPRCelebration(false)}
          event="100m"
          newTime="10.85"
          previousTime="11.02"
          improvement="0.17"
        />

        <StreakCelebration
          isOpen={showStreak}
          onClose={() => setShowStreak(false)}
          streakCount={7}
          streakType="workout"
        />

        <BadgeUnlock
          isOpen={showBadge}
          onClose={() => setShowBadge(false)}
          badge={{
            name: "Speed Demon",
            description: "Complete 10 sprint workouts",
            icon: "⚡",
            rarity: "epic",
          }}
        />

        <LevelUp
          isOpen={showLevelUp}
          onClose={() => setShowLevelUp(false)}
          newLevel={15}
          xpGained={250}
        />

        <Toast
          message={`This is a ${toastType} message!`}
          type={toastType}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      </main>
    </div>
  );
}
