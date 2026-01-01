import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Track & Field Events
const events = [
  // Sprints
  { name: "100 Meters", shortName: "100m", category: "SPRINT", distanceMeters: 100, unit: "TIME", sortOrder: 1 },
  { name: "200 Meters", shortName: "200m", category: "SPRINT", distanceMeters: 200, unit: "TIME", sortOrder: 2 },
  { name: "400 Meters", shortName: "400m", category: "SPRINT", distanceMeters: 400, unit: "TIME", sortOrder: 3 },
  
  // Distance
  { name: "800 Meters", shortName: "800m", category: "DISTANCE", distanceMeters: 800, unit: "TIME", sortOrder: 4 },
  { name: "1600 Meters", shortName: "1600m", category: "DISTANCE", distanceMeters: 1600, unit: "TIME", sortOrder: 5 },
  { name: "3200 Meters", shortName: "3200m", category: "DISTANCE", distanceMeters: 3200, unit: "TIME", sortOrder: 6 },
  { name: "5000 Meters", shortName: "5K", category: "DISTANCE", distanceMeters: 5000, unit: "TIME", sortOrder: 7 },
  
  // Hurdles
  { name: "110m Hurdles", shortName: "110H", category: "HURDLES", distanceMeters: 110, unit: "TIME", sortOrder: 8 },
  { name: "100m Hurdles", shortName: "100H", category: "HURDLES", distanceMeters: 100, unit: "TIME", sortOrder: 9 },
  { name: "300m Hurdles", shortName: "300H", category: "HURDLES", distanceMeters: 300, unit: "TIME", sortOrder: 10 },
  { name: "400m Hurdles", shortName: "400H", category: "HURDLES", distanceMeters: 400, unit: "TIME", sortOrder: 11 },
  
  // Jumps
  { name: "High Jump", shortName: "HJ", category: "JUMPS", isFieldEvent: true, unit: "HEIGHT", sortOrder: 12 },
  { name: "Long Jump", shortName: "LJ", category: "JUMPS", isFieldEvent: true, unit: "DISTANCE", sortOrder: 13 },
  { name: "Triple Jump", shortName: "TJ", category: "JUMPS", isFieldEvent: true, unit: "DISTANCE", sortOrder: 14 },
  { name: "Pole Vault", shortName: "PV", category: "JUMPS", isFieldEvent: true, unit: "HEIGHT", sortOrder: 15 },
  
  // Throws
  { name: "Shot Put", shortName: "SP", category: "THROWS", isFieldEvent: true, unit: "DISTANCE", sortOrder: 16 },
  { name: "Discus", shortName: "DT", category: "THROWS", isFieldEvent: true, unit: "DISTANCE", sortOrder: 17 },
  { name: "Javelin", shortName: "JT", category: "THROWS", isFieldEvent: true, unit: "DISTANCE", sortOrder: 18 },
  { name: "Hammer Throw", shortName: "HT", category: "THROWS", isFieldEvent: true, unit: "DISTANCE", sortOrder: 19 },
  
  // Relays
  { name: "4x100m Relay", shortName: "4x1", category: "RELAY", distanceMeters: 400, isRelay: true, unit: "TIME", sortOrder: 20 },
  { name: "4x200m Relay", shortName: "4x2", category: "RELAY", distanceMeters: 800, isRelay: true, unit: "TIME", sortOrder: 21 },
  { name: "4x400m Relay", shortName: "4x4", category: "RELAY", distanceMeters: 1600, isRelay: true, unit: "TIME", sortOrder: 22 },
  { name: "4x800m Relay", shortName: "4x8", category: "RELAY", distanceMeters: 3200, isRelay: true, unit: "TIME", sortOrder: 23 },
];

// Tier thresholds for 100m (in milliseconds) - Male
const tierThresholds100mMale = [
  { tier: "WORLD_CLASS", minTimeMs: 0, maxTimeMs: 10500 },      // < 10.50
  { tier: "NATIONAL", minTimeMs: 10500, maxTimeMs: 10800 },     // 10.50 - 10.80
  { tier: "ALL_STATE", minTimeMs: 10800, maxTimeMs: 11200 },    // 10.80 - 11.20
  { tier: "ELITE", minTimeMs: 11200, maxTimeMs: 11500 },        // 11.20 - 11.50
  { tier: "VARSITY", minTimeMs: 11500, maxTimeMs: 12000 },      // 11.50 - 12.00
  { tier: "ROOKIE", minTimeMs: 12000, maxTimeMs: 999999 },      // > 12.00
];

// Sample schools (top track programs)
const schools = [
  { name: "Lincoln High School", city: "Portland", state: "OR", primaryColor: "#FF6B35", secondaryColor: "#000000" },
  { name: "Roosevelt High School", city: "Seattle", state: "WA", primaryColor: "#1E3A8A", secondaryColor: "#FBBF24" },
  { name: "Jefferson High School", city: "Los Angeles", state: "CA", primaryColor: "#DC2626", secondaryColor: "#FFFFFF" },
  { name: "Washington High School", city: "San Francisco", state: "CA", primaryColor: "#7C3AED", secondaryColor: "#F59E0B" },
  { name: "Adams High School", city: "Denver", state: "CO", primaryColor: "#059669", secondaryColor: "#FFFFFF" },
  { name: "Madison High School", city: "Phoenix", state: "AZ", primaryColor: "#B91C1C", secondaryColor: "#000000" },
  { name: "Jackson High School", city: "Houston", state: "TX", primaryColor: "#1D4ED8", secondaryColor: "#EF4444" },
  { name: "Monroe High School", city: "Dallas", state: "TX", primaryColor: "#F59E0B", secondaryColor: "#1F2937" },
  { name: "Kennedy High School", city: "Chicago", state: "IL", primaryColor: "#7C3AED", secondaryColor: "#FFFFFF" },
  { name: "Reagan High School", city: "Austin", state: "TX", primaryColor: "#DC2626", secondaryColor: "#1F2937" },
  { name: "Central High School", city: "Philadelphia", state: "PA", primaryColor: "#1E40AF", secondaryColor: "#FBBF24" },
  { name: "Westview High School", city: "San Diego", state: "CA", primaryColor: "#059669", secondaryColor: "#1F2937" },
  { name: "Eastside High School", city: "Miami", state: "FL", primaryColor: "#F97316", secondaryColor: "#1E3A8A" },
  { name: "Northside High School", city: "Atlanta", state: "GA", primaryColor: "#DC2626", secondaryColor: "#000000" },
  { name: "Southside High School", city: "New Orleans", state: "LA", primaryColor: "#7C3AED", secondaryColor: "#F59E0B" },
  { name: "Oak Park High School", city: "Detroit", state: "MI", primaryColor: "#1D4ED8", secondaryColor: "#FFFFFF" },
  { name: "Riverside High School", city: "Charlotte", state: "NC", primaryColor: "#059669", secondaryColor: "#F59E0B" },
  { name: "Lakewood High School", city: "Cleveland", state: "OH", primaryColor: "#B91C1C", secondaryColor: "#1F2937" },
  { name: "Hillcrest High School", city: "Nashville", state: "TN", primaryColor: "#F59E0B", secondaryColor: "#1E3A8A" },
  { name: "Valley High School", city: "Las Vegas", state: "NV", primaryColor: "#DC2626", secondaryColor: "#000000" },
];

// Achievements
const achievements = [
  { name: "First PR", description: "Log your first personal record", icon: "🏆", category: "MILESTONE", points: 10, rarity: "COMMON", criteria: { type: "pr_count", value: 1 } },
  { name: "PR Machine", description: "Log 10 personal records", icon: "⚡", category: "MILESTONE", points: 50, rarity: "RARE", criteria: { type: "pr_count", value: 10 } },
  { name: "Streak Starter", description: "Maintain a 7-day training streak", icon: "🔥", category: "TRAINING", points: 25, rarity: "COMMON", criteria: { type: "streak", value: 7 } },
  { name: "Dedicated", description: "Maintain a 30-day training streak", icon: "💪", category: "TRAINING", points: 100, rarity: "RARE", criteria: { type: "streak", value: 30 } },
  { name: "Century Club", description: "Log 100 workouts", icon: "💯", category: "TRAINING", points: 200, rarity: "EPIC", criteria: { type: "workout_count", value: 100 } },
  { name: "Social Butterfly", description: "Get 50 followers", icon: "🦋", category: "SOCIAL", points: 50, rarity: "RARE", criteria: { type: "follower_count", value: 50 } },
  { name: "Influencer", description: "Get 500 followers", icon: "⭐", category: "SOCIAL", points: 200, rarity: "EPIC", criteria: { type: "follower_count", value: 500 } },
  { name: "Meet Warrior", description: "Compete in 10 meets", icon: "🏁", category: "COMPETITION", points: 75, rarity: "RARE", criteria: { type: "meet_count", value: 10 } },
  { name: "Varsity Level", description: "Reach Varsity tier in any event", icon: "🎽", category: "COMPETITION", points: 50, rarity: "COMMON", criteria: { type: "tier", value: "VARSITY" } },
  { name: "Elite Status", description: "Reach Elite tier in any event", icon: "🥇", category: "COMPETITION", points: 150, rarity: "RARE", criteria: { type: "tier", value: "ELITE" } },
  { name: "All-State", description: "Reach All-State tier in any event", icon: "🌟", category: "COMPETITION", points: 300, rarity: "EPIC", criteria: { type: "tier", value: "ALL_STATE" } },
  { name: "National Caliber", description: "Reach National tier in any event", icon: "🇺🇸", category: "COMPETITION", points: 500, rarity: "LEGENDARY", criteria: { type: "tier", value: "NATIONAL" } },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Seed Events
  console.log('📋 Seeding events...');
  for (const event of events) {
    await prisma.event.upsert({
      where: { shortName: event.shortName },
      update: event,
      create: event as any,
    });
  }
  console.log(`✅ Seeded ${events.length} events`);

  // Seed Schools
  console.log('🏫 Seeding schools...');
  for (const school of schools) {
    await prisma.school.upsert({
      where: { id: school.name.toLowerCase().replace(/\s+/g, '-') },
      update: school,
      create: {
        id: school.name.toLowerCase().replace(/\s+/g, '-'),
        ...school,
      },
    });
  }
  console.log(`✅ Seeded ${schools.length} schools`);

  // Seed Achievements
  console.log('🏆 Seeding achievements...');
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category as any,
        points: achievement.points,
        rarity: achievement.rarity as any,
        criteria: achievement.criteria,
      },
      create: {
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category as any,
        points: achievement.points,
        rarity: achievement.rarity as any,
        criteria: achievement.criteria,
      },
    });
  }
  console.log(`✅ Seeded ${achievements.length} achievements`);

  // Seed Tier Thresholds for 100m
  console.log('📊 Seeding tier thresholds...');
  const event100m = await prisma.event.findFirst({ where: { shortName: '100m' } });
  if (event100m) {
    for (const threshold of tierThresholds100mMale) {
      await prisma.tierThreshold.create({
        data: {
          eventId: event100m.id,
          gender: 'MALE',
          tier: threshold.tier as any,
          minTimeMs: threshold.minTimeMs,
          maxTimeMs: threshold.maxTimeMs,
        },
      });
    }
  }
  console.log('✅ Seeded tier thresholds');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
