import type { Metadata } from 'next';
import CardiologyProductContent from '@/components/CardiologyProductContent';
import treadmill from '@/lib/cardiology/cardiotrack-tmt-machine.json';
import ecg from '@/lib/cardiology/custo-cardio-300.json';
import { cardiologyStyles } from '@/lib/cardiology/styles';

export const cardiologyProducts = {
  'cardiotrack-tmt-machine': treadmill,
  'custo-cardio-300': ecg
};
export type CardiologySlug = keyof typeof cardiologyProducts;

export function cardiologyMetadata(slug: CardiologySlug): Metadata {
  const product = cardiologyProducts[slug];
  const url = `https://www.fastonmed.com/${slug}`;
  return {
    title: product.title,
    description: product.description,
    alternates: { canonical: url, languages: { 'en-AE': url, 'x-default': url } },
    openGraph: {
      type: 'website', title: product.title, description: product.description,
      url, siteName: 'FastonMed', locale: 'en_AE',
      images: [{ url: product.image, width: 1536, height: 1024, alt: product.alt }]
    },
    twitter: { card: 'summary_large_image', title: product.title, description: product.description, images: [product.image] },
    robots: { index: true, follow: true }
  };
}

export default function CardiologyProductPage({ slug }: { slug: CardiologySlug }) {
  const product = cardiologyProducts[slug];
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cardiologyStyles }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(product.schema).replace(/</g, '\\u003c') }} />
      <CardiologyProductContent html={product.html} />
    </>
  );
}
