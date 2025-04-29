import { FlatList, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { FollowType, ProfileType } from "@/types/supabase-schema-types";
import ProfileCard from "@/components/core/ProfileCard";

type ExtendedFollowType = FollowType & {
  profile: ProfileType;
};

type FollowListType = "followers" | "following";

export default function FollowListScreen({
  profile_id,
  type,
}: {
  profile_id: string;
  type: FollowListType;
}) {
  const [followList, setFollowList] = useState<ExtendedFollowType[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  async function fetchFollowList() {
    if (!profile_id) return;

    setIsFetching(true);
    const selectQuery =
      type === "following"
        ? "*, profile:profiles!following_id(id, username, avatar)"
        : "*, profile:profiles!follower_id(id, username, avatar)";

    const { data, error } = await supabase
      .from("follows")
      .select(selectQuery)
      .eq(type === "followers" ? "following_id" : "follower_id", profile_id)
      .eq("status", "accepted");

    if (error) {
      console.log(error);
    }

    if (data) setFollowList(data as ExtendedFollowType[]);
    setIsFetching(false);
  }

  useEffect(() => {
    if (!profile_id) return;
    fetchFollowList();
  }, [profile_id, type]);

  return (
    <View className="flex-1 bg-neutral-950">
      <FlatList
        data={followList}
        renderItem={({ item }) => <ProfileCard profile={item.profile} />}
        onRefresh={fetchFollowList}
        refreshing={isFetching}
      />
    </View>
  );
}
