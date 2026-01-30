import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, serverError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return unauthorized();
    }

    const installations = await prisma.installation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return success(installations);
  } catch (err) {
    console.error('Get installations error:', err);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return unauthorized();
    }

    const body = await request.json();
    const { deviceId, deviceName, platform, appVersion, osVersion } = body;

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
      return success(updated);
    }

    const installation = await prisma.installation.create({
      data: {
        userId: user.id,
        deviceId,
        deviceName,
        platform,
        appVersion,
        osVersion,
        status: 'active',
        lastSeen: new Date(),
      },
    });

    return success(installation, 201);
  } catch (err) {
    console.error('Register installation error:', err);
    return serverError();
  }
}
