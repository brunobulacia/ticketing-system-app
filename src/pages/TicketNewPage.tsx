import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  categoriesApi,
  departmentsApi,
  prioritiesApi,
} from '../api/catalogs.api';
import { apiErrorMessage } from '../api/client';
import { ticketsApi } from '../api/tickets.api';
import { toast } from '../stores/toast.store';

export function TicketNewPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    priorityId: '',
    departmentId: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => categoriesApi.list() });
  const { data: priorities } = useQuery({ queryKey: ['priorities'], queryFn: () => prioritiesApi.list() });
  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: () => departmentsApi.list() });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ticket = await ticketsApi.create(form);
      if (files.length > 0) {
        await ticketsApi.uploadAttachments(ticket.id, files);
      }
      toast.success(`Ticket #${ticket.number} creado`);
      navigate(`/tickets/${ticket.id}`);
    } catch (err) {
      toast.error('Error al crear el ticket', apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">Nuevo ticket</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Título</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            minLength={4}
            required
          />
        </div>
        <div>
          <label className="label">Descripción</label>
          <textarea
            className="input min-h-32"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            minLength={4}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="label">Categoría</label>
            <select
              className="input"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            >
              <option value="">Seleccionar…</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Prioridad</label>
            <select
              className="input"
              value={form.priorityId}
              onChange={(e) => setForm({ ...form, priorityId: e.target.value })}
              required
            >
              <option value="">Seleccionar…</option>
              {priorities?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Departamento</label>
            <select
              className="input"
              value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              required
            >
              <option value="">Seleccionar…</option>
              {departments?.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Adjuntos (PDF, DOCX, PNG, JPG, ZIP…)</label>
          <input
            type="file"
            multiple
            className="input"
            onChange={(e) => setFiles([...(e.target.files ?? [])])}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/tickets')}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Creando…' : 'Crear ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}
