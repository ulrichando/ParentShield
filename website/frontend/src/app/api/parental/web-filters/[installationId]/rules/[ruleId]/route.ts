import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, notFound, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ installationId: string; ruleId: string }> }
) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { installationId, ruleId } = await params;

    // Verify ownership via installation → webFilterConfig → rule
    const rule = await prisma.webFilterRule.findFirst({
      where: {
        id: ruleId,
        webFilter: {
          installationId,
          installation: { userId: user.id },
        },
      },
    });

    if (!rule) return notFound('Rule not found');

    await prisma.webFilterRule.delete({ where: { id: ruleId } });

    return success({ id: ruleId });
  } catch (err) {
    logger.error('Delete web filter rule failed', { requestId });
    return serverError(requestId);
  }
}
