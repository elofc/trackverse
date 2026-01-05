import { Badge } from "./types";

// All available badges in TrackVerse
export const BADGES: Badge[] = [
  // 🏃 TRAINING BADGES
  {
    id: "first_workout",
    name: "First Steps",
    description: "Log your first workout",
    category: "training",
    rarity: "common",
    icon: "🏃",
    xpReward: 50,
    requirement: { type: "workout_count", count: 1 },
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day workout streak",
    category: "training",
    rarity: "uncommon",
    icon: "🔥",
    xpReward: 100,
    requirement: { type: "streak_days", days: 7 },
  },
  {
    id: "month_monster",
    name: "Month Monster",
    description: "Maintain a 30-day workout streak",
    category: "training",
    rarity: "rare",
    icon: "💪",
    xpReward: 300,
    requirement: { type: "streak_days", days: 30 },
  },
  {
    id: "century_club",
    name: "Century Club",
    description: "Log 100 workouts",
    category: "training",
    rarity: "rare",
    icon: "💯",
    xpReward: 500,
    requirement: { type: "workout_count", count: 100 },
  },
  {
    id: "iron_will",
    name: "Iron Will",
    description: "Maintain a 365-day workout streak",
    category: "training",
    rarity: "legendary",
    icon: "⚡",
    xpReward: 2000,
    requirement: { type: "streak_days", days: 365 },
  },
  {
    id: "volume_king",
    name: "Volume King",
    description: "Log 1000km total distance",
    category: "training",
    rarity: "epic",
    icon: "👑",
    xpReward: 1000,
    requirement: { type: "total_distance", distanceKm: 1000 },
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Complete 10 workouts before 7am",
    category: "training",
    rarity: "uncommon",
    icon: "🌅",
    xpReward: 75,
    requirement: { type: "custom", check: "early_workouts_10" },
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Complete 10 workouts after 8pm",
    category: "training",
    rarity: "uncommon",
    icon: "🦉",
    xpReward: 75,
    requirement: { type: "custom", check: "late_workouts_10" },
  },

  // 🏆 COMPETITION BADGES
  {
    id: "first_race",
    name: "Race Day",
    description: "Log your first meet result",
    category: "competition",
    rarity: "common",
    icon: "🏁",
    xpReward: 50,
    requirement: { type: "meet_count", count: 1 },
  },
  {
    id: "podium_finish",
    name: "Podium Finish",
    description: "Place top 3 at a meet",
    category: "competition",
    rarity: "uncommon",
    icon: "🥇",
    xpReward: 150,
    requirement: { type: "podium_count", count: 1 },
  },
  {
    id: "pr_machine",
    name: "PR Machine",
    description: "Set 10 personal records",
    category: "competition",
    rarity: "rare",
    icon: "📈",
    xpReward: 300,
    requirement: { type: "pr_count", count: 10 },
  },
  {
    id: "undefeated",
    name: "Undefeated",
    description: "Win 5 races in a row",
    category: "competition",
    rarity: "epic",
    icon: "🔱",
    xpReward: 500,
    requirement: { type: "win_streak", count: 5 },
  },
  {
    id: "state_qualifier",
    name: "State Qualifier",
    description: "Qualify for state championships",
    category: "competition",
    rarity: "rare",
    icon: "🎯",
    xpReward: 400,
    requirement: { type: "custom", check: "state_qualified" },
  },
  {
    id: "meet_veteran",
    name: "Meet Veteran",
    description: "Compete in 25 meets",
    category: "competition",
    rarity: "rare",
    icon: "🎖️",
    xpReward: 350,
    requirement: { type: "meet_count", count: 25 },
  },

  // 📈 RANKING BADGES
  {
    id: "on_the_board",
    name: "On the Board",
    description: "Get ranked for the first time",
    category: "ranking",
    rarity: "common",
    icon: "📋",
    xpReward: 75,
    requirement: { type: "custom", check: "first_ranking" },
  },
  {
    id: "top_100",
    name: "Top 100",
    description: "Reach top 100 in your state",
    category: "ranking",
    rarity: "uncommon",
    icon: "💫",
    xpReward: 200,
    requirement: { type: "rank_achieved", rank: 100 },
  },
  {
    id: "top_10",
    name: "Top 10",
    description: "Reach top 10 in your state",
    category: "ranking",
    rarity: "epic",
    icon: "⭐",
    xpReward: 750,
    requirement: { type: "rank_achieved", rank: 10 },
  },
  {
    id: "number_one",
    name: "#1",
    description: "Reach #1 in your state",
    category: "ranking",
    rarity: "legendary",
    icon: "🏆",
    xpReward: 1500,
    requirement: { type: "rank_achieved", rank: 1 },
  },
  {
    id: "tier_up",
    name: "Tier Up",
    description: "Advance to a new performance tier",
    category: "ranking",
    rarity: "uncommon",
    icon: "🚀",
    xpReward: 100,
    requirement: { type: "custom", check: "tier_advanced" },
  },
  {
    id: "godspeed_tier",
    name: "GODSPEED",
    description: "Reach the legendary GODSPEED tier",
    category: "ranking",
    rarity: "legendary",
    icon: "⚡",
    xpReward: 2500,
    requirement: { type: "tier_achieved", tier: "GODSPEED" },
  },

  // 👥 SOCIAL BADGES
  {
    id: "team_player",
    name: "Team Player",
    description: "Join a team",
    category: "social",
    rarity: "common",
    icon: "🤝",
    xpReward: 50,
    requirement: { type: "custom", check: "joined_team" },
  },
  {
    id: "influencer",
    name: "Influencer",
    description: "Get 100 followers",
    category: "social",
    rarity: "rare",
    icon: "📱",
    xpReward: 300,
    requirement: { type: "follower_count", count: 100 },
  },
  {
    id: "viral",
    name: "Viral",
    description: "Get 1000 likes on a single post",
    category: "social",
    rarity: "epic",
    icon: "🔥",
    xpReward: 500,
    requirement: { type: "post_likes", count: 1000 },
  },
  {
    id: "mentor",
    name: "Mentor",
    description: "Help 10 athletes improve their PRs",
    category: "social",
    rarity: "rare",
    icon: "🎓",
    xpReward: 400,
    requirement: { type: "custom", check: "mentored_10" },
  },
  {
    id: "ambassador",
    name: "Ambassador",
    description: "Refer 10 friends to TrackVerse",
    category: "social",
    rarity: "epic",
    icon: "🌟",
    xpReward: 1000,
    requirement: { type: "referral_count", count: 10 },
  },
  {
    id: "first_referral",
    name: "Recruiter",
    description: "Refer your first friend",
    category: "social",
    rarity: "common",
    icon: "👋",
    xpReward: 100,
    requirement: { type: "referral_count", count: 1 },
  },

  // 🎯 SPECIAL BADGES
  {
    id: "beta_tester",
    name: "Beta Tester",
    description: "Joined during beta",
    category: "special",
    rarity: "rare",
    icon: "🧪",
    xpReward: 500,
    requirement: { type: "custom", check: "beta_user" },
    secret: true,
  },
  {
    id: "founding_member",
    name: "Founding Member",
    description: "One of the first 1000 users",
    category: "special",
    rarity: "legendary",
    icon: "💎",
    xpReward: 1000,
    requirement: { type: "custom", check: "founding_member" },
    secret: true,
  },
  {
    id: "challenge_champion",
    name: "Challenge Champion",
    description: "Win a global challenge",
    category: "special",
    rarity: "epic",
    icon: "🏅",
    xpReward: 750,
    requirement: { type: "custom", check: "challenge_winner" },
  },
  {
    id: "perfect_week",
    name: "Perfect Week",
    description: "Complete all planned workouts in a week",
    category: "special",
    rarity: "uncommon",
    icon: "✨",
    xpReward: 150,
    requirement: { type: "custom", check: "perfect_week" },
  },
  {
    id: "comeback_kid",
    name: "Comeback Kid",
    description: "Return after 30+ days and log a workout",
    category: "special",
    rarity: "uncommon",
    icon: "🔄",
    xpReward: 100,
    requirement: { type: "custom", check: "comeback" },
    secret: true,
  },
];

// Helper functions
export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(b => b.id === id);
}

export function getBadgesByCategory(category: Badge["category"]): Badge[] {
  return BADGES.filter(b => b.category === category);
}

export function getBadgesByRarity(rarity: Badge["rarity"]): Badge[] {
  return BADGES.filter(b => b.rarity === rarity);
}

export function getVisibleBadges(): Badge[] {
  return BADGES.filter(b => !b.secret);
}

export function getRarityColor(rarity: Badge["rarity"]): string {
  switch (rarity) {
    case "common": return "text-zinc-400 bg-zinc-400/20";
    case "uncommon": return "text-green-400 bg-green-400/20";
    case "rare": return "text-blue-400 bg-blue-400/20";
    case "epic": return "text-purple-400 bg-purple-400/20";
    case "legendary": return "text-orange-400 bg-orange-400/20";
  }
}

export function getRarityBorder(rarity: Badge["rarity"]): string {
  switch (rarity) {
    case "common": return "border-zinc-500";
    case "uncommon": return "border-green-500";
    case "rare": return "border-blue-500";
    case "epic": return "border-purple-500";
    case "legendary": return "border-orange-500 animate-pulse";
  }
}
