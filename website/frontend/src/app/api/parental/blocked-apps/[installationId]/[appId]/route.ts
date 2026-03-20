import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, notFound, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';

type Params = { params: Promise<{ installationId: string; appId: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { installationId, appId } = await params;
    const body = await request.json().catch(() => ({}));

    const installation = await prisma.installation.findFirst({
      where: { id: installationId, userId: user.id },
    });
    if (!installation) return notFound('Installation not found');

    const app = await prisma.blockedApp.findFirst({
      where: { id: appId, installationId },
    });
    if (!app) return notFound('Blocked app not found');

    const updated = await prisma.blockedApp.update({
      where: { id: appId, installationId },
      data: {
        ...(typeof body.isEnabled === 'boolean' && { isEnabled: body.isEnabled }),
        ...(typeof body.scheduleOnly === 'boolean' && { scheduleOnly: body.scheduleOnly }),
        ...(body.scheduleStart !== undefined && { scheduleStart: body.scheduleStart }),
        ...(body.scheduleEnd !== undefined && { scheduleEnd: body.scheduleEnd }),
      },
    });

    return success(updated);
  } catch (err) {
    logger.error('Update blocked app failed', { requestId });
    return serverError(requestId);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const requestId = _request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(_request);
    if (!user) return unauthorized();

    const { installationId, appId } = await params;

    const installation = await prisma.installation.findFirst({
      where: { id: installationId, userId: user.id },
    });
    if (!installation) return notFound('Installation not found');

    const app = await prisma.blockedApp.findFirst({
      where: { id: appId, installationId },
    });
    if (!app) return notFound('Blocked app not found');

    await prisma.blockedApp.delete({ where: { id: appId, installationId } });

    return success({ message: 'App unblocked' });
  } catch (err) {
    logger.error('Delete blocked app failed', { requestId });
    return serverError(requestId);
  }
}
