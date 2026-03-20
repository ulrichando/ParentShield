import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, notFound, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { id } = await params;

    const installation = await prisma.installation.findFirst({
      where: { id, userId: user.id },
    });

    if (!installation) return notFound('Installation not found');

    await prisma.installation.delete({ where: { id } });

    logger.info('Installation deleted', { requestId, userId: user.id, installationId: id });
    return success({ message: 'Device removed' });
  } catch (err) {
    logger.error('Delete installation failed', { requestId });
    return serverError(requestId);
  }
}
