import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { success, error, serverError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId } = body;

    if (!deviceId) {
      return error('Device ID is required');
    }

    const installation = await prisma.installation.findUnique({
      where: { deviceId },
    });

    if (!installation) {
      return error('Installation not found', 404);
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
    console.error('Heartbeat error:', err);
    return serverError();
  }
}
