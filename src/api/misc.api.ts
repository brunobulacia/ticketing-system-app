import { api, API_URL } from './client';
import { useAuthStore } from '../stores/auth.store';
import type {
  AppNotification,
  AuditLog,
  DashboardSummary,
  Paginated,
} from '../types';

export const dashboardApi = {
  summary: () =>
    api.get<DashboardSummary>('/dashboard/summary').then((r) => r.data),
};

export const notificationsApi = {
  list: () => api.get<AppNotification[]>('/notifications').then((r) => r.data),
  unreadCount: () =>
    api.get<{ count: number }>('/notifications/unread-count').then((r) => r.data),
  markRead: (id: string) =>
    api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.patch('/notifications/read-all').then((r) => r.data),
};

export const auditApi = {
  list: (params: { page?: number; limit?: number }) =>
    api.get<Paginated<AuditLog>>('/audit', { params }).then((r) => r.data),
};

/** Descarga de reportes con el token actual (FR-019). */
export async function downloadReport(format: 'csv' | 'xlsx' | 'pdf') {
  const token = useAuthStore.getState().accessToken;
  const response = await fetch(`${API_URL}/api/reports/tickets?format=${format}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('No se pudo generar el reporte');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tickets-report.${format}`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadAttachment(id: string, filename: string) {
  const token = useAuthStore.getState().accessToken;
  const response = await fetch(`${API_URL}/api/attachments/${id}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('No se pudo descargar el archivo');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
