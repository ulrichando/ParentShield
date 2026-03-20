import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, notFound, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { ScreenTimeConfigSchema, parseBody } from '@/lib/schemas';

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
      include: { screenTimeConfig: true },
    });

    if (!installation) return notFound('Installation not found');

    return success(
      installation.screenTimeConfig || {
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
      }
    );
  } catch (err) {
    logger.error('Get screen time failed', { requestId });
    return serverError(requestId);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ installationId: string }> }
) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { installationId } = await params;
    const body = await request.json().catch(() => null);
    const parsed = parseBody(ScreenTimeConfigSchema, body);
    if (parsed.error) return parsed.error;
    const data = parsed.data;

    const installation = await prisma.installation.findFirst({
      where: { id: installationId, userId: user.id },
    });

    if (!installation) return notFound('Installation not found');

    const config = await prisma.screenTimeConfig.upsert({
      where: { installationId },
      create: { installationId, ...data },
      update: data,
    });

    return success(config);
  } catch (err) {
    logger.error('Update screen time failed', { requestId });
    return serverError(requestId);
  }
}
