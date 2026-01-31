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

    const customers = await prisma.user.findMany({
      where: {
        role: 'customer',
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const customersByDate: Record<string, number> = {};

    // Initialize all dates with 0
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = date.toISOString().split('T')[0];
      customersByDate[dateStr] = 0;
    }

    // Count customers by date
    customers.forEach((cust) => {
      const dateStr = cust.createdAt.toISOString().split('T')[0];
      if (customersByDate[dateStr] !== undefined) {
        customersByDate[dateStr]++;
      }
    });

    const chartData = Object.entries(customersByDate).map(([date, value]) => ({
      date,
      value,
    }));

    return success(chartData);
  } catch (err) {
    console.error('Get customer stats error:', err);
    return serverError();
  }
}
