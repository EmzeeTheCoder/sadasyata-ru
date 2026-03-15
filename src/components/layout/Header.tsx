'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

type Lang = 'ru' | 'en';

const NAV = {
  ru: { home: 'Главная', catalog: 'Каталог', ps5: 'PS5', xbox: 'Xbox', ai: 'AI Инструменты', subscriptions: 'Подписки' },
  en: { home: 'Home', catalog: 'Catalog', ps5: 'PS5', xbox: 'Xbox', ai: 'AI Tools', subscriptions: 'Subscriptions' },
};

const HERO_TEXT = {
  ru: {
    badge: 'Мгновенная доставка · Проверенный продавец',
    title1: 'Цифровые', title2: 'продукты', title3: 'для России и СНГ',
    sub: 'Лицензионные ключи PS5 и Xbox, AI-инструменты и подписки по лучшим ценам. Ключ приходит сразу после оплаты.',
    cta1: 'Смотреть каталог', cta2: 'Акции и скидки',
    stats: [{ v: '5 000+', l: 'Продаж совершено' }, { v: '< 1 сек', l: 'Время доставки' }, { v: '4.9 ★', l: 'Средний рейтинг' }, { v: '24/7', l: 'Поддержка' }],
  },
  en: {
    badge: 'Instant Delivery · Verified Seller',
    title1: 'Digital', title2: 'products', title3: 'for Russia & CIS',
    sub: 'Licensed PS5 & Xbox keys, AI tools and subscriptions at the best prices. Key delivered instantly after payment.',
    cta1: 'Browse Catalog', cta2: 'Deals & Discounts',
    stats: [{ v: '5 000+', l: 'Sales completed' }, { v: '< 1 sec', l: 'Delivery time' }, { v: '4.9 ★', l: 'Average rating' }, { v: '24/7', l: 'Support' }],
  },
};

// Export lang context so other components can consume it
import { createContext, useContext } from 'react';
export const LangContext = createContext<Lang>('ru');
export const useLang = () => useContext(LangContext);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('ru');
  const { currency, setCurrency } = useCurrency();
  const t = NAV[lang];

  const navLinks = [
    { href: '/catalog', label: t.catalog },
    { href: '/ps5', label: t.ps5 },
    { href: '/xbox', label: t.xbox },
    { href: '/ai-tools', label: t.ai },
    { href: '/subscriptions', label: t.subscriptions },
  ];

  return (
    <LangContext.Provider value={lang}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-brand-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center font-display text-white text-sm font-bold group-hover:bg-brand-orange-light transition-colors">
                С
              </div>
              <span className="font-display text-lg tracking-wide text-white">SADASYATA</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="px-3 py-2 text-sm text-brand-gray hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrency(currency === 'RUB' ? 'USD' : 'RUB')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-brand-dark-3 hover:bg-brand-dark-4 border border-white/10 rounded-lg transition-all text-brand-gray-light"
              >
                {currency === 'RUB' ? '₽ RUB' : '$ USD'}
                <ChevronDown size={12} />
              </button>
              <button
                onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-brand-dark-3 hover:bg-brand-dark-4 border border-white/10 rounded-lg transition-all text-brand-gray-light"
              >
                <Globe size={12} />
                {lang.toUpperCase()}
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-white/5 bg-brand-dark-2">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm text-brand-gray hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 flex gap-2 border-t border-white/5 mt-3">
                <button onClick={() => setCurrency(currency === 'RUB' ? 'USD' : 'RUB')}
                  className="flex-1 py-2 text-xs font-medium bg-brand-dark-3 border border-white/10 rounded-lg text-brand-gray-light">
                  {currency === 'RUB' ? '₽ RUB' : '$ USD'}
                </button>
                <button onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
                  className="flex-1 py-2 text-xs font-medium bg-brand-dark-3 border border-white/10 rounded-lg text-brand-gray-light flex items-center justify-center gap-1.5">
                  <Globe size={12} />{lang.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </LangContext.Provider>
  );
}
