import ConversationScreen from "@/screens/main/ConversationScreen";
import { useLocalSearchParams } from "expo-router";

export default function Conversation() {
  const { profile_id } = useLocalSearchParams();
  return <ConversationScreen profile_id={profile_id as string} />;
}
