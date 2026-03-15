import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import BuyButton from '@/components/product/BuyButton';
import ProductDescription from '@/components/product/ProductDescription';
import ReviewDebug from '@/components/product/ReviewDebug';
import { getProductDetail, getProductReviews, getSellerProducts, getUsdRate } from '@/lib/digiseller';
import { Star, CheckCircle, Zap, Shield, ThumbsUp, ThumbsDown } from 'lucide-react';

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
    description: `Купить ${product.name} с мгновенной доставкой. Цена: ${Math.round(product.price)} ₽.`,
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
  const priceUsd = (product.price_usd || product.price / usdRate).toFixed(2);
  const positiveReviews = reviews.filter((r) => r.positive).length;

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-brand-gray mb-8 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link>
            <span>/</span>
            <span className="text-white line-clamp-1">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-brand-dark-3 border border-white/5">
              {product.image_url ? (
                <Image src={product.image_url} alt={product.name} fill
                  sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield size={48} className="text-brand-orange opacity-30" />
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="font-display text-3xl sm:text-4xl text-white mb-4 leading-snug">
                {product.name}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-400/10 border border-green-400/20 rounded-full text-xs text-green-400">
                  <CheckCircle size={11} /> В наличии
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-xs text-brand-orange">
                  <Zap size={11} fill="currentColor" /> Мгновенная доставка
                </span>
                {product.cnt_sell_total && product.cnt_sell_total > 0 && (
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-brand-gray">
                    {product.cnt_sell_total.toLocaleString('ru-RU')} продано
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="p-5 bg-brand-dark-2 border border-white/5 rounded-2xl mb-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl text-brand-orange">{priceRub} ₽</span>
                  <span className="text-lg text-brand-gray">${priceUsd}</span>
                </div>
              </div>

              {/* Variants — shown if product has options */}
              {product.variants && product.variants.length > 0 && (
                <div className="p-5 bg-brand-dark-2 border border-white/5 rounded-2xl mb-5">
                  <p className="text-xs text-brand-gray mb-3 font-semibold uppercase tracking-wider">Выберите вариант</p>
                  <div className="space-y-2">
                    {product.variants.map((v) => (
                      <div key={v.id} className="flex items-center justify-between p-3 rounded-xl border border-white/10 hover:border-brand-orange/30 transition-colors cursor-pointer">
                        <span className="text-sm text-white">{v.name}</span>
                        {v.price_modifier > 0 && (
                          <span className="text-xs text-brand-orange">+${v.price_modifier}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-brand-gray mt-3">Выберите план на странице оплаты Digiseller</p>
                </div>
              )}

              <BuyButton productId={product.id} />

              {/* How to buy */}
              <div className="mt-5 p-5 bg-brand-dark-2 border border-white/5 rounded-2xl">
                <h3 className="text-sm font-semibold text-white mb-4">Как купить</h3>
                <div className="space-y-3">
                  {[
                    'Нажмите «Купить сейчас»',
                    'Выберите вариант и оплатите на Digiseller',
                    'Получите ключ мгновенно после оплаты',
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-brand-gray">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full Description */}
          {product.description && (
            <div className="mb-20">
              <h2 className="font-display text-2xl text-white mb-6">Описание</h2>
              <div className="max-w-3xl">
                <ProductDescription html={product.description} />
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <h2 className="font-display text-2xl text-white">Отзывы</h2>
              {reviews.length > 0 && (
                <>
                  <span className="px-3 py-1 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-sm text-brand-orange font-semibold">
                    {reviews.length}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-green-400">
                    <ThumbsUp size={14} /> {positiveReviews} положительных
                  </span>
                </>
              )}
            </div>

            {/* Debug: show raw review data in dev */}
            <ReviewDebug reviews={reviews} />

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-5 bg-brand-dark-2 border border-white/5 rounded-2xl hover:border-white/10 transition-colors flex flex-col">
                    {/* Thumbs rating */}
                    <div className="flex items-center gap-2 mb-3">
                      {review.positive ? (
                        <span className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                          <ThumbsUp size={13} fill="currentColor" /> Рекомендует
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400 text-xs font-semibold">
                          <ThumbsDown size={13} fill="currentColor" /> Не рекомендует
                        </span>
                      )}
                      {review.date && (
                        <span className="ml-auto text-xs text-brand-gray">
                          {new Date(review.date).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-brand-gray leading-relaxed mb-4 flex-1">
                      {review.text || '—'}
                    </p>

                    {/* Seller reply */}
                    {review.seller_reply && (
                      <div className="mt-2 p-3 bg-brand-dark-3 border border-brand-orange/20 rounded-lg">
                        <p className="text-xs text-brand-orange font-semibold mb-1">Ответ продавца</p>
                        <p className="text-xs text-brand-gray">{review.seller_reply}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-orange/20 flex items-center justify-center text-xs font-semibold text-brand-orange">
                          {(review.author || 'П').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-medium text-white">{review.author}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <CheckCircle size={10} /> Проверено
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-brand-dark-2 border border-white/5 rounded-2xl text-center text-brand-gray">
                <Star size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Отзывов пока нет. Будьте первым!</p>
              </div>
            )}
          </div>

          {/* Related products */}
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
