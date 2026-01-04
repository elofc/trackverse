import { View, Text, Pressable, Animated } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { CheckCircle, Play, Clock, Trash2, Edit3 } from "lucide-react-native";

type Workout = {
  id: string;
  name: string;
  description: string;
  duration: string;
  type: "sprint" | "endurance" | "strength" | "recovery";
  completed?: boolean;
};

type Props = {
  workout: Workout;
  isCompleted: boolean;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "sprint": return "#f97316";
    case "endurance": return "#3b82f6";
    case "strength": return "#22c55e";
    case "recovery": return "#a855f7";
    default: return "#71717a";
  }
};

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>, onDelete: () => void) {
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(drag.value, [-100, 0], [0, 100]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Reanimated.View style={animatedStyle} className="flex-row items-center">
      <Pressable
        onPress={onDelete}
        className="bg-red-500 h-full justify-center items-center px-6"
      >
        <Trash2 color="#fff" size={24} />
        <Text className="text-white text-xs mt-1 font-bold">Delete</Text>
      </Pressable>
    </Reanimated.View>
  );
}

function LeftAction(prog: SharedValue<number>, drag: SharedValue<number>, onComplete: () => void, isCompleted: boolean) {
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(drag.value, [0, 100], [-100, 0]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Reanimated.View style={animatedStyle} className="flex-row items-center">
      <Pressable
        onPress={onComplete}
        className={`h-full justify-center items-center px-6 ${isCompleted ? 'bg-zinc-600' : 'bg-green-500'}`}
      >
        <CheckCircle color="#fff" size={24} />
        <Text className="text-white text-xs mt-1 font-bold">
          {isCompleted ? 'Undo' : 'Done'}
        </Text>
      </Pressable>
    </Reanimated.View>
  );
}

export function SwipeableWorkoutItem({ workout, isCompleted, onComplete, onDelete, onEdit }: Props) {
  const typeColor = getTypeColor(workout.type);

  return (
    <ReanimatedSwipeable
      friction={2}
      leftThreshold={40}
      rightThreshold={40}
      renderLeftActions={(prog, drag) => LeftAction(prog, drag, () => onComplete(workout.id), isCompleted)}
      renderRightActions={(prog, drag) => RightAction(prog, drag, () => onDelete(workout.id))}
    >
      <Pressable
        onLongPress={() => onEdit(workout.id)}
        delayLongPress={500}
        className={`flex-row items-center p-4 bg-zinc-900 border-b border-zinc-800 ${
          isCompleted ? 'opacity-60' : ''
        }`}
      >
        <View 
          className="w-12 h-12 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: typeColor + "30" }}
        >
          {isCompleted ? (
            <CheckCircle color="#22c55e" size={24} />
          ) : (
            <Play color={typeColor} size={24} />
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
    </ReanimatedSwipeable>
  );
}
