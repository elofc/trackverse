"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { useSocketStore } from "@/lib/socket/client";

type OnlineUsersProps = {
  teamOnly?: boolean;
  maxVisible?: number;
};

export function OnlineUsers({ teamOnly = false, maxVisible = 5 }: OnlineUsersProps) {
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  const isConnected = useSocketStore((state) => state.isConnected);
  const [isExpanded, setIsExpanded] = useState(false);

  const displayUsers = isExpanded ? onlineUsers : onlineUsers.slice(0, maxVisible);
  const hiddenCount = onlineUsers.length - maxVisible;

  if (!isConnected) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-zinc-500">
          <Circle className="w-3 h-3 text-red-500" />
          <span className="text-sm">Offline</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-white">
            {onlineUsers.length} Online
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Circle className="w-2 h-2 text-green-500 animate-pulse" />
          <span className="text-xs text-zinc-500">Live</span>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {displayUsers.map((user) => (
            <motion.div
              key={user.userId}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2 py-1"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.userName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900" />
              </div>
              <span className="text-sm text-zinc-300 truncate">
                {user.userName}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hiddenCount > 0 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              +{hiddenCount} more
            </>
          )}
        </button>
      )}

      {onlineUsers.length === 0 && (
        <div className="text-center py-4 text-zinc-500 text-sm">
          No teammates online
        </div>
      )}
    </div>
  );
}
