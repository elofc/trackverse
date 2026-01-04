import { View, Text, Pressable } from "react-native";
import { WifiOff, RefreshCw, Cloud } from "lucide-react-native";
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  useSharedValue,
  withSequence,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useWorkoutStore } from "../stores/workoutStore";

type Props = {
  isOffline: boolean;
  pendingActions: number;
  onRetry?: () => void;
};

export function OfflineBanner({ isOffline, pendingActions, onRetry }: Props) {
  const rotation = useSharedValue(0);
  const processSyncQueue = useWorkoutStore((state) => state.processSyncQueue);

  useEffect(() => {
    if (!isOffline && pendingActions > 0) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000 }),
        -1,
        false
      );
    } else {
      rotation.value = 0;
    }
  }, [isOffline, pendingActions, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (!isOffline && pendingActions === 0) {
    return null;
  }

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (!isOffline) {
      processSyncQueue();
    }
  };

  return (
    <View 
      className={`px-4 py-2 flex-row items-center justify-between ${
        isOffline ? 'bg-red-500/20' : 'bg-yellow-500/20'
      }`}
    >
      <View className="flex-row items-center gap-2">
        {isOffline ? (
          <>
            <WifiOff color="#ef4444" size={16} />
            <Text className="text-red-400 font-medium text-sm">
              You're offline
            </Text>
          </>
        ) : (
          <>
            <Animated.View style={animatedStyle}>
              <Cloud color="#eab308" size={16} />
            </Animated.View>
            <Text className="text-yellow-400 font-medium text-sm">
              Syncing {pendingActions} action{pendingActions !== 1 ? 's' : ''}...
            </Text>
          </>
        )}
      </View>

      {isOffline && pendingActions > 0 && (
        <View className="flex-row items-center gap-2">
          <Text className="text-zinc-500 text-xs">
            {pendingActions} pending
          </Text>
          <Pressable 
            onPress={handleRetry}
            className="bg-zinc-800 px-3 py-1 rounded-full flex-row items-center gap-1"
          >
            <RefreshCw color="#71717a" size={12} />
            <Text className="text-zinc-400 text-xs">Retry</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
