import {
  Pressable,
  Text,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { toastMsg } from "@/utils/helpers";

type Props = {
  senderId: string;
  receiverId: string;
  onRespond?: (status: "accepted" | "rejected") => void;
};

export default function FriendRequestButton({
  senderId,
  receiverId,
  onRespond,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [responded, setResponded] = useState<null | "accepted" | "rejected">(
    null
  );

  console.log("follower_id: ", senderId);
  console.log("following_id: ", receiverId);

  const handleAccept = async () => {
    setLoading(true);

    const { error, data } = await supabase
      .from("follows")
      .update({ status: "accepted" })
      .eq("follower_id", senderId)
      .eq("following_id", receiverId);

    console.log({ data, error });
    setLoading(false);

    if (error) {
      console.error("Error accepting follow request:", error.message);
      toastMsg("Failed to accept request");
      return;
    }

    setResponded("accepted");
    onRespond?.("accepted");
    toastMsg("Follow request accepted");
  };

  const handleReject = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", senderId)
      .eq("following_id", receiverId);

    setLoading(false);

    if (error) {
      console.error("Error rejecting follow request:", error.message);
      toastMsg("Failed to reject request");
      return;
    }

    setResponded("rejected");
    onRespond?.("rejected");
    toastMsg("Follow request rejected");
  };

  if (loading)
    return (
      <View className="rounded-md bg-neutral-900 px-4 py-2">
        <ActivityIndicator size="small" color="#ffffff" />
      </View>
    );

  if (responded) {
    return (
      <View className="rounded-md bg-neutral-800 px-4 py-2">
        <Text className="font-montSemiBold text-neutral-100 text-sm">
          {responded === "accepted" ? "Accepted" : "Rejected"}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row gap-2">
      {/* Accept Button */}
      <Pressable
        className="rounded-md bg-sky-500 px-4 py-2"
        disabled={loading}
        android_ripple={{ color: "#0284c7", borderless: false }}
        style={({ pressed }) => [
          {
            opacity: pressed && Platform.OS === "ios" ? 0.7 : 1,
          },
        ]}
        onPress={handleAccept}
      >
        <Text className="font-montSemiBold text-neutral-100 text-sm">
          Accept
        </Text>
      </Pressable>

      {/* Reject Button */}
      <Pressable
        className="rounded-md bg-neutral-900 px-4 py-2"
        disabled={loading}
        android_ripple={{ color: "#262626", borderless: false }}
        style={({ pressed }) => [
          {
            opacity: pressed && Platform.OS === "ios" ? 0.7 : 1,
          },
        ]}
        onPress={handleReject}
      >
        <Text className="font-montSemiBold text-neutral-100 text-sm">
          Reject
        </Text>
      </Pressable>
    </View>
  );
}
