import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from "zustand/middleware";
import * as partners from "@/services/partners/partners.service"

export const usePartnerStore = create<PartnerStore>()(
  persist(
    subscribeWithSelector((set) => ({
      partners: [],
      partner: null,
      metadata: null,
      loading: false,
      error: null,
      mode: null,
      setMode: (mode) => set({ mode }),
      fetchPartners: async (params) => {
        set({ loading: true, error: null });
        try {
          const res = await partners.findAll(params);
          set({ partners: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      fetchPartner: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const res = await partners.findOne(id);
          set({ partner: res, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      createPartner: async (data, params) => {
        console.log("data", data);
        set({ loading: true, error: null });
        try {
          await partners.create(data);
          const res = await partners.findAll(params);
          set({ partners: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      updatePartner: async (id, data, params) => {
        set({ loading: true, error: null });
        try {
          await partners.update(id, data);
          const res = await partners.findAll(params);
          set({ partners: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      deletePartner: async (id, params) => {
        set({ loading: true, error: null });
        try {
          await partners.remove(id);
          const res = await partners.findAll(params);
          set({ partners: res.data, metadata: res.metadata, loading: false });
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
      name: 'partners-store', // unique name for localStorage key
      // Only persist the mode, not the entire state
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);