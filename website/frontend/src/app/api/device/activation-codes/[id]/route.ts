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

    const code = await prisma.activationCode.findFirst({
      where: { id, userId: user.id },
    });

    if (!code) return notFound('Activation code not found');

    await prisma.activationCode.delete({ where: { id } });

    logger.info('Activation code deleted', { requestId, userId: user.id, codeId: id });
    return success({ message: 'Code deleted' });
  } catch (err) {
    logger.error('Delete activation code failed', { requestId });
    return serverError(requestId);
  }
}
