'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Plus, Paperclip, Wand2, ArrowUp, 
  ExternalLink, ArrowRight, Layers, Bot, User as UserIcon,
  CheckCircle2, Clock, Terminal, Rocket, FileText, HelpCircle,
  ListChecks, ChevronRight, Palette
} from 'lucide-react';
import { LegoApp, CreditWallet, User, PRDDocument } from '@/types/legologic';
import { analyzePromptCompleteness, generateFullPRD, convertPRDToLegoApp } from '@/lib/prd-engine';
import { PRDViewerCard } from '@/components/PRDViewerCard';

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

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  stage?: 'interview' | 'prd_review' | 'production';
  interviewProgress?: number;
  quickReplies?: string[];
  prd?: PRDDocument;
  generatedApp?: LegoApp;
  thinkingTrace?: string;
}

interface ChatViewProps {
  wallet: CreditWallet;
  user: User;
  onOpenInStudio: (app: LegoApp) => void;
  onOpenBilling: () => void;
  onOpenGallery?: () => void;
}

export function ChatView({
  wallet,
  user,
  onOpenInStudio,
  onOpenBilling,
  onOpenGallery,
}: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Halo Om Bobi! Saya asisten GENESIS AI. Untuk memastikan aplikasi yang kita bangun tepat guna dan tidak meleset dari kebutuhan bisnis Anda, kita akan melalui 3 alur kerja terstruktur:\n\n1. **Wawancara Pengguna** (menggali persona, tujuan, dan aturan bisnis)\n2. **Penyusunan PRD Resmi** (10 poin spesifikasi teknis lengkap)\n3. **Masuk ke Produksi** (generate aplikasi live di Studio)\n\nSilakan ceritakan ide aplikasi yang ingin Anda buat hari ini.',
      timestamp: '10:00',
      quickReplies: [
        'Web Radio Streaming & Audio Player',
        'Website Berita & Media Online',
        'Web Sistem Informasi Akademik (SIAKAD)',
        'Portal PPDB Online Sekolah',
        'Web Loket PPOB & Pembayaran',
        'Web Marketplace & Jual Beli',
        'Web Iklan Baris & Classified Ads',
        'Portal Lowongan Kerja & Karir',
        'Website Desa & Layanan Warga',
        'Website Pemerintah & Instansi',
        'Aplikasi Android (Mobile PWA)',
        'Web Rental Mobil',
      ]
    }
  ]);
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [currentStage, setCurrentStage] = useState<'interview' | 'prd_review' | 'production'>('interview');
  const [accumulatedNotes, setAccumulatedNotes] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  /**
   * Main handler when user submits prompt or clicks quick-reply
   */
  const handleSendMessage = async (customPrompt?: string) => {
    const text = (customPrompt || promptInput).trim();
    if (!text || isGenerating) return;

    if (wallet.aiCredits < 2) {
      alert('Saldo Kredit AI tidak mencukupi (butuh minimal 2 kredit). Silakan top up.');
      onOpenBilling();
      return;
    }

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setPromptInput('');
    setIsGenerating(true);

    const isNewAppRequest = 
      /buatkan|bikin|tolong buatkan|aplikasi baru|sistem baru|mau buat/i.test(text) || 
      currentStage === 'production';

    const updatedNotes = isNewAppRequest ? [text] : [...accumulatedNotes, text];
    if (isNewAppRequest) {
      setAccumulatedNotes([text]);
      setCurrentStage('interview');
    } else {
      setAccumulatedNotes(updatedNotes);
    }

    try {
      setGenerationStep('GENESIS AI menganalisis kelengkapan 10 kriteria PRD...');
      await new Promise(r => setTimeout(r, 800));

      // Analyze completeness with session isolation to avoid history bleed
      const activeHistory = isNewAppRequest 
        ? [] 
        : messages.filter(m => m.stage === 'interview' || m.stage === 'prd_review');
      const completeness = analyzePromptCompleteness(text, activeHistory);

      if (!completeness.isComplete && currentStage !== 'prd_review') {
        // TAHAP 1: WAWANCARA PENGGUNA
        setGenerationStep('Menyusun pertanyaan wawancara kebutuhan produk...');
        await new Promise(r => setTimeout(r, 700));

        let interviewText = `Terima kasih! Ide aplikasi **${completeness.suggestedTitle}** (${completeness.domain}) sangat menarik.\n\nUntuk menyusun spesifikasi teknis yang matang sebelum masuk produksi, mohon lengkapi beberapa poin wawancara berikut:`;

        completeness.interviewQuestions.forEach((q, idx) => {
          interviewText += `\n\n**${idx + 1}.** ${q}`;
        });

        interviewText += `\n\n_Anda dapat menjawab pertanyaan di atas langsung di prompt chat, atau pilih tombol cepat di bawah ini jika data dirasa sudah cukup untuk lanjut ke PRD._`;

        const interviewMsg: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          text: interviewText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stage: 'interview',
          interviewProgress: completeness.score,
          quickReplies: completeness.quickReplies,
          thinkingTrace: `Wawancara aktif: Kelengkapan data ${completeness.score}% · Menunggu konfirmasi persona & aturan bisnis.`
        };

        setCurrentStage('interview');
        setMessages(prev => [...prev, interviewMsg]);
      } else {
        // TAHAP 2: MEMBUAT PRD RESMI (10 POIN LENGKAP)
        setGenerationStep('Menyusun Dokumen PRD Resmi (10 Poin Spesifikasi)...');
        await new Promise(r => setTimeout(r, 1200));

        const prd = generateFullPRD(text, updatedNotes, `${user.name} (Product Owner)`);

        const prdMsg: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          text: `Data kebutuhan telah lengkap! Saya telah menyusun **Product Requirements Document (PRD)** resmi mencakup seluruh 10 poin arsitektur:\n\n1. Metadata Dokumen\n2. Latar Belakang & Tujuan Bisnis\n3. Profil Pengguna & Aturan Bisnis\n4. Lingkup Kerja (In-Scope vs Out-of-Scope)\n5. User Stories & Tabel Kebutuhan Fitur (Metode MoSCoW & Acceptance Criteria)\n6. Desain & UX Flow\n7. Kebutuhan Non-Fungsional (Performa & Regulasi PDP)\n8. Metrik Keberhasilan (KPI)\n9. Rencana Rilis & Kriteria Peluncuran\n10. Pertanyaan Terbuka & Mitigasi Risiko\n\nSilakan periksa dokumen di bawah ini. Jika sudah sesuai, tekan tombol **"Setujui PRD & Masuk ke Produksi"** untuk langsung men-generate aplikasinya di Studio.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stage: 'prd_review',
          prd,
          thinkingTrace: `PRD generated: ${prd.metadata.productName} · Status Approved for Production · 10 poin terisi penuh.`
        };

        setCurrentStage('prd_review');
        setMessages(prev => [...prev, prdMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        sender: 'assistant',
        text: `Maaf, terjadi kendala saat memproses: ${err.message}. Silakan coba ulangi jawaban Anda.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  /**
   * Handler when user approves PRD and requests production build
   */
  const handleApproveAndProduce = async (prd: PRDDocument) => {
    setIsGenerating(true);
    setGenerationStep('PRD Disetujui! Membangun arsitektur skema database...');

    try {
      await new Promise(r => setTimeout(r, 900));
      setGenerationStep('Menyusun komponen UI, filter Rupiah, dan Kanban Pipeline...');
      await new Promise(r => setTimeout(r, 1100));

      const producedApp = convertPRDToLegoApp(prd, user.id, 'org-1');

      const prodMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: `🚀 **Produksi Berhasil!** Aplikasi **${producedApp.name}** telah selesai dibangun sesuai spesifikasi PRD resmi.\n\n- Skema Database: **${producedApp.versions[0].tables[0].name}** (${producedApp.versions[0].tables[0].columns.length} Kolom, format Rupiah Rp)\n- KPI Metrik: **${producedApp.versions[0].metrics.map(m => m.label).join(', ')}**\n- Alur Status: **${producedApp.versions[0].kanban?.stages.map(s => s.name).join(' ➔ ') || 'Tabel Interaktif'}**\n\nPRD resmi telah dilampirkan ke dalam project ini. Silakan buka aplikasi di Studio untuk melihat preview interaktif live dan mengedit kodenya.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stage: 'production',
        generatedApp: producedApp,
        thinkingTrace: `Aplikasi diproduksi dari PRD ${prd.metadata.productName} · Versi v1 siap di Studio.`
      };

      setCurrentStage('production');
      setMessages(prev => [...prev, prodMsg]);
    } catch (err: any) {
      alert('Gagal masuk ke produksi: ' + err.message);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#fafafa] dot-grid">
      {/* Top Header */}
      <header className="p-4 px-6 border-b border-slate-200/70 bg-white/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight">AI Chat Assistant</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Menu 1
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Alur Otomasi: Wawancara Pengguna ➔ PRD Resmi (10 Poin) ➔ Masuk ke Produksi
            </p>
          </div>
        </div>

        {/* Lifecycle Phase Indicator Pill */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <span className={`px-2 py-0.5 rounded-lg transition-colors ${
            currentStage === 'interview' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-500'
          }`}>
            1. Wawancara
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className={`px-2 py-0.5 rounded-lg transition-colors ${
            currentStage === 'prd_review' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-500'
          }`}>
            2. PRD Dokumen
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className={`px-2 py-0.5 rounded-lg transition-colors ${
            currentStage === 'production' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500'
          }`}>
            3. Produksi
          </span>
        </div>
      </header>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full">
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`space-y-3.5 max-w-[92%] sm:max-w-[85%]`}>
              {/* Message text bubble */}
              <div 
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-slate-900 text-white rounded-br-xs shadow-xs font-normal' 
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                }`}
              >
                {/* Stage progress pill if present */}
                {msg.stage === 'interview' && msg.interviewProgress && (
                  <div className="mb-2 pb-2 border-b border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-blue-700 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Tahap 1: Wawancara Pengguna</span>
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                      Kelengkapan: {msg.interviewProgress}%
                    </span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[10px] mt-2 block text-right ${msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {/* Quick Reply Chips during Interview Stage */}
              {msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Pilihan Jawaban / Aksi Cepat:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(reply)}
                        disabled={isGenerating}
                        className="text-[11px] text-left px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 font-medium rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5 active:scale-98"
                      >
                        <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>{reply}</span>
                      </button>
                    ))}
                    {onOpenGallery && (
                      <button
                        onClick={onOpenGallery}
                        className="text-[11px] text-left px-3 py-1.5 bg-pink-50 hover:bg-pink-100 hover:border-pink-300 text-pink-700 font-semibold rounded-xl border border-pink-200 shadow-2xs transition-colors flex items-center gap-1.5 active:scale-98"
                      >
                        <Palette className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                        <span>Pilih Gaya Desain dari Galeri UI (Dribbble/Magnific)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Render Full 10-Point PRD Card if AI generated a PRD */}
              {msg.prd && (
                <PRDViewerCard
                  prd={msg.prd}
                  onApproveAndProduce={handleApproveAndProduce}
                  isProducing={isGenerating}
                />
              )}

              {/* Render Action Card if AI produced an App */}
              {msg.generatedApp && (
                <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          App Siap di Studio
                        </span>
                        <h4 className="text-base font-bold text-slate-900">
                          {msg.generatedApp.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {msg.generatedApp.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] text-slate-500 block">Tabel Database:</span>
                      <strong className="text-slate-800">{msg.generatedApp.versions[0].tables[0].name}</strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] text-slate-500 block">Format Nominal:</span>
                      <strong className="text-emerald-700 font-semibold">Rupiah (Rp)</strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-500 block">Status Acuan:</span>
                      <strong className="text-blue-700 font-semibold">PRD v1.0 Resmi</strong>
                    </div>
                  </div>

                  {msg.thinkingTrace && (
                    <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 font-mono border border-slate-200/60 flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{msg.thinkingTrace}</span>
                    </div>
                  )}

                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => onOpenInStudio(msg.generatedApp!)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
                    >
                      <Rocket className="w-4 h-4" />
                      <span>Buka di Studio & Jalankan Preview</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1 font-bold text-xs">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-1 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-blue-200 rounded-2xl rounded-tl-xs p-4 shadow-2xs space-y-1.5 max-w-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>GENESIS AI sedang menganalisis</span>
              </div>
              <p className="text-[11px] text-blue-700">{generationStep}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Prompt Bar at Bottom */}
      <div className="p-4 max-w-4xl mx-auto w-full shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-3 space-y-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <textarea
            rows={2}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ketik ide aplikasi atau jawab pertanyaan wawancara di sini... (Contoh: Kasir kedai kopi dengan metode bayar QRIS & Tunai, cetak struk via WhatsApp)"
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
                onClick={() => setPromptInput('Aplikasi Rental Mobil & Armada. Persona: Admin & Petugas serah terima. In-Scope: daftar unit mobil, sewa per hari, tarif Rp, dan WA penyewa. Out-of-Scope: GPS tracker.')}
                className="px-2 py-0.5 text-[10px] text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-md flex items-center gap-1 border border-slate-200"
              >
                <Wand2 className="w-3 h-3 text-amber-500" />
                <span>Format Lengkap</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-slate-400">
                <FigmaIcon className="w-3.5 h-3.5" />
                <GithubIcon className="w-3.5 h-3.5" />
              </div>

              <button
                onClick={() => handleSendMessage()}
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

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
          {[
            { label: '🚗 Rental Mobil', prompt: 'Saya mau buat aplikasi persewaan rental mobil dengan pencatatan unit armada, durasi sewa per hari, dan nomor WhatsApp penyewa.' },
            { label: '📦 Stok & Inventori', prompt: 'Buatkan aplikasi manajemen inventori stok barang toko dengan harga beli vs harga jual dan peringatan stok menipis.' },
            { label: '⚽ Booking Lapangan', prompt: 'Buatkan sistem jadwal booking sewa lapangan futsal per jam dengan pelacak status DP dan WhatsApp.' },
            { label: '🔧 Bengkel & Servis', prompt: 'Buatkan sistem tiket servis bengkel motor dengan nomor polisi, catatan keluhan, estimasi biaya, dan notifikasi WA.' },
            { label: '☕ Kasir Kedai Kopi', prompt: 'Buatkan aplikasi kasir kedai kopi dengan pencatatan pesanan, pembayaran QRIS/Tunai, dan cetak nota digital.' },
            { label: '🏠 Kamar Kost', prompt: 'Buatkan aplikasi pengelolaan kamar kost dengan nomor kamar, harga sewa bulanan, dan pengingat jatuh tempo WA.' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => handleSendMessage(item.prompt)}
              className="px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-white hover:bg-slate-100 rounded-full border border-slate-200/80 shadow-2xs transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
