import { Router } from 'express';
import multer from 'multer';
import { handleWhatsAppWebhook } from '../controllers/webhook.controller';
import { getInventory, createProduct, updateProduct, deleteProduct } from '../controllers/inventory.controller';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller';
import { processOCR, businessAnalytics, voiceCommand } from '../controllers/ai.controller';
import { getDashboardMetrics } from '../controllers/dashboard.controller';
import { getOrders, exportOrder } from '../controllers/order.controller';
import { getCustomers } from '../controllers/customer.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Webhook for WhatsApp
router.post('/webhook/whatsapp', handleWhatsAppWebhook);

// Data Routes (Protected)
router.get('/dashboard', authenticateJWT, getDashboardMetrics);
router.get('/inventory', authenticateJWT, getInventory);
router.post('/inventory', authenticateJWT, createProduct);
router.put('/inventory/:id', authenticateJWT, updateProduct);
router.delete('/inventory/:id', authenticateJWT, deleteProduct);
router.get('/orders', authenticateJWT, getOrders);
router.get('/orders/:id/export', authenticateJWT, exportOrder);
router.get('/customers', authenticateJWT, getCustomers);

// Settings Routes
router.get('/settings/profile', authenticateJWT, getProfile);
router.put('/settings/profile', authenticateJWT, updateProfile);

// Advanced AI Routes (Protected)
router.post('/ai/ocr', authenticateJWT, upload.single('invoice'), processOCR);
router.post('/ai/analytics', authenticateJWT, businessAnalytics);
router.post('/ai/voice', authenticateJWT, voiceCommand);

export default router;
