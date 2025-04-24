import NotificationCard from "@/components/core/card/NotificationCard";
import FollowRequests from "@/components/core/FollowRequests";
import { useNotifications } from "@/hooks/useNotifications";
import { RefreshControl, ScrollView, View } from "react-native";
import LoadingScreen from "../common/LoadingScreen";

type Props = {};

const NotificationsScreen = (props: Props) => {
  const { notifications, loading, error, refetch } = useNotifications();

  if (loading) return <LoadingScreen message="Loading notifications..." />;

  return (
    <ScrollView
      className="bg-neutral-950 flex-1"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    >
      <FollowRequests />

      {notifications.map((notification) => (
        <View key={notification.id} className="mb-1">
          <NotificationCard notification={notification} />
        </View>
      ))}
    </ScrollView>
  );
};

export default NotificationsScreen;
