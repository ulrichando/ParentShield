import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, notFound, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { WebFilterRuleCreateSchema, parseBody } from '@/lib/schemas';

async function getWebFilterConfig(installationId: string, userId: string) {
  const installation = await prisma.installation.findFirst({
    where: { id: installationId, userId },
    include: { webFilterConfig: true },
  });
  return installation?.webFilterConfig ?? null;
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
    const config = await getWebFilterConfig(installationId, user.id);
    if (config === null) return notFound('Installation not found');

    if (!config) return success([]);

    const rules = await prisma.webFilterRule.findMany({
      where: { webFilterId: config.id },
      orderBy: { id: 'asc' },
    });

    return success(rules);
  } catch (err) {
    logger.error('Get web filter rules failed', { requestId });
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

    // Ensure config exists (upsert defaults)
    const installation = await prisma.installation.findFirst({
      where: { id: installationId, userId: user.id },
    });
    if (!installation) return notFound('Installation not found');

    const config = await prisma.webFilterConfig.upsert({
      where: { installationId },
      update: {},
      create: {
        installationId,
        enabled: false,
        blockAdult: true,
        blockGambling: true,
        blockSocialMedia: false,
        blockGaming: false,
        blockStreaming: false,
        safeSearch: true,
      },
    });

    const body = await request.json().catch(() => null);
    const parsed = parseBody(WebFilterRuleCreateSchema, body);
    if (!parsed.ok) return parsed.error;

    const rule = await prisma.webFilterRule.create({
      data: {
        webFilterId: config.id,
        pattern: parsed.data.pattern,
        isBlocked: parsed.data.isBlocked,
        isRegex: parsed.data.isRegex ?? false,
      },
    });

    return success(rule, 201);
  } catch (err) {
    logger.error('Create web filter rule failed', { requestId });
    return serverError(requestId);
  }
}
