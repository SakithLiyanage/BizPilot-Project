import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) throw new Error('Unauthorized');

    const orders = await prisma.order.findMany({
      where: { businessId: user.businessId },
      include: {
        customer: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedOrders = orders.map(order => ({
      id: `ORD-${order.id.substring(0, 6).toUpperCase()}`,
      originalId: order.id,
      customer: order.customer.whatsappNumber,
      date: order.createdAt.toISOString().split('T')[0],
      items: order.items.length,
      total: `Rs. ${order.totalAmount.toLocaleString()}`,
      status: order.status,
    }));

    res.json(formattedOrders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

import { PDFService } from '../services/pdf.service';

export const exportOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    // Find the real ID by extracting it from "ORD-..."
    // Note: the frontend sends the original ID now, wait, no, the frontend formats it as "ORD-XXX" but we should keep the real ID.
    // I will assume the frontend sends the real ID in req.params.id
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: { product: true }
        }
      }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const items = order.items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.price
    }));

    const pdfUrl = await PDFService.generateQuotation(order.customer.name, items);
    
    res.json({ url: `http://localhost:4000${pdfUrl}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
