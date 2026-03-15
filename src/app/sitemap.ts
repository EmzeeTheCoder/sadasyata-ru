import { MetadataRoute } from 'next';
import { getSellerProducts } from '@/lib/digiseller';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://ru.sadasyata.in';

  const { products } = await getSellerProducts(1, 100, 'RUB', 'ru-RU');

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/catalog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/ps5`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${base}/xbox`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${base}/ai-tools`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${base}/subscriptions`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    ...productUrls,
  ];
}
