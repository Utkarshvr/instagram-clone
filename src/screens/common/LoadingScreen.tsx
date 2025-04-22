import { ActivityIndicator, Text, View } from "react-native";

export default function LoadingScreen({ message }: { message?: string }) {
  return (
    <View className="flex items-center justify-center flex-1 bg-neutral-950">
      <View>
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-neutral-200 font-mont">{message}</Text>
      </View>
    </View>
  );
}
