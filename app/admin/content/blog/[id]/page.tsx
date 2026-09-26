import BlogManager from '@/components/admin/BlogManager';
export default async function Page({params}:{params:Promise<{id:string}>}){return <BlogManager mode="editor" postId={(await params).id}/>;}
