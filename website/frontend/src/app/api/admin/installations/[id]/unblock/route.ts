import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, forbidden, notFound, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin') return forbidden();

    const installation = await prisma.installation.findUnique({ where: { id: (await params).id } });
    if (!installation) return notFound();

    const updated = await prisma.installation.update({
      where: { id: (await params).id },
      data: { isBlocked: false, blockedReason: null },
    });

    return success({ id: updated.id, isBlocked: updated.isBlocked, blockedReason: updated.blockedReason });
  } catch (err) {
    logger.error('Unblock installation failed', { requestId, installationId: (await params).id });
    return serverError(requestId);
  }
}
