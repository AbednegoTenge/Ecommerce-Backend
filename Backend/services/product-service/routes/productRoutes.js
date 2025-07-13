import express from 'express';
import productController from '../controllers/productController.js';
import productValidator from '../../../libs/validators/productValidator.js';
import validateRequest from '../../../libs/validators/validateRequest.js';
import authMiddleware from '../../../libs/auth/middleware.js';
import { upload } from '../../../libs/auth/multer.js';

const router = express.Router();

router.post('/api/add-products', authMiddleware, upload.single('image'), productValidator, validateRequest, productController.create);

export default router;