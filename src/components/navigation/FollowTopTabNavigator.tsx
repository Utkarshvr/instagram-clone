import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function FollowTopTabNavigator() {
  return (
    <MaterialTopTabs
      screenOptions={{
        lazy: true, // <--- THIS IS IMPORTANT
        swipeEnabled: true, // optional but better for touch devices
        tabBarIndicatorStyle: {
          backgroundColor: "white", // you can customize color
          height: 2, // slim indicator like Instagram
        },
        tabBarLabelStyle: {
          color: "white",
          fontWeight: "bold",
        },
        tabBarStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: "Followers" }} />
      <MaterialTopTabs.Screen
        name="following"
        options={{ title: "Following" }}
      />
    </MaterialTopTabs>
  );
}
