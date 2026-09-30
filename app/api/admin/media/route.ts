import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { saveMediaFileToHostingerDb } from '@/lib/hostinger-db';

export const dynamic = 'force-dynamic';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

interface MediaItem {
  url: string;
  name: string;
  category: 'uploads' | 'products' | 'showcase' | 'library';
  mtime?: number;
}

function scanDir(dirPath: string, relativePrefix: string, category: MediaItem['category'], maxFiles = 100): MediaItem[] {
  if (!fs.existsSync(dirPath)) return [];
  const results: MediaItem[] = [];
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (results.length >= maxFiles) break;
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
          const stats = fs.statSync(path.join(dirPath, entry.name));
          results.push({
            url: `${relativePrefix}/${entry.name}`,
            name: entry.name,
            category,
            mtime: stats.mtimeMs,
          });
        }
      } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
        // Scan one level of subdirectories (e.g. 2025/11)
        try {
          const subEntries = fs.readdirSync(path.join(dirPath, entry.name), { withFileTypes: true });
          for (const sub of subEntries) {
            if (results.length >= maxFiles) break;
            if (sub.isFile()) {
              const ext = path.extname(sub.name).toLowerCase();
              if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
                const stats = fs.statSync(path.join(dirPath, entry.name, sub.name));
                results.push({
                  url: `${relativePrefix}/${entry.name}/${sub.name}`,
                  name: sub.name,
                  category,
                  mtime: stats.mtimeMs,
                });
              }
            }
          }
        } catch {}
      }
    }
  } catch (err) {
    console.error(`Error scanning ${dirPath}:`, err);
  }
  return results;
}

export async function GET(request: Request) {
  try {
    ensureUploadsDir();
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('q') || '').trim().toLowerCase();
    const cat = searchParams.get('category') || 'all';

    const uploads = scanDir(UPLOADS_DIR, '/uploads', 'uploads', 80);
    const products = scanDir(path.join(PUBLIC_DIR, 'products'), '/products', 'products', 50);
    const showcase = scanDir(path.join(PUBLIC_DIR, 'images', 'hero-showcase'), '/images/hero-showcase', 'showcase', 30);
    const wpContent = scanDir(path.join(PUBLIC_DIR, 'wp-content', 'uploads'), '/wp-content/uploads', 'library', 100);
    const original = scanDir(path.join(PUBLIC_DIR, 'images', 'original'), '/images/original', 'library', 60);

    let all: MediaItem[] = [
      ...uploads,
      ...products,
      ...showcase,
      ...wpContent,
      ...original,
    ];

    // Deduplicate by URL
    const seen = new Set<string>();
    all = all.filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });

    // Sort: uploads first, then newest
    all.sort((a, b) => {
      if (a.category === 'uploads' && b.category !== 'uploads') return -1;
      if (b.category === 'uploads' && a.category !== 'uploads') return 1;
      return (b.mtime || 0) - (a.mtime || 0);
    });

    if (cat && cat !== 'all') {
      all = all.filter((x) => x.category === cat);
    }

    if (search) {
      all = all.filter((x) => x.name.toLowerCase().includes(search) || x.url.toLowerCase().includes(search));
    }

    return NextResponse.json({ success: true, media: all });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to list media' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    ensureUploadsDir();

    const contentType = request.headers.get('content-type') || '';

    // Handle multipart form data upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeBase = file.name
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, '-')
        .replace(/-+/g, '-');
      const filename = `${Date.now()}-${safeBase}`;
      const filePath = path.join(UPLOADS_DIR, filename);

      fs.writeFileSync(filePath, buffer);

      // Persist to MySQL media_files table so Git deploys never delete it
      saveMediaFileToHostingerDb(filename, file.type || 'image/jpeg', buffer).catch((e) =>
        console.warn('Could not save media file to MySQL:', e)
      );

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
        name: file.name,
      });
    }

    // Handle base64 JSON payload
    const body = await request.json();
    if (body.dataUrl) {
      const matches = body.dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json({ success: false, error: 'Invalid data URL' }, { status: 400 });
      }

      const mimeType = matches[1];
      const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
      const safeName = (body.filename || 'upload')
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, '-')
        .replace(/\.[^/.]+$/, '');
      const filename = `${Date.now()}-${safeName}.${ext}`;
      const buffer = Buffer.from(matches[2], 'base64');
      const filePath = path.join(UPLOADS_DIR, filename);

      fs.writeFileSync(filePath, buffer);

      // Persist to MySQL media_files table
      saveMediaFileToHostingerDb(filename, mimeType, buffer).catch((e) =>
        console.warn('Could not save media file to MySQL:', e)
      );

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
        name: filename,
      });
    }

    return NextResponse.json({ success: false, error: 'Unsupported upload format' }, { status: 400 });
  } catch (err: any) {
    console.error('Media upload error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Upload failed' }, { status: 500 });
  }
}
