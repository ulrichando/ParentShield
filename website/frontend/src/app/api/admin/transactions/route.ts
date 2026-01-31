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
      stripe_payment_intent: txn.stripePaymentIntent,
      stripe_invoice_id: txn.stripeInvoiceId,
      description: txn.description,
      created_at: txn.createdAt.toISOString(),
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
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
    });
  } catch (err) {
    console.error('Get transactions error:', err);
    return serverError();
  }
}
