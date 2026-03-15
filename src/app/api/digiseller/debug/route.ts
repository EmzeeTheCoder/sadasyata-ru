import { NextResponse } from 'next/server';

// Temporary debug route — delete after confirming products load
// Visit: https://your-domain/api/digiseller/debug
export async function GET() {
  const SELLER_ID = process.env.DIGISELLER_SELLER_ID || '1371985';
  const results: Record<string, any> = {
    seller_id: SELLER_ID,
    env_api_key_set: !!process.env.DIGISELLER_API_KEY,
  };

  try {
    const url = `https://api.digiseller.com/api/shop/products?seller_id=${SELLER_ID}&category_id=0&page=1&rows=5&currency=RUR&lang=ru-RU`;
    results.url_tested = url;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    results.http_status = res.status;
    const text = await res.text();
    results.raw_preview = text.slice(0, 600);
    try {
      const json = JSON.parse(text);
      results.retval = json.retval;
      results.totalItems = json.totalItems;
      results.product_count = Array.isArray(json.product) ? json.product.length : 0;
      results.first_product_name = Array.isArray(json.product) ? json.product[0]?.name : null;
      results.STATUS = (json.retval === '0' || json.retval === 0) ? '✅ API WORKING' : '❌ API ERROR';
    } catch {
      results.parse_error = 'Response is not valid JSON';
    }
  } catch (e: any) {
    results.fetch_error = e.message;
    results.STATUS = '❌ NETWORK ERROR';
  }

  return NextResponse.json(results, { status: 200 });
}
