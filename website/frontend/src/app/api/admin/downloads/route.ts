import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, forbidden, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { PaginationSchema, parseQuery } from '@/lib/schemas';

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin') return forbidden();

    const { searchParams } = new URL(request.url);
    const pagination = parseQuery(PaginationSchema, {
      page: searchParams.get('page') ?? undefined,
      per_page: searchParams.get('per_page') ?? undefined,
    });
    if (!pagination.ok) return pagination.error;
    const { page, per_page: perPage } = pagination.data;
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
      downloadToken: dl.downloadToken,
      platform: dl.platform,
      version: dl.version,
      source: dl.source,
      ipAddress: dl.ipAddress,
      userAgent: dl.userAgent,
      referrer: dl.referrer,
      downloadedAt: dl.downloadedAt?.toISOString() || null,
      createdAt: dl.createdAt.toISOString(),
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
      perPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (err) {
    logger.error('Get downloads failed', { requestId });
    return serverError(requestId);
  }
}
