"use client";

import { useEffect, createContext, useContext, ReactNode } from "react";
import { useSocketStore, RealtimeEvent } from "@/lib/socket/client";
import { toast } from "sonner";

type RealtimeContextType = {
  isConnected: boolean;
  onlineUsers: Array<{ userId: string; userName: string }>;
  recentEvents: RealtimeEvent[];
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
};

const RealtimeContext = createContext<RealtimeContextType | null>(null);

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
}

type Props = {
  children: ReactNode;
  userId: string;
  userName: string;
  teamId?: string;
};

export function RealtimeProvider({ children, userId, userName, teamId }: Props) {
  const { 
    connect, 
    disconnect, 
    isConnected, 
    onlineUsers, 
    recentEvents,
    joinRoom,
    leaveRoom,
  } = useSocketStore();

  useEffect(() => {
    connect(userId, userName, teamId);

    return () => {
      disconnect();
    };
  }, [userId, userName, teamId, connect, disconnect]);

  // Show toast notifications for important events
  useEffect(() => {
    const latestEvent = recentEvents[0];
    if (!latestEvent) return;

    switch (latestEvent.type) {
      case "NEW_PR":
        toast.success(`🔥 ${latestEvent.athleteName} just set a PR!`, {
          description: `${latestEvent.event}: ${latestEvent.time}`,
        });
        break;
      case "RANK_CHANGE":
        if (latestEvent.newRank < latestEvent.oldRank) {
          toast.info(`📈 ${latestEvent.athleteName} moved up to #${latestEvent.newRank}`, {
            description: `${latestEvent.event} rankings`,
          });
        }
        break;
      case "WORKOUT_COMPLETE":
        toast(`💪 ${latestEvent.athleteName} completed a workout`, {
          description: `${latestEvent.workout.name} (+${latestEvent.workout.xpEarned} XP)`,
        });
        break;
      case "MEET_RESULT":
        if (latestEvent.result.isPR) {
          toast.success(`🏆 ${latestEvent.result.athleteName} PR at meet!`, {
            description: `${latestEvent.result.event}: ${latestEvent.result.time}`,
          });
        }
        break;
    }
  }, [recentEvents]);

  return (
    <RealtimeContext.Provider value={{ 
      isConnected, 
      onlineUsers, 
      recentEvents,
      joinRoom,
      leaveRoom,
    }}>
      {children}
    </RealtimeContext.Provider>
  );
}
