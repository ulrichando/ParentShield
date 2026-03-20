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
    const status = searchParams.get('status') || '';

    const where = {
      ...(platform && { platform: platform as 'windows' | 'macos' | 'linux' | 'android' | 'ios' }),
      ...(status && { status: status as 'pending' | 'active' | 'inactive' | 'uninstalled' }),
    };

    const [installations, total] = await Promise.all([
      prisma.installation.findMany({
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
      prisma.installation.count({ where }),
    ]);

    const formattedInstallations = installations.map((inst) => ({
      id: inst.id,
      deviceId: inst.deviceId,
      deviceName: inst.deviceName,
      platform: inst.platform,
      status: inst.status,
      isBlocked: inst.isBlocked,
      blockedReason: inst.blockedReason,
      appVersion: inst.appVersion,
      osVersion: inst.osVersion,
      lastSeen: inst.lastSeen?.toISOString() || null,
      createdAt: inst.createdAt.toISOString(),
      user: {
        id: inst.user.id,
        email: inst.user.email,
        name: [inst.user.firstName, inst.user.lastName].filter(Boolean).join(' ') || 'Unknown',
      },
    }));

    return success({
      installations: formattedInstallations,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (err) {
    logger.error('Get installations failed', { requestId });
    return serverError(requestId);
  }
}
