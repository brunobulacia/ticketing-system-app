export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Priority {
  id: string;
  name: string;
  level: number;
  color: string;
  slaResponseMinutes: number;
  slaResolutionMinutes: number;
  isActive: boolean;
}

export interface TicketStatus {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
  isFinal: boolean;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: Role;
  roleId: string;
  department: Department | null;
  departmentId: string | null;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  departmentId: string | null;
}

export interface AiSuggestions {
  categoryId?: string;
  categoryName?: string;
  departmentId?: string;
  departmentName?: string;
  priorityId?: string;
  priorityName?: string;
  summary?: string;
  reply?: string;
  similar?: { id: string; number: number; title: string }[];
}

export interface Ticket {
  id: string;
  number: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  category: Category;
  department: Department;
  requester: User;
  assignee: User | null;
  tags: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | null;
  aiSuggestions: AiSuggestions;
  slaResponseDue: string | null;
  slaResolutionDue: string | null;
  firstResponseAt: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  author: User;
  body: string;
  isInternal: boolean;
  translations: Record<string, string>;
  createdAt: string;
}

export interface TicketHistoryEntry {
  id: string;
  action: string;
  field: string | null;
  oldValue: string | null;
  newValue: string | null;
  actor: User | null;
  createdAt: string;
}

export interface Attachment {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploader: User;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  userEmail: string | null;
  action: string;
  resource: string;
  resourceId: string;
  metadata: Record<string, unknown>;
  ip: string | null;
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardSummary {
  open: number;
  closed: number;
  avgResolutionHours: number | null;
  slaCompliance: number | null;
  byCategory: ChartItem[];
  byPriority: ChartItem[];
  byStatus: ChartItem[];
  byAgent: { label: string; count: number }[];
}

export interface ChartItem {
  label: string;
  color: string | null;
  count: number;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
