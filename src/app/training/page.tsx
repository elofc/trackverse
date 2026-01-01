"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TierBadge } from "@/components/trackverse/tier-badge";
import { Tier } from "@/lib/rankings";
import {
  Dumbbell,
  Plus,
  Calendar,
  TrendingUp,
  Flame,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Timer,
  MapPin,
  ChevronRight,
  Play,
  BarChart3,
} from "lucide-react";

type WorkoutType = "sprint" | "tempo" | "distance" | "plyo" | "lift" | "recovery" | "drills";

interface Workout {
  id: string;
  title: string;
  type: WorkoutType;
  date: Date;
  totalDistance?: number;
  duration?: number;
  effort: number;
  description: string;
  splits?: string[];
  completed: boolean;
}

const recentWorkouts: Workout[] = [
  {
    id: "w1",
    title: "Sprint Intervals",
    type: "sprint",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    totalDistance: 1200,
    effort: 8,
    description: "6x200m at 90% with 3min rest",
    splits: ["26.5", "26.8", "27.1", "26.9", "27.3", "26.4"],
    completed: true,
  },
  {
    id: "w2",
    title: "Tempo Run",
    type: "tempo",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    totalDistance: 3000,
    duration: 15,
    effort: 6,
    description: "Steady state 3k at 75%",
    completed: true,
  },
  {
    id: "w3",
    title: "Plyometrics",
    type: "plyo",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: 45,
    effort: 7,
    description: "Box jumps, bounds, hurdle hops",
    completed: true,
  },
  {
    id: "w4",
    title: "Recovery Jog",
    type: "recovery",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    totalDistance: 2000,
    duration: 20,
    effort: 3,
    description: "Easy 2k with stretching",
    completed: true,
  },
];

const workoutTemplates = [
  { id: "t1", name: "Sprint Day", type: "sprint" as WorkoutType, description: "6x200m at race pace", duration: 45, icon: "⚡" },
  { id: "t2", name: "Tempo Run", type: "tempo" as WorkoutType, description: "20min at 75% effort", duration: 30, icon: "🏃" },
  { id: "t3", name: "Plyo Session", type: "plyo" as WorkoutType, description: "Box jumps, bounds, hops", duration: 40, icon: "🦘" },
  { id: "t4", name: "Strength Training", type: "lift" as WorkoutType, description: "Lower body focus", duration: 60, icon: "💪" },
  { id: "t5", name: "Speed Drills", type: "drills" as WorkoutType, description: "A-skips, B-skips, high knees", duration: 25, icon: "🎯" },
  { id: "t6", name: "Recovery", type: "recovery" as WorkoutType, description: "Easy jog + stretching", duration: 30, icon: "🧘" },
];

const getWorkoutTypeStyle = (type: WorkoutType) => {
  switch (type) {
    case "sprint":
      return { bg: "bg-orange-500/20", border: "border-orange-500/30", text: "text-orange-400", icon: "⚡" };
    case "tempo":
      return { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", icon: "🏃" };
    case "distance":
      return { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400", icon: "🛤️" };
    case "plyo":
      return { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", icon: "🦘" };
    case "lift":
      return { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400", icon: "💪" };
    case "recovery":
      return { bg: "bg-cyan-500/20", border: "border-cyan-500/30", text: "text-cyan-400", icon: "🧘" };
    case "drills":
      return { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400", icon: "🎯" };
    default:
      return { bg: "bg-gray-500/20", border: "border-gray-500/30", text: "text-gray-400", icon: "📋" };
  }
};

const weeklySchedule = [
  { day: "Mon", workout: "Sprint Intervals", completed: true },
  { day: "Tue", workout: "Tempo Run", completed: true },
  { day: "Wed", workout: "Plyometrics", completed: true },
  { day: "Thu", workout: "Recovery", completed: true },
  { day: "Fri", workout: "Race Prep", completed: false },
  { day: "Sat", workout: "Meet Day", completed: false },
  { day: "Sun", workout: "Rest", completed: false },
];

export default function TrainingPage() {
  const [selectedTab, setSelectedTab] = useState("recent");
  
  const acuteLoad = 4200;
  const chronicLoad = 3800;
  const acwr = (acuteLoad / chronicLoad).toFixed(2);
  const acwrStatus = parseFloat(acwr) < 0.8 ? "undertrained" : parseFloat(acwr) > 1.3 ? "injury-risk" : "optimal";

  const stats = [
    { label: "Weekly Volume", value: "8.2km", icon: Activity, color: "orange", trend: "+12%" },
    { label: "Training Streak", value: "12 days", icon: Flame, color: "red", trend: "🔥" },
    { label: "Workouts", value: "4/6", icon: Target, color: "green", trend: null },
    { label: "Avg Effort", value: "6.8", icon: Zap, color: "yellow", trend: null },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <Dumbbell className="h-10 w-10 text-orange-500" />
              <span>TRAINING HUB</span>
              <Flame className="h-6 w-6 text-red-500 animate-pulse" />
            </h1>
            <p className="text-white/60 mt-1">
              Log workouts, track progress, and optimize your training
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Calendar className="h-4 w-4" />
              View Calendar
            </Button>
            <Link href="/training/log">
              <Button className="btn-track text-white font-bold gap-2">
                <Plus className="h-4 w-4" />
                Log Workout
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`rounded-lg p-3 ${
                  stat.color === "orange" ? "bg-orange-500/20" :
                  stat.color === "red" ? "bg-red-500/20" :
                  stat.color === "green" ? "bg-green-500/20" :
                  "bg-yellow-500/20"
                }`}>
                  <stat.icon className={`h-5 w-5 ${
                    stat.color === "orange" ? "text-orange-500" :
                    stat.color === "red" ? "text-red-500" :
                    stat.color === "green" ? "text-green-500" :
                    "text-yellow-500"
                  }`} />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-white/50">{stat.label}</p>
                    {stat.trend && (
                      <span className="text-xs text-green-400">{stat.trend}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Training Load Card */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    Training Load
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${
                    acwrStatus === "optimal" 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : acwrStatus === "undertrained" 
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}>
                    {acwrStatus === "optimal" && <CheckCircle2 className="h-3 w-3" />}
                    {acwrStatus === "injury-risk" && <AlertTriangle className="h-3 w-3" />}
                    {acwrStatus.replace("-", " ")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-white/50 mb-1">Acute Load (7 days)</p>
                    <p className="text-2xl font-black text-white">{acuteLoad.toLocaleString()}</p>
                    <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: "70%" }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">Chronic Load (28 days)</p>
                    <p className="text-2xl font-black text-white">{chronicLoad.toLocaleString()}</p>
                    <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "60%" }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">ACWR Ratio</p>
                    <p className="text-2xl font-black text-green-400">{acwr}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="text-yellow-500">0.8</span>
                      <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-yellow-500 via-green-500 to-red-500 relative">
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-black rounded-full shadow-lg"
                          style={{ left: `${Math.min(Math.max((parseFloat(acwr) - 0.5) / 1, 0), 1) * 100}%` }}
                        />
                      </div>
                      <span className="text-red-500">1.5</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/50 mt-4">
                  ✅ Your training load is in the optimal zone. Keep up the consistent work!
                </p>
              </CardContent>
            </Card>

            {/* Workout Tabs */}
            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="recent" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Recent Workouts
                </TabsTrigger>
                <TabsTrigger value="assigned" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Assigned
                </TabsTrigger>
                <TabsTrigger value="templates" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Templates
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="space-y-3 mt-4">
                {recentWorkouts.map((workout) => {
                  const style = getWorkoutTypeStyle(workout.type);
                  return (
                    <Card key={workout.id} className="bg-white/5 border-white/10 hover:border-orange-500/50 transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${style.bg} ${style.border} border`}>
                            {style.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-white">{workout.title}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${style.bg} ${style.border} ${style.text} border`}>
                                {workout.type}
                              </span>
                            </div>
                            <p className="text-sm text-white/50">{workout.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-white/60 text-sm">
                              {workout.totalDistance && (
                                <span>{(workout.totalDistance / 1000).toFixed(1)}km</span>
                              )}
                              {workout.duration && (
                                <span>{workout.duration}min</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(10)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-1.5 h-3 rounded-full ${
                                    i < workout.effort ? "bg-orange-500" : "bg-white/10"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-white/30" />
                        </div>
                        {workout.splits && (
                          <div className="mt-3 pt-3 border-t border-white/10 flex gap-2 overflow-x-auto">
                            {workout.splits.map((split, i) => (
                              <span key={i} className="px-2 py-1 rounded bg-white/5 text-xs font-mono text-yellow-400">
                                {split}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                  View All Workouts
                </Button>
              </TabsContent>
              
              <TabsContent value="assigned" className="mt-4">
                <Card className="p-8 text-center bg-white/5 border-white/10">
                  <Dumbbell className="h-12 w-12 mx-auto text-orange-500/50 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">No Assigned Workouts</h3>
                  <p className="text-white/50 mb-4">
                    Your coach hasn&apos;t assigned any workouts yet
                  </p>
                  <Button className="btn-track text-white font-bold">
                    Request Workout Plan
                  </Button>
                </Card>
              </TabsContent>
              
              <TabsContent value="templates" className="mt-4">
                <div className="grid md:grid-cols-2 gap-3">
                  {workoutTemplates.map((template) => {
                    const style = getWorkoutTypeStyle(template.type);
                    return (
                      <Card key={template.id} className="bg-white/5 border-white/10 hover:border-orange-500/50 transition-all cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${style.bg} ${style.border} border`}>
                              {template.icon}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-white">{template.name}</p>
                              <p className="text-sm text-white/50">{template.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-white/40">{template.duration}min</p>
                              <Button size="sm" className="mt-1 btn-track text-white text-xs px-3 py-1 h-7">
                                <Play className="h-3 w-3 mr-1" />
                                Start
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Schedule */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {weeklySchedule.map((day, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      day.completed 
                        ? "bg-green-500/10 border-green-500/20" 
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold w-8 text-white/60">{day.day}</span>
                      <span className="text-sm text-white">{day.workout}</span>
                    </div>
                    {day.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-white/30" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* PR Progress */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  PR Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { event: "100m", current: "11.25", target: "11.00", progress: 75, tier: "ELITE" as Tier },
                  { event: "200m", current: "22.80", target: "22.00", progress: 60, tier: "ALL_STATE" as Tier },
                  { event: "400m", current: "52.50", target: "51.00", progress: 45, tier: "VARSITY" as Tier },
                ].map((pr, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{pr.event}</span>
                        <TierBadge tier={pr.tier} size="sm" showEmoji={false} />
                      </div>
                      <span className="text-xs text-white/50 font-mono">
                        {pr.current} → <span className="text-green-400">{pr.target}</span>
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all"
                        style={{ width: `${pr.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <Plus className="h-4 w-4" />
                  Log Soreness
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <Timer className="h-4 w-4" />
                  Record Splits
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <Target className="h-4 w-4" />
                  Set New Goal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
