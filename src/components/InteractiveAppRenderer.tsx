'use client';

import React, { useState } from 'react';
import { AppVersion, TableDefinition, ColumnDefinition } from '@/types/legologic';
import { 
  Users, GitPullRequest, BadgeDollarSign, ShieldCheck, 
  FolderGit2, CheckCircle2, AlertCircle, BadgePercent,
  Calendar, Clock, Coins, HeartHandshake, CalendarDays, Sparkles,
  Search, Plus, Filter, MessageCircle, Phone, ExternalLink,
  ChevronRight, Trash2, ArrowUpDown, Check, X, Layers, Building2,
  ChevronDown, ArrowUpRight
} from 'lucide-react';

interface InteractiveAppRendererProps {
  version: AppVersion;
  onDataChange?: (updatedTables: TableDefinition[]) => void;
  isStandalone?: boolean;
}

export function InteractiveAppRenderer({ version, onDataChange, isStandalone = false }: InteractiveAppRendererProps) {
  const [activePageId, setActivePageId] = useState<string>(version.pages[0]?.id || 'p1');
  const [tablesState, setTablesState] = useState<TableDefinition[]>(version.tables || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedTargetTableId, setSelectedTargetTableId] = useState<string>(
    version.quickActionTargetTable || version.tables[0]?.id || ''
  );
  // Mobile stage filter for Kanban view
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');

  // Sync if version updates
  React.useEffect(() => {
    setTablesState(version.tables || []);
    if (version.pages[0]?.id) {
      setActivePageId(version.pages[0].id);
    }
  }, [version]);

  const activePage = version.pages.find(p => p.id === activePageId) || version.pages[0];
  const targetTable = tablesState.find(t => t.id === (activePage?.tableId || selectedTargetTableId)) || tablesState[0];

  // Helper to get Lucide icon
  const getIcon = (name?: string) => {
    switch (name) {
      case 'Users': return <Users className="w-4 h-4" />;
      case 'GitPullRequest': return <GitPullRequest className="w-4 h-4" />;
      case 'BadgeDollarSign': return <BadgeDollarSign className="w-4 h-4" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      case 'FolderGit2': return <FolderGit2 className="w-4 h-4" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-4 h-4" />;
      case 'AlertCircle': return <AlertCircle className="w-4 h-4" />;
      case 'BadgePercent': return <BadgePercent className="w-4 h-4" />;
      case 'Calendar': return <Calendar className="w-4 h-4" />;
      case 'Clock': return <Clock className="w-4 h-4" />;
      case 'Coins': return <Coins className="w-4 h-4" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4" />;
      case 'CalendarDays': return <CalendarDays className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const formatCurrency = (val: number | string) => {
    const num = Number(val);
    if (isNaN(num)) return val;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const handleUpdateRecordStatus = (tableId: string, recordId: string, statusColKey: string, newStatus: string) => {
    const nextTables = tablesState.map(t => {
      if (t.id !== tableId) return t;
      return {
        ...t,
        records: t.records.map(r => r.id === recordId ? { ...r, [statusColKey]: newStatus } : r)
      };
    });
    setTablesState(nextTables);
    onDataChange?.(nextTables);
  };

  const handleDeleteRecord = (tableId: string, recordId: string) => {
    const nextTables = tablesState.map(t => {
      if (t.id !== tableId) return t;
      return {
        ...t,
        records: t.records.filter(r => r.id !== recordId)
      };
    });
    setTablesState(nextTables);
    onDataChange?.(nextTables);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTable) return;

    const newRecord = {
      id: 'rec-' + Date.now(),
      ...formData
    };

    const nextTables = tablesState.map(t => {
      if (t.id !== targetTable.id) return t;
      return {
        ...t,
        records: [newRecord, ...t.records]
      };
    });

    setTablesState(nextTables);
    onDataChange?.(nextTables);
    setFormData({});
    setIsAddModalOpen(false);
  };

  // Helper for contact initials
  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900 select-none antialiased">
      {/* Sleek App Navigation Bar */}
      <header className="px-5 md:px-7 py-3.5 bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-xs transition-transform hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${version.primaryColor || '#2563EB'}, #4f46e5)` 
            }}
          >
            {version.appName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-slate-900">
                {version.appName}
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                v{version.versionNumber}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{version.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-36 sm:w-48 transition-all"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-xs hover:opacity-95 active:scale-98 transition-all"
            style={{ backgroundColor: version.primaryColor || '#2563EB' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{version.quickActionLabel || '+ Tambah Data'}</span>
          </button>
        </div>
      </header>

      {/* Modern Page Navigation Tabs */}
      <div className="bg-white border-b border-slate-200/70 px-5 md:px-7 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {version.pages.map(page => {
          const isActive = activePageId === page.id;
          return (
            <button
              key={page.id}
              onClick={() => setActivePageId(page.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{page.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Body */}
      <main className="flex-1 p-4 md:p-6 space-y-5 max-w-7xl w-full mx-auto">
        {/* KPI Metrics Cards (Sleek Linear/Stripe Style) */}
        {version.metrics && version.metrics.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {version.metrics.map(metric => (
              <div 
                key={metric.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 tracking-tight truncate">
                    {metric.label}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    {getIcon(metric.icon)}
                  </div>
                </div>

                <div className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900">
                  {metric.value}
                </div>

                {metric.change && (
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <span className={`font-semibold ${
                      metric.trend === 'up' ? 'text-emerald-600' :
                      metric.trend === 'down' ? 'text-rose-600' : 'text-slate-500'
                    }`}>
                      {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '•'} {metric.change}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* View Mode 1: Interactive Kanban Pipeline */}
        {activePage?.type === 'kanban' && version.kanban && version.kanban.enabled && (
          <div className="space-y-3">
            {/* Stage filter pills for small screens / quick filtering */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedStageFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedStageFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Semua Tahap
                </button>
                {version.kanban.stages.map(st => {
                  const count = (targetTable?.records || []).filter(r => 
                    r[version.kanban!.statusColumnKey] === st.name || r[version.kanban!.statusColumnKey] === st.id
                  ).length;
                  const isStActive = selectedStageFilter === st.name || selectedStageFilter === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStageFilter(isStActive ? 'all' : st.name)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        isStActive
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                      <span>{st.name}</span>
                      <span className="text-[10px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Geser ke kanan untuk melihat semua tahap →
              </span>
            </div>

            {/* Horizontal Scrollable Kanban Columns with generous comfortable width (w-72) */}
            <div className="flex gap-3.5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
              {version.kanban.stages
                .filter(stage => selectedStageFilter === 'all' || selectedStageFilter === stage.name || selectedStageFilter === stage.id)
                .map(stage => {
                  const stageRecords = (targetTable?.records || []).filter(r => {
                    const statusVal = r[version.kanban!.statusColumnKey];
                    const matchesStage = statusVal === stage.name || statusVal === stage.id;
                    if (!searchQuery) return matchesStage;
                    const title = String(r[version.kanban!.titleColumnKey] || '').toLowerCase();
                    const sub = String(r[version.kanban!.subtitleColumnKey || ''] || '').toLowerCase();
                    return matchesStage && (title.includes(searchQuery.toLowerCase()) || sub.includes(searchQuery.toLowerCase()));
                  });

                  return (
                    <div 
                      key={stage.id} 
                      className="w-72 shrink-0 snap-start bg-slate-100/80 rounded-2xl p-3 border border-slate-200/70 flex flex-col min-h-[420px]"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                          <span className="text-xs font-bold text-slate-800">{stage.name}</span>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-white rounded-full text-slate-600 border border-slate-200/80 shadow-2xs">
                          {stageRecords.length}
                        </span>
                      </div>

                      {/* Cards List */}
                      <div className="space-y-2.5 flex-1">
                        {stageRecords.length === 0 ? (
                          <div className="h-32 flex flex-col items-center justify-center text-center p-3 text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white/40">
                            <span>Belum ada data di tahap ini</span>
                          </div>
                        ) : (
                          stageRecords.map(card => (
                            <div 
                              key={card.id}
                              className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-blue-400 transition-all space-y-2 group"
                            >
                              <div className="flex items-start justify-between gap-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 border border-blue-100">
                                    {getInitials(card[version.kanban!.titleColumnKey])}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                                      {card[version.kanban!.titleColumnKey]}
                                    </h4>
                                    {version.kanban!.subtitleColumnKey && card[version.kanban!.subtitleColumnKey] && (
                                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                        {card[version.kanban!.subtitleColumnKey]}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <button 
                                  onClick={() => handleDeleteRecord(targetTable.id, card.id)}
                                  className="text-slate-300 hover:text-rose-600 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Hapus data"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {version.kanban!.valueColumnKey && card[version.kanban!.valueColumnKey] && (
                                <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50/90 px-2 py-0.5 rounded-md border border-emerald-200/60 inline-block">
                                  {formatCurrency(card[version.kanban!.valueColumnKey])}
                                </div>
                              )}

                              {card.whatsapp && (
                                <div className="pt-0.5">
                                  <a 
                                    href={`https://wa.me/${String(card.whatsapp).replace(/[^0-9]/g, '')}`} 
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/80 px-2 py-1 rounded-lg border border-emerald-200/50 flex items-center gap-1.5 transition-colors w-fit"
                                  >
                                    <MessageCircle className="w-3 h-3 fill-emerald-600 text-white" />
                                    <span>{card.whatsapp}</span>
                                    <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                                  </a>
                                </div>
                              )}

                              {/* Interactive Stage Switcher */}
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                <span className="text-slate-400 font-medium">Pindah ke:</span>
                                <select 
                                  value={card[version.kanban!.statusColumnKey]}
                                  onChange={(e) => handleUpdateRecordStatus(targetTable.id, card.id, version.kanban!.statusColumnKey, e.target.value)}
                                  className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5 font-semibold text-slate-700 focus:outline-none cursor-pointer"
                                >
                                  {version.kanban!.stages.map(s => (
                                    <option key={s.id} value={s.name}>{s.name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* View Mode 2: Clean Data Table */}
        {(activePage?.type === 'table' || (!version.kanban?.enabled && activePage?.type === 'kanban')) && targetTable && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>{targetTable.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.2 bg-slate-200/70 text-slate-600 rounded-full">
                    {targetTable.records.length} baris
                  </span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">Tabel:</span>
                <select 
                  value={targetTable.id}
                  onChange={(e) => setSelectedTargetTableId(e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  {tablesState.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/80 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                    {targetTable.columns.map(col => (
                      <th key={col.key} className="py-3 px-4 whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {targetTable.records
                    .filter(rec => {
                      if (!searchQuery) return true;
                      return Object.values(rec).some(v => 
                        String(v).toLowerCase().includes(searchQuery.toLowerCase())
                      );
                    })
                    .map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/90 transition-colors">
                        {targetTable.columns.map(col => {
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
                                  className="text-emerald-700 font-semibold inline-flex items-center gap-1.5 hover:underline bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100"
                                >
                                  <MessageCircle className="w-3 h-3 fill-emerald-600 text-white" />
                                  <span>{val}</span>
                                </a>
                              </td>
                            );
                          }

                          if (col.type === 'badge' || col.type === 'status') {
                            const badgeColor = col.badgeColors?.[val] || 'blue';
                            const colorClass = 
                              badgeColor === 'green' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              badgeColor === 'yellow' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              badgeColor === 'red' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              badgeColor === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              'bg-blue-50 text-blue-700 border-blue-200';

                            return (
                              <td key={col.key} className="py-3 px-4 whitespace-nowrap">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${colorClass}`}>
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
                            onClick={() => handleDeleteRecord(targetTable.id, record.id)}
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
      </main>

      {/* Modern Add Modal */}
      {isAddModalOpen && targetTable && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Tambah Data: {targetTable.name}
                </h3>
                <p className="text-[11px] text-slate-500">Masukkan nilai kolom untuk menambahkan baris baru.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              {targetTable.columns.map(col => (
                <div key={col.key} className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {col.label} {col.required && <span className="text-rose-500">*</span>}
                  </label>

                  {col.type === 'status' || col.type === 'badge' ? (
                    <select
                      value={formData[col.key] || (col.options?.[0] || '')}
                      onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                      className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      {col.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : col.type === 'currency' || col.type === 'number' ? (
                    <input
                      type="number"
                      required={col.required}
                      placeholder="Contoh: 15000000"
                      value={formData[col.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [col.key]: Number(e.target.value) })}
                      className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      required={col.required}
                      placeholder={`Masukkan ${col.label.toLowerCase()}...`}
                      value={formData[col.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                      className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  )}
                </div>
              ))}

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
