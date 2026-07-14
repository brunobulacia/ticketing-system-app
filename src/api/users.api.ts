import { api } from './client';
import type { Paginated, Role, User } from '../types';

export interface UserInput {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  roleId: string;
  departmentId?: string;
}

export const usersApi = {
  list: (params: { q?: string; roleId?: string; page?: number; limit?: number }) =>
    api.get<Paginated<User>>('/users', { params }).then((r) => r.data),

  roles: () => api.get<Role[]>('/users/roles').then((r) => r.data),

  create: (input: UserInput) => api.post<User>('/users', input).then((r) => r.data),

  update: (id: string, input: Partial<UserInput>) =>
    api.patch<User>(`/users/${id}`, input).then((r) => r.data),

  activate: (id: string) => api.patch<User>(`/users/${id}/activate`).then((r) => r.data),

  deactivate: (id: string) =>
    api.patch<User>(`/users/${id}/deactivate`).then((r) => r.data),

  remove: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
};
