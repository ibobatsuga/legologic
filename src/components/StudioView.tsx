'use client';

import React, { useState, useEffect } from 'react';
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
  LayoutGrid, Rocket, QrCode, ArrowRight, Layers, ArrowUpRight
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
  onNavigateToTab?: (tab: string) => void;
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
  onNavigateToTab,
}: StudioViewProps) {
  // Right pane tab: 'preview' vs 'code'
  const [rightTab, setRightTab] = useState<'preview' | 'code'>('preview');
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  // Middle pane prompt & generation
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [isThinkingOpen, setIsThinkingOpen] = useState(true);
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Check if project is in blank/clean state (No versions or versionNumber === 0)
  const isCleanBlank = !app.versions || app.versions.length === 0 || app.currentVersion === 0;

  // Interactive checklist tasks
  const [checklistTasks, setChecklistTasks] = useState([
    { id: 't1', text: 'Buka template di Library atau ketik instruksi baru', done: false },
    { id: 't2', text: 'AI merancang komponen antarmuka & database', done: false },
    { id: 't3', text: 'Preview dan kode siap digunakan', done: false },
  ]);

  useEffect(() => {
    if (isCleanBlank) {
      setChecklistTasks([
        { id: 't1', text: 'Buka template di Library atau ketik instruksi baru', done: false },
        { id: 't2', text: 'AI merancang komponen antarmuka & database', done: false },
        { id: 't3', text: 'Preview dan kode siap digunakan', done: false },
      ]);
    } else {
      setChecklistTasks([
        { id: 't1', text: `Memuat struktur modul: ${app.name}`, done: true },
        { id: 't2', text: 'Tabel database & formulir input aktif', done: true },
        { id: 't3', text: 'Preview interaktif & kode siap dikustomisasi', done: true },
      ]);
    }
  }, [app.id, isCleanBlank, app.name]);

  const currentVersion: AppVersion | undefined = isCleanBlank 
    ? undefined 
    : (app.versions.find(v => v.versionNumber === app.currentVersion) || app.versions[app.versions.length - 1]);

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

    setIsGenerating(true);
    setGenerationStep('Menghubungi Claude Sonnet 4.6 via Sakelar AI...');

    try {
      if (isCleanBlank) {
        // Generating initial app v1 from blank
        setTimeout(() => setGenerationStep('Menganalisis kebutuhan & merancang skema database...'), 1200);
        setTimeout(() => setGenerationStep('Menyusun arsitektur komponen & antarmuka interaktif...'), 2400);

        const res = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: text,
            mode: 'build',
            wallet,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Gagal generate aplikasi');
        }

        const generatedApp: LegoApp = data.app;
        const nextWallet: CreditWallet = {
          ...wallet,
          aiCredits: Math.max(0, wallet.aiCredits - 2),
          aiUsedThisMonth: wallet.aiUsedThisMonth + 2,
          cloudCredits: Math.max(0, wallet.cloudCredits - 1),
        };

        onUpdateApp(generatedApp);
        onUpdateWallet(nextWallet);
      } else {
        // Revising existing app
        setTimeout(() => setGenerationStep('Menganalisis pembaruan fitur & tata letak...'), 1200);
        setTimeout(() => setGenerationStep('Menyusun versi v' + ((currentVersion?.versionNumber || 1) + 1) + '...'), 2400);

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
      }

      setPromptInput('');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handlePublish = () => {
    if (isCleanBlank) {
      alert('Aplikasi masih kosong. Silakan buka template atau generate aplikasi terlebih dahulu.');
      return;
    }

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
    if (isCleanBlank) return;
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

  return (
    <main className="flex-1 flex flex-col md:flex-row h-screen overflow-hidden bg-white">
      {/* MIDDLE COLUMN: Chat, Thinking & Specification (Image 1 & 3 left) */}
      <div className="w-full md:w-[420px] lg:w-[460px] border-r border-slate-200/80 flex flex-col shrink-0 h-full bg-white select-none transition-all duration-200">
        {/* Top Header Bar */}
        <div className="p-3.5 px-5 border-b border-slate-200/70 flex items-center justify-between gap-2 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              {app.name}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {isCleanBlank ? 'Project Baru' : `v${currentVersion?.versionNumber}`}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              Menu 2 Studio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-slate-400 hidden sm:inline">claude-sonnet-4.6</span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 text-slate-800 text-xs leading-relaxed">
          {/* Thinking Disclosure */}
          <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-slate-50/50">
            <button
              onClick={() => setIsThinkingOpen(!isThinkingOpen)}
              className="w-full p-2.5 px-3 flex items-center justify-between text-slate-600 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2 font-medium text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {isCleanBlank ? 'Status: Siap Menerima Instruksi' : 'Thinking trace (Sakelar AI)'}
                </span>
              </div>
              {isThinkingOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isThinkingOpen && (
              <div className="p-3 pt-0 text-[11px] text-slate-600 font-mono space-y-1.5 border-t border-slate-200/50">
                {isCleanBlank ? (
                  <div className="py-1 text-slate-500">
                    Kanvas project baru masih bersih. Buka template di Library atau ketik instruksi di prompt bar bawah.
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">📄</span>
                      <span>Menyiapkan modul arsitektur dan skema database untuk <strong className="text-slate-800">{app.name}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">🔍</span>
                      <span>Format mata uang Rupiah (Rp) dan aksi interaktif tersambung</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">🖼️</span>
                      <span>Preview interaktif siap diuji langsung</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Specification Scope */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              {isCleanBlank ? 'Project Baru' : app.name}
            </h3>
            <p className="text-slate-600 leading-normal">
              {isCleanBlank 
                ? 'Kanvas ini bersih dari kode awal. Anda dapat memilih template siap-pakai di Library atau mengetik instruksi di bawah untuk membuat aplikasi baru.'
                : (currentVersion?.changelog || app.description)}
            </p>
          </div>

          {/* Progress Checklist Card */}
          {isChecklistOpen && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                  <span className="text-blue-600">≡</span>
                  <span>{doneCount}/{checklistTasks.length} status</span>
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

        {/* Bottom Floating Prompt Card */}
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
              placeholder={isCleanBlank ? "Ketik instruksi aplikasi baru di sini..." : "Ketik instruksi revisi dalam Bahasa Indonesia..."}
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
              </div>

              <div className="flex items-center gap-2">
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

      {/* RIGHT COLUMN: Preview & Code Canvas */}
      <div className="flex-1 flex flex-col h-full bg-[#f8f9fa] overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-3 px-6 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 bg-white">
          {/* Segmented Toggle: Preview / Code */}
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
            {rightTab === 'preview' && !isCleanBlank && (
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-600 mr-2">
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1 rounded-md transition-colors ${deviceMode === 'mobile' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'}`}
                  title="Mobile View (390px)"
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

            {!isCleanBlank && (
              <>
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
              </>
            )}

            <button
              onClick={handlePublish}
              disabled={isCleanBlank}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 ${
                isCleanBlank 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-102'
              }`}
            >
              <span>Publish</span>
            </button>
          </div>
        </div>

        {/* Canvas Area with Dot-Grid Background */}
        <div className="flex-1 p-4 md:p-6 flex items-center justify-center overflow-auto dot-grid">
          {rightTab === 'preview' ? (
            /* PREVIEW TAB */
            isCleanBlank ? (
              /* Ultra-clean Blank Canvas State (Only shows preview if template is opened!) */
              <div className="w-full h-full max-w-md mx-auto flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-400">
                  <LayoutGrid className="w-6 h-6 text-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900">
                    Kanvas Bersih (Project Baru)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Belum ada tampilan yang dimuat. Preview aplikasi hanya akan muncul jika Anda membuka template dari Library atau membuat aplikasi baru via Chat.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onNavigateToTab?.('library')}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Buka Library Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigateToTab?.('chat')}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors"
                  >
                    <span>Mulai di Chat</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Active App Rendered Inside Device Frame (ONLY WHEN TEMPLATE / GENERATED APP IS LOADED) */
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
                    version={currentVersion!} 
                    onDataChange={handleDataChangeFromPreview}
                  />
                </div>
              </div>
            )
          ) : (
            /* CODE TAB */
            <div className="w-full h-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-3 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 text-xs">
                <span className="font-mono text-slate-600 font-semibold">{app.slug}.tsx</span>
                {!isCleanBlank && (
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
                )}
              </div>

              {/* Code viewer: Completely clean if Project Baru! */}
              {isCleanBlank ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 font-mono text-xs space-y-1 select-none">
                  <p>// Project Baru</p>
                  <p>// Belum ada kode yang dimuat.</p>
                </div>
              ) : (
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
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
