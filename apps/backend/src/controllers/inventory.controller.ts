import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getInventory = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const products = await prisma.product.findMany({
      where: { businessId: user.businessId }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { name, sku, category, costPrice, sellingPrice, stockQuantity } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        sku,
        category,
        costPrice,
        sellingPrice,
        stockQuantity,
        businessId: user.businessId
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const id = req.params.id as string;
    const { name, sku, category, costPrice, sellingPrice, stockQuantity } = req.body;
    
    const product = await prisma.product.updateMany({
      where: { id, businessId: user.businessId },
      data: { name, sku, category, costPrice, sellingPrice, stockQuantity }
    });
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const id = req.params.id as string;
    
    await prisma.product.deleteMany({
      where: { id, businessId: user.businessId }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
