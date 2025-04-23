import SearchBar from "@/components/ui/SearchBar";
import { Stack } from "expo-router";

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
          headerLeft: () => <SearchBar pushToSearch />,
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerRight: () => <SearchBar />,
        }}
      />
    </Stack>
  );
}
