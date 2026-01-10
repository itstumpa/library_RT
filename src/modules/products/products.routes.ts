// src/modules/products/products.routes.ts

import { Router } from 'express';
import productsController from './products.controller';

const router = Router();

// GET /api/products
router.get('/', productsController.getAll);

// GET /api/products/search?q=physics
router.get('/search', productsController.search);

// GET /api/products/category/:category
router.get('/category/:category', productsController.getByCategory);

export default router;