import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, forbidden, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { PaginationSchema, parseQuery } from '@/lib/schemas';

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin') return forbidden();

    const { searchParams } = new URL(request.url);
    const pagination = parseQuery(PaginationSchema, {
      page: searchParams.get('page') ?? undefined,
      per_page: searchParams.get('per_page') ?? undefined,
    });
    if (pagination.error) return pagination.error;
    const { page, per_page: perPage } = pagination.data;
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
        isActive: customer.isActive,
        isVerified: customer.isVerified,
        firstName: customer.firstName,
        lastName: customer.lastName,
        createdAt: customer.createdAt.toISOString(),
      },
      subscription: customer.subscriptions[0]
        ? {
            plan: customer.subscriptions[0].plan,
            status: customer.subscriptions[0].status,
          }
        : null,
      totalSpent: customer.transactions.reduce((sum, t) => sum + t.amount, 0) / 100,
    }));

    return success({
      customers: formattedCustomers,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (err) {
    logger.error('Get customers failed', { requestId });
    return serverError(requestId);
  }
}
