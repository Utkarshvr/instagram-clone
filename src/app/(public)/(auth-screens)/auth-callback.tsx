import { Text, View } from "react-native";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useDeepLink } from "@/store/useDeepLink";

export default function AuthCallbackScreen() {
  const { url, setUrl } = useDeepLink();

  useEffect(() => {
    if (!url) return;

    // console.log("Using deep link URL in auth callback:", url);

    const parsed = new URL(url);
    const fragment = parsed.hash.substring(1);
    const params = new URLSearchParams(fragment);

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }) => {
          if (error) {
            console.error("Session Error:", error);
          } else {
            // The authstatechange will handle the redirect
            // console.log("Session set successfully");
            setUrl("");
          }
        });
    }
  }, [url]);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="font-montBold text-2xl text-neutral-50">
        Logging in...
      </Text>
    </View>
  );
}
