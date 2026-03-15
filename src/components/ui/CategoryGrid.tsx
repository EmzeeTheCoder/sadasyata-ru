import Link from 'next/link';
import { Gamepad2, Monitor, Bot, Star } from 'lucide-react';

const categories = [
  {
    href: '/ps5',
    slug: 'ps5',
    label: 'PS5 Игры',
    labelEn: 'PS5 Games',
    desc: 'Ключи активации PlayStation',
    icon: Gamepad2,
    color: 'from-blue-600/20 to-blue-900/10',
    accent: 'text-blue-400',
    border: 'border-blue-500/20',
    glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
  },
  {
    href: '/xbox',
    slug: 'xbox',
    label: 'Xbox',
    labelEn: 'Xbox',
    desc: 'Game Pass и игровые ключи',
    icon: Monitor,
    color: 'from-green-600/20 to-green-900/10',
    accent: 'text-green-400',
    border: 'border-green-500/20',
    glow: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]',
  },
  {
    href: '/ai-tools',
    slug: 'ai-tools',
    label: 'AI Инструменты',
    labelEn: 'AI Tools',
    desc: 'ChatGPT, Midjourney и другие',
    icon: Bot,
    color: 'from-purple-600/20 to-purple-900/10',
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
    glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
  },
  {
    href: '/subscriptions',
    slug: 'subscriptions',
    label: 'Подписки',
    labelEn: 'Subscriptions',
    desc: 'Профессиональные сервисы',
    icon: Star,
    color: 'from-brand-orange/20 to-orange-900/10',
    accent: 'text-brand-orange',
    border: 'border-brand-orange/20',
    glow: 'hover:shadow-[0_0_30px_rgba(255,107,0,0.15)]',
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-2">Категории</h2>
          <p className="text-brand-gray">Выберите нужное</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`group relative p-6 bg-gradient-to-br ${cat.color} border ${cat.border} rounded-2xl transition-all duration-300 ${cat.glow} hover:-translate-y-1 overflow-hidden`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <cat.icon size={22} className={cat.accent} />
              </div>

              <h3 className="font-display text-base text-white mb-1">{cat.label}</h3>
              <p className="text-xs text-brand-gray leading-relaxed">{cat.desc}</p>

              {/* Arrow on hover */}
              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                <span className={`text-xs ${cat.accent}`}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
