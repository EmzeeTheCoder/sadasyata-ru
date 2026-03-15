'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Zap } from 'lucide-react';
import { useCurrency } from '@/lib/currency';
import { getBuyLink, type DigiProduct } from '@/lib/digiseller';
import clsx from 'clsx';

interface ProductCardProps {
  product: DigiProduct;
  usdRate?: number;
  priority?: boolean;
}

export default function ProductCard({ product, usdRate = 90, priority = false }: ProductCardProps) {
  const { format } = useCurrency();

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(getBuyLink(product.id), '_blank', 'noopener,noreferrer');
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block bg-brand-dark-2 border border-white/5 rounded-2xl overflow-hidden card-glow relative"
    >
      {/* Product image */}
      <div className="relative aspect-[4/3] bg-brand-dark-3 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center">
              <ShoppingCart size={24} className="text-brand-orange" />
            </div>
          </div>
        )}
        {/* Instant delivery badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 bg-brand-dark/80 backdrop-blur-sm border border-brand-orange/30 rounded-full text-xs text-brand-orange">
          <Zap size={10} fill="currentColor" />
          Мгновенно
        </div>
      </div>

      {/* Card content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 mb-3 group-hover:text-brand-orange transition-colors">
          {product.name}
        </h3>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-4">
          {product.cnt_sell !== undefined && product.cnt_sell > 0 && (
            <span className="text-xs text-brand-gray">
              {product.cnt_sell.toLocaleString('ru-RU')} продано
            </span>
          )}
          {product.rating && (
            <span className="flex items-center gap-1 text-xs text-yellow-400">
              <Star size={10} fill="currentColor" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Price + Buy */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-display text-brand-orange">
              {format(product.price, usdRate)}
            </span>
          </div>
          <button
            onClick={handleBuy}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-semibold rounded-xl transition-all active:scale-95"
          >
            <ShoppingCart size={13} />
            Купить
          </button>
        </div>
      </div>

      {/* Shine overlay */}
      <div className="absolute inset-0 bg-card-shine opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
    </Link>
  );
}
