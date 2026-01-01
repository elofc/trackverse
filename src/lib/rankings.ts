// Rankings Engine - TrackVerse
// Calculates athlete rankings and tier assignments

export type Tier = 
  | 'ROOKIE' 
  | 'JV' 
  | 'VARSITY' 
  | 'ELITE' 
  | 'ALL_STATE' 
  | 'NATIONAL' 
  | 'WORLD_CLASS' 
  | 'GODSPEED';

export interface TierInfo {
  name: string;
  displayName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  emoji: string;
  description: string;
  minPoints: number;
}

// Tier configuration with styling
export const TIERS: Record<Tier, TierInfo> = {
  ROOKIE: {
    name: 'ROOKIE',
    displayName: 'Rookie',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500/30',
    glowColor: '',
    emoji: '🌱',
    description: 'Just getting started',
    minPoints: 0,
  },
  JV: {
    name: 'JV',
    displayName: 'JV',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    glowColor: '',
    emoji: '📈',
    description: 'Junior Varsity level',
    minPoints: 100,
  },
  VARSITY: {
    name: 'VARSITY',
    displayName: 'Varsity',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    glowColor: '',
    emoji: '🎽',
    description: 'Varsity competitor',
    minPoints: 250,
  },
  ELITE: {
    name: 'ELITE',
    displayName: 'Elite',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    glowColor: 'shadow-purple-500/20',
    emoji: '💎',
    description: 'Top of your school',
    minPoints: 500,
  },
  ALL_STATE: {
    name: 'ALL_STATE',
    displayName: 'All-State',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    glowColor: 'shadow-orange-500/30',
    emoji: '⭐',
    description: 'State-level competitor',
    minPoints: 750,
  },
  NATIONAL: {
    name: 'NATIONAL',
    displayName: 'National',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    glowColor: 'shadow-red-500/30',
    emoji: '🇺🇸',
    description: 'National caliber athlete',
    minPoints: 900,
  },
  WORLD_CLASS: {
    name: 'WORLD_CLASS',
    displayName: 'World Class',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    glowColor: 'shadow-yellow-500/40',
    emoji: '🌍',
    description: 'World-class performer',
    minPoints: 975,
  },
  GODSPEED: {
    name: 'GODSPEED',
    displayName: 'GODSPEED',
    color: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500',
    bgColor: 'bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20',
    borderColor: 'border-yellow-500/50',
    glowColor: 'shadow-[0_0_30px_rgba(251,191,36,0.5)]',
    emoji: '⚡',
    description: 'Legendary. Untouchable. GODSPEED.',
    minPoints: 995,
  },
};

// Tier thresholds by event (in milliseconds for time, centimeters for distance/height)
// Male thresholds
export const TIER_THRESHOLDS_MALE: Record<string, Record<Tier, number>> = {
  '100m': {
    GODSPEED: 10200,    // < 10.20
    WORLD_CLASS: 10500, // < 10.50
    NATIONAL: 10800,    // < 10.80
    ALL_STATE: 11200,   // < 11.20
    ELITE: 11500,       // < 11.50
    VARSITY: 12000,     // < 12.00
    JV: 12500,          // < 12.50
    ROOKIE: 999999,     // Everyone else
  },
  '200m': {
    GODSPEED: 20500,
    WORLD_CLASS: 21200,
    NATIONAL: 22000,
    ALL_STATE: 22800,
    ELITE: 23500,
    VARSITY: 24500,
    JV: 25500,
    ROOKIE: 999999,
  },
  '400m': {
    GODSPEED: 46000,
    WORLD_CLASS: 47500,
    NATIONAL: 49000,
    ALL_STATE: 51000,
    ELITE: 53000,
    VARSITY: 55000,
    JV: 58000,
    ROOKIE: 999999,
  },
  '800m': {
    GODSPEED: 108000,   // 1:48
    WORLD_CLASS: 112000, // 1:52
    NATIONAL: 118000,    // 1:58
    ALL_STATE: 125000,   // 2:05
    ELITE: 132000,       // 2:12
    VARSITY: 140000,     // 2:20
    JV: 150000,          // 2:30
    ROOKIE: 999999,
  },
  '1600m': {
    GODSPEED: 245000,   // 4:05
    WORLD_CLASS: 255000, // 4:15
    NATIONAL: 268000,    // 4:28
    ALL_STATE: 285000,   // 4:45
    ELITE: 305000,       // 5:05
    VARSITY: 330000,     // 5:30
    JV: 360000,          // 6:00
    ROOKIE: 999999,
  },
  '3200m': {
    GODSPEED: 540000,   // 9:00
    WORLD_CLASS: 570000, // 9:30
    NATIONAL: 600000,    // 10:00
    ALL_STATE: 640000,   // 10:40
    ELITE: 690000,       // 11:30
    VARSITY: 750000,     // 12:30
    JV: 840000,          // 14:00
    ROOKIE: 999999,
  },
  '110H': {
    GODSPEED: 13500,
    WORLD_CLASS: 14000,
    NATIONAL: 14500,
    ALL_STATE: 15200,
    ELITE: 16000,
    VARSITY: 17000,
    JV: 18500,
    ROOKIE: 999999,
  },
  '300H': {
    GODSPEED: 37000,
    WORLD_CLASS: 38500,
    NATIONAL: 40000,
    ALL_STATE: 42000,
    ELITE: 44000,
    VARSITY: 47000,
    JV: 51000,
    ROOKIE: 999999,
  },
  // Field events (in centimeters - higher is better)
  'HJ': {
    GODSPEED: 220,      // 7'2.5"
    WORLD_CLASS: 210,   // 6'10.5"
    NATIONAL: 200,      // 6'6.75"
    ALL_STATE: 190,     // 6'2.75"
    ELITE: 180,         // 5'10.75"
    VARSITY: 170,       // 5'7"
    JV: 160,            // 5'3"
    ROOKIE: 0,
  },
  'LJ': {
    GODSPEED: 760,      // 24'11"
    WORLD_CLASS: 720,   // 23'7"
    NATIONAL: 680,      // 22'4"
    ALL_STATE: 640,     // 21'0"
    ELITE: 600,         // 19'8"
    VARSITY: 560,       // 18'4"
    JV: 500,            // 16'5"
    ROOKIE: 0,
  },
  'TJ': {
    GODSPEED: 1550,     // 50'10"
    WORLD_CLASS: 1480,  // 48'7"
    NATIONAL: 1400,     // 45'11"
    ALL_STATE: 1320,    // 43'4"
    ELITE: 1240,        // 40'8"
    VARSITY: 1160,      // 38'1"
    JV: 1050,           // 34'5"
    ROOKIE: 0,
  },
  'PV': {
    GODSPEED: 520,      // 17'0.5"
    WORLD_CLASS: 490,   // 16'0.75"
    NATIONAL: 460,      // 15'1"
    ALL_STATE: 430,     // 14'1"
    ELITE: 400,         // 13'1.5"
    VARSITY: 360,       // 11'9.75"
    JV: 300,            // 9'10"
    ROOKIE: 0,
  },
  'SP': {
    GODSPEED: 1900,     // 62'4"
    WORLD_CLASS: 1750,  // 57'5"
    NATIONAL: 1600,     // 52'6"
    ALL_STATE: 1450,    // 47'7"
    ELITE: 1300,        // 42'8"
    VARSITY: 1150,      // 37'9"
    JV: 1000,           // 32'10"
    ROOKIE: 0,
  },
  'DT': {
    GODSPEED: 6000,     // 196'10"
    WORLD_CLASS: 5500,  // 180'5"
    NATIONAL: 5000,     // 164'0"
    ALL_STATE: 4500,    // 147'8"
    ELITE: 4000,        // 131'3"
    VARSITY: 3500,      // 114'10"
    JV: 3000,           // 98'5"
    ROOKIE: 0,
  },
};

// Calculate tier based on performance
export function calculateTier(
  eventShortName: string, 
  performance: number, 
  isFieldEvent: boolean = false
): Tier {
  const thresholds = TIER_THRESHOLDS_MALE[eventShortName];
  if (!thresholds) return 'ROOKIE';

  const tiers: Tier[] = ['GODSPEED', 'WORLD_CLASS', 'NATIONAL', 'ALL_STATE', 'ELITE', 'VARSITY', 'JV', 'ROOKIE'];

  for (const tier of tiers) {
    const threshold = thresholds[tier];
    if (isFieldEvent) {
      // For field events, higher is better
      if (performance >= threshold) return tier;
    } else {
      // For running events, lower is better
      if (performance <= threshold) return tier;
    }
  }

  return 'ROOKIE';
}

// Calculate rank points based on performance
export function calculateRankPoints(
  eventShortName: string,
  performance: number,
  isFieldEvent: boolean = false
): number {
  const thresholds = TIER_THRESHOLDS_MALE[eventShortName];
  if (!thresholds) return 0;

  // Base points from tier
  const tier = calculateTier(eventShortName, performance, isFieldEvent);
  const tierInfo = TIERS[tier];
  let points = tierInfo.minPoints;

  // Add bonus points based on how far into the tier they are
  const tierOrder: Tier[] = ['ROOKIE', 'JV', 'VARSITY', 'ELITE', 'ALL_STATE', 'NATIONAL', 'WORLD_CLASS', 'GODSPEED'];
  const tierIndex = tierOrder.indexOf(tier);
  
  if (tierIndex < tierOrder.length - 1) {
    const currentThreshold = thresholds[tier];
    const nextTier = tierOrder[tierIndex + 1];
    const nextThreshold = thresholds[nextTier];
    
    let progress: number;
    if (isFieldEvent) {
      progress = (performance - currentThreshold) / (nextThreshold - currentThreshold);
    } else {
      progress = (currentThreshold - performance) / (currentThreshold - nextThreshold);
    }
    
    progress = Math.max(0, Math.min(1, progress));
    const nextTierInfo = TIERS[nextTier];
    const tierPointRange = nextTierInfo.minPoints - tierInfo.minPoints;
    points += Math.floor(progress * tierPointRange * 0.9); // 90% of the way to next tier max
  }

  return Math.min(1000, points); // Cap at 1000
}

// Format time from milliseconds to display string
export function formatTime(ms: number): string {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`;
  }
  return seconds.toFixed(2);
}

// Format distance from centimeters to feet and inches
export function formatDistance(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}' ${inches.toFixed(2)}"`;
}

// Get tier badge component props
export function getTierBadgeProps(tier: Tier) {
  const info = TIERS[tier];
  return {
    className: `${info.bgColor} ${info.borderColor} ${info.color} ${info.glowColor}`,
    emoji: info.emoji,
    displayName: info.displayName,
    description: info.description,
  };
}

// Calculate ranking change
export function calculateRankChange(currentRank: number, previousRank: number | null): {
  change: number;
  direction: 'up' | 'down' | 'same' | 'new';
  display: string;
} {
  if (previousRank === null) {
    return { change: 0, direction: 'new', display: 'NEW' };
  }
  
  const change = previousRank - currentRank;
  
  if (change > 0) {
    return { change, direction: 'up', display: `+${change}` };
  } else if (change < 0) {
    return { change: Math.abs(change), direction: 'down', display: `${change}` };
  }
  
  return { change: 0, direction: 'same', display: '-' };
}

// Leaderboard entry type
export interface LeaderboardEntry {
  rank: number;
  athleteId: string;
  athleteName: string;
  school: string;
  performance: number;
  formattedPerformance: string;
  tier: Tier;
  points: number;
  previousRank: number | null;
  rankChange: ReturnType<typeof calculateRankChange>;
}

// Sort and rank athletes for leaderboard
export function createLeaderboard(
  athletes: Array<{
    id: string;
    name: string;
    school: string;
    performance: number;
    previousRank?: number | null;
  }>,
  eventShortName: string,
  isFieldEvent: boolean = false
): LeaderboardEntry[] {
  // Sort by performance (lower is better for time, higher for field)
  const sorted = [...athletes].sort((a, b) => {
    if (isFieldEvent) {
      return b.performance - a.performance;
    }
    return a.performance - b.performance;
  });

  return sorted.map((athlete, index) => {
    const tier = calculateTier(eventShortName, athlete.performance, isFieldEvent);
    const points = calculateRankPoints(eventShortName, athlete.performance, isFieldEvent);
    const formattedPerformance = isFieldEvent 
      ? formatDistance(athlete.performance)
      : formatTime(athlete.performance);

    return {
      rank: index + 1,
      athleteId: athlete.id,
      athleteName: athlete.name,
      school: athlete.school,
      performance: athlete.performance,
      formattedPerformance,
      tier,
      points,
      previousRank: athlete.previousRank ?? null,
      rankChange: calculateRankChange(index + 1, athlete.previousRank ?? null),
    };
  });
}
