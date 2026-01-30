import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken, hashToken } from '@/lib/auth';
import { success, error, serverError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return error('Refresh token is required');
    }

    const payload = verifyToken(refreshToken);
    if (!payload || payload.type !== 'refresh') {
      return error('Invalid refresh token');
    }

    const tokenHash = hashToken(refreshToken);
    await prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return success({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return serverError();
  }
}
