import { useSessionStore } from "@/store/SessionStore";
import { supabase } from "@/lib/supabase";
import { router, useSegments } from "expo-router";
import { useEffect } from "react";

export default function AuthHandler() {
  // Supabase Login
  const segments = useSegments();

  const { isInitializing, getSession, session, setSession, setIsInitializing } =
    useSessionStore();

  useEffect(() => {
    getSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsInitializing(false);
    });
  }, []);

  useEffect(() => {
    if (isInitializing) return;

    if (!session) return router.replace("/(public)/(auth-screens)/signin");

    // Check if user is onboarded
    (async () => {
      const { data: userData } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session?.user?.id)
        .single();
      console.log({ userData });

      if (!userData?.username) {
        router.replace("/(private)/(onboarding)/user-name");
      } else {
        const inTabsGroup = segments[0] === "(private)";
        if (session && !inTabsGroup) router.replace("/(private)/(tabs)");
      }
    })();
  }, [session, isInitializing]);

  return null;
}
