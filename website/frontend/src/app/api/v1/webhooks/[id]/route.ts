import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, notFound, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { WebhookUpdateSchema, parseBody } from '@/lib/schemas';

async function getOwnedWebhook(id: string, userId: string) {
  return prisma.webhook.findFirst({ where: { id, userId } });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { id } = await params;
    const webhook = await getOwnedWebhook(id, user.id);
    if (!webhook) return notFound('Webhook not found');

    const body = await request.json().catch(() => null);
    const parsed = parseBody(WebhookUpdateSchema, body);
    if (!parsed.ok) return parsed.error;

    const updated = await prisma.webhook.update({
      where: { id },
      data: parsed.data,
    });

    return success({
      id: updated.id,
      url: updated.url,
      events: updated.events,
      isActive: updated.isActive,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    logger.error('Update webhook failed', { requestId });
    return serverError(requestId);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { id } = await params;
    const webhook = await getOwnedWebhook(id, user.id);
    if (!webhook) return notFound('Webhook not found');

    await prisma.webhook.delete({ where: { id } });

    return success({ id });
  } catch (err) {
    logger.error('Delete webhook failed', { requestId });
    return serverError(requestId);
  }
}
