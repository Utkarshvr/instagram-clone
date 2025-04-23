import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useFollow } from "@/hooks/useFollow";

type Props = {
  targetUserId: string;
};

export const FollowButton = ({ targetUserId }: Props) => {
  const { status, followUser, unfollowUser, removeRequest } =
    useFollow(targetUserId);

  const handlePress = () => {
    if (status === "accepted") unfollowUser();
    else if (status === "pending") removeRequest();
    else if (status === "not_following") followUser();
  };

  if (!targetUserId) return null;
  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        className={`${
          status === "loading"
            ? "bg-neutral-500"
            : status === "not_following"
            ? "bg-sky-500"
            : "bg-neutral-600"
        } p-2 rounded-md w-full items-center`}
      >
        {status === "loading" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-montSemiBold text-neutral-50">
            {status === "accepted"
              ? "Following"
              : status === "pending"
              ? "Requested"
              : "Follow"}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
