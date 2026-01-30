import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, error, unauthorized, notFound, serverError } from '@/lib/api-response';

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
      include: { screenTimeConfig: true },
    });

    if (!installation) return notFound('Installation not found');

    return success(installation.screenTimeConfig || {
      enabled: false,
      mondayLimit: null,
      tuesdayLimit: null,
      wednesdayLimit: null,
      thursdayLimit: null,
      fridayLimit: null,
      saturdayLimit: null,
      sundayLimit: null,
      allowedStart: null,
      allowedEnd: null,
    });
  } catch (err) {
    console.error('Get screen time error:', err);
    return serverError();
  }
}

export async function PUT(
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

    const config = await prisma.screenTimeConfig.upsert({
      where: { installationId },
      create: {
        installationId,
        ...body,
      },
      update: body,
    });

    return success(config);
  } catch (err) {
    console.error('Update screen time error:', err);
    return serverError();
  }
}
