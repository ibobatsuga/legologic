'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { LegoApp, AppVersion } from '@/types/legologic';
import { generateAppSourceCode } from '@/lib/code-generator';
import { 
  X, Download, Cloud, Rocket, Check, Copy, ExternalLink, 
  Terminal, ShieldCheck, ArrowRight, Sparkles, ChevronDown, 
  ChevronUp, Server, FileCode, CheckCircle2
} from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: LegoApp;
  onPublishSuccess: (updatedApp: LegoApp) => void;
}

export function DeployModal({
  isOpen,
  onClose,
  app,
  onPublishSuccess,
}: DeployModalProps) {
  const [selectedOption, setSelectedOption] = useState<'download' | 'cloud'>('cloud');
  const [isDeploying, setIsDeploying] = useState(false);
  const [isCloudLive, setIsCloudLive] = useState(app.isPublished);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGuide, setCopiedGuide] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  if (!isOpen) return null;

  const currentVersion: AppVersion | undefined = 
    app.versions?.[app.versions.length - 1];

  const sourceCode = generateAppSourceCode(currentVersion);
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${app.publishedSlug || app.slug}`;

  // Handle downloading source code file
  const handleDownloadCode = () => {
    const blob = new Blob([sourceCode], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${app.slug || 'app'}.tsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle deploying to GENESIS Cloud
  const handleDeployToGenesis = () => {
    setIsDeploying(true);
    setTimeout(() => {
      const updatedApp: LegoApp = {
        ...app,
        isPublished: true,
        publishedSlug: app.publishedSlug || app.slug,
        publishedAt: new Date().toISOString(),
      };
      onPublishSuccess(updatedApp);
      setIsDeploying(false);
      setIsCloudLive(true);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 1200);
  };

  const selfHostGuideText = `# Panduan Deploy Mandiri Aplikasi ${app.name}

1. Siapkan project Next.js baru:
   npx create-next-app@latest my-app --typescript --tailwind --app

2. Pasang library dependensi:
   npm install lucide-react canvas-confetti

3. Simpan file kode aplikasi:
   Salin isi file ${app.slug}.tsx ke dalam folder:
   src/app/page.tsx

4. Jalankan aplikasi secara lokal:
   npm run dev

5. Deploy mandiri ke hosting gratis pilihan Anda:
   - Vercel: npx vercel
   - Netlify: npx netlify deploy
   - Cloudflare Pages: npx wrangler pages deploy`;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-blue-600" />
              <span>Aplikasi Anda Siap Digunakan!</span>
            </h2>
            <p className="text-xs text-slate-500">
              Pilih bagaimana Anda ingin menjalankan aplikasi <strong>{app.name}</strong>:
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* THE 2 CHOICES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* OPTION 1: UNDUH KODE & URUS SENDIRI */}
            <div
              onClick={() => setSelectedOption('download')}
              className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                selectedOption === 'download'
                  ? 'border-blue-600 bg-blue-50/30 shadow-xs'
                  : 'border-slate-200/90 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Bebas Biaya Bulanan
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    1. Unduh Source Code
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Bawa pulang kode aplikasi dan urus hosting sendiri. Tidak ada biaya langganan bulanan ke GENESIS.
                  </p>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>File kode Next.js + Tailwind lengkap</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Deploy mandiri di Vercel / VPS Anda</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% hak milik kode tanpa lock-in</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-bold text-slate-700 pt-1">
                Biaya Hosting GENESIS: <span className="text-emerald-700">Rp 0 (Gratis)</span>
              </div>
            </div>

            {/* OPTION 2: HOSTING CLOUD GENESIS */}
            <div
              onClick={() => setSelectedOption('cloud')}
              className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                selectedOption === 'cloud'
                  ? 'border-blue-600 bg-blue-50/30 shadow-xs'
                  : 'border-slate-200/90 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    Praktis Langsung Live
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    2. Layanan Cloud GENESIS
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    GENESIS mengurus seluruh infrastruktur hosting, database, dan SSL. Langsung live seketika.
                  </p>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    <span>Langsung aktif di URL web publik</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    <span>Database cloud terkelola & auto-backup</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    <span>Auto-SSL HTTPS & garansi uptime</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-bold text-slate-700 pt-1">
                Biaya Hosting Bulanan: <span className="text-blue-700">Rp 99.000 / bln</span>
              </div>
            </div>
          </div>

          {/* ACTIVE OPTION ACTION SECTION */}
          {selectedOption === 'download' ? (
            /* DOWNLOAD CODE DETAILS */
            <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-slate-600" />
                    <span>Berkas Siap Unduh: {app.slug}.tsx</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Termasuk definisi skema database, antarmuka visual, dan komponen interaktif.
                  </p>
                </div>

                <button
                  onClick={handleDownloadCode}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Source Code (.tsx)</span>
                </button>
              </div>

              {/* Accordion: Panduan Deploy Mandiri */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={() => setShowGuide(!showGuide)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    <span>Lihat Panduan Deploy Mandiri (Vercel / VPS)</span>
                  </span>
                  {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showGuide && (
                  <div className="mt-3 p-3.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] leading-relaxed relative">
                    <pre className="overflow-x-auto whitespace-pre-wrap">{selfHostGuideText}</pre>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selfHostGuideText);
                        setCopiedGuide(true);
                        setTimeout(() => setCopiedGuide(false), 2000);
                      }}
                      className="absolute top-3 right-3 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] flex items-center gap-1 font-sans"
                    >
                      {copiedGuide ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedGuide ? 'Tersalin' : 'Salin Panduan'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* CLOUD HOSTING DETAILS */
            <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-blue-600" />
                    <span>Layanan Cloud Managed GENESIS</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Aplikasi di-deploy dan dijalankan 24/7 di cloud server GENESIS dengan database aktif.
                  </p>
                </div>

                {!isCloudLive ? (
                  <button
                    onClick={handleDeployToGenesis}
                    disabled={isDeploying}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                  >
                    {isDeploying ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Sedang Men-deploy...</span>
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4" />
                        <span>Deploy Langsung Live</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Aplikasi Sedang Live
                  </span>
                )}
              </div>

              {/* Live URL Box if Live */}
              {isCloudLive && (
                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-500 font-medium">Link Publik Aplikasi Anda:</span>
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                      <span className="font-mono text-slate-800 truncate pr-2">{publicUrl}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(publicUrl);
                            setCopiedLink(true);
                            setTimeout(() => setCopiedLink(false), 2000);
                          }}
                          className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1 text-[11px] font-semibold"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
                        </button>
                        <a
                          href={`/p/${app.publishedSlug || app.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 text-[11px] font-bold shadow-2xs"
                        >
                          <span>Buka</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Tagihan Hosting: <strong>Rp 99.000 / bulan</strong></span>
                    <span className="text-emerald-700 font-semibold">Bulan ke-1 sudah aktif</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Garansi 100% Kode Milik Anda · Tanpa Vendor Lock-in</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
