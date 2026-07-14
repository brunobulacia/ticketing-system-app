import { useState } from 'react';
import { authApi } from '../api/auth.api';
import { apiErrorMessage } from '../api/client';
import { useAuthStore } from '../stores/auth.store';
import { toast } from '../stores/toast.store';

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.changePassword(currentPassword, newPassword);
      toast.success('Contraseña actualizada');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error('Error', apiErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold">Mi perfil</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Nombre</dt>
            <dd className="font-medium">
              {user?.firstName} {user?.lastName}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Correo</dt>
            <dd className="font-medium">{user?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Rol</dt>
            <dd className="font-medium">{user?.role?.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Departamento</dt>
            <dd className="font-medium">{user?.department?.name ?? '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Cambiar contraseña</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="label">Contraseña actual</label>
            <input
              type="password"
              className="input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Nueva contraseña</label>
            <input
              type="password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Actualizar
          </button>
        </form>
      </div>
    </div>
  );
}
