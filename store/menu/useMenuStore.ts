import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from "zustand/middleware";
import * as menu from "@/services/menus/menus.service"

export const useMenuStore = create<MenuStore>()(
  persist(
    subscribeWithSelector((set) => ({
      menus: [],
      menu: null,
      metadata: null,
      loading: false,
      error: null,
      iconName: null,
      isReorderMode: false,
      mode: null,

      setMode: (mode) => set({ mode }),
      setIconName: (iconName) => set({ iconName }),
      setIsReorderMode: (isReorderMode) => set({ isReorderMode }),

      getMenus: async (params) => {
        set({ loading: true, error: null });
        try {
          const res = await menu.findAll(params);
          set({ menus: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      getMenu: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const res = await menu.findOne(id);
          console.log("res", res);
          set({ menu: res.data, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      createMenu: async (data) => {
        set({ loading: true, error: null });
        try {
          await menu.create(data);
          const res = await menu.findAll({});
          set({ menus: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      updateMenu: async (id, data) => {
        console.log("data", data);
        set({ loading: true, error: null });
        try {
          await menu.update(id, data);
          const res = await menu.findAll({});
          set({ menus: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      deleteMenu: async (id, params) => {
        set({ loading: true, error: null });
        try {
          await menu.remove(id);
          const res = await menu.findAll(params);
          set({ menus: res.data, metadata: res.metadata, loading: false });
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
      name: 'menu-store', // unique name for localStorage key
      // Only persist the mode, not the entire state
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);