"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

// Track events for selection
const TRACK_EVENTS = {
  sprints: ["100m", "200m", "400m"],
  middleDistance: ["800m", "1600m", "3200m"],
  hurdles: ["110mH", "300mH", "400mH"],
  jumps: ["High Jump", "Long Jump", "Triple Jump", "Pole Vault"],
  throws: ["Shot Put", "Discus", "Javelin", "Hammer"],
  multi: ["Pentathlon", "Heptathlon", "Decathlon"],
};

// Goals for selection
const GOALS = [
  { id: "pr", label: "Set new PRs", icon: "🏆" },
  { id: "college", label: "Get recruited", icon: "🎓" },
  { id: "state", label: "Make state", icon: "🥇" },
  { id: "varsity", label: "Make varsity", icon: "👕" },
  { id: "health", label: "Stay healthy", icon: "💪" },
  { id: "fun", label: "Have fun", icon: "😄" },
];

// Experience levels
const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Just starting out", description: "New to track & field" },
  { id: "intermediate", label: "1-2 years", description: "Some competition experience" },
  { id: "experienced", label: "3+ years", description: "Varsity level competitor" },
  { id: "elite", label: "Elite", description: "State/national level" },
];

type OnboardingData = {
  name: string;
  events: string[];
  goals: string[];
  experience: string;
  graduationYear: number;
};

type OnboardingFlowProps = {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
};

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    events: [],
    goals: [],
    experience: "",
    graduationYear: new Date().getFullYear() + 2,
  });

  const steps = [
    { title: "Welcome", icon: User },
    { title: "Your Events", icon: Target },
    { title: "Your Goals", icon: Trophy },
    { title: "Experience", icon: Zap },
  ];

  const canProceed = () => {
    switch (step) {
      case 0:
        return data.name.trim().length >= 2;
      case 1:
        return data.events.length > 0;
      case 2:
        return data.goals.length > 0;
      case 3:
        return data.experience !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const toggleEvent = (event: string) => {
    if (data.events.includes(event)) {
      setData({ ...data, events: data.events.filter((e) => e !== event) });
    } else {
      setData({ ...data, events: [...data.events, event] });
    }
  };

  const toggleGoal = (goal: string) => {
    if (data.goals.includes(goal)) {
      setData({ ...data, goals: data.goals.filter((g) => g !== goal) });
    } else {
      setData({ ...data, goals: [...data.goals, goal] });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${i < step ? "bg-orange-500" : i === step ? "bg-orange-500" : "bg-zinc-800"}
                `}
                animate={{ scale: i === step ? 1.1 : 1 }}
              >
                {i < step ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <s.icon className={`w-5 h-5 ${i === step ? "text-white" : "text-zinc-500"}`} />
                )}
              </motion.div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 ${i < step ? "bg-orange-500" : "bg-zinc-800"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {/* Step 1: Welcome */}
              {step === 0 && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="text-6xl mb-4"
                  >
                    🏃‍♂️
                  </motion.div>
                  <h1 className="text-2xl font-black text-white mb-2">
                    Welcome to TrackVerse
                  </h1>
                  <p className="text-zinc-400 mb-6">
                    Let's set up your profile in just a few steps
                  </p>

                  <div className="space-y-4 text-left">
                    <div>
                      <label className="text-sm text-zinc-400 mb-1 block">
                        What should we call you?
                      </label>
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="text-sm text-zinc-400 mb-1 block">
                        Graduation Year
                      </label>
                      <select
                        value={data.graduationYear}
                        onChange={(e) => setData({ ...data, graduationYear: parseInt(e.target.value) })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                      >
                        {Array.from({ length: 8 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Events */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 text-center">
                    What events do you compete in?
                  </h2>
                  <p className="text-zinc-400 text-sm text-center mb-6">
                    Select all that apply
                  </p>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {Object.entries(TRACK_EVENTS).map(([category, events]) => (
                      <div key={category}>
                        <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
                          {category.replace(/([A-Z])/g, " $1").trim()}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {events.map((event) => (
                            <button
                              key={event}
                              onClick={() => toggleEvent(event)}
                              className={`
                                px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                ${data.events.includes(event)
                                  ? "bg-orange-500 text-white"
                                  : "bg-zinc-800 text-zinc-400 hover:text-white"
                                }
                              `}
                            >
                              {event}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {data.events.length > 0 && (
                    <p className="text-sm text-orange-500 mt-4 text-center">
                      {data.events.length} event{data.events.length > 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>
              )}

              {/* Step 3: Goals */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 text-center">
                    What are your goals?
                  </h2>
                  <p className="text-zinc-400 text-sm text-center mb-6">
                    We'll help you track progress toward these
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {GOALS.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`
                          p-4 rounded-xl text-left transition-colors
                          ${data.goals.includes(goal.id)
                            ? "bg-orange-500/20 border-2 border-orange-500"
                            : "bg-zinc-800 border-2 border-transparent hover:border-zinc-700"
                          }
                        `}
                      >
                        <span className="text-2xl block mb-2">{goal.icon}</span>
                        <span className={`font-medium ${data.goals.includes(goal.id) ? "text-white" : "text-zinc-300"}`}>
                          {goal.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Experience */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 text-center">
                    What's your experience level?
                  </h2>
                  <p className="text-zinc-400 text-sm text-center mb-6">
                    This helps us personalize your experience
                  </p>

                  <div className="space-y-3">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setData({ ...data, experience: level.id })}
                        className={`
                          w-full p-4 rounded-xl text-left transition-colors flex items-center gap-4
                          ${data.experience === level.id
                            ? "bg-orange-500/20 border-2 border-orange-500"
                            : "bg-zinc-800 border-2 border-transparent hover:border-zinc-700"
                          }
                        `}
                      >
                        <div
                          className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${data.experience === level.id ? "border-orange-500" : "border-zinc-600"}
                          `}
                        >
                          {data.experience === level.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                          )}
                        </div>
                        <div>
                          <span className={`font-medium block ${data.experience === level.id ? "text-white" : "text-zinc-300"}`}>
                            {level.label}
                          </span>
                          <span className="text-sm text-zinc-500">{level.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="p-6 pt-0 flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <button
                onClick={onSkip}
                className="text-zinc-500 hover:text-zinc-400 transition-colors text-sm"
              >
                Skip for now
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors
                ${canProceed()
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }
              `}
            >
              {step === steps.length - 1 ? "Get Started" : "Continue"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step indicator */}
        <p className="text-center text-zinc-500 text-sm mt-4">
          Step {step + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}

// Compact onboarding for returning users
type QuickSetupProps = {
  onComplete: () => void;
  userName: string;
};

export function QuickSetup({ onComplete, userName }: QuickSetupProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
    >
      <h2 className="text-xl font-bold text-white mb-2">
        Welcome back, {userName}! 👋
      </h2>
      <p className="text-zinc-400 text-sm mb-4">
        What's your focus for today?
      </p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { id: "workout", label: "Log Workout", icon: "🏃" },
          { id: "pr", label: "Log PR", icon: "🏆" },
          { id: "explore", label: "Explore", icon: "🔍" },
        ].map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedGoal(option.id)}
            className={`
              p-3 rounded-lg text-center transition-colors
              ${selectedGoal === option.id
                ? "bg-orange-500 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
              }
            `}
          >
            <span className="text-xl block mb-1">{option.icon}</span>
            <span className="text-xs font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="w-full py-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white transition-colors text-sm"
      >
        Skip to dashboard
      </button>
    </motion.div>
  );
}
