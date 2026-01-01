import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Settings, Trophy, Flame, TrendingUp, Medal, ChevronRight, Edit2, Share2 } from "lucide-react-native";

const mockProfile = {
  name: "Elias Bolt",
  username: "flashelias",
  school: "Lincoln High School",
  gradYear: 2025,
  tier: "GODSPEED",
  events: ["100m", "200m"],
  stats: {
    prs: 5,
    streak: 14,
    workouts: 156,
    meets: 12,
  },
  personalRecords: [
    { event: "100m", time: "10.15", tier: "GODSPEED", rank: "#1 State" },
    { event: "200m", time: "20.68", tier: "WORLD_CLASS", rank: "#2 State" },
  ],
  recentAchievements: [
    { id: "a1", title: "New PR in 100m", description: "10.15 - GODSPEED tier!", date: "2 days ago" },
    { id: "a2", title: "14 Day Streak", description: "Consistent training pays off", date: "Today" },
    { id: "a3", title: "State Champion", description: "1st place in 100m", date: "1 week ago" },
  ],
};

const getTierColor = (tier: string) => {
  switch (tier) {
    case "GODSPEED": return "#f97316";
    case "WORLD_CLASS": return "#eab308";
    case "ELITE": return "#a855f7";
    case "ALL_STATE": return "#3b82f6";
    default: return "#71717a";
  }
};

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="px-4 py-3 border-b border-zinc-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <User color="#f97316" size={28} />
            <Text className="text-2xl font-black text-white">Profile</Text>
          </View>
          <View className="flex-row gap-2">
            <Pressable className="bg-zinc-900 rounded-full p-2">
              <Share2 color="#71717a" size={20} />
            </Pressable>
            <Pressable className="bg-zinc-900 rounded-full p-2">
              <Settings color="#71717a" size={20} />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="px-4 py-6">
          <View className="flex-row items-center gap-4">
            <View 
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{ backgroundColor: getTierColor(mockProfile.tier) + "30" }}
            >
              <Text className="text-3xl font-black text-white">
                {mockProfile.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-xl font-black text-white">{mockProfile.name}</Text>
                <View 
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: getTierColor(mockProfile.tier) + "30" }}
                >
                  <Text 
                    className="text-xs font-bold"
                    style={{ color: getTierColor(mockProfile.tier) }}
                  >
                    {mockProfile.tier}
                  </Text>
                </View>
              </View>
              <Text className="text-zinc-500">@{mockProfile.username}</Text>
              <Text className="text-zinc-400 text-sm">{mockProfile.school} • Class of {mockProfile.gradYear}</Text>
            </View>
          </View>

          <Pressable className="mt-4 flex-row items-center justify-center py-3 rounded-xl bg-orange-500">
            <Edit2 color="#fff" size={18} />
            <Text className="text-white font-bold ml-2">Edit Profile</Text>
          </Pressable>
        </View>

        {/* Stats Grid */}
        <View className="px-4 mb-6">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-zinc-900 rounded-xl p-4 border border-zinc-800 items-center">
              <Trophy color="#f97316" size={24} />
              <Text className="text-2xl font-black text-white mt-1">{mockProfile.stats.prs}</Text>
              <Text className="text-zinc-500 text-xs">PRs This Season</Text>
            </View>
            <View className="flex-1 bg-zinc-900 rounded-xl p-4 border border-zinc-800 items-center">
              <Flame color="#ef4444" size={24} />
              <Text className="text-2xl font-black text-white mt-1">{mockProfile.stats.streak}</Text>
              <Text className="text-zinc-500 text-xs">Day Streak</Text>
            </View>
            <View className="flex-1 bg-zinc-900 rounded-xl p-4 border border-zinc-800 items-center">
              <TrendingUp color="#22c55e" size={24} />
              <Text className="text-2xl font-black text-white mt-1">{mockProfile.stats.workouts}</Text>
              <Text className="text-zinc-500 text-xs">Workouts</Text>
            </View>
          </View>
        </View>

        {/* Personal Records */}
        <View className="px-4 mb-6">
          <Text className="text-white font-bold text-lg mb-3">Personal Records</Text>
          {mockProfile.personalRecords.map((pr) => (
            <View 
              key={pr.event}
              className="flex-row items-center p-4 rounded-xl mb-2 bg-zinc-900 border border-zinc-800"
            >
              <View className="flex-1">
                <Text className="text-zinc-400 text-sm">{pr.event}</Text>
                <Text className="text-white text-2xl font-black font-mono">{pr.time}</Text>
              </View>
              <View className="items-end">
                <View 
                  className="px-2 py-0.5 rounded-full mb-1"
                  style={{ backgroundColor: getTierColor(pr.tier) + "30" }}
                >
                  <Text 
                    className="text-xs font-bold"
                    style={{ color: getTierColor(pr.tier) }}
                  >
                    {pr.tier}
                  </Text>
                </View>
                <Text className="text-zinc-500 text-sm">{pr.rank}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Achievements */}
        <View className="px-4 mb-6">
          <Text className="text-white font-bold text-lg mb-3">Recent Achievements</Text>
          {mockProfile.recentAchievements.map((achievement) => (
            <View 
              key={achievement.id}
              className="flex-row items-center p-4 rounded-xl mb-2 bg-zinc-900 border border-zinc-800"
            >
              <View className="w-10 h-10 rounded-full bg-orange-500/20 items-center justify-center mr-3">
                <Medal color="#f97316" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold">{achievement.title}</Text>
                <Text className="text-zinc-500 text-sm">{achievement.description}</Text>
              </View>
              <Text className="text-zinc-600 text-xs">{achievement.date}</Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View className="px-4 mb-8">
          {["Recruiting Profile", "Training History", "Meet Results", "Settings"].map((item) => (
            <Pressable 
              key={item}
              className="flex-row items-center justify-between p-4 rounded-xl mb-2 bg-zinc-900 border border-zinc-800"
            >
              <Text className="text-white font-bold">{item}</Text>
              <ChevronRight color="#71717a" size={20} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
