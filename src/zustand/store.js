import { create } from "zustand";

const useStore = create((set) => ({
  walletData: {},
  setWalletData: (payload) => set((state) => ({ walletData: payload })),
  timerValue: {},
  setTimerValue: (payload) => set((state) => ({ timerValue: payload })),
}));
export default useStore;
