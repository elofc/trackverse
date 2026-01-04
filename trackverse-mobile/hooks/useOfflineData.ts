import { useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOfflineStore, FeedPost, RankingEntry, Meet } from "../stores/offlineStore";
import { useNetworkStatus } from "./useNetworkStatus";

// Mock API functions - replace with real API calls
const fetchFeed = async (): Promise<FeedPost[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: "p1",
      author: {
        name: "Elias Bolt",
        username: "flashelias",
        school: "Lincoln HS",
        tier: "GODSPEED",
      },
      type: "pr",
      content: "NEW PR ALERT! 🔥 Finally broke 10.2 in the 100m!",
      performance: {
        event: "100m",
        time: "10.15",
        improvement: "-0.17s",
      },
      likes: 234,
      comments: 45,
      createdAt: "2h ago",
    },
  ];
};

const fetchRankings = async (): Promise<RankingEntry[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "1", rank: 1, name: "Elias Bolt", school: "Lincoln HS", time: "10.15", tier: "GODSPEED", event: "100m" },
    { id: "2", rank: 2, name: "Marcus Johnson", school: "Roosevelt HS", time: "10.28", tier: "WORLD_CLASS", event: "100m" },
  ];
};

const fetchMeets = async (): Promise<Meet[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: "m1",
      name: "Regional Championships",
      date: "Jan 15, 2026",
      location: "Memorial Stadium",
      type: "championship",
      athleteCount: 24,
      myEvents: ["100m", "200m"],
      status: "upcoming",
    },
  ];
};

export function useOfflineFeed() {
  const { isOffline } = useNetworkStatus();
  const { cacheFeed, getCachedFeed, isDataStale } = useOfflineStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["feed"],
    queryFn: fetchFeed,
    enabled: !isOffline,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Cache data when fetched
  useEffect(() => {
    if (query.data) {
      cacheFeed(query.data);
    }
  }, [query.data, cacheFeed]);

  // Return cached data when offline
  const data = isOffline ? getCachedFeed() : (query.data ?? getCachedFeed());
  const isStale = isDataStale("feed");

  return {
    data,
    isLoading: query.isLoading && !isOffline,
    isError: query.isError && !isOffline,
    isOffline,
    isStale,
    refetch: query.refetch,
  };
}

export function useOfflineRankings(event?: string) {
  const { isOffline } = useNetworkStatus();
  const { cacheRankings, getCachedRankings, isDataStale } = useOfflineStore();

  const query = useQuery({
    queryKey: ["rankings", event],
    queryFn: fetchRankings,
    enabled: !isOffline,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (query.data) {
      cacheRankings(query.data);
    }
  }, [query.data, cacheRankings]);

  const data = isOffline ? getCachedRankings(event) : (query.data ?? getCachedRankings(event));
  const isStale = isDataStale("rankings");

  return {
    data,
    isLoading: query.isLoading && !isOffline,
    isError: query.isError && !isOffline,
    isOffline,
    isStale,
    refetch: query.refetch,
  };
}

export function useOfflineMeets() {
  const { isOffline } = useNetworkStatus();
  const { cacheMeets, getCachedMeets, isDataStale } = useOfflineStore();

  const query = useQuery({
    queryKey: ["meets"],
    queryFn: fetchMeets,
    enabled: !isOffline,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  useEffect(() => {
    if (query.data) {
      cacheMeets(query.data);
    }
  }, [query.data, cacheMeets]);

  const data = isOffline ? getCachedMeets() : (query.data ?? getCachedMeets());
  const isStale = isDataStale("meets");

  return {
    data,
    isLoading: query.isLoading && !isOffline,
    isError: query.isError && !isOffline,
    isOffline,
    isStale,
    refetch: query.refetch,
  };
}

// Hook to prefetch all data for offline use
export function usePrefetchOfflineData() {
  const queryClient = useQueryClient();
  const { isOffline } = useNetworkStatus();

  const prefetchAll = useCallback(async () => {
    if (isOffline) return;

    await Promise.all([
      queryClient.prefetchQuery({ queryKey: ["feed"], queryFn: fetchFeed }),
      queryClient.prefetchQuery({ queryKey: ["rankings"], queryFn: fetchRankings }),
      queryClient.prefetchQuery({ queryKey: ["meets"], queryFn: fetchMeets }),
    ]);
  }, [queryClient, isOffline]);

  return { prefetchAll };
}
