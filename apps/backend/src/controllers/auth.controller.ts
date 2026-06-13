import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { prisma } from '../utils/prisma';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, businessId } = req.body;
    const data = await AuthService.register(email, password, name, businessId);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.login(email, password);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { business: true }
    });
    if (!dbUser) return res.status(404).json({ error: 'User not found' });
    
    res.json({
      fullName: dbUser.name,
      email: dbUser.email,
      companyName: dbUser.business.name,
      whatsappNumber: dbUser.business.whatsappNumber
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { fullName, email, companyName, whatsappNumber } = req.body;
    
    await prisma.user.update({
      where: { id: user.id },
      data: { name: fullName, email }
    });
    
    await prisma.business.update({
      where: { id: user.businessId },
      data: { name: companyName, whatsappNumber }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
