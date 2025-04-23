import ProfileScreen from "@/screens/main/ProfileScreen";
import { useLocalSearchParams } from "expo-router";

export default function Profile() {
  const { profile_id } = useLocalSearchParams();

  return <ProfileScreen profile_id={profile_id as string} />;
}
