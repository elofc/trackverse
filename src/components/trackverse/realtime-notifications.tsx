"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Trophy, 
  TrendingUp, 
  Dumbbell, 
  Medal,
  Bell,
  Zap,
} from "lucide-react";
import { useSocketStore, RealtimeEvent } from "@/lib/socket/client";

type NotificationItem = {
  id: string;
  event: RealtimeEvent;
  timestamp: number;
};

export function RealtimeNotifications() {
  const recentEvents = useSocketStore((state) => state.recentEvents);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [lastEventCount, setLastEventCount] = useState(0);

  // Add new notifications when events come in
  useEffect(() => {
    if (recentEvents.length > lastEventCount && recentEvents.length > 0) {
      const newEvent = recentEvents[0];
      
      // Only show notifications for important events
      if (shouldShowNotification(newEvent)) {
        const notification: NotificationItem = {
          id: `${newEvent.type}-${Date.now()}`,
          event: newEvent,
          timestamp: Date.now(),
        };
        
        setNotifications((prev) => [notification, ...prev].slice(0, 5));

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
        }, 5000);
      }
    }
    setLastEventCount(recentEvents.length);
  }, [recentEvents, lastEventCount]);

  const shouldShowNotification = (event: RealtimeEvent): boolean => {
    return ["NEW_PR", "RANK_CHANGE", "WORKOUT_COMPLETE", "MEET_RESULT"].includes(event.type);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationContent = (event: RealtimeEvent) => {
    switch (event.type) {
      case "NEW_PR":
        return {
          icon: <Trophy className="w-5 h-5 text-yellow-500" />,
          title: "New PR! 🔥",
          message: `${event.athleteName} set a PR in ${event.event}: ${event.time}`,
          color: "border-yellow-500/50 bg-yellow-500/10",
        };
      case "RANK_CHANGE":
        const isUp = event.newRank < event.oldRank;
        return {
          icon: <TrendingUp className={`w-5 h-5 ${isUp ? "text-green-500" : "text-red-500"}`} />,
          title: isUp ? "Rank Up! 📈" : "Rank Change",
          message: `${event.athleteName} moved to #${event.newRank} in ${event.event}`,
          color: isUp ? "border-green-500/50 bg-green-500/10" : "border-zinc-500/50 bg-zinc-500/10",
        };
      case "WORKOUT_COMPLETE":
        return {
          icon: <Dumbbell className="w-5 h-5 text-orange-500" />,
          title: "Workout Complete 💪",
          message: `${event.athleteName} finished ${event.workout.name}`,
          color: "border-orange-500/50 bg-orange-500/10",
        };
      case "MEET_RESULT":
        return {
          icon: <Medal className="w-5 h-5 text-blue-500" />,
          title: event.result.isPR ? "Meet PR! 🏆" : "Meet Result",
          message: `${event.result.athleteName} placed #${event.result.place} in ${event.result.event}`,
          color: event.result.isPR ? "border-green-500/50 bg-green-500/10" : "border-blue-500/50 bg-blue-500/10",
        };
      default:
        return {
          icon: <Bell className="w-5 h-5 text-zinc-500" />,
          title: "Update",
          message: "Something happened",
          color: "border-zinc-500/50 bg-zinc-500/10",
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => {
          const content = getNotificationContent(notification.event);
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`relative p-4 rounded-xl border backdrop-blur-sm shadow-lg ${content.color}`}
            >
              <button
                onClick={() => dismissNotification(notification.id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
              
              <div className="flex items-start gap-3 pr-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  {content.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{content.title}</span>
                    <span className="text-xs text-orange-500 animate-pulse">LIVE</span>
                  </div>
                  <p className="text-zinc-300 text-sm mt-0.5">{content.message}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
