const SELLER_ID = process.env.DIGISELLER_SELLER_ID || '1371985';
const API_BASE = 'https://api.digiseller.com/api';

export interface DigiProduct {
  id: number;
  name: string;
  price: number;
  price_usd?: number;
  price_rub?: number;
  currency: string;
  info: string;
  image_url?: string;
  cnt_sell?: number;
  rating?: number;
  category_id?: number;
  in_stock?: number;
  has_discount?: number;
}

export interface DigiCategory {
  id: number;
  name: string;
  cnt_goods?: number;
}

export interface DigiReview {
  id: number;
  author: string;
  text: string;
  rating: number;
  date: string;
}

export interface DigiProductDetail extends DigiProduct {
  description?: string;
}

// Image URL — confirmed working from debug output (cntImg > 0)
function getImageUrl(productId: number, cntImg: string | number): string | undefined {
  return parseInt(String(cntImg)) > 0
    ? `https://graph.digiseller.ru/img.ashx?id_d=${productId}&maxlength=400`
    : undefined;
}

// Strip HTML tags from info for plain text previews
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
}

// PUBLIC endpoint — no auth needed
export async function getSellerProducts(
  page = 1,
  rows = 20,
  currency = 'RUR',
  lang = 'ru-RU',
  categoryId = 0
): Promise<{ products: DigiProduct[]; total: number; totalPages: number }> {
  try {
    const url = `${API_BASE}/shop/products?seller_id=${SELLER_ID}&category_id=${categoryId}&page=${page}&rows=${rows}&currency=${currency}&lang=${lang}`;

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error('[Digiseller] HTTP error:', res.status);
      return { products: [], total: 0, totalPages: 0 };
    }

    const data = await res.json();

    if (data.retval !== '0' && data.retval !== 0) {
      console.error('[Digiseller] API error retval:', data.retval, data.retdesc);
      return { products: [], total: 0, totalPages: 0 };
    }

    const rawProducts: any[] = Array.isArray(data.product) ? data.product : [];

    const products: DigiProduct[] = rawProducts.map((p) => ({
      id: parseInt(p.id),
      name: p.name || '',
      // Use price_rub directly — it's the confirmed RUB price from API
      price: parseFloat(p.price_rub || p.price) || 0,
      price_usd: p.price_usd ? parseFloat(p.price_usd) : undefined,
      price_rub: p.price_rub ? parseFloat(p.price_rub) : undefined,
      currency: 'RUR',
      info: stripHtml(p.info || ''),
      image_url: getImageUrl(parseInt(p.id), p.cntImg),
      in_stock: p.is_available === 1 || p.is_available === '1' ? 1 : 0,
      has_discount: parseInt(p.has_discount) || 0,
    }));

    return {
      products,
      total: parseInt(data.totalItems) || products.length,
      totalPages: parseInt(data.totalPages) || 1,
    };
  } catch (e) {
    console.error('[Digiseller] getSellerProducts exception:', e);
    return { products: [], total: 0, totalPages: 0 };
  }
}

export async function getProductDetail(
  productId: number,
  currency = 'RUR',
  lang = 'ru-RU'
): Promise<DigiProductDetail | null> {
  try {
    // First try the descriptions endpoint
    const url = `${API_BASE}/products/product?ids=${productId}&currency=${currency}&lang=${lang}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = await res.json();
      const item = Array.isArray(data) ? data[0] : data;
      if (item && (item.id || item.id_goods)) {
        const pid = parseInt(item.id || item.id_goods);
        return {
          id: pid,
          name: item.name || item.name_goods || '',
          price: parseFloat(item.price_rub || item.price) || 0,
          price_usd: item.price_usd ? parseFloat(item.price_usd) : undefined,
          price_rub: item.price_rub ? parseFloat(item.price_rub) : undefined,
          currency: 'RUR',
          info: stripHtml(item.info || ''),
          description: item.info || '',
          image_url: getImageUrl(pid, item.cntImg || 1),
          in_stock: 1,
        };
      }
    }

    // Fallback: scan full product list
    const { products } = await getSellerProducts(1, 200, currency, lang);
    const found = products.find((p) => p.id === productId);
    if (found) {
      return { ...found, description: found.info };
    }
    return null;
  } catch (e) {
    console.error('[Digiseller] getProductDetail exception:', e);
    return null;
  }
}

export async function getProductReviews(
  productId: number,
  lang = 'ru-RU'
): Promise<DigiReview[]> {
  try {
    const url = `${API_BASE}/reviews/product?id_goods=${productId}&type=1&owner_id=${SELLER_ID}&lang=${lang}&page=1&rows=10`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.rows || []).map((r: any) => ({
      id: r.id || Math.random(),
      author: r.author || 'Покупатель',
      text: r.text || r.comment || '',
      rating: r.grade || r.rating || 5,
      date: r.date_add || r.date || '',
    }));
  } catch {
    return [];
  }
}

export async function getCategories(lang = 'ru-RU'): Promise<DigiCategory[]> {
  try {
    const url = `${API_BASE}/categories?seller_id=${SELLER_ID}&lang=${lang}&format=json`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const cats = data?.category || [];
    return (Array.isArray(cats) ? cats : [cats]).map((c: any) => ({
      id: parseInt(c.id),
      name: c.name || c.n || '',
      cnt_goods: parseInt(c.cnt) || 0,
    }));
  } catch {
    return [];
  }
}

// Uses Digiseller's own currency API
export async function getUsdRate(): Promise<number> {
  try {
    const res = await fetch(
      'https://api.digiseller.com/api/currency-rates?currency=WMR',
      {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) throw new Error('rate fetch failed');
    const data = await res.json();
    // Find USD rate in response
    const usdEntry = (data?.data || data || []).find(
      (r: any) => r.currency === 'WMZ' || r.to === 'WMZ'
    );
    return usdEntry?.value ? parseFloat(usdEntry.value) : 90;
  } catch {
    // Fallback to free exchange rate API
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
        next: { revalidate: 3600 },
      });
      const data = await res.json();
      return data?.rates?.RUB || 90;
    } catch {
      return 90;
    }
  }
}

export function getBuyLink(productId: number): string {
  return `https://www.digiseller.market/asp2/pay_wm.asp?id_d=${productId}`;
}

export { SELLER_ID };
