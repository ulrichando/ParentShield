import { NextRequest } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { DownloadRequestSchema, parseBody } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const body = await request.json().catch(() => null);
    const parsed = parseBody(DownloadRequestSchema, body);
    if (!parsed.ok) return parsed.error;

    const { platform, source, appVersion } = parsed.data;

    const downloadToken = crypto.randomBytes(32).toString('hex');

    await prisma.download.create({
      data: {
        userId: user.id,
        downloadToken,
        platform,
        source: source ?? 'dashboard',
        version: appVersion,
        ipAddress:
          request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? undefined,
        userAgent: request.headers.get('user-agent') ?? undefined,
      },
    });

    return success({ downloadToken }, 201);
  } catch (err) {
    logger.error('Create download record failed', { requestId });
    return serverError(requestId);
  }
}
