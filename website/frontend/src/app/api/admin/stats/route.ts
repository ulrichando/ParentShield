import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, forbidden, serverError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin') return forbidden();

    const [
      totalCustomers,
      activeSubscriptions,
      totalRevenue,
      totalDownloads,
      totalInstallations,
      recentCustomers,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.transaction.aggregate({
        where: { status: 'succeeded' },
        _sum: { amount: true },
      }),
      prisma.download.count(),
      prisma.installation.count(),
      prisma.user.count({
        where: {
          role: 'customer',
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return success({
      totalCustomers,
      activeSubscriptions,
      totalRevenue: (totalRevenue._sum.amount || 0) / 100,
      totalDownloads,
      totalInstallations,
      recentCustomers,
      conversionRate: totalDownloads > 0
        ? ((activeSubscriptions / totalDownloads) * 100).toFixed(2)
        : 0,
    });
  } catch (err) {
    console.error('Get admin stats error:', err);
    return serverError();
  }
}
