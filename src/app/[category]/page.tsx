import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { getSellerProducts, getUsdRate } from '@/lib/digiseller';
import Link from 'next/link';

const CATEGORY_META: Record<string, { title: string; desc: string; label: string }> = {
  ps5: {
    label: 'PS5 Игры',
    title: 'Ключи PS5 — купить дёшево с доставкой',
    desc: 'Лицензионные ключи активации для PlayStation 5. Мгновенная доставка после оплаты.',
  },
  xbox: {
    label: 'Xbox',
    title: 'Ключи Xbox и Game Pass — купить онлайн',
    desc: 'Xbox Game Pass, ключи для игр и подписки. Лучшие цены, мгновенная доставка.',
  },
  'ai-tools': {
    label: 'AI Инструменты',
    title: 'AI инструменты — ChatGPT, Midjourney и другие',
    desc: 'Подписки на AI-сервисы по лучшим ценам. Официальные аккаунты.',
  },
  subscriptions: {
    label: 'Подписки',
    title: 'Профессиональные подписки — купить онлайн',
    desc: 'Подписки на профессиональные сервисы. TradingView, LinkedIn и другие.',
  },
};

export async function generateMetadata(
  props: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await props.params;
  const meta = CATEGORY_META[category];
  if (!meta) return {};
  return { title: meta.title, description: meta.desc };
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_META).map((cat) => ({ category: cat }));
}

export default async function CategoryPage(
  props: { params: Promise<{ category: string }> }
) {
  const { category } = await props.params;
  const meta = CATEGORY_META[category];
  if (!meta) notFound();

  const [{ products }, usdRate] = await Promise.all([
    getSellerProducts(1, 50, 'RUR', 'ru-RU'),
    getUsdRate(),
  ]);

  const keywords: Record<string, string[]> = {
    ps5: ['ps5', 'playstation', 'пс5'],
    xbox: ['xbox', 'game pass'],
    'ai-tools': ['ai', 'chatgpt', 'midjourney', 'tradingview', 'trading'],
    subscriptions: ['подписк', 'premium', 'pro', 'plus', 'tradingview'],
  };

  const kw = keywords[category] || [];
  const filtered = kw.length
    ? products.filter((p) =>
        kw.some((k) => p.name.toLowerCase().includes(k) || p.info.toLowerCase().includes(k))
      )
    : products;

  const displayProducts = filtered.length > 0 ? filtered : products;

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-brand-gray mb-6">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-white">{meta.label}</span>
          </div>
          <div className="mb-10">
            <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">{meta.label}</h1>
            <p className="text-brand-gray max-w-xl">{meta.desc}</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/catalog" className="px-4 py-2 text-sm rounded-xl border border-white/10 text-brand-gray hover:border-brand-orange/40 hover:text-brand-orange transition-all">
              ← Все товары
            </Link>
          </div>
          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} usdRate={usdRate} priority={i < 4} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center text-brand-gray">
              <p className="text-lg">Товары в этой категории скоро появятся</p>
              <Link href="/catalog" className="inline-block mt-4 text-brand-orange hover:underline text-sm">
                Смотреть все товары
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
