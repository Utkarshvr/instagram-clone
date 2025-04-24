import FollowRequests from "@/components/core/FollowRequests";
import { RefreshControl, ScrollView, Text, View } from "react-native";

type Props = {};

const NotificationsScreen = (props: Props) => {
  return (
    <ScrollView className="bg-neutral-950 flex-1">
      <FollowRequests />
    </ScrollView>
  );
};

export default NotificationsScreen;
