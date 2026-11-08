'use client';

import React from 'react';
import { LegoApp, AuditLog } from '@/types/legologic';
import { History, GitCommit, RotateCcw, Clock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HistoryViewProps {
  currentApp: LegoApp;
  auditLogs: AuditLog[];
  onRollbackToVersion: (versionNumber: number) => void;
  onNavigateToTab: (tab: string) => void;
}

export function HistoryView({
  currentApp,
  auditLogs,
  onRollbackToVersion,
  onNavigateToTab,
}: HistoryViewProps) {
  const versions = currentApp.versions || [];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fafafa] dot-grid select-none">
      {/* Top Header */}
      <header className="p-4 px-8 border-b border-slate-200/80 bg-white/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-2xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <span>History Versi & Audit Log</span>
          </h1>
          <p className="text-xs text-slate-500">
            Riwayat pembaruan versi, rollback 1-klik, dan catatan aktivitas keamanan aplikasi Anda.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto space-y-8">
        {/* SECTION 1: APP VERSION HISTORY */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Riwayat Versi: {currentApp.name}
              </h2>
              <p className="text-xs text-slate-500">Setiap perubahan disimpan permanen dan dapat di-rollback kapan saja.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {versions.length} Versi Tersimpan
            </span>
          </div>

          {versions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-3">
              <p className="text-xs text-slate-500">Aplikasi ini belum memiliki riwayat versi (masih project baru).</p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((ver, idx) => {
                const isCurrent = ver.versionNumber === currentApp.currentVersion;
                return (
                  <div
                    key={ver.versionNumber}
                    className={`bg-white rounded-2xl border p-5 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isCurrent 
                        ? 'border-blue-500 ring-2 ring-blue-500/10' 
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isCurrent 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          v{ver.versionNumber}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Versi Aktif di Studio
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {new Date(ver.createdAt).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900">
                        {ver.changelog || 'Pembaruan aplikasi'}
                      </h4>

                      {ver.promptUsed && (
                        <p className="text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                          Prompt: &quot;{ver.promptUsed}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!isCurrent && (
                        <button
                          onClick={() => onRollbackToVersion(ver.versionNumber)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Rollback</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onRollbackToVersion(ver.versionNumber);
                          onNavigateToTab('studio');
                        }}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <span>Buka di Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 2: SYSTEM AUDIT LOG */}
        <section className="space-y-4 pt-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Audit Log Transparansi & Keamanan</h2>
            <p className="text-xs text-slate-500">Catatan aktivitas penting: build, publish, pembayaran, dan autentikasi.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs hover:bg-slate-50/80 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] px-2 py-0.2 bg-slate-100 text-slate-600 rounded-full font-mono">
                      {log.type}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">{log.details}</p>
                </div>

                <div className="text-right shrink-0 space-y-0.5">
                  <span className="text-[11px] font-semibold text-slate-600 block">{log.userName}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
