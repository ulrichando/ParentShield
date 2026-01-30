import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken, createAccessToken, createRefreshToken, hashToken } from '@/lib/auth';
import { success, error, unauthorized, serverError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return error('Refresh token is required');
    }

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
    console.error('Refresh error:', err);
    return serverError();
  }
}
