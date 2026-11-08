import { NextResponse } from 'next/server';
import { callSakelarBuilder } from '@/lib/sakelar-ai';
import { checkLimit } from '@/lib/limits';
import { CreditWallet } from '@/types/legologic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, mode = 'build', appName, category, wallet, currentAppCount = 0 } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt wajib diisi' }, { status: 400 });
    }

    // Verify limit if wallet is supplied
    if (wallet) {
      const check = checkLimit('generate_app', wallet as CreditWallet, currentAppCount, 1);
      if (!check.allowed) {
        return NextResponse.json({ error: check.reason, limitExceeded: true }, { status: 403 });
      }
    }

    const result = await callSakelarBuilder({
      prompt,
      mode,
      appName,
      category,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/ai/generate error:', error);
    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan saat memproses permintaan ke GENESIS AI.' },
      { status: 500 }
    );
  }
}
