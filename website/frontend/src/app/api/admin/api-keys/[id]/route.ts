import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { unauthorized, forbidden, notFound } from '@/lib/api-response';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(request);
  if (!user) return unauthorized();
  if (user.role !== 'admin') return forbidden();

  return notFound();
}
