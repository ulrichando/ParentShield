import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, forbidden, serverError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin') return forbidden();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');
    const platform = searchParams.get('platform') || '';

    const where = {
      ...(platform && { platform: platform as 'windows' | 'macos' | 'linux' | 'android' | 'ios' }),
    };

    const [downloads, total] = await Promise.all([
      prisma.download.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.download.count({ where }),
    ]);

    const formattedDownloads = downloads.map((dl) => ({
      id: dl.id,
      download_token: dl.downloadToken,
      platform: dl.platform,
      version: dl.version,
      source: dl.source,
      ip_address: dl.ipAddress,
      user_agent: dl.userAgent,
      referrer: dl.referrer,
      downloaded_at: dl.downloadedAt?.toISOString() || null,
      created_at: dl.createdAt.toISOString(),
      user: dl.user
        ? {
            id: dl.user.id,
            email: dl.user.email,
            name: [dl.user.firstName, dl.user.lastName].filter(Boolean).join(' ') || 'Unknown',
          }
        : null,
    }));

    return success({
      downloads: formattedDownloads,
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
    });
  } catch (err) {
    console.error('Get downloads error:', err);
    return serverError();
  }
}
