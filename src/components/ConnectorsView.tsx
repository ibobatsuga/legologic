'use client';

import React from 'react';
import { Layers, MessageCircle, QrCode, FileSpreadsheet, Webhook, Check, ArrowRight } from 'lucide-react';

export function ConnectorsView() {
  const connectors = [
    {
      id: 'wa',
      name: 'WhatsApp Click-to-Chat & Direct Lead',
      description: 'Menghubungkan tombol follow-up dan kontak pelanggan langsung ke WhatsApp pemilik bisnis tanpa biaya API.',
      status: 'Aktif & Terhubung',
      icon: MessageCircle,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      badge: 'Bawaan GENESIS',
    },
    {
      id: 'qris',
      name: 'Pembayaran QRIS & Virtual Account',
      description: 'Menerima pembayaran instan pelanggan via QRIS semua bank & e-wallet (BCA, Mandiri, BRI, BNI, GoPay, OVO).',
      status: 'Siap Digunakan',
      icon: QrCode,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
      badge: 'Payment Gateway',
    },
    {
      id: 'sheets',
      name: 'Google Sheets & CSV Importer',
      description: 'Ekspor dan impor data pelanggan, inventori stok barang, atau rekaman transaksi langsung ke spreadsheet.',
      status: 'Tersedia',
      icon: FileSpreadsheet,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
      badge: 'Data Sync',
    },
    {
      id: 'webhook',
      name: 'Custom Webhooks & Otomasi',
      description: 'Kirim notifikasi data formulir baru ke webhook kustom, Make, Zapier, atau sistem internal bisnis Anda.',
      status: 'Siap Dikonfigurasi',
      icon: Webhook,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
      badge: 'Automation',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fafafa] dot-grid select-none">
      {/* Top Header */}
      <header className="p-4 px-8 border-b border-slate-200/80 bg-white/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-2xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Connectors & Integrasi Bisnis</span>
          </h1>
          <p className="text-xs text-slate-500">
            Hubungkan aplikasi bisnis Anda ke layanan WhatsApp, pembayaran QRIS, spreadsheet, dan webhook otomasi.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {connectors.map(c => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-2xs ${c.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {c.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{c.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>{c.status}</span>
                  </div>

                  <span className="text-[11px] text-slate-400">Siap Digunakan</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
