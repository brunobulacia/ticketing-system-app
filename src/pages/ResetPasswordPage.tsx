import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { apiErrorMessage } from '../api/client';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await authApi.resetPassword(token, password);
      navigate('/login');
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-xl font-bold">Nueva contraseña</h1>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="password"
            className="input"
            placeholder="Nueva contraseña (mínimo 8 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          {error && (
            <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>
          )}
          <button type="submit" className="btn-primary w-full">
            Cambiar contraseña
          </button>
        </form>
        <Link
          to="/login"
          className="mt-4 block text-center text-sm text-indigo-600 hover:underline"
        >
          Volver al login
        </Link>
      </div>
    </div>
  );
}
