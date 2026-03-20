import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, notFound, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { AlertCreateSchema, parseBody } from '@/lib/schemas';

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50') || 50, 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0') || 0, 0);
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
    logger.error('Get alerts failed', { requestId });
    return serverError(requestId);
  }
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const body = await request.json().catch(() => null);
    const parsed = parseBody(AlertCreateSchema, body);
    if (!parsed.ok) return parsed.error;
    const data = parsed.data;

    // Verify installationId belongs to the current user
    if (data.installationId) {
      const installation = await prisma.installation.findFirst({
        where: { id: data.installationId, userId: user.id },
      });
      if (!installation) return notFound('Installation not found');
    }

    const alert = await prisma.alert.create({
      data: {
        userId: user.id,
        installationId: data.installationId,
        type: data.type,
        severity: data.severity,
        title: data.title,
        message: data.message,
        metadata: data.metadata,
      },
    });

    return success(alert, 201);
  } catch (err) {
    logger.error('Create alert failed', { requestId });
    return serverError(requestId);
  }
}
