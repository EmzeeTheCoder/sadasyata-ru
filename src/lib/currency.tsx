'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'RUB' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (priceRub: number, usdRate?: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'RUB',
  setCurrency: () => {},
  format: (p) => `${p} ₽`,
});

export function CurrencyProvider({
  children,
  usdRate = 90,
}: {
  children: ReactNode;
  usdRate?: number;
}) {
  const [currency, setCurrency] = useState<Currency>('RUB');

  const format = (priceRub: number) => {
    if (currency === 'USD') {
      const usd = (priceRub / usdRate).toFixed(2);
      return `$${usd}`;
    }
    return `${Math.round(priceRub).toLocaleString('ru-RU')} ₽`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
