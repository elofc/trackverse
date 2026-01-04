import { View, Text, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { 
  ArrowLeft, 
  Plus, 
  Clock, 
  Flame, 
  Zap, 
  Timer,
  CheckCircle,
  X,
  ChevronDown,
  Save,
} from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Exercise = {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  distance?: string;
  time?: string;
  notes?: string;
};

type WorkoutType = "sprint" | "endurance" | "strength" | "recovery" | "plyometric";

const workoutTypes: { id: WorkoutType; label: string; icon: string; color: string }[] = [
  { id: "sprint", label: "Sprint", icon: "⚡", color: "#f97316" },
  { id: "endurance", label: "Endurance", icon: "🏃", color: "#3b82f6" },
  { id: "strength", label: "Strength", icon: "💪", color: "#22c55e" },
  { id: "plyometric", label: "Plyometric", icon: "🦘", color: "#a855f7" },
  { id: "recovery", label: "Recovery", icon: "🧘", color: "#06b6d4" },
];

const quickAddExercises = [
  { name: "100m Sprint", distance: "100m" },
  { name: "200m Sprint", distance: "200m" },
  { name: "400m Run", distance: "400m" },
  { name: "Box Jumps", sets: 3, reps: "10" },
  { name: "A-Skips", distance: "40m" },
  { name: "High Knees", time: "30s" },
  { name: "Squats", sets: 3, reps: "12" },
  { name: "Lunges", sets: 3, reps: "10 each" },
];

export default function LogWorkoutScreen() {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState("");
  const [selectedType, setSelectedType] = useState<WorkoutType>("sprint");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [rpe, setRpe] = useState<number | null>(null);

  const addExercise = (exercise: Partial<Exercise>) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exercise.name || "New Exercise",
      sets: exercise.sets,
      reps: exercise.reps,
      distance: exercise.distance,
      time: exercise.time,
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setExercises(exercises.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const saveWorkout = () => {
    if (!workoutName.trim()) {
      Alert.alert("Missing Info", "Please enter a workout name");
      return;
    }
    if (exercises.length === 0) {
      Alert.alert("Missing Info", "Please add at least one exercise");
      return;
    }

    // In production, this would save to the store/API
    Alert.alert(
      "Workout Saved! 🎉",
      `${workoutName} logged successfully!\n+50 XP earned`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const selectedTypeData = workoutTypes.find(t => t.id === selectedType)!;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-zinc-950">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-800">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft color="#fff" size={24} />
          </Pressable>
          <Text className="text-lg font-bold text-white">Log Workout</Text>
          <Pressable 
            onPress={saveWorkout}
            className="bg-orange-500 px-4 py-2 rounded-lg flex-row items-center"
          >
            <Save color="#fff" size={16} />
            <Text className="text-white font-bold ml-1">Save</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-4">
          {/* Workout Name */}
          <View className="mt-4">
            <Text className="text-zinc-400 text-sm mb-2">Workout Name</Text>
            <TextInput
              value={workoutName}
              onChangeText={setWorkoutName}
              placeholder="e.g., Morning Sprint Session"
              placeholderTextColor="#52525b"
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-lg"
            />
          </View>

          {/* Workout Type Selector */}
          <View className="mt-4">
            <Text className="text-zinc-400 text-sm mb-2">Workout Type</Text>
            <Pressable 
              onPress={() => setShowTypeSelector(!showTypeSelector)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">{selectedTypeData.icon}</Text>
                <Text className="text-white font-bold">{selectedTypeData.label}</Text>
              </View>
              <ChevronDown color="#71717a" size={20} />
            </Pressable>

            {showTypeSelector && (
              <View className="bg-zinc-900 border border-zinc-800 rounded-xl mt-2 overflow-hidden">
                {workoutTypes.map((type) => (
                  <Pressable
                    key={type.id}
                    onPress={() => {
                      setSelectedType(type.id);
                      setShowTypeSelector(false);
                    }}
                    className={`flex-row items-center gap-3 px-4 py-3 border-b border-zinc-800 ${
                      type.id === selectedType ? 'bg-orange-500/20' : ''
                    }`}
                  >
                    <Text className="text-xl">{type.icon}</Text>
                    <Text className={`font-bold ${type.id === selectedType ? 'text-orange-500' : 'text-white'}`}>
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Duration */}
          <View className="mt-4">
            <Text className="text-zinc-400 text-sm mb-2">Duration</Text>
            <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
              <Timer color="#71717a" size={20} />
              <TextInput
                value={duration}
                onChangeText={setDuration}
                placeholder="e.g., 45 min"
                placeholderTextColor="#52525b"
                className="flex-1 text-white ml-3"
              />
            </View>
          </View>

          {/* Quick Add Exercises */}
          <View className="mt-6">
            <Text className="text-zinc-400 text-sm mb-2">Quick Add</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
              <View className="flex-row gap-2">
                {quickAddExercises.map((exercise, i) => (
                  <Pressable
                    key={i}
                    onPress={() => addExercise(exercise)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2"
                  >
                    <Text className="text-white font-medium">{exercise.name}</Text>
                    <Text className="text-zinc-500 text-xs">
                      {exercise.distance || exercise.time || `${exercise.sets}x${exercise.reps}`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Exercises List */}
          <View className="mt-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-zinc-400 text-sm">Exercises ({exercises.length})</Text>
              <Pressable 
                onPress={() => addExercise({ name: "" })}
                className="flex-row items-center"
              >
                <Plus color="#f97316" size={16} />
                <Text className="text-orange-500 font-bold ml-1">Add Custom</Text>
              </Pressable>
            </View>

            {exercises.length === 0 ? (
              <View className="bg-zinc-900 border border-zinc-800 border-dashed rounded-xl p-8 items-center">
                <Text className="text-zinc-500 text-center">
                  No exercises added yet.{"\n"}Use Quick Add or tap + Add Custom
                </Text>
              </View>
            ) : (
              <View className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                {exercises.map((exercise, index) => (
                  <View 
                    key={exercise.id}
                    className={`p-4 ${index !== exercises.length - 1 ? 'border-b border-zinc-800' : ''}`}
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <TextInput
                        value={exercise.name}
                        onChangeText={(text) => updateExercise(exercise.id, 'name', text)}
                        placeholder="Exercise name"
                        placeholderTextColor="#52525b"
                        className="flex-1 text-white font-bold text-lg"
                      />
                      <Pressable onPress={() => removeExercise(exercise.id)}>
                        <X color="#ef4444" size={20} />
                      </Pressable>
                    </View>
                    <View className="flex-row gap-3">
                      <View className="flex-1">
                        <Text className="text-zinc-500 text-xs mb-1">Sets</Text>
                        <TextInput
                          value={exercise.sets?.toString() || ""}
                          onChangeText={(text) => updateExercise(exercise.id, 'sets', parseInt(text) || 0)}
                          placeholder="3"
                          placeholderTextColor="#52525b"
                          keyboardType="numeric"
                          className="bg-zinc-800 rounded-lg px-3 py-2 text-white"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-zinc-500 text-xs mb-1">Reps/Distance</Text>
                        <TextInput
                          value={exercise.reps || exercise.distance || ""}
                          onChangeText={(text) => updateExercise(exercise.id, 'reps', text)}
                          placeholder="10 or 100m"
                          placeholderTextColor="#52525b"
                          className="bg-zinc-800 rounded-lg px-3 py-2 text-white"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-zinc-500 text-xs mb-1">Time</Text>
                        <TextInput
                          value={exercise.time || ""}
                          onChangeText={(text) => updateExercise(exercise.id, 'time', text)}
                          placeholder="30s"
                          placeholderTextColor="#52525b"
                          className="bg-zinc-800 rounded-lg px-3 py-2 text-white"
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* RPE (Rate of Perceived Exertion) */}
          <View className="mt-6">
            <Text className="text-zinc-400 text-sm mb-2">How hard was it? (RPE)</Text>
            <View className="flex-row justify-between">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <Pressable
                  key={level}
                  onPress={() => setRpe(level)}
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    rpe === level 
                      ? level <= 3 ? 'bg-green-500' 
                        : level <= 6 ? 'bg-yellow-500' 
                        : level <= 8 ? 'bg-orange-500' 
                        : 'bg-red-500'
                      : 'bg-zinc-800'
                  }`}
                >
                  <Text className={`font-bold ${rpe === level ? 'text-white' : 'text-zinc-500'}`}>
                    {level}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-zinc-600 text-xs">Easy</Text>
              <Text className="text-zinc-600 text-xs">Max Effort</Text>
            </View>
          </View>

          {/* Notes */}
          <View className="mt-6 mb-8">
            <Text className="text-zinc-400 text-sm mb-2">Notes (optional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="How did it feel? Any PRs?"
              placeholderTextColor="#52525b"
              multiline
              numberOfLines={3}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white"
              style={{ textAlignVertical: 'top', minHeight: 80 }}
            />
          </View>

          {/* XP Preview */}
          <View className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl p-4 mb-8">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Zap color="#f97316" size={20} />
                <Text className="text-white font-bold">XP Reward</Text>
              </View>
              <Text className="text-orange-500 font-black text-xl">+50 XP</Text>
            </View>
            <Text className="text-zinc-400 text-sm mt-1">
              Complete this workout to earn XP and maintain your streak!
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
