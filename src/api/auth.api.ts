import { api } from './client';
import type { LoginResponse } from '../types';

export const authApi = {
  login: (email: string, password: string, rememberMe: boolean) =>
    api
      .post<LoginResponse>('/auth/login', { email, password, rememberMe })
      .then((r) => r.data),

  logout: (refreshToken: string | null) =>
    api.post('/auth/logout', { refreshToken }).then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }).then((r) => r.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api
      .post('/auth/change-password', { currentPassword, newPassword })
      .then((r) => r.data),
};
