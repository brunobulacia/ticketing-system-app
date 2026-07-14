import { useQuery } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  categoriesApi,
  departmentsApi,
  prioritiesApi,
  statusesApi,
} from '../api/catalogs.api';
import { downloadReport } from '../api/misc.api';
import { ticketsApi, type TicketFilters } from '../api/tickets.api';
import { Badge, EmptyState, Pagination, Spinner } from '../components/ui';
import { useAuthStore } from '../stores/auth.store';
import { toast } from '../stores/toast.store';

export function TicketsPage() {
  const [filters, setFilters] = useState<TicketFilters>({
    page: 1,
    limit: 15,
    sortBy: 'createdAt',
    sortDir: 'DESC',
  });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const { data, isLoading } = useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketsApi.list(filters),
  });
  const { data: statuses } = useQuery({ queryKey: ['statuses'], queryFn: () => statusesApi.list() });
  const { data: priorities } = useQuery({ queryKey: ['priorities'], queryFn: () => prioritiesApi.list() });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => categoriesApi.list() });
  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: () => departmentsApi.list() });

  const set = (patch: Partial<TicketFilters>) =>
    setFilters((f) => ({ ...f, ...patch, page: patch.page ?? 1 }));

  const toggleSort = (field: string) =>
    set({
      sortBy: field,
      sortDir:
        filters.sortBy === field && filters.sortDir === 'DESC' ? 'ASC' : 'DESC',
    });

  const sortIndicator = (field: string) => {
    if (filters.sortBy !== field) return null;
    const Icon = filters.sortDir === 'DESC' ? ArrowDown : ArrowUp;
    return <Icon className="h-3.5 w-3.5" />;
  };

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      await downloadReport(format);
    } catch {
      toast.error('No se pudo generar el reporte');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <div className="flex gap-2">
          {hasPermission('reports.view') && (
            <>
              <button className="btn-secondary" onClick={() => handleExport('csv')}>CSV</button>
              <button className="btn-secondary" onClick={() => handleExport('xlsx')}>Excel</button>
              <button className="btn-secondary" onClick={() => handleExport('pdf')}>PDF</button>
            </>
          )}
          <Link to="/tickets/new" className="btn-primary">
            <Plus className="h-4 w-4" /> Nuevo ticket
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          <form
            className="col-span-2"
            onSubmit={(e) => {
              e.preventDefault();
              set({ q: search || undefined });
            }}
          >
            <input
              className="input"
              placeholder="Buscar por número, título, descripción o comentarios…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <select className="input" value={filters.statusId ?? ''} onChange={(e) => set({ statusId: e.target.value || undefined })}>
            <option value="">Estado</option>
            {statuses?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select className="input" value={filters.priorityId ?? ''} onChange={(e) => set({ priorityId: e.target.value || undefined })}>
            <option value="">Prioridad</option>
            {priorities?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="input" value={filters.categoryId ?? ''} onChange={(e) => set({ categoryId: e.target.value || undefined })}>
            <option value="">Categoría</option>
            {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="input" value={filters.departmentId ?? ''} onChange={(e) => set({ departmentId: e.target.value || undefined })}>
            <option value="">Departamento</option>
            {departments?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        {isLoading ? (
          <Spinner />
        ) : (data?.items.length ?? 0) === 0 ? (
          <EmptyState message="No hay tickets que coincidan con los filtros" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Título</th>
                <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('status')}>
                  <span className="inline-flex items-center gap-1">Estado{sortIndicator('status')}</span>
                </th>
                <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('priority')}>
                  <span className="inline-flex items-center gap-1">Prioridad{sortIndicator('priority')}</span>
                </th>
                <th className="px-4 py-3">Departamento</th>
                <th className="px-4 py-3">Asignado</th>
                <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('createdAt')}>
                  <span className="inline-flex items-center gap-1">Creado{sortIndicator('createdAt')}</span>
                </th>
                <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('updatedAt')}>
                  <span className="inline-flex items-center gap-1">Actualizado{sortIndicator('updatedAt')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    TCK-{String(ticket.number).padStart(5, '0')}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 font-medium">
                    {ticket.title}
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={ticket.status.name} color={ticket.status.color} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={ticket.priority.name} color={ticket.priority.color} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">{ticket.department.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {ticket.assignee
                      ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(ticket.createdAt).toLocaleDateString('es')}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(ticket.updatedAt).toLocaleDateString('es')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        page={filters.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onChange={(page) => setFilters((f) => ({ ...f, page }))}
      />
    </div>
  );
}
