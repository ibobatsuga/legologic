import { AppVersion } from '@/types/legologic';

export function generateAppSourceCode(version: AppVersion): string {
  const tableTypes = version.tables.map(t => {
    const fields = t.columns.map(c => {
      let tsType = 'string';
      if (c.type === 'number' || c.type === 'currency') tsType = 'number';
      return `  ${c.key}${c.required ? '' : '?'}: ${tsType};`;
    }).join('\n');

    return `export interface ${capitalize(t.id)}Record {\n  id: string;\n${fields}\n}`;
  }).join('\n\n');

  const initialData = version.tables.map(t => {
    return `export const initial${capitalize(t.id)}Data: ${capitalize(t.id)}Record[] = ${JSON.stringify(t.records, null, 2)};`;
  }).join('\n\n');

  return `// ——————————————————————————————————————————————————————————
// LegoLogic AI Generated Application: ${version.appName}
// Version: v${version.versionNumber} | Engine: claude-sonnet-4.6 (Sakelar AI)
// ——————————————————————————————————————————————————————————

import React, { useState } from 'react';

// 1. Data Schema & Types
${tableTypes}

// 2. Initial Sample Records
${initialData}

// 3. Application Metadata
export const appConfig = {
  name: "${version.appName}",
  tagline: "${version.tagline}",
  version: ${version.versionNumber},
  primaryColor: "${version.primaryColor || '#2563EB'}",
  accentColor: "${version.accentColor || '#F59E0B'}",
  pages: ${JSON.stringify(version.pages, null, 2)},
  metrics: ${JSON.stringify(version.metrics, null, 2)},
  kanban: ${JSON.stringify(version.kanban || null, null, 2)}
};

// 4. Main Component Export
export default function ${sanitizeComponentName(version.appName)}() {
  const [activeTab, setActiveTab] = useState('${version.pages[0]?.id || 'p1'}');
  const [records, setRecords] = useState(initial${capitalize(version.tables[0]?.id || 'data')}Data);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="p-4 bg-white border-b flex justify-between items-center shadow-xs">
        <div>
          <h1 className="text-lg font-bold">{appConfig.name}</h1>
          <p className="text-xs text-slate-500">{appConfig.tagline}</p>
        </div>
        <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700">
          ${version.quickActionLabel || '+ Tambah Data'}
        </button>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {appConfig.metrics.map(m => (
            <div key={m.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500">{m.label}</span>
              <div className="text-lg font-bold text-slate-900 mt-1">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Dynamic Interactive Page View */}
        <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex gap-2 border-b pb-2 mb-4">
            {appConfig.pages.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={\`px-3 py-1 text-xs font-semibold rounded-md \${activeTab === p.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}\`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            Tabel aktif menampung {records.length} data record.
          </p>
        </section>
      </main>
    </div>
  );
}
`;
}

function capitalize(s: string): string {
  if (!s) return 'Item';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function sanitizeComponentName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '') || 'LegoApp';
}
