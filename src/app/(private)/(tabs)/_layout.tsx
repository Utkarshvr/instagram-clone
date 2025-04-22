import LayoutTemplate from "@/components/layout/LayoutTemplate";
import { Tabs } from "expo-router";

export default function _layout() {
  return (
    <LayoutTemplate>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      />
    </LayoutTemplate>
  );
}
