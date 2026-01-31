import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, forbidden, serverError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin') return forbidden();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');
    const search = searchParams.get('search') || '';

    const where = {
      role: 'customer' as const,
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          subscriptions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          transactions: {
            where: { status: 'succeeded' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.user.count({ where }),
    ]);

    const formattedCustomers = customers.map((customer) => ({
      user: {
        id: customer.id,
        email: customer.email,
        role: customer.role,
        is_active: customer.isActive,
        is_verified: customer.isVerified,
        first_name: customer.firstName,
        last_name: customer.lastName,
        created_at: customer.createdAt.toISOString(),
      },
      subscription: customer.subscriptions[0]
        ? {
            plan_name: customer.subscriptions[0].plan,
            status: customer.subscriptions[0].status,
          }
        : null,
      total_spent: customer.transactions.reduce((sum, t) => sum + t.amount, 0) / 100,
    }));

    return success({
      customers: formattedCustomers,
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
    });
  } catch (err) {
    console.error('Get customers error:', err);
    return serverError();
  }
}
