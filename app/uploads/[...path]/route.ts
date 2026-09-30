import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getHostingerDbPool, isDbInCooldown } from '@/lib/hostinger-db';

export const dynamic = 'force-dynamic';

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse('File not found', { status: 404 });
    }

    const cleanSegments = pathSegments.map((s) => s.replace(/\.\./g, ''));
    const filename = cleanSegments[cleanSegments.length - 1];
    const relPath = cleanSegments.join('/');
    const ext = path.extname(filename).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    const localUploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const localFilePath = path.join(localUploadsDir, ...cleanSegments);

    // 1. If present on disk, serve immediately
    if (fs.existsSync(localFilePath)) {
      const fileBuffer = fs.readFileSync(localFilePath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. Fallback to MySQL media_files persistent storage
    if (!isDbInCooldown()) {
      try {
        const pool = getHostingerDbPool();
        const [rows] = await pool.query<any[]>(
          'SELECT mime_type, data FROM media_files WHERE filename = ? OR filename = ? LIMIT 1',
          [filename, relPath]
        );

        if (Array.isArray(rows) && rows.length > 0 && rows[0].data) {
          const dbData = Buffer.isBuffer(rows[0].data) ? rows[0].data : Buffer.from(rows[0].data);
          const mime = rows[0].mime_type || contentType;

          // Write back to disk cache so subsequent requests are instant
          try {
            const parentDir = path.dirname(localFilePath);
            if (!fs.existsSync(parentDir)) {
              fs.mkdirSync(parentDir, { recursive: true });
            }
            fs.writeFileSync(localFilePath, dbData);
          } catch (writeErr) {
            console.warn('[uploads-route] Could not write disk cache:', writeErr);
          }

          return new NextResponse(dbData, {
            headers: {
              'Content-Type': mime,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      } catch (dbErr) {
        console.warn('[uploads-route] MySQL media lookup error:', dbErr);
      }
    }

    return new NextResponse('Not found', { status: 404 });
  } catch (err: any) {
    console.error('[uploads-route] Error serving uploaded file:', err);
    return new NextResponse('Server Error', { status: 500 });
  }
}
