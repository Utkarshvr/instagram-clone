import { useLocalSearchParams } from "expo-router";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function _layout() {
  const { type = "followers", profile_id } = useLocalSearchParams();

  return (
    <MaterialTopTabs
      screenOptions={
        {
          // tabBarStyle: { backgroundColor: "" },
        }
      }
    />
  );
}
