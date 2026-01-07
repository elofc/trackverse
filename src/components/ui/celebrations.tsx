"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Flame, Medal, Zap, Target } from "lucide-react";

// Confetti particle
type Particle = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
};

const CONFETTI_COLORS = [
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#a855f7", // purple
  "#ec4899", // pink
  "#ef4444", // red
];

// Confetti explosion
export function Confetti({
  isActive,
  duration = 3000,
  particleCount = 50,
}: {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const newParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50,
      rotation: Math.random() * 360,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 8 + Math.random() * 8,
      velocity: {
        x: (Math.random() - 0.5) * 15,
        y: -10 - Math.random() * 10,
      },
    }));

    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timeout);
  }, [isActive, duration, particleCount]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
          initial={{
            x: 0,
            y: 0,
            rotate: particle.rotation,
            opacity: 1,
          }}
          animate={{
            x: particle.velocity.x * 50,
            y: [0, particle.velocity.y * 30, 300],
            rotate: particle.rotation + 360 * 2,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: duration / 1000,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// PR Celebration Modal
type PRCelebrationProps = {
  isOpen: boolean;
  onClose: () => void;
  event: string;
  newTime: string;
  previousTime?: string;
  improvement?: string;
};

export function PRCelebration({
  isOpen,
  onClose,
  event,
  newTime,
  previousTime,
  improvement,
}: PRCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timeout = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <>
      <Confetti isActive={showConfetti} particleCount={100} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl p-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-zinc-900 rounded-xl p-8 text-center max-w-sm">
                {/* Trophy Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center"
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-black text-white mb-2"
                >
                  NEW PR! 🎉
                </motion.h2>

                {/* Event */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-orange-500 font-bold mb-4"
                >
                  {event}
                </motion.p>

                {/* New Time */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl font-black text-white mb-4"
                >
                  {newTime}
                </motion.div>

                {/* Improvement */}
                {previousTime && improvement && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-zinc-400 text-sm"
                  >
                    Previous: {previousTime}
                    <span className="text-green-500 ml-2">(-{improvement})</span>
                  </motion.div>
                )}

                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={onClose}
                  className="mt-6 px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Awesome!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Streak Celebration
type StreakCelebrationProps = {
  isOpen: boolean;
  onClose: () => void;
  streakCount: number;
  streakType: "workout" | "login" | "goal";
};

export function StreakCelebration({
  isOpen,
  onClose,
  streakCount,
  streakType,
}: StreakCelebrationProps) {
  const getStreakInfo = () => {
    switch (streakType) {
      case "workout":
        return { icon: Flame, title: "Workout Streak!", color: "from-orange-500 to-red-500" };
      case "login":
        return { icon: Zap, title: "Login Streak!", color: "from-yellow-500 to-orange-500" };
      case "goal":
        return { icon: Target, title: "Goal Streak!", color: "from-green-500 to-emerald-500" };
    }
  };

  const info = getStreakInfo();
  const Icon = info.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
        >
          <div className={`bg-gradient-to-r ${info.color} rounded-xl p-4 shadow-2xl flex items-center gap-4`}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <Icon className="w-8 h-8 text-white" />
            </motion.div>
            <div className="text-white">
              <p className="font-bold">{info.title}</p>
              <p className="text-2xl font-black">{streakCount} Days</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Badge Unlock Animation
type BadgeUnlockProps = {
  isOpen: boolean;
  onClose: () => void;
  badge: {
    name: string;
    description: string;
    icon: string;
    rarity: "common" | "rare" | "epic" | "legendary";
  };
};

export function BadgeUnlock({ isOpen, onClose, badge }: BadgeUnlockProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && (badge.rarity === "epic" || badge.rarity === "legendary")) {
      setShowConfetti(true);
      const timeout = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, badge.rarity]);

  const getRarityColor = () => {
    switch (badge.rarity) {
      case "common":
        return "from-zinc-500 to-zinc-600";
      case "rare":
        return "from-blue-500 to-blue-600";
      case "epic":
        return "from-purple-500 to-purple-600";
      case "legendary":
        return "from-yellow-500 to-orange-500";
    }
  };

  return (
    <>
      <Confetti isActive={showConfetti} particleCount={80} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", damping: 12 }}
              className={`bg-gradient-to-br ${getRarityColor()} rounded-2xl p-1`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-zinc-900 rounded-xl p-8 text-center max-w-xs">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-6xl mb-4"
                >
                  {badge.icon}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs uppercase tracking-wider text-zinc-500 mb-2"
                >
                  Badge Unlocked!
                </motion.p>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl font-bold text-white mb-2"
                >
                  {badge.name}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-zinc-400 text-sm mb-4"
                >
                  {badge.description}
                </motion.p>

                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className={`
                    inline-block px-3 py-1 rounded-full text-xs font-bold uppercase
                    ${badge.rarity === "common" && "bg-zinc-700 text-zinc-300"}
                    ${badge.rarity === "rare" && "bg-blue-500/20 text-blue-400"}
                    ${badge.rarity === "epic" && "bg-purple-500/20 text-purple-400"}
                    ${badge.rarity === "legendary" && "bg-yellow-500/20 text-yellow-400"}
                  `}
                >
                  {badge.rarity}
                </motion.span>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={onClose}
                  className="mt-6 w-full px-6 py-2 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Collect
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Level Up Animation
type LevelUpProps = {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  xpGained: number;
};

export function LevelUp({ isOpen, onClose, newLevel, xpGained }: LevelUpProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timeout = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <>
      <Confetti isActive={showConfetti} particleCount={100} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-zinc-900 rounded-xl p-8 text-center max-w-sm">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
                >
                  <Star className="w-12 h-12 text-white" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-purple-400 font-bold uppercase tracking-wider mb-2"
                >
                  Level Up!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-6xl font-black text-white mb-2"
                >
                  {newLevel}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-zinc-400"
                >
                  +{xpGained} XP earned
                </motion.p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={onClose}
                  className="mt-6 px-6 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Toast notification with animation
type ToastProps = {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  isVisible: boolean;
  onClose: () => void;
};

export function Toast({ message, type = "info", isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(onClose, 4000);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 50, x: "-50%" }}
          className={`fixed bottom-8 left-1/2 z-50 ${getTypeStyles()} text-white px-6 py-3 rounded-lg shadow-lg font-medium`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
