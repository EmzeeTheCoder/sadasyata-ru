import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { getSellerProducts, getUsdRate } from '@/lib/digiseller';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Каталог цифровых товаров',
  description: 'Все цифровые товары Sadasyata: игровые ключи PS5 и Xbox, AI-инструменты, подписки. Мгновенная доставка.',
};

const CATEGORIES = [
  { href: '/catalog', label: 'Все' },
  { href: '/ps5', label: 'PS5' },
  { href: '/xbox', label: 'Xbox' },
  { href: '/ai-tools', label: 'AI Инструменты' },
  { href: '/subscriptions', label: 'Подписки' },
];

export default async function CatalogPage() {
  const [{ products, total }, usdRate] = await Promise.all([
    getSellerProducts(1, 50, 'RUB', 'ru-RU'),
    getUsdRate(),
  ]);

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page header */}
          <div className="mb-10">
            <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">Каталог</h1>
            <p className="text-brand-gray">
              {total > 0 ? `${total} товаров` : 'Загрузка...'}
            </p>
          </div>

          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="px-4 py-2 text-sm rounded-xl border border-white/10 hover:border-brand-orange/40 hover:text-brand-orange text-brand-gray transition-all"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Products grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} usdRate={usdRate} priority={i < 4} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-brand-gray">
              <ArrowUpDown size={40} className="mb-4 opacity-30" />
              <p className="text-lg">Товары загружаются...</p>
              <p className="text-sm mt-2">Попробуйте обновить страницу</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
