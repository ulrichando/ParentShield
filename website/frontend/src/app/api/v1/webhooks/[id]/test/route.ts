import { NextRequest } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, notFound, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { id } = await params;
    const webhook = await prisma.webhook.findFirst({
      where: { id, userId: user.id },
    });
    if (!webhook) return notFound('Webhook not found');

    const payload = {
      event: 'test',
      timestamp: new Date().toISOString(),
      data: { message: 'This is a test webhook from ParentShield' },
    };
    const body = JSON.stringify(payload);
    const signature = crypto.createHmac('sha256', webhook.secret).update(body).digest('hex');

    let statusCode: number | null = null;
    let responseText: string | null = null;

    try {
      const res = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': `sha256=${signature}`,
          'X-Webhook-Event': 'test',
        },
        body,
        signal: AbortSignal.timeout(10_000),
      });
      statusCode = res.status;
      responseText = await res.text().catch(() => null);
    } catch (fetchErr) {
      return success({ success: false, error_message: String(fetchErr) });
    }

    await prisma.webhookDelivery.create({
      data: {
        webhookId: id,
        event: 'test',
        payload,
        statusCode,
        response: responseText,
        attempts: 1,
        deliveredAt: statusCode && statusCode < 300 ? new Date() : null,
      },
    });

    return success({
      success: statusCode !== null && statusCode < 300,
      statusCode,
      error_message: statusCode === null || statusCode >= 300 ? 'Webhook endpoint returned an error' : null,
    });
  } catch (err) {
    logger.error('Test webhook failed', { requestId });
    return serverError(requestId);
  }
}
