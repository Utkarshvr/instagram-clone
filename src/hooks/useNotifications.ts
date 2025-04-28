import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/store/SessionStore";
import { NotificationType } from "@/types/supabase-schema-types";
import { useEffect, useState } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { session } = useSessionStore();
  const userId = session?.user?.id;

  async function markNotificationsAsRead() {
    if (!userId) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  }

  async function fetchNotifications() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: notificationError } = await supabase
        .from("notifications")
        .select()
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      // console.log("In fetchNotifications data: ", data);

      if (notificationError) {
        throw notificationError;
      }

      setNotifications(data || []);

      // Mark notifications as read once fetched
      await markNotificationsAsRead();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch notifications"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
  };
}
