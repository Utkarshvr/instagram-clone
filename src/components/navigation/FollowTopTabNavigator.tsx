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
    //   screenOptions={{
    //     lazy: true, // <--- THIS IS IMPORTANT
    //     swipeEnabled: true, // optional but better for touch devices
    //     tabBarIndicatorStyle: {
    //       backgroundColor: "black", // you can customize color
    //       height: 2, // slim indicator like Instagram
    //     },
    //     tabBarLabelStyle: {
    //       fontWeight: "bold",
    //     },
    //   }}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: "Followers" }} />
      <MaterialTopTabs.Screen
        name="following"
        options={{ title: "Following" }}
      />
    </MaterialTopTabs>
  );
}
