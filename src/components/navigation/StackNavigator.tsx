import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function StackNavigator() {
  const canGoBack = router.canGoBack();
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

        headerLeft: () =>
          canGoBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ) : null,
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
