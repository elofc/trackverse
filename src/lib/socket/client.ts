"use client";

import { io, Socket } from "socket.io-client";
import { create } from "zustand";

// Event types matching server
export type RealtimeEvent =
  | { type: "RANK_CHANGE"; athleteId: string; event: string; oldRank: number; newRank: number; athleteName: string }
  | { type: "NEW_PR"; athleteId: string; event: string; time: string; tier: string; athleteName: string }
  | { type: "NEW_POST"; post: FeedPost }
  | { type: "POST_LIKE"; postId: string; userId: string; userName: string }
  | { type: "POST_COMMENT"; postId: string; userId: string; userName: string; comment: string }
  | { type: "WORKOUT_COMPLETE"; athleteId: string; workout: WorkoutSummary; athleteName: string }
  | { type: "MEET_RESULT"; meetId: string; result: MeetResult }
  | { type: "USER_ONLINE"; userId: string; userName: string }
  | { type: "USER_OFFLINE"; userId: string; userName: string }
  | { type: "TYPING_START"; conversationId: string; userId: string; userName: string }
  | { type: "TYPING_STOP"; conversationId: string; userId: string };

export type FeedPost = {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorSchool: string;
  authorTier: string;
  type: "pr" | "workout" | "meet" | "general";
  content: string;
  performance?: {
    event: string;
    time: string;
    improvement?: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
};

export type WorkoutSummary = {
  id: string;
  name: string;
  type: string;
  duration: string;
  xpEarned: number;
};

export type MeetResult = {
  athleteId: string;
  athleteName: string;
  event: string;
  place: number;
  time: string;
  isPR: boolean;
};

// Socket store for global state
type SocketState = {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Array<{ userId: string; userName: string }>;
  recentEvents: RealtimeEvent[];
  
  // Actions
  connect: (userId: string, userName: string, teamId?: string) => void;
  disconnect: () => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  startTyping: (conversationId: string, userId: string, userName: string) => void;
  stopTyping: (conversationId: string, userId: string) => void;
  addEvent: (event: RealtimeEvent) => void;
  setOnlineUsers: (users: Array<{ userId: string; userName: string }>) => void;
};

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: [],
  recentEvents: [],

  connect: (userId: string, userName: string, teamId?: string) => {
    const existingSocket = get().socket;
    if (existingSocket?.connected) {
      return;
    }

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("🔌 Socket connected");
      set({ isConnected: true });

      // Identify user to server
      socket.emit("identify", { userId, userName, teamId });
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      set({ isConnected: false });
    });

    socket.on("realtime_event", (event: RealtimeEvent) => {
      console.log("📡 Realtime event:", event);
      get().addEvent(event);

      // Handle specific events
      if (event.type === "USER_ONLINE") {
        set((state) => ({
          onlineUsers: [...state.onlineUsers.filter((u) => u.userId !== event.userId), { userId: event.userId, userName: event.userName }],
        }));
      } else if (event.type === "USER_OFFLINE") {
        set((state) => ({
          onlineUsers: state.onlineUsers.filter((u) => u.userId !== event.userId),
        }));
      }
    });

    socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);
    });

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  joinRoom: (room: string) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit("join_room", room);
    }
  },

  leaveRoom: (room: string) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit("leave_room", room);
    }
  },

  startTyping: (conversationId: string, userId: string, userName: string) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit("typing_start", { conversationId, userId, userName });
    }
  },

  stopTyping: (conversationId: string, userId: string) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit("typing_stop", { conversationId, userId });
    }
  },

  addEvent: (event: RealtimeEvent) => {
    set((state) => ({
      recentEvents: [event, ...state.recentEvents].slice(0, 50), // Keep last 50 events
    }));
  },

  setOnlineUsers: (users) => {
    set({ onlineUsers: users });
  },
}));

// Hook for subscribing to specific event types
export function useRealtimeEvents<T extends RealtimeEvent["type"]>(
  eventType: T,
  callback: (event: Extract<RealtimeEvent, { type: T }>) => void
) {
  const socket = useSocketStore((state) => state.socket);

  if (socket) {
    socket.on("realtime_event", (event: RealtimeEvent) => {
      if (event.type === eventType) {
        callback(event as Extract<RealtimeEvent, { type: T }>);
      }
    });
  }
}
