import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/store/SessionStore";
import { ProfileType } from "@/types/supabase-schema-types";
import { useState, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import { router } from "expo-router";

export default function MessageList() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { profile: MyProfile } = useSessionStore();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("sender_id", MyProfile?.id)
        .limit(10)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      }

      setMessages(data as MessageType[]);
    };
    fetchMessages();
  }, []);

  const handlePress = (userId: string) => {
    router.push({
      pathname: "/chat/[profile_id]",
      params: {
        profile_id: userId,
      },
    });
  };

  return messages.map((message) => (
    <ProfileCard
      key={message.id}
      profile={message.receiver_id}
      showMessageButton={false}
      onPress={() => handlePress(message.receiver_id)}
    />
  ));
}
