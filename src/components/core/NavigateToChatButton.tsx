import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function NavigateToChatButton() {
  return (
    <TouchableOpacity onPress={() => router.push("/chat")}>
      <Ionicons name="chatbox-ellipses" size={24} color="white" />
    </TouchableOpacity>
  );
}
