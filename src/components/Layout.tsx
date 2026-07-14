import { useQueryClient } from '@tanstack/react-query';
import {
  LayoutDashboard,
  ScrollText,
  Settings,
  Ticket,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { connectSocket, disconnectSocket } from '../lib/socket';
import { useAuthStore } from '../stores/auth.store';
import { toast } from '../stores/toast.store';
import type { AppNotification } from '../types';
import { NotificationsBell } from './NotificationsBell';
import { ToastContainer } from './ui';

const NAV_ITEMS: {
  to: string;
  label: string;
  icon: LucideIcon;
  permission: string | null;
}[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard.view' },
  { to: '/tickets', label: 'Tickets', icon: Ticket, permission: null },
  { to: '/users', label: 'Usuarios', icon: Users, permission: 'users.manage' },
  { to: '/catalogs', label: 'Configuración', icon: Settings, permission: 'catalogs.manage' },
  { to: '/audit', label: 'Auditoría', icon: ScrollText, permission: 'audit.view' },
];

export function Layout() {
  const { user, accessToken, refreshToken, logout, hasPermission } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Observer en tiempo real (FR-033): notificaciones y refresco de datos.
  useEffect(() => {
    if (!accessToken) return;
    const socket = connectSocket(accessToken);
    socket.on('notification', (notification: AppNotification) => {
      toast.info(notification.title, notification.body);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });
    socket.on('ticket.changed', () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    });
    return () => {
      socket.off('notification');
      socket.off('ticket.changed');
    };
  }, [accessToken, queryClient]);

  const handleLogout = async () => {
    try {
      await authApi.logout(refreshToken);
    } catch {
      // La sesión local se cierra igualmente.
    }
    disconnectSocket();
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 w-60 bg-slate-900 text-slate-200">
        <div className="flex h-16 items-center gap-2 px-5 text-lg font-bold text-white">
          <Ticket className="h-5 w-5" /> Ticketing
        </div>
        <nav className="mt-2 space-y-1 px-3">
          {NAV_ITEMS.filter(
            (item) => !item.permission || hasPermission(item.permission),
          ).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-slate-800 p-4">
          <p className="truncate text-sm font-medium text-white">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="truncate text-xs text-slate-400">{user?.role?.name}</p>
          <div className="mt-2 flex gap-3 text-xs">
            <NavLink to="/profile" className="text-indigo-300 hover:underline">
              Mi perfil
            </NavLink>
            <button onClick={handleLogout} className="text-red-300 hover:underline">
              Salir
            </button>
          </div>
        </div>
      </aside>

      <div className="ml-60 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-3 border-b border-slate-200 bg-white/80 px-6 backdrop-blur">
          <NotificationsBell />
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
