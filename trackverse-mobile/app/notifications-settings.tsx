import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { 
  ArrowLeft, 
  Bell, 
  Dumbbell, 
  Flame, 
  Trophy, 
  Swords, 
  MessageCircle,
  Calendar,
  Clock,
} from "lucide-react-native";
import { useNotifications } from "../hooks/useNotifications";

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
};

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { scheduleWorkoutReminder, scheduleStreakWarning, cancelAllNotifications } = useNotifications();
  
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "workout_reminder",
      title: "Workout Reminders",
      description: "Daily reminder to log your workout",
      icon: <Dumbbell color="#f97316" size={24} />,
      enabled: true,
    },
    {
      id: "streak_warning",
      title: "Streak Warnings",
      description: "Alert when your streak is at risk",
      icon: <Flame color="#ef4444" size={24} />,
      enabled: true,
    },
    {
      id: "pr_celebration",
      title: "PR Celebrations",
      description: "Celebrate when you set a new PR",
      icon: <Trophy color="#eab308" size={24} />,
      enabled: true,
    },
    {
      id: "matchup_updates",
      title: "Matchup Updates",
      description: "Results from your ranked matchups",
      icon: <Swords color="#3b82f6" size={24} />,
      enabled: true,
    },
    {
      id: "social",
      title: "Social Notifications",
      description: "Likes, comments, and new followers",
      icon: <MessageCircle color="#a855f7" size={24} />,
      enabled: false,
    },
    {
      id: "meet_reminders",
      title: "Meet Reminders",
      description: "Upcoming meet notifications",
      icon: <Calendar color="#22c55e" size={24} />,
      enabled: true,
    },
  ]);

  const [reminderTime, setReminderTime] = useState("8:00 AM");

  const toggleSetting = async (id: string) => {
    setSettings(prev => 
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );

    // Handle specific notification scheduling
    const setting = settings.find(s => s.id === id);
    if (setting) {
      if (!setting.enabled) {
        // Turning on
        if (id === "workout_reminder") {
          await scheduleWorkoutReminder(8, 0);
        } else if (id === "streak_warning") {
          await scheduleStreakWarning();
        }
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-800">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft color="#fff" size={24} />
        </Pressable>
        <Text className="text-lg font-bold text-white">Notifications</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Push Notifications Master Toggle */}
        <View className="mt-6 mb-4">
          <View className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-xl bg-orange-500/20 items-center justify-center">
                <Bell color="#f97316" size={24} />
              </View>
              <View>
                <Text className="text-white font-bold text-lg">Push Notifications</Text>
                <Text className="text-zinc-500 text-sm">Enable all notifications</Text>
              </View>
            </View>
            <Switch
              value={settings.some(s => s.enabled)}
              onValueChange={(value) => {
                if (!value) {
                  cancelAllNotifications();
                  setSettings(prev => prev.map(s => ({ ...s, enabled: false })));
                }
              }}
              trackColor={{ false: "#3f3f46", true: "#f9731650" }}
              thumbColor={settings.some(s => s.enabled) ? "#f97316" : "#71717a"}
            />
          </View>
        </View>

        {/* Reminder Time */}
        <View className="mb-6">
          <Text className="text-zinc-400 text-sm mb-2">Daily Reminder Time</Text>
          <View className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Clock color="#71717a" size={20} />
              <Text className="text-white font-medium">Workout Reminder</Text>
            </View>
            <Pressable className="bg-zinc-800 px-4 py-2 rounded-lg">
              <Text className="text-orange-500 font-bold">{reminderTime}</Text>
            </Pressable>
          </View>
        </View>

        {/* Individual Settings */}
        <View className="mb-6">
          <Text className="text-zinc-400 text-sm mb-2">Notification Types</Text>
          <View className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            {settings.map((setting, index) => (
              <View 
                key={setting.id}
                className={`p-4 flex-row items-center justify-between ${
                  index !== settings.length - 1 ? 'border-b border-zinc-800' : ''
                }`}
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-10 h-10 rounded-lg bg-zinc-800 items-center justify-center">
                    {setting.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-medium">{setting.title}</Text>
                    <Text className="text-zinc-500 text-xs">{setting.description}</Text>
                  </View>
                </View>
                <Switch
                  value={setting.enabled}
                  onValueChange={() => toggleSetting(setting.id)}
                  trackColor={{ false: "#3f3f46", true: "#f9731650" }}
                  thumbColor={setting.enabled ? "#f97316" : "#71717a"}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Info */}
        <View className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-8">
          <Text className="text-zinc-400 text-sm">
            💡 Tip: Enable streak warnings to never lose your training streak. 
            We'll remind you at 8 PM if you haven't logged a workout.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
