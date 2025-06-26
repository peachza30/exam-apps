import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from "zustand/middleware";
import * as service from "@/services/services/service.service";

export const useServiceStore = create<ServiceStore>()(
  persist(
    subscribeWithSelector((set) => ({
      services: [],
      service: null,
      metadata: null,
      mode: null,
      loading: false,
      error: null,
      setMode: (mode) => set({ mode }),
      fetchService: async (params) => {
        set({ loading: true, error: null });
        try {
          const res = await service.findAll(params);
          set({ services: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      fetchServiceById: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const res = await service.findOne(id);
          set({ service: res.data, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      getUser: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const res = await service.findOne(id);
          set({ service: res.data, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      createService: async (data, params) => {
        set({ loading: true, error: null });
        try {
          await service.create(data);
          const res = await service.findAll(params);
          set({ services: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      updateService: async (id, data, params) => {
        set({ loading: true, error: null });
        try {
          await service.update(id, data);
          const res = await service.findAll(params);
          set({ services: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      deleteService: async (id, params) => {
        set({ loading: true, error: null });
        try {
          await service.remove(id);
          const res = await service.findAll(params);
          set({ services: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
    })),
    {
      name: 'service-store', // unique name for localStorage key
      // Only persist the mode, not the entire state
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);