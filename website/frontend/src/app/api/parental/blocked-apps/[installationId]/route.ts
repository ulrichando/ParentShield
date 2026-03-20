import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, error, unauthorized, notFound, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { BlockedAppSchema, parseBody } from '@/lib/schemas';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ installationId: string }> }
) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { installationId } = await params;

    const installation = await prisma.installation.findFirst({
      where: { id: installationId, userId: user.id },
    });

    if (!installation) return notFound('Installation not found');

    const blockedApps = await prisma.blockedApp.findMany({
      where: { installationId },
      orderBy: { createdAt: 'desc' },
    });

    return success(blockedApps);
  } catch (err) {
    logger.error('Get blocked apps failed', { requestId });
    return serverError(requestId);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ installationId: string }> }
) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { installationId } = await params;
    const body = await request.json().catch(() => null);
    const parsed = parseBody(BlockedAppSchema, body);
    if (parsed.error) return parsed.error;
    const data = parsed.data;

    const installation = await prisma.installation.findFirst({
      where: { id: installationId, userId: user.id },
    });

    if (!installation) return notFound('Installation not found');

    const blockedApp = await prisma.blockedApp.create({
      data: {
        installationId,
        appName: data.appName,
        appPath: data.appPath,
        isGame: data.isGame ?? false,
        scheduleOnly: data.scheduleOnly ?? false,
        scheduleStart: data.scheduleStart ?? null,
        scheduleEnd: data.scheduleEnd ?? null,
      },
    });

    return success(blockedApp, 201);
  } catch (err) {
    logger.error('Add blocked app failed', { requestId });
    return serverError(requestId);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ installationId: string }> }
) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { installationId } = await params;
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    if (!appId) {
      return error('App ID required', 400);
    }

    const installation = await prisma.installation.findFirst({
      where: { id: installationId, userId: user.id },
    });

    if (!installation) return notFound('Installation not found');

    await prisma.blockedApp.delete({
      where: { id: appId },
    });

    return success({ message: 'App unblocked' });
  } catch (err) {
    logger.error('Delete blocked app failed', { requestId });
    return serverError(requestId);
  }
}
