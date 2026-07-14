import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { auditApi } from '../api/misc.api';
import { Pagination, Spinner } from '../components/ui';

export function AuditPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['audit', page],
    queryFn: () => auditApi.list({ page, limit: 25 }),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Auditoría</h1>
      <div className="card overflow-x-auto p-0">
        {isLoading ? (
          <Spinner />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Acción</th>
                <th className="px-4 py-3">Recurso</th>
                <th className="px-4 py-3">IP</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((log) => (
                <tr key={log.id} className="border-b border-slate-100">
                  <td className="px-4 py-2 text-xs text-slate-500">
                    {new Date(log.createdAt).toLocaleString('es')}
                  </td>
                  <td className="px-4 py-2">{log.userEmail ?? log.userId ?? '—'}</td>
                  <td className="px-4 py-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-600">
                    {log.resource}
                    {log.resourceId && (
                      <span className="ml-1 font-mono text-[10px] text-slate-400">
                        {log.resourceId.slice(0, 8)}…
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500">{log.ip ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        onChange={setPage}
      />
    </div>
  );
}
