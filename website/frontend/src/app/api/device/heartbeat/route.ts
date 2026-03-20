import { NextRequest } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { success, error, unauthorized, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { HeartbeatSchema, parseBody } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const body = await request.json().catch(() => null);
    const parsed = parseBody(HeartbeatSchema, body);
    if (parsed.error) return parsed.error;
    const { deviceId, deviceSecret } = parsed.data;

    const installation = await prisma.installation.findUnique({
      where: { deviceId },
    });

    if (!installation) {
      return error('Installation not found', 404);
    }

    // Verify device secret to prevent anyone from querying arbitrary devices
    if (!installation.deviceSecretHash) {
      // Legacy installation without a secret — reject until re-registered
      return unauthorized('Device requires re-registration');
    }

    const providedHash = crypto.createHash('sha256').update(deviceSecret).digest('hex');
    if (providedHash !== installation.deviceSecretHash) {
      return unauthorized('Invalid device secret');
    }

    await prisma.installation.update({
      where: { deviceId },
      data: {
        lastSeen: new Date(),
        status: 'active',
      },
    });

    return success({
      status: 'ok',
      isBlocked: installation.isBlocked,
      blockedReason: installation.blockedReason,
    });
  } catch (err) {
    logger.error('Heartbeat failed', { requestId });
    return serverError(requestId);
  }
}
