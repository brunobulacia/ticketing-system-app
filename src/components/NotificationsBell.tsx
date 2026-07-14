import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsApi } from '../api/misc.api';

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: unread } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: notificationsApi.unreadCount,
    refetchInterval: 60_000,
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: notificationsApi.list,
    enabled: open,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['notifications'] });

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
        title="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {(unread?.count ?? 0) > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread?.count}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 max-h-96 w-96 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 p-3">
            <span className="text-sm font-semibold">Notificaciones</span>
            <button
              className="text-xs text-indigo-600 hover:underline"
              onClick={async () => {
                await notificationsApi.markAllRead();
                invalidate();
              }}
            >
              Marcar todas leídas
            </button>
          </div>
          {(notifications ?? []).length === 0 && (
            <p className="p-4 text-center text-sm text-slate-400">
              Sin notificaciones
            </p>
          )}
          {(notifications ?? []).map((n) => (
            <button
              key={n.id}
              className={`block w-full border-b border-slate-50 p-3 text-left hover:bg-slate-50 ${
                n.readAt ? 'opacity-60' : ''
              }`}
              onClick={async () => {
                await notificationsApi.markRead(n.id);
                invalidate();
                setOpen(false);
                const ticketId = (n.data as { ticketId?: string }).ticketId;
                if (ticketId) navigate(`/tickets/${ticketId}`);
              }}
            >
              <p className="text-sm font-medium text-slate-700">{n.title}</p>
              <p className="truncate text-xs text-slate-500">{n.body}</p>
              <p className="mt-1 text-[10px] text-slate-400">
                {new Date(n.createdAt).toLocaleString('es')}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
