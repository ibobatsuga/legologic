'use client';

import React, { useState } from 'react';
import { LegoApp, TableDefinition } from '@/types/legologic';
import { 
  Database, Table, Search, Plus, Trash2, ArrowRight, 
  Layers, Check, MessageCircle, ExternalLink, Filter 
} from 'lucide-react';

interface DatabaseViewProps {
  currentApp: LegoApp;
  allApps: LegoApp[];
  onSelectApp: (appId: string) => void;
  onUpdateApp: (app: LegoApp) => void;
  onNavigateToTab: (tab: string) => void;
}

export function DatabaseView({
  currentApp,
  allApps,
  onSelectApp,
  onUpdateApp,
  onNavigateToTab,
}: DatabaseViewProps) {
  const currentVersion = currentApp.versions?.[currentApp.versions.length - 1];
  const tables = currentVersion?.tables || [];
  const [selectedTableId, setSelectedTableId] = useState<string>(tables[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTable = tables.find(t => t.id === selectedTableId) || tables[0];

  const formatCurrency = (val: number | string) => {
    const num = Number(val);
    if (isNaN(num)) return val;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const handleDeleteRecord = (recordId: string) => {
    if (!activeTable) return;
    const nextTables = tables.map(t => {
      if (t.id !== activeTable.id) return t;
      return {
        ...t,
        records: t.records.filter(r => r.id !== recordId)
      };
    });

    const updatedVersions = currentApp.versions.map(v => {
      if (v.versionNumber !== currentVersion?.versionNumber) return v;
      return { ...v, tables: nextTables };
    });

    onUpdateApp({
      ...currentApp,
      versions: updatedVersions,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fafafa] dot-grid select-none">
      {/* Top Header */}
      <header className="p-4 px-8 border-b border-slate-200/80 bg-white/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-2xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>Database & Skema Data</span>
          </h1>
          <p className="text-xs text-slate-500">
            Kelola tabel database, skema kolom, dan rekaman data langsung dari aplikasi Anda.
          </p>
        </div>

        {/* App Selector */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-500 font-medium">Aplikasi:</span>
          <select
            value={currentApp.id}
            onChange={(e) => onSelectApp(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-800 shadow-2xs focus:outline-none"
          >
            {allApps.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
        {tables.length === 0 ? (
          /* Empty Database State */
          <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-8 text-center space-y-4 my-12">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto shadow-2xs">
              <Database className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Belum Ada Tabel Aktif</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aplikasi ini masih kosong. Buka template di Library atau minta AI merancang aplikasi dan database lewat Chat.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => onNavigateToTab('library')}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Buka Library Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Table Selector Pills */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {tables.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTableId(t.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                      (selectedTableId === t.id || (!selectedTableId && activeTable?.id === t.id))
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>{t.name}</span>
                    <span className="text-[10px] opacity-75">({t.records.length})</span>
                  </button>
                ))}
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari data dalam tabel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8.5 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-48 sm:w-60"
                />
              </div>
            </div>

            {/* SECTION 1: COLUMN SCHEMA INSPECTOR */}
            {activeTable && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                    Skema Kolom Database: {activeTable.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {activeTable.columns.length} Kolom Didefinisikan
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {activeTable.columns.map(col => (
                    <div 
                      key={col.key}
                      className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1"
                    >
                      <div className="text-xs font-bold text-slate-800 truncate">{col.label}</div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-slate-400">{col.key}</span>
                        <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-semibold uppercase text-[9px]">
                          {col.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: LIVE RECORDS TABLE */}
            {activeTable && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Data Baris</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600">
                      {activeTable.records.length} Baris Total
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200/80 bg-slate-50/80 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                        {activeTable.columns.map(col => (
                          <th key={col.key} className="py-3 px-4 whitespace-nowrap">
                            {col.label}
                          </th>
                        ))}
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeTable.records
                        .filter(rec => {
                          if (!searchQuery) return true;
                          return Object.values(rec).some(v => 
                            String(v).toLowerCase().includes(searchQuery.toLowerCase())
                          );
                        })
                        .map((record) => (
                          <tr key={record.id} className="hover:bg-slate-50/90 transition-colors">
                            {activeTable.columns.map(col => {
                              const val = record[col.key];

                              if (col.type === 'currency') {
                                return (
                                  <td key={col.key} className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                    {formatCurrency(val)}
                                  </td>
                                );
                              }

                              if (col.type === 'phone') {
                                return (
                                  <td key={col.key} className="py-3 px-4 whitespace-nowrap">
                                    <a 
                                      href={`https://wa.me/${String(val).replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-emerald-700 font-semibold inline-flex items-center gap-1 hover:underline"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                      {val}
                                    </a>
                                  </td>
                                );
                              }

                              if (col.type === 'badge' || col.type === 'status') {
                                return (
                                  <td key={col.key} className="py-3 px-4 whitespace-nowrap">
                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-blue-50 text-blue-700 border-blue-200">
                                      {val || '-'}
                                    </span>
                                  </td>
                                );
                              }

                              return (
                                <td key={col.key} className="py-3 px-4 text-slate-700">
                                  {val !== undefined && val !== null ? String(val) : '-'}
                                </td>
                              );
                            })}
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeleteRecord(record.id)}
                                className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                                title="Hapus baris"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
