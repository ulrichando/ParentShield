import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { unauthorized, forbidden, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin') return forbidden();

    const transactions = await prisma.transaction.findMany({
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const header = 'Date,Customer Name,Email,Description,Amount,Currency,Status\n';
    const rows = transactions.map((txn) => {
      const name = [txn.user.firstName, txn.user.lastName].filter(Boolean).join(' ') || 'Unknown';
      const amount = (txn.amount / 100).toFixed(2);
      const date = txn.createdAt.toISOString().split('T')[0];
      const description = (txn.description || '').replace(/,/g, ';');
      return `${date},"${name}",${txn.user.email},"${description}",${amount},${txn.currency},${txn.status}`;
    });

    const csv = header + rows.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="transactions-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (err) {
    logger.error('Export transactions failed', { requestId });
    return serverError(requestId);
  }
}
