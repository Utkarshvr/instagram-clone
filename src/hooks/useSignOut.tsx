import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/store/SessionStore";
import { useState } from "react";

export function useSignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { resetSession } = useSessionStore();

  const signOut = async () => {
    setIsSigningOut(true);
    const { error } = await supabase.auth.signOut();
    setIsSigningOut(false);
    if (error) {
      return // console.log(error);
    }
    resetSession();
  };

  return { signOut, isSigningOut };
}
