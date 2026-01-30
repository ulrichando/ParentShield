import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, notFound, serverError } from '@/lib/api-response';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const { id } = await params;
    const body = await request.json();

    const alert = await prisma.alert.findFirst({
      where: { id, userId: user.id },
    });

    if (!alert) return notFound('Alert not found');

    const updated = await prisma.alert.update({
      where: { id },
      data: {
        isRead: body.isRead ?? alert.isRead,
        isDismissed: body.isDismissed ?? alert.isDismissed,
      },
    });

    return success(updated);
  } catch (err) {
    console.error('Update alert error:', err);
    return serverError();
  }
}
