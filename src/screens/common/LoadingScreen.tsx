import { ActivityIndicator, View } from "react-native";

export default function LoadingScreen({ message }: { message?: string }) {
  return (
    <View className="flex items-center justify-center flex-1 bg-neutral-950">
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}
