import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, notFound, serverError } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ installationId: string }> }
) {
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
    console.error('Get blocked apps error:', err);
    return serverError();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ installationId: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { installationId } = await params;
    const body = await request.json();

    const installation = await prisma.installation.findFirst({
      where: { id: installationId, userId: user.id },
    });

    if (!installation) return notFound('Installation not found');

    const blockedApp = await prisma.blockedApp.create({
      data: {
        installationId,
        appName: body.appName,
        appPath: body.appPath,
        isGame: body.isGame || false,
        scheduleOnly: body.scheduleOnly || false,
        scheduleStart: body.scheduleStart,
        scheduleEnd: body.scheduleEnd,
      },
    });

    return success(blockedApp, 201);
  } catch (err) {
    console.error('Add blocked app error:', err);
    return serverError();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ installationId: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { installationId } = await params;
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    if (!appId) {
      return success({ error: 'App ID required' }, 400);
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
    console.error('Delete blocked app error:', err);
    return serverError();
  }
}
