'use client';

import React, { useState } from 'react';
import { AppVersion, TableDefinition, ColumnDefinition } from '@/types/legologic';
import { 
  Users, GitPullRequest, BadgeDollarSign, ShieldCheck, 
  FolderGit2, CheckCircle2, AlertCircle, BadgePercent,
  Calendar, Clock, Coins, HeartHandshake, CalendarDays, Sparkles,
  Search, Plus, Filter, MessageCircle, Phone, ExternalLink,
  ChevronRight, Trash2, ArrowUpDown, Check, X
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
      case 'Users': return <Users className="w-5 h-5" />;
      case 'GitPullRequest': return <GitPullRequest className="w-5 h-5" />;
      case 'BadgeDollarSign': return <BadgeDollarSign className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'FolderGit2': return <FolderGit2 className="w-5 h-5" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5" />;
      case 'AlertCircle': return <AlertCircle className="w-5 h-5" />;
      case 'BadgePercent': return <BadgePercent className="w-5 h-5" />;
      case 'Calendar': return <Calendar className="w-5 h-5" />;
      case 'Clock': return <Clock className="w-5 h-5" />;
      case 'Coins': return <Coins className="w-5 h-5" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
      case 'CalendarDays': return <CalendarDays className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
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

  return (
    <div className="w-full h-full min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 select-none">
      {/* App Navigation Bar */}
      <header 
        className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 shadow-xs"
        style={{ backgroundColor: '#ffffff', borderTop: `4px solid ${version.primaryColor || '#2563EB'}` }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
            style={{ backgroundColor: version.primaryColor || '#2563EB' }}
          >
            {version.appName.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              {version.appName}
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                v{version.versionNumber}
              </span>
            </h1>
            <p className="text-xs text-slate-500">{version.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 md:w-56"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-opacity"
            style={{ backgroundColor: version.primaryColor || '#2563EB' }}
          >
            <Plus className="w-4 h-4" />
            <span>{version.quickActionLabel || '+ Tambah Data'}</span>
          </button>
        </div>
      </header>

      {/* Secondary Bar: Navigation Tabs */}
      <div className="bg-white border-b px-6 flex items-center gap-2 overflow-x-auto">
        {version.pages.map(page => (
          <button
            key={page.id}
            onClick={() => setActivePageId(page.id)}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activePageId === page.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {page.name}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* KPI Metrics Row */}
        {version.metrics && version.metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {version.metrics.map(metric => (
              <div 
                key={metric.id}
                className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <span className="text-xs font-medium text-slate-500 block mb-1">{metric.label}</span>
                  <div className="text-lg font-bold text-slate-900">{metric.value}</div>
                  {metric.change && (
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <span className={metric.trend === 'up' ? 'text-emerald-600 font-semibold' : metric.trend === 'down' ? 'text-rose-600 font-semibold' : 'text-slate-500'}>
                        {metric.change}
                      </span>
                    </div>
                  )}
                </div>
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    metric.color === 'yellow' ? 'bg-amber-100 text-amber-600' :
                    metric.color === 'red' ? 'bg-rose-100 text-rose-600' :
                    metric.color === 'green' ? 'bg-emerald-100 text-emerald-600' :
                    metric.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-blue-100 text-blue-600'
                  }`}
                >
                  {getIcon(metric.icon)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Mode 1: Kanban Pipeline */}
        {activePage?.type === 'kanban' && version.kanban && version.kanban.enabled && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Pipeline Penjualan & Tahapan Interaktif</h2>
                <p className="text-xs text-slate-500">Klik tombol status di setiap kartu untuk memindahkan tahap.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 items-start overflow-x-auto pb-4">
              {version.kanban.stages.map(stage => {
                const stageRecords = (targetTable?.records || []).filter(r => {
                  const statusVal = r[version.kanban!.statusColumnKey];
                  const matchesStage = statusVal === stage.name || statusVal === stage.id;
                  if (!searchQuery) return matchesStage;
                  const title = String(r[version.kanban!.titleColumnKey] || '').toLowerCase();
                  return matchesStage && title.includes(searchQuery.toLowerCase());
                });

                return (
                  <div key={stage.id} className="bg-slate-100/90 rounded-xl p-3 border border-slate-200 flex flex-col min-h-[350px]">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                        <span className="text-xs font-bold text-slate-700">{stage.name}</span>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 bg-white rounded-md text-slate-600 border border-slate-200">
                        {stageRecords.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {stageRecords.length === 0 ? (
                        <div className="text-center py-8 text-[11px] text-slate-400">Tidak ada kartu</div>
                      ) : (
                        stageRecords.map(card => (
                          <div 
                            key={card.id}
                            className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:shadow-sm transition-all space-y-2"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                                {card[version.kanban!.titleColumnKey]}
                              </h4>
                              <button 
                                onClick={() => handleDeleteRecord(targetTable.id, card.id)}
                                className="text-slate-300 hover:text-rose-500 p-0.5"
                                title="Hapus kartu"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {version.kanban!.subtitleColumnKey && card[version.kanban!.subtitleColumnKey] && (
                              <p className="text-[11px] text-slate-500">
                                {card[version.kanban!.subtitleColumnKey]}
                              </p>
                            )}

                            {version.kanban!.valueColumnKey && card[version.kanban!.valueColumnKey] && (
                              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                                {formatCurrency(card[version.kanban!.valueColumnKey])}
                              </div>
                            )}

                            {card.whatsapp && (
                              <a 
                                href={`https://wa.me/${String(card.whatsapp).replace(/[^0-9]/g, '')}`} 
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] font-medium text-emerald-700 flex items-center gap-1 hover:underline"
                              >
                                <MessageCircle className="w-3 h-3" />
                                {card.whatsapp}
                              </a>
                            )}

                            {/* Stage Mover Selector */}
                            <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                              <span className="text-slate-400">Pindah ke:</span>
                              <select 
                                value={card[version.kanban!.statusColumnKey]}
                                onChange={(e) => handleUpdateRecordStatus(targetTable.id, card.id, version.kanban!.statusColumnKey, e.target.value)}
                                className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-medium text-slate-700 focus:outline-none"
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

        {/* View Mode 2: Full Data Table */}
        {(activePage?.type === 'table' || (!version.kanban?.enabled && activePage?.type === 'kanban')) && targetTable && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-800">{targetTable.name}</h3>
                <p className="text-xs text-slate-500">Total {targetTable.records.length} baris data tersimpan</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Tabel:</span>
                <select 
                  value={targetTable.id}
                  onChange={(e) => setSelectedTargetTableId(e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-medium text-slate-700 focus:outline-none"
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
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-semibold">
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
                      <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
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
                                  className="text-emerald-700 font-medium inline-flex items-center gap-1 hover:underline"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  {val}
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
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Hapus baris"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Add Modal */}
      {isAddModalOpen && targetTable && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Tambah Data: {targetTable.name}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
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
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      required={col.required}
                      placeholder={`Masukkan ${col.label.toLowerCase()}...`}
                      value={formData[col.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  )}
                </div>
              ))}

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
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
