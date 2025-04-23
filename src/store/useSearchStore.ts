import { create } from "zustand";

interface SearchStore {
  text: string;
  setText(text: string): void;
}

const useSearchStore = create<SearchStore>((set) => ({
  text: "",
  setText(text) {
    set(() => ({ text }));
  },
}));

export default useSearchStore;
