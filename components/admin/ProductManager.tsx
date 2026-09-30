'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, ChangeEvent } from 'react';
import {
  Edit3,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  X,
  Layers,
  RotateCcw,
  Sparkles,
  Link2,
  Highlighter,
  Strikethrough,
  Code,
  Quote,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Image as ImageIcon,
  FolderOpen,
  Check,
  Eye,
  FileText,
  AlertTriangle,
  Globe,
  Tag,
  Package,
  CheckCircle2,
} from 'lucide-react';

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'list'
  | 'quote'
  | 'code'
  | 'image';

export type Block = { id: string; type: BlockType; content: string };

type Product = Record<string, any> & {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  brand: string;
  status: string;
  image?: string;
  galleryImages?: string[];
  regularPrice?: number;
  salePrice?: number;
  sellingPrice?: number;
  inStock?: number;
  stockStatus?: string;
  description?: string;
  shortDescription?: string;
  specifications?: Record<string, string>;
  tags?: string[];
  purchaseMode?: string;
  warrantyPeriod?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
};

interface MediaItem {
  url: string;
  name: string;
  category: 'uploads' | 'products' | 'showcase' | 'library';
  mtime?: number;
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const block = (type: BlockType = 'paragraph'): Block => ({ id: uid(), type, content: '' });

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const decodeHtml = (html?: string): string => {
  if (!html) return '';
  return html
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
};

const serializeBlocks = (blocks: Block[]): string =>
  blocks
    .map((b) => {
      const s = b.content;
      if (b.type === 'heading' || b.type === 'heading2') return `<h2>${s}</h2>`;
      if (b.type === 'heading3') return `<h3>${s}</h3>`;
      if (b.type === 'heading4') return `<h4>${s}</h4>`;
      if (b.type === 'quote') return `<blockquote>${s}</blockquote>`;
      if (b.type === 'list') {
        const lines = s
          .replace(/<br\s*[\/]?>/gi, '\n')
          .replace(/<\/?[^>]+(>|$)/g, '\n')
          .split('\n')
          .map((x) => x.trim())
          .filter(Boolean);
        return `<ul>${lines.map((x) => `<li>${x}</li>`).join('')}</ul>`;
      }
      if (b.type === 'code') return `<pre><code>${s}</code></pre>`;
      if (b.type === 'image') return s ? `<img src="${s}" alt="Product visual" />` : '';
      return `<p>${s}</p>`;
    })
    .join('\n');

const deserializeToBlocks = (htmlOrText?: string): Block[] => {
  if (!htmlOrText || !htmlOrText.trim()) {
    return [{ id: uid(), type: 'paragraph', content: '' }];
  }
  const trimmed = htmlOrText.trim();

  // If pure text without any HTML tags
  if (!/<[a-z][\s\S]*>/i.test(trimmed)) {
    const paragraphs = trimmed.split(/\n\s*\n/).filter(Boolean);
    if (!paragraphs.length) return [{ id: uid(), type: 'paragraph', content: '' }];
    return paragraphs.map((p) => ({
      id: uid(),
      type: 'paragraph',
      content: p.replace(/\n/g, '<br/>'),
    }));
  }

  // Parse HTML tags
  if (typeof window !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(trimmed, 'text/html');
      const nodes = Array.from(doc.body.childNodes);
      const blocks: Block[] = [];

      for (const node of nodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tag = el.tagName.toLowerCase();
          if (tag === 'h2') {
            blocks.push({ id: uid(), type: 'heading2', content: el.innerHTML });
          } else if (tag === 'h3') {
            blocks.push({ id: uid(), type: 'heading3', content: el.innerHTML });
          } else if (tag === 'h4') {
            blocks.push({ id: uid(), type: 'heading4', content: el.innerHTML });
          } else if (tag === 'blockquote') {
            blocks.push({ id: uid(), type: 'quote', content: el.innerHTML });
          } else if (tag === 'pre') {
            blocks.push({ id: uid(), type: 'code', content: el.innerHTML });
          } else if (tag === 'ul' || tag === 'ol') {
            const items = Array.from(el.querySelectorAll('li'))
              .map((li) => li.innerHTML)
              .join('<br/>');
            blocks.push({ id: uid(), type: 'list', content: items || el.innerHTML });
          } else if (tag === 'img') {
            const src = (el as HTMLImageElement).getAttribute('src') || '';
            blocks.push({ id: uid(), type: 'image', content: src });
          } else {
            blocks.push({ id: uid(), type: 'paragraph', content: el.innerHTML });
          }
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          blocks.push({ id: uid(), type: 'paragraph', content: node.textContent.trim() });
        }
      }

      if (blocks.length > 0) return blocks;
    } catch {}
  }

  return [{ id: uid(), type: 'paragraph', content: trimmed }];
};

const getBlockTypeMeta = (type: BlockType) => {
  switch (type) {
    case 'heading':
    case 'heading2':
      return { label: 'Heading 2', icon: <span style={{ fontWeight: 800 }}>H2</span> };
    case 'heading3':
      return { label: 'Heading 3', icon: <span style={{ fontWeight: 800 }}>H3</span> };
    case 'heading4':
      return { label: 'Heading 4', icon: <span style={{ fontWeight: 800 }}>H4</span> };
    case 'list':
      return { label: 'Bullet List', icon: <List size={15} /> };
    case 'quote':
      return { label: 'Quote', icon: <Quote size={15} /> };
    case 'code':
      return { label: 'Code Block', icon: <Code size={15} /> };
    case 'image':
      return { label: 'Image', icon: <ImageIcon size={15} /> };
    default:
      return { label: 'Paragraph', icon: <AlignLeft size={15} /> };
  }
};

const productCreatedAt = (product: Product): string =>
  product.createdAt || product.wordpressSource?.createdAt || product.updatedAt || '';

const productCreatedTime = (product: Product): number => {
  const value = productCreatedAt(product);
  if (!value) return 0;
  const parsed = Date.parse(value.includes('T') ? value : value.replace(' ', 'T'));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatProductDate = (product: Product): { date: string; time: string } => {
  const timestamp = productCreatedTime(product);
  if (!timestamp) return { date: '—', time: '' };
  const date = new Date(timestamp);
  return {
    date: new Intl.DateTimeFormat('en-AE', { day: '2-digit', month: 'short', year: 'numeric' }).format(date),
    time: new Intl.DateTimeFormat('en-AE', { hour: '2-digit', minute: '2-digit' }).format(date),
  };
};

const blank = (): Product => ({
  id: `prod-${Date.now()}`,
  name: '',
  slug: '',
  sku: '',
  category: '',
  brand: '',
  status: 'draft',
  image: '',
  galleryImages: [],
  regularPrice: 0,
  salePrice: 0,
  sellingPrice: 0,
  inStock: 0,
  stockStatus: 'instock',
  description: '',
  shortDescription: '',
  specifications: {},
  tags: [],
  purchaseMode: 'cart',
  warrantyPeriod: '',
  seoTitle: '',
  seoDescription: '',
});

const PAGE_SIZE = 25;

export default function ProductManager({
  mode,
  id,
  initialStatus = 'published',
}: {
  mode: 'list' | 'editor';
  id?: string;
  initialStatus?: 'all' | 'published' | 'draft' | 'trash';
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>(blank());
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [specText, setSpecText] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'trash'>(initialStatus);
  const [loading, setLoading] = useState(true);

  // Description Editor State
  const [descriptionMode, setDescriptionMode] = useState<'visual' | 'html'>('visual');
  const [blocks, setBlocksState] = useState<Block[]>([block('paragraph')]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [alignMenuOpen, setAlignMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [showBlockPicker, setShowBlockPicker] = useState(false);

  // SEO Modal State
  const [seoModalOpen, setSeoModalOpen] = useState(false);
  const [draftSeoTitle, setDraftSeoTitle] = useState('');
  const [draftSeoSlug, setDraftSeoSlug] = useState('');
  const [draftSeoDesc, setDraftSeoDesc] = useState('');

  // Media Library & Uploads State
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'main' | 'gallery' | 'block' | null>(null);
  const [targetBlockId, setTargetBlockId] = useState<string | null>(null);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'products' | 'showcase' | 'library' | 'uploads'>('all');
  const [mediaSearch, setMediaSearch] = useState('');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>('');
  const [mediaTab, setMediaTab] = useState<'library' | 'upload'>('library');
  const [isUploading, setIsUploading] = useState(false);
  const [showDirectUrlInput, setShowDirectUrlInput] = useState(false);

  // File input refs
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);
  const blockImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch('/api/admin/products', { cache: 'no-store' })
      .then((r) => r.json())
      .then((x) => {
        if (!active) return;
        const all = x.products || [];
        setProducts(all);
        if (id) {
          const p = all.find((v: Product) => v.id === id || v.slug === id);
          if (p) {
            setProduct({ ...blank(), ...p });
            setSpecText(
              Object.entries(p.specifications || {})
                .map(([k, v]) => `${k}: ${v}`)
                .join('\n')
            );
            const loadedBlocks = deserializeToBlocks(p.description || '');
            setBlocksState(loadedBlocks);
            if (loadedBlocks.length > 0) {
              setActiveBlockId(loadedBlocks[0].id);
            }
          }
        }
      })
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // Load website media library list when modal opens
  const fetchMediaList = async () => {
    setMediaLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (data.success && Array.isArray(data.media)) {
        setMediaList(data.media);
      }
    } catch (e) {
      console.warn('Failed to load media list:', e);
    } finally {
      setMediaLoading(false);
    }
  };

  const openMediaModal = (target: 'main' | 'gallery' | 'block', bId: string | null = null) => {
    setMediaTarget(target);
    setTargetBlockId(bId);
    setSelectedMediaUrl('');
    setMediaModalOpen(true);
    fetchMediaList();
  };

  // Upload file helper: uploads to /api/admin/media with FileReader DataURL fallback
  const uploadFileToMedia = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
    } catch (e) {
      console.warn('Media API upload error, falling back to data URL', e);
    }

    // Fallback to Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle uploading main product image directly from computer
  const handleMainImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadFileToMedia(file);
      setProduct((prev) => ({ ...prev, image: url }));
      setMessage('Main image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(`Upload failed: ${err.message || err}`);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Handle uploading gallery images from computer (supports multiple)
  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const url = await uploadFileToMedia(file);
        uploadedUrls.push(url);
      }
      setProduct((prev) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...uploadedUrls],
      }));
      setMessage(`Added ${uploadedUrls.length} gallery image(s)!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(`Gallery upload failed: ${err.message || err}`);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Handle uploading image for a block in the rich description
  const handleBlockImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetBlockId) return;
    setIsUploading(true);
    try {
      const url = await uploadFileToMedia(file);
      setBlocks(
        blocks.map((b) => (b.id === targetBlockId ? { ...b, content: url } : b))
      );
      setMessage('Description image added!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(`Image upload failed: ${err.message || err}`);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Confirm selection from Media Library Modal
  const handleInsertSelectedMedia = () => {
    if (!selectedMediaUrl) return;
    if (mediaTarget === 'main') {
      setProduct((prev) => ({ ...prev, image: selectedMediaUrl }));
    } else if (mediaTarget === 'gallery') {
      setProduct((prev) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), selectedMediaUrl],
      }));
    } else if (mediaTarget === 'block' && targetBlockId) {
      setBlocks(
        blocks.map((b) => (b.id === targetBlockId ? { ...b, content: selectedMediaUrl } : b))
      );
    }
    setMediaModalOpen(false);
  };

  // Handle upload within Media Library Modal
  const handleModalFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadFileToMedia(file);
      await fetchMediaList();
      setSelectedMediaUrl(url);
      setMediaTab('library');
      setMessage('Uploaded to library and selected!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(`Upload failed: ${err.message || err}`);
    } finally {
      setIsUploading(false);
    }
  };

  // SEO Snippet Modal Helpers
  const openSeoModal = () => {
    setDraftSeoTitle(product.seoTitle || product.name || '');
    setDraftSeoSlug(product.slug || slugify(product.name) || '');
    setDraftSeoDesc(product.seoDescription || product.shortDescription || '');
    setSeoModalOpen(true);
  };

  const applySeoChanges = () => {
    setProduct((prev) => ({
      ...prev,
      seoTitle: draftSeoTitle,
      slug: draftSeoSlug,
      seoDescription: draftSeoDesc,
    }));
    setSeoModalOpen(false);
    setMessage('SEO snippet updated! Save product to persist changes.');
    setTimeout(() => setMessage(''), 3500);
  };

  // Description Block helpers
  const setBlocks = (next: Block[]) => {
    setBlocksState(next);
    setProduct((prev) => ({
      ...prev,
      description: serializeBlocks(next),
    }));
  };

  const addBlock = (type: BlockType, afterIndex?: number) => {
    const newB = block(type);
    if (typeof afterIndex === 'number') {
      const next = [...blocks];
      next.splice(afterIndex + 1, 0, newB);
      setBlocks(next);
    } else {
      setBlocks([...blocks, newB]);
    }
    setActiveBlockId(newB.id);
    setShowBlockPicker(false);
  };

  // Text formatting commands
  const applyFormat = (cmd: string, val: string | null = null) => {
    document.execCommand(cmd, false, val ?? undefined);
    if (activeBlockId) {
      const el = document.getElementById(`fm-block-content-${activeBlockId}`);
      if (el) {
        setBlocks(
          blocks.map((b) => (b.id === activeBlockId ? { ...b, content: el.innerHTML } : b))
        );
      }
    }
  };

  const applyLink = () => {
    const url = prompt('Enter link URL:', 'https://');
    if (url) applyFormat('createLink', url);
  };

  const applyHighlight = () => {
    applyFormat('hiliteColor', '#fecdd3');
  };

  const applyInlineCode = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const code = document.createElement('code');
      code.textContent = sel.toString();
      range.deleteContents();
      range.insertNode(code);
      if (activeBlockId) {
        const el = document.getElementById(`fm-block-content-${activeBlockId}`);
        if (el) {
          setBlocks(
            blocks.map((b) => (b.id === activeBlockId ? { ...b, content: el.innerHTML } : b))
          );
        }
      }
    }
  };

  const changeActiveBlockType = (type: BlockType) => {
    if (!activeBlockId) return;
    setBlocks(blocks.map((b) => (b.id === activeBlockId ? { ...b, type } : b)));
    setTypeMenuOpen(false);
  };

  // Reset page to 1 whenever search query or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory, statusFilter]);

  const productStatus = (p: Product) => {
    if (p.status === 'trash') return 'trash';
    if (p.status === 'draft' || p.status === 'auto-draft') return 'draft';
    return 'published';
  };

  const statusCounts = useMemo(() => ({
    all: products.length,
    published: products.filter((p) => productStatus(p) === 'published').length,
    draft: products.filter((p) => productStatus(p) === 'draft').length,
    trash: products.filter((p) => productStatus(p) === 'trash').length,
  }), [products]);

  // Decoded category counts
  const { categories } = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      const cat = decodeHtml(p.category?.trim()) || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    }
    const cats = Object.keys(counts).sort((a, b) => a.localeCompare(b));
    return { categories: cats, categoryCounts: counts };
  }, [products]);

  // Filtered products list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (statusFilter !== 'all' && productStatus(p) !== statusFilter) return false;
      const pCat = decodeHtml(p.category?.trim()) || 'Uncategorized';
      if (selectedCategory && pCat !== selectedCategory) {
        return false;
      }
      if (q) {
        const pName = decodeHtml(p.name || '').toLowerCase();
        const pSku = (p.sku || '').toLowerCase();
        const pBrand = decodeHtml(p.brand || '').toLowerCase();
        if (!pName.includes(q) && !pSku.includes(q) && !pBrand.includes(q) && !pCat.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => productCreatedTime(b) - productCreatedTime(a));
  }, [products, query, selectedCategory, statusFilter]);

  // 25 items per page pagination
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const paginated = useMemo(
    () => filtered.slice(startIndex, endIndex),
    [filtered, startIndex, endIndex]
  );

  const allCurrentPageSelected =
    paginated.length > 0 && paginated.every((p) => selectedIds.includes(p.id));
  const someCurrentPageSelected =
    paginated.some((p) => selectedIds.includes(p.id));

  const toggleSelectCurrentPage = () => {
    const pageIds = paginated.map((p) => p.id);
    if (allCurrentPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    setSelectedIds(filtered.map((p) => p.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const updateProductStatus = async (item: Product, status: string) => {
    const updated = { ...item, status, updatedAt: new Date().toISOString() };
    const response = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    if (!response.ok) throw new Error('Product status could not be updated');
    setProducts((current) => current.map((p) => p.id === item.id ? updated : p));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const permanent = statusFilter === 'trash';
    const confirmMsg =
      selectedIds.length === 1
        ? permanent ? 'Permanently delete 1 selected product? This cannot be undone.' : 'Move 1 selected product to Trash?'
        : permanent ? `Permanently delete ${selectedIds.length} selected products? This cannot be undone.` : `Move ${selectedIds.length} selected products to Trash?`;
    if (!confirm(confirmMsg)) return;

    setIsDeletingBulk(true);
    try {
      if (permanent) {
        await Promise.all(selectedIds.map((pid) => fetch(`/api/admin/products?id=${encodeURIComponent(pid)}`, { method: 'DELETE' })));
        setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      } else {
        const chosen = products.filter((p) => selectedIds.includes(p.id));
        await Promise.all(chosen.map((p) => updateProductStatus(p, 'trash')));
      }
      setMessage(permanent ? `Permanently deleted ${selectedIds.length} product(s)` : `Moved ${selectedIds.length} product(s) to Trash`);
      setSelectedIds([]);
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      alert(`Bulk delete failed: ${err?.message || err}`);
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const remove = async (item: Product) => {
    if (statusFilter === 'trash') {
      if (!confirm('Permanently delete this product? This cannot be undone.')) return;
      await fetch(`/api/admin/products?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      setProducts((v) => v.filter((p) => p.id !== item.id));
    } else {
      if (!confirm('Move this product to Trash?')) return;
      await updateProductStatus(item, 'trash');
    }
    setSelectedIds((prev) => prev.filter((id) => id !== item.id));
  };

  // Save product (editor mode)
  const saveProduct = async () => {
    const specifications = Object.fromEntries(
      specText
        .split('\n')
        .map((x) => x.split(':'))
        .filter((x) => x.length > 1)
        .map(([k, ...v]) => [k.trim(), v.join(':').trim()])
    );

    const finalDescription =
      descriptionMode === 'visual' ? serializeBlocks(blocks) : (product.description || '');

    const ready = {
      ...product,
      name: product.name.trim(),
      slug: product.slug || slugify(product.name),
      sku: product.sku || `FOM-${Date.now()}`,
      image: product.image || '',
      galleryImages: (product.galleryImages || []).filter(Boolean),
      regularPrice: Number(product.regularPrice || 0),
      salePrice: Number(product.salePrice || 0) || null,
      sellingPrice: Number(product.salePrice || product.regularPrice || 0),
      inStock: Number(product.inStock || 0),
      description: finalDescription,
      specifications,
      updatedAt: new Date().toISOString(),
      createdAt: product.createdAt || new Date().toISOString(),
    };

    const r = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ready),
    });
    if (!r.ok) {
      alert('Could not save product');
      return;
    }
    const data = await r.json();
    setProduct(data.product || ready);
    setMessage('Product saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Filter media items in modal
  const filteredMedia = useMemo(() => {
    let list = mediaList;
    if (mediaFilter !== 'all') {
      list = list.filter((m) => m.category === mediaFilter);
    }
    if (mediaSearch.trim()) {
      const q = mediaSearch.trim().toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q));
    }
    return list;
  }, [mediaList, mediaFilter, mediaSearch]);

  if (mode === 'list') {
    return (
      <div>
        <Title
          title="Products"
          action={
            <Link className="tk-page-action" href="/admin/products/new">
              <Plus size={15} /> Add Product
            </Link>
          }
        />

        {message && <div className="tk-save-message">{message}</div>}

        <div className="tk-panel">
          <div className="tk-product-status-tabs">
            <button
              type="button"
              className={statusFilter === 'all' ? 'active' : ''}
              onClick={() => setStatusFilter('all')}
            >
              All <span>{statusCounts.all}</span>
            </button>
            <button
              type="button"
              className={statusFilter === 'published' ? 'active' : ''}
              onClick={() => setStatusFilter('published')}
            >
              Published <span>{statusCounts.published}</span>
            </button>
            <button
              type="button"
              className={statusFilter === 'draft' ? 'active' : ''}
              onClick={() => setStatusFilter('draft')}
            >
              Drafts <span>{statusCounts.draft}</span>
            </button>
            <button
              type="button"
              className={statusFilter === 'trash' ? 'active' : ''}
              onClick={() => setStatusFilter('trash')}
            >
              Trash <span>{statusCounts.trash}</span>
            </button>
          </div>

          <div className="tk-list-tools">
            <div className="tk-search">
              <Search size={16} />
              <input
                placeholder="Search products by name, SKU, brand or category..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {selectedIds.length > 0 && (
            <div className="tk-selection-bar">
              <div className="tk-selection-info">
                <span>
                  <strong>{selectedIds.length}</strong> product{selectedIds.length === 1 ? '' : 's'} selected
                </span>
                {selectedIds.length < filtered.length && (
                  <button type="button" className="tk-select-all-btn" onClick={selectAllFiltered}>
                    Select all {filtered.length} matching products
                  </button>
                )}
                <button type="button" className="tk-clear-select-btn" onClick={clearSelection}>
                  Clear selection
                </button>
              </div>
              <div className="tk-selection-actions">
                <button
                  type="button"
                  className="tk-bulk-trash-btn"
                  onClick={handleBulkDelete}
                  disabled={isDeletingBulk}
                >
                  <Trash2 size={14} />
                  {statusFilter === 'trash' ? 'Delete Permanently' : 'Move to Trash'}
                </button>
              </div>
            </div>
          )}

          <table className="tk-table">
            <thead>
              <tr>
                <th style={{ width: 38, textAlign: 'center' }}>
                  <button
                    type="button"
                    className="tk-checkbox-btn"
                    onClick={toggleSelectCurrentPage}
                    title={allCurrentPageSelected ? 'Deselect page' : 'Select page'}
                  >
                    {allCurrentPageSelected ? (
                      <CheckSquare size={17} color="#21785a" />
                    ) : someCurrentPageSelected ? (
                      <CheckSquare size={17} color="#889890" />
                    ) : (
                      <Square size={17} color="#889890" />
                    )}
                  </button>
                </th>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px' }}>
                    Loading products...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px' }}>
                    No products found.
                  </td>
                </tr>
              ) : (
                paginated.map((p) => {
                  const isChecked = selectedIds.includes(p.id);
                  const { date, time } = formatProductDate(p);
                  return (
                    <tr key={p.id} className={isChecked ? 'tk-row-selected' : ''}>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="tk-checkbox-btn"
                          onClick={() => toggleSelectRow(p.id)}
                        >
                          {isChecked ? (
                            <CheckSquare size={17} color="#21785a" />
                          ) : (
                            <Square size={17} color="#889890" />
                          )}
                        </button>
                      </td>
                      <td>
                        <div className="tk-product-cell">
                          {p.image ? (
                            <img src={p.image} alt={decodeHtml(p.name)} />
                          ) : (
                            <div className="tk-no-thumb">No img</div>
                          )}
                          <div>
                            <strong>
                              <Link href={`/admin/products/${p.id}`}>{decodeHtml(p.name)}</Link>
                            </strong>
                            <div style={{ fontSize: 11, color: '#78877f' }}>
                              Brand: {decodeHtml(p.brand) || '—'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{p.sku || '—'}</td>
                      <td>{decodeHtml(p.category) || '—'}</td>
                      <td>AED {Number(p.salePrice || p.regularPrice || 0).toLocaleString()}</td>
                      <td>{p.inStock || 0}</td>
                      <td>
                        <span className={`tk-post-status ${productStatus(p)}`}>
                          {productStatus(p)}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: 12 }}>{date}</div>
                        <div style={{ fontSize: 10, color: '#889890' }}>{time}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="tk-icon-btn"
                            title="Edit Product"
                          >
                            <Edit3 size={15} />
                          </Link>
                          <button
                            type="button"
                            className="tk-icon-btn danger"
                            onClick={() => remove(p)}
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="tk-pagination">
              <span>
                Showing {startIndex + 1}–{endIndex} of {totalItems}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="tk-icon-btn"
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ padding: '0 8px', fontSize: 13, alignSelf: 'center' }}>
                  {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="tk-icon-btn"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Hidden file inputs for direct computer upload
  return (
    <div>
      <input
        ref={mainImageInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleMainImageUpload}
      />
      <input
        ref={galleryImageInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleGalleryUpload}
      />
      <input
        ref={blockImageInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleBlockImageUpload}
      />

      <Title
        title={id ? 'Edit Product' : 'Add Product'}
        action={
          <div className="tk-editor-top-actions">
            <button
              type="button"
              className="tk-seo-badge-btn"
              onClick={openSeoModal}
              title="Open Google Search Preview & SEO Editor"
            >
              <Sparkles size={14} /> SEO Snippet
            </button>
            <button className="tk-page-action" onClick={saveProduct} disabled={isUploading}>
              <Save size={15} /> Save Product
            </button>
          </div>
        }
      />

      <main className="tk-editor-page">
        {message && <div className="tk-save-message">{message}</div>}

        <div className="tk-product-editor">
          {/* Main Column */}
          <section className="tk-panel tk-editor-main">
            <h3>Product details</h3>
            <label>
              Product name
              <input
                className="tk-title-input"
                value={product.name}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    name: e.target.value,
                    slug: product.slug || slugify(e.target.value),
                  })
                }
                placeholder="e.g. ZOLL AED Plus Automated External Defibrillator"
              />
            </label>

            <div className="tk-two-fields">
              <label>
                SKU
                <input
                  value={product.sku}
                  onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                  placeholder="e.g. FOM-AED-200"
                />
              </label>
              <label>
                URL slug
                <input
                  value={product.slug}
                  onChange={(e) => setProduct({ ...product, slug: slugify(e.target.value) })}
                  placeholder="zoll-aed-plus-defibrillator"
                />
              </label>
            </div>

            <label>
              Short description (Storefront excerpt & Quick View summary)
              <textarea
                rows={3}
                value={product.shortDescription || ''}
                onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
                placeholder="Concise 1-2 sentence overview of the equipment, key clinical applications and warranty status..."
              />
            </label>

            {/* Rich Gutenberg-Style Full Product Description */}
            <div className="tk-desc-card">
              <div className="tk-desc-card-header">
                <div>
                  <h3>Full Product Description</h3>
                  <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: '#64748b' }}>
                    Rich block editor for clinical specifications, features, bullet points & images.
                  </p>
                </div>
                <div className="tk-desc-mode-toggle">
                  <button
                    type="button"
                    className={`tk-desc-mode-btn ${descriptionMode === 'visual' ? 'active' : ''}`}
                    onClick={() => {
                      if (descriptionMode === 'html') {
                        setBlocksState(deserializeToBlocks(product.description || ''));
                      }
                      setDescriptionMode('visual');
                    }}
                  >
                    Visual Editor
                  </button>
                  <button
                    type="button"
                    className={`tk-desc-mode-btn ${descriptionMode === 'html' ? 'active' : ''}`}
                    onClick={() => {
                      if (descriptionMode === 'visual') {
                        setProduct((p) => ({ ...p, description: serializeBlocks(blocks) }));
                      }
                      setDescriptionMode('html');
                    }}
                  >
                    HTML Code
                  </button>
                </div>
              </div>

              {descriptionMode === 'visual' ? (
                <div className="tk-rich-editor-box">
                  <div className="tk-blocks-container">
                    {blocks.map((b, i) => {
                      const isActive = activeBlockId === b.id;
                      return (
                        <div
                          key={b.id}
                          className={`tk-block-wrapper ${isActive ? 'active-block' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveBlockId(b.id);
                          }}
                        >
                          {/* Floating Gutenberg Toolbar above active block */}
                          {isActive && (
                            <div
                              className="fm-floating-toolbar"
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              {/* Block Type Dropdown */}
                              <div style={{ position: 'relative' }}>
                                <button
                                  type="button"
                                  className={`fm-toolbar-btn ${typeMenuOpen ? 'active' : ''}`}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setTypeMenuOpen(!typeMenuOpen);
                                    setAlignMenuOpen(false);
                                    setMoreMenuOpen(false);
                                  }}
                                >
                                  {getBlockTypeMeta(b.type).icon}
                                  <span>{getBlockTypeMeta(b.type).label}</span>
                                  {typeMenuOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                </button>

                                {typeMenuOpen && (
                                  <div className="fm-toolbar-dropdown">
                                    <button
                                      type="button"
                                      className={`fm-dropdown-item ${b.type === 'paragraph' ? 'active' : ''}`}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        changeActiveBlockType('paragraph');
                                      }}
                                    >
                                      <AlignLeft size={15} />
                                      <span>Paragraph</span>
                                    </button>
                                    <button
                                      type="button"
                                      className={`fm-dropdown-item ${b.type === 'heading' || b.type === 'heading2' ? 'active' : ''}`}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        changeActiveBlockType('heading2');
                                      }}
                                    >
                                      <b>H2</b>
                                      <span>Heading 2</span>
                                    </button>
                                    <button
                                      type="button"
                                      className={`fm-dropdown-item ${b.type === 'heading3' ? 'active' : ''}`}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        changeActiveBlockType('heading3');
                                      }}
                                    >
                                      <b>H3</b>
                                      <span>Heading 3</span>
                                    </button>
                                    <button
                                      type="button"
                                      className={`fm-dropdown-item ${b.type === 'heading4' ? 'active' : ''}`}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        changeActiveBlockType('heading4');
                                      }}
                                    >
                                      <b>H4</b>
                                      <span>Heading 4</span>
                                    </button>
                                    <button
                                      type="button"
                                      className={`fm-dropdown-item ${b.type === 'list' ? 'active' : ''}`}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        changeActiveBlockType('list');
                                      }}
                                    >
                                      <List size={15} />
                                      <span>Bullet List</span>
                                    </button>
                                    <button
                                      type="button"
                                      className={`fm-dropdown-item ${b.type === 'quote' ? 'active' : ''}`}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        changeActiveBlockType('quote');
                                      }}
                                    >
                                      <Quote size={15} />
                                      <span>Quote</span>
                                    </button>
                                    <button
                                      type="button"
                                      className={`fm-dropdown-item ${b.type === 'code' ? 'active' : ''}`}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        changeActiveBlockType('code');
                                      }}
                                    >
                                      <Code size={15} />
                                      <span>Code Block</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div className="fm-toolbar-divider" />

                              {/* Alignment */}
                              <div style={{ position: 'relative' }}>
                                <button
                                  type="button"
                                  className={`fm-toolbar-btn ${alignMenuOpen ? 'active' : ''}`}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setAlignMenuOpen(!alignMenuOpen);
                                    setTypeMenuOpen(false);
                                    setMoreMenuOpen(false);
                                  }}
                                >
                                  <AlignLeft size={15} />
                                  <ChevronDown size={13} />
                                </button>

                                {alignMenuOpen && (
                                  <div className="fm-toolbar-dropdown" style={{ minWidth: 140 }}>
                                    <button
                                      type="button"
                                      className="fm-dropdown-item"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        applyFormat('justifyLeft');
                                        setAlignMenuOpen(false);
                                      }}
                                    >
                                      <AlignLeft size={15} />
                                      <span>Align Left</span>
                                    </button>
                                    <button
                                      type="button"
                                      className="fm-dropdown-item"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        applyFormat('justifyCenter');
                                        setAlignMenuOpen(false);
                                      }}
                                    >
                                      <AlignCenter size={15} />
                                      <span>Align Center</span>
                                    </button>
                                    <button
                                      type="button"
                                      className="fm-dropdown-item"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        applyFormat('justifyRight');
                                        setAlignMenuOpen(false);
                                      }}
                                    >
                                      <AlignRight size={15} />
                                      <span>Align Right</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div className="fm-toolbar-divider" />

                              {/* Bold */}
                              <button
                                type="button"
                                className="fm-toolbar-btn"
                                title="Bold"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  applyFormat('bold');
                                }}
                              >
                                <span style={{ fontWeight: 800, fontSize: 14 }}>B</span>
                              </button>

                              {/* Italic */}
                              <button
                                type="button"
                                className="fm-toolbar-btn"
                                title="Italic"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  applyFormat('italic');
                                }}
                              >
                                <span style={{ fontStyle: 'italic', fontFamily: 'serif', fontWeight: 600, fontSize: 15 }}>
                                  I
                                </span>
                              </button>

                              {/* Underline */}
                              <button
                                type="button"
                                className="fm-toolbar-btn"
                                title="Underline"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  applyFormat('underline');
                                }}
                              >
                                <span style={{ textDecoration: 'underline', fontWeight: 600, fontSize: 14 }}>
                                  U
                                </span>
                              </button>

                              <div className="fm-toolbar-divider" />

                              {/* Link */}
                              <button
                                type="button"
                                className="fm-toolbar-btn"
                                title="Link"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  applyLink();
                                }}
                              >
                                <Link2 size={15} />
                              </button>

                              {/* Highlight */}
                              <button
                                type="button"
                                className="fm-toolbar-btn"
                                title="Highlight"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  applyHighlight();
                                }}
                              >
                                <Highlighter size={15} color="#e11d48" />
                              </button>

                              <div className="fm-toolbar-divider" />

                              {/* More Options ⋮ */}
                              <div style={{ position: 'relative' }}>
                                <button
                                  type="button"
                                  className={`fm-toolbar-btn ${moreMenuOpen ? 'active' : ''}`}
                                  title="More formatting"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setMoreMenuOpen(!moreMenuOpen);
                                    setTypeMenuOpen(false);
                                    setAlignMenuOpen(false);
                                  }}
                                >
                                  <MoreVertical size={16} />
                                </button>

                                {moreMenuOpen && (
                                  <div className="fm-toolbar-dropdown right">
                                    <button
                                      type="button"
                                      className="fm-dropdown-item"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        applyFormat('strikeThrough');
                                        setMoreMenuOpen(false);
                                      }}
                                    >
                                      <Strikethrough size={14} />
                                      <span>Strikethrough</span>
                                    </button>
                                    <button
                                      type="button"
                                      className="fm-dropdown-item"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        applyInlineCode();
                                        setMoreMenuOpen(false);
                                      }}
                                    >
                                      <Code size={14} />
                                      <span>Inline Code</span>
                                    </button>
                                    <button
                                      type="button"
                                      className="fm-dropdown-item"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        applyFormat('subscript');
                                        setMoreMenuOpen(false);
                                      }}
                                    >
                                      <span style={{ fontSize: 13, fontWeight: 700 }}>
                                        X<sub style={{ fontSize: 10 }}>2</sub>
                                      </span>
                                      <span>Subscript</span>
                                    </button>
                                    <button
                                      type="button"
                                      className="fm-dropdown-item"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        applyFormat('superscript');
                                        setMoreMenuOpen(false);
                                      }}
                                    >
                                      <span style={{ fontSize: 13, fontWeight: 700 }}>
                                        X<sup style={{ fontSize: 10 }}>2</sup>
                                      </span>
                                      <span>Superscript</span>
                                    </button>
                                    <div className="fm-dropdown-sep" />
                                    <button
                                      type="button"
                                      className="fm-dropdown-item danger"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        applyFormat('removeFormat');
                                        setMoreMenuOpen(false);
                                      }}
                                    >
                                      <X size={13} />
                                      <span>Clear Formatting</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Block Content */}
                          {b.type === 'image' ? (
                            <div className="tk-image-block">
                              {b.content ? (
                                <div>
                                  <img src={b.content} alt="Product description image" />
                                  <div className="tk-image-block-actions">
                                    <button
                                      type="button"
                                      className="tk-btn-media-computer"
                                      onClick={() => {
                                        setTargetBlockId(b.id);
                                        blockImageInputRef.current?.click();
                                      }}
                                    >
                                      <Upload size={13} /> Replace from Computer
                                    </button>
                                    <button
                                      type="button"
                                      className="tk-btn-media-library"
                                      onClick={() => openMediaModal('block', b.id)}
                                    >
                                      <FolderOpen size={13} /> Select from Library
                                    </button>
                                    <button
                                      type="button"
                                      className="tk-btn-media-computer"
                                      onClick={() => {
                                        const url = prompt('Image URL:', b.content);
                                        if (url !== null) {
                                          setBlocks(blocks.map((x) => (x.id === b.id ? { ...x, content: url } : x)));
                                        }
                                      }}
                                    >
                                      Edit URL
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <ImageIcon size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
                                  <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#64748b' }}>
                                    Insert an image illustration or diagram into description
                                  </p>
                                  <div className="tk-image-block-actions">
                                    <button
                                      type="button"
                                      className="tk-btn-media-computer"
                                      onClick={() => {
                                        setTargetBlockId(b.id);
                                        blockImageInputRef.current?.click();
                                      }}
                                    >
                                      <Upload size={13} /> Upload from Computer
                                    </button>
                                    <button
                                      type="button"
                                      className="tk-btn-media-library"
                                      onClick={() => openMediaModal('block', b.id)}
                                    >
                                      <FolderOpen size={13} /> Choose from Website Library
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <BlockContentEditor
                              block={b}
                              onFocus={() => setActiveBlockId(b.id)}
                              onChange={(content) =>
                                setBlocks(blocks.map((x) => (x.id === b.id ? { ...x, content } : x)))
                              }
                              onEnter={() => addBlock('paragraph', i)}
                            />
                          )}

                          {/* Block Right Controls */}
                          <div className="tk-block-controls">
                            {i > 0 && (
                              <button
                                type="button"
                                className="tk-block-ctrl-btn"
                                title="Move block up"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const n = [...blocks];
                                  [n[i - 1], n[i]] = [n[i], n[i - 1]];
                                  setBlocks(n);
                                }}
                              >
                                <ChevronUp size={13} />
                              </button>
                            )}
                            {i < blocks.length - 1 && (
                              <button
                                type="button"
                                className="tk-block-ctrl-btn"
                                title="Move block down"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const n = [...blocks];
                                  [n[i], n[i + 1]] = [n[i + 1], n[i]];
                                  setBlocks(n);
                                }}
                              >
                                <ChevronDown size={13} />
                              </button>
                            )}
                            <button
                              type="button"
                              className="tk-block-ctrl-btn"
                              title="Add block below"
                              onClick={(e) => {
                                e.stopPropagation();
                                addBlock('paragraph', i);
                              }}
                            >
                              <Plus size={13} />
                            </button>
                            {blocks.length > 1 && (
                              <button
                                type="button"
                                className="tk-block-ctrl-btn danger"
                                title="Delete block"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBlocks(blocks.filter((x) => x.id !== b.id));
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Block Row */}
                  <div className="tk-add-block-row">
                    <button
                      type="button"
                      className="tk-add-block-btn"
                      onClick={() => setShowBlockPicker(!showBlockPicker)}
                    >
                      <Plus size={14} /> Add Block (Heading, List, Quote, Image...)
                    </button>
                  </div>

                  {showBlockPicker && (
                    <div className="fm-picker" style={{ position: 'relative', margin: '14px 0 0', top: 'auto', left: 'auto', width: '100%', maxWidth: 480 }}>
                      <button
                        type="button"
                        className="fm-picker-x"
                        onClick={() => setShowBlockPicker(false)}
                      >
                        <X size={16} />
                      </button>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: 12 }}>
                        <button type="button" onClick={() => addBlock('paragraph')}>
                          <AlignLeft size={16} /> Paragraph
                        </button>
                        <button type="button" onClick={() => addBlock('heading2')}>
                          <span style={{ fontWeight: 800 }}>H2</span> Heading 2
                        </button>
                        <button type="button" onClick={() => addBlock('heading3')}>
                          <span style={{ fontWeight: 800 }}>H3</span> Heading 3
                        </button>
                        <button type="button" onClick={() => addBlock('list')}>
                          <List size={16} /> Bullet List
                        </button>
                        <button type="button" onClick={() => addBlock('quote')}>
                          <Quote size={16} /> Quote
                        </button>
                        <button type="button" onClick={() => addBlock('image')}>
                          <ImageIcon size={16} /> Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <textarea
                    rows={16}
                    value={product.description || ''}
                    onChange={(e) => {
                      setProduct({ ...product, description: e.target.value });
                    }}
                    style={{
                      width: '100%',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      padding: '14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                    }}
                    placeholder="<p>Write raw HTML product description...</p>"
                  />
                </div>
              )}
            </div>

            <h3>Product data</h3>
            <div className="tk-two-fields">
              <label>
                Regular price (AED)
                <input
                  type="number"
                  value={product.regularPrice || 0}
                  onChange={(e) =>
                    setProduct({ ...product, regularPrice: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Sale price (AED)
                <input
                  type="number"
                  value={product.salePrice || 0}
                  onChange={(e) =>
                    setProduct({ ...product, salePrice: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Stock quantity
                <input
                  type="number"
                  value={product.inStock || 0}
                  onChange={(e) =>
                    setProduct({ ...product, inStock: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Stock status
                <select
                  value={product.stockStatus || 'instock'}
                  onChange={(e) => setProduct({ ...product, stockStatus: e.target.value })}
                >
                  <option value="instock">In stock</option>
                  <option value="outofstock">Out of stock</option>
                  <option value="onbackorder">On backorder</option>
                </select>
              </label>
            </div>

            <label>
              Technical specifications <small>One per line: Label: Value</small>
              <textarea
                rows={7}
                value={specText}
                onChange={(e) => setSpecText(e.target.value)}
                placeholder={'Model: AED-Plus-Pro\nWarranty: 2 Years Official UAE\nPower: Lithium 123A Battery\nCertifications: CE, ISO 13485'}
              />
            </label>
          </section>

          {/* Sidebar */}
          <aside className="tk-editor-side">
            {/* Publish Panel */}
            <div className="tk-panel">
              <h3>Publish</h3>
              <label>
                Status
                <select
                  value={product.status || 'draft'}
                  onChange={(e) => setProduct({ ...product, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label>
                Purchase mode
                <select
                  value={product.purchaseMode || 'cart'}
                  onChange={(e) => setProduct({ ...product, purchaseMode: e.target.value })}
                >
                  <option value="cart">Add to cart</option>
                  <option value="quote">Request quote</option>
                  <option value="enquire">Enquiry only</option>
                </select>
              </label>
            </div>

            {/* Organisation Panel */}
            <div className="tk-panel">
              <h3>Organisation</h3>
              <label>
                Category
                <input
                  list="product-categories"
                  value={product.category || ''}
                  onChange={(e) => setProduct({ ...product, category: e.target.value })}
                  placeholder="e.g. ICU & Critical Care"
                />
                <datalist id="product-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>
              <label>
                Brand
                <input
                  value={product.brand || ''}
                  onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                  placeholder="e.g. ZOLL Medical"
                />
              </label>
              <label>
                Tags <small>Comma separated</small>
                <input
                  value={(product.tags || []).join(', ')}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      tags: e.target.value
                        .split(',')
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="defibrillator, critical care, uae hospital"
                />
              </label>
              <label>
                Warranty
                <input
                  value={product.warrantyPeriod || ''}
                  onChange={(e) => setProduct({ ...product, warrantyPeriod: e.target.value })}
                  placeholder="e.g. 2 Years FastonMed UAE"
                />
              </label>
            </div>

            {/* Product Images Panel */}
            <div className="tk-panel">
              <h3>Product Images</h3>

              {/* Main Product Image */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 750, color: '#405049' }}>
                    Main Product Image
                  </span>
                  <button
                    type="button"
                    style={{ border: 0, background: 'none', color: '#2563eb', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                    onClick={() => setShowDirectUrlInput(!showDirectUrlInput)}
                  >
                    {showDirectUrlInput ? 'Hide URL input' : 'Enter Direct URL'}
                  </button>
                </div>

                {product.image ? (
                  <div className="tk-main-image-preview-box">
                    <img src={product.image} alt="Main preview" />
                    <button
                      type="button"
                      className="tk-main-image-remove-btn"
                      title="Remove image"
                      onClick={() => setProduct({ ...product, image: '' })}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      border: '1.5px dashed #cbd5e1',
                      borderRadius: '8px',
                      padding: '24px 14px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      marginBottom: '10px',
                    }}
                  >
                    <ImageIcon size={28} color="#94a3b8" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '12px', color: '#64748b' }}>No main image set</div>
                  </div>
                )}

                <div className="tk-image-upload-actions">
                  <button
                    type="button"
                    className="tk-btn-media-computer"
                    onClick={() => mainImageInputRef.current?.click()}
                    title="Select an image file from your computer"
                  >
                    <Upload size={13} /> From Computer
                  </button>
                  <button
                    type="button"
                    className="tk-btn-media-library"
                    onClick={() => openMediaModal('main')}
                    title="Select from website media library"
                  >
                    <FolderOpen size={13} /> Website Library
                  </button>
                </div>

                {showDirectUrlInput && (
                  <div style={{ marginTop: 8 }}>
                    <input
                      style={{ fontSize: 12 }}
                      value={product.image || ''}
                      onChange={(e) => setProduct({ ...product, image: e.target.value })}
                      placeholder="https://... or /products/..."
                    />
                  </div>
                )}
              </div>

              {/* Gallery Images */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 750, color: '#405049' }}>
                    Gallery Images ({(product.galleryImages || []).length})
                  </span>
                </div>

                {(product.galleryImages || []).length > 0 && (
                  <div className="tk-gallery-grid">
                    {(product.galleryImages || []).map((imgUrl, idx) => (
                      <div key={idx} className="tk-gallery-item">
                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} />
                        <button
                          type="button"
                          className="tk-gallery-item-remove"
                          title="Remove image"
                          onClick={() => {
                            const updated = (product.galleryImages || []).filter((_, i) => i !== idx);
                            setProduct({ ...product, galleryImages: updated });
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="tk-image-upload-actions">
                  <button
                    type="button"
                    className="tk-btn-media-computer"
                    onClick={() => galleryImageInputRef.current?.click()}
                  >
                    <Upload size={13} /> Add Computer Images
                  </button>
                  <button
                    type="button"
                    className="tk-btn-media-library"
                    onClick={() => openMediaModal('gallery')}
                  >
                    <FolderOpen size={13} /> Add from Library
                  </button>
                </div>
              </div>
            </div>

            {/* SEO & Search Snippet Panel */}
            <div className="tk-panel">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ margin: 0, padding: 0, border: 0 }}>SEO & Search Snippet</h3>
                <button
                  type="button"
                  onClick={openSeoModal}
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '5px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#2563eb',
                    background: '#eff6ff',
                    cursor: 'pointer',
                  }}
                >
                  Edit Snippet
                </button>
              </div>

              {/* Google Preview Mini Card */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  marginBottom: '14px',
                }}
              >
                <div style={{ fontSize: '10.5px', color: '#64748b', marginBottom: '2px', wordBreak: 'break-all' }}>
                  https://www.fastonmed.com/product/{product.slug || slugify(product.name) || 'product-slug'}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1d4ed8', lineHeight: 1.3, marginBottom: '4px' }}>
                  {product.seoTitle || product.name || 'Product Title'}
                </div>
                <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.4 }}>
                  {product.seoDescription || product.shortDescription || 'Add a concise description for search results.'}
                </div>
              </div>

              <label>
                SEO title
                <input
                  value={product.seoTitle || ''}
                  onChange={(e) => setProduct({ ...product, seoTitle: e.target.value })}
                  placeholder="e.g. ZOLL AED Plus Defibrillator in UAE | FastonMed"
                />
              </label>
              <label>
                Meta description
                <textarea
                  rows={3}
                  value={product.seoDescription || ''}
                  onChange={(e) => setProduct({ ...product, seoDescription: e.target.value })}
                  placeholder="Search engine meta description..."
                />
              </label>
            </div>
          </aside>
        </div>
      </main>

      {/* SEO Preview Snippet Editor Modal (matching screenshot) */}
      {seoModalOpen && (
        <div className="fm-modal-backdrop" onClick={() => setSeoModalOpen(false)}>
          <div className="fm-seo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fm-seo-header">
              <h2>Preview Snippet Editor</h2>
              <button
                type="button"
                className="fm-seo-close"
                onClick={() => setSeoModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Google Search Result Preview */}
            <div className="fm-seo-preview-card">
              <h4>Preview</h4>
              <div className="fm-seo-preview-url">
                https://www.fastonmed.com/product/{draftSeoSlug || slugify(product.name) || 'product-slug'}
              </div>
              <h3 className="fm-seo-preview-title">
                {draftSeoTitle || product.name || 'Page title'}
              </h3>
              <p className="fm-seo-preview-desc">
                {draftSeoDesc || product.shortDescription || 'Add a concise description for search results.'}
              </p>
            </div>

            {/* Title Field Box */}
            <div className="fm-seo-field-box">
              <div className="fm-seo-field-header">
                <span>Title</span>
                <span className="fm-seo-counter">{draftSeoTitle.length} / 60</span>
              </div>
              <input
                className="fm-seo-input"
                value={draftSeoTitle}
                onChange={(e) => setDraftSeoTitle(e.target.value)}
                placeholder="SEO title"
              />
              <p className="fm-seo-field-hint">This appears as the first line in search results.</p>
            </div>

            {/* Permalink Field Box */}
            <div className="fm-seo-field-box">
              <div className="fm-seo-field-header">
                <span>Permalink</span>
                <span className="fm-seo-counter">{draftSeoSlug.length} / 75</span>
              </div>
              <input
                className="fm-seo-input"
                value={draftSeoSlug}
                onChange={(e) => setDraftSeoSlug(slugify(e.target.value))}
                placeholder="page-url"
              />
              <p className="fm-seo-field-hint">The unique URL of this page.</p>
            </div>

            {/* Description Field Box */}
            <div className="fm-seo-field-box">
              <div className="fm-seo-field-header">
                <span>Description</span>
                <span className="fm-seo-counter">{draftSeoDesc.length} / 160</span>
              </div>
              <textarea
                className="fm-seo-textarea"
                rows={3}
                value={draftSeoDesc}
                onChange={(e) => setDraftSeoDesc(e.target.value)}
                placeholder="Meta description"
              />
              <p className="fm-seo-field-hint">This appears below the title in search results.</p>
            </div>

            {/* Checklist */}
            <div className="fm-seo-checks">
              <div
                className={`fm-seo-check-item ${
                  draftSeoTitle.trim().length > 0 && draftSeoTitle.length <= 60 ? 'ok' : 'warn'
                }`}
              >
                <span>
                  {draftSeoTitle.trim().length > 0 && draftSeoTitle.length <= 60 ? '✓' : '✕'}
                </span>
                <div>SEO title is present and within 60 characters.</div>
              </div>

              <div
                className={`fm-seo-check-item ${
                  draftSeoDesc.trim().length >= 20 && draftSeoDesc.length <= 160 ? 'ok' : 'warn'
                }`}
              >
                <span>
                  {draftSeoDesc.trim().length >= 20 && draftSeoDesc.length <= 160 ? '✓' : '✕'}
                </span>
                <div>Meta description has a useful search-result length.</div>
              </div>

              <div
                className={`fm-seo-check-item ${
                  draftSeoSlug.trim().length > 0 && draftSeoSlug.length <= 75 ? 'ok' : 'warn'
                }`}
              >
                <span>
                  {draftSeoSlug.trim().length > 0 && draftSeoSlug.length <= 75 ? '✓' : '✕'}
                </span>
                <div>URL is concise and readable.</div>
              </div>

              <div className="fm-seo-check-item ok">
                <span>✓</span>
                <div>Add a focus keyword for additional checks.</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="fm-seo-footer">
              <button
                type="button"
                className="fm-seo-cancel-btn"
                onClick={() => setSeoModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="fm-seo-apply-btn"
                onClick={applySeoChanges}
              >
                Apply SEO changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Website Media Library & Upload Modal */}
      {mediaModalOpen && (
        <div className="fm-media-modal-backdrop" onClick={() => setMediaModalOpen(false)}>
          <div className="fm-media-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fm-media-modal-header">
              <h2>Select or Upload Image</h2>
              <button
                type="button"
                style={{ border: 0, background: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setMediaModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="fm-media-modal-nav">
              <button
                type="button"
                className={`fm-media-nav-tab ${mediaTab === 'library' ? 'active' : ''}`}
                onClick={() => setMediaTab('library')}
              >
                Website Media Library ({mediaList.length})
              </button>
              <button
                type="button"
                className={`fm-media-nav-tab ${mediaTab === 'upload' ? 'active' : ''}`}
                onClick={() => setMediaTab('upload')}
              >
                Upload from Computer
              </button>
            </div>

            {mediaTab === 'library' ? (
              <>
                <div className="fm-media-modal-toolbar">
                  <div className="fm-media-search-box">
                    <Search size={15} />
                    <input
                      placeholder="Search website media by filename or path..."
                      value={mediaSearch}
                      onChange={(e) => setMediaSearch(e.target.value)}
                    />
                  </div>
                  <div className="fm-media-cats">
                    {(['all', 'products', 'uploads', 'showcase', 'library'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`fm-media-cat-btn ${mediaFilter === cat ? 'active' : ''}`}
                        onClick={() => setMediaFilter(cat)}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="fm-media-grid-scroll">
                  {mediaLoading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                      Loading website media files...
                    </div>
                  ) : filteredMedia.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                      No images found matching your search.
                    </div>
                  ) : (
                    <div className="fm-media-grid">
                      {filteredMedia.map((m) => {
                        const isSelected = selectedMediaUrl === m.url;
                        return (
                          <div
                            key={m.url}
                            className={`fm-media-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedMediaUrl(m.url)}
                          >
                            <img src={m.url} alt={m.name} loading="lazy" />
                            {isSelected && (
                              <div className="fm-media-card-badge">
                                <Check size={13} strokeWidth={3} />
                              </div>
                            )}
                            <div className="fm-media-card-title">{m.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ padding: '24px' }}>
                <label
                  className="fm-media-dropzone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleModalFileUpload(file);
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleModalFileUpload(file);
                    }}
                  />
                  <Upload size={42} />
                  <h4>Choose an image from your computer</h4>
                  <p>PNG, JPG, WEBP, or SVG accepted • Drag and drop or click to browse</p>
                  {isUploading && (
                    <div style={{ color: '#2563eb', fontWeight: 600, fontSize: 13 }}>
                      Uploading file...
                    </div>
                  )}
                </label>
              </div>
            )}

            <div className="fm-media-modal-footer">
              <div className="fm-media-footer-info">
                {selectedMediaUrl ? (
                  <span>Selected: <strong>{selectedMediaUrl}</strong></span>
                ) : (
                  <span>Click an image to select it</span>
                )}
              </div>
              <div className="fm-media-footer-btns">
                <button
                  type="button"
                  className="fm-seo-cancel-btn"
                  onClick={() => setMediaModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="fm-seo-apply-btn"
                  disabled={!selectedMediaUrl}
                  style={{ opacity: selectedMediaUrl ? 1 : 0.5, cursor: selectedMediaUrl ? 'pointer' : 'not-allowed' }}
                  onClick={handleInsertSelectedMedia}
                >
                  Select & Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BlockContentEditor({
  block,
  onFocus,
  onChange,
  onEnter,
}: {
  block: Block;
  onFocus: () => void;
  onChange: (html: string) => void;
  onEnter: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== block.content && document.activeElement !== ref.current) {
      ref.current.innerHTML = block.content;
    }
  }, [block.content]);

  return (
    <div
      id={`fm-block-content-${block.id}`}
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className={`fm-block-editable ${block.type}`}
      data-placeholder={
        block.type.startsWith('heading')
          ? 'Heading...'
          : block.type === 'quote'
          ? 'Write a clinical quote, testimonial or highlight...'
          : block.type === 'list'
          ? 'Feature or spec bullet item (press Enter for next)...'
          : block.type === 'code'
          ? 'Write technical specifications or parameters...'
          : 'Write product description or details (Type / to choose a block)...'
      }
      onFocus={onFocus}
      onInput={(e) => onChange(e.currentTarget.innerHTML)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey && block.type !== 'code') {
          e.preventDefault();
          onEnter();
        }
      }}
    />
  );
}

function Title({
  title,
  action,
}: {
  title: string;
  action: React.ReactNode;
}) {
  return (
    <div className="tk-page-heading">
      <div>
        <h1>{title}</h1>
        <p>WooCommerce-style Fastonmed catalogue management.</p>
      </div>
      {action}
    </div>
  );
}
