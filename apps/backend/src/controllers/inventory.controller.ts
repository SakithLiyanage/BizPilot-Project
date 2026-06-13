import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getInventory = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, sku, category, costPrice, sellingPrice, stockQuantity, businessId } = req.body;
    
    // In a real app businessId is from authenticated user session
    const product = await prisma.product.create({
      data: {
        name,
        sku,
        category,
        costPrice,
        sellingPrice,
        stockQuantity,
        businessId
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, sku, category, costPrice, sellingPrice, stockQuantity } = req.body;
    
    const product = await prisma.product.update({
      where: { id },
      data: { name, sku, category, costPrice, sellingPrice, stockQuantity }
    });
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    await prisma.product.delete({
      where: { id }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
