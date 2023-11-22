import { create } from "zustand";

const useStore = create((set) => ({
  walletData: {},
  setWalletData: (payload) => set((state) => ({ walletData: payload })),
}));
export default useStore;
