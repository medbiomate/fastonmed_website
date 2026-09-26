import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Post={title:string;slug:string;excerpt:string;content:string;status:string;featuredImage?:string;category?:string;author?:string;authorRole?:string;authorImage?:string;reviewer?:string;reviewerRole?:string;reviewerImage?:string;showByline?:boolean;showAuthor?:boolean;showReviewer?:boolean;publishedAt?:string;updatedAt?:string;seoTitle?:string;seoDescription?:string};

async function getPost(slug:string){
 const crm=(process.env.CRM_BACKEND_URL||'http://127.0.0.1:3000').replace(/\/$/,'');
 try{const r=await fetch(`${crm}/api/shared-data/website-posts`,{cache:'no-store'});const x=await r.json();return (x.data||[]).find((p:Post)=>p.slug===slug) as Post|undefined}catch{return undefined}
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const post=await getPost((await params).slug);return post?{title:post.seoTitle||post.title,description:post.seoDescription||post.excerpt}:{};}

export default async function BlogPost({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{preview?:string}>}){
 const post=await getPost((await params).slug),preview=(await searchParams).preview==='1';if(!post||(!preview&&post.status!=='published'))notFound();
 return <main className="fm-blog-page"><article><Link href="/blog" className="fm-blog-back">← All articles</Link>{preview&&post.status!=='published'&&<div className="fm-preview-banner">Draft preview — this article is not public.</div>}<span className="fm-blog-category">{post.category||'Fastonmed Journal'}</span><h1>{post.title}</h1><p className="fm-blog-excerpt">{post.excerpt}</p>{post.showByline&&<div className="fm-public-byline">{post.showAuthor!==false&&<div className="fm-public-byline-item">{post.authorImage&&<img src={post.authorImage} alt={post.author} className="fm-public-byline-avatar"/>}<div><small>Written by</small><b>{post.author}</b>{post.authorRole&&<span>{post.authorRole}</span>}</div></div>}{post.showReviewer!==false&&post.reviewer&&<div className="fm-public-byline-item">{post.reviewerImage&&<img src={post.reviewerImage} alt={post.reviewer} className="fm-public-byline-avatar"/>}<div><small>Medically reviewed by</small><b>{post.reviewer}</b>{post.reviewerRole&&<span>{post.reviewerRole}</span>}</div></div>}</div>}{post.featuredImage&&<img className="fm-blog-hero" src={post.featuredImage} alt=""/>}<div className="fm-blog-content" dangerouslySetInnerHTML={{__html:post.content}}/></article></main>
}
