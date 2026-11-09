'use client';

import React, { useState } from 'react';
import { 
  Palette, Search, Sparkles, Check, Copy, ArrowRight, ExternalLink, 
  Layers, SlidersHorizontal, Monitor, Smartphone, Flame, Info, X
} from 'lucide-react';
import { UI_GALLERY_ITEMS, UIGalleryItem } from '@/lib/ui-gallery';

interface UIGalleryViewProps {
  onSelectStyle?: (item: UIGalleryItem) => void;
  onNavigateToStudio?: () => void;
  isEmbeddedInLibrary?: boolean;
}

export function UIGalleryView({
  onSelectStyle,
  onNavigateToStudio,
  isEmbeddedInLibrary = false,
}: UIGalleryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectItem, setInspectItem] = useState<UIGalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Style' },
    { id: 'saas', label: 'SaaS & Dashboard' },
    { id: 'minimal', label: 'Minimalist & Profile' },
    { id: 'ecommerce', label: 'E-Commerce & Toko' },
    { id: 'mobile', label: 'Mobile (Android/PWA)' },
    { id: 'editorial', label: 'Editorial & Berita' },
    { id: 'creative', label: 'Kreatif & Komunitas' },
  ];

  const filteredItems = UI_GALLERY_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.typography.toLowerCase().includes(query) ||
      item.bestFor.some(tag => tag.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const handleCopyPrompt = (item: UIGalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.promptSnippet);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleApplyStyle = (item: UIGalleryItem) => {
    if (onSelectStyle) {
      onSelectStyle(item);
    }
    if (onNavigateToStudio) {
      onNavigateToStudio();
    }
  };

  return (
    <div className={`flex flex-col ${isEmbeddedInLibrary ? '' : 'h-screen overflow-y-auto bg-[#fafafa] dot-grid'}`}>
      {/* Header bar if standalone */}
      {!isEmbeddedInLibrary && (
        <header className="p-4 px-8 border-b border-slate-200/80 bg-white/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-pink-100 text-pink-700">
                <Palette className="w-4 h-4" />
              </span>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                UI Gallery
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-linear-to-r from-pink-500 to-rose-500 text-white shadow-2xs">
                PRO UI KITS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih estetika visual dan tata letak terbaik untuk aplikasi Anda sebelum masuk ke proses build.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari style, font, atau jenis aplikasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 w-64 md:w-80"
            />
          </div>
        </header>
      )}

      {/* Main Container */}
      <div className={`max-w-6xl w-full mx-auto space-y-6 ${isEmbeddedInLibrary ? 'pt-2' : 'p-6 md:p-8'}`}>
        {/* Banner Announcement */}
        <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-pink-300 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Koleksi Estetika UI & Layout Siap Pakai</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              Koleksi Estetika UI Modern Siap Terapkan
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Setiap pilihan UI telah dikurasi dengan palet warna harmonis, tipografi proporsional, serta tata letak bento & card yang dapat langsung diaplikasikan ke aplikasi buatan GENESIS.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center min-w-28">
              <div className="text-lg font-black text-amber-300">16+</div>
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">UI Styles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center min-w-28">
              <div className="text-lg font-black text-emerald-300">100%</div>
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Tailwind Ready</div>
            </div>
          </div>

          {/* Decorative glowing background blobs */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -top-10 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Filter Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 font-medium">
            Menampilkan {filteredItems.length} dari {UI_GALLERY_ITEMS.length} desain
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setInspectItem(item)}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-pink-400/80 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Badge Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm text-white bg-slate-900/90 backdrop-blur-md">
                    {item.badge}
                  </span>
                </div>

                {/* Category chip right */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white/90 border border-white/20">
                    {item.categoryLabel}
                  </span>
                </div>

                {/* Bottom title in preview */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-sm font-bold tracking-tight drop-shadow-sm">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-200 line-clamp-1 drop-shadow-sm">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4.5 space-y-3.5 flex-1 flex flex-col justify-between">
                {/* Palette Swatches & Typography */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Palet Warna Utama:</span>
                    <div className="flex items-center gap-1.5">
                      {Object.entries(item.colors).map(([key, hex]) => (
                        <span
                          key={key}
                          title={`${key}: ${hex}`}
                          className="w-4 h-4 rounded-full border border-slate-200 shadow-2xs hover:scale-125 transition-transform"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                    <span className="text-slate-400">Font:</span>
                    <span className="font-semibold text-slate-800">{item.typography}</span>
                  </div>
                </div>

                {/* Tags "Cocok Untuk" */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Rekomendasi Jenis Web:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.bestFor.map((appType, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 font-medium"
                      >
                        {appType}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={(e) => handleCopyPrompt(item, e)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center justify-center"
                    title="Salin Prompt Style AI"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyStyle(item);
                    }}
                    className="flex-1 py-2 px-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 group/btn"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-400 group-hover/btn:rotate-12 transition-transform" />
                    <span>Gunakan Desain UI</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INSPECT MODAL */}
      {inspectItem && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
          onClick={() => setInspectItem(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative aspect-16/9 w-full bg-slate-900">
              <img
                src={inspectItem.imageUrl}
                alt={inspectItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              
              <button
                onClick={() => setInspectItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-600 text-white shadow-xs">
                  {inspectItem.badge}
                </span>
                <h3 className="text-xl font-bold mt-1.5">{inspectItem.title}</h3>
                <p className="text-xs text-slate-200">{inspectItem.subtitle}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              <p className="text-xs text-slate-600 leading-relaxed">
                {inspectItem.description}
              </p>

              {/* Technical Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Tipografi:</span>
                  <span className="font-bold text-slate-800">{inspectItem.typography}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Tata Letak:</span>
                  <span className="font-bold text-slate-800">{inspectItem.layoutStyle}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Bayangan & Elevasi:</span>
                  <span className="font-bold text-slate-800">{inspectItem.shadowStyle}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Palet Hex:</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {Object.entries(inspectItem.colors).map(([key, hex]) => (
                      <span
                        key={key}
                        className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: hex }}
                        title={`${key}: ${hex}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Prompt Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Instruksi Desain AI (Prompt Snippet):</span>
                  <button
                    onClick={(e) => handleCopyPrompt(inspectItem, e)}
                    className="text-pink-600 hover:text-pink-700 flex items-center gap-1 text-[11px]"
                  >
                    {copiedId === inspectItem.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono leading-relaxed border border-slate-800">
                  {inspectItem.promptSnippet}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setInspectItem(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    handleApplyStyle(inspectItem);
                    setInspectItem(null);
                  }}
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Terapkan Desain Ini ke Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
