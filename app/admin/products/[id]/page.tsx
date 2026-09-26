import ProductManager from '@/components/admin/ProductManager';
export default async function Page({params}:{params:Promise<{id:string}>}){return <ProductManager mode="editor" id={(await params).id}/>;}
