"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MessageCircle,
  Clock,
  CheckCheck,
  User,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { VideoFeedback } from "@/lib/video/types";

type CoachFeedbackProps = {
  videoId: string;
  athleteId: string;
  athleteName: string;
  feedback: VideoFeedback[];
  currentTime: number;
  isCoach: boolean;
  onSendFeedback: (message: string, timestamp?: number) => void;
  onSeekToTimestamp?: (timestamp: number) => void;
};

export function CoachFeedback({
  videoId,
  athleteId,
  athleteName,
  feedback,
  currentTime,
  isCoach,
  onSendFeedback,
  onSeekToTimestamp,
}: CoachFeedbackProps) {
  const [message, setMessage] = useState("");
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendFeedback(message, includeTimestamp ? currentTime * 1000 : undefined);
    setMessage("");
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-orange-500" />
          <span className="font-bold text-white">Coach Feedback</span>
          {feedback.length > 0 && (
            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
              {feedback.length}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-zinc-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-zinc-500" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Feedback List */}
            <div className="max-h-64 overflow-y-auto border-t border-zinc-800">
              {feedback.length === 0 ? (
                <div className="p-6 text-center text-zinc-500">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No feedback yet</p>
                  {isCoach && (
                    <p className="text-xs mt-1">Send feedback to help {athleteName} improve</p>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {feedback.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-zinc-800/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">
                              {item.coachName}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {formatDate(item.createdAt)}
                            </span>
                            {item.readAt && (
                              <CheckCheck className="w-3 h-3 text-blue-500" />
                            )}
                          </div>
                          <p className="text-zinc-300 text-sm">{item.message}</p>
                          
                          {item.timestamp !== undefined && (
                            <button
                              onClick={() => onSeekToTimestamp?.(item.timestamp! / 1000)}
                              className="mt-2 flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400 transition-colors"
                            >
                              <Play className="w-3 h-3" />
                              Jump to {formatTime(item.timestamp)}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area (Coach Only) */}
            {isCoach && (
              <div className="p-4 border-t border-zinc-800 bg-zinc-800/30">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Send feedback to ${athleteName}...`}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-zinc-500 resize-none focus:outline-none focus:border-orange-500"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    
                    {/* Timestamp Toggle */}
                    <div className="flex items-center justify-between mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeTimestamp}
                          onChange={(e) => setIncludeTimestamp(e.target.checked)}
                          className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-xs text-zinc-400">
                          Include timestamp ({formatTime(currentTime * 1000)})
                        </span>
                      </label>
                      
                      <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Athlete View - Reply Option */}
            {!isCoach && feedback.length > 0 && (
              <div className="p-4 border-t border-zinc-800 bg-zinc-800/30">
                <p className="text-xs text-zinc-500 text-center">
                  Reply to your coach in the messages section
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
