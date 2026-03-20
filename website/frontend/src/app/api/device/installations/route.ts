import { NextRequest } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { InstallationSchema, parseBody } from '@/lib/schemas';

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const installations = await prisma.installation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return success(installations);
  } catch (err) {
    logger.error('Get installations failed', { requestId });
    return serverError(requestId);
  }
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const body = await request.json().catch(() => null);
    const parsed = parseBody(InstallationSchema, body);
    if (parsed.error) return parsed.error;
    const { deviceId, deviceName, platform, appVersion, osVersion } = parsed.data;

    const existing = await prisma.installation.findUnique({
      where: { deviceId },
    });

    if (existing) {
      const updated = await prisma.installation.update({
        where: { deviceId },
        data: {
          deviceName,
          appVersion,
          osVersion,
          status: 'active',
          lastSeen: new Date(),
        },
      });
      // Don't re-expose the secret on update
      const { deviceSecretHash: _omit, ...rest } = updated;
      return success(rest);
    }

    // Generate a device secret for heartbeat authentication
    const deviceSecret = crypto.randomBytes(32).toString('hex');
    const deviceSecretHash = crypto.createHash('sha256').update(deviceSecret).digest('hex');

    const installation = await prisma.installation.create({
      data: {
        userId: user.id,
        deviceId,
        deviceSecretHash,
        deviceName,
        platform,
        appVersion,
        osVersion,
        status: 'active',
        lastSeen: new Date(),
      },
    });

    const { deviceSecretHash: _omit, ...rest } = installation;
    // Return the plaintext secret exactly once — the client must store it
    return success({ ...rest, deviceSecret }, 201);
  } catch (err) {
    logger.error('Register installation failed', { requestId });
    return serverError(requestId);
  }
}
