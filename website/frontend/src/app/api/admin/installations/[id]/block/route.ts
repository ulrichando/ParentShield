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

    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason') || 'Blocked by admin';

    const installation = await prisma.installation.findUnique({ where: { id: (await params).id } });
    if (!installation) return notFound();

    const updated = await prisma.installation.update({
      where: { id: (await params).id },
      data: { isBlocked: true, blockedReason: reason },
    });

    return success({ id: updated.id, isBlocked: updated.isBlocked, blockedReason: updated.blockedReason });
  } catch (err) {
    logger.error('Block installation failed', { requestId, installationId: (await params).id });
    return serverError(requestId);
  }
}
