import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/store/SessionStore";

export function useFollow(targetUserId: string) {
  const { profile: currentUser } = useSessionStore();

  const [status, setStatus] = useState<
    "accepted" | "pending" | "not_following" | "loading"
  >("loading");

  useEffect(() => {
    if (!targetUserId || !currentUser?.id) return;

    const fetchFollowStatus = async () => {
      const { data, error } = await supabase
        .from("follows")
        .select("status")
        .eq("follower_id", currentUser.id)
        .eq("following_id", targetUserId)
        .maybeSingle();

      if (error || !data) {
        setStatus("not_following");
        console.log(error);
      } else setStatus(data.status);
    };

    fetchFollowStatus();
  }, [targetUserId, currentUser?.id]);

  const followUser = async () => {
    setStatus("loading");
    const { error } = await supabase.from("follows").upsert({
      follower_id: currentUser?.id,
      following_id: targetUserId,
      status: "pending", // Or "accepted" if account is public
    });

    if (error) {
      console.log(error);
      setStatus("not_following");
      return;
    }
    setStatus("pending"); // Or "accepted"
  };

  const unfollowUser = async () => {
    setStatus("loading");
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", currentUser?.id)
      .eq("following_id", targetUserId);

    if (error) return console.log(error);
    setStatus("not_following");
  };

  const removeRequest = async () => {
    await unfollowUser();
  };

  return {
    status,
    followUser,
    unfollowUser,
    removeRequest,
  };
}
