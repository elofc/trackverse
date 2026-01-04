"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Trophy, 
  Dumbbell, 
  Calendar, 
  Heart, 
  MessageCircle,
  TrendingUp,
  Flame,
} from "lucide-react";
import { useSocketStore, RealtimeEvent, FeedPost } from "@/lib/socket/client";

type LiveFeedItemProps = {
  event: RealtimeEvent;
  isNew?: boolean;
};

function LiveFeedItem({ event, isNew }: LiveFeedItemProps) {
  const getEventIcon = () => {
    switch (event.type) {
      case "NEW_PR":
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case "RANK_CHANGE":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "WORKOUT_COMPLETE":
        return <Dumbbell className="w-5 h-5 text-orange-500" />;
      case "MEET_RESULT":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "NEW_POST":
        return <Zap className="w-5 h-5 text-purple-500" />;
      case "POST_LIKE":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "POST_COMMENT":
        return <MessageCircle className="w-5 h-5 text-cyan-500" />;
      default:
        return <Zap className="w-5 h-5 text-zinc-500" />;
    }
  };

  const getEventContent = () => {
    switch (event.type) {
      case "NEW_PR":
        return (
          <div>
            <span className="font-bold text-white">{event.athleteName}</span>
            <span className="text-zinc-400"> set a new PR in </span>
            <span className="text-orange-500 font-bold">{event.event}</span>
            <span className="text-zinc-400">: </span>
            <span className="text-green-400 font-bold">{event.time}</span>
          </div>
        );
      case "RANK_CHANGE":
        const direction = event.newRank < event.oldRank ? "up" : "down";
        const color = direction === "up" ? "text-green-400" : "text-red-400";
        return (
          <div>
            <span className="font-bold text-white">{event.athleteName}</span>
            <span className="text-zinc-400"> moved </span>
            <span className={color}>
              {direction} to #{event.newRank}
            </span>
            <span className="text-zinc-400"> in {event.event}</span>
          </div>
        );
      case "WORKOUT_COMPLETE":
        return (
          <div>
            <span className="font-bold text-white">{event.athleteName}</span>
            <span className="text-zinc-400"> completed </span>
            <span className="text-orange-500">{event.workout.name}</span>
            <span className="text-zinc-500 text-sm ml-2">
              +{event.workout.xpEarned} XP
            </span>
          </div>
        );
      case "MEET_RESULT":
        return (
          <div>
            <span className="font-bold text-white">{event.result.athleteName}</span>
            <span className="text-zinc-400"> placed </span>
            <span className="text-yellow-500 font-bold">#{event.result.place}</span>
            <span className="text-zinc-400"> in {event.result.event}</span>
            {event.result.isPR && (
              <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                PR!
              </span>
            )}
          </div>
        );
      case "NEW_POST":
        return (
          <div>
            <span className="font-bold text-white">{event.post.authorName}</span>
            <span className="text-zinc-400"> posted: </span>
            <span className="text-zinc-300 truncate max-w-[200px] inline-block align-bottom">
              {event.post.content.slice(0, 50)}...
            </span>
          </div>
        );
      case "POST_LIKE":
        return (
          <div>
            <span className="font-bold text-white">{event.userName}</span>
            <span className="text-zinc-400"> liked a post</span>
          </div>
        );
      case "POST_COMMENT":
        return (
          <div>
            <span className="font-bold text-white">{event.userName}</span>
            <span className="text-zinc-400"> commented: </span>
            <span className="text-zinc-300">{event.comment.slice(0, 30)}...</span>
          </div>
        );
      case "USER_ONLINE":
        return (
          <div>
            <span className="font-bold text-white">{event.userName}</span>
            <span className="text-green-400"> is now online</span>
          </div>
        );
      case "USER_OFFLINE":
        return (
          <div>
            <span className="font-bold text-white">{event.userName}</span>
            <span className="text-zinc-500"> went offline</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: "auto" }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        isNew 
          ? "bg-orange-500/10 border-orange-500/30" 
          : "bg-zinc-900/50 border-zinc-800"
      }`}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
        {getEventIcon()}
      </div>
      <div className="flex-1 min-w-0 text-sm">
        {getEventContent()}
      </div>
      {isNew && (
        <div className="flex-shrink-0">
          <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full animate-pulse">
            LIVE
          </span>
        </div>
      )}
    </motion.div>
  );
}

type LiveFeedProps = {
  maxItems?: number;
  showHeader?: boolean;
};

export function LiveFeed({ maxItems = 10, showHeader = true }: LiveFeedProps) {
  const recentEvents = useSocketStore((state) => state.recentEvents);
  const isConnected = useSocketStore((state) => state.isConnected);
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set());

  // Mark new events and clear after animation
  useEffect(() => {
    if (recentEvents.length > 0) {
      const latestEvent = recentEvents[0];
      const eventId = `${latestEvent.type}-${Date.now()}`;
      
      setNewEventIds((prev) => new Set([...prev, eventId]));
      
      setTimeout(() => {
        setNewEventIds((prev) => {
          const next = new Set(prev);
          next.delete(eventId);
          return next;
        });
      }, 3000);
    }
  }, [recentEvents]);

  const displayEvents = recentEvents.slice(0, maxItems);

  return (
    <div className="space-y-3">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-white">Live Activity</h3>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`} 
            />
            <span className="text-xs text-zinc-500">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {displayEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-zinc-500"
            >
              <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Waiting for live updates...</p>
            </motion.div>
          ) : (
            displayEvents.map((event, index) => (
              <LiveFeedItem
                key={`${event.type}-${index}`}
                event={event}
                isNew={index === 0 && newEventIds.size > 0}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
