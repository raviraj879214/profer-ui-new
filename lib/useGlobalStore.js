"use client"
import { create } from 'zustand';

export const useRoleStore = create((set) => ({
  role: localStorage.getItem("FrontendRole") ,
  setRole: (role) => set({ role }),
}));
