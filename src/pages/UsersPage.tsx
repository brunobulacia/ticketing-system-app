import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { departmentsApi } from '../api/catalogs.api';
import { apiErrorMessage } from '../api/client';
import { usersApi, type UserInput } from '../api/users.api';
import { Modal, Pagination, Spinner } from '../components/ui';
import { toast } from '../stores/toast.store';
import type { User } from '../types';

const EMPTY_FORM: UserInput = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  roleId: '',
  departmentId: undefined,
};

export function UsersPage() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<UserInput>(EMPTY_FORM);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users', { q, page }],
    queryFn: () => usersApi.list({ q: q || undefined, page, limit: 15 }),
  });
  const { data: roles } = useQuery({ queryKey: ['roles'], queryFn: usersApi.roles });
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.list(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['users'] });

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setForm({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      departmentId: user.departmentId ?? undefined,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        const { password, ...rest } = form;
        await usersApi.update(editing.id, rest);
        toast.success('Usuario actualizado');
      } else {
        await usersApi.create(form);
        toast.success('Usuario creado');
      }
      setShowModal(false);
      invalidate();
    } catch (err) {
      toast.error('Error', apiErrorMessage(err));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <button className="btn-primary" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Nuevo usuario
        </button>
      </div>

      <div className="card">
        <input
          className="input max-w-sm"
          placeholder="Buscar por nombre o correo…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="card overflow-x-auto p-0">
        {isLoading ? (
          <Spinner />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Departamento</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((user) => (
                <tr key={user.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3">{user.role.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {user.department?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs">
                    <button
                      className="mr-2 text-indigo-600 hover:underline"
                      onClick={() => openEdit(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="mr-2 text-amber-600 hover:underline"
                      onClick={async () => {
                        await (user.isActive
                          ? usersApi.deactivate(user.id)
                          : usersApi.activate(user.id));
                        invalidate();
                      }}
                    >
                      {user.isActive ? 'Desactivar' : 'Reactivar'}
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={async () => {
                        if (!confirm(`¿Eliminar a ${user.email}?`)) return;
                        await usersApi.remove(user.id);
                        invalidate();
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
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

      <Modal
        title={editing ? 'Editar usuario' : 'Nuevo usuario'}
        open={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nombre</label>
              <input
                className="input"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Apellido</label>
              <input
                className="input"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Correo</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          {!editing && (
            <div>
              <label className="label">Contraseña</label>
              <input
                type="password"
                className="input"
                value={form.password ?? ''}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={8}
                required
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Rol</label>
              <select
                className="input"
                value={form.roleId}
                onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                required
              >
                <option value="">Seleccionar…</option>
                {roles?.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Departamento</label>
              <select
                className="input"
                value={form.departmentId ?? ''}
                onChange={(e) =>
                  setForm({ ...form, departmentId: e.target.value || undefined })
                }
              >
                <option value="">Sin departamento</option>
                {departments?.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
