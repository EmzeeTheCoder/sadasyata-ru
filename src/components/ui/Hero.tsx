'use client';

import Link from 'next/link';
import { Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('visible');
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/3 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,107,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,0,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div ref={ref} className="animate-on-scroll max-w-4xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-sm text-brand-orange mb-8">
            <Zap size={14} fill="currentColor" />
            <span>Мгновенная доставка · Проверенный продавец</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6">
            <span className="text-white">Цифровые</span>
            <br />
            <span className="gradient-text">продукты</span>
            <br />
            <span className="text-white">для России и СНГ</span>
          </h1>

          <p className="text-lg sm:text-xl text-brand-gray max-w-2xl leading-relaxed mb-10">
            Лицензионные ключи PS5 и Xbox, AI-инструменты и подписки по лучшим ценам.
            Ключ приходит <span className="text-white font-medium">сразу после оплаты</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-16">
            <Link
              href="/catalog"
              className="flex items-center gap-2 px-8 py-4 bg-brand-orange hover:bg-brand-orange-light text-white font-semibold rounded-2xl transition-all hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] active:scale-95"
            >
              Смотреть каталог
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/catalog?sort=sale"
              className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl border border-white/10 transition-all active:scale-95"
            >
              <TrendingUp size={18} className="text-brand-orange" />
              Акции и скидки
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            {[
              { value: '5 000+', label: 'Продаж совершено' },
              { value: '< 1 сек', label: 'Время доставки' },
              { value: '4.9 ★', label: 'Средний рейтинг' },
              { value: '24/7', label: 'Поддержка' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl text-brand-orange">{stat.value}</div>
                <div className="text-xs text-brand-gray mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
