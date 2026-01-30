import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, serverError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unread') === 'true';

    const where = {
      userId: user.id,
      isDismissed: false,
      ...(unreadOnly && { isRead: false }),
    };

    const [alerts, total] = await Promise.all([
      prisma.alert.findMany({
        where,
        include: { installation: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.alert.count({ where }),
    ]);

    return success({ alerts, total });
  } catch (err) {
    console.error('Get alerts error:', err);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const body = await request.json();

    const alert = await prisma.alert.create({
      data: {
        userId: user.id,
        installationId: body.installationId,
        type: body.type,
        severity: body.severity || 'medium',
        title: body.title,
        message: body.message,
        metadata: body.metadata,
      },
    });

    return success(alert, 201);
  } catch (err) {
    console.error('Create alert error:', err);
    return serverError();
  }
}
