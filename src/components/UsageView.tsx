'use client';

import React from 'react';
import { CreditWallet, LegoApp } from '@/types/legologic';
import { Zap, Cloud, Sparkles, Check, ArrowRight, ShieldCheck, History, ArrowUpRight } from 'lucide-react';
import { APP_TIERS } from '@/lib/limits';

interface UsageViewProps {
  wallet: CreditWallet;
  currentApp: LegoApp;
  onOpenBilling: () => void;
}

export function UsageView({ wallet, currentApp, onOpenBilling }: UsageViewProps) {
  const aiPercentage = Math.min(100, Math.round((wallet.aiCredits / wallet.aiMaxCredits) * 100));
  const cloudPercentage = Math.min(100, Math.round((wallet.cloudCredits / wallet.cloudMaxCredits) * 100));
  const tiersList = Object.values(APP_TIERS);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fafafa] dot-grid select-none">
      {/* Top Header */}
      <header className="p-4 px-8 border-b border-slate-200/80 bg-white/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-2xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Usage & Saldo Kredit</span>
          </h1>
          <p className="text-xs text-slate-500">
            Pantau pemakaian Kredit AI, hosting cloud, dan aktivasi paket aplikasi Anda.
          </p>
        </div>

        <button
          onClick={onOpenBilling}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <span>Top Up / Upgrade Paket</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto space-y-8">
        {/* DUAL WALLET METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* AI Credits Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Kredit AI Builder</h3>
                  <p className="text-xs text-slate-500">GENESIS AI Engine</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                {wallet.aiCredits} Sisa
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Kapasitas Tersedia</span>
                <span>{wallet.aiCredits} / {wallet.aiMaxCredits} Kredit</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                <div 
                  className="h-full bg-linear-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${aiPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Pemakaian bulan ini: {wallet.aiUsedThisMonth} kredit</span>
                <span>Tiap generate app: ~2 kredit</span>
              </div>
            </div>
          </div>

          {/* Cloud Credits Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Kredit Cloud Hosting</h3>
                  <p className="text-xs text-slate-500">Subdomain, database & CDN live</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                {wallet.cloudCredits} Sisa
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Kapasitas Hosting</span>
                <span>{wallet.cloudCredits} / {wallet.cloudMaxCredits} Cloud</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                <div 
                  className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${cloudPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Uptime database: 99.9%</span>
                <span>Tiap publish app: ~1 kredit</span>
              </div>
            </div>
          </div>
        </div>

        {/* PRICING TIERS SECTION (PER-APP MODEL) */}
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Pilihan Paket Aplikasi (Bayar per App)</h2>
            <p className="text-xs text-slate-500">Tanpa langganan terikat. Bayar sesuai skala aplikasi yang Anda bangun.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiersList.map(plan => {
              const isCurrent = currentApp.plan === plan.id;
              const isPopular = plan.id === 'STANDAR';
              return (
                <div 
                  key={plan.id}
                  className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-6 ${
                    isPopular 
                      ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                      : 'border-slate-200/90 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{plan.name}</span>
                      {plan.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-2xl font-black text-slate-900">
                        Rp {plan.priceIdr.toLocaleString('id-ID')}
                      </div>
                      <span className="text-[11px] text-slate-500">sekali bayar / aplikasi aktif</span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">{plan.tagline}</p>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-600">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={onOpenBilling}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      isCurrent
                        ? 'bg-slate-100 text-slate-500 cursor-default'
                        : isPopular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-900 hover:bg-black text-white'
                    }`}
                  >
                    {isCurrent ? 'Paket Aktif Saat Ini' : `Pilih ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION: 2 CHOICES OF HOSTING EXPLAINED */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-900">
              Dua Pilihan Deployment Setelah Aplikasi Selesai Dibangun
            </h2>
            <p className="text-xs text-slate-500">
              Setiap pengguna yang telah membeli aplikasi memiliki kebebasan penuh dalam memilih metode hosting:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OPSI 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>1. Unduh Kode & Self-Hosted</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  Rp 0 / bln (Bebas Biaya)
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unduh file source code lengkap (Next.js / TSX / Tailwind) beserta skema database. Anda bebas mengurus dan men-deploy sendiri di Vercel, Netlify, cPanel, atau VPS tanpa biaya langganan bulanan ke GENESIS.
              </p>
              <div className="text-[11px] text-slate-600 font-medium pt-1 border-t border-slate-200">
                Cocok untuk: Developer atau tim yang sudah punya server sendiri.
              </div>
            </div>

            {/* OPSI 2 */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>2. Managed Cloud GENESIS</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-600 text-white rounded-full">
                  Rp 99.000 / bln
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gunakan infrastruktur cloud GENESIS. Aplikasi langsung live seketika di subdomain publik, lengkap dengan database cloud terkelola, sertifikat SSL HTTPS otomatis, dan maintenance zero-setup.
              </p>
              <div className="text-[11px] text-blue-900 font-medium pt-1 border-t border-blue-200">
                Cocok untuk: Pemilik bisnis yang ingin langsung live tanpa repot teknis server.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
