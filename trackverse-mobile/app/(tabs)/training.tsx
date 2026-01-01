import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dumbbell, Play, Clock, Flame, CheckCircle, Plus, Zap } from "lucide-react-native";

type Workout = {
  id: string;
  name: string;
  description: string;
  duration: string;
  type: "sprint" | "endurance" | "strength" | "recovery";
  completed?: boolean;
};

type Template = {
  id: string;
  name: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
};

const todaysWorkouts: Workout[] = [
  { id: "w1", name: "Morning Warm-up", description: "Dynamic stretching + drills", duration: "15min", type: "recovery", completed: true },
  { id: "w2", name: "Sprint Intervals", description: "6x200m at race pace", duration: "45min", type: "sprint", completed: false },
  { id: "w3", name: "Cool Down", description: "Easy jog + static stretching", duration: "10min", type: "recovery", completed: false },
];

const templates: Template[] = [
  { id: "t1", name: "Sprint Day", description: "6×200m at race pace", duration: "45min", icon: "⚡", color: "#f97316" },
  { id: "t2", name: "Tempo Run", description: "20min at 75% effort", duration: "30min", icon: "🏃", color: "#3b82f6" },
  { id: "t3", name: "Plyo Session", description: "Box jumps, bounds, hops", duration: "40min", icon: "🐎", color: "#a855f7" },
  { id: "t4", name: "Strength", description: "Lower body focus", duration: "60min", icon: "💪", color: "#22c55e" },
  { id: "t5", name: "Speed Drills", description: "A-skips, B-skips, high knees", duration: "25min", icon: "🎯", color: "#ef4444" },
  { id: "t6", name: "Recovery", description: "Easy jog + stretching", duration: "30min", icon: "🧘", color: "#06b6d4" },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "sprint": return "#f97316";
    case "endurance": return "#3b82f6";
    case "strength": return "#22c55e";
    case "recovery": return "#a855f7";
    default: return "#71717a";
  }
};

export default function TrainingScreen() {
  const [completedWorkouts, setCompletedWorkouts] = useState<string[]>(["w1"]);

  const toggleComplete = (id: string) => {
    setCompletedWorkouts(prev => 
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  const completedCount = completedWorkouts.length;
  const totalCount = todaysWorkouts.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="px-4 py-3 border-b border-zinc-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Dumbbell color="#f97316" size={28} />
            <Text className="text-2xl font-black text-white">Training</Text>
          </View>
          <Pressable className="bg-orange-500 rounded-full p-2">
            <Plus color="#fff" size={24} />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Today's Progress */}
        <View className="px-4 py-4">
          <View className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-bold text-lg">Today's Progress</Text>
              <View className="flex-row items-center gap-1">
                <Flame color="#f97316" size={20} />
                <Text className="text-orange-500 font-bold">14 day streak</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </View>
              <Text className="text-white font-bold">{completedCount}/{totalCount}</Text>
            </View>
          </View>
        </View>

        {/* Today's Workouts */}
        <View className="px-4 mb-6">
          <Text className="text-white font-bold text-lg mb-3">Today's Workouts</Text>
          {todaysWorkouts.map((workout) => {
            const isCompleted = completedWorkouts.includes(workout.id);
            return (
              <Pressable
                key={workout.id}
                className={`flex-row items-center p-4 rounded-xl mb-2 border ${
                  isCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-zinc-900 border-zinc-800'
                }`}
                onPress={() => toggleComplete(workout.id)}
              >
                <View 
                  className={`w-12 h-12 rounded-xl items-center justify-center mr-3`}
                  style={{ backgroundColor: getTypeColor(workout.type) + "30" }}
                >
                  {isCompleted ? (
                    <CheckCircle color="#22c55e" size={24} />
                  ) : (
                    <Play color={getTypeColor(workout.type)} size={24} />
                  )}
                </View>
                <View className="flex-1">
                  <Text className={`font-bold ${isCompleted ? 'text-zinc-500 line-through' : 'text-white'}`}>
                    {workout.name}
                  </Text>
                  <Text className="text-zinc-500 text-sm">{workout.description}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Clock color="#71717a" size={14} />
                  <Text className="text-zinc-500 text-sm">{workout.duration}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Quick Start Templates */}
        <View className="px-4 mb-6">
          <Text className="text-white font-bold text-lg mb-3">Quick Start</Text>
          <View className="flex-row flex-wrap gap-3">
            {templates.map((template) => (
              <Pressable
                key={template.id}
                className="w-[48%] p-4 rounded-xl border border-zinc-800"
                style={{ backgroundColor: template.color + "15" }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-2xl">{template.icon}</Text>
                  <Text className="text-zinc-500 text-xs">{template.duration}</Text>
                </View>
                <Text className="text-white font-bold">{template.name}</Text>
                <Text className="text-zinc-500 text-sm">{template.description}</Text>
                <Pressable 
                  className="mt-3 flex-row items-center justify-center py-2 rounded-lg"
                  style={{ backgroundColor: template.color }}
                >
                  <Zap color="#fff" size={14} />
                  <Text className="text-white font-bold text-sm ml-1">START</Text>
                </Pressable>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
