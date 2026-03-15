import type { Metadata } from 'next';
import { Russo_One, Inter } from 'next/font/google';
import './globals.css';
import { CurrencyProvider } from '@/lib/currency';
import { LangProvider } from '@/lib/lang';
import Analytics from '@/components/ui/Analytics';

const russoOne = Russo_One({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ru.sadasyata.in'),
  title: {
    default: 'Sadasyata — Цифровые товары для России и СНГ',
    template: '%s | Sadasyata',
  },
  description:
    'Купите лицензионные ключи PS5, Xbox, AI-инструменты и подписки по лучшим ценам. Мгновенная доставка. Проверенный продавец.',
  keywords: ['цифровые товары', 'игровые ключи', 'PS5', 'Xbox', 'подписки', 'AI инструменты', 'Россия', 'СНГ'],
  openGraph: {
    siteName: 'Sadasyata',
    locale: 'ru_RU',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${russoOne.variable} ${inter.variable}`}>
      <body className="bg-brand-dark text-brand-white font-body antialiased">
        <Analytics />
        <LangProvider>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </LangProvider>
      </body>
    </html>
  );
}
