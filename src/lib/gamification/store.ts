import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  GamificationProfile,
  Streak,
  UserBadge,
  XPTransaction,
  Challenge,
  ChallengeParticipant,
  Referral,
  LEVELS,
  XP_REWARDS,
  XPSource,
} from "./types";
import { BADGES, getBadgeById } from "./badges";

type GamificationState = {
  profile: GamificationProfile | null;
  badges: UserBadge[];
  streaks: Streak[];
  xpHistory: XPTransaction[];
  activeChallenges: Challenge[];
  referrals: Referral[];
  
  // Actions
  initProfile: (oderId: string) => void;
  addXP: (amount: number, source: XPSource, description: string) => void;
  checkAndAwardBadges: () => void;
  updateStreak: (type: Streak["type"]) => void;
  joinChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  createReferral: (email: string) => string;
  completeReferral: (referralCode: string, referredId: string) => void;
  
  // Getters
  getCurrentLevel: () => { level: number; title: string; progress: number };
  getBadgeProgress: (badgeId: string) => number;
  getLeaderboardRank: () => number;
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      profile: null,
      badges: [],
      streaks: [],
      xpHistory: [],
      activeChallenges: [],
      referrals: [],

      initProfile: (oderId: string) => {
        const referralCode = `TV${oderId.slice(0, 6).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        
        set({
          profile: {
            oderId,
            totalXP: 0,
            currentLevel: 1,
            xpToNextLevel: 100,
            currentWorkoutStreak: 0,
            longestWorkoutStreak: 0,
            currentLoginStreak: 0,
            totalWorkouts: 0,
            totalDistanceKm: 0,
            totalPRs: 0,
            totalMeets: 0,
            podiumFinishes: 0,
            badgeCount: 0,
            featuredBadges: [],
            referralCode,
            referralCount: 0,
            activeChallenges: 0,
            completedChallenges: 0,
          },
          streaks: [
            {
              id: `streak_workout_${oderId}`,
              oderId,
              type: "workout",
              currentCount: 0,
              longestCount: 0,
              lastActivityDate: "",
              startDate: new Date().toISOString(),
              isActive: false,
            },
            {
              id: `streak_login_${oderId}`,
              oderId,
              type: "login",
              currentCount: 0,
              longestCount: 0,
              lastActivityDate: "",
              startDate: new Date().toISOString(),
              isActive: false,
            },
          ],
        });
      },

      addXP: (amount: number, source: XPSource, description: string) => {
        const { profile, xpHistory } = get();
        if (!profile) return;

        const transaction: XPTransaction = {
          id: `xp_${Date.now()}`,
          oderId: profile.oderId,
          amount,
          source,
          description,
          createdAt: new Date().toISOString(),
        };

        const newTotalXP = profile.totalXP + amount;
        
        // Calculate new level
        let newLevel = 1;
        let xpToNext = LEVELS[0].maxXP;
        
        for (const level of LEVELS) {
          if (newTotalXP >= level.minXP && newTotalXP < level.maxXP) {
            newLevel = level.level;
            xpToNext = level.maxXP - newTotalXP;
            break;
          }
        }

        set({
          profile: {
            ...profile,
            totalXP: newTotalXP,
            currentLevel: newLevel,
            xpToNextLevel: xpToNext,
          },
          xpHistory: [transaction, ...xpHistory].slice(0, 100), // Keep last 100
        });

        // Check for new badges after XP gain
        get().checkAndAwardBadges();
      },

      checkAndAwardBadges: () => {
        const { profile, badges } = get();
        if (!profile) return;

        const earnedBadgeIds = new Set(badges.map(b => b.badgeId));
        const newBadges: UserBadge[] = [];

        for (const badge of BADGES) {
          if (earnedBadgeIds.has(badge.id)) continue;

          let earned = false;
          const req = badge.requirement;

          switch (req.type) {
            case "workout_count":
              earned = profile.totalWorkouts >= req.count;
              break;
            case "streak_days":
              earned = profile.longestWorkoutStreak >= req.days;
              break;
            case "total_distance":
              earned = profile.totalDistanceKm >= req.distanceKm;
              break;
            case "pr_count":
              earned = profile.totalPRs >= req.count;
              break;
            case "meet_count":
              earned = profile.totalMeets >= req.count;
              break;
            case "podium_count":
              earned = profile.podiumFinishes >= req.count;
              break;
            case "referral_count":
              earned = profile.referralCount >= req.count;
              break;
            // Custom checks would be handled by backend
          }

          if (earned) {
            newBadges.push({
              id: `ub_${badge.id}_${Date.now()}`,
              oderId: profile.oderId,
              badgeId: badge.id,
              earnedAt: new Date().toISOString(),
            });

            // Award XP for badge
            get().addXP(badge.xpReward, "badge_earned", `Earned badge: ${badge.name}`);
          }
        }

        if (newBadges.length > 0) {
          set({
            badges: [...badges, ...newBadges],
            profile: {
              ...profile,
              badgeCount: profile.badgeCount + newBadges.length,
            },
          });
        }
      },

      updateStreak: (type: Streak["type"]) => {
        const { profile, streaks } = get();
        if (!profile) return;

        const today = new Date().toISOString().split("T")[0];
        const streakIndex = streaks.findIndex(s => s.type === type);
        
        if (streakIndex === -1) return;

        const streak = streaks[streakIndex];
        const lastDate = streak.lastActivityDate.split("T")[0];
        
        // Calculate days difference
        const lastDateObj = new Date(lastDate);
        const todayObj = new Date(today);
        const diffDays = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));

        let newCount = streak.currentCount;
        let newLongest = streak.longestCount;
        let isActive = true;

        if (diffDays === 0) {
          // Same day, no change
          return;
        } else if (diffDays === 1) {
          // Consecutive day
          newCount += 1;
          if (newCount > newLongest) {
            newLongest = newCount;
          }
        } else {
          // Streak broken
          newCount = 1;
        }

        const updatedStreaks = [...streaks];
        updatedStreaks[streakIndex] = {
          ...streak,
          currentCount: newCount,
          longestCount: newLongest,
          lastActivityDate: new Date().toISOString(),
          isActive,
        };

        // Check for streak milestones
        const milestones = [7, 14, 30, 60, 90, 180, 365];
        for (const milestone of milestones) {
          if (newCount === milestone) {
            get().addXP(XP_REWARDS.streak_milestone, "streak_milestone", `${milestone}-day ${type} streak!`);
          }
        }

        set({
          streaks: updatedStreaks,
          profile: {
            ...profile,
            currentWorkoutStreak: type === "workout" ? newCount : profile.currentWorkoutStreak,
            longestWorkoutStreak: type === "workout" ? newLongest : profile.longestWorkoutStreak,
            currentLoginStreak: type === "login" ? newCount : profile.currentLoginStreak,
          },
        });

        get().checkAndAwardBadges();
      },

      joinChallenge: (challengeId: string) => {
        const { profile, activeChallenges } = get();
        if (!profile) return;

        // In real app, this would call API
        set({
          profile: {
            ...profile,
            activeChallenges: profile.activeChallenges + 1,
          },
        });
      },

      updateChallengeProgress: (challengeId: string, progress: number) => {
        const { profile } = get();
        if (!profile) return;

        // Award XP for progress
        get().addXP(XP_REWARDS.challenge_progress, "challenge_progress", "Challenge progress");

        // If completed
        if (progress >= 100) {
          get().addXP(XP_REWARDS.challenge_complete, "challenge_complete", "Challenge completed!");
          set({
            profile: {
              ...profile,
              completedChallenges: profile.completedChallenges + 1,
              activeChallenges: Math.max(0, profile.activeChallenges - 1),
            },
          });
        }
      },

      createReferral: (email: string) => {
        const { profile, referrals } = get();
        if (!profile) return "";

        const referral: Referral = {
          id: `ref_${Date.now()}`,
          referrerId: profile.oderId,
          referredId: "",
          referredEmail: email,
          status: "pending",
          referralCode: profile.referralCode,
          createdAt: new Date().toISOString(),
        };

        set({ referrals: [...referrals, referral] });
        return profile.referralCode;
      },

      completeReferral: (referralCode: string, referredId: string) => {
        const { profile, referrals } = get();
        if (!profile) return;

        const referralIndex = referrals.findIndex(
          r => r.referralCode === referralCode && r.status === "pending"
        );

        if (referralIndex === -1) return;

        const updatedReferrals = [...referrals];
        updatedReferrals[referralIndex] = {
          ...referrals[referralIndex],
          referredId,
          status: "rewarded",
          qualifiedAt: new Date().toISOString(),
          rewardedAt: new Date().toISOString(),
        };

        // Award XP for referral
        get().addXP(XP_REWARDS.referral, "referral", "Friend joined TrackVerse!");

        set({
          referrals: updatedReferrals,
          profile: {
            ...profile,
            referralCount: profile.referralCount + 1,
          },
        });

        get().checkAndAwardBadges();
      },

      getCurrentLevel: () => {
        const { profile } = get();
        if (!profile) return { level: 1, title: "Rookie", progress: 0 };

        const levelData = LEVELS.find(l => l.level === profile.currentLevel) || LEVELS[0];
        const xpInLevel = profile.totalXP - levelData.minXP;
        const xpForLevel = levelData.maxXP - levelData.minXP;
        const progress = Math.min((xpInLevel / xpForLevel) * 100, 100);

        return {
          level: levelData.level,
          title: levelData.title,
          progress,
        };
      },

      getBadgeProgress: (badgeId: string) => {
        const { profile, badges } = get();
        if (!profile) return 0;

        // Check if already earned
        if (badges.some(b => b.badgeId === badgeId)) return 100;

        const badge = getBadgeById(badgeId);
        if (!badge) return 0;

        const req = badge.requirement;
        let progress = 0;

        switch (req.type) {
          case "workout_count":
            progress = (profile.totalWorkouts / req.count) * 100;
            break;
          case "streak_days":
            progress = (profile.longestWorkoutStreak / req.days) * 100;
            break;
          case "total_distance":
            progress = (profile.totalDistanceKm / req.distanceKm) * 100;
            break;
          case "pr_count":
            progress = (profile.totalPRs / req.count) * 100;
            break;
          case "meet_count":
            progress = (profile.totalMeets / req.count) * 100;
            break;
          case "referral_count":
            progress = (profile.referralCount / req.count) * 100;
            break;
        }

        return Math.min(progress, 99); // Cap at 99 until actually earned
      },

      getLeaderboardRank: () => {
        // In real app, this would come from API
        return Math.floor(Math.random() * 100) + 1;
      },
    }),
    {
      name: "trackverse-gamification",
      partialize: (state) => ({
        profile: state.profile,
        badges: state.badges,
        streaks: state.streaks,
        xpHistory: state.xpHistory.slice(0, 50),
        referrals: state.referrals,
      }),
    }
  )
);
