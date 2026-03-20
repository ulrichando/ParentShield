import { NextRequest } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { WebhookCreateSchema, parseBody } from '@/lib/schemas';

function formatWebhook(w: {
  id: string; url: string; events: string[]; isActive: boolean;
  createdAt: Date; updatedAt: Date; secret?: string;
}, includeSecret = false) {
  return {
    id: w.id,
    url: w.url,
    events: w.events,
    isActive: w.isActive,
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
    ...(includeSecret && { secret: w.secret }),
  };
}

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const webhooks = await prisma.webhook.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return success(webhooks.map((w) => formatWebhook(w)));
  } catch (err) {
    logger.error('List webhooks failed', { requestId });
    return serverError(requestId);
  }
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const body = await request.json().catch(() => null);
    const parsed = parseBody(WebhookCreateSchema, body);
    if (!parsed.ok) return parsed.error;

    const { url, events, description } = parsed.data;
    const secret = crypto.randomBytes(32).toString('hex');

    const webhook = await prisma.webhook.create({
      data: {
        userId: user.id,
        url,
        events,
        secret,
        isActive: true,
      },
    });

    // Return secret once — never again
    return success({ ...formatWebhook(webhook, true), description: description ?? null }, 201);
  } catch (err) {
    logger.error('Create webhook failed', { requestId });
    return serverError(requestId);
  }
}
