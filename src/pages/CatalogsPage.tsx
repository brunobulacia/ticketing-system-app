import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  categoriesApi,
  departmentsApi,
  prioritiesApi,
  statusesApi,
} from '../api/catalogs.api';
import { apiErrorMessage } from '../api/client';
import { Badge } from '../components/ui';
import { toast } from '../stores/toast.store';
import type { Priority, TicketStatus } from '../types';

type Tab = 'departments' | 'categories' | 'priorities' | 'statuses';

const TABS: { key: Tab; label: string }[] = [
  { key: 'departments', label: 'Departamentos' },
  { key: 'categories', label: 'Categorías' },
  { key: 'priorities', label: 'Prioridades' },
  { key: 'statuses', label: 'Estados' },
];

const APIS = {
  departments: departmentsApi,
  categories: categoriesApi,
  priorities: prioritiesApi,
  statuses: statusesApi,
} as const;

/**
 * Configuración general (FR-037): catálogos y SLA editables sin tocar código.
 */
export function CatalogsPage() {
  const [tab, setTab] = useState<Tab>('departments');
  const [newName, setNewName] = useState('');
  const queryClient = useQueryClient();

  const api = APIS[tab];
  const { data: items } = useQuery({
    queryKey: [tab, 'all'],
    queryFn: () => api.list(true),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [tab, 'all'] });
    queryClient.invalidateQueries({ queryKey: [tab] });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.create({ name: newName } as never);
      setNewName('');
      invalidate();
    } catch (err) {
      toast.error('Error', apiErrorMessage(err));
    }
  };

  const updateField = async (id: string, patch: Record<string, unknown>) => {
    try {
      await (api.update as (id: string, input: unknown) => Promise<unknown>)(id, patch);
      invalidate();
    } catch (err) {
      toast.error('Error', apiErrorMessage(err));
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Configuración general</h1>

      <div className="flex gap-1 rounded-xl bg-slate-200 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.key ? 'bg-white shadow' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleCreate} className="card flex gap-2">
        <input
          className="input"
          placeholder={`Nuevo elemento en ${TABS.find((t) => t.key === tab)?.label}…`}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <button className="btn-primary shrink-0">Agregar</button>
      </form>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
              <th className="px-4 py-3">Nombre</th>
              {tab === 'priorities' && (
                <>
                  <th className="px-4 py-3">Nivel</th>
                  <th className="px-4 py-3">SLA respuesta (min)</th>
                  <th className="px-4 py-3">SLA resolución (min)</th>
                </>
              )}
              {tab === 'statuses' && (
                <>
                  <th className="px-4 py-3">Orden</th>
                  <th className="px-4 py-3">¿Final?</th>
                </>
              )}
              <th className="px-4 py-3">Activo</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((item) => {
              const priority = item as unknown as Priority;
              const status = item as unknown as TicketStatus;
              return (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    <Badge
                      label={item.name}
                      color={'color' in item ? (item as { color: string }).color : null}
                    />
                  </td>
                  {tab === 'priorities' && (
                    <>
                      <td className="px-4 py-3">{priority.level}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          className="input w-28"
                          defaultValue={priority.slaResponseMinutes}
                          onBlur={(e) =>
                            updateField(item.id, {
                              slaResponseMinutes: Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          className="input w-28"
                          defaultValue={priority.slaResolutionMinutes}
                          onBlur={(e) =>
                            updateField(item.id, {
                              slaResolutionMinutes: Number(e.target.value),
                            })
                          }
                        />
                      </td>
                    </>
                  )}
                  {tab === 'statuses' && (
                    <>
                      <td className="px-4 py-3">{status.sortOrder}</td>
                      <td className="px-4 py-3">{status.isFinal ? 'Sí' : 'No'}</td>
                    </>
                  )}
                  <td className="px-4 py-3">
                    <button
                      onClick={async () => {
                        await api.toggle(item.id);
                        invalidate();
                      }}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.isActive ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
