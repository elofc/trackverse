import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trophy, ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react-native";

type Athlete = {
  id: string;
  rank: number;
  name: string;
  school: string;
  time: string;
  tier: string;
  change: "up" | "down" | "same";
  changeAmount?: number;
};

const events = ["100m", "200m", "400m", "800m", "1600m", "110H", "Long Jump", "High Jump"];

const mockRankings: Record<string, Athlete[]> = {
  "100m": [
    { id: "1", rank: 1, name: "Elias Bolt", school: "Lincoln HS", time: "10.15", tier: "GODSPEED", change: "same" },
    { id: "2", rank: 2, name: "Marcus Johnson", school: "Roosevelt HS", time: "10.28", tier: "WORLD_CLASS", change: "up", changeAmount: 2 },
    { id: "3", rank: 3, name: "Tyler Smith", school: "Jefferson HS", time: "10.35", tier: "WORLD_CLASS", change: "down", changeAmount: 1 },
    { id: "4", rank: 4, name: "Derek Thompson", school: "Washington HS", time: "10.42", tier: "ELITE", change: "up", changeAmount: 3 },
    { id: "5", rank: 5, name: "Alex Kim", school: "Central HS", time: "10.48", tier: "ELITE", change: "same" },
    { id: "6", rank: 6, name: "Jordan White", school: "Eastside HS", time: "10.52", tier: "ALL_STATE", change: "down", changeAmount: 2 },
    { id: "7", rank: 7, name: "Chris Brown", school: "Westview HS", time: "10.58", tier: "ALL_STATE", change: "up", changeAmount: 1 },
    { id: "8", rank: 8, name: "Ryan Davis", school: "Northside HS", time: "10.62", tier: "NATIONAL", change: "same" },
  ],
  "200m": [
    { id: "1", rank: 1, name: "Tyler Smith", school: "Jefferson HS", time: "20.45", tier: "GODSPEED", change: "same" },
    { id: "2", rank: 2, name: "Elias Bolt", school: "Lincoln HS", time: "20.68", tier: "WORLD_CLASS", change: "up", changeAmount: 1 },
    { id: "3", rank: 3, name: "Marcus Johnson", school: "Roosevelt HS", time: "20.82", tier: "WORLD_CLASS", change: "down", changeAmount: 1 },
  ],
};

const getTierColor = (tier: string) => {
  switch (tier) {
    case "GODSPEED": return "#f97316";
    case "WORLD_CLASS": return "#eab308";
    case "ELITE": return "#a855f7";
    case "ALL_STATE": return "#3b82f6";
    case "NATIONAL": return "#22c55e";
    default: return "#71717a";
  }
};

export default function RankingsScreen() {
  const [selectedEvent, setSelectedEvent] = useState("100m");
  const [showEventPicker, setShowEventPicker] = useState(false);

  const rankings = mockRankings[selectedEvent] || mockRankings["100m"];

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="px-4 py-3 border-b border-zinc-800">
        <View className="flex-row items-center gap-2">
          <Trophy color="#f97316" size={28} />
          <Text className="text-2xl font-black text-white">Rankings</Text>
        </View>
      </View>

      {/* Event Picker */}
      <View className="px-4 py-3">
        <Pressable 
          className="flex-row items-center justify-between bg-zinc-900 rounded-xl px-4 py-3 border border-zinc-800"
          onPress={() => setShowEventPicker(!showEventPicker)}
        >
          <Text className="text-white font-bold text-lg">{selectedEvent}</Text>
          <ChevronDown color="#71717a" size={24} />
        </Pressable>

        {showEventPicker && (
          <View className="bg-zinc-900 rounded-xl mt-2 border border-zinc-800 overflow-hidden">
            {events.map((event) => (
              <Pressable
                key={event}
                className={`px-4 py-3 border-b border-zinc-800 ${event === selectedEvent ? 'bg-orange-500/20' : ''}`}
                onPress={() => {
                  setSelectedEvent(event);
                  setShowEventPicker(false);
                }}
              >
                <Text className={`font-bold ${event === selectedEvent ? 'text-orange-500' : 'text-white'}`}>
                  {event}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Rankings List */}
      <ScrollView className="flex-1 px-4">
        {rankings.map((athlete, index) => (
          <View 
            key={athlete.id} 
            className={`flex-row items-center p-4 rounded-xl mb-2 border ${
              index === 0 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            {/* Rank */}
            <View className="w-12 items-center">
              <Text className={`text-2xl font-black ${index === 0 ? 'text-orange-500' : 'text-white'}`}>
                #{athlete.rank}
              </Text>
              <View className="flex-row items-center mt-1">
                {athlete.change === "up" && (
                  <>
                    <TrendingUp color="#22c55e" size={12} />
                    <Text className="text-green-500 text-xs ml-0.5">{athlete.changeAmount}</Text>
                  </>
                )}
                {athlete.change === "down" && (
                  <>
                    <TrendingDown color="#ef4444" size={12} />
                    <Text className="text-red-500 text-xs ml-0.5">{athlete.changeAmount}</Text>
                  </>
                )}
                {athlete.change === "same" && <Minus color="#71717a" size={12} />}
              </View>
            </View>

            {/* Athlete Info */}
            <View className="flex-1 ml-3">
              <View className="flex-row items-center gap-2">
                <Text className="font-bold text-white">{athlete.name}</Text>
                <View 
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: getTierColor(athlete.tier) + "30" }}
                >
                  <Text 
                    className="text-xs font-bold"
                    style={{ color: getTierColor(athlete.tier) }}
                  >
                    {athlete.tier}
                  </Text>
                </View>
              </View>
              <Text className="text-zinc-500 text-sm">{athlete.school}</Text>
            </View>

            {/* Time */}
            <View className="items-end">
              <Text className="text-white text-xl font-black font-mono">{athlete.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
