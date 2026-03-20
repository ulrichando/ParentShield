import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, notFound, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { WebFilterConfigUpdateSchema, parseBody } from '@/lib/schemas';

async function getInstallation(installationId: string, userId: string) {
  return prisma.installation.findFirst({
    where: { id: installationId, userId },
    include: { webFilterConfig: true },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ installationId: string }> }
) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { installationId } = await params;
    const installation = await getInstallation(installationId, user.id);
    if (!installation) return notFound('Installation not found');

    if (!installation.webFilterConfig) {
      // Return defaults if not yet configured
      return success({
        id: null,
        installationId,
        enabled: false,
        blockAdult: true,
        blockGambling: true,
        blockSocialMedia: false,
        blockGaming: false,
        blockStreaming: false,
        safeSearch: true,
      });
    }

    return success(installation.webFilterConfig);
  } catch (err) {
    logger.error('Get web filter config failed', { requestId });
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
    const installation = await getInstallation(installationId, user.id);
    if (!installation) return notFound('Installation not found');

    const body = await request.json().catch(() => null);
    const parsed = parseBody(WebFilterConfigUpdateSchema, body);
    if (!parsed.ok) return parsed.error;

    const config = await prisma.webFilterConfig.upsert({
      where: { installationId },
      update: parsed.data,
      create: { installationId, ...parsed.data },
    });

    return success(config);
  } catch (err) {
    logger.error('Update web filter config failed', { requestId });
    return serverError(requestId);
  }
}
