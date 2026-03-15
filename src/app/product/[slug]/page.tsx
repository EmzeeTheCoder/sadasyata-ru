import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import BuyButton from '@/components/product/BuyButton';
import { getProductDetail, getProductReviews, getSellerProducts, getUsdRate } from '@/lib/digiseller';
import { Star, CheckCircle, Zap, Shield } from 'lucide-react';

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const id = parseInt(slug);
  if (isNaN(id)) return {};
  const product = await getProductDetail(id);
  if (!product) return {};
  return {
    title: product.name,
    description: `Купить ${product.name} с мгновенной доставкой. Цена: ${product.price} ₽.`,
    openGraph: {
      title: product.name,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default async function ProductPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const id = parseInt(slug);
  if (isNaN(id)) notFound();

  const [product, reviews, { products: related }, usdRate] = await Promise.all([
    getProductDetail(id),
    getProductReviews(id, 'ru-RU'),
    getSellerProducts(1, 8, 'RUR', 'ru-RU'),
    getUsdRate(),
  ]);

  if (!product) notFound();

  const relatedProducts = related.filter((p) => p.id !== product.id).slice(0, 4);
  const priceRub = Math.round(product.price_rub || product.price).toLocaleString('ru-RU');
  const priceUsd = ((product.price_usd) || (product.price / usdRate)).toFixed(2);

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-brand-gray mb-8">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link>
            <span>/</span>
            <span className="text-white line-clamp-1">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-brand-dark-3 border border-white/5">
              {product.image_url ? (
                <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield size={48} className="text-brand-orange opacity-30" />
                </div>
              )}
            </div>

            <div>
              <h1 className="font-display text-3xl sm:text-4xl text-white mb-4 leading-snug">{product.name}</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-400/10 border border-green-400/20 rounded-full text-xs text-green-400">
                  <CheckCircle size={11} /> В наличии
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-xs text-brand-orange">
                  <Zap size={11} fill="currentColor" /> Мгновенная доставка
                </span>
              </div>

              <div className="p-5 bg-brand-dark-2 border border-white/5 rounded-2xl mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl text-brand-orange">{priceRub} ₽</span>
                  <span className="text-lg text-brand-gray">${priceUsd}</span>
                </div>
              </div>

              <BuyButton productId={product.id} />

              <div className="mt-8 p-5 bg-brand-dark-2 border border-white/5 rounded-2xl">
                <h3 className="text-sm font-semibold text-white mb-4">Как купить</h3>
                <div className="space-y-3">
                  {['Нажмите «Купить сейчас»', 'Оплатите удобным способом на Digiseller', 'Получите ключ мгновенно после оплаты'].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</div>
                      <p className="text-sm text-brand-gray">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {product.description && (
            <div className="mb-20">
              <h2 className="font-display text-2xl text-white mb-6">Описание</h2>
              <div className="text-brand-gray leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}

          {reviews.length > 0 && (
            <div className="mb-20">
              <h2 className="font-display text-2xl text-white mb-6">Отзывы · <span className="text-brand-orange">{reviews.length}</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-5 bg-brand-dark-2 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? 'text-yellow-400' : 'text-brand-gray/30'} fill={i < review.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <p className="text-sm text-brand-gray leading-relaxed mb-3">"{review.text}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white">{review.author}</span>
                      <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle size={10} /> Проверено</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {relatedProducts.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-white mb-6">Похожие товары</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} usdRate={usdRate} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
