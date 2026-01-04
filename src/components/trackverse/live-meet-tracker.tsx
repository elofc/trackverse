"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Timer, 
  Trophy, 
  Users, 
  MapPin, 
  Zap,
  ChevronRight,
  Medal,
} from "lucide-react";
import { useSocketStore, MeetResult } from "@/lib/socket/client";

type LiveEvent = {
  id: string;
  name: string;
  status: "upcoming" | "in_progress" | "completed";
  startTime?: string;
  results?: MeetResult[];
};

type LiveMeetTrackerProps = {
  meetId: string;
  meetName: string;
  location: string;
  events: LiveEvent[];
};

export function LiveMeetTracker({ meetId, meetName, location, events }: LiveMeetTrackerProps) {
  const { joinRoom, leaveRoom } = useSocketStore();
  const recentEvents = useSocketStore((state) => state.recentEvents);
  const [liveResults, setLiveResults] = useState<MeetResult[]>([]);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);

  // Join meet room on mount
  useEffect(() => {
    joinRoom(`meet:${meetId}`);
    return () => {
      leaveRoom(`meet:${meetId}`);
    };
  }, [meetId, joinRoom, leaveRoom]);

  // Listen for meet results
  useEffect(() => {
    const meetResults = recentEvents.filter(
      (e) => e.type === "MEET_RESULT" && e.meetId === meetId
    );
    
    if (meetResults.length > 0) {
      const latestResult = meetResults[0] as { type: "MEET_RESULT"; meetId: string; result: MeetResult };
      setLiveResults((prev) => [latestResult.result, ...prev]);
    }
  }, [recentEvents, meetId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-green-500";
      case "completed":
        return "bg-zinc-500";
      default:
        return "bg-orange-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in_progress":
        return "LIVE";
      case "completed":
        return "FINAL";
      default:
        return "UPCOMING";
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-400 font-bold uppercase">Live Meet</span>
            </div>
            <h3 className="text-lg font-bold text-white">{meetName}</h3>
            <div className="flex items-center gap-1 text-zinc-400 text-sm mt-1">
              <MapPin className="w-3 h-3" />
              {location}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-400 text-sm">24 athletes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="divide-y divide-zinc-800">
        {events.map((event) => (
          <div
            key={event.id}
            className={`p-4 cursor-pointer transition-colors ${
              activeEvent === event.id ? "bg-zinc-800/50" : "hover:bg-zinc-800/30"
            }`}
            onClick={() => setActiveEvent(activeEvent === event.id ? null : event.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`} />
                <div>
                  <div className="font-medium text-white">{event.name}</div>
                  {event.startTime && (
                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {event.startTime}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  event.status === "in_progress" 
                    ? "bg-green-500/20 text-green-400" 
                    : event.status === "completed"
                    ? "bg-zinc-700 text-zinc-400"
                    : "bg-orange-500/20 text-orange-400"
                }`}>
                  {getStatusText(event.status)}
                </span>
                <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${
                  activeEvent === event.id ? "rotate-90" : ""
                }`} />
              </div>
            </div>

            {/* Expanded Results */}
            <AnimatePresence>
              {activeEvent === event.id && event.results && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 space-y-2 overflow-hidden"
                >
                  {event.results.map((result, index) => (
                    <div
                      key={result.athleteId}
                      className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? "bg-yellow-500 text-black" :
                          index === 1 ? "bg-zinc-400 text-black" :
                          index === 2 ? "bg-orange-700 text-white" :
                          "bg-zinc-700 text-zinc-300"
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-white text-sm">{result.athleteName}</span>
                        {result.isPR && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                            PR
                          </span>
                        )}
                      </div>
                      <span className="text-orange-500 font-mono font-bold">
                        {result.time}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Live Results Feed */}
      {liveResults.length > 0 && (
        <div className="border-t border-zinc-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-white">Latest Results</span>
          </div>
          <div className="space-y-2">
            {liveResults.slice(0, 3).map((result, index) => (
              <motion.div
                key={`${result.athleteId}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <Medal className="w-4 h-4 text-yellow-500" />
                  <span className="text-white">{result.athleteName}</span>
                  <span className="text-zinc-500">#{result.place}</span>
                </div>
                <span className="text-orange-500 font-mono">{result.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
