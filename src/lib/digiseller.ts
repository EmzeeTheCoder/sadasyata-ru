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
  in_stock?: number;
  has_discount?: number;
}

export interface DigiVariant {
  id: string;
  name: string;
  price_modifier: number; // additional cost in USD
  currency: string;
}

export interface DigiCategory {
  id: number;
  name: string;
  cnt_goods?: number;
}

export interface DigiReview {
  id: number | string;
  author: string;
  text: string;
  rating: number; // 1 = thumbs up, -1 = thumbs down (Digiseller uses this)
  date: string;
  positive: boolean;
  seller_reply?: string;
}

export interface DigiProductDetail extends DigiProduct {
  description?: string;       // raw HTML with <delivery>/<внимание> tags
  cnt_sell_total?: number;
  variants?: DigiVariant[];
}

function getImageUrl(productId: number, cntImg: string | number): string | undefined {
  return parseInt(String(cntImg)) > 0
    ? `https://graph.digiseller.ru/img.ashx?id_d=${productId}&maxlength=400`
    : undefined;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
}

// ─── Public product listing ────────────────────────────────────────────────
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
    if (!res.ok) return { products: [], total: 0, totalPages: 0 };
    const data = await res.json();
    if (data.retval !== '0' && data.retval !== 0) return { products: [], total: 0, totalPages: 0 };

    const rawProducts: any[] = Array.isArray(data.product) ? data.product : [];
    const products: DigiProduct[] = rawProducts.map((p) => ({
      id: parseInt(p.id),
      name: p.name || '',
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
    console.error('[Digiseller] getSellerProducts:', e);
    return { products: [], total: 0, totalPages: 0 };
  }
}

// ─── Product detail — gets full info including variants ─────────────────────
export async function getProductDetail(
  productId: number,
  currency = 'RUR',
  lang = 'ru-RU'
): Promise<DigiProductDetail | null> {
  try {
    // This endpoint returns full info_html + options/variants
    const url = `${API_BASE}/products/product?ids=${productId}&currency=${currency}&lang=${lang}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = await res.json();
      const item = Array.isArray(data) ? data[0] : data;

      if (item) {
        const pid = parseInt(item.id || item.id_goods || productId);

        // Parse variants/options if present
        const variants: DigiVariant[] = [];
        const options = item.options || item.parameters || [];
        if (Array.isArray(options)) {
          for (const opt of options) {
            const vals = opt.variants || opt.values || [];
            for (const v of vals) {
              variants.push({
                id: String(v.id || v.value || ''),
                name: v.name || v.value || '',
                price_modifier: parseFloat(v.price_modifier || v.price || 0),
                currency: v.currency || 'USD',
              });
            }
          }
        }

        return {
          id: pid,
          name: item.name || item.name_goods || '',
          price: parseFloat(item.price_rub || item.price) || 0,
          price_usd: item.price_usd ? parseFloat(item.price_usd) : undefined,
          price_rub: item.price_rub ? parseFloat(item.price_rub) : undefined,
          currency: 'RUR',
          info: stripHtml(item.info || ''),
          // IMPORTANT: keep raw HTML — includes <delivery>/<внимание> tags
          description: item.info_html || item.info || '',
          image_url: getImageUrl(pid, item.cntImg || 1),
          cnt_sell_total: parseInt(item.cnt_sell) || undefined,
          in_stock: 1,
          variants: variants.length > 0 ? variants : undefined,
        };
      }
    }

    // Fallback: get from listing + raw info
    const listUrl = `${API_BASE}/shop/products?seller_id=${SELLER_ID}&category_id=0&page=1&rows=200&currency=${currency}&lang=${lang}`;
    const listRes = await fetch(listUrl, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });
    if (listRes.ok) {
      const listData = await listRes.json();
      const raw = (listData.product || []).find((p: any) => parseInt(p.id) === productId);
      if (raw) {
        return {
          id: productId,
          name: raw.name || '',
          price: parseFloat(raw.price_rub || raw.price) || 0,
          price_usd: raw.price_usd ? parseFloat(raw.price_usd) : undefined,
          price_rub: raw.price_rub ? parseFloat(raw.price_rub) : undefined,
          currency: 'RUR',
          info: stripHtml(raw.info || ''),
          description: raw.info || '',
          image_url: getImageUrl(productId, raw.cntImg),
          in_stock: 1,
        };
      }
    }
    return null;
  } catch (e) {
    console.error('[Digiseller] getProductDetail:', e);
    return null;
  }
}

// ─── Reviews — Digiseller uses thumbs up/down not stars ────────────────────
export async function getProductReviews(
  productId: number,
  lang = 'ru-RU'
): Promise<DigiReview[]> {
  try {
    // type=1 = positive, type=2 = negative, type=0 = all
    const url = `${API_BASE}/reviews/product?id_goods=${productId}&type=0&owner_id=${SELLER_ID}&lang=${lang}&page=1&rows=20`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 600 },
    });
    if (!res.ok) {
      console.error('[Digiseller] reviews HTTP error:', res.status);
      return [];
    }
    const data = await res.json();
    console.log('[Digiseller] reviews raw:', JSON.stringify(data).slice(0, 300));

    const rows = data?.rows || data?.reviews || data?.data || [];
    return rows.map((r: any) => ({
      id: r.id || r.id_review || Math.random(),
      author: r.author || r.author_name || r.buyer || 'Покупатель',
      text: r.text || r.comment || r.review || '',
      rating: r.grade || r.rating || r.score || 1,
      positive: (r.grade || r.rating || 1) > 0,
      date: r.date_add || r.date || r.created_at || '',
      seller_reply: r.seller_answer || r.reply || undefined,
    }));
  } catch (e) {
    console.error('[Digiseller] getProductReviews:', e);
    return [];
  }
}

// ─── Categories ────────────────────────────────────────────────────────────
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

// ─── Exchange rate ──────────────────────────────────────────────────────────
export async function getUsdRate(): Promise<number> {
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

export function getBuyLink(productId: number): string {
  return `https://www.digiseller.market/asp2/pay_wm.asp?id_d=${productId}`;
}

export { SELLER_ID };
