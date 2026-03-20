import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, forbidden, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin') return forbidden();

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalDownloads,
      totalInstallations,
      activeInstallations,
      recentDownloads30d,
      downloadsByPlatformRaw,
      installationsByPlatformRaw,
    ] = await Promise.all([
      prisma.download.count(),
      prisma.installation.count(),
      prisma.installation.count({ where: { lastSeen: { gte: sevenDaysAgo } } }),
      prisma.download.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.download.groupBy({ by: ['platform'], _count: { id: true } }),
      prisma.installation.groupBy({ by: ['platform'], _count: { id: true } }),
    ]);

    const downloadsByPlatform = Object.fromEntries(
      downloadsByPlatformRaw.map((r) => [r.platform, r._count.id])
    );
    const installationsByPlatform = Object.fromEntries(
      installationsByPlatformRaw.map((r) => [r.platform, r._count.id])
    );

    const conversionRate = totalDownloads > 0
      ? Math.round((totalInstallations / totalDownloads) * 100 * 100) / 100
      : 0;

    return success({
      totalDownloads,
      totalInstallations,
      activeInstallations,
      recentDownloads30d,
      conversionRate,
      downloadsByPlatform,
      installationsByPlatform,
    });
  } catch (err) {
    logger.error('Get download stats failed', { requestId, route: '/api/admin/stats/downloads' });
    return serverError(requestId);
  }
}
