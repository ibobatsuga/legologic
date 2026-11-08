import { CreditWallet, AppPlan } from '@/types/legologic';

export interface AppTierDetails {
  id: AppPlan;
  name: string;
  tagline: string;
  priceIdr: number;
  badge?: string;
  aiCredits: number;
  cloudMonths: number;
  maxRecords: number;
  features: string[];
}

export const APP_TIERS: Record<'MINIMAL' | 'STANDAR' | 'OPTIMAL', AppTierDetails> = {
  MINIMAL: {
    id: 'MINIMAL',
    name: 'Minimal',
    tagline: 'Cocok untuk validasi ide bisnis, form data, atau portofolio sederhana',
    priceIdr: 19000,
    aiCredits: 30,
    cloudMonths: 1,
    maxRecords: 250,
    features: [
      '1 Aplikasi Web Bisnis Aktif',
      '30 Kredit AI Build & Revisi (GENESIS AI)',
      'Subdomain Instan .genesis.id',
      'Penyimpanan hingga 250 baris data',
      'Responsif Mobile, Tablet & Desktop'
    ]
  },
  STANDAR: {
    id: 'STANDAR',
    name: 'Standar',
    tagline: 'Pilihan paling populer untuk operasional harian UMKM, CRM, atau booking',
    priceIdr: 49000,
    badge: 'PALING POPULER',
    aiCredits: 100,
    cloudMonths: 6,
    maxRecords: 2500,
    features: [
      '1 Aplikasi Web Bisnis Aktif',
      '100 Kredit AI Build & Revisi',
      'Subdomain Kustom Pilihan Sendiri',
      'Penyimpanan hingga 2.500 baris data',
      'Database Explorer & Ekspor CSV',
      'Riwayat Versi & 1-Click Rollback'
    ]
  },
  OPTIMAL: {
    id: 'OPTIMAL',
    name: 'Optimal',
    tagline: 'Kapasitas maksimal untuk proyek agensi, volume data besar, & performa tinggi',
    priceIdr: 99000,
    badge: 'REKOMENDASI',
    aiCredits: 250,
    cloudMonths: 12,
    maxRecords: 10000,
    features: [
      '1 Aplikasi Web Bisnis Aktif',
      '250 Kredit AI Build & Revisi Prioritas',
      'Subdomain Kustom Bebas Pilih',
      'Penyimpanan Data Tak Terbatas',
      'Backup Otomatis & Kecepatan Tinggi',
      'Akses Tim & Kolaborasi Multi-user'
    ]
  }
};

export interface LimitCheckResult {
  allowed: boolean;
  reason?: string;
  metric: 'ai_credits' | 'cloud_credits' | 'max_apps' | 'seats';
  currentValue: number;
  maxValue: number;
}

export function checkLimit(
  action: 'generate_app' | 'revise_app' | 'publish_app' | 'invite_member',
  wallet: CreditWallet,
  currentAppCount: number,
  currentMemberCount: number
): LimitCheckResult {
  if (action === 'generate_app') {
    const neededAi = 5;
    if (wallet.aiCredits < neededAi) {
      return {
        allowed: false,
        reason: `Saldo Kredit AI tidak mencukupi untuk build baru (butuh ${neededAi} kredit, sisa ${wallet.aiCredits}). Silakan pilih paket aplikasi.`,
        metric: 'ai_credits',
        currentValue: wallet.aiCredits,
        maxValue: wallet.aiMaxCredits,
      };
    }
  }

  if (action === 'revise_app') {
    const neededAi = 2;
    if (wallet.aiCredits < neededAi) {
      return {
        allowed: false,
        reason: `Saldo Kredit AI tidak mencukupi untuk revisi (butuh ${neededAi} kredit, sisa ${wallet.aiCredits}).`,
        metric: 'ai_credits',
        currentValue: wallet.aiCredits,
        maxValue: wallet.aiMaxCredits,
      };
    }
  }

  return {
    allowed: true,
    metric: 'ai_credits',
    currentValue: wallet.aiCredits,
    maxValue: wallet.aiMaxCredits,
  };
}
