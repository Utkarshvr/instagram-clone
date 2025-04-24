import { create } from "zustand";

export const useDeepLink = create<{
  url: string | null;
  setUrl: (url: string) => void;
}>((set) => ({
  url: null,
  setUrl: (url) => set({ url }),
}));
