import { Zap, Shield, MessageCircle, RefreshCcw } from 'lucide-react';

const items = [
  {
    icon: Zap,
    title: 'Мгновенная доставка',
    desc: 'Ключ — сразу после оплаты',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    icon: Shield,
    title: 'Проверенный продавец',
    desc: 'Официальный партнёр Digiseller',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: MessageCircle,
    title: 'Поддержка 24/7',
    desc: 'Всегда на связи в Telegram',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: RefreshCcw,
    title: 'Гарантия возврата',
    desc: 'Решим любую проблему',
    color: 'text-brand-orange',
    bg: 'bg-brand-orange/10',
  },
];

export default function TrustBar() {
  return (
    <section className="py-8 border-y border-white/5 bg-brand-dark-2/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3 p-3">
              <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                <item.icon size={17} className={item.color} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">{item.title}</p>
                <p className="text-xs text-brand-gray mt-0.5 leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
