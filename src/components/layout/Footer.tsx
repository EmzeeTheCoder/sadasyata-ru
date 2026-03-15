import Link from 'next/link';
import { Send, Shield, Zap } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-brand-dark-2 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center font-display text-white text-sm">S</div>
              <span className="font-display text-lg text-white">SADASYATA</span>
            </div>
            <p className="text-sm text-brand-gray leading-relaxed max-w-sm">
              Надёжный магазин цифровых продуктов для России и СНГ. Лицензионные ключи, AI-инструменты и подписки по лучшим ценам.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://t.me/SadasyataOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/20 rounded-lg text-sm text-brand-orange transition-all"
              >
                <Send size={14} />
                Telegram
              </a>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Каталог</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/ps5', label: 'PS5 Игры' },
                { href: '/xbox', label: 'Xbox' },
                { href: '/ai-tools', label: 'AI Инструменты' },
                { href: '/subscriptions', label: 'Подписки' },
                { href: '/catalog', label: 'Все товары' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-gray hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Гарантии</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-brand-gray">
                <Zap size={14} className="text-brand-orange mt-0.5 shrink-0" />
                Мгновенная доставка
              </li>
              <li className="flex items-start gap-2.5 text-sm text-brand-gray">
                <Shield size={14} className="text-brand-orange mt-0.5 shrink-0" />
                Защита покупателя
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-brand-gray">
            © {year} Sadasyata. Все права защищены.
          </p>
          <p className="text-xs text-brand-gray flex items-center gap-1.5">
            <Shield size={11} />
            Платежи обрабатываются через Digiseller
          </p>
        </div>
      </div>
    </footer>
  );
}
