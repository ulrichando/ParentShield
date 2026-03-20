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

    const key = await prisma.aPIKey.findFirst({
      where: { id, userId: user.id },
    });

    if (!key) return notFound('API key not found');

    await prisma.aPIKey.update({
      where: { id },
      data: { revokedAt: new Date() },
    });

    return success({ id });
  } catch (err) {
    logger.error('Revoke API key failed', { requestId });
    return serverError(requestId);
  }
}
