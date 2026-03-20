import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, notFound, serverError, error } from '@/lib/api-response';
import { logger } from '@/lib/logger';

const LinkDeviceSchema = z.object({
  code: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const body = await request.json().catch(() => null);
    const parsed = LinkDeviceSchema.safeParse(body);
    if (!parsed.success) {
      return error('Invalid request body', 400);
    }

    const { code } = parsed.data;
    const now = new Date();

    const linkingCode = await prisma.deviceLinkingCode.findFirst({
      where: { code, linkedAt: null, expiresAt: { gt: now } },
    });

    if (!linkingCode) return notFound('Code not found or already used');

    // Transfer the installation to the current user and mark code as linked
    await prisma.$transaction([
      prisma.installation.update({
        where: { id: linkingCode.installationId },
        data: { userId: user.id, status: 'active' },
      }),
      prisma.deviceLinkingCode.update({
        where: { id: linkingCode.id },
        data: { linkedAt: now },
      }),
    ]);

    const installation = await prisma.installation.findUnique({
      where: { id: linkingCode.installationId },
    });

    logger.info('Device linked via code', {
      requestId,
      userId: user.id,
      installationId: linkingCode.installationId,
    });

    return success({ installation });
  } catch (err) {
    logger.error('Link device failed', { requestId });
    return serverError(requestId);
  }
}
