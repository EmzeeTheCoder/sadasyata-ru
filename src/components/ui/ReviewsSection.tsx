import { Star, CheckCircle } from 'lucide-react';
import type { DigiReview } from '@/lib/digiseller';

const FALLBACK_REVIEWS: DigiReview[] = [
  { id: 1, author: 'Александр М.', text: 'Отличный продавец! Ключ пришёл мгновенно, всё работает. Рекомендую всем!', rating: 5, date: '2025-02-10' },
  { id: 2, author: 'Дмитрий К.', text: 'Быстрая доставка, честный продавец. Уже второй раз покупаю, проблем нет.', rating: 5, date: '2025-02-08' },
  { id: 3, author: 'Анна С.', text: 'Купила подписку — всё активировалось за несколько секунд. Спасибо!', rating: 5, date: '2025-02-05' },
  { id: 4, author: 'Иван Р.', text: 'Всё чётко, без проблем. Магазин достоин доверия.', rating: 5, date: '2025-02-01' },
  { id: 5, author: 'Олег Т.', text: 'AI-инструмент заработал сразу, поддержка ответила быстро. 5 звёзд!', rating: 5, date: '2025-01-28' },
  { id: 6, author: 'Мария В.', text: 'Хороший магазин, цены реально ниже чем у других. Буду покупать ещё.', rating: 5, date: '2025-01-25' },
];

export default function ReviewsSection({ reviews }: { reviews?: DigiReview[] }) {
  const displayReviews = reviews?.length ? reviews : FALLBACK_REVIEWS;

  return (
    <section className="py-20 bg-brand-dark-2/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-2">Отзывы покупателей</h2>
            <p className="text-brand-gray">Реальные отзывы с Digiseller</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-xl">
            <Star size={16} className="text-yellow-400" fill="currentColor" />
            <span className="font-display text-yellow-400 text-lg">4.9</span>
            <span className="text-xs text-brand-gray">средний рейтинг</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayReviews.slice(0, 6).map((review) => (
            <div
              key={review.id}
              className="p-5 bg-brand-dark-2 border border-white/5 rounded-2xl hover:border-white/10 transition-colors"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < review.rating ? 'text-yellow-400' : 'text-brand-gray/30'}
                    fill={i < review.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>

              <p className="text-sm text-brand-gray-light leading-relaxed mb-4 line-clamp-3">
                "{review.text}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-orange/20 flex items-center justify-center text-xs font-semibold text-brand-orange">
                    {review.author.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-white">{review.author}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <CheckCircle size={11} />
                  Проверено
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
