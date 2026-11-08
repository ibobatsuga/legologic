'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Plus, FolderGit2, Zap, Database, Layers, Sparkles, 
  Settings, ChevronDown, ChevronsUpDown, ShieldCheck, History 
} from 'lucide-react';
import { User, Organization, CreditWallet } from '@/types/legologic';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNewBuild: () => void;
  onOpenBilling: () => void;
  onOpenTeam: () => void;
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
  user,
  organization,
  wallet,
}: SidebarProps) {
  const navItems = [
    { id: 'studio', label: 'Studio & Chat', icon: Sparkles },
    { id: 'library', label: 'Library', icon: FolderGit2 },
    { id: 'usage', label: 'Usage / Kredit', icon: Zap, badge: `${wallet.aiCredits} AI` },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'history', label: 'History & Versi', icon: History },
    { id: 'connectors', label: 'Connectors', icon: Layers },
    { id: 'templates', label: 'Templates', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
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
              alt="LegoLogic Logo" 
              width={28} 
              height={28}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm tracking-tight text-slate-900">
              Lego<span className="text-blue-600">Logic</span>
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
              v0.1
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
                onClick={() => {
                  if (item.id === 'usage') {
                    onOpenBilling();
                  } else {
                    onSelectTab(item.id);
                  }
                }}
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

      {/* Bottom Profile Widget */}
      <div className="p-3 border-t border-slate-200/80">
        <button 
          onClick={onOpenTeam}
          className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-900 truncate leading-tight">{user.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
            </div>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>
      </div>
    </aside>
  );
}
