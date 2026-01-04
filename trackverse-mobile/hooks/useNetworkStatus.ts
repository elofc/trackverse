import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useWorkoutStore } from "../stores/workoutStore";

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const setOnline = useWorkoutStore((state) => state.setOnline);
  const processSyncQueue = useWorkoutStore((state) => state.processSyncQueue);
  const syncQueueLength = useWorkoutStore((state) => state.syncQueue.length);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      setConnectionType(state.type);
      setOnline(connected);

      // Auto-sync when coming back online
      if (connected && syncQueueLength > 0) {
        processSyncQueue();
      }
    });

    // Get initial state
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? false);
      setConnectionType(state.type);
      setOnline(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, [setOnline, processSyncQueue, syncQueueLength]);

  return {
    isConnected,
    connectionType,
    isOffline: isConnected === false,
  };
}
