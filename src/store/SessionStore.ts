import { supabase } from "@/lib/supabase";
import { ProfileType } from "@/types/supabase-schema-types";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface SessionState {
  session: Session | null;
  setSession: (session: Session | null) => void;

  isInitializing: boolean;
  setIsInitializing: (condition: boolean) => void;

  getSession: () => void;

  profile: ProfileType | null;
  setProfile: (profile: ProfileType) => void;

  resetSession: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  session: null,

  setSession: (session) => set(() => ({ session })),

  isInitializing: true,
  setIsInitializing: (condition: boolean) =>
    set((state) => ({ isInitializing: condition })),

  getSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set((state) => {
      if (state.session?.access_token !== session?.access_token) {
        return { session };
      }
      return {};
    });
  },

  profile: null,
  setProfile: (profile: ProfileType) => set((state) => ({ profile })),

  resetSession: () => set(() => ({ session: null, profile: null })),
}));
