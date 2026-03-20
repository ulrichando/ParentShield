import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken, createAccessToken, createRefreshToken, hashToken } from '@/lib/auth';
import { success, unauthorized, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { RefreshTokenSchema, parseBody } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const body = await request.json().catch(() => null);
    const parsed = parseBody(RefreshTokenSchema, body);
    if (parsed.error) return parsed.error;
    const { refreshToken } = parsed.data;

    const payload = verifyToken(refreshToken);
    if (!payload || payload.type !== 'refresh') {
      return unauthorized('Invalid refresh token');
    }

    const tokenHash = hashToken(refreshToken);
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!storedToken) {
      return unauthorized('Refresh token expired or revoked');
    }

    const user = storedToken.user;
    if (!user.isActive) {
      return unauthorized('Account is suspended');
    }

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const newAccessToken = createAccessToken(user.id, user.email, user.role);
    const newRefreshToken = createRefreshToken(user.id, user.email, user.role);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(newRefreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return success({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      tokenType: 'bearer',
    });
  } catch (err) {
    logger.error('Token refresh failed', { requestId, route: '/api/auth/refresh' });
    return serverError(requestId);
  }
}
