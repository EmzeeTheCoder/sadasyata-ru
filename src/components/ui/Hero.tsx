'use client';

import Link from 'next/link';
import { Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useLang } from '@/lib/lang';

const COPY = {
  ru: {
    badge: 'Мгновенная доставка · Проверенный продавец',
    h1a: 'Цифровые', h1b: 'продукты', h1c: 'для России и СНГ',
    sub: 'Лицензионные ключи PS5 и Xbox, AI-инструменты и подписки по лучшим ценам. Ключ приходит сразу после оплаты.',
    cta1: 'Смотреть каталог', cta2: 'Акции и скидки',
    stats: [
      { v: '5 000+', l: 'Продаж совершено' },
      { v: '< 1 сек', l: 'Время доставки' },
      { v: '4.9 ★', l: 'Средний рейтинг' },
      { v: '24/7', l: 'Поддержка' },
    ],
  },
  en: {
    badge: 'Instant Delivery · Verified Seller',
    h1a: 'Digital', h1b: 'products', h1c: 'for Russia & CIS',
    sub: 'Licensed PS5 & Xbox keys, AI tools and subscriptions at the best prices. Key delivered instantly after payment.',
    cta1: 'Browse Catalog', cta2: 'Deals & Discounts',
    stats: [
      { v: '5 000+', l: 'Sales completed' },
      { v: '< 1 sec', l: 'Delivery time' },
      { v: '4.9 ★', l: 'Average rating' },
      { v: '24/7', l: 'Support' },
    ],
  },
};

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const c = COPY[lang];

  useEffect(() => {
    ref.current?.classList.add('visible');
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,107,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.5) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div ref={ref} className="animate-on-scroll max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-sm text-brand-orange mb-8">
            <Zap size={14} fill="currentColor" />
            <span>{c.badge}</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6">
            <span className="text-white">{c.h1a}</span><br />
            <span className="gradient-text">{c.h1b}</span><br />
            <span className="text-white">{c.h1c}</span>
          </h1>
          <p className="text-lg sm:text-xl text-brand-gray max-w-2xl leading-relaxed mb-10">
            {c.sub}
          </p>
          <div className="flex flex-wrap gap-4 mb-16">
            <Link href="/catalog" className="flex items-center gap-2 px-8 py-4 bg-brand-orange hover:bg-brand-orange-light text-white font-semibold rounded-2xl transition-all hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] active:scale-95">
              {c.cta1}<ArrowRight size={18} />
            </Link>
            <Link href="/catalog?sort=sale" className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl border border-white/10 transition-all active:scale-95">
              <TrendingUp size={18} className="text-brand-orange" />{c.cta2}
            </Link>
          </div>
          <div className="flex flex-wrap gap-8">
            {c.stats.map((stat) => (
              <div key={stat.l}>
                <div className="font-display text-2xl text-brand-orange">{stat.v}</div>
                <div className="text-xs text-brand-gray mt-0.5">{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
