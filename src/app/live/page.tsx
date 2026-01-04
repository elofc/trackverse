"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Users, 
  Trophy, 
  Calendar,
  Radio,
  TrendingUp,
  Flame,
} from "lucide-react";
import { Navbar } from "@/components/trackverse/navbar";
import { LiveFeed } from "@/components/trackverse/live-feed";
import { OnlineUsers } from "@/components/trackverse/online-users";
import { LiveMeetTracker } from "@/components/trackverse/live-meet-tracker";
import { useSocketStore } from "@/lib/socket/client";

// Mock live meet data
const liveMeet = {
  meetId: "meet-001",
  meetName: "Regional Championships",
  location: "Memorial Stadium",
  events: [
    {
      id: "e1",
      name: "100m Finals",
      status: "completed" as const,
      startTime: "2:30 PM",
      results: [
        { athleteId: "a1", athleteName: "Elias Bolt", event: "100m", place: 1, time: "10.15", isPR: true },
        { athleteId: "a2", athleteName: "Marcus Johnson", event: "100m", place: 2, time: "10.28", isPR: false },
        { athleteId: "a3", athleteName: "Devon Williams", event: "100m", place: 3, time: "10.35", isPR: true },
      ],
    },
    {
      id: "e2",
      name: "200m Semifinals",
      status: "in_progress" as const,
      startTime: "3:00 PM",
      results: [],
    },
    {
      id: "e3",
      name: "400m Finals",
      status: "upcoming" as const,
      startTime: "3:30 PM",
      results: [],
    },
    {
      id: "e4",
      name: "4x100m Relay",
      status: "upcoming" as const,
      startTime: "4:00 PM",
      results: [],
    },
  ],
};

export default function LivePage() {
  const isConnected = useSocketStore((state) => state.isConnected);
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  const [activeTab, setActiveTab] = useState<"feed" | "meets">("feed");

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <Radio className="w-8 h-8 text-orange-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
            <h1 className="text-3xl font-black text-white">Live</h1>
          </div>
          <p className="text-zinc-400">Real-time updates from the TrackVerse community</p>
        </div>

        {/* Connection Status */}
        <div className="mb-6 flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            isConnected 
              ? "bg-green-500/20 border border-green-500/30" 
              : "bg-red-500/20 border border-red-500/30"
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`} />
            <span className={`text-sm font-medium ${
              isConnected ? "text-green-400" : "text-red-400"
            }`}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-zinc-400">
            <Users className="w-4 h-4" />
            <span className="text-sm">{onlineUsers.length} online</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "feed"
                ? "bg-orange-500 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            <Flame className="w-4 h-4" />
            Activity Feed
          </button>
          <button
            onClick={() => setActiveTab("meets")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "meets"
                ? "bg-orange-500 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Live Meets
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "feed" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <LiveFeed maxItems={15} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <LiveMeetTracker {...liveMeet} />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Online Users */}
            <OnlineUsers maxVisible={8} />

            {/* Quick Stats */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                Today's Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">PRs Set</span>
                  <span className="text-orange-500 font-bold">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Workouts Logged</span>
                  <span className="text-orange-500 font-bold">312</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Meet Results</span>
                  <span className="text-orange-500 font-bold">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Rank Changes</span>
                  <span className="text-orange-500 font-bold">156</span>
                </div>
              </div>
            </div>

            {/* Trending Events */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Trending Events
              </h3>
              <div className="space-y-2">
                {["100m", "200m", "400m", "Long Jump", "Shot Put"].map((event, i) => (
                  <div 
                    key={event}
                    className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-sm">#{i + 1}</span>
                      <span className="text-white text-sm">{event}</span>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {Math.floor(Math.random() * 50) + 10} updates
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
