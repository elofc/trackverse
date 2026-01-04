import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

// Real-time event types
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

// Room types for targeted broadcasts
export type RoomType =
  | `user:${string}` // Individual user
  | `team:${string}` // Team/school
  | `meet:${string}` // Live meet updates
  | `event:${string}` // Event-specific (e.g., "100m")
  | "global"; // All connected users

// Connected users tracking
const connectedUsers = new Map<string, { socketId: string; userName: string; teamId?: string }>();

export class RealtimeServer {
  private io: SocketIOServer;
  private pubClient: ReturnType<typeof createClient> | null = null;
  private subClient: ReturnType<typeof createClient> | null = null;

  constructor(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    this.setupEventHandlers();
  }

  async connectRedis(redisUrl?: string) {
    if (!redisUrl) {
      console.log("No Redis URL provided, running without Redis adapter");
      return;
    }

    try {
      this.pubClient = createClient({ url: redisUrl });
      this.subClient = this.pubClient.duplicate();

      await Promise.all([this.pubClient.connect(), this.subClient.connect()]);

      this.io.adapter(createAdapter(this.pubClient, this.subClient));
      console.log("✅ Redis adapter connected");
    } catch (error) {
      console.error("Failed to connect Redis:", error);
    }
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Handle user authentication/identification
      socket.on("identify", (data: { userId: string; userName: string; teamId?: string }) => {
        const { userId, userName, teamId } = data;

        // Store user info
        connectedUsers.set(userId, { socketId: socket.id, userName, teamId });

        // Join personal room
        socket.join(`user:${userId}`);

        // Join team room if applicable
        if (teamId) {
          socket.join(`team:${teamId}`);
        }

        // Join global room
        socket.join("global");

        // Broadcast user online status
        this.broadcast({
          type: "USER_ONLINE",
          userId,
          userName,
        });

        console.log(`👤 User identified: ${userName} (${userId})`);
      });

      // Handle joining specific rooms (e.g., live meet)
      socket.on("join_room", (room: string) => {
        socket.join(room);
        console.log(`📍 ${socket.id} joined room: ${room}`);
      });

      socket.on("leave_room", (room: string) => {
        socket.leave(room);
        console.log(`📍 ${socket.id} left room: ${room}`);
      });

      // Handle typing indicators
      socket.on("typing_start", (data: { conversationId: string; userId: string; userName: string }) => {
        socket.to(`conversation:${data.conversationId}`).emit("realtime_event", {
          type: "TYPING_START",
          ...data,
        });
      });

      socket.on("typing_stop", (data: { conversationId: string; userId: string }) => {
        socket.to(`conversation:${data.conversationId}`).emit("realtime_event", {
          type: "TYPING_STOP",
          ...data,
        });
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        // Find and remove user
        for (const [userId, userData] of connectedUsers.entries()) {
          if (userData.socketId === socket.id) {
            connectedUsers.delete(userId);

            // Broadcast user offline status
            this.broadcast({
              type: "USER_OFFLINE",
              userId,
              userName: userData.userName,
            });

            console.log(`👤 User disconnected: ${userData.userName}`);
            break;
          }
        }

        console.log(`🔌 Client disconnected: ${socket.id}`);
      });
    });
  }

  // Broadcast event to all connected clients
  broadcast(event: RealtimeEvent) {
    this.io.to("global").emit("realtime_event", event);
  }

  // Send event to specific room
  sendToRoom(room: RoomType, event: RealtimeEvent) {
    this.io.to(room).emit("realtime_event", event);
  }

  // Send event to specific user
  sendToUser(userId: string, event: RealtimeEvent) {
    this.io.to(`user:${userId}`).emit("realtime_event", event);
  }

  // Send event to team
  sendToTeam(teamId: string, event: RealtimeEvent) {
    this.io.to(`team:${teamId}`).emit("realtime_event", event);
  }

  // Get online users
  getOnlineUsers(): Array<{ userId: string; userName: string }> {
    return Array.from(connectedUsers.entries()).map(([userId, data]) => ({
      userId,
      userName: data.userName,
    }));
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return connectedUsers.has(userId);
  }

  // Get socket.io instance for external use
  getIO(): SocketIOServer {
    return this.io;
  }
}

// Singleton instance
let realtimeServer: RealtimeServer | null = null;

export function initRealtimeServer(httpServer: HttpServer): RealtimeServer {
  if (!realtimeServer) {
    realtimeServer = new RealtimeServer(httpServer);
  }
  return realtimeServer;
}

export function getRealtimeServer(): RealtimeServer | null {
  return realtimeServer;
}
