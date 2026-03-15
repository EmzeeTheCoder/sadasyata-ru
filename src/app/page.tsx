import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/ui/Hero';
import TrustBar from '@/components/ui/TrustBar';
import CategoryGrid from '@/components/ui/CategoryGrid';
import FeaturedProducts from '@/components/ui/FeaturedProducts';
import ReviewsSection from '@/components/ui/ReviewsSection';
import PromoBanner from '@/components/ui/PromoBanner';
import { getSellerProducts, getProductReviews, getUsdRate } from '@/lib/digiseller';

export const metadata: Metadata = {
  title: 'Sadasyata — Цифровые товары для России и СНГ',
  description:
    'Купите лицензионные ключи PS5, Xbox, AI-инструменты и подписки по лучшим ценам. Мгновенная доставка. Проверенный продавец на Digiseller.',
  keywords: ['цифровые товары', 'игровые ключи', 'PS5 ключи', 'Xbox ключи', 'AI подписки', 'купить онлайн'],
  openGraph: {
    title: 'Sadasyata — Цифровые товары',
    description: 'Лицензионные ключи и подписки с мгновенной доставкой',
    url: 'https://ru.sadasyata.in',
    type: 'website',
  },
};

export default async function HomePage() {
  // Fetch data server-side — fast, SEO-friendly, API key stays hidden
  const [{ products }, usdRate] = await Promise.all([
    getSellerProducts(1, 20, 'RUB', 'ru-RU'),
    getUsdRate(),
  ]);

  // Try to get reviews from first product
  const reviews = products.length
    ? await getProductReviews(products[0].id, 'ru-RU')
    : [];

  return (
    <>
      <Header />
      <main className="noise-overlay">
        <Hero />
        <TrustBar />
        <PromoBanner />
        <FeaturedProducts products={products} usdRate={usdRate} />
        <CategoryGrid />
        <ReviewsSection reviews={reviews} />
      </main>
      <Footer />
    </>
  );
}
