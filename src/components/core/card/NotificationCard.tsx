// import PriorityDot from "@/components/ui/PriorityDot";
import UserAvatar from "@/components/ui/UserAvatar";
import { useProfile } from "@/hooks/useProfile";
import { NotificationType } from "@/types/supabase-schema-types";
import { Platform, Pressable, Text, View } from "react-native";
import FriendRequestButton from "@/components/core/FriendRequestButton";
import { FollowButton } from "../FollowBtn";

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
        className={`flex-row items-center justify-between gap-2 p-4 ${
          !notification.is_read && "bg-neutral-800"
        }`}
        android_ripple={{ color: "#171717", borderless: false }}
        style={({ pressed }) => [
          {
            opacity: pressed && Platform.OS === "ios" ? 0.5 : 1,
          },
        ]}
      >
        {/* LEFT SIDE */}
        <View className="flex-row items-center gap-2 flex-1">
          {/* {!notification.is_read && <PriorityDot />} */}
          <UserAvatar avatar={profile.avatar} size={28} />
          <Text
            className="font-mont text-sm text-neutral-200 flex-1"
            numberOfLines={2}
          >
            <Text className="font-montSemiBold text-neutral-100">
              {profile.username}{" "}
            </Text>
            has requested to follow you
          </Text>
        </View>

        {/* RIGHT SIDE */}
        <View className="ml-3">
          <FriendRequestButton
            senderId={notification.sender_id}
            receiverId={notification.user_id}
          />
        </View>
      </Pressable>
    );
  }
  if (notification.type === "follow_accepted") {
    const { profile } = useProfile(notification.sender_id);

    if (!profile) return null;
    return (
      <Pressable
        className={`flex-row items-center justify-between gap-2 p-4 ${
          !notification.is_read && "bg-neutral-800"
        }`}
        android_ripple={{ color: "#171717", borderless: false }}
        style={({ pressed }) => [
          {
            opacity: pressed && Platform.OS === "ios" ? 0.5 : 1,
          },
        ]}
      >
        {/* LEFT SIDE */}
        <View className="flex-row items-center gap-2 flex-1">
          {/* {!notification.is_read && <PriorityDot />} */}
          <UserAvatar avatar={profile.avatar} size={28} />
          <Text
            className="font-mont text-sm text-neutral-200 flex-1"
            numberOfLines={2}
          >
            <Text className="font-montSemiBold text-neutral-100">
              {profile.username}{" "}
            </Text>
            started following you
          </Text>
        </View>
        <View className="ml-3">
          <FollowButton targetUserId={notification.sender_id} size="small" />
        </View>
      </Pressable>
    );
  }

  return (
    <View>
      <Text className="font-mont text-white">{notification.type}</Text>
    </View>
  );
}
