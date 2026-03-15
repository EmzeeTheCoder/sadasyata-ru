import { NextResponse } from 'next/server';
import { getToken, getSellerProducts } from '@/lib/digiseller';

// Visit /api/digiseller/debug to see what's happening
// REMOVE THIS FILE before going live in production
export async function GET() {
  const apiKey = process.env.DIGISELLER_API_KEY;
  const sellerId = process.env.DIGISELLER_SELLER_ID;

  if (!apiKey || !sellerId) {
    return NextResponse.json({
      error: 'Missing env vars',
      DIGISELLER_API_KEY: apiKey ? '✅ set' : '❌ MISSING',
      DIGISELLER_SELLER_ID: sellerId ? '✅ set' : '❌ MISSING',
    }, { status: 500 });
  }

  const token = await getToken();
  if (!token) {
    return NextResponse.json({
      error: 'Token failed — check your API key is correct and has permissions',
      DIGISELLER_API_KEY: '✅ set (but may be wrong)',
      DIGISELLER_SELLER_ID: sellerId,
      hint: 'Go to my.digiseller.com/inside/api_keys.asp and create a new key with full permissions',
    }, { status: 401 });
  }

  const { products, total } = await getSellerProducts(1, 5);
  return NextResponse.json({
    status: '✅ Everything working',
    token: token.slice(0, 8) + '...',
    seller_id: sellerId,
    total_products: total,
    first_5_products: products.map(p => ({ id: p.id, name: p.name, price: p.price })),
  });
}
