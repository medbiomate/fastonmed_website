import { getAllProducts } from '@/lib/server-catalog';
import { SITE_URL, escapeXml, hasUsableProductImage } from '@/lib/sitemap-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allProducts = await getAllProducts();
  const validProducts = allProducts.filter(
    (p) => p.status === 'published' && hasUsableProductImage(p.mainImage)
  );

  const items = validProducts
    .slice(0, 10000)
    .map((product) => {
      const priceVal = (product.salePrice && product.salePrice > 0)
        ? product.salePrice
        : (product.regularPrice > 0 ? product.regularPrice : 150);

      const imageUrl = product.mainImage.startsWith('http')
        ? product.mainImage
        : `${SITE_URL}${product.mainImage.startsWith('/') ? '' : '/'}${product.mainImage}`;

      const productUrl = `${SITE_URL}/product/${product.slug}`;
      const description = escapeXml(
        product.shortDescription || product.fullDescription?.slice(0, 1000) || `${product.name} - FastOnMed Healthcare UAE`
      );

      const brand = escapeXml(product.brand || 'FastOnMed');
      const mpn = escapeXml(product.sku || product.id);

      return `    <item>
      <g:id>${escapeXml(product.id || product.slug)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${description}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${product.stockStatus === 'out_of_stock' ? 'out_of_stock' : 'in_stock'}</g:availability>
      <g:price>${priceVal.toFixed(2)} AED</g:price>
      <g:brand>${brand}</g:brand>
      <g:mpn>${mpn}</g:mpn>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping>
        <g:country>AE</g:country>
        <g:service>Standard UAE Medical Courier</g:service>
        <g:price>0.00 AED</g:price>
      </g:shipping>
    </item>`;
    })
    .join('\n');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>FastOnMed Healthcare Equipment - Google Merchant Feed</title>
    <link>${SITE_URL}</link>
    <description>FastOnMed is the Best Medical Equipment Supplier in UAE. MoHAP and DHA certified biomedical equipment.</description>
${items}
  </channel>
</rss>`;

  return new Response(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
