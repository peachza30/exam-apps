import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from "zustand/middleware";
import * as users from "@/services/users/users.service"

export const useUserStore = create<UserStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      users: [],
      usersById: {},
      user: null,
      userById: null,
      userByUpdated: null,
      metadata: null,
      loading: false,
      error: null,
      mode: null,
      resetUser: () => set({ user: null }),
      setMode: (mode) => set({ mode }),
      fetchUsers: async (params) => {
        set({ loading: true, error: null });
        try {
          const res = await users.findAll(params);
          set({ users: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      fetchUser: async (id: number) => {
        const { usersById } = get();
        if (usersById[id]) return; // ✅ already cached
        set({ loading: true, error: null });
        try {
          const res = await users.findOne(id);
          set((state) => ({
            user: res,
            usersById: { ...state.usersById, [id]: res },
            loading: false,
          }));
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Unexpected error",
            loading: false,
          });
        }
      },
      fetchUserById: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const res = await users.findOne(id);
          set({ userById: res, loading: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Unexpected error",
            loading: false,
          });
        }
      },
      fetchUserByUpdatedId: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const res = await users.findOne(id);
          set({ userByUpdated: res, loading: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Unexpected error",
            loading: false,
          });
        }
      },
      createUser: async (data) => {
        // set({ loading: true, error: null });
        // try {
        //   await users.create(data);
        //   const res = await users.findAll();
        //   set({ users: res.data, metadata: res.metadata, loading: false });
        // } catch (err) {
        //   if (err instanceof Error) {
        //     set({ error: err.message, loading: false });
        //   } else {
        //     set({ error: "An unexpected error occurred", loading: false });
        //   }
        // }
      },
      updateUser: async (id, data, params) => {
        set({ loading: true, error: null });
        try {
          await users.update(id, data);
          const res = await users.findAll(params);
          set({ users: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      deleteUser: async (id, params) => {
        set({ loading: true, error: null });
        try {
          await users.remove(id);
          const res = await users.findAll(params);
          set({ users: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      }
    })),
    {
      name: 'users-store', // unique name for localStorage key
      // Only persist the mode, not the entire state
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);