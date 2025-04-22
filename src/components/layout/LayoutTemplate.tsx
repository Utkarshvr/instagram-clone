import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LayoutTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView className="bg-neutral-950 flex-1 w-full h-full">
      {children}

      <StatusBar style="light" />
    </SafeAreaView>
  );
}
