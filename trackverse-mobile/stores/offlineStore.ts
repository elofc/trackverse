import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type CachedData = {
  feed: FeedPost[];
  rankings: RankingEntry[];
  profile: UserProfile | null;
  meets: Meet[];
  lastUpdated: Record<string, string>;
};

export type FeedPost = {
  id: string;
  author: {
    name: string;
    username: string;
    school: string;
    tier: string;
  };
  type: "pr" | "workout" | "meet" | "general";
  content: string;
  performance?: {
    event: string;
    time: string;
    improvement?: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
};

export type RankingEntry = {
  id: string;
  rank: number;
  name: string;
  school: string;
  time: string;
  tier: string;
  event: string;
};

export type UserProfile = {
  id: string;
  name: string;
  username: string;
  school: string;
  tier: string;
  events: string[];
  stats: {
    prs: number;
    streak: number;
    workouts: number;
    meets: number;
  };
};

export type Meet = {
  id: string;
  name: string;
  date: string;
  location: string;
  type: string;
  athleteCount: number;
  myEvents?: string[];
  status: "upcoming" | "today" | "completed";
};

type OfflineStore = {
  cachedData: CachedData;
  isHydrated: boolean;

  // Cache actions
  cacheFeed: (posts: FeedPost[]) => void;
  cacheRankings: (rankings: RankingEntry[]) => void;
  cacheProfile: (profile: UserProfile) => void;
  cacheMeets: (meets: Meet[]) => void;
  
  // Getters
  getCachedFeed: () => FeedPost[];
  getCachedRankings: (event?: string) => RankingEntry[];
  getCachedProfile: () => UserProfile | null;
  getCachedMeets: () => Meet[];
  
  // Utils
  isDataStale: (key: keyof CachedData["lastUpdated"], maxAgeMinutes?: number) => boolean;
  clearCache: () => void;
  setHydrated: (hydrated: boolean) => void;
};

const initialCachedData: CachedData = {
  feed: [],
  rankings: [],
  profile: null,
  meets: [],
  lastUpdated: {},
};

export const useOfflineStore = create<OfflineStore>()(
  persist(
    (set, get) => ({
      cachedData: initialCachedData,
      isHydrated: false,

      cacheFeed: (posts) => {
        set((state) => ({
          cachedData: {
            ...state.cachedData,
            feed: posts,
            lastUpdated: {
              ...state.cachedData.lastUpdated,
              feed: new Date().toISOString(),
            },
          },
        }));
      },

      cacheRankings: (rankings) => {
        set((state) => ({
          cachedData: {
            ...state.cachedData,
            rankings,
            lastUpdated: {
              ...state.cachedData.lastUpdated,
              rankings: new Date().toISOString(),
            },
          },
        }));
      },

      cacheProfile: (profile) => {
        set((state) => ({
          cachedData: {
            ...state.cachedData,
            profile,
            lastUpdated: {
              ...state.cachedData.lastUpdated,
              profile: new Date().toISOString(),
            },
          },
        }));
      },

      cacheMeets: (meets) => {
        set((state) => ({
          cachedData: {
            ...state.cachedData,
            meets,
            lastUpdated: {
              ...state.cachedData.lastUpdated,
              meets: new Date().toISOString(),
            },
          },
        }));
      },

      getCachedFeed: () => get().cachedData.feed,
      
      getCachedRankings: (event) => {
        const rankings = get().cachedData.rankings;
        if (event) {
          return rankings.filter((r) => r.event === event);
        }
        return rankings;
      },
      
      getCachedProfile: () => get().cachedData.profile,
      
      getCachedMeets: () => get().cachedData.meets,

      isDataStale: (key, maxAgeMinutes = 30) => {
        const lastUpdated = get().cachedData.lastUpdated[key];
        if (!lastUpdated) return true;

        const lastUpdatedDate = new Date(lastUpdated);
        const now = new Date();
        const diffMinutes = (now.getTime() - lastUpdatedDate.getTime()) / (1000 * 60);

        return diffMinutes > maxAgeMinutes;
      },

      clearCache: () => {
        set({ cachedData: initialCachedData });
      },

      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: "offline-cache",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
