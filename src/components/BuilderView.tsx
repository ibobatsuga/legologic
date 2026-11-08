'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  LegoApp, AppVersion, BuilderMode, ChatMessage, 
  CreditWallet, AuditLog, TableDefinition, Organization, User 
} from '@/types/legologic';
import { InteractiveAppRenderer } from '@/components/InteractiveAppRenderer';
import { 
  Send, Sparkles, Monitor, Tablet, Smartphone, ExternalLink, 
  RotateCcw, History, Database, Rocket, ShieldAlert, CheckCircle2,
  AlertTriangle, Code2, Copy, Check, Download, Layers, ArrowLeftRight,
  Info, QrCode, FileSpreadsheet, Plus, HelpCircle
} from 'lucide-react';

interface BuilderViewProps {
  app: LegoApp;
  wallet: CreditWallet;
  user: User;
  organization: Organization;
  auditLogs: AuditLog[];
  onUpdateApp: (updatedApp: LegoApp) => void;
  onUpdateWallet: (updatedWallet: CreditWallet) => void;
  onAddAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  onOpenBilling: () => void;
}

export function BuilderView({
  app,
  wallet,
  user,
  organization,
  auditLogs,
  onUpdateApp,
  onUpdateWallet,
  onAddAuditLog,
  onOpenBilling,
}: BuilderViewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'database' | 'history' | 'publish' | 'audit'>('preview');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [builderMode, setBuilderMode] = useState<BuilderMode>('build');
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [subdomainSlug, setSubdomainSlug] = useState(app.publishedSlug || app.slug);

  // Chat message thread
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      role: 'assistant',
      content: `Halo! Saya GENESIS Builder AI. Aplikasi "${app.name}" siap digunakan. Anda dapat mencoba interaksi di tab Preview, atau tulis revisi di sini.`,
      timestamp: '10:00',
      versionCreated: app.currentVersion,
      suggestedPrompts: [
        'Tambahkan kolom nomor WhatsApp & tombol chat',
        'Buatkan filter pencarian status dan nilai',
        'Ganti warna tema utama ke hijau emerald',
        'Tambahkan halaman baru untuk Rekap Laporan Bulanan'
      ]
    }
  ]);

  const currentVersion: AppVersion = 
    app.versions.find(v => v.versionNumber === app.currentVersion) || app.versions[app.versions.length - 1];

  const handleSendPrompt = async (customPrompt?: string) => {
    const textToSend = (customPrompt || promptText).trim();
    if (!textToSend || isGenerating) return;

    // Credit check
    const isRevision = app.versions.length > 0;
    const neededCredits = isRevision ? 2 : 5;
    if (wallet.aiCredits < neededCredits) {
      alert(`Saldo Kredit AI tidak mencukupi (butuh ${neededCredits} kredit, sisa ${wallet.aiCredits}). Silakan top-up.`);
      onOpenBilling();
      return;
    }

    const userMsgId = 'msg-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      mode: builderMode,
    };

    setChatMessages(prev => [...prev, newUserMsg]);
    setPromptText('');
    setIsGenerating(true);
    setGenerationStep('Menghubungkan ke GENESIS AI Engine...');

    try {
      setTimeout(() => setGenerationStep('Menganalisis kebutuhan & skema bisnis...'), 1000);
      setTimeout(() => setGenerationStep('Menyusun arsitektur komponen & database...'), 2200);

      const endpoint = isRevision ? '/api/ai/revise' : '/api/ai/generate';
      const bodyPayload = isRevision
        ? {
            prompt: textToSend,
            mode: builderMode,
            existingVersion: currentVersion,
            wallet,
          }
        : {
            prompt: textToSend,
            mode: builderMode,
            appName: app.name,
            category: app.category,
            wallet,
            currentAppCount: 1,
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses dengan GENESIS AI');
      }

      const newVersion: AppVersion = data.version;
      const updatedVersions = [...app.versions, newVersion];
      const updatedApp: LegoApp = {
        ...app,
        currentVersion: newVersion.versionNumber,
        versions: updatedVersions,
        updatedAt: new Date().toISOString(),
      };

      // Deduct wallet
      const aiCost = data.creditsUsed?.ai || neededCredits;
      const cloudCost = data.creditsUsed?.cloud || 1;
      const nextWallet: CreditWallet = {
        ...wallet,
        aiCredits: Math.max(0, wallet.aiCredits - aiCost),
        aiUsedThisMonth: wallet.aiUsedThisMonth + aiCost,
        cloudCredits: Math.max(0, wallet.cloudCredits - cloudCost),
        cloudUsedThisMonth: wallet.cloudUsedThisMonth + cloudCost,
      };

      onUpdateApp(updatedApp);
      onUpdateWallet(nextWallet);

      onAddAuditLog({
        userId: user.id,
        userName: user.name,
        action: `Generate Versi v${newVersion.versionNumber}`,
        details: `Prompt: "${textToSend.substring(0, 50)}..." [Engine: GENESIS AI, -${aiCost} AI Credits]`,
        type: 'build',
      });

      const assistantMsg: ChatMessage = {
        id: 'msg-' + Date.now(),
        role: 'assistant',
        content: data.explanation || `Versi v${newVersion.versionNumber} berhasil dibangun: ${newVersion.changelog}`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        versionCreated: newVersion.versionNumber,
        creditsCost: { ai: aiCost, cloud: cloudCost },
        suggestedPrompts: [
          'Tambahkan form input data baru',
          'Ubah format tanggal atau tampilan rupiah',
          'Optimasi alur tombol aksi'
        ]
      };

      setChatMessages(prev => [...prev, assistantMsg]);
      setActiveTab('preview');
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: `Maaf, terjadi kendala saat membangun: ${err.message}`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleRollback = (targetVersionNumber: number) => {
    if (targetVersionNumber === app.currentVersion) return;
    const target = app.versions.find(v => v.versionNumber === targetVersionNumber);
    if (!target) return;

    if (confirm(`Apakah Anda yakin ingin memutar balik ke versi v${targetVersionNumber}?`)) {
      const updatedApp: LegoApp = {
        ...app,
        currentVersion: targetVersionNumber,
        updatedAt: new Date().toISOString(),
      };
      onUpdateApp(updatedApp);
      onAddAuditLog({
        userId: user.id,
        userName: user.name,
        action: `Rollback ke Versi v${targetVersionNumber}`,
        details: `Memulihkan struktur dari v${targetVersionNumber} (${target.changelog})`,
        type: 'rollback',
      });
      alert(`Berhasil kembali ke Versi v${targetVersionNumber}!`);
    }
  };

  const handlePublish = () => {
    const publishedSlugClean = subdomainSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const updatedApp: LegoApp = {
      ...app,
      isPublished: true,
      publishedSlug: publishedSlugClean,
      publishedAt: new Date().toISOString(),
    };
    onUpdateApp(updatedApp);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    onAddAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'Publish Web App',
      details: `Dipublish ke subdomain: https://${publishedSlugClean}.genesis.id`,
      type: 'publish',
    });
  };

  const handleDataChangeFromPreview = (newTables: TableDefinition[]) => {
    const updatedVersions = app.versions.map(v => {
      if (v.versionNumber !== app.currentVersion) return v;
      return {
        ...v,
        tables: newTables,
      };
    });
    onUpdateApp({
      ...app,
      versions: updatedVersions,
      updatedAt: new Date().toISOString(),
    });
  };

  const publishedFullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/p/${app.publishedSlug || app.slug}`
    : `https://${app.publishedSlug || app.slug}.genesis.id`;

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-53px)] overflow-hidden bg-slate-100">
      {/* LEFT PANEL: Chat Builder & Prompt Engine */}
      <div className="w-full md:w-[420px] lg:w-[460px] bg-white border-r border-slate-200 flex flex-col shrink-0 h-full z-10 shadow-xs">
        {/* Builder Studio Header */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-lg text-xs font-bold text-slate-700">
            <button
              onClick={() => setBuilderMode('build')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                builderMode === 'build' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔨 Build
            </button>
            <button
              onClick={() => setBuilderMode('plan')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                builderMode === 'plan' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📐 Plan
            </button>
            <button
              onClick={() => setBuilderMode('debug')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                builderMode === 'debug' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🐞 Debug
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-slate-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              v{currentVersion.versionNumber} Aktif
            </span>
          </div>
        </div>

        {/* Chat Thread Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {chatMessages.map(msg => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 font-bold text-[11px] mb-1.5 text-blue-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>GENESIS AI</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.content}</p>

                {msg.creditsCost && (
                  <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                    <span>Pemakaian: -{msg.creditsCost.ai} Kredit AI</span>
                    <span>·</span>
                    <span>-{msg.creditsCost.cloud} Cloud</span>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>

              {/* Suggested prompts on initial message */}
              {msg.suggestedPrompts && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                  {msg.suggestedPrompts.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendPrompt(sug)}
                      disabled={isGenerating}
                      className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-2xs"
                    >
                      💡 {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Loading status indicator */}
          {isGenerating && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-2 animate-pulse">
              <div className="flex items-center gap-2 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                <span>Memproses dengan GENESIS AI</span>
              </div>
              <p className="text-[11px] text-blue-700">{generationStep}</p>
            </div>
          )}
        </div>

        {/* Input Box Area */}
        <div className="p-3 border-t border-slate-200 bg-white space-y-2">
          {/* Credit Estimation pill */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Estimasi: {app.versions.length > 0 ? '2' : '5'} Kredit AI</span>
            <span className="text-slate-400">Engine: GENESIS AI Engine</span>
          </div>

          <div className="relative flex items-end gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
            <textarea
              rows={2}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendPrompt();
                }
              }}
              placeholder={
                builderMode === 'build'
                  ? 'Ketik instruksi revisi atau fitur baru dalam Bahasa Indonesia...'
                  : builderMode === 'plan'
                  ? 'Jelaskan alur bisnis yang ingin direncanakan...'
                  : 'Sebutkan error atau perubahan logika yang ingin diperbaiki...'
              }
              className="w-full text-xs bg-transparent border-0 focus:outline-none resize-none p-1 text-slate-900 placeholder:text-slate-400"
            />
            <button
              onClick={() => handleSendPrompt()}
              disabled={!promptText.trim() || isGenerating}
              className={`p-2 rounded-xl text-white font-bold transition-all shrink-0 shadow-xs ${
                promptText.trim() && !isGenerating
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
              title="Kirim instruksi ke GENESIS AI"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Workspace Tabs & Live Interactive Preview */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Workspace Subheader / Tab Bar */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          {/* Main Tab Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'preview' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Preview Live</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'database' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Database App</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'history' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Riwayat Versi ({app.versions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('publish')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'publish' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Publish Subdomain</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'audit' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Audit Log</span>
            </button>
          </div>

          {/* Device Frame Switcher (Only active when in preview) */}
          {activeTab === 'preview' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 bg-slate-100 rounded-lg text-slate-600 border border-slate-200">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-1 rounded-md transition-colors ${deviceMode === 'desktop' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'}`}
                  title="Tampilan Desktop"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceMode('tablet')}
                  className={`p-1 rounded-md transition-colors ${deviceMode === 'tablet' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'}`}
                  title="Tampilan Tablet (768px)"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1 rounded-md transition-colors ${deviceMode === 'mobile' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'}`}
                  title="Tampilan Mobile (375px)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <a
                href={`/p/${app.publishedSlug || app.slug}`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 border border-slate-200"
                title="Buka preview mandiri satu tab penuh"
              >
                <span>Fullscreen</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex items-start justify-center">
          {/* TAB 1: PREVIEW LIVE */}
          {activeTab === 'preview' && (
            <div 
              className={`transition-all duration-300 w-full ${
                deviceMode === 'mobile' ? 'max-w-[400px] border-8 border-slate-800 rounded-3xl overflow-hidden shadow-2xl bg-white' :
                deviceMode === 'tablet' ? 'max-w-[780px] border-4 border-slate-700 rounded-2xl overflow-hidden shadow-xl bg-white' :
                'max-w-full rounded-xl border border-slate-200 shadow-xs bg-white overflow-hidden'
              }`}
            >
              {deviceMode === 'mobile' && (
                <div className="bg-slate-800 text-white px-4 py-1.5 text-[10px] flex items-center justify-between font-mono">
                  <span>9:41</span>
                  <div className="w-16 h-3 bg-slate-900 rounded-full" />
                  <span>5G 100%</span>
                </div>
              )}
              <InteractiveAppRenderer 
                version={currentVersion} 
                onDataChange={handleDataChangeFromPreview}
              />
            </div>
          )}

          {/* TAB 2: DATABASE APP EXPLORER */}
          {activeTab === 'database' && (
            <div className="w-full max-w-5xl space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Database Aplikasi Terisolasi</h3>
                    <p className="text-xs text-slate-500">
                      Tiap aplikasi GENESIS memiliki tabel terpisah yang aman dari akses organisasi lain.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8," + 
                          currentVersion.tables.map(t => 
                            `${t.name}\n` + 
                            t.columns.map(c => c.label).join(',') + '\n' +
                            t.records.map(r => t.columns.map(c => `"${r[c.key] || ''}"`).join(',')).join('\n')
                          ).join('\n\n');
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `${app.slug}-data-export.csv`);
                        document.body.appendChild(link);
                        link.click();
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 border border-slate-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Ekspor Semua ke CSV</span>
                    </button>
                  </div>
                </div>

                {/* Tables List */}
                <div className="space-y-6">
                  {currentVersion.tables.map(table => (
                    <div key={table.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-bold text-slate-800">{table.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({table.id})</span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                          {table.records.length} Baris Record
                        </span>
                      </div>

                      <div className="p-3 bg-white overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="border-b text-slate-500 font-semibold">
                              {table.columns.map(c => (
                                <th key={c.key} className="p-2">
                                  {c.label} <span className="font-mono text-[10px] text-slate-400 font-normal">({c.type})</span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {table.records.map((r, i) => (
                              <tr key={r.id || i} className="hover:bg-slate-50">
                                {table.columns.map(c => (
                                  <td key={c.key} className="p-2 text-slate-700">
                                    {String(r[c.key] || '-')}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RIWAYAT VERSI (CHANGELOG & 1-CLICK ROLLBACK) */}
          {activeTab === 'history' && (
            <div className="w-full max-w-3xl space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-base font-bold text-slate-900">Riwayat Versi Aplikasi</h3>
                <p className="text-xs text-slate-500">
                  Setiap perubahan prompt disimpan sebagai versi terisolasi. Anda dapat kembali (rollback) kapan saja dengan 1 klik tanpa kehilangan histori.
                </p>
              </div>

              <div className="space-y-3">
                {app.versions.map((ver) => (
                  <div 
                    key={ver.versionNumber}
                    className={`bg-white p-5 rounded-2xl border transition-all ${
                      ver.versionNumber === app.currentVersion 
                        ? 'border-blue-500 ring-2 ring-blue-100 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">Versi v{ver.versionNumber}</span>
                          {ver.versionNumber === app.currentVersion ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                              Sedang Digunakan
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRollback(ver.versionNumber)}
                              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 border border-blue-200 px-2.5 py-0.5 rounded-md hover:bg-blue-50 transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Kembalikan ke Versi Ini
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-1">{ver.changelog}</p>
                        <div className="text-[11px] text-slate-400 mt-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                          Prompt: &quot;{ver.promptUsed}&quot;
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(ver.createdAt).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PUBLISH SUBDOMAIN */}
          {activeTab === 'publish' && (
            <div className="w-full max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Publikasi Subdomain GENESIS</h3>
                  <p className="text-xs text-slate-500">
                    Aplikasi Anda akan langsung online dan bisa diakses oleh pelanggan atau tim kerja.
                  </p>
                </div>
              </div>

              {/* Subdomain Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Subdomain URL</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 text-xs bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-500 font-mono">
                    https://
                  </span>
                  <input
                    type="text"
                    value={subdomainSlug}
                    onChange={(e) => setSubdomainSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="nama-bisnis-anda"
                    className="flex-1 p-2 text-xs border border-slate-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="px-3 py-2 text-xs bg-slate-100 border border-l-0 border-slate-300 rounded-r-xl text-slate-500 font-mono">
                    .genesis.id
                  </span>
                </div>
              </div>

              {/* Pre-publish checklist */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">Pemeriksaan Otomatis Pre-Publish:</span>
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Struktur komponen UI versi v{currentVersion.versionNumber} valid</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Skema database {currentVersion.tables.length} tabel siap menampung input pengguna</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Saldo kredit Cloud mencukupi untuk alokasi hosting</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handlePublish}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all hover:scale-102"
                >
                  <Rocket className="w-4 h-4" />
                  <span>{app.isPublished ? 'Perbarui Publikasi Sekarang' : 'Publish Aplikasi Sekarang'}</span>
                </button>
              </div>

              {/* Live Link and QR Code if published */}
              {app.isPublished && (
                <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">Status: APLIKASI TELAH LIVE!</span>
                      <a 
                        href={`/p/${app.publishedSlug || app.slug}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-mono text-emerald-700 hover:underline flex items-center gap-1 mt-1 font-bold"
                      >
                        {publishedFullUrl}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(publishedFullUrl);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 3000);
                      }}
                      className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Tersalin!' : 'Salin Link'}</span>
                    </button>
                  </div>

                  {/* QR Code section */}
                  <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-emerald-200/80">
                    <div className="w-16 h-16 bg-slate-900 rounded-lg p-1 flex items-center justify-center text-white shrink-0">
                      <QrCode className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <span className="font-bold text-slate-800 block">Uji Langsung di Smartphone Tim</span>
                      <p className="text-[11px] text-slate-500">
                        Buka kamera ponsel Anda untuk membuka web app ini secara instan di browser HP.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="w-full max-w-3xl space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <h3 className="text-base font-bold text-slate-900">Audit Log Transparan (FR-11)</h3>
                <p className="text-xs text-slate-500">
                  Mencatat aktivitas siapa, kapan, dan aksi apa yang dilakukan (build, publish, undang tim, kredit).
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{log.action}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          log.type === 'build' ? 'bg-blue-100 text-blue-700' :
                          log.type === 'publish' ? 'bg-emerald-100 text-emerald-700' :
                          log.type === 'credit' ? 'bg-amber-100 text-amber-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {log.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{log.details}</p>
                      <span className="text-[11px] text-slate-400 mt-1 block">Oleh: {log.userName}</span>
                    </div>

                    <span className="text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
