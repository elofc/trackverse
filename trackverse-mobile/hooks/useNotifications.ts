import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type NotificationType = 
  | "workout_reminder"
  | "streak_warning"
  | "pr_celebration"
  | "matchup_result"
  | "challenge_complete"
  | "social";

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      handleNotificationResponse(data);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const handleNotificationResponse = (data: Record<string, unknown>) => {
    // Handle navigation based on notification type
    const type = data.type as NotificationType;
    switch (type) {
      case "workout_reminder":
        // Navigate to training screen
        break;
      case "matchup_result":
        // Navigate to ranked screen
        break;
      case "pr_celebration":
        // Navigate to profile
        break;
      default:
        break;
    }
  };

  const scheduleWorkoutReminder = async (hour: number = 8, minute: number = 0) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to Train! 💪",
        body: "Don't break your streak! Log today's workout.",
        data: { type: "workout_reminder" },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  };

  const scheduleStreakWarning = async () => {
    // Schedule for 8 PM if no workout logged
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔥 Streak in Danger!",
        body: "You haven't logged a workout today. Don't lose your streak!",
        data: { type: "streak_warning" },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });
  };

  const sendLocalNotification = async (
    title: string,
    body: string,
    type: NotificationType,
    data?: Record<string, unknown>
  ) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type, ...data },
        sound: true,
      },
      trigger: null, // Immediate
    });
  };

  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  return {
    expoPushToken,
    notification,
    scheduleWorkoutReminder,
    scheduleStreakWarning,
    sendLocalNotification,
    cancelAllNotifications,
  };
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#f97316",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }

    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      if (projectId) {
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      }
    } catch (e) {
      console.log("Error getting push token:", e);
    }
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}

// Utility function to send push notification via Expo's push service
export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
