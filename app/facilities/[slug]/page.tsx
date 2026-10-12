import Link from 'next/link';
import { headers } from 'next/headers';
import { publicArabic } from '@/lib/public-arabic';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/server-catalog';
import { facilityEquipment, getFacilityProducts } from '@/lib/facility-equipment';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };
function resolve(slug: string) { return Object.prototype.hasOwnProperty.call(facilityEquipment, slug) ? slug as keyof typeof facilityEquipment : null; }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isAr = (await headers()).get('x-locale') === 'ar';
  const ar = (text: string) => isAr ? publicArabic(text) : text;
  const slug = resolve((await params).slug);
  if (!slug) return {};
  return { title: isAr ? `معدات ${ar(facilityEquipment[slug].title)} | فاستونميد الإمارات` : `Equipment for ${facilityEquipment[slug].title} | Fastonmed UAE`, description: ar(facilityEquipment[slug].description), alternates: { canonical: `/facilities/${slug}` } };
}
export default async function FacilityPage({ params, searchParams }: Props) {
  const isAr = (await headers()).get('x-locale') === 'ar';
  const ar = (text: string) => isAr ? publicArabic(text) : text;
  const slug = resolve((await params).slug);
  if (!slug) notFound();
  const facility = facilityEquipment[slug];
  const products = getFacilityProducts(await getAllProducts(), slug);
  const totalPages = Math.max(1, Math.ceil(products.length / 24));
  const page = Math.min(totalPages, Math.max(1, Math.floor(Number((await searchParams).page) || 1)));
  return <main className="fm-facility-page"><div className="container">
    <nav aria-label="Breadcrumb"><Link href={isAr ? "/ar" : "/"}>{isAr ? 'الرئيسية' : 'Home'}</Link> / <Link href={isAr ? "/ar/shop" : "/shop"}>{isAr ? 'المعدات' : 'Equipment'}</Link> / {ar(facility.title)}</nav>
    <header className="fm-facility-hero"><div><h1>{isAr ? 'معدات ' : 'Equipment for '}{ar(facility.title)}</h1><p>{ar(facility.description)}</p><span>{products.length} {isAr ? 'منتج مطابق' : 'matching products'}</span></div><Image src={`/images/facilities/${facility.image}.jpg`} alt={ar(facility.title)} width={480} height={220} /></header>
    <nav className="fm-facility-links" aria-label="Other facility equipment">{Object.entries(facilityEquipment).map(([key, value]) => <Link key={key} href={`${isAr ? "/ar" : ""}/facilities/${key}`} aria-current={key === slug ? 'page' : undefined}>{ar(value.title)}</Link>)}</nav>
    {products.length ? <div className="fm-facility-products">{products.slice((page - 1) * 24, page * 24).map(product => <ProductCard key={product.id} product={product} />)}</div> : <p>Contact our team to discuss equipment for this facility. <Link href="/contact">Request equipment advice</Link></p>}
    {totalPages > 1 && <nav aria-label="Product pages" className="fm-facility-pagination">{page > 1 && <Link href={`?page=${page - 1}`}>{isAr ? 'السابق' : 'Previous'}</Link>}<span>{isAr ? `الصفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}</span>{page < totalPages && <Link href={`?page=${page + 1}`}>{isAr ? 'التالي' : 'Next'}</Link>}</nav>}
  </div></main>;
}
