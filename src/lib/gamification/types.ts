// Gamification System Types

// Badge Categories
export type BadgeCategory = "training" | "competition" | "ranking" | "social" | "special";

// Badge Rarity
export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

// Badge Definition
export type Badge = {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  icon: string; // emoji or icon name
  xpReward: number;
  requirement: BadgeRequirement;
  secret?: boolean; // hidden until earned
};

export type BadgeRequirement = 
  | { type: "workout_count"; count: number }
  | { type: "streak_days"; days: number }
  | { type: "total_distance"; distanceKm: number }
  | { type: "pr_count"; count: number }
  | { type: "meet_count"; count: number }
  | { type: "podium_count"; count: number }
  | { type: "win_streak"; count: number }
  | { type: "rank_achieved"; rank: number }
  | { type: "tier_achieved"; tier: string }
  | { type: "follower_count"; count: number }
  | { type: "post_likes"; count: number }
  | { type: "referral_count"; count: number }
  | { type: "challenge_complete"; challengeId?: string }
  | { type: "custom"; check: string }; // custom logic identifier

// User's earned badge
export type UserBadge = {
  id: string;
  oderId: string;
  badgeId: string;
  earnedAt: string;
  progress?: number; // 0-100 for in-progress badges
  featured?: boolean; // displayed on profile
};

// Streak Types
export type StreakType = "workout" | "login" | "pr" | "challenge";

export type Streak = {
  id: string;
  oderId: string;
  type: StreakType;
  currentCount: number;
  longestCount: number;
  lastActivityDate: string;
  startDate: string;
  isActive: boolean;
};

// XP and Leveling
export type XPSource = 
  | "workout_logged"
  | "pr_set"
  | "meet_completed"
  | "challenge_progress"
  | "challenge_complete"
  | "badge_earned"
  | "streak_milestone"
  | "referral"
  | "daily_login"
  | "post_engagement";

export type XPTransaction = {
  id: string;
  oderId: string;
  amount: number;
  source: XPSource;
  description: string;
  createdAt: string;
};

export type UserLevel = {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  perks?: string[];
};

// Challenge System
export type ChallengeType = "individual" | "team" | "global";
export type ChallengeStatus = "upcoming" | "active" | "completed" | "expired";

export type Challenge = {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  status: ChallengeStatus;
  startDate: string;
  endDate: string;
  goal: ChallengeGoal;
  rewards: ChallengeReward[];
  participantCount: number;
  teamId?: string; // for team challenges
  createdBy?: string;
  imageUrl?: string;
};

export type ChallengeGoal = 
  | { type: "distance"; targetKm: number }
  | { type: "workout_count"; target: number }
  | { type: "duration"; targetMinutes: number }
  | { type: "pr_count"; target: number }
  | { type: "specific_workout"; workoutType: string; target: number };

export type ChallengeReward = {
  type: "badge" | "xp" | "title" | "feature";
  value: string | number;
  description: string;
};

export type ChallengeParticipant = {
  oderId: string;
  userName: string;
  avatarUrl?: string;
  progress: number;
  rank?: number;
  completedAt?: string;
  joinedAt: string;
};

// Referral System
export type Referral = {
  id: string;
  referrerId: string;
  referredId: string;
  referredEmail: string;
  status: "pending" | "signed_up" | "qualified" | "rewarded";
  referralCode: string;
  createdAt: string;
  qualifiedAt?: string;
  rewardedAt?: string;
};

export type ReferralReward = {
  milestone: number; // number of referrals
  reward: ChallengeReward;
};

// Leaderboard
export type LeaderboardType = "weekly" | "monthly" | "all_time" | "challenge";
export type LeaderboardMetric = "xp" | "distance" | "workouts" | "prs" | "streak";

export type LeaderboardEntry = {
  rank: number;
  oderId: string;
  userName: string;
  avatarUrl?: string;
  value: number;
  change?: number; // rank change from previous period
  tier?: string;
};

export type Leaderboard = {
  id: string;
  type: LeaderboardType;
  metric: LeaderboardMetric;
  period?: string; // "2026-W01" for weekly, "2026-01" for monthly
  entries: LeaderboardEntry[];
  updatedAt: string;
};

// User Gamification Profile
export type GamificationProfile = {
  oderId: string;
  
  // XP & Level
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  
  // Streaks
  currentWorkoutStreak: number;
  longestWorkoutStreak: number;
  currentLoginStreak: number;
  
  // Stats
  totalWorkouts: number;
  totalDistanceKm: number;
  totalPRs: number;
  totalMeets: number;
  podiumFinishes: number;
  
  // Badges
  badgeCount: number;
  featuredBadges: string[]; // badge IDs
  
  // Referrals
  referralCode: string;
  referralCount: number;
  
  // Challenges
  activeChallenges: number;
  completedChallenges: number;
};

// Level definitions
export const LEVELS: UserLevel[] = [
  { level: 1, title: "Rookie", minXP: 0, maxXP: 100 },
  { level: 2, title: "Beginner", minXP: 100, maxXP: 250 },
  { level: 3, title: "Amateur", minXP: 250, maxXP: 500 },
  { level: 4, title: "Intermediate", minXP: 500, maxXP: 1000 },
  { level: 5, title: "Competitor", minXP: 1000, maxXP: 2000 },
  { level: 6, title: "Athlete", minXP: 2000, maxXP: 3500 },
  { level: 7, title: "Advanced", minXP: 3500, maxXP: 5500 },
  { level: 8, title: "Elite", minXP: 5500, maxXP: 8000 },
  { level: 9, title: "Pro", minXP: 8000, maxXP: 12000 },
  { level: 10, title: "Champion", minXP: 12000, maxXP: 17000 },
  { level: 11, title: "Master", minXP: 17000, maxXP: 25000 },
  { level: 12, title: "Legend", minXP: 25000, maxXP: 35000 },
  { level: 13, title: "GOAT", minXP: 35000, maxXP: 50000 },
  { level: 14, title: "Immortal", minXP: 50000, maxXP: 75000 },
  { level: 15, title: "GODSPEED", minXP: 75000, maxXP: Infinity, perks: ["Custom badge", "Featured profile", "Early access"] },
];

// XP rewards for actions
export const XP_REWARDS: Record<XPSource, number> = {
  workout_logged: 25,
  pr_set: 100,
  meet_completed: 50,
  challenge_progress: 10,
  challenge_complete: 200,
  badge_earned: 50,
  streak_milestone: 75,
  referral: 150,
  daily_login: 5,
  post_engagement: 5,
};
