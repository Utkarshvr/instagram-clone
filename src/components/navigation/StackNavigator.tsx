import { Stack } from "expo-router";
import { headerStyle } from "@/config/theme/styling";

export default function StackNavigator() {
  return (
    <Stack screenOptions={{ ...headerStyle, animationTypeForReplace: "push" }}>
      <Stack.Screen name="edit-profile" options={{ title: "Edit profile" }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      {/* <Stack.Screen name="post/[postId]" options={{ title: "Post" }} />
      <Stack.Screen
        name="create"
        options={{
          headerShown: false,
          animation: "slide_from_left",
          animationDuration: 2000,
          presentation: "modal",
        }}
      /> */}
    </Stack>
  );
}
