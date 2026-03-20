import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken, hashToken } from '@/lib/auth';
import { success, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { LogoutSchema, parseBody } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const body = await request.json().catch(() => null);
    const parsed = parseBody(LogoutSchema, body);
    if (!parsed.ok) return parsed.error;
    const { refreshToken } = parsed.data;

    const payload = verifyToken(refreshToken);
    if (payload?.type === 'refresh') {
      const tokenHash = hashToken(refreshToken);
      await prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    return success({ message: 'Logged out successfully' });
  } catch (err) {
    logger.error('Logout failed', { requestId, route: '/api/auth/logout' });
    return serverError(requestId);
  }
}
