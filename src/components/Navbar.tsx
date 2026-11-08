'use client';

import React from 'react';
import Image from 'next/image';
import { CreditWallet, Organization, User } from '@/types/legologic';
import { 
  Zap, Cloud, Building2, ChevronDown, CreditCard, Users, 
  Sparkles, Shield, RefreshCw
} from 'lucide-react';

interface NavbarProps {
  wallet: CreditWallet;
  organization: Organization;
  user: User;
  onOpenBilling: () => void;
  onOpenTeam: () => void;
  onSelectApp: (appId: string) => void;
  availableApps: Array<{ id: string; name: string }>;
  currentAppId: string;
}

export function Navbar({
  wallet,
  organization,
  user,
  onOpenBilling,
  onOpenTeam,
  onSelectApp,
  availableApps,
  currentAppId,
}: NavbarProps) {
  const aiPercentage = Math.round((wallet.aiCredits / wallet.aiMaxCredits) * 100);
  const cloudPercentage = Math.round((wallet.cloudCredits / wallet.cloudMaxCredits) * 100);

  return (
    <header className="w-full bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-4 z-40 sticky top-0 shadow-xs">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-xs bg-white flex items-center justify-center p-0.5">
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
              <span className="font-black text-base tracking-widest text-slate-900 uppercase">
                GENE<span className="text-blue-600">SIS</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800 border border-blue-200">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block">
              Prompt → Web App Bisnis
            </p>
          </div>
        </div>

        {/* AI Engine Model Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-900">GENESIS AI Engine</span>
        </div>

        {/* Active App Selector */}
        <div className="hidden lg:flex items-center gap-1 border-l pl-3 border-slate-200">
          <span className="text-xs text-slate-400">App:</span>
          <select
            value={currentAppId}
            onChange={(e) => onSelectApp(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {availableApps.map(app => (
              <option key={app.id} value={app.id}>{app.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Credit Meters & Right Controls */}
      <div className="flex items-center gap-3">
        {/* Credit Meter: AI */}
        <div 
          onClick={onOpenBilling}
          className="cursor-pointer group flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-50/70 border border-blue-200/80 hover:bg-blue-100/70 transition-all text-xs"
          title="Saldo Kredit AI untuk generate & revisi. Klik untuk top-up."
        >
          <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600 group-hover:scale-110 transition-transform" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-blue-900">{wallet.aiCredits}</span>
              <span className="text-[10px] text-blue-600 font-medium">Kredit AI</span>
            </div>
            <div className="w-16 bg-blue-200 rounded-full h-1 mt-0.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  aiPercentage < 20 ? 'bg-rose-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, aiPercentage))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Credit Meter: Cloud */}
        <div 
          onClick={onOpenBilling}
          className="cursor-pointer group hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-50/70 border border-amber-200/80 hover:bg-amber-100/70 transition-all text-xs"
          title="Saldo Kredit Cloud untuk database & hosting subdomain. Klik untuk top-up."
        >
          <Cloud className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-amber-900">{wallet.cloudCredits}</span>
              <span className="text-[10px] text-amber-700 font-medium">Cloud</span>
            </div>
            <div className="w-14 bg-amber-200 rounded-full h-1 mt-0.5 overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(5, cloudPercentage))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Top-up Button */}
        <button
          onClick={onOpenBilling}
          className="px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden md:inline">Top Up / QRIS</span>
        </button>

        {/* Team button */}
        <button
          onClick={onOpenTeam}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 text-xs flex items-center gap-1"
          title="Kelola Tim & Organisasi"
        >
          <Users className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium hidden lg:inline">Tim</span>
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {user.name.charAt(0)}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
            <div className="text-[10px] text-slate-400">{organization.name}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
