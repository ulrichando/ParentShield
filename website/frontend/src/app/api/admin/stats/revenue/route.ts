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
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const transactions = await prisma.transaction.findMany({
      where: {
        status: 'succeeded',
        createdAt: { gte: startDate },
      },
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const revenueByDate: Record<string, number> = {};

    // Initialize all dates with 0
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = date.toISOString().split('T')[0];
      revenueByDate[dateStr] = 0;
    }

    // Sum transactions by date
    transactions.forEach((txn) => {
      const dateStr = txn.createdAt.toISOString().split('T')[0];
      if (revenueByDate[dateStr] !== undefined) {
        revenueByDate[dateStr] += txn.amount / 100;
      }
    });

    const chartData = Object.entries(revenueByDate).map(([date, value]) => ({
      date,
      value,
    }));

    return success(chartData);
  } catch (err) {
    console.error('Get revenue stats error:', err);
    return serverError();
  }
}
