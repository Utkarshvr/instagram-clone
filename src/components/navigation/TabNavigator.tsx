import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/store/SessionStore";
import * as Haptics from "expo-haptics";

export default function TabNavigator() {
  const { profile } = useSessionStore();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fafafa",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#0a0a0a",
        },
        headerTitleStyle: { color: "#fafafa", fontFamily: "mont" },
        tabBarStyle: {
          backgroundColor: "#0a0a0a",
          borderTopWidth: 0,
        },
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Instagram",
          headerTitleStyle: { display: "none" },
          headerLeft: () => {
            return (
              <Image
                source={require("@/assets/insta-dark.png")}
                style={{ width: 120, height: 40, objectFit: "contain" }}
                className="ml-2"
              />
            );
          },
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerTitleStyle: { display: "none" },

          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={26}
              color={color}
              // onLongPress={() => {
              //   Haptics.selectionAsync();
              //   router.push("/explore/search");
              // }}
              // onPress={() => {
              //   router.push("/explore");
              // }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          headerTitleStyle: { display: "none" },

          tabBarShowLabel: false,
          headerShown: false,
          tabBarButton: ({}) => (
            <Ionicons
              onPress={() => router.push("/create/post")}
              className="self-center mt-[5px]"
              name={"add-circle-outline"}
              size={26}
              color={"gray"}
            />
          ),
          // tabBarIcon: ({ color, focused, size }) => (
          //   <Ionicons
          //     name={focused ? "add-circle-outline" : "add-circle"}
          //     size={26}
          //     color={color}
          //   />
          // ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerTitleStyle: { display: "none" },

          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitleStyle: { display: "none" },
          headerLeft: () => {
            return (
              <Text className="ml-4 text-neutral-50 text-lg font-montSemiBold">
                {profile?.username}
              </Text>
            );
          },
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 8 }}
              onPress={() => supabase.auth.signOut()}
            >
              <Ionicons name="log-out-outline" color={"white"} size={24} />
            </TouchableOpacity>
          ),
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused, size }) =>
            profile?.avatar?.publicUrl ? (
              <Image
                className={`${
                  focused ? "border-neutral-300 border-2" : null
                } rounded-full w-[26px] h-[26px]`}
                source={{ uri: profile.avatar.publicUrl }}
              />
            ) : (
              <Ionicons
                name={focused ? "person-circle" : "person-circle-outline"}
                size={26}
                color={color}
              />
            ),
        }}
      />
    </Tabs>
  );
}
