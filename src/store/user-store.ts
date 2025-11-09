import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserData {
  email?: string;
  phoneNumber?: string;
  id?: string;
  [key: string]: unknown; // allow other possible user data
}

interface UserState {
  user: UserData | null;
  setUser: (userData: UserData) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userData: UserData) => set({ user: userData }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // localStorage key
    },
  ),
);
