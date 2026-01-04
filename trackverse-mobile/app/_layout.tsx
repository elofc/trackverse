import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { usePrefetchOfflineData } from "../hooks/useOfflineData";
import { useNotifications } from "../hooks/useNotifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    },
  },
});

function AppContent() {
  const { prefetchAll } = usePrefetchOfflineData();
  const { scheduleWorkoutReminder, scheduleStreakWarning, expoPushToken } = useNotifications();

  useEffect(() => {
    // Prefetch data for offline use on app start
    prefetchAll();
  }, [prefetchAll]);

  useEffect(() => {
    // Schedule default notifications
    const setupNotifications = async () => {
      await scheduleWorkoutReminder(8, 0); // 8 AM
      await scheduleStreakWarning(); // 8 PM
    };
    setupNotifications();
  }, [scheduleWorkoutReminder, scheduleStreakWarning]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#09090b" },
          animation: "slide_from_right",
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
