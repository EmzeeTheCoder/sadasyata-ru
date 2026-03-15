import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="font-display text-[120px] sm:text-[180px] leading-none gradient-text mb-4">
            404
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-white mb-4">
            Страница не найдена
          </h1>
          <p className="text-brand-gray mb-10 max-w-md mx-auto">
            Возможно, товар был удалён или ссылка устарела
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange hover:bg-brand-orange-light text-white font-semibold rounded-2xl transition-all"
          >
            На главную
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
