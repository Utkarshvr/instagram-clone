import LayoutTemplate from "@/components/layout/LayoutTemplate";
import { Slot } from "expo-router";

export default function _layout() {
  return (
    <LayoutTemplate>
      <Slot />
    </LayoutTemplate>
  );
}
