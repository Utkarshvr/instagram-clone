import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/store/SessionStore";
import { ProfileType } from "@/types/supabase-schema-types";

type Follow = {
  followed_at: string;
  follower: {
    id: string;
    username: string;
    avatar: ProfileType["avatar"];
  };
};

export function useFollowRequests() {
  const { profile: currentUser } = useSessionStore();

  const [followRequests, setFollowRequests] = useState<Follow[]>([]);
  const [totalRequests, setTotalRequests] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowRequests = async () => {
    if (!currentUser) return;

    setLoading(true);
    const { data, count, error } = await supabase
      .from("follows")
      .select(
        "followed_at, follower:profiles!follower_id(id, username, avatar)",
        {
          count: "exact",
        }
      )
      .eq("following_id", currentUser.id)
      .eq("status", "pending")
      .order("followed_at", { ascending: false })
      .limit(2);

    // const { data, error } = await supabase
    //   .from("follows")
    //   .select("*")
    //   .eq("following_id", currentUser.id)
    //   .eq("status", "pending");

    if (error) {
      setError(error.message);
    } else {
      const typedData = data as unknown as Follow[];
      setFollowRequests(typedData);
      setTotalRequests(count ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFollowRequests();
  }, [currentUser]);

  return { followRequests, loading, error, totalRequests };
}
