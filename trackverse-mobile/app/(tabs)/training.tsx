import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Dumbbell, Play, Clock, Flame, CheckCircle, Plus, Zap, Trash2 } from "lucide-react-native";
import { SwipeableWorkoutItem } from "../../components/SwipeableWorkoutItem";
import { OfflineBanner } from "../../components/OfflineBanner";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";
import { useWorkoutStore } from "../../stores/workoutStore";

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
  const router = useRouter();
  const { isOffline } = useNetworkStatus();
  const syncQueueLength = useWorkoutStore((state) => state.syncQueue.length);
  const streak = useWorkoutStore((state) => state.streak);
  
  const [completedWorkouts, setCompletedWorkouts] = useState<string[]>(["w1"]);
  const [workouts, setWorkouts] = useState<Workout[]>(todaysWorkouts);

  const toggleComplete = (id: string) => {
    setCompletedWorkouts(prev => 
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to remove this workout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => setWorkouts(prev => prev.filter(w => w.id !== id))
        },
      ]
    );
  };

  const handleEdit = (id: string) => {
    Alert.alert("Edit Workout", `Long-pressed workout ${id}. Edit functionality coming soon!`);
  };

  const completedCount = completedWorkouts.length;
  const totalCount = workouts.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Offline Banner */}
      <OfflineBanner isOffline={isOffline} pendingActions={syncQueueLength} />
      {/* Header */}
      <View className="px-4 py-3 border-b border-zinc-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Dumbbell color="#f97316" size={28} />
            <Text className="text-2xl font-black text-white">Training</Text>
          </View>
          <Pressable 
            className="bg-orange-500 rounded-full p-2"
            onPress={() => router.push("/log-workout" as any)}
          >
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

        {/* Today's Workouts - Swipeable */}
        <View className="mb-6">
          <Text className="text-white font-bold text-lg mb-3 px-4">Today's Workouts</Text>
          <Text className="text-zinc-500 text-xs mb-2 px-4">← Swipe right to complete • Swipe left to delete →</Text>
          {workouts.map((workout) => (
            <SwipeableWorkoutItem
              key={workout.id}
              workout={workout}
              isCompleted={completedWorkouts.includes(workout.id)}
              onComplete={toggleComplete}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
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
    </GestureHandlerRootView>
  );
}
