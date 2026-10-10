import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  School,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const LoginPage: React.FC = () => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, authError, clearAuthError } = useAuth();
  const { madrasaInfo, t } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalMessage(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name || 'Madrasa Administrator');
      }
    } catch (err: any) {
      // Error handled in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearAuthError();
    setSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      // Error handled
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@darululoom-madrasa.org');
    setPassword('Admin@Madrasa123');
    setName('Mawlana Dr. Habibur Rahman');
    clearAuthError();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle geometric background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-500 filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-slate-500 filter blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Logo & Title */}
        <div className="text-center">
          {madrasaInfo?.logo ? (
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg mb-3 p-1 border border-slate-700/50 overflow-hidden">
              <img
                src={madrasaInfo.logo}
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg mb-3">
              <School className="h-6 w-6" />
            </div>
          )}
          <h1 className="text-xl font-black tracking-widest text-emerald-400 font-mono">
            {t('Madrasa Office').toUpperCase()}
          </h1>
          <h2 className="text-sm font-semibold tracking-wide text-slate-300">
            {t('Office Management')}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {mode === 'login'
              ? t('Enter administrative credentials to access office console') || 'Enter administrative credentials to access office console'
              : t('Create new authorized administrator account') || 'Create new authorized administrator account'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="mt-6 bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-8 border border-slate-800/40">
          {/* Mode Switcher */}
          <div className="flex rounded-lg bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                clearAuthError();
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t('Sign In')}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                clearAuthError();
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t('Register Admin')}
            </button>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg bg-red-50 p-3 text-xs text-red-800 border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{t(authError)}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('Full Name')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Mawlana Dr. Habibur Rahman"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('Email Address')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@darululoom-madrasa.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('Password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                />
              </div>
              {mode === 'register' && (
                <p className="mt-1 text-[11px] text-slate-400">{t('Must be at least 6 characters')}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              <span>
                {submitting
                  ? t('Authenticating...')
                  : mode === 'login'
                  ? t('Sign In to Dashboard')
                  : t('Create Administrator Account')}
              </span>
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">{t('First time setup?')}</span>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              {t('Fill Admin Sample')}
            </button>
          </div>

          {/* Alternative Google Sign In */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{t('Sign in with Google')}</span>
            </button>
          </div>

          {/* Security Assurance Badge */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>{t('Encrypted Firebase Authentication & Firestore Database')}</span>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-slate-500">
          {t('Darul Uloom Central Office')} · {t('Office Management')}
        </p>
      </div>
    </div>
  );
};
