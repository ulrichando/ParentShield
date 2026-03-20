import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, notFound, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { AlertUpdateSchema, parseBody } from '@/lib/schemas';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = parseBody(AlertUpdateSchema, body);
    if (!parsed.ok) return parsed.error;
    const data = parsed.data;

    const alert = await prisma.alert.findFirst({
      where: { id, userId: user.id },
    });

    if (!alert) return notFound('Alert not found');

    const updated = await prisma.alert.update({
      where: { id },
      data: {
        isRead: data.isRead ?? alert.isRead,
        isDismissed: data.isDismissed ?? alert.isDismissed,
      },
    });

    return success(updated);
  } catch (err) {
    logger.error('Update alert failed', { requestId, route: '/api/parental/alerts/[id]' });
    return serverError(requestId);
  }
}
