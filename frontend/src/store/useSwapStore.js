import { create } from "zustand";

export const useSwapStore = create((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
}));
