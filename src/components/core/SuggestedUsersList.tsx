import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/store/SessionStore";
import { ProfileType } from "@/types/supabase-schema-types";
import { useState, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import { router } from "expo-router";

export default function SuggestedUsersList() {
  const [suggestedUsers, setSuggestedUsers] = useState<ProfileType[]>([]);
  const { profile: MyProfile } = useSessionStore();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", MyProfile?.id)
        .limit(10)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      }

      setSuggestedUsers(data as ProfileType[]);
    };
    fetchSuggestedUsers();
  }, []);

  const handlePress = (userId: string) => {
    router.push({
      pathname: "/chat/[profile_id]",
      params: {
        profile_id: userId,
      },
    });
  };

  return suggestedUsers.map((user) => (
    <ProfileCard
      key={user.id}
      profile={user}
      showMessageButton={true}
      onPress={() => handlePress(user.id)}
    />
  ));
}
