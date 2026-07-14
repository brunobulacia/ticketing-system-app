import { create } from 'zustand';

export interface Toast {
  id: number;
  title: string;
  body?: string;
  kind: 'info' | 'success' | 'error';
}

interface ToastState {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = nextId++;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 5000);
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  info: (title: string, body?: string) =>
    useToastStore.getState().push({ title, body, kind: 'info' }),
  success: (title: string, body?: string) =>
    useToastStore.getState().push({ title, body, kind: 'success' }),
  error: (title: string, body?: string) =>
    useToastStore.getState().push({ title, body, kind: 'error' }),
};
