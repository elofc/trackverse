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
  Plus,
  Minus,
  Calendar,
  Clock,
  Users,
  Target,
  Dumbbell,
  Video,
  FileText,
  Check,
  Send,
  Save,
  Zap,
  Timer,
  Flame,
  X,
} from "lucide-react";

type AssignmentType = "workout" | "drill" | "recovery" | "video" | "assessment";

const assignmentTypes = [
  { id: "workout" as AssignmentType, name: "Workout", icon: "💪", description: "Training session with exercises", color: "orange" },
  { id: "drill" as AssignmentType, name: "Drill", icon: "🎯", description: "Specific skill practice", color: "blue" },
  { id: "recovery" as AssignmentType, name: "Recovery", icon: "🧘", description: "Rest and recovery activities", color: "green" },
  { id: "video" as AssignmentType, name: "Video Review", icon: "📹", description: "Watch and reflect on video", color: "purple" },
  { id: "assessment" as AssignmentType, name: "Assessment", icon: "📊", description: "Time trial or evaluation", color: "yellow" },
];

const groups = [
  { id: "all", name: "All Athletes", count: 42 },
  { id: "sprints", name: "Sprints", count: 12 },
  { id: "mid-distance", name: "Mid-Distance", count: 8 },
  { id: "distance", name: "Distance", count: 10 },
  { id: "hurdles", name: "Hurdles", count: 4 },
  { id: "jumps", name: "Jumps", count: 5 },
  { id: "throws", name: "Throws", count: 3 },
];

const workoutTemplates = [
  { id: "t1", name: "Sprint Intervals", description: "6x200m at 90%", type: "workout" },
  { id: "t2", name: "Tempo Run", description: "20min at 75%", type: "workout" },
  { id: "t3", name: "Plyometric Circuit", description: "Box jumps, bounds, hops", type: "drill" },
  { id: "t4", name: "Recovery Session", description: "Foam rolling + stretching", type: "recovery" },
];

interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  distance?: string;
  rest?: string;
  notes?: string;
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: Type
  const [assignmentType, setAssignmentType] = useState<AssignmentType | null>(null);
  
  // Step 2: Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  
  // Step 3: Exercises (for workout/drill)
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: "e1", name: "", sets: 3, reps: "", distance: "", rest: "3:00", notes: "" }
  ]);
  
  // Step 4: Assignment
  const [assignTo, setAssignTo] = useState<string>("all");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("23:59");
  const [points, setPoints] = useState("100");
  const [allowLate, setAllowLate] = useState(true);

  const addExercise = () => {
    setExercises([...exercises, { 
      id: `e${Date.now()}`, 
      name: "", 
      sets: 3, 
      reps: "", 
      distance: "", 
      rest: "3:00", 
      notes: "" 
    }]);
  };

  const removeExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter(e => e.id !== id));
    }
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setExercises(exercises.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsLoading(true);
    // TODO: Save assignment to database
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push("/coach/assignments?created=true");
  };

  const canProceed = () => {
    switch (step) {
      case 1: return assignmentType !== null;
      case 2: return title.trim() !== "";
      case 3: return exercises.some(e => e.name.trim() !== "");
      case 4: return dueDate !== "";
      default: return false;
    }
  };

  const totalSteps = assignmentType === "workout" || assignmentType === "drill" ? 4 : 3;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <Link href="/coach/assignments" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Assignments
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2">CREATE ASSIGNMENT</h1>
          <p className="text-white/60">Assign workouts, drills, and tasks to your athletes</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i + 1 === step 
                  ? 'w-8 bg-orange-500' 
                  : i + 1 < step 
                    ? 'w-2 bg-orange-500' 
                    : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <Card className="bg-white/5 border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              {step === 1 && "Assignment Type"}
              {step === 2 && "Assignment Details"}
              {step === 3 && (assignmentType === "workout" || assignmentType === "drill" ? "Exercises" : "Assign To")}
              {step === 4 && "Assign To"}
            </CardTitle>
            <CardDescription className="text-white/60">
              {step === 1 && "What type of assignment is this?"}
              {step === 2 && "Provide details about the assignment"}
              {step === 3 && (assignmentType === "workout" || assignmentType === "drill" ? "Add exercises to this assignment" : "Who should complete this?")}
              {step === 4 && "Who should complete this assignment?"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Type Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {assignmentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setAssignmentType(type.id)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        assignmentType === type.id
                          ? 'bg-orange-500/20 border-2 border-orange-500'
                          : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <span className="text-3xl mb-2 block">{type.icon}</span>
                      <p className="font-bold text-white">{type.name}</p>
                      <p className="text-xs text-white/50">{type.description}</p>
                    </button>
                  ))}
                </div>

                {/* Quick Templates */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-white/60 mb-3">Or start from a template:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {workoutTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setAssignmentType(template.type as AssignmentType);
                          setTitle(template.name);
                          setDescription(template.description);
                          setStep(2);
                        }}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-left transition-all"
                      >
                        <p className="font-bold text-white text-sm">{template.name}</p>
                        <p className="text-xs text-white/50">{template.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80">Title *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., 6x200m Sprint Intervals"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the assignment..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80">Instructions</label>
                  <Textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Detailed instructions for athletes..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[120px]"
                  />
                </div>

                {(assignmentType === "video") && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80">Video URL</label>
                    <Input
                      placeholder="YouTube or Vimeo link"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Exercises (for workout/drill) */}
            {step === 3 && (assignmentType === "workout" || assignmentType === "drill") && (
              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <div key={exercise.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-orange-400">Exercise {index + 1}</span>
                      {exercises.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeExercise(exercise.id)}
                          className="text-red-400 hover:text-red-300 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <Input
                      value={exercise.name}
                      onChange={(e) => updateExercise(exercise.id, "name", e.target.value)}
                      placeholder="Exercise name (e.g., 200m sprints)"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                    
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Sets</label>
                        <Input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(exercise.id, "sets", parseInt(e.target.value))}
                          className="bg-white/5 border-white/10 text-white text-center"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Reps/Distance</label>
                        <Input
                          value={exercise.reps || exercise.distance}
                          onChange={(e) => updateExercise(exercise.id, "reps", e.target.value)}
                          placeholder="10 or 200m"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-center"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Rest</label>
                        <Input
                          value={exercise.rest}
                          onChange={(e) => updateExercise(exercise.id, "rest", e.target.value)}
                          placeholder="3:00"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-center"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Effort %</label>
                        <Input
                          placeholder="90%"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-center"
                        />
                      </div>
                    </div>

                    <Input
                      value={exercise.notes}
                      onChange={(e) => updateExercise(exercise.id, "notes", e.target.value)}
                      placeholder="Notes (optional)"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                ))}

                <Button
                  onClick={addExercise}
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 border-dashed text-white hover:bg-white/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </div>
            )}

            {/* Step 3/4: Assign To */}
            {((step === 3 && assignmentType !== "workout" && assignmentType !== "drill") || step === 4) && (
              <div className="space-y-6">
                {/* Group Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-white/80">Assign To</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {groups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => setAssignTo(group.id)}
                        className={`p-3 rounded-lg text-left transition-all ${
                          assignTo === group.id
                            ? 'bg-orange-500/20 border-2 border-orange-500'
                            : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{group.name}</span>
                          <span className="text-xs text-white/50">{group.count}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Due Date *
                    </label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Due Time
                    </label>
                    <Input
                      type="time"
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                {/* Points */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80">Points</label>
                  <Input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    className="bg-white/5 border-white/10 text-white w-32"
                  />
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <button
                    onClick={() => setAllowLate(!allowLate)}
                    className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                      allowLate
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <span className="font-bold text-white">Allow Late Submissions</span>
                    {allowLate && <Check className="h-5 w-5 text-green-500" />}
                  </button>
                </div>

                {/* Preview */}
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <p className="text-sm text-white/60 mb-2">Assignment Preview</p>
                  <h3 className="font-bold text-white text-lg">{title || "Untitled Assignment"}</h3>
                  <p className="text-sm text-white/50 mt-1">
                    {groups.find(g => g.id === assignTo)?.name} • Due {dueDate || "TBD"} at {dueTime} • {points} points
                  </p>
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
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                {step === totalSteps && (
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit(true)}
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                )}
                
                {step < totalSteps ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                    className="btn-track text-white font-bold px-6"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubmit(false)}
                    disabled={!canProceed() || isLoading}
                    className="btn-track text-white font-bold px-6"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Assigning...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Assign
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
