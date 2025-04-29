import FollowListScreen from "@/screens/main/FollowListScreen";
import { useGlobalSearchParams } from "expo-router";

export default function FollowersScreen() {
  const { profile_id } = useGlobalSearchParams<{
    profile_id: string;
  }>();

  return <FollowListScreen profile_id={profile_id} type={"followers"} />;
}
