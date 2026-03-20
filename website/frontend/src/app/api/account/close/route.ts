import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function DELETE(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: false },
    });

    logger.info('Account closed', { requestId, userId: user.id, route: '/api/account/close' });
    return success({ message: 'Account closed successfully' });
  } catch (err) {
    logger.error('Close account failed', { requestId, route: '/api/account/close' });
    return serverError(requestId);
  }
}
