import { supabase } from "@/lib/supabase";
import { UserInfoType } from "@/types/supabase-schema-types";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface SessionState {
  session: Session | null;
  setSession: (session: Session | null) => void;

  isInitializing: boolean;
  setIsInitializing: (condition: boolean) => void;

  getSession: () => void;

  userInfo: UserInfoType | null;
  setUserInfo: (userInfo: UserInfoType) => void;
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
    set({ session });
  },

  userInfo: null,
  setUserInfo: (userInfo: UserInfoType) => set((state) => ({ userInfo })),
}));
