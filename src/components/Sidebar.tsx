'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Plus, MessageSquare, Monitor, FolderGit2, Zap, Database, Layers, Sparkles, 
  Settings, ChevronDown, ChevronsUpDown, ShieldCheck, History 
} from 'lucide-react';
import { User, Organization, CreditWallet } from '@/types/legologic';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNewBuild: () => void;
  onOpenBilling: () => void;
  onOpenTeam: () => void;
  onOpenAuth: () => void;
  user: User;
  organization: Organization;
  wallet: CreditWallet;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  onNewBuild,
  onOpenBilling,
  onOpenTeam,
  onOpenAuth,
  user,
  organization,
  wallet,
}: SidebarProps) {
  const navItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'studio', label: 'Studio', icon: Monitor },
    { id: 'library', label: 'Library', icon: FolderGit2 },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'history', label: 'History & Versi', icon: History },
    { id: 'connectors', label: 'Connectors', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'usage', label: 'Usage / Kredit', icon: Zap, badge: `${wallet.aiCredits} AI` },
  ];

  return (
    <aside className="w-56 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 h-screen select-none z-20">
      {/* Top Section */}
      <div className="p-3 space-y-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center p-0.5 shadow-2xs">
            <Image 
              src="/legologic-logo.webp" 
              alt="GENESIS Logo" 
              width={28} 
              height={28}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm tracking-widest text-slate-900 uppercase">
              GENE<span className="text-blue-600">SIS</span>
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
              v1.0
            </span>
          </div>
        </div>

        {/* Primary Action Button: + New build */}
        <button
          onClick={onNewBuild}
          className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 rounded-xl flex items-center gap-2 transition-all shadow-2xs active:scale-98"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>New build</span>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-0.5 pt-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Widget & Google Auth */}
      <div className="p-3 border-t border-slate-200/80 space-y-1.5">
        <button 
          onClick={onOpenAuth}
          className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
          title="Klik untuk masuk atau ganti akun Google"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-900 truncate leading-tight flex items-center gap-1">
                <span>{user.name}</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <span>{user.email}</span>
              </div>
            </div>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        <button
          onClick={onOpenAuth}
          className="w-full py-1 px-2 text-[10px] font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-transparent hover:border-blue-100"
        >
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Masuk akun Gmail</span>
        </button>
      </div>
    </aside>
  );
}
