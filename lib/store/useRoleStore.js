// store/useRoleStore.js
import { create } from 'zustand';

export const useRoleStore = create(set => ({
  role: null,
  setRole: (role) => set({ role })
}));
