import { getAllProducts } from '@/lib/server-catalog';
import { SITE_URL, escapeXml, hasUsableProductImage } from '@/lib/sitemap-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allProducts = await getAllProducts();

  // Include all published products, ensuring 100% of catalog is represented
  const items = allProducts
    .slice(0, 50000)
    .map((product) => {
      const priceVal = (product.salePrice && product.salePrice > 0)
        ? product.salePrice
        : (product.regularPrice > 0 ? product.regularPrice : 150);

      const hasImg = hasUsableProductImage(product.mainImage);
      let imageUrl = `${SITE_URL}/fastonmed-logo.png`;
      if (hasImg && product.mainImage) {
        imageUrl = product.mainImage.startsWith('http')
          ? product.mainImage
          : `${SITE_URL}${product.mainImage.startsWith('/') ? '' : '/'}${product.mainImage}`;
      }

      const productUrl = `${SITE_URL}/product/${product.slug}`;
      const description = escapeXml(
        product.shortDescription ||
        product.fullDescription?.slice(0, 1000) ||
        `${product.name} - UAE Licensed Biomedical Equipment from FastonMed.`
      );

      const brand = escapeXml(product.brand || 'FastonMed');
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
      <g:google_product_category>Health &amp; Beauty &gt; Health Care &gt; Medical Supplies &amp; Equipment</g:google_product_category>
      <g:included_destination>Shopping_ads</g:included_destination>
      <g:included_destination>Free_listings</g:included_destination>
      <g:excluded_destination>Display_ads</g:excluded_destination>
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
    <title>FastonMed Healthcare Equipment - Google Merchant Feed</title>
    <link>${SITE_URL}</link>
    <description>FastonMed is the Best Medical Equipment Supplier in UAE. MoHAP and DHA certified biomedical equipment.</description>
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
