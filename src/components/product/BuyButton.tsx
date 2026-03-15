'use client';

import { ShoppingCart, ExternalLink } from 'lucide-react';
import { getBuyLink } from '@/lib/digiseller';

export default function BuyButton({ productId }: { productId: number }) {
  const handleBuy = () => {
    window.open(getBuyLink(productId), '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleBuy}
      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-brand-orange hover:bg-brand-orange-light text-white font-semibold text-lg rounded-2xl transition-all hover:shadow-[0_0_40px_rgba(255,107,0,0.4)] active:scale-[0.98]"
    >
      <ShoppingCart size={20} />
      Купить сейчас
      <ExternalLink size={16} className="opacity-60" />
    </button>
  );
}
