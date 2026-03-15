import { NextResponse } from 'next/server';
import { getUsdRate } from '@/lib/digiseller';

export async function GET() {
  const rate = await getUsdRate();
  return NextResponse.json({ rate }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
  });
}
