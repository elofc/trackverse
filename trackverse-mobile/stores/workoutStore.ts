import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Workout = {
  id: string;
  name: string;
  description: string;
  duration: string;
  type: "sprint" | "endurance" | "strength" | "recovery" | "plyometric";
  exercises: Exercise[];
  rpe?: number;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  synced: boolean;
};

export type Exercise = {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  distance?: string;
  time?: string;
};

type SyncAction = {
  id: string;
  type: "create" | "update" | "delete";
  payload: Partial<Workout>;
  timestamp: string;
};

type WorkoutStore = {
  workouts: Workout[];
  todaysWorkouts: string[];
  completedWorkouts: string[];
  streak: number;
  lastWorkoutDate: string | null;
  syncQueue: SyncAction[];
  isOnline: boolean;

  // Actions
  addWorkout: (workout: Omit<Workout, "id" | "createdAt" | "synced">) => void;
  completeWorkout: (id: string) => void;
  uncompleteWorkout: (id: string) => void;
  deleteWorkout: (id: string) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  
  // Sync actions
  setOnline: (online: boolean) => void;
  addToSyncQueue: (action: Omit<SyncAction, "id" | "timestamp">) => void;
  clearSyncQueue: () => void;
  processSyncQueue: () => Promise<void>;
  
  // Streak
  updateStreak: () => void;
};

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      workouts: [],
      todaysWorkouts: [],
      completedWorkouts: [],
      streak: 14,
      lastWorkoutDate: null,
      syncQueue: [],
      isOnline: true,

      addWorkout: (workoutData) => {
        const workout: Workout = {
          ...workoutData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          synced: get().isOnline,
        };

        set((state) => ({
          workouts: [...state.workouts, workout],
          todaysWorkouts: [...state.todaysWorkouts, workout.id],
        }));

        if (!get().isOnline) {
          get().addToSyncQueue({ type: "create", payload: workout });
        }
      },

      completeWorkout: (id) => {
        set((state) => ({
          completedWorkouts: [...state.completedWorkouts, id],
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, completedAt: new Date().toISOString() } : w
          ),
        }));
        get().updateStreak();

        if (!get().isOnline) {
          get().addToSyncQueue({ type: "update", payload: { id, completedAt: new Date().toISOString() } });
        }
      },

      uncompleteWorkout: (id) => {
        set((state) => ({
          completedWorkouts: state.completedWorkouts.filter((wId) => wId !== id),
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, completedAt: undefined } : w
          ),
        }));
      },

      deleteWorkout: (id) => {
        set((state) => ({
          workouts: state.workouts.filter((w) => w.id !== id),
          todaysWorkouts: state.todaysWorkouts.filter((wId) => wId !== id),
          completedWorkouts: state.completedWorkouts.filter((wId) => wId !== id),
        }));

        if (!get().isOnline) {
          get().addToSyncQueue({ type: "delete", payload: { id } });
        }
      },

      updateWorkout: (id, updates) => {
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, ...updates, synced: get().isOnline } : w
          ),
        }));

        if (!get().isOnline) {
          get().addToSyncQueue({ type: "update", payload: { id, ...updates } });
        }
      },

      setOnline: (online) => {
        set({ isOnline: online });
        if (online && get().syncQueue.length > 0) {
          get().processSyncQueue();
        }
      },

      addToSyncQueue: (action) => {
        const syncAction: SyncAction = {
          ...action,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          syncQueue: [...state.syncQueue, syncAction],
        }));
      },

      clearSyncQueue: () => {
        set({ syncQueue: [] });
      },

      processSyncQueue: async () => {
        const queue = get().syncQueue;
        if (queue.length === 0) return;

        // In production, this would make API calls
        console.log("Processing sync queue:", queue.length, "items");

        for (const action of queue) {
          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 100));
            console.log("Synced:", action.type, action.payload);
          } catch (error) {
            console.error("Sync failed:", error);
            return; // Stop processing on error
          }
        }

        // Mark all workouts as synced
        set((state) => ({
          workouts: state.workouts.map((w) => ({ ...w, synced: true })),
          syncQueue: [],
        }));
      },

      updateStreak: () => {
        const today = new Date().toDateString();
        const lastDate = get().lastWorkoutDate;

        if (lastDate === today) {
          return; // Already worked out today
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDate === yesterday.toDateString()) {
          // Consecutive day - increment streak
          set((state) => ({
            streak: state.streak + 1,
            lastWorkoutDate: today,
          }));
        } else if (lastDate !== today) {
          // Streak broken - reset to 1
          set({
            streak: 1,
            lastWorkoutDate: today,
          });
        }
      },
    }),
    {
      name: "workout-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
