import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as auth from "@/services/auth/auth.service";

export const useProfileStore = create<AuthStore>()(
  subscribeWithSelector((set) => ({
    profile: null,
    loading: false,
    error: null,
    fetchProfile: async () => {
      set({ loading: true, error: null });
      try {
        const res = await auth.getProfile();
        set({ profile: res, loading: false });
      } catch (err) {
        if (err instanceof Error) {
          set({ error: err.message, loading: false });
        } else {
          set({ error: "An unexpected error occurred", loading: false });
        }
      }
    },
  }))
);
