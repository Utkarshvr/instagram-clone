import { Text, View, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFollowRequests } from "@/hooks/useFollowRequests";
import ErrorScreen from "@/screens/common/ErrorScreen";
import UserAvatar from "@/components/ui/UserAvatar";
export default function FollowRequests() {
  const { error, followRequests, loading, totalRequests } = useFollowRequests();

  // Handling errors, loading & empty requests
  if (error) return <ErrorScreen message={error} />;
  if (loading) return null;
  if (totalRequests === 0) return null;

  // Main part of the component
  return (
    <Pressable
      className="flex-row items-center justify-between px-4 py-2"
      android_ripple={{ color: "#171717", borderless: false }}
      style={({ pressed }) => [
        {
          opacity: pressed && Platform.OS === "ios" ? 0.5 : 1,
        },
      ]}
    >
      <View className="flex-row items-center gap-2">
        <View>
          <UserAvatar
            avatar={followRequests?.[0]?.follower?.avatar}
            size={32}
          />
        </View>
        <View>
          <Text className="text-white  text-sm font-montSemiBold">
            Follow request
          </Text>
          <Text className="text-neutral-400 text-sm  font-mont">
            {followRequests?.[0]?.follower?.username}{" "}
            {totalRequests > 1 && `and ${totalRequests - 1} others`}
          </Text>
        </View>
      </View>
      <View>
        <Ionicons name="chevron-forward-outline" size={24} color="white" />
      </View>
    </Pressable>
  );
}
