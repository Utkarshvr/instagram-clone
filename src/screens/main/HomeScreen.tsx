import HomePostsFeed from "@/components/core/HomePostsFeed";
import { View } from "react-native";

type Props = {};

const HomeScreen = (props: Props) => {
  return (
    <View className="flex-1 bg-neutral-950 gap-8">
      <HomePostsFeed />
    </View>
  );
};

export default HomeScreen;
