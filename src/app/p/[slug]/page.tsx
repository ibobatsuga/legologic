'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import { LegoApp, AppVersion } from '@/types/legologic';
import { ALL_TEMPLATES, SATU_PIPELINE_APP } from '@/lib/templates';
import { InteractiveAppRenderer } from '@/components/InteractiveAppRenderer';
import { ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function PublicAppContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [app, setApp] = useState<LegoApp | null>(null);

  useEffect(() => {
    // Try localStorage first
    try {
      const savedAppsStr = localStorage.getItem('legologic_apps_v1');
      if (savedAppsStr) {
        const parsed: LegoApp[] = JSON.parse(savedAppsStr);
        const found = parsed.find(a => (a.publishedSlug || a.slug) === slug || a.id === slug);
        if (found) {
          setApp(found);
          return;
        }
      }
    } catch (e) {}

    // Fallback to templates
    const templateMatch = ALL_TEMPLATES.find(
      t => (t.publishedSlug || t.slug) === slug || t.id === slug
    );
    if (templateMatch) {
      setApp(templateMatch);
    } else {
      setApp(SATU_PIPELINE_APP);
    }
  }, [slug]);

  if (!app) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Memuat aplikasi GENESIS...</p>
        </div>
      </div>
    );
  }

  const currentVer: AppVersion = 
    app.versions.find(v => v.versionNumber === app.currentVersion) || app.versions[app.versions.length - 1];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Banner for published app */}
      <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Link 
            href="/"
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke GENESIS Studio</span>
          </Link>
          <span className="text-slate-600">|</span>
          <span className="font-semibold text-white">
            {app.publishedSlug || app.slug}.genesis.id
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            LIVE PUBLISHED
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ditenagai oleh GENESIS App Maker</span>
        </div>
      </div>

      {/* Interactive App Renderer in Full Standalone Screen */}
      <div className="flex-1">
        <InteractiveAppRenderer version={currentVer} isStandalone={true} />
      </div>
    </div>
  );
}

export default function PublicAppPage(props: PageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Memuat aplikasi GENESIS...</p>
        </div>
      </div>
    }>
      <PublicAppContent {...props} />
    </Suspense>
  );
}
