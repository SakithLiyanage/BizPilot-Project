import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) throw new Error('Unauthorized');

    const customers = await prisma.customer.findMany({
      where: { businessId: user.businessId },
      include: {
        orders: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedCustomers = customers.map(customer => {
      const totalOrders = customer.orders.length;
      const totalSpent = customer.orders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      return {
        id: customer.id,
        phone: customer.whatsappNumber,
        name: customer.name,
        orders: totalOrders,
        totalSpent: `Rs. ${totalSpent.toLocaleString()}`,
        lastActive: customer.createdAt.toISOString().split('T')[0],
      };
    });

    res.json(formattedCustomers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
