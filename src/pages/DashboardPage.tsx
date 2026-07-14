import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/misc.api';
import { Spinner } from '../components/ui';
import type { ChartItem } from '../types';

/**
 * Dashboard (FR-018). Barras horizontales sin librería de charts:
 * la longitud codifica la magnitud; el color acompaña a la entidad
 * (estados/prioridades usan su color configurado; categorías y agentes
 * usan un único tono, la identidad la lleva la etiqueta de texto).
 */
export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.summary,
    refetchInterval: 60_000,
  });

  if (isLoading || !data) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Tickets abiertos" value={data.open} accent="#6366f1" />
        <StatTile label="Tickets cerrados" value={data.closed} accent="#22c55e" />
        <StatTile
          label="Tiempo promedio de resolución"
          value={
            data.avgResolutionHours !== null
              ? `${data.avgResolutionHours} h`
              : '—'
          }
          accent="#f59e0b"
        />
        <StatTile
          label="Cumplimiento de SLA"
          value={data.slaCompliance !== null ? `${data.slaCompliance}%` : '—'}
          accent="#0ea5e9"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarCard title="Tickets por estado" items={data.byStatus} />
        <BarCard title="Tickets por prioridad" items={data.byPriority} />
        <BarCard title="Tickets por categoría" items={data.byCategory} />
        <BarCard
          title="Tickets abiertos por agente"
          items={data.byAgent.map((a) => ({ ...a, color: null }))}
        />
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: string;
}) {
  return (
    <div className="card relative overflow-hidden">
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: accent }}
      />
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

function BarCard({ title, items }: { title: string; items: ChartItem[] }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div className="card">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">{title}</h2>
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">Sin datos</p>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-[8rem_1fr_2.5rem] items-center gap-3"
              title={`${item.label}: ${item.count} ticket(s)`}
            >
              <span className="truncate text-xs text-slate-600">{item.label}</span>
              <div className="h-4 rounded-sm bg-slate-100">
                <div
                  className="h-4 rounded-sm"
                  style={{
                    width: `${(item.count / max) * 100}%`,
                    minWidth: item.count > 0 ? '4px' : 0,
                    backgroundColor: item.color ?? '#6366f1',
                  }}
                />
              </div>
              <span className="text-right text-xs font-semibold tabular-nums text-slate-700">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
