'use client';

import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Copy, Check, ChevronDown, ChevronUp, 
  Rocket, ArrowRight, ShieldCheck, Target, Users, ListChecks, 
  Layers, AlertTriangle, HelpCircle, ExternalLink 
} from 'lucide-react';
import { PRDDocument } from '@/types/legologic';
import { formatPRDToMarkdown } from '@/lib/prd-engine';

interface PRDViewerCardProps {
  prd: PRDDocument;
  onApproveAndProduce: (prd: PRDDocument) => void;
  onRequestRevision?: (feedbackText: string) => void;
  isProducing?: boolean;
}

export function PRDViewerCard({
  prd,
  onApproveAndProduce,
  onRequestRevision,
  isProducing = false,
}: PRDViewerCardProps) {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'fungsional' | 'ux' | 'metrik'>('ringkasan');
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopyMarkdown = () => {
    const md = formatPRDToMarkdown(prd);
    navigator.clipboard.writeText(md);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-blue-500/30 shadow-md overflow-hidden transition-all text-slate-800">
      {/* CARD HEADER */}
      <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/60 border border-blue-400/40 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-blue-500/40 text-blue-100 border border-blue-400/30">
                PRD RESMI (10 POIN LENGKAP)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white">
                Status: {prd.metadata.status}
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
              {prd.metadata.productName}
            </h3>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
            title="Salin isi PRD lengkap dalam format Markdown"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Tersalin!' : 'Salin Markdown'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* TABS NAVIGATOR */}
          <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab('ringkasan')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'ringkasan'
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>1-4: Ringkasan & Lingkup</span>
            </button>

            <button
              onClick={() => setActiveTab('fungsional')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'fungsional'
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>5: Spesifikasi Fitur & MoSCoW</span>
            </button>

            <button
              onClick={() => setActiveTab('ux')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'ux'
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>6-7: UX & Non-Fungsional</span>
            </button>

            <button
              onClick={() => setActiveTab('metrik')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'metrik'
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>8-10: KPI, Rilis & Risiko</span>
            </button>
          </div>

          {/* TAB 1: RINGKASAN & LINGKUP */}
          {activeTab === 'ringkasan' && (
            <div className="p-5 space-y-5 text-xs leading-relaxed">
              {/* 1. Metadata Dokumen */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                  1. Informasi Dasar Dokumen (Metadata)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div><strong>Author / PM:</strong> {prd.metadata.author}</div>
                  <div><strong>Tanggal:</strong> {prd.metadata.lastUpdated}</div>
                  <div><strong>UI/UX Designer:</strong> {prd.metadata.coreTeam.uxUiDesigner}</div>
                  <div><strong>Tech Lead:</strong> {prd.metadata.coreTeam.techLead}</div>
                  <div className="sm:col-span-2"><strong>Changelog:</strong> {prd.metadata.changelog}</div>
                </div>
              </div>

              {/* 2. Background & Objectives */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>2. Latar Belakang & Tujuan (Background & Objectives)</span>
                </h4>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                  <div>
                    <span className="font-bold text-blue-900 block">Latar Belakang:</span>
                    <p className="text-slate-700">{prd.backgroundObjectives.background}</p>
                  </div>
                  <div>
                    <span className="font-bold text-blue-900 block">Pernyataan Masalah (Problem Statement):</span>
                    <p className="text-slate-700">{prd.backgroundObjectives.problemStatement}</p>
                  </div>
                  <div>
                    <span className="font-bold text-blue-900 block">Tujuan Bisnis (Business Goal):</span>
                    <p className="text-slate-700 font-semibold text-emerald-800">{prd.backgroundObjectives.businessGoal}</p>
                  </div>
                </div>
              </div>

              {/* 3. User Persona & Business Logic */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>3. Profil Pengguna & Logika Bisnis (User Persona & Business Logic)</span>
                </h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                  <p><strong>Target Persona:</strong> {prd.userPersonaBusinessLogic.userPersona}</p>
                  <div>
                    <strong>Asumsi Utama:</strong>
                    <ul className="list-disc list-inside mt-1 text-slate-600 space-y-0.5">
                      {prd.userPersonaBusinessLogic.assumptions.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Batasan & Aturan Bisnis (Rules):</strong>
                    <ul className="list-disc list-inside mt-1 text-slate-600 space-y-0.5">
                      {prd.userPersonaBusinessLogic.businessRules.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. Lingkup Kerja */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-emerald-600" />
                  <span>4. Lingkup Kerja (Scope: In-Scope vs Out-of-Scope)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                    <span className="font-bold text-emerald-900 text-xs block">
                      In-Scope (Wajib Selesai Rilis Ini):
                    </span>
                    <ul className="space-y-1 text-emerald-800">
                      {prd.scope.inScope.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-100/70 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-700 text-xs block">
                      Out-of-Scope (Ditunda ke Fase V2):
                    </span>
                    <ul className="space-y-1 text-slate-500">
                      {prd.scope.outOfScope.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold shrink-0 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPESIFIKASI FITUR & MOSCOW */}
          {activeTab === 'fungsional' && (
            <div className="p-5 space-y-5 text-xs leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">5. User Stories</h4>
                <div className="space-y-2">
                  {prd.functionalRequirements.userStories.map((story, i) => (
                    <div key={i} className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200/70 text-slate-800 font-medium">
                      {story}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">
                  Tabel Kebutuhan Fitur (Metode MoSCoW & Acceptance Criteria)
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b">
                      <tr>
                        <th className="p-2.5">ID</th>
                        <th className="p-2.5">Fitur</th>
                        <th className="p-2.5">Prioritas</th>
                        <th className="p-2.5">Kriteria Penerimaan (Given - When - Then)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {prd.functionalRequirements.features.map(f => (
                        <tr key={f.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-blue-700 whitespace-nowrap">{f.id}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{f.description}</td>
                          <td className="p-2.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              f.priority === 'Must Have' 
                                ? 'bg-red-100 text-red-700 border border-red-200' 
                                : f.priority === 'Should Have'
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {f.priority}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-600 leading-normal">{f.acceptanceCriteria}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: UX & NON-FUNGSIONAL */}
          {activeTab === 'ux' && (
            <div className="p-5 space-y-5 text-xs leading-relaxed">
              {/* 6. UX/UI Requirements */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>6. Desain & Pengalaman Pengguna (UX/UI Requirements)</span>
                </h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div>
                    <strong>Alur Pengguna (User Flow):</strong>
                    <ol className="list-decimal list-inside mt-1 space-y-1 text-slate-700">
                      {prd.uxUiRequirements.userFlow.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <strong>Konsep & Tautan Desain:</strong>
                    <p className="text-slate-600 mt-0.5">{prd.uxUiRequirements.designLinksNotes}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                    <div>
                      <span className="font-bold text-slate-700 block text-[11px]">Action Copy:</span>
                      <p className="text-slate-600">{prd.uxUiRequirements.elementDetails.actionCopywriting}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block text-[11px]">Error Messaging:</span>
                      <p className="text-slate-600">{prd.uxUiRequirements.elementDetails.errorMessaging}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block text-[11px]">Empty State:</span>
                      <p className="text-slate-600">{prd.uxUiRequirements.elementDetails.emptyStates}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. Kebutuhan Non-Fungsional */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>7. Kebutuhan Non-Fungsional (Non-Functional Requirements)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                    <span className="font-bold text-blue-900 block mb-1">Kinerja (Performance):</span>
                    <p className="text-slate-700">{prd.nonFunctionalRequirements.performance}</p>
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-1">Keamanan & PDP:</span>
                    <p className="text-slate-700">{prd.nonFunctionalRequirements.security}</p>
                  </div>
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200">
                    <span className="font-bold text-purple-900 block mb-1">Skalabilitas & Aksesibilitas:</span>
                    <p className="text-slate-700">{prd.nonFunctionalRequirements.scalabilityAccessibility}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: METRIK, RILIS & RISIKO */}
          {activeTab === 'metrik' && (
            <div className="p-5 space-y-5 text-xs leading-relaxed">
              {/* 8. Metrik Keberhasilan */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>8. Metrik Keberhasilan (Success Metrics / KPIs)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-1">Metrik Utama (Primary Metric):</span>
                    <p className="text-emerald-800 font-semibold">{prd.successMetrics.primaryMetric}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="font-bold text-blue-900 block mb-1">Metrik Sekunder (Guardrail):</span>
                    <p className="text-blue-800">{prd.successMetrics.secondaryMetric}</p>
                  </div>
                </div>
              </div>

              {/* 9. Rencana Rilis */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Rocket className="w-4 h-4 text-indigo-600" />
                  <span>9. Rencana Rilis & Kriteria Peluncuran</span>
                </h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div><strong>Rencana Pengujian:</strong> {prd.releasePlan.testingPlan}</div>
                  <div><strong>Kriteria Peluncuran:</strong> {prd.releasePlan.launchCriteria}</div>
                </div>
              </div>

              {/* 10. Pertanyaan Terbuka & Risiko */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>10. Pertanyaan Terbuka & Mitigasi Risiko</span>
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
                    <span className="font-bold text-amber-900 block">Pertanyaan Terbuka:</span>
                    <ul className="list-disc list-inside text-amber-800 space-y-0.5">
                      {prd.openQuestionsRisks.openQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-800 block">Risiko & Solusi Mitigasi:</span>
                    <div className="space-y-1.5">
                      {prd.openQuestionsRisks.risksAndMitigations.map((rm, i) => (
                        <div key={i} className="text-[11px] p-2 bg-white rounded-lg border border-slate-100">
                          <span className="font-semibold text-red-600">Risiko:</span> {rm.risk}
                          <br />
                          <span className="font-semibold text-emerald-600">Mitigasi:</span> {rm.mitigation}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM APPROVAL ACTION BAR */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              PRD ini menjadi acuan mutlak spesifikasi arsitektur aplikasi di Studio.
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onApproveAndProduce(prd)}
                disabled={isProducing}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all transform active:scale-95"
              >
                {isProducing ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Membangun Aplikasi Produksi...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>Setujui PRD & Masuk ke Produksi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
