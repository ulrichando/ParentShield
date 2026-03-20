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
    const status = searchParams.get('status') || '';

    const where = {
      ...(status && { status }),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.transaction.count({ where }),
    ]);

    const formattedTransactions = transactions.map((txn) => ({
      id: txn.id,
      amount: txn.amount / 100,
      currency: txn.currency,
      status: txn.status,
      stripePaymentIntent: txn.stripePaymentIntent,
      stripeInvoiceId: txn.stripeInvoiceId,
      description: txn.description,
      createdAt: txn.createdAt.toISOString(),
      user: {
        id: txn.user.id,
        email: txn.user.email,
        name: [txn.user.firstName, txn.user.lastName].filter(Boolean).join(' ') || 'Unknown',
      },
    }));

    return success({
      transactions: formattedTransactions,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (err) {
    logger.error('Get transactions failed', { requestId });
    return serverError(requestId);
  }
}
