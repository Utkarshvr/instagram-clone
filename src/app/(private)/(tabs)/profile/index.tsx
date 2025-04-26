import ProfileScreen from "@/screens/main/ProfileScreen";
import { useSessionStore } from "@/store/SessionStore";
export default function profile() {
  const { profile } = useSessionStore();
  return <ProfileScreen profile_id={profile?.id} />;
}
