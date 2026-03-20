import { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const codes = await prisma.activationCode.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return success(codes);
  } catch (err) {
    logger.error('Get activation codes failed', { requestId });
    return serverError(requestId);
  }
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    // Generate a readable 7-char code: XXX-XXX format
    const raw = randomBytes(3).toString('hex').toUpperCase(); // 6 hex chars
    const code = `${raw.slice(0, 3)}-${raw.slice(3, 6)}`;

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const activationCode = await prisma.activationCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    logger.info('Activation code generated', { requestId, userId: user.id });
    return success(activationCode, 201);
  } catch (err) {
    logger.error('Generate activation code failed', { requestId });
    return serverError(requestId);
  }
}
