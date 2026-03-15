import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import type { DigiProduct } from '@/lib/digiseller';

export default function FeaturedProducts({
  products,
  usdRate,
}: {
  products: DigiProduct[];
  usdRate: number;
}) {
  if (!products.length) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-2">Популярные товары</h2>
            <p className="text-brand-gray">Самые востребованные позиции</p>
          </div>
          <Link
            href="/catalog"
            className="hidden sm:flex items-center gap-2 text-sm text-brand-orange hover:text-brand-orange-light transition-colors"
          >
            Все товары <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.slice(0, 8).map((product, i) => (
            <ProductCard key={product.id} product={product} usdRate={usdRate} priority={i < 4} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark-3 border border-white/10 rounded-xl text-sm text-white hover:bg-brand-dark-4 transition-all"
          >
            Смотреть все товары <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
