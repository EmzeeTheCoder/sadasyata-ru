import { Tag } from 'lucide-react';
import Link from 'next/link';

export default function PromoBanner() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-orange/20 via-brand-orange/10 to-transparent border border-brand-orange/20 p-8 sm:p-10">
          {/* Glow */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-brand-orange" />
                <span className="text-sm font-semibold text-brand-orange uppercase tracking-wider">Промокод</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white mb-2">
                Скидка на первый заказ
              </h3>
              <p className="text-brand-gray text-sm">
                Используйте промокод при оплате на Digiseller
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-3">
              <div className="px-6 py-3 bg-brand-dark border-2 border-dashed border-brand-orange/50 rounded-2xl">
                <span className="font-display text-2xl text-brand-orange tracking-widest">GET5</span>
              </div>
              <Link
                href="/catalog"
                className="text-xs text-brand-gray hover:text-white transition-colors"
              >
                Перейти в каталог →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
