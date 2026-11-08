'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  registerWithEmail, 
  isFirebaseConfigured,
  AuthUserProfile 
} from '@/lib/firebase';
import { X, Mail, Lock, User, ArrowRight, Check, AlertCircle, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUserProfile) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const userProfile = await signInWithGoogle();
      onAuthSuccess(userProfile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk dengan akun Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      let userProfile: AuthUserProfile;
      if (authMode === 'login') {
        userProfile = await signInWithEmail(email, password);
      } else {
        userProfile = await registerWithEmail(email, password, name);
      }
      onAuthSuccess(userProfile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center p-0.5 shadow-2xs">
              <Image 
                src="/legologic-logo.webp" 
                alt="GENESIS Logo" 
                width={32} 
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-slate-900">
                  GENESIS<span className="text-blue-600">.</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-blue-100 text-blue-800">
                  AUTH
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {authMode === 'login' ? 'Masuk ke akun Anda' : 'Buat akun GENESIS baru'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1-CLICK GOOGLE SIGN IN BUTTON (With official multicolored Google logo) */}
          <div className="space-y-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {/* Official Google SVG Logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>Lanjut dengan Akun Google (Gmail)</span>
            </button>

            {!isFirebaseConfigured && (
              <p className="text-[10px] text-slate-400 text-center">
                Firebase Google Auth Mode Siap (Mock / Production Sync)
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-medium absolute">
              atau dengan email
            </span>
          </div>

          {/* Conventional Email & Password Form */}
          <form onSubmit={handleSubmitEmail} className="space-y-3">
            {authMode === 'register' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Om Bobi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Alamat Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span>{authMode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="text-center pt-1 text-xs text-slate-500">
            {authMode === 'login' ? (
              <p>
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Daftar di sini
                </button>
              </p>
            ) : (
              <p>
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Masuk di sini
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Keamanan Data Terenkripsi & Akses Mandiri</span>
        </div>
      </div>
    </div>
  );
}
