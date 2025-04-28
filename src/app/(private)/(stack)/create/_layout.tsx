import { headerStyle } from "@/config/theme/styling";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        ...headerStyle,
        animationTypeForReplace: "push",
        headerShown: false,
      }}
    >
      <Stack.Screen name="post" options={{ title: "Create Post" }} />
    </Stack>
  );
}
