import NavigateToChatButton from "@/components/core/NavigateToChatButton";
import { Stack } from "expo-router";
import { Image } from "react-native";

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0a0a0a",
        },
        headerTitleStyle: { color: "#fafafa", fontFamily: "mont" },
        headerTintColor: "#fafafa",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerLeft: () => {
            return (
              <Image
                source={require("@/assets/insta-dark.png")}
                style={{ width: 120, height: 40, objectFit: "contain" }}
                className="ml-2"
              />
            );
          },
          headerRight: () => {
            return <NavigateToChatButton />;
          },
        }}
      />
      <Stack.Screen name="profile/[profile_id]" options={{ title: "" }} />
      <Stack.Screen name="profile/follow-list" options={{ title: "" }} />
    </Stack>
  );
}
