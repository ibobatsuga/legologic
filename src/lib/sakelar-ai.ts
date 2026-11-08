import { AppVersion, BuilderMode } from '@/types/legologic';

const SAKELAR_API_BASE = process.env.SAKELAR_API_BASE || 'https://api.sakelar.web.id/v1';
const SAKELAR_API_KEY = process.env.SAKELAR_API_KEY || '';
const SAKELAR_MODEL = process.env.SAKELAR_MODEL || 'claude-sonnet-4.6';

export interface SakelarGenerateRequest {
  prompt: string;
  mode: BuilderMode;
  appName?: string;
  category?: string;
  existingVersion?: AppVersion;
}

export interface SakelarGenerateResponse {
  version: AppVersion;
  planSummary?: string;
  creditsUsed: {
    ai: number;
    cloud: number;
  };
  explanation: string;
}

const SYSTEM_PROMPT_BUILDER = `
Anda adalah GENESIS AI Engine — arsitek aplikasi bisnis handal kelas enterprise.
Tugas Anda adalah merancang dan menyusun web application bisnis siap-pakai untuk pemilik usaha non-teknis di Indonesia.

PRINSIP DESAIN:
1. Praktis & bernilai bisnis nyata (misal: CRM, Portal Klien, Booking, Stok Barang, Invoicing).
2. Data model realistis dan lengkap: nama field intuitif dalam Bahasa Indonesia, tipe data tepat, serta contoh data awal yang masuk akal (3-5 baris per tabel).
3. Nilai moneter dalam Rupiah (Rp).
4. Sediakan metriks ringkasan bisnis (KPI stats cards: total omset, leads aktif, persentase konversi).
5. Bila relevan, sediakan konfigurasi Kanban Pipeline visual untuk perpindahan status.
6. Warna tema profesional (default aksen Lego: Biru #2563EB, Kuning #F59E0B, Merah #EF4444).

FORMAT KELUARAN:
Wajib memberikan output berupa JSON valid dalam format:
\`\`\`json
{
  "explanation": "Penjelasan singkat dalam bahasa Indonesia mengenai apa yang telah dibangun atau diubah.",
  "planSummary": "Rencana modul arsitektur (opsional)",
  "version": {
    "versionNumber": 1,
    "appName": "Nama Aplikasi",
    "tagline": "Slogan singkat bisnis",
    "changelog": "Ringkasan versi ini",
    "primaryColor": "#2563EB",
    "accentColor": "#F59E0B",
    "quickActionLabel": "+ Tambah Data Baru",
    "quickActionTargetTable": "id_tabel_utama",
    "metrics": [
      {
        "id": "m1",
        "label": "Nama Metrik",
        "value": "123",
        "change": "+15% bulan ini",
        "trend": "up",
        "icon": "Users",
        "color": "blue"
      }
    ],
    "pages": [
      {
        "id": "p1",
        "name": "Dashboard & Pipeline",
        "icon": "Kanban",
        "type": "kanban",
        "tableId": "leads",
        "description": "Deskripsi fungsi halaman"
      },
      {
        "id": "p2",
        "name": "Database Kontak",
        "icon": "Table",
        "type": "table",
        "tableId": "leads"
      }
    ],
    "tables": [
      {
        "id": "leads",
        "name": "Daftar Kontak Prospek",
        "primaryKey": "id",
        "columns": [
          { "key": "nama", "label": "Nama Lengkap", "type": "text", "required": true },
          { "key": "whatsapp", "label": "Nomor WhatsApp", "type": "phone", "required": true },
          { "key": "status", "label": "Status", "type": "status", "options": ["Baru", "Follow-up", "Closing", "Batal"] },
          { "key": "nilai", "label": "Nilai Transaksi (Rp)", "type": "currency" }
        ],
        "records": [
          { "id": "1", "nama": "Contoh Nama", "whatsapp": "08123456789", "status": "Baru", "nilai": 5000000 }
        ]
      }
    ],
    "kanban": {
      "enabled": true,
      "tableId": "leads",
      "statusColumnKey": "status",
      "titleColumnKey": "nama",
      "subtitleColumnKey": "whatsapp",
      "valueColumnKey": "nilai",
      "stages": [
        { "id": "Baru", "name": "Baru", "color": "#3B82F6" },
        { "id": "Follow-up", "name": "Follow-up", "color": "#F59E0B" },
        { "id": "Closing", "name": "Closing", "color": "#10B981" },
        { "id": "Batal", "name": "Batal", "color": "#EF4444" }
      ]
    }
  }
}
\`\`\`
`;

function extractJson(rawText: string): any {
  try {
    // Try pure parse first
    return JSON.parse(rawText.trim());
  } catch (err) {
    // Try extract from ```json ... ```
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1].trim());
    }

    // Try finding the first { to the last }
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = rawText.substring(firstBrace, lastBrace + 1);
      return JSON.parse(candidate);
    }

    throw new Error('Gagal mengekstrak struktur JSON valid dari respon AI: ' + rawText.substring(0, 150));
  }
}

export async function callSakelarBuilder(req: SakelarGenerateRequest): Promise<SakelarGenerateResponse> {
  const isRevision = !!req.existingVersion;
  const targetVersionNumber = isRevision ? req.existingVersion!.versionNumber + 1 : 1;

  let userPrompt = '';
  if (req.mode === 'plan') {
    userPrompt = `Mode: PLAN.
Analisis kebutuhan bisnis berikut dan susun rencana arsitektur aplikasi (tabel, field, KPI metriks, alur proses):
Kebutuhan: "${req.prompt}"
Nama App: ${req.appName || 'App Bisnis'}
Kategori: ${req.category || 'Bisnis'}`;
  } else if (isRevision) {
    userPrompt = `Mode: REVISION (Versi target: ${targetVersionNumber}).
Aplikasi yang sudah ada:
- Nama: ${req.existingVersion!.appName}
- Tagline: ${req.existingVersion!.tagline}
- Tabel yang ada: ${req.existingVersion!.tables.map(t => `${t.name} (${t.id}): ${t.columns.map(c => c.key).join(', ')}`).join(' | ')}
- Metriks: ${req.existingVersion!.metrics.map(m => m.label).join(', ')}

Permintaan Perubahan dari Pengguna:
"${req.prompt}"

Instruksi:
Perbarui skema versi aplikasi dengan menggabungkan perubahan yang diminta. Pertahankan data yang ada bila cocok, tambahkan atau modifikasi kolom/tabel/halaman sesuai permintaan. Naikkan versionNumber menjadi ${targetVersionNumber}. Berikan changelog jelas di properti 'changelog'.`;
  } else {
    userPrompt = `Mode: BUILD (Versi 1).
Buatkan aplikasi bisnis lengkap berdasarkan instruksi berikut:
"${req.prompt}"
Nama Rekomendasi: ${req.appName || 'Lego App'}
Kategori: ${req.category || 'Bisnis'}`;
  }

  const payload = {
    model: SAKELAR_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT_BUILDER },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.3,
  };

  const response = await fetch(`${SAKELAR_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SAKELAR_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI Engine error (${response.status}): ${errorText}`);
  }

  const jsonResult = await response.json();
  const rawReply = jsonResult.choices?.[0]?.message?.content || '';

  const parsed = extractJson(rawReply);

  const finalVersion: AppVersion = {
    ...parsed.version,
    versionNumber: targetVersionNumber,
    createdAt: new Date().toISOString(),
    mode: req.mode,
    promptUsed: req.prompt,
    changelog: parsed.version.changelog || (isRevision ? `Revisi v${targetVersionNumber}: ${req.prompt.substring(0, 40)}` : 'Versi perdana dibuat.'),
  };

  return {
    version: finalVersion,
    planSummary: parsed.planSummary,
    explanation: parsed.explanation || 'Aplikasi berhasil disusun sesuai permintaan Anda.',
    creditsUsed: {
      ai: isRevision ? 2 : 5,
      cloud: 1,
    }
  };
}
