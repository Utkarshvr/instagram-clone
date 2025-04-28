import { Stack } from "expo-router";
import { headerStyle } from "@/config/theme/styling";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useSessionStore } from "@/store/SessionStore";
import { useSignOut } from "@/hooks/useSignOut";

export default function _layout() {
  const { profile } = useSessionStore();
  const { signOut } = useSignOut();

  return (
    <Stack screenOptions={{ ...headerStyle, animationTypeForReplace: "push" }}>
      <Stack.Screen
        name="index"
        options={{
          // title: profile?.username,
          headerRight: () => (
            <TouchableOpacity onPress={() => signOut()}>
              <Ionicons name="log-out-outline" color={"white"} size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="follow-list"
        options={{
          title: profile?.username,
          presentation: "fullScreenModal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="post/[post_id]"
        options={{
          title: "Post",
        }}
      />
    </Stack>
  );
}
