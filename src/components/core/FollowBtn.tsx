import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useFollow } from "@/hooks/useFollow";

type Props = {
  targetUserId: string;
  size?: "small" | "large";
  is_account_private: boolean;
};

export const FollowButton = ({
  targetUserId,
  size = "large",
  is_account_private,
}: Props) => {
  const {
    status,
    isFollowedByTarget,
    followUser,
    unfollowUser,
    removeRequest,
  } = useFollow(targetUserId, is_account_private);

  const handlePress = () => {
    if (status === "accepted") unfollowUser();
    else if (status === "pending") removeRequest();
    else if (status === "not_following") followUser();
  };

  if (!targetUserId) return null;

  const buttonText =
    status === "accepted"
      ? "Following"
      : status === "pending"
      ? "Requested"
      : isFollowedByTarget
      ? "Follow back"
      : "Follow";

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        className={`${
          status === "loading"
            ? "bg-neutral-500"
            : status === "not_following"
            ? "bg-sky-500"
            : "bg-neutral-600"
        } px-4 py-2 rounded-md w-full items-center`}
      >
        {status === "loading" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            className={`font-montSemiBold text-neutral-50 ${
              size === "small" ? "text-sm" : "text-base"
            }`}
          >
            {buttonText}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
