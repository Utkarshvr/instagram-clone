import { NotificationType } from "@/types/supabase-schema-types";
import { Text, View } from "react-native";

interface NotificationListProps {
  notifications: NotificationType[];
}

export default function NotificationList({
  notifications,
}: NotificationListProps) {
  return (
    <View>
      <Text>Notifications</Text>
    </View>
  );
}
