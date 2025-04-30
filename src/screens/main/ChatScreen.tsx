import SuggestedUsersList from "@/components/core/SuggestedUsersList";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ChatScreen() {
  return (
    <ScrollView
      className="bg-neutral-950 p-4"
      contentContainerStyle={{ flex: 1 }}
    >
      <View>
        <Text className="font-montSemiBold text-xl text-neutral-100">
          Messages
        </Text>
        {/* <MessageList /> */}
      </View>

      {/* Suggestions */}
      <View className="mt-4 gap-4">
        <Text className="font-montSemiBold text-xl text-neutral-100">
          Suggested Users
        </Text>
        <SuggestedUsersList />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
