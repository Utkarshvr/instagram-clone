import { useSessionStore } from "@/store/SessionStore";
import { supabase } from "@/lib/supabase";
import { router, useSegments } from "expo-router";
import { useEffect, useRef } from "react";

export default function AuthHandler() {
  const segments = useSegments();

  const {
    isInitializing,
    getSession,
    session,
    setSession,
    setIsInitializing,
    setProfile,
    hasCheckedOnboarding,
    setHasCheckedOnboarding,
  } = useSessionStore();

  useEffect(() => {
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setIsInitializing(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe(); // clean up
    };
  }, []);

  useEffect(() => {
    if (isInitializing) return;

    if (!session) return router.replace("/(public)/(auth-screens)/signin");

    // Check if user is onboarded
    (async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (profileData?.username) {
        setProfile(profileData);
      }

      if (!profileData?.username) {
        router.replace("/(private)/(onboarding)/user-name");
      } else {
        setHasCheckedOnboarding(true);

        const inTabsGroup = segments[0] === "(private)";
        if (session && !inTabsGroup) router.replace("/(private)/(tabs)");
      }
    })();
  }, [session, isInitializing]);

  return null;
}
