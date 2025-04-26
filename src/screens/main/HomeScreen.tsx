import { Button, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useSessionStore } from "@/store/SessionStore";
import PostCard from "@/components/core/card/PostCard";

type Props = {};

const HomeScreen = (props: Props) => {
  const { profile } = useSessionStore();
  return (
    <View className="p-4 flex-1 bg-neutral-950 gap-8">
      <Text className="text-sky-500 font-montserrat text-xl">
        {profile?.id}
      </Text>

      <Button
        title="Edit Profile"
        onPress={() => router.push("/edit-profile")}
      />

      <PostCard />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
