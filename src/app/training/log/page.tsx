"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Timer,
  MapPin,
  Flame,
  Check,
  Plus,
  Minus,
  Zap,
} from "lucide-react";

type WorkoutType = "sprint" | "tempo" | "distance" | "plyo" | "lift" | "recovery" | "drills";

const workoutTypes: { id: WorkoutType; name: string; icon: string; description: string }[] = [
  { id: "sprint", name: "Sprint", icon: "⚡", description: "Speed work, intervals" },
  { id: "tempo", name: "Tempo", icon: "🏃", description: "Threshold runs" },
  { id: "distance", name: "Distance", icon: "🛤️", description: "Long runs, easy miles" },
  { id: "plyo", name: "Plyometrics", icon: "🦘", description: "Jumps, bounds, hops" },
  { id: "lift", name: "Strength", icon: "💪", description: "Weight training" },
  { id: "recovery", name: "Recovery", icon: "🧘", description: "Easy jog, stretching" },
  { id: "drills", name: "Drills", icon: "🎯", description: "Technique work" },
];

export default function LogWorkoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: Workout type
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);
  
  // Step 2: Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  
  // Step 3: Effort & Splits
  const [effort, setEffort] = useState(5);
  const [splits, setSplits] = useState<string[]>([""]);
  
  // Step 4: Notes
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [surface, setSurface] = useState<"track" | "grass" | "road" | "trail" | "gym">("track");

  const addSplit = () => setSplits([...splits, ""]);
  const removeSplit = (index: number) => setSplits(splits.filter((_, i) => i !== index));
  const updateSplit = (index: number, value: string) => {
    const newSplits = [...splits];
    newSplits[index] = value;
    setSplits(newSplits);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // TODO: Save workout to database
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push("/training?workout=logged");
  };

  const canProceed = () => {
    switch (step) {
      case 1: return workoutType !== null;
      case 2: return title.trim() !== "";
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const selectedType = workoutTypes.find(t => t.id === workoutType);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link href="/training" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Training
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-4">
            <Dumbbell className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-400">LOG WORKOUT</span>
          </div>
          <h1 className="text-4xl font-black mb-2">TRACK YOUR GRIND 💪</h1>
          <p className="text-white/60">Every rep counts. Log it and level up.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step 
                  ? 'w-8 bg-orange-500' 
                  : s < step 
                    ? 'w-2 bg-orange-500' 
                    : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <Card className="bg-white/5 border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              {step === 1 && "Workout Type"}
              {step === 2 && "Workout Details"}
              {step === 3 && "Effort & Splits"}
              {step === 4 && "Notes & Location"}
            </CardTitle>
            <CardDescription className="text-white/60">
              {step === 1 && "What kind of workout did you do?"}
              {step === 2 && "Tell us about your workout"}
              {step === 3 && "How hard did you push?"}
              {step === 4 && "Any additional details?"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Workout Type */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {workoutTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setWorkoutType(type.id)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      workoutType === type.id
                        ? 'bg-orange-500/20 border-2 border-orange-500'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <p className="font-bold text-white">{type.name}</p>
                        <p className="text-xs text-white/50">{type.description}</p>
                      </div>
                    </div>
                    {workoutType === type.id && (
                      <Check className="h-4 w-4 text-orange-500 absolute top-2 right-2" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80">Workout Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`e.g., ${selectedType?.name} Session`}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What did you do? (e.g., 6x200m at 90%)"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                      <Timer className="h-4 w-4" /> Duration (min)
                    </label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="45"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Distance (m)
                    </label>
                    <Input
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder="1200"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Effort & Splits */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Effort Rating */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" /> Effort Level
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <button
                        key={level}
                        onClick={() => setEffort(level)}
                        className={`flex-1 h-12 rounded-lg font-bold transition-all ${
                          level <= effort
                            ? level <= 3 
                              ? 'bg-green-500 text-white'
                              : level <= 6
                                ? 'bg-yellow-500 text-black'
                                : level <= 8
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-red-500 text-white'
                            : 'bg-white/10 text-white/30'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-white/50">
                    {effort <= 3 && "Easy - Recovery pace"}
                    {effort > 3 && effort <= 6 && "Moderate - Tempo effort"}
                    {effort > 6 && effort <= 8 && "Hard - Race pace"}
                    {effort > 8 && "Max - All out effort 🔥"}
                  </p>
                </div>

                {/* Splits */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-white/80">Splits (optional)</label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={addSplit}
                      className="text-orange-400 hover:text-orange-300"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Split
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {splits.map((split, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-sm text-white/40 w-8">#{i + 1}</span>
                        <Input
                          value={split}
                          onChange={(e) => updateSplit(i, e.target.value)}
                          placeholder="26.5"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-mono"
                        />
                        {splits.length > 1 && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeSplit(i)}
                            className="text-red-400 hover:text-red-300 h-10 w-10"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Notes & Location */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80">Surface</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(["track", "grass", "road", "trail", "gym"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSurface(s)}
                        className={`py-3 rounded-lg font-semibold capitalize transition-all ${
                          surface === s
                            ? 'bg-orange-500 text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Location
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Lincoln HS Track"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80">Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How did you feel? Any observations?"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
                  />
                </div>

                {/* Summary */}
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <p className="text-sm text-white/60 mb-2">Workout Summary</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedType?.icon}</span>
                    <div>
                      <p className="font-bold text-white">{title || "Untitled Workout"}</p>
                      <p className="text-sm text-white/50">
                        {duration && `${duration}min`}
                        {duration && distance && " • "}
                        {distance && `${distance}m`}
                        {(duration || distance) && " • "}
                        Effort: {effort}/10
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              {step > 1 ? (
                <Button
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                  className="text-white/60 hover:text-white"
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="btn-track text-white font-bold px-6 rounded-full"
                >
                  Continue
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="btn-track text-white font-bold px-6 rounded-full"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Flame className="h-4 w-4" />
                      LOG WORKOUT
                    </span>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
