import NotificationCard from "@/components/core/card/NotificationCard";
import FollowRequests from "@/components/core/FollowRequests";
import { useNotifications } from "@/hooks/useNotifications";
import { RefreshControl, ScrollView } from "react-native";

type Props = {};

const NotificationsScreen = (props: Props) => {
  const { notifications, loading, error, refetch } = useNotifications();

  return (
    <ScrollView
      className="bg-neutral-950 flex-1"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    >
      <FollowRequests />

      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </ScrollView>
  );
};

export default NotificationsScreen;
