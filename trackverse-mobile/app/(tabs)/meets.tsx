import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, MapPin, Users, Clock, ChevronRight, Trophy } from "lucide-react-native";

type Meet = {
  id: string;
  name: string;
  date: string;
  location: string;
  type: "championship" | "invitational" | "dual" | "league";
  athleteCount: number;
  myEvents?: string[];
  status: "upcoming" | "today" | "completed";
};

const mockMeets: Meet[] = [
  {
    id: "m1",
    name: "Regional Championships",
    date: "Jan 15, 2026",
    location: "Memorial Stadium",
    type: "championship",
    athleteCount: 24,
    myEvents: ["100m", "200m", "4x100m"],
    status: "upcoming",
  },
  {
    id: "m2",
    name: "Winter Invitational",
    date: "Jan 22, 2026",
    location: "Central Field",
    type: "invitational",
    athleteCount: 18,
    myEvents: ["100m"],
    status: "upcoming",
  },
  {
    id: "m3",
    name: "State Qualifiers",
    date: "Feb 5, 2026",
    location: "State University Track",
    type: "championship",
    athleteCount: 12,
    myEvents: ["100m", "200m"],
    status: "upcoming",
  },
  {
    id: "m4",
    name: "Dual Meet vs Roosevelt",
    date: "Dec 28, 2025",
    location: "Lincoln HS Track",
    type: "dual",
    athleteCount: 32,
    status: "completed",
  },
];

const getTypeStyle = (type: string) => {
  switch (type) {
    case "championship": return { bg: "#a855f7", label: "Championship" };
    case "invitational": return { bg: "#3b82f6", label: "Invitational" };
    case "dual": return { bg: "#22c55e", label: "Dual Meet" };
    case "league": return { bg: "#f97316", label: "League" };
    default: return { bg: "#71717a", label: "Meet" };
  }
};

export default function MeetsScreen() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("upcoming");

  const filteredMeets = mockMeets.filter(meet => {
    if (filter === "all") return true;
    return meet.status === filter;
  });

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="px-4 py-3 border-b border-zinc-800">
        <View className="flex-row items-center gap-2">
          <Calendar color="#f97316" size={28} />
          <Text className="text-2xl font-black text-white">Meets</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row px-4 py-3 gap-2">
        {(["upcoming", "completed", "all"] as const).map((tab) => (
          <Pressable
            key={tab}
            className={`px-4 py-2 rounded-full ${filter === tab ? 'bg-orange-500' : 'bg-zinc-900'}`}
            onPress={() => setFilter(tab)}
          >
            <Text className={`font-bold capitalize ${filter === tab ? 'text-white' : 'text-zinc-400'}`}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Meets List */}
      <ScrollView className="flex-1 px-4">
        {filteredMeets.map((meet) => {
          const typeStyle = getTypeStyle(meet.type);
          return (
            <Pressable
              key={meet.id}
              className={`p-4 rounded-xl mb-3 border ${
                meet.status === "completed" ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              {/* Type Badge */}
              <View className="flex-row items-center justify-between mb-2">
                <View 
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: typeStyle.bg + "30" }}
                >
                  <Text style={{ color: typeStyle.bg }} className="text-xs font-bold">
                    {typeStyle.label}
                  </Text>
                </View>
                {meet.status === "completed" && (
                  <View className="flex-row items-center gap-1">
                    <Trophy color="#22c55e" size={14} />
                    <Text className="text-green-500 text-xs font-bold">Completed</Text>
                  </View>
                )}
              </View>

              {/* Meet Info */}
              <Text className="text-white font-bold text-lg mb-2">{meet.name}</Text>
              
              <View className="flex-row items-center gap-4 mb-3">
                <View className="flex-row items-center gap-1">
                  <Clock color="#71717a" size={14} />
                  <Text className="text-zinc-500 text-sm">{meet.date}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <MapPin color="#71717a" size={14} />
                  <Text className="text-zinc-500 text-sm">{meet.location}</Text>
                </View>
              </View>

              {/* My Events */}
              {meet.myEvents && meet.myEvents.length > 0 && (
                <View className="flex-row items-center gap-2 mb-3">
                  <Text className="text-zinc-500 text-sm">My Events:</Text>
                  {meet.myEvents.map((event) => (
                    <View key={event} className="bg-orange-500/20 px-2 py-1 rounded">
                      <Text className="text-orange-500 text-xs font-bold">{event}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Footer */}
              <View className="flex-row items-center justify-between pt-2 border-t border-zinc-800">
                <View className="flex-row items-center gap-1">
                  <Users color="#71717a" size={14} />
                  <Text className="text-zinc-500 text-sm">{meet.athleteCount} athletes</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-orange-500 font-bold text-sm">View Details</Text>
                  <ChevronRight color="#f97316" size={16} />
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
