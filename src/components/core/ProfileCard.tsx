import { ProfileType } from "@/types/supabase-schema-types";
import { router } from "expo-router";
import { View, Text, Pressable, Platform, Image } from "react-native";
import { FollowButton } from "./FollowBtn";
import UserAvatar from "../ui/UserAvatar";

export default function ProfileCard({ profile }: { profile: ProfileType }) {
  return (
    <Pressable
      // onPress={() =>
      //   router.push({
      //     pathname: "/(private)/(tabs)/profile/[profile_id]",
      //     params: { profile_id: profile.id },
      //   })
      // }
      className="px-4 py-2 w-full"
      android_ripple={{ color: "#333", borderless: false }}
      style={({ pressed }) => [
        {
          opacity: pressed && Platform.OS === "ios" ? 0.5 : 1,
        },
      ]}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-2 items-center">
          <UserAvatar avatar={profile.avatar} size={36} />

          <View>
            <Text className="text-neutral-100 text-sm font-montSemiBold">
              {profile.username}
            </Text>

            {profile.name && (
              <Text className="text-neutral-300 text-sm font-mont">
                {profile.name}
              </Text>
            )}
          </View>
        </View>
        <FollowButton
          targetUserId={profile.id}
          is_account_private={profile.is_account_private}
          size="small"
        />
      </View>
    </Pressable>
  );
}
