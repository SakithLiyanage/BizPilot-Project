import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) throw new Error('Unauthorized');

    const businessId = user.businessId;

    // Aggregate metrics for this business
    const [revenueAgg, ordersCount, customersCount] = await Promise.all([
      prisma.order.aggregate({
        where: { businessId },
        _sum: { totalAmount: true },
      }),
      prisma.order.count({
        where: { businessId },
      }),
      prisma.customer.count({
        where: { businessId },
      }),
    ]);

    const metrics = [
      { name: 'Total Revenue', value: `Rs. ${(revenueAgg._sum.totalAmount || 0).toLocaleString()}`, change: '+20.1% from last month', iconName: 'DollarSign' },
      { name: 'Total Orders', value: ordersCount.toString(), change: '+12% from last month', iconName: 'ShoppingCart' },
      { name: 'Active Customers', value: customersCount.toString(), change: '+15% from last month', iconName: 'Users' },
      { name: 'AI Conversion', value: '42%', change: '+5% optimization', iconName: 'TrendingUp' },
    ];

    res.json({ metrics });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
