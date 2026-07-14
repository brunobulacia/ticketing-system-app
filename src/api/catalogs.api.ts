import { api } from './client';
import type { Category, Department, Priority, TicketStatus } from '../types';

function crud<T>(path: string) {
  return {
    list: (all = false) =>
      api.get<T[]>(`/${path}`, { params: all ? { all: 'true' } : {} }).then((r) => r.data),
    create: (input: Partial<T>) => api.post<T>(`/${path}`, input).then((r) => r.data),
    update: (id: string, input: Partial<T>) =>
      api.patch<T>(`/${path}/${id}`, input).then((r) => r.data),
    toggle: (id: string) => api.patch<T>(`/${path}/${id}/toggle`).then((r) => r.data),
  };
}

export const departmentsApi = crud<Department>('departments');
export const categoriesApi = crud<Category>('categories');
export const prioritiesApi = crud<Priority>('priorities');
export const statusesApi = crud<TicketStatus>('statuses');
