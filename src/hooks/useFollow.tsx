import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/store/SessionStore";

export function useFollow(targetUserId: string, is_account_private: boolean) {
  const { profile: currentUser } = useSessionStore();

  const [status, setStatus] = useState<
    "accepted" | "pending" | "not_following" | "loading"
  >("loading");
  const [isFollowedByTarget, setIsFollowedByTarget] = useState(false);

  useEffect(() => {
    if (!targetUserId || !currentUser?.id) return;

    const fetchFollowStatus = async () => {
      const [followRes, followedByRes] = await Promise.all([
        supabase
          .from("follows")
          .select("status")
          .eq("follower_id", currentUser.id)
          .eq("following_id", targetUserId)
          .maybeSingle(),

        supabase
          .from("follows")
          .select("id")
          .eq("follower_id", targetUserId)
          .eq("following_id", currentUser.id)
          .eq("status", "accepted")
          .maybeSingle(),
      ]);

      if (followRes.error) {
        // console.log("Follow fetch error:", followRes.error);
        setStatus("not_following");
      } else {
        setStatus(followRes.data?.status || "not_following");
      }

      // console.log({ followedByRes });

      if (followedByRes.error) {
        // console.log("Reverse follow check error:", followedByRes.error);
        setIsFollowedByTarget(false);
      } else {
        setIsFollowedByTarget(!!followedByRes.data);
      }
    };

    fetchFollowStatus();
  }, [targetUserId, currentUser?.id]);

  const followUser = async () => {
    setStatus("loading");
    const { error } = await supabase.from("follows").upsert({
      follower_id: currentUser?.id,
      following_id: targetUserId,
      status: is_account_private ? "pending" : "accepted",
    });

    if (error) {
      // console.log(error);
      setStatus("not_following");
      return;
    }
    setStatus(is_account_private ? "pending" : "accepted");
  };

  const unfollowUser = async () => {
    setStatus("loading");
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", currentUser?.id)
      .eq("following_id", targetUserId);

    if (error) return // console.log(error);
    setStatus("not_following");
  };

  const removeRequest = async () => {
    await unfollowUser();
  };

  return {
    status,
    isFollowedByTarget,

    followUser,
    unfollowUser,
    removeRequest,
  };
}
