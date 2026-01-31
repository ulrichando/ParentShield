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
      device_id: inst.deviceId,
      device_name: inst.deviceName,
      platform: inst.platform,
      status: inst.status,
      app_version: inst.appVersion,
      os_version: inst.osVersion,
      last_seen: inst.lastSeen?.toISOString() || null,
      created_at: inst.createdAt.toISOString(),
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
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
    });
  } catch (err) {
    console.error('Get installations error:', err);
    return serverError();
  }
}
