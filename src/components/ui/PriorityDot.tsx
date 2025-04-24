import { View } from "react-native";

export default function PriorityDot({
  color = "sky",
}: {
  color?: "sky" | "red" | "blue" | "green";
}) {
  return (
    <View
      className={`rounded-full bg-sky-500`}
      style={{ width: 8, height: 8 }}
    />
  );
}
