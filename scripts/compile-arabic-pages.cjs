const fs=require('fs'),crypto=require('crypto');
const source=require('../lib/scraped-pages.json');
const pages={...require('../locales/arabic-major-pages.json'),...require('../locales/arabic-service-pages.json'),...require('../locales/arabic-supplier-pages.json')};
const records=[];
const add=(slug,field,en,ar)=>{if(!en)return;if(!ar||!/[\u0600-\u06ff]/.test(ar))throw Error(slug+':'+field);records.push({id:`page:${slug}:${field}:ar`,entity_type:'page',entity_id:slug,field_name:field,source_language:'en',target_language:'ar',source_text:en.trim(),translated_text:ar,source_hash:crypto.createHash('sha256').update(en.trim()).digest('hex').slice(0,16),translation_status:'translated',translation_provider:'static',created_at:'2026-10-12T00:00:00.000Z',updated_at:'2026-10-12T00:00:00.000Z'});};
for(const [slug,page]of Object.entries(pages)){
 const en=source[slug];for(const field of ['title','eyebrow','description'])add(slug,field,en[field],page[field]);
 if(en.sections.length!==page.sections.length)throw Error('Section count '+slug);
 en.sections.forEach((sec,i)=>{const ar=page.sections[i];add(slug,`section_${i}_title`,sec.title,ar.title);for(const [key,tag]of [['paragraphs','p'],['points','pt']]){if((sec[key]||[]).length!==(ar[key]||[]).length)throw Error('Field count '+slug+':'+i+':'+key);(sec[key]||[]).forEach((text,j)=>add(slug,`section_${i}_${tag}_${j}`,text,ar[key][j]));}});
}
for(const rec of records.filter(x=>x.entity_id==='privacy-policy-2'))records.push({...rec,id:rec.id.replace('privacy-policy-2','privacy-policy'),entity_id:'privacy-policy'});
const dict={...require('../locales/public-copy-ar.json'),...require('../locales/public-extra-ar.json')};
for(const [en,ar]of Object.entries(dict))add('shared-public-copy',crypto.createHash('sha256').update(en).digest('hex').slice(0,16),en,ar);
fs.writeFileSync('locales/arabic-page-content.json',JSON.stringify(records,null,2)+'\n');console.log(Object.keys(pages).length+' pages, '+records.length+' saved records');
