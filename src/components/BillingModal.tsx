'use client';

import React, { useState, useEffect } from 'react';
import { CreditWallet, AppPlan, LegoApp } from '@/types/legologic';
import { APP_TIERS, AppTierDetails } from '@/lib/limits';
import { 
  X, Check, QrCode, CreditCard, ShieldCheck, Zap, Cloud, Sparkles, 
  Copy, Clock, ArrowRight, CheckCircle2, ChevronRight, Building2, Smartphone
} from 'lucide-react';

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: CreditWallet;
  currentApp?: LegoApp;
  onPaymentSuccess: (plan: AppPlan, amountPaid: number, aiCreditsAdded: number, method: string) => void;
}

export function BillingModal({ 
  isOpen, 
  onClose, 
  wallet, 
  currentApp,
  onPaymentSuccess 
}: BillingModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<'MINIMAL' | 'STANDAR' | 'OPTIMAL'>('STANDAR');
  const [paymentStep, setPaymentStep] = useState<'select' | 'payment' | 'success'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'mandiri' | 'bri'>('qris');
  const [countdown, setCountdown] = useState(899); // 14 mins 59 secs
  const [copiedVa, setCopiedVa] = useState(false);
  const [invoiceId, setInvoiceId] = useState('LL-INV-892341');

  useEffect(() => {
    if (!isOpen) {
      setPaymentStep('select');
      setCountdown(899);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (paymentStep === 'payment' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paymentStep, countdown]);

  if (!isOpen) return null;

  const selectedTier = APP_TIERS[selectedPlanId];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getVaNumber = (bank: string) => {
    switch (bank) {
      case 'bca': return '3901 0812 3456 7890';
      case 'mandiri': return '8890 0812 3456 7890';
      case 'bri': return '1280 0812 3456 7890';
      default: return '3901 0812 3456 7890';
    }
  };

  const handleProceedToPayment = (tierId: 'MINIMAL' | 'STANDAR' | 'OPTIMAL') => {
    setSelectedPlanId(tierId);
    setInvoiceId('LL-' + Math.floor(100000 + Math.random() * 900000));
    setCountdown(899);
    setPaymentStep('payment');
  };

  const handleSimulateSuccess = () => {
    onPaymentSuccess(
      selectedPlanId,
      selectedTier.priceIdr,
      selectedTier.aiCredits,
      paymentMethod.toUpperCase()
    );
    setPaymentStep('success');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Aktivasi Aplikasi: {currentApp?.name || 'Aplikasi Web'}
              </h2>
              <p className="text-xs text-slate-500">
                Harga per aplikasi · Sekali bayar · Pembayaran instan QRIS & Virtual Account
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: SELECT PLAN */}
          {paymentStep === 'select' && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Pilih Paket Sesuai Kebutuhan Aplikasi Anda</h3>
                <p className="text-xs text-slate-500">
                  Tanpa langganan bulanan platform. Bayar hanya untuk aplikasi yang Anda inginkan.
                </p>
              </div>

              {/* 3 Pricing Cards: Minimal, Standar, Optimal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* MINIMAL (Rp 19.000) */}
                <div 
                  className={`border rounded-2xl p-4.5 flex flex-col justify-between transition-all hover:border-blue-400 ${
                    selectedPlanId === 'MINIMAL' ? 'border-blue-500 bg-blue-50/20 shadow-xs' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      {APP_TIERS.MINIMAL.name}
                    </span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      Rp 19.000
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">sekali bayar / app</span>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      {APP_TIERS.MINIMAL.tagline}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      {APP_TIERS.MINIMAL.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleProceedToPayment('MINIMAL')}
                    className="mt-5 w-full py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Pilih Minimal (Rp 19rb)
                  </button>
                </div>

                {/* STANDAR (Rp 49.000) - Most Popular */}
                <div 
                  className="border-2 border-amber-400 rounded-2xl p-4.5 bg-amber-50/20 relative flex flex-col justify-between shadow-xs hover:border-amber-500 transition-all"
                >
                  <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold tracking-wider shadow-2xs">
                    PALING POPULER
                  </span>
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                      {APP_TIERS.STANDAR.name}
                    </span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      Rp 49.000
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">sekali bayar / app</span>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                      {APP_TIERS.STANDAR.tagline}
                    </p>

                    <div className="mt-4 pt-3 border-t border-amber-200/60 space-y-2 text-xs text-slate-700">
                      {APP_TIERS.STANDAR.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] font-medium leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleProceedToPayment('STANDAR')}
                    className="mt-5 w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Pilih Standar (Rp 49rb)
                  </button>
                </div>

                {/* OPTIMAL (Rp 99.000) */}
                <div 
                  className={`border rounded-2xl p-4.5 flex flex-col justify-between transition-all hover:border-purple-400 ${
                    selectedPlanId === 'OPTIMAL' ? 'border-purple-500 bg-purple-50/20 shadow-xs' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">
                        {APP_TIERS.OPTIMAL.name}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-purple-100 text-purple-700">
                        PRO
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      Rp 99.000
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">sekali bayar / app</span>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      {APP_TIERS.OPTIMAL.tagline}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      {APP_TIERS.OPTIMAL.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleProceedToPayment('OPTIMAL')}
                    className="mt-5 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Pilih Optimal (Rp 99rb)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT SCREEN (QRIS / VA) */}
          {paymentStep === 'payment' && (
            <div className="space-y-6">
              {/* Payment Summary Bar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900">
                    Paket {selectedTier.name} — Rp {selectedTier.priceIdr.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Ref: <span className="font-mono">{invoiceId}</span> · {selectedTier.aiCredits} Kredit AI Included
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-amber-700 font-bold bg-amber-100/70 px-2.5 py-1 rounded-lg text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(countdown)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Pilih Metode Pembayaran</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex flex-col justify-between transition-all ${
                      paymentMethod === 'qris'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-rose-600 mb-1" />
                    <span>QRIS Instant</span>
                    <span className="text-[9px] font-normal text-slate-400">GoPay, OVO, Dana, dll</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('bca')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex flex-col justify-between transition-all ${
                      paymentMethod === 'bca'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-700 mb-1" />
                    <span>BCA VA</span>
                    <span className="text-[9px] font-normal text-slate-400">Virtual Account</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('mandiri')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex flex-col justify-between transition-all ${
                      paymentMethod === 'mandiri'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-600 mb-1" />
                    <span>Mandiri VA</span>
                    <span className="text-[9px] font-normal text-slate-400">Livin & ATM</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('bri')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex flex-col justify-between transition-all ${
                      paymentMethod === 'bri'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-500 mb-1" />
                    <span>BRI VA</span>
                    <span className="text-[9px] font-normal text-slate-400">BRIMO & ATM</span>
                  </button>
                </div>
              </div>

              {/* Detailed Payment Canvas */}
              {paymentMethod === 'qris' ? (
                /* QRIS Mode */
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 text-center space-y-3 max-w-sm mx-auto shadow-sm">
                  <div className="flex items-center justify-between border-b pb-2 text-[11px] font-bold text-slate-700">
                    <span className="text-slate-900">QRIS NASIONAL</span>
                    <span className="text-slate-400 font-mono">NMID: ID20261108</span>
                  </div>

                  {/* QRIS Graphic Container */}
                  <div className="w-44 h-44 bg-slate-900 mx-auto rounded-2xl p-2.5 flex items-center justify-center relative shadow-inner">
                    <div className="w-full h-full bg-white rounded-xl flex flex-col items-center justify-center p-2">
                      <QrCode className="w-32 h-32 text-slate-900" />
                      <span className="text-[9px] font-mono font-bold text-slate-400">SCAN UNTUK BAYAR</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs text-slate-500">Total Pembayaran:</div>
                    <div className="text-lg font-extrabold text-slate-900">
                      Rp {selectedTier.priceIdr.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-tight">
                    Buka aplikasi e-wallet atau mobile banking apa saja, pilih scan QRIS, lalu konfirmasi pembayaran.
                  </p>
                </div>
              ) : (
                /* VA Mode */
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 max-w-md mx-auto">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500">Nomor Virtual Account {paymentMethod.toUpperCase()}:</span>
                    <div className="flex items-center justify-between p-3 bg-slate-100 rounded-xl font-mono text-sm font-bold text-slate-900">
                      <span>{getVaNumber(paymentMethod)}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(getVaNumber(paymentMethod).replace(/\s/g, ''));
                          setCopiedVa(true);
                          setTimeout(() => setCopiedVa(false), 2000);
                        }}
                        className="px-2.5 py-1 text-xs bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1 font-sans"
                      >
                        {copiedVa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedVa ? 'Disalin' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="font-bold text-slate-800 block">Petunjuk Transfer:</span>
                    <p>1. Masuk ke menu Transfer &gt; Virtual Account pada mobile banking.</p>
                    <p>2. Masukkan nomor VA di atas dan nominal Rp {selectedTier.priceIdr.toLocaleString('id-ID')}.</p>
                    <p>3. Konfirmasi pembayaran dan sistem akan memverifikasi otomatis.</p>
                  </div>
                </div>
              )}

              {/* Simulation Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setPaymentStep('select')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Ganti Paket
                </button>

                <button
                  onClick={handleSimulateSuccess}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  <Check className="w-4 h-4" />
                  <span>Simulasikan Pembayaran Berhasil</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {paymentStep === 'success' && (
            <div className="max-w-md mx-auto text-center space-y-5 py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Pembayaran Berhasil Dikonfirmasi!
                </h3>
                <p className="text-xs text-slate-500">
                  Paket <strong className="text-slate-800">{selectedTier.name}</strong> untuk aplikasi ini telah aktif.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Invoice:</span>
                  <span className="font-mono font-bold text-slate-800">{invoiceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Dibayar:</span>
                  <span className="font-bold text-slate-900">Rp {selectedTier.priceIdr.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode:</span>
                  <span className="font-semibold text-slate-800">{paymentMethod.toUpperCase()} Instant</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Kredit AI Ditambahkan:</span>
                  <span className="font-bold text-blue-600">+{selectedTier.aiCredits} Kredit AI</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setPaymentStep('select');
                  onClose();
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Lanjutkan Membangun Aplikasi
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verifikasi Otomatis Real-time · Aman & Terenkripsi</span>
          </div>
          <span>Standar QRIS & Virtual Account Indonesia</span>
        </div>
      </div>
    </div>
  );
}
