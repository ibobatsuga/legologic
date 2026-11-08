'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  LegoApp, AppVersion, CreditWallet, User, Organization, TableDefinition 
} from '@/types/legologic';
import { InteractiveAppRenderer } from '@/components/InteractiveAppRenderer';
import { generateAppSourceCode } from '@/lib/code-generator';
import { 
  Send, Sparkles, Eye, Code2, ArrowUp, Plus, Paperclip, 
  Wand2, ExternalLink, Copy, Check, ChevronDown, 
  ChevronUp, CheckCircle2, Circle, X, Smartphone, Tablet, Monitor,
  LayoutGrid, Rocket, QrCode, ArrowRight, Layers
} from 'lucide-react';

function FigmaIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/>
      <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/>
      <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/>
      <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/>
      <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/>
    </svg>
  );
}

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  );
}

interface StudioViewProps {
  app: LegoApp;
  allApps: LegoApp[];
  wallet: CreditWallet;
  user: User;
  organization: Organization;
  activeNavTab?: string;
  onUpdateApp: (app: LegoApp) => void;
  onUpdateWallet: (wallet: CreditWallet) => void;
  onSelectApp: (appId: string) => void;
  onOpenBilling: () => void;
  isHomeState: boolean;
  onExitHomeState: () => void;
}

export function StudioView({
  app,
  allApps,
  wallet,
  user,
  organization,
  activeNavTab = 'studio',
  onUpdateApp,
  onUpdateWallet,
  onSelectApp,
  onOpenBilling,
  isHomeState,
  onExitHomeState,
}: StudioViewProps) {
  // Right pane tab: 'preview' vs 'code'
  const [rightTab, setRightTab] = useState<'preview' | 'code'>('preview');
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  
  // Middle pane prompt & generation
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [isThinkingOpen, setIsThinkingOpen] = useState(true);
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Interactive checklist tasks
  const [checklistTasks, setChecklistTasks] = useState([
    { id: 't1', text: 'Build pipeline kanban stages & consent tracking', done: true },
    { id: 't2', text: 'Configure Rupiah currency & lead contact fields', done: true },
    { id: 't3', text: 'Wire up WhatsApp click-to-chat action', done: true },
    { id: 't4', text: 'Connect live database table & persist record updates', done: false },
  ]);

  const currentVersion: AppVersion = 
    app.versions.find(v => v.versionNumber === app.currentVersion) || app.versions[app.versions.length - 1];

  const sourceCode = generateAppSourceCode(currentVersion);
  const codeLines = sourceCode.split('\n');

  const doneCount = checklistTasks.filter(t => t.done).length;

  const toggleTask = (id: string) => {
    setChecklistTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleSendPrompt = async (presetText?: string) => {
    const text = (presetText || promptInput).trim();
    if (!text || isGenerating) return;

    if (wallet.aiCredits < 2) {
      alert(`Saldo Kredit AI tidak mencukupi (butuh minimal 2 kredit). Silakan top up.`);
      onOpenBilling();
      return;
    }

    if (isHomeState) {
      onExitHomeState();
    }

    setIsGenerating(true);
    setGenerationStep('Menghubungi Claude Sonnet 4.6 via Sakelar AI...');

    try {
      setTimeout(() => setGenerationStep('Menganalisis skema data & arsitektur komponen...'), 1200);
      setTimeout(() => setGenerationStep('Menyusun pembaruan versi v' + (currentVersion.versionNumber + 1) + '...'), 2400);

      const res = await fetch('/api/ai/revise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          mode: 'build',
          existingVersion: currentVersion,
          wallet,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses revisi');
      }

      const newVer: AppVersion = data.version;
      const updatedVersions = [...app.versions, newVer];
      const updatedApp: LegoApp = {
        ...app,
        currentVersion: newVer.versionNumber,
        versions: updatedVersions,
        updatedAt: new Date().toISOString(),
      };

      const nextWallet: CreditWallet = {
        ...wallet,
        aiCredits: Math.max(0, wallet.aiCredits - 2),
        aiUsedThisMonth: wallet.aiUsedThisMonth + 2,
        cloudCredits: Math.max(0, wallet.cloudCredits - 1),
      };

      onUpdateApp(updatedApp);
      onUpdateWallet(nextWallet);

      // Add task to checklist
      setChecklistTasks(prev => [
        ...prev.map(t => ({ ...t, done: true })),
        { id: 't-' + Date.now(), text: `Implementasi: ${text.substring(0, 45)}`, done: true }
      ]);

      setPromptInput('');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handlePublish = () => {
    const updatedApp: LegoApp = {
      ...app,
      isPublished: true,
      publishedSlug: app.publishedSlug || app.slug,
      publishedAt: new Date().toISOString(),
    };
    onUpdateApp(updatedApp);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const fullUrl = `${window.location.origin}/p/${app.publishedSlug || app.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleDataChangeFromPreview = (newTables: TableDefinition[]) => {
    const updatedVersions = app.versions.map(v => {
      if (v.versionNumber !== app.currentVersion) return v;
      return { ...v, tables: newTables };
    });
    onUpdateApp({
      ...app,
      versions: updatedVersions,
      updatedAt: new Date().toISOString(),
    });
  };

  // HOME / NEW BUILD STATE (Image 2)
  if (isHomeState) {
    return (
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fafafa] dot-grid">
        {/* Top Header */}
        <header className="p-4 px-6 border-b border-slate-200/60 flex items-center justify-between bg-white/70 backdrop-blur-xs">
          <span className="text-sm font-semibold text-slate-700">Untitled</span>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Sakelar AI · claude-sonnet-4.6</span>
          </div>
        </header>

        {/* Center Hero Prompt Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full space-y-10 my-auto">
          {/* Large Prompt Card */}
          <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-lg p-5 space-y-4">
            <textarea
              rows={3}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendPrompt();
                }
              }}
              placeholder="Build me an app... (Contoh: Aplikasi CRM lead WhatsApp consent-first dengan pipeline visual deal)"
              className="w-full text-sm bg-transparent border-0 focus:outline-none resize-none text-slate-900 placeholder:text-slate-400 font-normal leading-relaxed"
            />

            {/* Sub-toolbar inside card */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Tambah Konteks"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Lampirkan File"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  onClick={() => setPromptInput('Buatkan aplikasi CRM B2B untuk UMKM dengan pipeline stages deals, kontak WhatsApp, estimasi nilai transaksi dalam Rupiah, dan verifikasi izin outreach.')}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 font-medium border border-slate-200/60 transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Improve prompt</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 pr-2 border-r border-slate-200">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Connect apps</span>
                  <div className="flex items-center gap-1 ml-1 text-slate-600">
                    <FigmaIcon className="w-3.5 h-3.5" />
                    <GithubIcon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <button
                  onClick={() => handleSendPrompt()}
                  disabled={!promptInput.trim() || isGenerating}
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white transition-all shadow-xs ${
                    promptInput.trim() && !isGenerating 
                      ? 'bg-slate-900 hover:bg-black active:scale-95' 
                      : 'bg-slate-200 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Category Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'Build App', prompt: 'Buatkan aplikasi manajemen inventori stok barang UMKM' },
              { label: 'Website design', prompt: 'Buatkan landing page & form order produk digital' },
              { label: 'Presentation', prompt: 'Buatkan portal proposal presentasi pitch deck klien' },
              { label: 'Code', prompt: 'Buatkan REST API & CRUD tables generator' },
            ].map(cat => (
              <button
                key={cat.label}
                onClick={() => {
                  setPromptInput(cat.prompt);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Templates Section (Image 2) */}
          <div className="w-full space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Templates</h3>
              <button 
                onClick={onExitHomeState}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                View all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allApps.map((templateApp, idx) => (
                <div
                  key={templateApp.id}
                  onClick={() => {
                    onSelectApp(templateApp.id);
                    onExitHomeState();
                  }}
                  className="group cursor-pointer bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 p-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  {/* Mockup Preview Visual */}
                  <div className="h-32 rounded-xl bg-linear-to-b from-slate-100 to-slate-50 border border-slate-200/60 p-2 flex flex-col justify-between overflow-hidden relative group-hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-[9px] font-mono font-bold text-slate-400">v{templateApp.currentVersion}</span>
                    </div>
                    <div className="space-y-1 text-center py-2">
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">{templateApp.name}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-2">{templateApp.description}</div>
                    </div>
                    <div className="flex justify-center gap-1">
                      <span className="h-1 w-6 rounded-full bg-slate-300" />
                      <span className="h-1 w-3 rounded-full bg-blue-400" />
                    </div>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {templateApp.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[9px] flex items-center justify-center">
                        {idx === 0 ? 'B' : idx === 1 ? 'D' : 'A'}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {idx === 0 ? 'Om Bobi' : idx === 1 ? 'Dian Creative' : 'Ahmad Sales'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ACTIVE STUDIO VIEW (Image 1 & Image 3)
  return (
    <main className="flex-1 flex flex-col md:flex-row h-screen overflow-hidden bg-white">
      {/* MIDDLE COLUMN: Chat, Thinking & Specification (Image 1 & 3 left) */}
      <div className={`border-r border-slate-200/80 flex flex-col shrink-0 h-full bg-white select-none transition-all duration-200 ${
        activeNavTab === 'chat' 
          ? 'w-full md:w-[580px] lg:w-[640px]' 
          : 'w-full md:w-[460px] lg:w-[500px]'
      }`}>
        {/* Top Header Bar */}
        <div className="p-3.5 px-5 border-b border-slate-200/70 flex items-center justify-between gap-2 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              {app.name}..
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              v{currentVersion.versionNumber}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {activeNavTab === 'chat' ? '💬 Chat' : '🖥️ Studio'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-slate-400 hidden sm:inline">claude-sonnet-4.6</span>
            <button 
              onClick={() => onExitHomeState()}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
              title="Ganti Layout / Kembali"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 text-slate-800 text-xs leading-relaxed">
          {/* Thinking 4 sec Disclosure (Image 1) */}
          <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-slate-50/50">
            <button
              onClick={() => setIsThinkingOpen(!isThinkingOpen)}
              className="w-full p-2.5 px-3 flex items-center justify-between text-slate-600 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2 font-medium text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Thinking 4 sec</span>
              </div>
              {isThinkingOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isThinkingOpen && (
              <div className="p-3 pt-0 text-[11px] text-slate-600 font-mono space-y-1.5 border-t border-slate-200/50">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">📄</span>
                  <span>Checked <strong className="text-slate-800">design-system.json</strong> for existing tokens</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">🔍</span>
                  <span>Called <strong className="text-slate-800">component.search(&quot;pipeline&quot;, &quot;leads&quot;)</strong> - 3 matches found</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">🖼️</span>
                  <span>Fetched icon set from Lucide, filtered to native-weight variants</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">⚙️</span>
                  <span>Resolved Layout grid - 16px margins, 12px gutter, native spacing</span>
                </div>
              </div>
            )}
          </div>

          {/* Defining the Initial Scope (Image 1 text) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Defining the Initial Scope</h3>
            <p className="text-slate-600 leading-normal">
              {currentVersion.changelog || `I'm starting with the core workflow for ${app.name}. Structuring it around interactive pipeline cards, Rupiah metrics, and verified WhatsApp consent, following native mobile & desktop conventions.`}
            </p>

            <div>
              <h4 className="font-bold text-slate-900 mb-1.5">First Version Features:</h4>
              <ul className="space-y-1.5 text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400">•</span>
                  <span>Visual pipeline & Kanban stages with deal value in IDR (Rp)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400">•</span>
                  <span>Database leads with WhatsApp click-to-chat & consent tracking</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400">•</span>
                  <span>Summary KPI stats row (Total Prospek, Deal Aktif, Omset Pipeline)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400">•</span>
                  <span>Tap-to-expand details with instant form data insertion</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400">•</span>
                  <span>Responsive layout for mobile, tablet, and desktop</span>
                </li>
              </ul>
            </div>

            <p className="text-slate-500 font-medium pt-1">Let&apos;s implement this design:</p>
          </div>

          {/* Progress Checklist Card (Image 1: 2/4 done) */}
          {isChecklistOpen && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                  <span className="text-blue-600">≡</span>
                  <span>{doneCount}/{checklistTasks.length} done</span>
                </div>
                <button 
                  onClick={() => setIsChecklistOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {checklistTasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="w-full flex items-start gap-2.5 text-left text-xs transition-colors hover:text-slate-900"
                  >
                    {task.done ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 fill-blue-50" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <span className={task.done ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                      {task.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading status */}
          {isGenerating && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1.5 animate-pulse">
              <div className="flex items-center gap-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>Claude Sonnet 4.6 sedang memproses</span>
              </div>
              <p className="text-[11px] text-blue-700">{generationStep}</p>
            </div>
          )}
        </div>

        {/* Bottom Floating Prompt Card (Image 1 & 3 bottom) */}
        <div className="p-3.5 border-t border-slate-200/80 bg-white">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3 space-y-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <textarea
              rows={2}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendPrompt();
                }
              }}
              placeholder="Build me an app... (Ketik instruksi revisi dalam Bahasa Indonesia)"
              className="w-full text-xs bg-transparent border-0 focus:outline-none resize-none text-slate-900 placeholder:text-slate-400 font-normal leading-relaxed"
            />

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5">
                <button 
                  type="button"
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                  title="Tambah Context"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button"
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                  title="Lampirkan File"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button"
                  onClick={() => setPromptInput('Tambahkan kolom WhatsApp dan tombol follow-up di tabel prospek.')}
                  className="px-2 py-0.5 text-[10px] text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-md flex items-center gap-1 border border-slate-200"
                >
                  <Wand2 className="w-3 h-3 text-amber-500" />
                  <span>Improve prompt</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-slate-400">
                  <FigmaIcon className="w-3.5 h-3.5" />
                  <GithubIcon className="w-3.5 h-3.5" />
                </div>

                <button
                  onClick={() => handleSendPrompt()}
                  disabled={!promptInput.trim() || isGenerating}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-white transition-all shadow-xs ${
                    promptInput.trim() && !isGenerating 
                      ? 'bg-slate-900 hover:bg-black active:scale-95' 
                      : 'bg-slate-200 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Preview & Code Canvas (Image 1 & Image 3) */}
      <div className="flex-1 flex flex-col h-full bg-[#f8f9fa] overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-3 px-6 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 bg-white">
          {/* Segmented Toggle: Preview / Code (Image 1 & 3) */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold">
            <button
              onClick={() => setRightTab('preview')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                rightTab === 'preview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setRightTab('code')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                rightTab === 'code'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>&lt;&gt; Code</span>
            </button>
          </div>

          {/* Actions & Publish Button */}
          <div className="flex items-center gap-2">
            {rightTab === 'preview' && (
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-600 mr-2">
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1 rounded-md transition-colors ${deviceMode === 'mobile' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'}`}
                  title="Mobile View (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode('tablet')}
                  className={`p-1 rounded-md transition-colors ${deviceMode === 'tablet' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'}`}
                  title="Tablet View (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-1 rounded-md transition-colors ${deviceMode === 'desktop' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'}`}
                  title="Desktop View (Full)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => {
                const url = `${window.location.origin}/p/${app.publishedSlug || app.slug}`;
                navigator.clipboard.writeText(url);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 3000);
              }}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Salin Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <a
              href={`/p/${app.publishedSlug || app.slug}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Buka di Tab Baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={handlePublish}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-102 flex items-center gap-1.5"
            >
              <span>Publish</span>
            </button>
          </div>
        </div>

        {/* Canvas Area with Dot-Grid Background (Image 1 & Image 3) */}
        <div className="flex-1 p-6 flex items-center justify-center overflow-auto dot-grid">
          {rightTab === 'preview' ? (
            /* PREVIEW TAB (Image 1) */
            <div 
              className={`transition-all duration-300 w-full ${
                deviceMode === 'mobile' ? 'max-w-[390px] border-8 border-slate-900 rounded-[44px] overflow-hidden shadow-2xl bg-white ring-1 ring-slate-900/10' :
                deviceMode === 'tablet' ? 'max-w-[760px] border-6 border-slate-800 rounded-3xl overflow-hidden shadow-xl bg-white' :
                'max-w-full rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden'
              }`}
            >
              {deviceMode === 'mobile' && (
                <div className="bg-white text-slate-900 px-6 pt-3 pb-1 text-[11px] flex items-center justify-between font-semibold border-b border-slate-100">
                  <span>9:41</span>
                  {/* Dynamic Island / Speaker */}
                  <div className="w-20 h-4 bg-slate-900 rounded-full" />
                  <div className="flex items-center gap-1 text-[10px]">
                    <span>5G</span>
                    <div className="w-4 h-2.5 border border-slate-800 rounded-xs p-0.5 flex items-center">
                      <div className="w-full h-full bg-slate-800" />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="max-h-[760px] overflow-y-auto">
                <InteractiveAppRenderer 
                  version={currentVersion} 
                  onDataChange={handleDataChangeFromPreview}
                />
              </div>
            </div>
          ) : (
            /* CODE TAB (Image 3) */
            <div className="w-full h-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-3 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 text-xs">
                <span className="font-mono text-slate-600 font-semibold">{app.slug}.tsx</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sourceCode);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 3000);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1 shadow-2xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Tersalin' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Code viewer with line numbers */}
              <div className="flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed flex text-slate-800">
                <div className="text-slate-300 pr-4 select-none text-right shrink-0 border-r border-slate-100">
                  {codeLines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <pre className="pl-4 overflow-x-auto text-slate-700">
                  <code>{sourceCode}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
