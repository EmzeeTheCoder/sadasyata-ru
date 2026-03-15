import { NextRequest, NextResponse } from 'next/server';
import { getSellerProducts } from '@/lib/digiseller';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const rows = parseInt(searchParams.get('rows') || '20');
  const currency = searchParams.get('currency') || 'RUB';
  const lang = searchParams.get('lang') || 'ru-RU';

  const data = await getSellerProducts(page, rows, currency, lang);
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
