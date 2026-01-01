import { View, Text, ScrollView, RefreshControl, Pressable, Image } from "react-native";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, MessageCircle, Share2, Bookmark, Flame } from "lucide-react-native";

type Post = {
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

const mockPosts: Post[] = [
  {
    id: "p1",
    author: {
      name: "Elias Bolt",
      username: "flashelias",
      school: "Lincoln HS",
      tier: "GODSPEED",
    },
    type: "pr",
    content: "NEW PR ALERT! 🔥 Finally broke 10.2 in the 100m! All the hard work is paying off.",
    performance: {
      event: "100m",
      time: "10.15",
      improvement: "-0.17s",
    },
    likes: 234,
    comments: 45,
    createdAt: "2h ago",
  },
  {
    id: "p2",
    author: {
      name: "Maya Rodriguez",
      username: "mayasprints",
      school: "Roosevelt HS",
      tier: "ELITE",
    },
    type: "workout",
    content: "6x200m repeats done! 💪 Coach had us working hard today. Ready for regionals!",
    likes: 89,
    comments: 12,
    createdAt: "4h ago",
  },
  {
    id: "p3",
    author: {
      name: "Marcus Johnson",
      username: "mjohnson400",
      school: "Jefferson HS",
      tier: "WORLD_CLASS",
    },
    type: "meet",
    content: "State Championships here we come! 🏆 Qualified in both 200m and 400m. Let's go!",
    performance: {
      event: "400m",
      time: "46.82",
    },
    likes: 312,
    comments: 67,
    createdAt: "6h ago",
  },
];

const getTierColor = (tier: string) => {
  switch (tier) {
    case "GODSPEED": return "#f97316";
    case "WORLD_CLASS": return "#eab308";
    case "ELITE": return "#a855f7";
    case "ALL_STATE": return "#3b82f6";
    default: return "#71717a";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "pr": return "🔥";
    case "workout": return "💪";
    case "meet": return "🏆";
    default: return "📝";
  }
};

export default function FeedScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="px-4 py-3 border-b border-zinc-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Flame color="#f97316" size={28} />
            <Text className="text-2xl font-black text-white">TrackVerse</Text>
          </View>
        </View>
      </View>

      {/* Feed */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#f97316"
          />
        }
      >
        {mockPosts.map((post) => (
          <View key={post.id} className="border-b border-zinc-800 p-4">
            {/* Author Header */}
            <View className="flex-row items-center gap-3 mb-3">
              <View 
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: getTierColor(post.author.tier) + "30" }}
              >
                <Text className="text-lg font-black text-white">
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="font-bold text-white">{post.author.name}</Text>
                  <View 
                    className="px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: getTierColor(post.author.tier) + "30" }}
                  >
                    <Text 
                      className="text-xs font-bold"
                      style={{ color: getTierColor(post.author.tier) }}
                    >
                      {post.author.tier}
                    </Text>
                  </View>
                </View>
                <Text className="text-zinc-500 text-sm">
                  @{post.author.username} · {post.author.school} · {post.createdAt}
                </Text>
              </View>
            </View>

            {/* Content */}
            <Text className="text-white text-base mb-3">{post.content}</Text>

            {/* Performance Card */}
            {post.performance && (
              <View className="bg-zinc-900 rounded-xl p-4 mb-3 border border-zinc-800">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-2xl">{getTypeIcon(post.type)}</Text>
                    <View>
                      <Text className="text-zinc-400 text-sm">{post.performance.event}</Text>
                      <Text className="text-white text-2xl font-black">{post.performance.time}</Text>
                    </View>
                  </View>
                  {post.performance.improvement && (
                    <View className="bg-green-500/20 px-3 py-1 rounded-full">
                      <Text className="text-green-400 font-bold">{post.performance.improvement}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Actions */}
            <View className="flex-row items-center justify-between pt-2">
              <Pressable 
                className="flex-row items-center gap-2"
                onPress={() => toggleLike(post.id)}
              >
                <Heart 
                  color={likedPosts.includes(post.id) ? "#ef4444" : "#71717a"} 
                  fill={likedPosts.includes(post.id) ? "#ef4444" : "transparent"}
                  size={22} 
                />
                <Text className="text-zinc-500">
                  {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                </Text>
              </Pressable>
              <Pressable className="flex-row items-center gap-2">
                <MessageCircle color="#71717a" size={22} />
                <Text className="text-zinc-500">{post.comments}</Text>
              </Pressable>
              <Pressable>
                <Share2 color="#71717a" size={22} />
              </Pressable>
              <Pressable onPress={() => toggleSave(post.id)}>
                <Bookmark 
                  color={savedPosts.includes(post.id) ? "#f97316" : "#71717a"} 
                  fill={savedPosts.includes(post.id) ? "#f97316" : "transparent"}
                  size={22} 
                />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
