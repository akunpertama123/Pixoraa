
import React, { useState } from 'react';
import { AuthViewMode } from '../types';
import { UserIcon, LockClosedIcon, UserPlusIcon, ArrowLeftOnRectangleIcon, EnvelopeIcon } from './Icons';

interface AuthFormProps {
  mode: AuthViewMode;
  onLogin: (email: string, pass: string) => void;
  onRegister: (email: string, pass: string) => void;
  onSwitchMode: () => void;
  error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onLogin, onRegister, onSwitchMode, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null); // Clear previous local errors
    if (mode === 'register') {
      if (password !== confirmPassword) {
        setFormError("Kata sandi tidak cocok.");
        return;
      }
      if (!email || !password || !confirmPassword) {
        setFormError("Semua kolom wajib diisi untuk pendaftaran.");
        return;
      }
      onRegister(email, password);
    } else {
      if (!email || !password) {
        setFormError("Email dan kata sandi wajib diisi.");
        return;
      }
      onLogin(email, password);
    }
  };

  const inputBaseClass = "w-full pl-10 pr-3 py-3 rounded-md bg-slate-700 border border-slate-600 text-gray-200 focus:ring-2 focus:border-blue-500 outline-none transition-colors duration-200 placeholder-gray-500";
  const inputFocusRingClass = "focus:ring-blue-500";
  const iconClass = "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400";

  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
      <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
        {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun'}
      </h2>
      <p className="text-center text-gray-400 mb-8">
        {mode === 'login' ? 'Masuk untuk mengakses akun Anda.' : 'Bergabunglah dengan kami dan mulai berbelanja!'}
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {(error || formError) && (
          <p className="text-red-400 bg-red-900/30 p-3 rounded-md text-sm text-center">
            {error || formError}
          </p>
        )}
        <div className="relative">
          <label htmlFor="email" className="sr-only">Email</label>
          <EnvelopeIcon className={iconClass} />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputBaseClass} ${inputFocusRingClass}`}
            placeholder="Alamat Email"
            required
            aria-label="Alamat Email"
          />
        </div>
        <div className="relative">
          <label htmlFor="password" className="sr-only">Kata Sandi</label>
          <LockClosedIcon className={iconClass} />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputBaseClass} ${inputFocusRingClass}`}
            placeholder="Kata Sandi"
            required
            aria-label="Kata Sandi"
          />
        </div>
        {mode === 'register' && (
          <div className="relative">
            <label htmlFor="confirmPassword" className="sr-only">Konfirmasi Kata Sandi</label>
            <LockClosedIcon className={iconClass} />
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputBaseClass} ${inputFocusRingClass}`}
              placeholder="Konfirmasi Kata Sandi"
              required
              aria-label="Konfirmasi Kata Sandi"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
        >
          {mode === 'login' ? (
            <>
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2 transform rotate-180" />
              Masuk
            </>
          ) : (
            <>
              <UserPlusIcon className="w-5 h-5 mr-2" />
              Daftar
            </>
          )}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-gray-400">
        {mode === 'login' ? "Belum punya akun?" : "Sudah punya akun?"}
        <button
          onClick={onSwitchMode}
          className="font-medium text-blue-400 hover:text-blue-300 ml-1 focus:outline-none focus:underline"
        >
          {mode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;