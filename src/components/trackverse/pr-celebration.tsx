"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface PRCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  event: string;
  newTime: number;
  oldTime?: number;
  rank?: number;
  tier?: string;
}

export function PRCelebration({
  isOpen,
  onClose,
  event,
  newTime,
  oldTime,
  rank,
  tier,
}: PRCelebrationProps) {
  useEffect(() => {
    if (isOpen) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#FF6B35", "#004E89", "#06D6A0"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#FF6B35", "#004E89", "#06D6A0"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isOpen]);

  const improvement = oldTime ? oldTime - newTime : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-full max-w-md mx-4 bg-gradient-to-br from-orange-500 to-blue-600 rounded-3xl p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-background rounded-[22px] p-8 text-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 10 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 mb-6"
              >
                <Trophy className="h-10 w-10 text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-2xl font-bold">New Personal Record!</h2>
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>

                <p className="text-muted-foreground mb-6">{event}</p>

                <div className="time-display text-5xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent mb-4">
                  {formatTime(newTime)}
                </div>

                {improvement > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold mb-6"
                  >
                    <span>↓</span>
                    <span>{(improvement / 1000).toFixed(2)}s improvement!</span>
                  </motion.div>
                )}

                {rank && (
                  <p className="text-muted-foreground mb-6">
                    You&apos;re now ranked <span className="font-bold text-foreground">#{rank}</span> in your state
                    {tier && (
                      <span className="ml-1">
                        • <span className="capitalize">{tier}</span> tier
                      </span>
                    )}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={onClose}>
                    Close
                  </Button>
                  <Button variant="gradient" className="flex-1">
                    Share PR 🎉
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
