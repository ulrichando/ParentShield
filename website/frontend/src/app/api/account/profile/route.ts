import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { success, error, unauthorized, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { ProfileUpdateSchema, parseBody } from '@/lib/schemas';

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    return success({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    });
  } catch (err) {
    logger.error('Get profile failed', { requestId, route: '/api/account/profile' });
    return serverError(requestId);
  }
}

export async function PUT(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const body = await request.json().catch(() => null);
    const parsed = parseBody(ProfileUpdateSchema, body);
    if (parsed.error) return parsed.error;
    const { firstName, lastName, currentPassword, newPassword } = parsed.data;

    const updateData: Record<string, unknown> = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;

    if (newPassword) {
      const isValid = await verifyPassword(currentPassword!, user.passwordHash);
      if (!isValid) {
        return error('Current password is incorrect');
      }
      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return success({
      id: updated.id,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
    });
  } catch (err) {
    logger.error('Update profile failed', { requestId, route: '/api/account/profile' });
    return serverError(requestId);
  }
}
