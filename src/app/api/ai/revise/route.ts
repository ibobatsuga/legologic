import { NextResponse } from 'next/server';
import { callSakelarBuilder } from '@/lib/sakelar-ai';
import { checkLimit } from '@/lib/limits';
import { CreditWallet } from '@/types/legologic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, existingVersion, wallet, mode = 'build' } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Instruksi revisi wajib diisi' }, { status: 400 });
    }

    if (!existingVersion) {
      return NextResponse.json({ error: 'Versi aplikasi sebelumnya diperlukan untuk revisi' }, { status: 400 });
    }

    // Verify limit
    if (wallet) {
      const check = checkLimit('revise_app', wallet as CreditWallet, 1, 1);
      if (!check.allowed) {
        return NextResponse.json({ error: check.reason, limitExceeded: true }, { status: 403 });
      }
    }

    const result = await callSakelarBuilder({
      prompt,
      mode,
      appName: existingVersion.appName,
      existingVersion,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/ai/revise error:', error);
    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan saat memproses revisi dengan Sakelar AI.' },
      { status: 500 }
    );
  }
}
