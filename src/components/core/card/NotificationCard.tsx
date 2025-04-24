import PriorityDot from "@/components/ui/PriorityDot";
import UserAvatar from "@/components/ui/UserAvatar";
import { useProfile } from "@/hooks/useProfile";
import { NotificationType } from "@/types/supabase-schema-types";
import { Platform, Pressable, Text, View } from "react-native";

interface NotificationCardProps {
  notification: NotificationType;
}

export default function NotificationCard({
  notification,
}: NotificationCardProps) {
  if (notification.type === "follow_request") {
    const { profile } = useProfile(notification.sender_id);

    if (!profile) return null;
    return (
      <Pressable
        className={`flex-row items-center justify-between px-4 py-2 ${
          !notification.is_read && "bg-neutral-800"
        }`}
        android_ripple={{ color: "#171717", borderless: false }}
        style={({ pressed }) => [
          {
            opacity: pressed && Platform.OS === "ios" ? 0.5 : 1,
          },
        ]}
      >
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-2">
            {!notification.is_read && <PriorityDot />}
            <UserAvatar avatar={profile.avatar} size={28} />
          </View>
          <View>
            <Text className="font-mont text-sm text-neutral-200">
              <Text className="font-montSemiBold text-neutral-100">
                {profile.username}{" "}
              </Text>
              has requested to follow you
            </Text>
          </View>
        </View>
        <View>{/* TODO: Add accept and reject buttons */}</View>
      </Pressable>
    );
  }

  return (
    <View>
      <Text className="font-mont text-white">{notification.type}</Text>
    </View>
  );
}
