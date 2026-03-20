import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser, generateApiKey, hashToken } from '@/lib/auth';
import { success, unauthorized, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { APIKeyCreateSchema, parseBody } from '@/lib/schemas';

function formatKey(k: {
  id: string; name: string; prefix: string; scopes: string[];
  expiresAt: Date | null; lastUsed: Date | null; createdAt: Date; revokedAt: Date | null;
}) {
  return {
    id: k.id,
    name: k.name,
    prefix: k.prefix,
    scopes: k.scopes,
    expiresAt: k.expiresAt?.toISOString() ?? null,
    lastUsed: k.lastUsed?.toISOString() ?? null,
    createdAt: k.createdAt.toISOString(),
    revokedAt: k.revokedAt?.toISOString() ?? null,
  };
}

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const keys = await prisma.aPIKey.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return success(keys.map(formatKey));
  } catch (err) {
    logger.error('List API keys failed', { requestId });
    return serverError(requestId);
  }
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const body = await request.json().catch(() => null);
    const parsed = parseBody(APIKeyCreateSchema, body);
    if (!parsed.ok) return parsed.error;

    const { name, scopes, expiresAt } = parsed.data;
    const { key, prefix } = generateApiKey();
    const keyHash = hashToken(key);

    const created = await prisma.aPIKey.create({
      data: {
        userId: user.id,
        name,
        keyHash,
        prefix,
        scopes,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return success({ ...formatKey(created), key }, 201);
  } catch (err) {
    logger.error('Create API key failed', { requestId });
    return serverError(requestId);
  }
}
