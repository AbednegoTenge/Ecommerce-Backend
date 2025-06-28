import express from 'express';
import cartController from '../controllers/cartControllers.js';
import authMiddleware from '../../../libs/auth/middleware.js';

const router = express.Router();

router.get('/api/carts', authMiddleware, cartController.getCartItems);
router.post('/api/add-to-carts', authMiddleware, cartController.saveToCart);
router.delete('/api/carts/:id/remove', authMiddleware, cartController.removeFromCart);
router.put('/api/carts', authMiddleware, cartController.updateCart);

export default router;