import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0a0a0a",
        },
        headerTitleStyle: {
          color: "#fafafa",
          fontFamily: "mont",
          fontSize: 16,
        },
        headerTintColor: "#fafafa",
        animationTypeForReplace: "push",
      }}
    >
      <Stack.Screen name="edit-profile" options={{ title: "Edit profile" }} />
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
