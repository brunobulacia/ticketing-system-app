import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authApi.forgotPassword(email);
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-xl font-bold">Recuperar contraseña</h1>
        {sent ? (
          <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            Si el correo existe, enviamos un enlace de recuperación. En este
            entorno de desarrollo el enlace se imprime en la consola del backend.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <input
              type="email"
              className="input"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary w-full">
              Enviar enlace
            </button>
          </form>
        )}
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
