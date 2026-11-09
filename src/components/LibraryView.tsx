'use client';

import React, { useState } from 'react';
import { LegoApp } from '@/types/legologic';
import { 
  FolderGit2, Sparkles, Monitor, Rocket, Calendar, Database, 
  ExternalLink, ArrowRight, Search, Plus, Layers, ShieldCheck, Palette
} from 'lucide-react';
import { UIGalleryView } from './UIGalleryView';
import { UIGalleryItem } from '@/lib/ui-gallery';

interface LibraryViewProps {
  recentApps: LegoApp[];
  templates: LegoApp[];
  onOpenAppInStudio: (appId: string) => void;
  onUseTemplate: (template: LegoApp) => void;
  onNewBuild: () => void;
  initialTab?: 'projects' | 'templates' | 'gallery';
  onSelectUIStyle?: (item: UIGalleryItem) => void;
}

export function LibraryView({
  recentApps,
  templates,
  onOpenAppInStudio,
  onUseTemplate,
  onNewBuild,
  initialTab = 'projects',
  onSelectUIStyle,
}: LibraryViewProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'templates' | 'gallery'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecent = recentApps.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fafafa] dot-grid select-none">
      {/* Top Header Bar */}
      <header className="p-4 px-8 border-b border-slate-200/80 bg-white/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-2xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-blue-600" />
            <span>Library Proyek, Template & Galeri Desain UI</span>
          </h1>
          <p className="text-xs text-slate-500">
            Kelola aplikasi Anda, pilih template operasional, atau tentukan gaya visual modern siap pakai.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab !== 'gallery' && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari proyek atau template..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-52 md:w-64"
              />
            </div>
          )}

          <button
            onClick={onNewBuild}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Project Baru</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-slate-200 px-8 py-2.5 flex items-center gap-2 sticky top-[73px] z-10">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'projects'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Proyek Saya</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            activeTab === 'projects' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {filteredRecent.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'templates'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Template Bisnis</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            activeTab === 'templates' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {filteredTemplates.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'gallery'
              ? 'bg-linear-to-r from-pink-600 to-rose-600 text-white shadow-xs'
              : 'text-pink-700 bg-pink-50/70 hover:bg-pink-100/70 border border-pink-200/60'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>UI Gallery</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            activeTab === 'gallery' ? 'bg-white/20 text-white' : 'bg-pink-200/80 text-pink-800'
          }`}>
            16 Desain
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-8">
        {activeTab === 'projects' && (
          /* TAB 1: RECENT PROJECTS */
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Recent Projects (Proyek Terakhir)</h2>
                <p className="text-xs text-slate-500">Aplikasi yang sedang aktif dalam workspace Anda.</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {filteredRecent.length} Proyek
              </span>
            </div>

            {filteredRecent.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">Belum ada proyek yang dibuat</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Mulai dengan membuat aplikasi baru atau gunakan template siap pakai.
                </p>
                <button
                  onClick={onNewBuild}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700 transition-colors"
                >
                  Mulai Buat Aplikasi
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecent.map(app => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          v{app.currentVersion}
                        </span>
                        {app.isPublished ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <Rocket className="w-3 h-3" />
                            <span>Live</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400">
                            Draft
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {app.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {new Date(app.updatedAt).toLocaleDateString('id-ID')}
                      </span>

                      <button
                        onClick={() => onOpenAppInStudio(app.id)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <span>Buka di Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'templates' && (
          /* TAB 2: TEMPLATES GALLERY */
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Template Bisnis Siap Pakai</h2>
                <p className="text-xs text-slate-500">Mulai lebih cepat dengan struktur modul yang sudah divalidasi.</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {filteredTemplates.length} Template
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  {/* Visual Preview Banner */}
                  <div className="h-32 rounded-xl bg-linear-to-b from-slate-100 to-slate-50 border border-slate-200/60 p-3 flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-[10px] font-mono font-bold text-slate-400">Template Terverifikasi</span>
                    </div>
                    <div className="text-center py-1">
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">{template.name}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{template.description}</div>
                    </div>
                    <div className="flex justify-center gap-1">
                      <span className="h-1 w-6 rounded-full bg-slate-300" />
                      <span className="h-1 w-3 rounded-full bg-amber-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      Siap Pakai
                    </span>

                    <button
                      onClick={() => onUseTemplate(template)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Gunakan Template</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'gallery' && (
          /* TAB 3: UI GALLERY (DRIBBBLE & MAGNIFIC) */
          <UIGalleryView
            isEmbeddedInLibrary={true}
            onSelectStyle={(item) => {
              if (onSelectUIStyle) {
                onSelectUIStyle(item);
              }
            }}
            onNavigateToStudio={() => {
              // Open default or newly customized app in studio
              if (recentApps.length > 0) {
                onOpenAppInStudio(recentApps[0].id);
              } else {
                onNewBuild();
              }
            }}
          />
        )}
      </main>
    </div>
  );
}
