'use client';

import React from 'react';
import { User, Organization, TeamMember } from '@/types/legologic';
import { Settings, User as UserIcon, Building2, Users, ShieldCheck, Sparkles, LogIn, ExternalLink } from 'lucide-react';

interface SettingsViewProps {
  user: User;
  organization: Organization;
  teamMembers: TeamMember[];
  onOpenTeam: () => void;
  onOpenAuth: () => void;
}

export function SettingsView({
  user,
  organization,
  teamMembers,
  onOpenTeam,
  onOpenAuth,
}: SettingsViewProps) {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fafafa] dot-grid select-none">
      {/* Top Header */}
      <header className="p-4 px-8 border-b border-slate-200/80 bg-white/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-2xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            <span>Pengaturan Akun & Workspace</span>
          </h1>
          <p className="text-xs text-slate-500">
            Kelola profil pengguna, organisasi tim, domain publik, dan preferensi LegoLogic.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        {/* SECTION 1: USER PROFILE */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
                <p className="text-xs text-slate-500">{user.email}</p>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mt-1">
                  Peran: {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Ganti Akun / Login</span>
            </button>
          </div>
        </div>

        {/* SECTION 2: WORKSPACE & TEAM */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Workspace Organisasi</h3>
                <p className="text-xs text-slate-500">{organization.name} ({organization.slug})</p>
              </div>
            </div>

            <button
              onClick={onOpenTeam}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Kelola Tim ({teamMembers.length} Orang)</span>
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Daftar Anggota Tim:</h4>
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden">
              {teamMembers.map(m => (
                <div key={m.id} className="p-3 px-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 block">{m.name}</span>
                    <span className="text-[11px] text-slate-500">{m.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {m.role}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Aktif" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: AI ENGINE PREFERENCES */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">AI Gateway Engine</h3>
              <p className="text-xs text-slate-500">Sakelar AI Gateway · claude-sonnet-4.6</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold">Gateway Endpoint:</span>
              <span className="font-mono text-slate-500">https://api.sakelar.web.id/v1</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Model Aktif:</span>
              <span className="font-mono text-slate-500">claude-sonnet-4.6</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Status Gateway:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online & Terverifikasi
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
