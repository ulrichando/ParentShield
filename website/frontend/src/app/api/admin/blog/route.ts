import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { unauthorized, forbidden } from '@/lib/api-response';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return unauthorized();
  if (user.role !== 'admin') return forbidden();

  return NextResponse.json({ posts: [] });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return unauthorized();
  if (user.role !== 'admin') return forbidden();

  return NextResponse.json({ error: 'Blog management not yet implemented' }, { status: 501 });
}
