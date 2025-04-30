import { Stack } from "expo-router";
import { headerStyle } from "@/config/theme/styling";

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        ...headerStyle,
        animationTypeForReplace: "push",
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Chat" }} />
    </Stack>
  );
}
