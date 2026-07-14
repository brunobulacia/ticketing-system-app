import { api } from './client';
import type {
  Attachment,
  Paginated,
  Ticket,
  TicketComment,
  TicketHistoryEntry,
} from '../types';

export interface TicketFilters {
  q?: string;
  statusId?: string;
  priorityId?: string;
  categoryId?: string;
  departmentId?: string;
  assigneeId?: string;
  requesterId?: string;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  categoryId: string;
  priorityId: string;
  departmentId: string;
}

export const ticketsApi = {
  list: (filters: TicketFilters) =>
    api
      .get<Paginated<Ticket>>('/tickets', { params: filters })
      .then((r) => r.data),

  get: (id: string) => api.get<Ticket>(`/tickets/${id}`).then((r) => r.data),

  create: (input: CreateTicketInput) =>
    api.post<Ticket>('/tickets', input).then((r) => r.data),

  update: (id: string, input: Partial<CreateTicketInput> & { statusId?: string; tags?: string[] }) =>
    api.patch<Ticket>(`/tickets/${id}`, input).then((r) => r.data),

  assign: (id: string, mode: 'manual' | 'auto', assigneeId?: string) =>
    api
      .patch<Ticket>(`/tickets/${id}/assign`, { mode, assigneeId })
      .then((r) => r.data),

  remove: (id: string) => api.delete(`/tickets/${id}`).then((r) => r.data),

  comments: (id: string) =>
    api.get<TicketComment[]>(`/tickets/${id}/comments`).then((r) => r.data),

  addComment: (id: string, body: string, isInternal: boolean) =>
    api
      .post<TicketComment>(`/tickets/${id}/comments`, { body, isInternal })
      .then((r) => r.data),

  history: (id: string) =>
    api.get<TicketHistoryEntry[]>(`/tickets/${id}/history`).then((r) => r.data),

  attachments: (id: string) =>
    api.get<Attachment[]>(`/tickets/${id}/attachments`).then((r) => r.data),

  uploadAttachments: (id: string, files: File[]) => {
    const form = new FormData();
    files.forEach((file) => form.append('files', file));
    return api
      .post<Attachment[]>(`/tickets/${id}/attachments`, form)
      .then((r) => r.data);
  },

  requestSummary: (id: string) =>
    api.post(`/ai/tickets/${id}/summarize`).then((r) => r.data),

  requestReply: (id: string) =>
    api.post(`/ai/tickets/${id}/suggest-reply`).then((r) => r.data),

  translateComment: (commentId: string, lang: string) =>
    api.post(`/ai/comments/${commentId}/translate`, { lang }).then((r) => r.data),
};
