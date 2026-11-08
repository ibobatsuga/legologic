'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Plus, Paperclip, Wand2, ArrowUp, 
  ExternalLink, ArrowRight, Layers, Bot, User as UserIcon,
  CheckCircle2, Clock, Terminal, Rocket
} from 'lucide-react';
import { LegoApp, CreditWallet, User } from '@/types/legologic';

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
  generatedApp?: LegoApp;
  thinkingTrace?: string;
}

interface ChatViewProps {
  wallet: CreditWallet;
  user: User;
  onOpenInStudio: (app: LegoApp) => void;
  onOpenBilling: () => void;
}

export function ChatView({
  wallet,
  user,
  onOpenInStudio,
  onOpenBilling,
}: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Halo Om Bobi! Saya asisten AI LegoLogic ditenagai Claude Sonnet 4.6. Ceritakan aplikasi apa yang ingin Anda buat hari ini? Anda bisa meminta aplikasi CRM, sistem kasir, booking antrean, ataupun portal klien interaktif.',
      timestamp: '10:00',
    }
  ]);
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

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
    setGenerationStep('Menghubungi Claude Sonnet 4.6 via Sakelar AI...');

    try {
      setTimeout(() => setGenerationStep('Menganalisis kebutuhan & skema database...'), 1200);
      setTimeout(() => setGenerationStep('Menyusun arsitektur komponen & UI interaktif...'), 2400);

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

      const generatedApp = data.app as LegoApp;

      const aiMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: `Aplikasi **${generatedApp.name}** berhasil dirancang! Saya telah menyusun skema database, antarmuka visual yang responsif, serta metrik performa utama. Silakan buka di Studio untuk melihat preview live dan mengedit kodenya.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        generatedApp,
        thinkingTrace: data.thinkingTrace || 'Arsitektur komponen dan visual pipeline telah disesuaikan.',
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        sender: 'assistant',
        text: `Maaf, terjadi kendala saat memproses: ${err.message}. Silakan coba ulangi prompt Anda.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#fafafa] dot-grid">
      {/* Top Header */}
      <header className="p-4 px-6 border-b border-slate-200/70 bg-white/80 backdrop-blur-xs flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900 tracking-tight">AI Chat Assistant</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Menu 1
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Sakelar AI · claude-sonnet-4.6</span>
        </div>
      </header>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-4xl mx-auto w-full">
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

            <div className={`space-y-3 max-w-[85%] sm:max-w-[75%]`}>
              <div 
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-slate-900 text-white rounded-br-xs shadow-xs font-normal' 
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[10px] mt-1.5 block text-right ${msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {/* Render Action Card if AI generated an App */}
              {msg.generatedApp && (
                <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          App Siap Diedit
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {msg.generatedApp.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {msg.generatedApp.description}
                      </p>
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
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-98"
                    >
                      <span>Buka di Studio (Menu 2)</span>
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
                <span>Claude Sonnet 4.6 sedang berpikir</span>
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
            placeholder="Tulis ide aplikasi Anda di sini... (Contoh: Buatkan aplikasi CRM WhatsApp dengan pipeline deal visual)"
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
                onClick={() => setPromptInput('Buatkan aplikasi CRM B2B untuk UMKM dengan pipeline stages deals, kontak WhatsApp, estimasi nilai transaksi dalam Rupiah, dan verifikasi izin outreach.')}
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
            { label: '💬 CRM WhatsApp', prompt: 'Buatkan aplikasi CRM WhatsApp dengan tracking leads dan pipeline visual.' },
            { label: '📦 Kasir & Inventori', prompt: 'Buatkan aplikasi manajemen inventori stok barang dan kasir toko retail.' },
            { label: '🗓️ Booking Antrean', prompt: 'Buatkan sistem reservasi booking jadwal dan nomor antrean pasien.' },
            { label: '📑 Invoice & Portal', prompt: 'Buatkan portal invoice klien dengan status pembayaran dan approval.' },
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
